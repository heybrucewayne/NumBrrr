const CLIENT_SET = "numbrrr:push:clients";
const CLIENT_PREFIX = "numbrrr:push:client:";
const YEAR_SECONDS = 400 * 24 * 60 * 60;

function storeReady() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

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

function sameOrigin(req) {
  const origin = req.headers && req.headers.origin;
  const host = req.headers && (req.headers["x-forwarded-host"] || req.headers.host);
  if (!origin || !host) return true;
  try { return new URL(origin).host === String(host).split(",")[0].trim(); } catch (e) { return false; }
}

function cleanText(value, max = 100) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanClientId(value) {
  const id = cleanText(value, 100);
  return /^[a-zA-Z0-9_-]{8,100}$/.test(id) ? id : "";
}

function sanitizeSubscription(value) {
  if (!value || typeof value !== "object") return null;
  const endpoint = cleanText(value.endpoint, 2048);
  const keys = value.keys && typeof value.keys === "object" ? value.keys : {};
  const p256dh = cleanText(keys.p256dh, 512);
  const auth = cleanText(keys.auth, 256);
  if (!endpoint.startsWith("https://") || !p256dh || !auth) return null;
  return { endpoint, expirationTime: Number.isFinite(value.expirationTime) ? value.expirationTime : null, keys: { p256dh, auth } };
}

function sanitizeBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const clientId = cleanClientId(body.clientId);
  const subscription = sanitizeSubscription(body.subscription);
  if (!clientId || !subscription) return null;
  const supportedTypes = new Set(["crypto", "gold", "goldoz", "usstock", "bist", "fiat"]);
  const priceAlerts = (Array.isArray(body.priceAlerts) ? body.priceAlerts : []).slice(0, 100).map((alert) => ({
    id: cleanText(alert && alert.id, 80),
    type: cleanText(alert && alert.type, 20),
    key: cleanText(alert && alert.key, 120),
    name: cleanText(alert && alert.name, 120),
    sym: cleanText(alert && alert.sym, 30),
    condition: alert && ["below", "percent_up", "percent_down"].includes(alert.condition) ? alert.condition : "above",
    target: Number(alert && alert.target),
    percentage: Number(alert && alert.percentage),
    referencePrice: Number(alert && alert.referencePrice),
    ccy: alert && alert.ccy === "TRY" ? "TRY" : "USD",
  })).filter((alert) => alert.id && supportedTypes.has(alert.type) && alert.key && ((Number.isFinite(alert.target) && alert.target > 0) || (["percent_up", "percent_down"].includes(alert.condition) && Number.isFinite(alert.percentage) && alert.percentage > 0 && Number.isFinite(alert.referencePrice) && alert.referencePrice > 0)));
  const vehicles = (Array.isArray(body.vehicles) ? body.vehicles : []).slice(0, 30).map((vehicle) => ({
    id: cleanText(vehicle && vehicle.id, 80),
    plate: cleanText(vehicle && vehicle.plate, 80),
    sched: (Array.isArray(vehicle && vehicle.sched) ? vehicle.sched : []).slice(0, 100).map((item) => ({
      id: cleanText(item && item.id, 80), label: cleanText(item && item.label, 100), date: cleanText(item && item.date, 10),
    })).filter((item) => item.id && /^\d{4}-\d{2}-\d{2}$/.test(item.date)),
  })).filter((vehicle) => vehicle.id);
  return {
    version: 1,
    clientId,
    subscription,
    lang: body.lang === "tr" ? "tr" : "en",
    currency: body.currency === "TRY" ? "TRY" : "USD",
    vehicleDays: Math.max(0, Math.min(30, Math.round(Number(body.vehicleDays) || 0))),
    priceAlerts,
    vehicles,
    updatedAt: new Date().toISOString(),
  };
}

module.exports = async (req, res) => {
  if (!sameOrigin(req)) { res.status(403).json({ error: "origin not allowed" }); return; }
  if (!storeReady()) { res.status(503).json({ error: "push store not configured" }); return; }
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "DELETE") {
      const clientId = cleanClientId(req.body && req.body.clientId);
      if (!clientId) { res.status(400).json({ error: "invalid client" }); return; }
      await Promise.all([redis(["DEL", CLIENT_PREFIX + clientId]), redis(["SREM", CLIENT_SET, clientId])]);
      res.status(200).json({ ok: true });
      return;
    }
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST, DELETE");
      res.status(405).json({ error: "method not allowed" });
      return;
    }
    const contentLength = Number(req.headers && req.headers["content-length"] || 0);
    if (contentLength > 200000) { res.status(413).json({ error: "payload too large" }); return; }
    const record = sanitizeBody(req.body);
    if (!record) { res.status(400).json({ error: "invalid subscription" }); return; }
    const key = CLIENT_PREFIX + record.clientId;
    const previousRaw = await redis(["GET", key]);
    if (previousRaw) {
      try {
        const previous = JSON.parse(previousRaw);
        if (previous && previous.serverState) record.serverState = previous.serverState;
      } catch (e) {}
    }
    if (!record.serverState) record.serverState = { price: {}, vehicle: {} };
    await Promise.all([
      redis(["SET", key, JSON.stringify(record), "EX", YEAR_SECONDS]),
      redis(["SADD", CLIENT_SET, record.clientId]),
    ]);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(502).json({ error: "push store failed" });
  }
};

module.exports.sanitizeBody = sanitizeBody;
module.exports.sameOrigin = sameOrigin;
