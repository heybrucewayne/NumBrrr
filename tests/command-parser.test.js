const test = require("node:test");
const assert = require("node:assert/strict");
const { parseCommand, normalizeText, resolveRelativeDate } = require("../command-parser.js");

const assets = [
  { type: "crypto", key: "solana", sym: "SOL", name: "Solana", aliases: ["sol"] },
  { type: "crypto", key: "bitcoin", sym: "BTC", name: "Bitcoin", aliases: ["bitcoin"] },
  { type: "crypto", key: "ethereum", sym: "ETH", name: "Ethereum", aliases: ["ethereum"] },
  { type: "crypto", key: "usd-coin", sym: "USDC", name: "USD Coin", aliases: ["usd coin"] },
  { type: "fiat", key: "usd", sym: "USD", name: "US Dollar", aliases: ["dolar"] },
];

function parse(text) { return parseCommand(text, { assets, referenceDate: new Date("2026-08-13T12:00:00") }); }

test("normalizer accepts Turkish omissions, punctuation, and compact quantities", () => {
  assert.equal(normalizeText("100SOL'u  satın ALDIM!"), "100 solu satın aldım");
});

test("buy synonyms produce the same intent and quantity", () => {
  ["100 SOL aldım", "100 sol aldim", "100 SOL satın aldım", "100 SOL portföye ekledim", "100 SOL portföye attım", "100 SOL topladım"].forEach((text) => {
    const result = parse(text);
    assert.equal(result.intent, "BUY", text);
    assert.equal(result.asset, "SOL", text);
    assert.equal(result.amount, 100, text);
    assert.ok(result.confidence >= 0.7, text);
  });
});

test("fiat amount, explicit price, half quantity, and relative date are extracted", () => {
  assert.equal(parse("500 dolarlık ETH aldım").fiatAmount, 500);
  const priced = parse("20 SOL 150 dolardan aldım");
  assert.equal(priced.amount, 20);
  assert.equal(priced.price, 150);
  assert.equal(parse("yarım BTC sattım").amount, 0.5);
  const dated = parse("3 gün önce 20 SOL 145 dolardan aldım");
  assert.equal(dated.date, "2026-08-10");
  assert.equal(dated.amount, 20);
  const explicitDated = parse("2026-08-10 20 SOL aldım");
  assert.equal(explicitDated.date, "2026-08-10");
  assert.equal(explicitDated.amount, 20);
});

test("sell and swap commands understand Turkish suffixes", () => {
  const sell = parse("500 USDC bozdum");
  assert.equal(sell.intent, "SELL");
  assert.equal(sell.asset, "USDC");
  assert.equal(sell.amount, 500);
  const swap = parse("20 SOL'u USDC'ye çevirdim");
  assert.equal(swap.intent, "SWAP");
  assert.equal(swap.asset, "SOL");
  assert.equal(swap.targetAsset, "USDC");
  assert.equal(swap.amount, 20);
});

test("alerts distinguish absolute and percentage conditions", () => {
  const above = parse("SOL 200 olunca haber ver");
  assert.equal(above.intent, "CREATE_ALERT");
  assert.equal(above.condition, "ABOVE");
  assert.equal(above.price, 200);
  const below = parse("SOL 100 dolara düşerse bildir");
  assert.equal(below.condition, "BELOW");
  assert.equal(below.price, 100);
  const percent = parse("BTC %10 yükselirse haber ver");
  assert.equal(percent.condition, "PERCENT_UP");
  assert.equal(percent.percentage, 10);
});

test("navigation, favorites, currency, and portfolio queries are classified", () => {
  assert.equal(parse("SOL grafiğini aç").intent, "OPEN_ASSET");
  assert.equal(parse("ETH'i favorilere ekle").intent, "ADD_FAVORITE");
  assert.equal(parse("ana para birimini TL yap").baseCurrency, "TRY");
  assert.equal(parse("ortalama SOL maliyetim ne").query, "AVERAGE_COST");
  assert.equal(parse("bu ay ne kadar kazandım").query, "PNL");
  assert.equal(parse("portföyümün yüzde kaçı BTC").query, "ALLOCATION");
  assert.equal(parse("en çok kazandıran varlığımı göster").query, "TOP_PERFORMER");
  assert.equal(parse("portföyümü göster").intent, "PORTFOLIO_QUERY");
  assert.equal(parse("portföyümü göster").query, "PORTFOLIO_SUMMARY");
});

test("app data commands extract labels, amounts, and dates", () => {
  const expense = parse("gider ekle market 500");
  assert.equal(expense.intent, "ADD_EXPENSE");
  assert.equal(expense.label, "market");
  assert.equal(expense.amount, 500);

  const income = parse("gelir ekle maaş 50000");
  assert.equal(income.intent, "ADD_INCOME");
  assert.equal(income.label, "maas");
  assert.equal(income.amount, 50000);

  const goal = parse("hedef ekle araba 1000000");
  assert.equal(goal.intent, "ADD_GOAL");
  assert.equal(goal.label, "araba");
  assert.equal(goal.amount, 1000000);

  const note = parse("not ekle bankayı ara");
  assert.equal(note.intent, "ADD_NOTE");
  assert.equal(note.label, "bankayi ara");

  const countdown = parse("geri sayım tatil 2026-12-20");
  assert.equal(countdown.intent, "ADD_COUNTDOWN");
  assert.equal(countdown.label, "tatil");
  assert.equal(countdown.date, "2026-12-20");
});

test("app queries, navigation, and monthly expenses are classified", () => {
  assert.equal(parse("giderlerimi göster").query, "EXPENSES");
  assert.equal(parse("gelirimi göster").query, "INCOME");
  assert.equal(parse("bakiyemi göster").query, "BALANCE");
  assert.equal(parse("giderlere git").page, "savings");
  assert.equal(parse("gelir sayfasını aç").page, "income");
  const monthly = parse("aylık giderim 50000");
  assert.equal(monthly.intent, "SET_MONTHLY_EXPENSES");
  assert.equal(monthly.amount, 50000);
  assert.equal(parse("Set monthly expenses to 5000").intent, "SET_MONTHLY_EXPENSES");
});

test("command help requests are classified without an asset or trade action", () => {
  ["bütün komutlar", "komutlar", "komut listesi", "hangi komutlar var", "show all commands"].forEach((text) => {
    const result = parse(text);
    assert.equal(result.intent, "COMMAND_HELP", text);
    assert.ok(result.confidence >= 0.7, text);
    assert.deepEqual(result.missing, [], text);
  });
});

test("English command synonyms remain usable", () => {
  assert.equal(parse("Buy 100 SOL").intent, "BUY");
  assert.equal(parse("Sell 20 SOL").intent, "SELL");
  assert.equal(parse("Open SOL chart").intent, "OPEN_ASSET");
  assert.equal(parse("Add ETH to favorites").intent, "ADD_FAVORITE");
  assert.equal(parse("Show my portfolio").intent, "PORTFOLIO_QUERY");
});

test("balance commands remain distinct from asset trades", () => {
  assert.equal(parse("100 USD bakiye ekle").intent, "ADD_BALANCE");
  assert.equal(parse("50 USD bakiyeden çıkar").intent, "REMOVE_BALANCE");
  assert.equal(parse("100 USD aldım").intent, "BUY");
});

test("an amount without an action stays unknown and low confidence", () => {
  const result = parse("100 SOL");
  assert.equal(result.intent, "UNKNOWN");
  assert.ok(result.confidence < 0.7);
  assert.deepEqual(result.missing, []);
});

test("relative weekdays resolve against a supplied date", () => {
  assert.equal(resolveRelativeDate("geçen cuma", new Date("2026-08-13T12:00:00")), "2026-08-07");
  assert.equal(resolveRelativeDate("3 gün önce", new Date("2026-08-13T12:00:00")), "2026-08-10");
});
