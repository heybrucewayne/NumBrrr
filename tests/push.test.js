const test = require("node:test");
const assert = require("node:assert/strict");
const { sanitizeBody, sameOrigin } = require("../api/push-subscription");
const { dayDifference, localDateKey, messages } = require("../api/push-cron");

function validBody() {
  return {
    clientId: "123e4567-e89b-12d3-a456-426614174000",
    subscription: { endpoint: "https://push.example.test/abc", keys: { p256dh: "key", auth: "auth" } },
    lang: "tr",
    currency: "TRY",
    vehicleDays: 7,
    priceAlerts: [{ id: "pa1", type: "bist", key: "THYAO", name: "Türk Hava Yolları", condition: "above", target: 500, ccy: "TRY" }],
    vehicles: [{ id: "v1", plate: "34 ABC 123", sched: [{ id: "s1", label: "Bakım", date: "2026-07-20" }] }],
  };
}

test("push subscription payload is bounded and sanitized", () => {
  const value = sanitizeBody(validBody());
  assert.equal(value.lang, "tr");
  assert.equal(value.priceAlerts[0].key, "THYAO");
  assert.equal(value.vehicles[0].sched[0].date, "2026-07-20");
  assert.equal(value.vehicleDays, 7);
});

test("invalid push endpoints and alert values are rejected", () => {
  const badEndpoint = validBody();
  badEndpoint.subscription.endpoint = "http://insecure.test";
  assert.equal(sanitizeBody(badEndpoint), null);
  const badAlert = validBody();
  badAlert.priceAlerts[0].target = -1;
  assert.equal(sanitizeBody(badAlert).priceAlerts.length, 0);
});

test("percentage and fiat alerts are retained for background checks", () => {
  const body = validBody();
  body.priceAlerts = [{ id: "pa2", type: "crypto", key: "solana", name: "Solana", condition: "percent_up", target: 0, percentage: 10, referencePrice: 150, ccy: "USD" }, { id: "pa3", type: "fiat", key: "usd", name: "US Dollar", condition: "above", target: 50, ccy: "USD" }];
  const value = sanitizeBody(body);
  assert.equal(value.priceAlerts.length, 2);
  assert.equal(value.priceAlerts[0].percentage, 10);
  assert.equal(value.priceAlerts[1].type, "fiat");
});

test("push endpoint enforces same-origin browser writes", () => {
  assert.equal(sameOrigin({ headers: { origin: "https://numbrrr.vercel.app", host: "numbrrr.vercel.app" } }), true);
  assert.equal(sameOrigin({ headers: { origin: "https://evil.example", host: "numbrrr.vercel.app" } }), false);
});

test("maintenance day calculations and localized messages are stable", () => {
  assert.equal(localDateKey(new Date("2026-07-12T22:30:00Z")), "2026-07-13");
  assert.equal(dayDifference("2026-07-20", "2026-07-13"), 7);
  assert.equal(dayDifference("2026-07-11", "2026-07-13"), -2);
  assert.match(messages("tr").vehicleBody("Aracın", "Bakım", -2), /2 gün gecikti/);
});
