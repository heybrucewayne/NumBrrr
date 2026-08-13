const CLIENT_SET = "numbrrr:push:clients";
const CLIENT_PREFIX = "numbrrr:push:client:";
const YEAR_SECONDS = 400 * 24 * 60 * 60;
const GRAMS_PER_OZ = 31.1034768;

async function redis(command) {
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`redis ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

function localDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function dayDifference(date, today = localDateKey()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{4}-\d{2}-\d{2}$/.test(today)) return null;
  return Math.round((Date.parse(date + "T00:00:00Z") - Date.parse(today + "T00:00:00Z")) / 86400000);
}

function formatPrice(value, ccy, lang) {
  return new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "en-US", {
    style: "currency", currency: ccy === "TRY" ? "TRY" : "USD", maximumFractionDigits: value < 10 ? 4 : 2,
  }).format(value);
}

function messages(lang) {
  if (lang === "tr") return {
    priceTitle: "Fiyat alarmı",
    priceBody: (name, price, target, condition) => `${name} şu anda ${price} (${target} ${condition === "below" ? "altına düştü" : condition === "percent_down" ? "düştü" : condition === "percent_up" ? "yükseldi" : "üzerine çıktı"}).`,
    vehicleTitle: "Araç hatırlatması",
    vehicleBody: (vehicle, label, days) => `${vehicle}: ${label} ${days < 0 ? `${Math.abs(days)} gün gecikti` : days === 0 ? "bugün yapılmalı" : `${days} gün içinde yapılmalı`}.`,
  };
  return {
    priceTitle: "Price alert",
    priceBody: (name, price, target, condition) => `${name} is now ${price} (${condition === "below" ? "below" : condition === "percent_down" ? "down" : condition === "percent_up" ? "up" : "above"} ${target}).`,
    vehicleTitle: "Vehicle reminder",
    vehicleBody: (vehicle, label, days) => `${vehicle}: ${label} ${days < 0 ? `is ${Math.abs(days)} days overdue` : days === 0 ? "is due today" : `is due in ${days} days`}.`,
  };
}

async function fetchJson(url, timeout = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; NumBrrr/1.0)" }, signal: controller.signal });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) { return null; }
  finally { clearTimeout(timer); }
}

async function yahooPrice(symbol) {
  const json = await fetchJson(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`);
  const result = json && json.chart && json.chart.result && json.chart.result[0];
  const meta = result && result.meta;
  const closes = (result && result.indicators && result.indicators.quote && result.indicators.quote[0] && result.indicators.quote[0].close) || [];
  const valid = closes.filter((value) => Number.isFinite(value));
  const price = meta && Number.isFinite(meta.regularMarketPrice) ? meta.regularMarketPrice : valid[valid.length - 1];
  return Number.isFinite(price) ? price : null;
}

async function mapLimit(items, limit, fn) {
  const result = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      result[index] = await fn(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return result;
}

function alertPriceKey(alert) { return `${alert.type}|${alert.key}|${alert.ccy}`; }

async function loadAlertPrices(alerts) {
  const prices = new Map();
  const cryptoIds = [...new Set(alerts.filter((alert) => alert.type === "crypto").map((alert) => alert.key))];
  const needsGold = alerts.some((alert) => alert.type === "gold" || alert.type === "goldoz");
  const ids = [...cryptoIds];
  if (needsGold) ids.push("pax-gold");
  if (ids.length) {
    const data = await fetchJson(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids.join(","))}&vs_currencies=usd,try`);
    if (data) alerts.forEach((alert) => {
      if (alert.type === "crypto") {
        const value = data[alert.key] && data[alert.key][alert.ccy.toLowerCase()];
        if (Number.isFinite(value)) prices.set(alertPriceKey(alert), value);
      } else if (alert.type === "gold" || alert.type === "goldoz") {
        const ounce = data["pax-gold"] && data["pax-gold"][alert.ccy.toLowerCase()];
        if (Number.isFinite(ounce)) prices.set(alertPriceKey(alert), alert.type === "gold" ? ounce / GRAMS_PER_OZ : ounce);
      }
    });
  }

  const stockJobs = [...new Map(alerts.filter((alert) => alert.type === "usstock" || alert.type === "bist").map((alert) => {
    const symbol = alert.type === "bist" ? `${alert.key}.IS` : alert.key;
    return [symbol, { symbol, nativeCcy: alert.type === "bist" ? "TRY" : "USD" }];
  })).values()];
  const needsFx = alerts.some((alert) => alert.type === "fiat" || (alert.type === "usstock" && alert.ccy === "TRY") || (alert.type === "bist" && alert.ccy === "USD"));
  const [stockValues, usdTry] = await Promise.all([
    mapLimit(stockJobs, 6, async (job) => ({ ...job, price: await yahooPrice(job.symbol) })),
    needsFx ? yahooPrice("TRY=X") : Promise.resolve(null),
  ]);
  const stockMap = new Map(stockValues.filter((item) => Number.isFinite(item.price)).map((item) => [item.symbol, item]));
  alerts.forEach((alert) => {
    if (alert.type === "fiat") {
      if (!Number.isFinite(usdTry) || usdTry <= 0) return;
      prices.set(alertPriceKey(alert), alert.key === "usd" ? (alert.ccy === "TRY" ? usdTry : 1) : (alert.ccy === "USD" ? 1 / usdTry : 1));
      return;
    }
    if (alert.type !== "usstock" && alert.type !== "bist") return;
    const symbol = alert.type === "bist" ? `${alert.key}.IS` : alert.key;
    const item = stockMap.get(symbol);
    if (!item) return;
    let value = item.price;
    if (item.nativeCcy !== alert.ccy) {
      if (!Number.isFinite(usdTry) || usdTry <= 0) return;
      value = item.nativeCcy === "USD" ? value * usdTry : value / usdTry;
    }
    prices.set(alertPriceKey(alert), value);
  });
  return prices;
}

async function removeClient(clientId) {
  await Promise.all([redis(["DEL", CLIENT_PREFIX + clientId]), redis(["SREM", CLIENT_SET, clientId])]);
}

async function runCron(webpush) {
  const ids = (await redis(["SMEMBERS", CLIENT_SET]) || []).slice(0, 500);
  const records = [];
  for (const id of ids) {
    const raw = await redis(["GET", CLIENT_PREFIX + id]);
    if (!raw) { await redis(["SREM", CLIENT_SET, id]); continue; }
    try { const record = JSON.parse(raw); if (record && record.subscription) records.push(record); }
    catch (error) { await removeClient(id); }
  }
  const allAlerts = records.flatMap((record) => record.priceAlerts || []);
  const prices = await loadAlertPrices(allAlerts);
  const today = localDateKey();
  let sent = 0, removed = 0, failed = 0;

  for (const record of records) {
    const msg = messages(record.lang);
    const serverState = record.serverState && typeof record.serverState === "object" ? record.serverState : { price: {}, vehicle: {} };
    serverState.price = serverState.price && typeof serverState.price === "object" ? serverState.price : {};
    serverState.vehicle = serverState.vehicle && typeof serverState.vehicle === "object" ? serverState.vehicle : {};
    const notifications = [];
    const activeAlertIds = new Set();
    (record.priceAlerts || []).forEach((alert) => {
      activeAlertIds.add(alert.id);
      const value = prices.get(alertPriceKey(alert));
      if (!Number.isFinite(value)) return;
      const change = alert.referencePrice > 0 ? ((value / alert.referencePrice) - 1) * 100 : 0;
      const hit = alert.condition === "percent_down" ? change <= -(alert.percentage || 0)
        : alert.condition === "percent_up" ? change >= (alert.percentage || 0)
        : alert.condition === "below" ? value <= alert.target : value >= alert.target;
      if (hit && !serverState.price[alert.id]) {
        const target = alert.condition === "percent_down" || alert.condition === "percent_up" ? `${alert.percentage}%` : formatPrice(alert.target, alert.ccy, record.lang);
        notifications.push({
          title: msg.priceTitle,
          body: msg.priceBody(alert.name || alert.sym || alert.key, formatPrice(value, alert.ccy, record.lang), target, alert.condition),
          tag: `numbrrr-price-${alert.id}`,
          url: "/?notification=price",
        });
        serverState.price[alert.id] = true;
      } else if (!hit) serverState.price[alert.id] = false;
    });
    Object.keys(serverState.price).forEach((id) => { if (!activeAlertIds.has(id)) delete serverState.price[id]; });

    const activeVehicleIds = new Set();
    (record.vehicles || []).forEach((vehicle) => (vehicle.sched || []).forEach((item) => {
      const id = `${vehicle.id}-${item.id}`;
      activeVehicleIds.add(id);
      const days = dayDifference(item.date, today);
      if (days == null || days > record.vehicleDays || serverState.vehicle[id] === today) return;
      notifications.push({
        title: msg.vehicleTitle,
        body: msg.vehicleBody(vehicle.plate || (record.lang === "tr" ? "Aracın" : "Your vehicle"), item.label || (record.lang === "tr" ? "bakım" : "maintenance"), days),
        tag: `numbrrr-vehicle-${id}`,
        url: "/?notification=vehicle",
      });
      serverState.vehicle[id] = today;
    }));
    Object.keys(serverState.vehicle).forEach((id) => { if (!activeVehicleIds.has(id)) delete serverState.vehicle[id]; });
    record.serverState = serverState;

    let invalidSubscription = false;
    for (const notification of notifications.slice(0, 8)) {
      try {
        await webpush.sendNotification(record.subscription, JSON.stringify(notification), { TTL: 60 * 60 * 12, urgency: "normal" });
        sent++;
      } catch (error) {
        if (error && (error.statusCode === 404 || error.statusCode === 410)) { invalidSubscription = true; break; }
        failed++;
      }
    }
    if (invalidSubscription) { await removeClient(record.clientId); removed++; continue; }
    await redis(["SET", CLIENT_PREFIX + record.clientId, JSON.stringify(record), "EX", YEAR_SECONDS]);
  }
  return { clients: records.length, alerts: allAlerts.length, sent, removed, failed, date: today };
}

module.exports = async (req, res) => {
  if (req.method && req.method !== "GET") { res.status(405).json({ error: "method not allowed" }); return; }
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  if (!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)) {
    res.status(503).json({ error: "background notifications not configured" });
    return;
  }
  try {
    const webpush = require("web-push");
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:noreply@numbrrr.app", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
    const summary = await runCron(webpush);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ ok: true, ...summary });
  } catch (error) {
    res.status(500).json({ error: "background notification run failed" });
  }
};

module.exports.dayDifference = dayDifference;
module.exports.localDateKey = localDateKey;
module.exports.loadAlertPrices = loadAlertPrices;
module.exports.messages = messages;
