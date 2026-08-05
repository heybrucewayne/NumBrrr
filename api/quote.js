// Vercel serverless function (zero-config): server-side stock/FX quote via Yahoo Finance.
// Avoids the CORS / rate-limit issues of public browser proxies. Runs only on Vercel.
// ?symbol=AAPL            -> { price, currency } (fast, 1-day range)
// ?symbol=AAPL&range=1y   -> also { chg24, chg1mo, chg1y } performance (%)
module.exports = async (req, res) => {
  const symbol = req.query && req.query.symbol ? String(req.query.symbol).trim() : "";
  const requestedRange = req.query && req.query.range ? String(req.query.range) : "1d";
  const range = requestedRange === "1y" ? "1y" : "1d";
  if (!symbol) {
    res.status(400).json({ error: "symbol required" });
    return;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=${encodeURIComponent(range)}`;
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; NumBrrr/1.0)" }, signal: controller.signal });
    if (!r.ok) {
      res.status(502).json({ error: "upstream failed", status: r.status });
      return;
    }
    const j = await r.json();
    const result = j && j.chart && j.chart.result && j.chart.result[0];
    const meta = result && result.meta;
    const closes = (result && result.indicators && result.indicators.quote && result.indicators.quote[0] && result.indicators.quote[0].close) || [];
    const valid = closes.filter((c) => typeof c === "number");
    const price = meta && typeof meta.regularMarketPrice === "number" ? meta.regularMarketPrice : (valid.length ? valid[valid.length - 1] : null);
    if (typeof price !== "number" || !Number.isFinite(price)) {
      res.status(404).json({ error: "quote unavailable" });
      return;
    }
    // previous *daily* close (yesterday) for the 24h move — chartPreviousClose is ~1y ago on a 1y range
    const prev = valid.length >= 2 ? valid[valid.length - 2] : (meta && (meta.chartPreviousClose || meta.previousClose));
    const pct = (a, b) => (a != null && b ? (a / b - 1) * 100 : null);
    const isFx = ["TRY=X", "EURTRY=X"].includes(symbol.toUpperCase());
    res.setHeader(
      "Cache-Control",
      isFx ? "s-maxage=300, stale-while-revalidate=900" : "s-maxage=3600, stale-while-revalidate=86400"
    );
    res.status(200).json({
      price,
      currency: meta ? meta.currency : null,
      chg24: pct(price, prev),
      chg1mo: valid.length > 22 ? pct(price, valid[valid.length - 22]) : null,
      chg1y: valid.length ? pct(price, valid[0]) : null,
      spark: valid.slice(-8), // last ~7 daily closes for the watchlist trend line
    });
  } catch (e) {
    res.status(502).json({ error: "fetch failed" });
  } finally {
    clearTimeout(timer);
  }
};
