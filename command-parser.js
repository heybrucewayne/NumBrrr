/*
 * NumBrrr Smart Command parser
 *
 * The parser deliberately has no knowledge of the application's asset list.
 * The browser passes the currently supported assets to parseCommand(), which
 * keeps this module deterministic, small, and straightforward to unit test.
 */
(function attachCommandParser(root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.NumBrrrCommandParser = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function createCommandParser() {
  const INTENTS = [
    "BUY", "SELL", "SWAP", "ADD_BALANCE", "REMOVE_BALANCE", "CREATE_ALERT",
    "OPEN_ASSET", "ADD_FAVORITE", "REMOVE_FAVORITE", "CHANGE_BASE_CURRENCY",
    "PORTFOLIO_QUERY", "APP_QUERY", "NAVIGATE", "SET_MONTHLY_EXPENSES",
    "ADD_EXPENSE", "ADD_INCOME", "ADD_NOTE", "ADD_GOAL", "ADD_COUNTDOWN",
    "COMMAND_HELP", "UNKNOWN",
  ];

  const BUY_WORDS = ["aldim", "satin aldim", "ekledim", "portfoye ekledim", "portfoye attim", "girdim", "topladim", "koydum", "al", "buy", "bought", "purchase", "purchased", "add to portfolio", "added to portfolio"];
  const SELL_WORDS = ["sattim", "bozdum", "cikardim", "elden cikardim", "portfoyden cikardim", "sat", "sell", "sold", "remove from portfolio"];
  const SWAP_WORDS = ["cevirdim", "cevir", "degistirdim", "takas", "swap", "convert", "converted"];
  const ALERT_WORDS = ["haber ver", "bildir", "uyar", "alarm kur", "alarm", "alert me", "notify me"];
  const OPEN_WORDS = ["ac", "goster", "sayfasina git", "grafik", "grafik ac", "open", "show", "chart"];
  const HELP_WORDS = ["butun komutlar", "tum komutlar", "komutlar", "komut listesi", "yardim", "help", "neler yapabilirim", "ne yapabilirsin", "hangi komutlar", "all commands", "available commands", "show commands", "what can i do", "what can you do"];

  function fold(value) {
    return String(value == null ? "" : value)
      .toLocaleLowerCase("tr-TR")
      .replace(/ı/g, "i")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ç/g, "c")
      .replace(/ö/g, "o").replace(/ü/g, "u")
      .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u");
  }

  function normalizeText(value) {
    let text = String(value == null ? "" : value).trim().toLocaleLowerCase("tr-TR");
    text = text.replace(/[₺]/g, " tl ").replace(/[$€]/g, " usd ").replace(/[’']/g, "");
    // Accept compact forms such as 100SOL and SOL100.
    text = text.replace(/(\d)(?=[a-zçğıöşü])/gi, "$1 ").replace(/([a-zçğıöşü])(?=\d)/gi, "$1 ");
    text = text.replace(/\s+/g, " ");
    text = text.replace(/[^\p{L}\p{N}%.,\s-]/gu, " ");
    return text.replace(/\s+/g, " ").trim();
  }

  function normalized(value) { return fold(normalizeText(value)); }
  function escapeRegExp(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function levenshtein(a, b) {
    const left = String(a), right = String(b);
    if (left === right) return 0;
    if (!left.length) return right.length;
    if (!right.length) return left.length;
    let prev = Array.from({ length: right.length + 1 }, (_, i) => i);
    for (let i = 0; i < left.length; i += 1) {
      const next = [i + 1];
      for (let j = 0; j < right.length; j += 1) {
        next.push(Math.min(
          next[j] + 1,
          prev[j + 1] + 1,
          prev[j] + (left[i] === right[j] ? 0 : 1),
        ));
      }
      prev = next;
    }
    return prev[right.length];
  }

  function fuzzyScore(a, b) {
    const left = normalized(a), right = normalized(b);
    if (!left || !right) return 0;
    return 1 - levenshtein(left, right) / Math.max(left.length, right.length);
  }

  function parseNumber(value) {
    let text = String(value == null ? "" : value).replace(/\s/g, "");
    if (text.includes(",") && text.includes(".")) {
      text = text.lastIndexOf(",") > text.lastIndexOf(".")
        ? text.replace(/\./g, "").replace(",", ".")
        : text.replace(/,/g, "");
    } else if (text.includes(",")) {
      const parts = text.split(",");
      text = parts[parts.length - 1].length <= 2 ? text.replace(",", ".") : text.replace(/,/g, "");
    } else if ((text.match(/\./g) || []).length > 1) text = text.replace(/\./g, "");
    const number = Number(text.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(number) ? number : null;
  }

  function dateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function resolveRelativeDate(text, referenceDate) {
    const source = normalized(text);
    const date = new Date(referenceDate || new Date());
    date.setHours(0, 0, 0, 0);
    if (/\b(dun|onceki gun)\b/.test(source)) date.setDate(date.getDate() - 1);
    else {
      const daysAgo = source.match(/\b(\d+)\s+gun\s+once\b/);
      if (daysAgo) date.setDate(date.getDate() - Number(daysAgo[1]));
      else if (/\b(gecen|onceki)\s+(pazartesi|sali|carsamba|persembe|cuma|cumartesi|pazar)\b/.test(source)) {
        const names = ["pazar", "pazartesi", "sali", "carsamba", "persembe", "cuma", "cumartesi"];
        const match = source.match(/\b(?:gecen|onceki)\s+(pazartesi|sali|carsamba|persembe|cuma|cumartesi|pazar)\b/);
        const wanted = names.indexOf(match[1]);
        let distance = (date.getDay() - wanted + 7) % 7;
        if (distance === 0) distance = 7;
        date.setDate(date.getDate() - distance);
      }
    }
    return dateKey(date);
  }

  function detectDate(text, referenceDate) {
    const source = normalized(text);
    const explicit = source.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
    if (explicit) return `${explicit[1]}-${String(explicit[2]).padStart(2, "0")}-${String(explicit[3]).padStart(2, "0")}`;
    if (/\b(bugun|dun|onceki gun|\d+ gun once|gecen (pazartesi|sali|carsamba|persembe|cuma|cumartesi|pazar))\b/.test(source)) {
      return resolveRelativeDate(text, referenceDate);
    }
    return undefined;
  }

  function catalogEntry(raw) {
    if (!raw || typeof raw !== "object") return null;
    const key = String(raw.key || raw.id || raw.symbol || raw.sym || "").trim();
    const symbol = String(raw.sym || raw.symbol || key).trim();
    const name = String(raw.name || raw.label || symbol).trim();
    if (!key || !name) return null;
    const aliases = [key, symbol, name].concat(Array.isArray(raw.aliases) ? raw.aliases : [])
      .map((item) => normalized(item)).filter(Boolean);
    return { ...raw, key, sym: symbol, name, aliases: [...new Set(aliases)] };
  }

  function detectAssets(text, assets) {
    const source = normalized(text);
    const entries = (Array.isArray(assets) ? assets : []).map(catalogEntry).filter(Boolean);
    const found = [];
    entries.forEach((asset) => asset.aliases.forEach((alias) => {
      const expression = new RegExp(`(?:^|\\s)${escapeRegExp(alias)}(?:i|u|e|a|yi|yu|ye|ya)?(?=$|\\s)`, "i");
      const match = expression.exec(source);
      if (match) found.push({ asset, alias, index: match.index + match[0].length - alias.length, score: alias.length });
      else {
        // Fuzzy matching is intentionally limited to ticker-like single tokens
        // so a typo cannot silently match a long company name.
        if (alias.length < 3 || alias.includes(" ")) return;
        source.split(/\s+/).forEach((token, index) => {
          const score = fuzzyScore(token, alias);
          if (score >= 0.84) found.push({ asset, alias, index: source.indexOf(token), score: alias.length * score });
        });
      }
    }));
    const unique = new Map();
    found.sort((a, b) => b.score - a.score || a.index - b.index).forEach((item) => {
      const id = `${item.asset.type || ""}|${item.asset.key}`;
      if (!unique.has(id)) unique.set(id, item);
    });
    return [...unique.values()].sort((a, b) => a.index - b.index);
  }

  function numberMatches(text) {
    const source = normalizeText(text);
    const matches = [];
    const expression = /(?:\d[\d.,]*|[.,]\d+)/g;
    let match;
    while ((match = expression.exec(source))) {
      const before = source.slice(Math.max(0, match.index - 2), match.index);
      const after = source.slice(match.index + match[0].length, match.index + match[0].length + 12);
      const percent = source.slice(Math.max(0, match.index - 1), match.index + match[0].length + 1).includes("%");
      matches.push({ value: parseNumber(match[0]), index: match.index, raw: match[0], percent, before, after });
    }
    return matches.filter((item) => item.value != null);
  }

  function findCurrency(text) {
    const source = normalized(text);
    if (/\b(try|tl|lira\w*)\b/.test(source)) return "TRY";
    if (/\b(eur|euro\w*)\b/.test(source)) return "EUR";
    if (/(^|\s)(usd|dolar\w*|doll?ar\w*)(\s|$)/.test(source)) return "USD";
    return undefined;
  }

  function includesAny(source, list) { return list.some((word) => source.includes(word)); }

  function firstAmount(numbers, predicate) {
    const item = numbers.find((candidate) => !candidate.percent && (!predicate || predicate(candidate)));
    return item ? item.value : undefined;
  }

  function commandLabel(text, words) {
    let value = normalized(text)
      .replace(/\b20\d{2}[-/.]\d{1,2}[-/.]\d{1,2}\b/g, " ")
      .replace(/(?:\d[\d.,]*|[.,]\d+)/g, " ");
    (words || []).forEach((word) => {
      value = value.replace(new RegExp(`\\b${escapeRegExp(normalized(word))}\\b`, "g"), " ");
    });
    return value.replace(/\s+/g, " ").trim();
  }

  function isRelativeDateNumber(candidate) {
    return /^\s*gun\s+once\b/i.test(normalized(candidate && candidate.after));
  }

  function parseCommand(input, options = {}) {
    const originalText = String(input == null ? "" : input).trim();
    const text = normalizeText(originalText);
    const source = normalized(originalText);
    const assets = detectAssets(originalText, options.assets || []);
    const asset = assets[0] && assets[0].asset;
    const targetAsset = assets[1] && assets[1].asset;
    const numbers = numberMatches(originalText);
    const explicitDateMatch = text.match(/\b20\d{2}[-/.]\d{1,2}[-/.]\d{1,2}\b/);
    const percentageMatch = source.match(/%\s*(\d+(?:[.,]\d+)?)/) || source.match(/(\d+(?:[.,]\d+)?)\s*%/);
    const percentage = percentageMatch ? parseNumber(percentageMatch[1]) : undefined;
    const currency = findCurrency(originalText);
    const date = detectDate(originalText, options.referenceDate);
    let intent = "UNKNOWN";
    let condition;
    let amount;
    let fiatAmount;
    let price;
    let reason = "";
    let query;
    let page;
    let label;

    if (includesAny(source, HELP_WORDS)) {
      intent = "COMMAND_HELP";
    } else if (/(ana para birimi|baz para|temel para|base currency)/.test(source)) {
      intent = "CHANGE_BASE_CURRENCY";
      reason = "base-currency";
    } else if (includesAny(source, ["favoriye ekle", "favorilere ekle", "favorim yap", "takibe al", "add to favorites", "add to favorite", "to favorites", "to favorite"])) {
      intent = "ADD_FAVORITE";
    } else if (includesAny(source, ["favoriden cikar", "favorilerden kaldir", "favoriyi kaldir", "takipten cikar", "remove from favorites", "remove from favorite", "from favorites", "from favorite"])) {
      intent = "REMOVE_FAVORITE";
    } else if (numbers.length === 0 && includesAny(source, ["giderlerimi goster", "giderimi goster", "harcamalarimi goster", "aylik giderim ne", "show my expenses", "monthly expenses", "gelirimi goster", "gelirlerimi goster", "show my income", "monthly income", "bakiyemi goster", "toplam bakiyem", "show my balance"])) {
      intent = "APP_QUERY";
      if (source.includes("gider") || source.includes("harcama") || source.includes("expense")) query = "EXPENSES";
      else if (source.includes("gelir") || source.includes("income")) query = "INCOME";
      else query = "BALANCE";
    } else if (includesAny(source, ["giderlere git", "giderler sayfasini ac", "gider sayfasini ac", "giderleri ac", "open expenses", "gelirlere git", "gelirler sayfasini ac", "gelir sayfasini ac", "gelirleri ac", "open income", "portfoye git", "portfoy sayfasini ac", "portfoyu ac", "open portfolio", "aracima git", "aracim sayfasini ac", "aracimi ac", "open my car", "takibe git", "takip listesini ac", "takibi ac", "open watchlist", "ayarlara git", "ayarlari ac", "open settings"])) {
      intent = "NAVIGATE";
      if (source.includes("gider") || source.includes("expense")) page = "savings";
      else if (source.includes("gelir") || source.includes("income")) page = "income";
      else if (source.includes("portfoy") || source.includes("portfolio")) page = "portfolio";
      else if (source.includes("arac") || source.includes("car")) page = "car";
      else if (source.includes("takip") || source.includes("watchlist")) page = "watch";
      else page = "settings";
    } else if (/(aylik|monthly).*(gider|harcama|expense)/.test(source) || /(gider|harcama).*(aylik|monthly)/.test(source)) {
      intent = "SET_MONTHLY_EXPENSES";
    } else if (includesAny(source, ["gider ekle", "harcama ekle", "add expense", "log expense"])) {
      intent = "ADD_EXPENSE";
      label = commandLabel(originalText, ["gider ekle", "harcama ekle", "add expense", "log expense", "gider", "harcama", "expense", "add", "log"]);
    } else if (includesAny(source, ["gelir ekle", "kazanc ekle", "add income", "log income"])) {
      intent = "ADD_INCOME";
      label = commandLabel(originalText, ["gelir ekle", "kazanc ekle", "add income", "log income", "gelir", "kazanc", "income", "add", "log"]);
    } else if (includesAny(source, ["not ekle", "not al", "add note", "save note"])) {
      intent = "ADD_NOTE";
      label = commandLabel(originalText, ["not ekle", "not al", "add note", "save note", "not", "ekle", "al", "add", "save"]);
    } else if (includesAny(source, ["hedef ekle", "birikim hedefi", "savings goal", "create goal"])) {
      intent = "ADD_GOAL";
      label = commandLabel(originalText, ["hedef ekle", "birikim hedefi", "savings goal", "create goal", "hedef", "birikim", "ekle", "savings", "goal", "create"]);
    } else if (includesAny(source, ["geri sayim", "countdown", "geri sayac"])) {
      intent = "ADD_COUNTDOWN";
      label = commandLabel(originalText, ["geri sayim", "geri sayac", "countdown", "ekle", "add"]);
    } else if (includesAny(source, ["ortalama", "maliyetim", "ne kadar kazandim", "bu ay", "yuzde kaci", "en cok kazandiran", "karim", "pnl", "portfoyumun", "average", "how much did i earn", "this month", "what percentage", "top performer", "my portfolio", "show my portfolio"])) {
      intent = "PORTFOLIO_QUERY";
      if (source.includes("ortalama") || source.includes("maliyet") || source.includes("average")) query = "AVERAGE_COST";
      else if (source.includes("bu ay") || source.includes("kazandim") || source.includes("karim") || source.includes("pnl") || source.includes("this month") || source.includes("earn")) query = "PNL";
      else if (source.includes("yuzde kaci") || source.includes("yuzde") || source.includes("percentage")) query = "ALLOCATION";
      else if (source.includes("en cok kazandiran") || source.includes("top performer")) query = "TOP_PERFORMER";
      else query = "PORTFOLIO_SUMMARY";
    } else if (includesAny(source, ALERT_WORDS)) {
      intent = "CREATE_ALERT";
      condition = percentage != null
        ? (source.includes("dus") || source.includes("azal") ? "PERCENT_DOWN" : "PERCENT_UP")
        : (source.includes("dus") || source.includes("altina") || source.includes("asagi") ? "BELOW" : "ABOVE");
      const targetNumbers = numbers.filter((candidate) => !candidate.percent);
      price = targetNumbers.length ? targetNumbers[targetNumbers.length - 1].value : undefined;
    } else if (includesAny(source, SWAP_WORDS) || (assets.length > 1 && source.includes("den") && source.includes("ye"))) {
      intent = "SWAP";
    } else if (/(bakiye|nakit).*(ekle|koy|girdim)/.test(source)) {
      intent = "ADD_BALANCE";
    } else if (/(bakiye|nakit).*(cikar|azalt|bozdum)/.test(source)) {
      intent = "REMOVE_BALANCE";
    } else if (includesAny(source, BUY_WORDS) || /portfoye\s+(ekle|at)/.test(source)) {
      intent = "BUY";
    } else if (includesAny(source, SELL_WORDS) || /portfoyden\s+cikar/.test(source)) {
      intent = "SELL";
    } else if (includesAny(source, OPEN_WORDS)) {
      intent = "OPEN_ASSET";
    }

    const assetIndex = assets[0] ? assets[0].index : -1;
    const amountNumbers = numbers.filter((candidate) => {
      const isDatePart = explicitDateMatch && candidate.index >= explicitDateMatch.index && candidate.index < explicitDateMatch.index + explicitDateMatch[0].length;
      return !candidate.percent && !isRelativeDateNumber(candidate) && !isDatePart;
    });
    const numberBeforeAsset = amountNumbers.find((candidate) => candidate.index < assetIndex);
    const half = /\b(yarim|1\/2|half)\b/.test(source);
    if (intent === "BUY" || intent === "SELL" || intent === "SWAP" || intent === "ADD_BALANCE" || intent === "REMOVE_BALANCE" || intent === "SET_MONTHLY_EXPENSES" || intent === "ADD_EXPENSE" || intent === "ADD_INCOME" || intent === "ADD_GOAL") {
      amount = half ? 0.5 : (numberBeforeAsset ? numberBeforeAsset.value : firstAmount(amountNumbers, (candidate) => !candidate.after.includes("%")));
      const fiatPhrase = source.match(/(\d[\d.,]*)\s*(usd|dolar|euro|eur|tl|try|lira)\s*(?:lik|lık|luk|lük)/);
      if (fiatPhrase && assetIndex >= 0 && source.indexOf(fiatPhrase[0]) < assetIndex) {
        fiatAmount = parseNumber(fiatPhrase[1]);
        amount = undefined;
      }
      const priced = amountNumbers.find((candidate) => candidate.index > assetIndex && /\b(usd|dolar\w*|euro\w*|eur|tl|try|lira\w*)\b/.test(candidate.after));
      if (priced) price = priced.value;
      if (intent === "SWAP" && !amount && numberBeforeAsset) amount = numberBeforeAsset.value;
    }

    if (intent === "CHANGE_BASE_CURRENCY") {
      const match = source.match(/\b(try|tl|lira|usd|dolar|eur|euro)\b/);
      if (match) {
        const value = match[1];
        // The app's currency keys are USD and TL; parser exposes TRY for a
        // neutral financial representation and the executor maps it to TL.
        reason = value === "try" || value === "tl" || value === "lira" ? "TRY" : value === "eur" || value === "euro" ? "EUR" : "USD";
      }
    }

    let confidence = intent === "UNKNOWN" ? 0.12 : 0.62;
    if (asset) confidence += 0.2;
    if (targetAsset) confidence += 0.06;
    if (intent === "BUY" || intent === "SELL" || intent === "SWAP") {
      if (amount != null || fiatAmount != null) confidence += 0.12;
      if (price != null) confidence += 0.04;
    }
    if (intent === "CREATE_ALERT" && (price != null || percentage != null)) confidence += 0.14;
    if (intent === "CHANGE_BASE_CURRENCY" && reason) confidence += 0.18;
    if (intent === "PORTFOLIO_QUERY" && query) confidence += 0.2;
    if (intent === "APP_QUERY" && query) confidence += 0.2;
    if (intent === "NAVIGATE" && page) confidence += 0.18;
    if (["SET_MONTHLY_EXPENSES", "ADD_EXPENSE", "ADD_INCOME", "ADD_GOAL"].includes(intent) && amount != null) confidence += 0.14;
    if (["ADD_EXPENSE", "ADD_INCOME", "ADD_NOTE", "ADD_GOAL", "ADD_COUNTDOWN"].includes(intent) && label) confidence += 0.08;
    if (intent === "ADD_COUNTDOWN" && date) confidence += 0.12;
    if (intent === "COMMAND_HELP") confidence += 0.25;
    if (intent === "OPEN_ASSET" && asset) confidence += 0.12;
    if ((asset && assets.filter((entry) => entry.asset.sym === asset.sym).length > 1) || (asset && assets.length > 1 && assets[0].index === assets[1].index)) confidence -= 0.2;
    confidence = Math.max(0, Math.min(0.99, Math.round(confidence * 100) / 100));

    const missing = [];
    if (["BUY", "SELL", "SWAP", "ADD_BALANCE", "REMOVE_BALANCE", "CREATE_ALERT", "OPEN_ASSET", "ADD_FAVORITE", "REMOVE_FAVORITE"].includes(intent) && !asset) missing.push("asset");
    if (["BUY", "SELL"].includes(intent) && amount == null && fiatAmount == null) missing.push("amount");
    if (intent === "SWAP" && !targetAsset) missing.push("targetAsset");
    if (intent === "CREATE_ALERT" && price == null && percentage == null) missing.push("condition");
    if (["SET_MONTHLY_EXPENSES", "ADD_EXPENSE", "ADD_INCOME", "ADD_GOAL"].includes(intent) && !(amount > 0)) missing.push("amount");
    if (["ADD_EXPENSE", "ADD_INCOME", "ADD_NOTE", "ADD_GOAL", "ADD_COUNTDOWN"].includes(intent) && !label) missing.push("label");
    if (intent === "ADD_COUNTDOWN" && !date) missing.push("date");

    return {
      intent: INTENTS.includes(intent) ? intent : "UNKNOWN",
      asset: asset ? asset.sym.toUpperCase() : undefined,
      assetKey: asset ? asset.key : undefined,
      targetAsset: targetAsset ? targetAsset.sym.toUpperCase() : undefined,
      targetAssetKey: targetAsset ? targetAsset.key : undefined,
      amount,
      fiatAmount,
      currency,
      price,
      percentage,
      date,
      condition,
      confidence,
      originalText,
      normalizedText: text,
      query,
      page,
      label,
      missing,
      ambiguity: asset && assets.filter((entry) => entry.asset.sym === asset.sym).length > 1 ? assets.filter((entry) => entry.asset.sym === asset.sym).map((entry) => entry.asset) : undefined,
      baseCurrency: intent === "CHANGE_BASE_CURRENCY" ? reason : undefined,
    };
  }

  return { parseCommand, normalizeText, normalized, resolveRelativeDate, fuzzyScore, INTENTS };
});
