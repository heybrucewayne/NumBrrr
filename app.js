/* ============================================================
   NumBrrr, financial freedom calculator
   Required Savings = (Monthly Expenses × 12) / Annual Return Rate
   ============================================================ */

const NET_COST = 2; // real-estate net-yield deduction (% points)

// Tabler icons are embedded as SVG paths instead of loaded through CSS masks.
// This keeps the icon layer visible in Safari, installed PWAs, and browsers
// that block external SVG masks while preserving currentColor theming.
const UI_ICON_PATHS = Object.freeze({
  "arrows-exchange": '<path d="M7 10h14l-4 -4"/><path d="M17 14h-14l4 4"/>',
  "bell-ringing": '<path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"/><path d="M9 17v1a3 3 0 0 0 6 0v-1"/><path d="M21 6.727a11.05 11.05 0 0 0 -2.794 -3.727"/><path d="M3 6.727a11.05 11.05 0 0 1 2.792 -3.727"/>',
  "briefcase-2": '<path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9"/><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2"/>',
  "building-bank": '<path d="M3 21l18 0"/><path d="M3 10l18 0"/><path d="M5 6l7 -3l7 3"/><path d="M4 10l0 11"/><path d="M20 10l0 11"/><path d="M8 14l0 3"/><path d="M12 14l0 3"/><path d="M16 14l0 3"/>',
  car: '<path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"/>',
  "cash-banknote": '<path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M3 8a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -8"/><path d="M18 12h.01"/><path d="M6 12h.01"/>',
  "chart-bar": '<path d="M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -6"/><path d="M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -10"/><path d="M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -14"/><path d="M4 20h14"/>',
  "chart-candle": '<path d="M4 7a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -3"/><path d="M6 4l0 2"/><path d="M6 11l0 9"/><path d="M10 15a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -3"/><path d="M12 4l0 10"/><path d="M12 19l0 1"/><path d="M16 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -4"/><path d="M18 4l0 1"/><path d="M18 11l0 9"/>',
  "chart-line": '<path d="M4 19l16 0"/><path d="M4 15l4 -6l4 2l4 -5l4 4"/>',
  coins: '<path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3-6 -3s-6 1.343 -6 3"/><path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4"/><path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598"/><path d="M3 6v10c0 .888 .772 1.45 2 2"/><path d="M3 11c0 .888 .772 1.45 2 2"/>',
  heartbeat: '<path d="M19.5 13.572l-7.5 7.428l-2.896 -2.868m-6.117 -8.104a5 5 0 0 1 9.013 -3.022a5 5 0 1 1 7.5 6.572"/><path d="M3 13h2l2 3l2 -6l1 3h3"/>',
  history: '<path d="M12 8l0 4l2 2"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>',
  home: '<path d="M5 12l-2 0l9 -9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"/>',
  hourglass: '<path d="M6.5 7h11"/><path d="M6.5 17h11"/><path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1"/><path d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1"/>',
  notes: '<path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14"/><path d="M9 7l6 0"/><path d="M9 11l6 0"/><path d="M9 15l4 0"/>',
  "receipt-2": '<path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2"/><path d="M14 8h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5m2 0v1.5m0 -9v1.5"/>',
  repeat: '<path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"/><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"/>',
  route: '<path d="M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4"/><path d="M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5"/>',
  search: '<path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/><path d="M21 21l-6 -6"/>',
  settings: '<path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>',
  sparkles: '<path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6"/>',
  star: '<path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"/>',
  "target-arrow": '<path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12 7a5 5 0 1 0 5 5"/><path d="M13 3.055a9 9 0 1 0 7.941 7.945"/><path d="M15 6v3h3l3 -3h-3v-3l-3 3"/><path d="M15 9l-3 3"/>',
  trophy: '<path d="M8 21l8 0"/><path d="M12 17l0 4"/><path d="M7 4l10 0"/><path d="M17 4v8a5 5 0 0 1 -10 0v-8"/><path d="M3 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M17 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>',
  wallet: '<path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12"/><path d="M20 12v4h-4a2 2 0 0 1 0 -4h4"/>',
});

function uiIconSvg(name, className = "ui-inline-icon") {
  const paths = UI_ICON_PATHS[name] || UI_ICON_PATHS["chart-bar"];
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
}

function setUiIcon(node, name) {
  if (!node) return;
  node.innerHTML = uiIconSvg(name);
  node.dataset.uiIcon = name;
}

function hydrateUiIcons() {
  const widgetIcons = {
    freedom: "target-arrow", goals: "target-arrow", portfolio: "briefcase-2", income: "wallet",
    expenses: "receipt-2", monthly: "chart-bar", health: "heartbeat", markets: "arrows-exchange",
    marketSnapshot: "chart-candle", topPerformers: "trophy", countdown: "hourglass",
    car: "car", watch: "star", notes: "notes", insights: "sparkles", alerts: "bell-ringing",
  };
  Object.entries(widgetIcons).forEach(([widget, icon]) => {
    document.querySelectorAll(`[data-home-widget="${widget}"] .dashboard-widget-icon`).forEach((node) => setUiIcon(node, icon));
  });
  document.querySelectorAll("[data-countdown-id] .dashboard-widget-icon").forEach((node) => setUiIcon(node, "hourglass"));

  const selectorIcons = {
    ".modern-section-icon--expense": "receipt-2", ".modern-section-icon--recurring": "repeat",
    ".modern-section-icon--spending": "cash-banknote", ".modern-section-icon--income": "chart-line",
    ".modern-section-icon--watch": "star", ".modern-section-icon--market": "chart-candle",
    ".modern-section-icon--leaders": "trophy",
    ".income-summary-icon": "cash-banknote", ".car-section-icon:not(.car-section-icon--route):not(.car-section-icon--history)": "car",
    ".car-section-icon--route": "route", ".car-section-icon--history": "history", ".veh-empty-icon": "car",
    ".watch-search-icon": "search", ".monthly-share-heading-icon": "chart-bar",
  };
  Object.entries(selectorIcons).forEach(([selector, icon]) => {
    document.querySelectorAll(selector).forEach((node) => setUiIcon(node, icon));
  });

  const tabIcons = { home: "home", portfolio: "briefcase-2", income: "wallet", savings: "receipt-2", car: "car", watch: "star", settings: "settings" };
  Object.entries(tabIcons).forEach(([view, icon]) => {
    document.querySelectorAll(`.tab[data-view="${view}"] .tab-icon`).forEach((node) => setUiIcon(node, icon));
  });

}

// ---- Instrument definitions (names/subs are translated via I18N) ----
const INSTRUMENTS = {
  USD: [
    { id: "savings",    rate: 4.5,  color: "#21d4fd" },
    { id: "treasury",   rate: 4.25, color: "#4f8cff" },
    { id: "sp500",      rate: 10,   color: "#2ee6a6", historical: true },
    { id: "nasdaq",     rate: 13,   color: "#7c5cff", historical: true },
    { id: "btc",        rate: 25,   color: "#ffb454", warn: true, historical: true },
    { id: "realestate", rate: 6.6,  color: "#ff7eb6", realEstate: true, historical: true },
  ],
  TL: [
    { id: "deposit",    rate: 42,   color: "#21d4fd" },
    { id: "gold",       rate: 40,   color: "#ffd54a", historical: true },
    { id: "bist",       rate: 35,   color: "#2ee6a6", historical: true },
    { id: "eurobond",   rate: 25,   color: "#7c5cff" },
    { id: "btc",        rate: 36.9, color: "#ffb454", warn: true, historical: true, noteKey: "note_btc_tl" },
    { id: "realestate", rate: 7.3,  color: "#ff7eb6", realEstate: true, historical: true },
  ],
};

const CURRENCY_META = {
  USD: { symbol: "$", code: "USD", locale: "en-US", inflation: 3,  rentHint: "2,200", valueHint: "400,000" },
  TL:  { symbol: "₺", code: "TRY", locale: "tr-TR", inflation: 40, rentHint: "30,000", valueHint: "5,000,000" },
};

// Country selection. Each country maps 1:1 to a market/currency (which already
// carries its own deposit/interest rate via INSTRUMENTS) and a default language.
const COUNTRIES = {
  US: { flag: "🇺🇸", currency: "USD", lang: "en" },
  TR: { flag: "🇹🇷", currency: "TL",  lang: "tr" },
};
function countryForCurrency(cur) { return cur === "TL" ? "TR" : "US"; }

const SAVINGS_DEFAULT_INVEST = { USD: "sp500", TL: "deposit" };
// Preset expense categories (translated; users can also type their own).
const EXPENSE_CATS = ["rent","bills","market","food","electric","water","internet","transport","health","shopping","entertainment","other"];
// Vehicle payment-reminder labels + vehicle expense categories (suggestions).
const VEH_SCHED_PRESETS = ["insurance","kasko","tax","inspection","service"];
const VEH_EXP_PRESETS = ["fuel","service","parking","fine","tires","wash"];
// Income sources, pre-classified as passive (counts toward freedom) or active.
const INCOME_CATEGORIES = [
  { id: "salary", passive: false },
  { id: "rental", passive: true },
  { id: "interest", passive: true },
  { id: "dividends", passive: true },
  { id: "side", passive: false },
];
// Portfolio holding asset types (tags). Interest-bearing ones feed Income.
const ASSET_TYPES = ["usstock", "bist", "crypto", "gold", "usd", "deposit", "bonds", "cash"];
// Searchable company lists (symbol + display name). Prices fetched live from Yahoo.
const US_STOCKS = [
  { s: "AAPL", n: "Apple" }, { s: "MSFT", n: "Microsoft" }, { s: "GOOGL", n: "Alphabet (Google)" }, { s: "AMZN", n: "Amazon" },
  { s: "NVDA", n: "NVIDIA" }, { s: "META", n: "Meta Platforms" }, { s: "TSLA", n: "Tesla" }, { s: "BRK-B", n: "Berkshire Hathaway" },
  { s: "JPM", n: "JPMorgan Chase" }, { s: "V", n: "Visa" }, { s: "MA", n: "Mastercard" }, { s: "UNH", n: "UnitedHealth" },
  { s: "HD", n: "Home Depot" }, { s: "PG", n: "Procter & Gamble" }, { s: "JNJ", n: "Johnson & Johnson" }, { s: "XOM", n: "Exxon Mobil" },
  { s: "CVX", n: "Chevron" }, { s: "KO", n: "Coca-Cola" }, { s: "PEP", n: "PepsiCo" }, { s: "COST", n: "Costco" },
  { s: "WMT", n: "Walmart" }, { s: "DIS", n: "Disney" }, { s: "NFLX", n: "Netflix" }, { s: "ADBE", n: "Adobe" },
  { s: "CRM", n: "Salesforce" }, { s: "INTC", n: "Intel" }, { s: "AMD", n: "AMD" }, { s: "QCOM", n: "Qualcomm" },
  { s: "ORCL", n: "Oracle" }, { s: "CSCO", n: "Cisco" }, { s: "IBM", n: "IBM" }, { s: "BA", n: "Boeing" },
  { s: "F", n: "Ford" }, { s: "GM", n: "General Motors" }, { s: "NKE", n: "Nike" }, { s: "SBUX", n: "Starbucks" },
  { s: "MCD", n: "McDonald's" }, { s: "PYPL", n: "PayPal" }, { s: "BAC", n: "Bank of America" }, { s: "GS", n: "Goldman Sachs" },
  { s: "T", n: "AT&T" }, { s: "VZ", n: "Verizon" }, { s: "PFE", n: "Pfizer" }, { s: "MRK", n: "Merck" },
  { s: "LLY", n: "Eli Lilly" }, { s: "AVGO", n: "Broadcom" }, { s: "MU", n: "Micron" }, { s: "UBER", n: "Uber" },
  { s: "ABNB", n: "Airbnb" }, { s: "COIN", n: "Coinbase" }, { s: "PLTR", n: "Palantir" }, { s: "SHOP", n: "Shopify" },
  { s: "SPOT", n: "Spotify" }, { s: "BABA", n: "Alibaba" },
  // ETFs
  { s: "SPY", n: "SPDR S&P 500 ETF (SPY)" }, { s: "QQQ", n: "Invesco QQQ — Nasdaq 100 (QQQ)" },
  { s: "VOO", n: "Vanguard S&P 500 ETF (VOO)" }, { s: "IVV", n: "iShares Core S&P 500 (IVV)" },
  { s: "VTI", n: "Vanguard Total Stock Market (VTI)" }, { s: "DIA", n: "SPDR Dow Jones (DIA)" },
  { s: "IWM", n: "iShares Russell 2000 (IWM)" }, { s: "VEA", n: "Vanguard Developed Markets (VEA)" },
  { s: "VWO", n: "Vanguard Emerging Markets (VWO)" }, { s: "GLD", n: "SPDR Gold Shares (GLD)" },
  { s: "SLV", n: "iShares Silver Trust (SLV)" }, { s: "ARKK", n: "ARK Innovation ETF (ARKK)" },
  { s: "SCHD", n: "Schwab US Dividend (SCHD)" }, { s: "VYM", n: "Vanguard High Dividend (VYM)" },
  { s: "XLK", n: "Technology Select Sector (XLK)" }, { s: "XLF", n: "Financial Select Sector (XLF)" },
  { s: "XLE", n: "Energy Select Sector (XLE)" }, { s: "SMH", n: "VanEck Semiconductor (SMH)" },
  // More US stocks (NASDAQ-100 / S&P large & mid caps, popular names)
  { s: "GOOG", n: "Alphabet (Class C)" }, { s: "TMUS", n: "T-Mobile US" }, { s: "CMCSA", n: "Comcast" }, { s: "CHTR", n: "Charter Communications" },
  { s: "TXN", n: "Texas Instruments" }, { s: "AMAT", n: "Applied Materials" }, { s: "LRCX", n: "Lam Research" }, { s: "KLAC", n: "KLA Corp" },
  { s: "ADI", n: "Analog Devices" }, { s: "NXPI", n: "NXP Semiconductors" }, { s: "MRVL", n: "Marvell" }, { s: "ON", n: "ON Semiconductor" },
  { s: "MCHP", n: "Microchip Technology" }, { s: "SNPS", n: "Synopsys" }, { s: "CDNS", n: "Cadence Design" }, { s: "FTNT", n: "Fortinet" },
  { s: "PANW", n: "Palo Alto Networks" }, { s: "CRWD", n: "CrowdStrike" }, { s: "ZS", n: "Zscaler" }, { s: "NET", n: "Cloudflare" },
  { s: "DDOG", n: "Datadog" }, { s: "SNOW", n: "Snowflake" }, { s: "MDB", n: "MongoDB" }, { s: "NOW", n: "ServiceNow" },
  { s: "INTU", n: "Intuit" }, { s: "ADSK", n: "Autodesk" }, { s: "SMCI", n: "Super Micro Computer" }, { s: "ARM", n: "Arm Holdings" },
  { s: "ASML", n: "ASML Holding" }, { s: "TSM", n: "TSMC" }, { s: "DELL", n: "Dell Technologies" }, { s: "HPQ", n: "HP Inc" },
  { s: "WDC", n: "Western Digital" }, { s: "GLW", n: "Corning" }, { s: "TEAM", n: "Atlassian" }, { s: "WDAY", n: "Workday" },
  { s: "SNAP", n: "Snap" }, { s: "PINS", n: "Pinterest" }, { s: "RBLX", n: "Roblox" }, { s: "DASH", n: "DoorDash" },
  { s: "LYFT", n: "Lyft" }, { s: "ZM", n: "Zoom" }, { s: "DOCU", n: "DocuSign" }, { s: "TWLO", n: "Twilio" },
  { s: "OKTA", n: "Okta" }, { s: "ROKU", n: "Roku" }, { s: "TTD", n: "The Trade Desk" }, { s: "RDDT", n: "Reddit" },
  { s: "BIDU", n: "Baidu" }, { s: "JD", n: "JD.com" }, { s: "PDD", n: "PDD Holdings" }, { s: "NTES", n: "NetEase" },
  { s: "SE", n: "Sea Limited" }, { s: "MELI", n: "MercadoLibre" },
  { s: "WFC", n: "Wells Fargo" }, { s: "C", n: "Citigroup" }, { s: "MS", n: "Morgan Stanley" }, { s: "SCHW", n: "Charles Schwab" },
  { s: "BLK", n: "BlackRock" }, { s: "AXP", n: "American Express" }, { s: "BX", n: "Blackstone" }, { s: "KKR", n: "KKR" },
  { s: "SPGI", n: "S&P Global" }, { s: "ICE", n: "Intercontinental Exchange" }, { s: "CME", n: "CME Group" }, { s: "COF", n: "Capital One" },
  { s: "USB", n: "U.S. Bancorp" }, { s: "PNC", n: "PNC Financial" }, { s: "MCO", n: "Moody's" }, { s: "PGR", n: "Progressive" },
  { s: "MET", n: "MetLife" }, { s: "AIG", n: "AIG" }, { s: "TRV", n: "Travelers" }, { s: "MMC", n: "Marsh McLennan" },
  { s: "ABBV", n: "AbbVie" }, { s: "TMO", n: "Thermo Fisher" }, { s: "ABT", n: "Abbott" }, { s: "DHR", n: "Danaher" },
  { s: "BMY", n: "Bristol Myers Squibb" }, { s: "AMGN", n: "Amgen" }, { s: "GILD", n: "Gilead Sciences" }, { s: "ISRG", n: "Intuitive Surgical" },
  { s: "MDT", n: "Medtronic" }, { s: "SYK", n: "Stryker" }, { s: "BSX", n: "Boston Scientific" }, { s: "CI", n: "Cigna" },
  { s: "CVS", n: "CVS Health" }, { s: "ELV", n: "Elevance Health" }, { s: "ZTS", n: "Zoetis" }, { s: "VRTX", n: "Vertex Pharma" },
  { s: "REGN", n: "Regeneron" }, { s: "MRNA", n: "Moderna" }, { s: "BIIB", n: "Biogen" }, { s: "DXCM", n: "DexCom" },
  { s: "HCA", n: "HCA Healthcare" }, { s: "MCK", n: "McKesson" }, { s: "IDXX", n: "IDEXX Labs" }, { s: "GEHC", n: "GE HealthCare" },
  { s: "LOW", n: "Lowe's" }, { s: "TGT", n: "Target" }, { s: "TJX", n: "TJX Companies" }, { s: "DG", n: "Dollar General" },
  { s: "DLTR", n: "Dollar Tree" }, { s: "ROST", n: "Ross Stores" }, { s: "ULTA", n: "Ulta Beauty" }, { s: "LULU", n: "Lululemon" },
  { s: "CMG", n: "Chipotle" }, { s: "YUM", n: "Yum! Brands" }, { s: "EL", n: "Estée Lauder" }, { s: "CL", n: "Colgate-Palmolive" },
  { s: "KMB", n: "Kimberly-Clark" }, { s: "GIS", n: "General Mills" }, { s: "MDLZ", n: "Mondelez" }, { s: "MO", n: "Altria" },
  { s: "PM", n: "Philip Morris" }, { s: "STZ", n: "Constellation Brands" }, { s: "MNST", n: "Monster Beverage" }, { s: "KHC", n: "Kraft Heinz" },
  { s: "KR", n: "Kroger" }, { s: "KDP", n: "Keurig Dr Pepper" }, { s: "HSY", n: "Hershey" },
  { s: "CAT", n: "Caterpillar" }, { s: "DE", n: "Deere" }, { s: "HON", n: "Honeywell" }, { s: "GE", n: "GE Aerospace" },
  { s: "MMM", n: "3M" }, { s: "UPS", n: "UPS" }, { s: "FDX", n: "FedEx" }, { s: "LMT", n: "Lockheed Martin" },
  { s: "RTX", n: "RTX (Raytheon)" }, { s: "NOC", n: "Northrop Grumman" }, { s: "GD", n: "General Dynamics" }, { s: "UNP", n: "Union Pacific" },
  { s: "CSX", n: "CSX" }, { s: "NSC", n: "Norfolk Southern" }, { s: "EMR", n: "Emerson Electric" }, { s: "ETN", n: "Eaton" },
  { s: "ITW", n: "Illinois Tool Works" }, { s: "GEV", n: "GE Vernova" }, { s: "WM", n: "Waste Management" }, { s: "PH", n: "Parker Hannifin" },
  { s: "CMI", n: "Cummins" }, { s: "PCAR", n: "PACCAR" },
  { s: "COP", n: "ConocoPhillips" }, { s: "SLB", n: "Schlumberger" }, { s: "EOG", n: "EOG Resources" }, { s: "MPC", n: "Marathon Petroleum" },
  { s: "PSX", n: "Phillips 66" }, { s: "VLO", n: "Valero Energy" }, { s: "OXY", n: "Occidental" }, { s: "WMB", n: "Williams" },
  { s: "KMI", n: "Kinder Morgan" }, { s: "OKE", n: "ONEOK" }, { s: "HAL", n: "Halliburton" }, { s: "FANG", n: "Diamondback Energy" },
  { s: "RIVN", n: "Rivian" }, { s: "LCID", n: "Lucid" }, { s: "NIO", n: "NIO" }, { s: "LI", n: "Li Auto" }, { s: "XPEV", n: "XPeng" },
  { s: "HOOD", n: "Robinhood" }, { s: "SOFI", n: "SoFi" }, { s: "AFRM", n: "Affirm" }, { s: "DKNG", n: "DraftKings" },
  { s: "CVNA", n: "Carvana" }, { s: "MSTR", n: "MicroStrategy" }, { s: "GME", n: "GameStop" },
  { s: "DAL", n: "Delta Air Lines" }, { s: "UAL", n: "United Airlines" }, { s: "AAL", n: "American Airlines" }, { s: "LUV", n: "Southwest Airlines" },
  { s: "ETSY", n: "Etsy" }, { s: "EBAY", n: "eBay" }, { s: "CHWY", n: "Chewy" }, { s: "MAR", n: "Marriott" },
  { s: "BKNG", n: "Booking Holdings" }, { s: "HLT", n: "Hilton" }, { s: "CTAS", n: "Cintas" }, { s: "FAST", n: "Fastenal" },
  { s: "ODFL", n: "Old Dominion" }, { s: "PAYX", n: "Paychex" }, { s: "CPRT", n: "Copart" }, { s: "EA", n: "Electronic Arts" },
  { s: "TTWO", n: "Take-Two Interactive" }, { s: "WBD", n: "Warner Bros Discovery" }, { s: "PARA", n: "Paramount" },
];
const BIST_STOCKS = [
  { s: "AKBNK", n: "Akbank" }, { s: "GARAN", n: "Garanti BBVA" }, { s: "ISCTR", n: "İş Bankası" }, { s: "YKBNK", n: "Yapı Kredi" },
  { s: "VAKBN", n: "VakıfBank" }, { s: "HALKB", n: "Halkbank" }, { s: "THYAO", n: "Türk Hava Yolları" }, { s: "PGSUS", n: "Pegasus" },
  { s: "BIMAS", n: "BİM" }, { s: "MGROS", n: "Migros" }, { s: "SOKM", n: "Şok Marketler" }, { s: "ASELS", n: "Aselsan" },
  { s: "KCHOL", n: "Koç Holding" }, { s: "SAHOL", n: "Sabancı Holding" }, { s: "EREGL", n: "Ereğli Demir Çelik" }, { s: "KRDMD", n: "Kardemir" },
  { s: "SISE", n: "Şişecam" }, { s: "TUPRS", n: "Tüpraş" }, { s: "PETKM", n: "Petkim" }, { s: "SASA", n: "Sasa Polyester" },
  { s: "FROTO", n: "Ford Otosan" }, { s: "TOASO", n: "Tofaş" }, { s: "DOAS", n: "Doğuş Otomotiv" }, { s: "TTRAK", n: "Türk Traktör" },
  { s: "OTKAR", n: "Otokar" }, { s: "ARCLK", n: "Arçelik" }, { s: "VESTL", n: "Vestel" }, { s: "TCELL", n: "Turkcell" },
  { s: "TTKOM", n: "Türk Telekom" }, { s: "ENKAI", n: "Enka İnşaat" }, { s: "TKFEN", n: "Tekfen Holding" }, { s: "ALARK", n: "Alarko Holding" },
  { s: "ENJSA", n: "Enerjisa" }, { s: "AKSEN", n: "Aksa Enerji" }, { s: "ZOREN", n: "Zorlu Enerji" }, { s: "ODAS", n: "Odaş Elektrik" },
  { s: "KOZAL", n: "Koza Altın" }, { s: "KOZAA", n: "Koza Madencilik" }, { s: "GUBRF", n: "Gübretaş" }, { s: "HEKTS", n: "Hektaş" },
  { s: "OYAKC", n: "Oyak Çimento" }, { s: "CIMSA", n: "Çimsa" }, { s: "AEFES", n: "Anadolu Efes" }, { s: "CCOLA", n: "Coca-Cola İçecek" },
  { s: "ULKER", n: "Ülker" }, { s: "TAVHL", n: "TAV Havalimanları" }, { s: "EKGYO", n: "Emlak Konut GYO" }, { s: "ASTOR", n: "Astor Enerji" },
  { s: "BRSAN", n: "Borusan Boru" }, { s: "SMRTG", n: "Smart Güneş" }, { s: "GWIND", n: "Galata Wind" }, { s: "REEDR", n: "Reeder" },
  // Banks, finance & insurance
  { s: "TSKB", n: "Türkiye Sınai Kalkınma Bankası" }, { s: "ALBRK", n: "Albaraka Türk" }, { s: "SKBNK", n: "Şekerbank" }, { s: "QNBFB", n: "QNB Finansbank" },
  { s: "ISMEN", n: "İş Yatırım" }, { s: "GLCVY", n: "Gelecek Varlık" }, { s: "ISFIN", n: "İş Finansal Kiralama" }, { s: "AGESA", n: "Agesa Emeklilik" },
  { s: "ANHYT", n: "Anadolu Hayat Emeklilik" }, { s: "ANSGR", n: "Anadolu Sigorta" }, { s: "TURSG", n: "Türkiye Sigorta" }, { s: "RAYSG", n: "Ray Sigorta" },
  // Holdings
  { s: "DOHOL", n: "Doğan Holding" }, { s: "GLYHO", n: "Global Yatırım Holding" }, { s: "AGHOL", n: "AG Anadolu Grubu Holding" }, { s: "NTHOL", n: "Net Holding" },
  { s: "IHLAS", n: "İhlas Holding" }, { s: "BERA", n: "Bera Holding" }, { s: "POLHO", n: "Polisan Holding" }, { s: "VERUS", n: "Verusa Holding" },
  { s: "GSDHO", n: "GSD Holding" }, { s: "IEYHO", n: "Işıklar Enerji" }, { s: "ECZYT", n: "Eczacıbaşı Yatırım" }, { s: "ECILC", n: "Eczacıbaşı İlaç" },
  // Energy & utilities
  { s: "AKFYE", n: "Akfen Yenilenebilir Enerji" }, { s: "AYDEM", n: "Aydem Enerji" }, { s: "GESAN", n: "Girişim Elektrik" }, { s: "CWENE", n: "CW Enerji" },
  { s: "KONTR", n: "Kontrolmatik" }, { s: "NTGAZ", n: "Naturelgaz" }, { s: "AKSA", n: "Aksa Akrilik" }, { s: "AKSUE", n: "Aksu Enerji" },
  { s: "ESEN", n: "Esenboğa Elektrik" }, { s: "ALFAS", n: "Alfa Solar" }, { s: "EUPWR", n: "Europower Enerji" }, { s: "AYEN", n: "Ayen Enerji" },
  // Industrials & technology
  { s: "KORDS", n: "Kordsa" }, { s: "BRISA", n: "Brisa" }, { s: "GOODY", n: "Goodyear" }, { s: "EGEEN", n: "Ege Endüstri" },
  { s: "KARSN", n: "Karsan" }, { s: "KLMSN", n: "Klimasan" }, { s: "ARENA", n: "Arena Bilgisayar" }, { s: "INDES", n: "İndeks Bilgisayar" },
  { s: "LOGO", n: "Logo Yazılım" }, { s: "NETAS", n: "Netaş" }, { s: "KAREL", n: "Karel Elektronik" }, { s: "ALCTL", n: "Alcatel Lucent Teletaş" },
  { s: "ESCOM", n: "Escort Teknoloji" }, { s: "PKART", n: "Plastikkart" }, { s: "MIATK", n: "Mia Teknoloji" }, { s: "ARDYZ", n: "ARD Bilişim" },
  { s: "PAPIL", n: "Papilon Savunma" }, { s: "OBASE", n: "Obase" }, { s: "FORTE", n: "Forte Bilgi İletişim" }, { s: "KFEIN", n: "Kafein Yazılım" },
  { s: "SDTTR", n: "SDT Uzay ve Savunma" }, { s: "HTTBT", n: "Hitit Bilgisayar" }, { s: "INVEO", n: "Inveo Yatırım" }, { s: "LINK", n: "Link Bilgisayar" },
  { s: "DGATE", n: "Datagate Bilgisayar" }, { s: "ARMDA", n: "Armada Bilgisayar" }, { s: "PENTA", n: "Penta Teknoloji" }, { s: "FONET", n: "Fonet Bilgi Teknolojileri" },
  { s: "DESPC", n: "Despec Bilgisayar" }, { s: "ALCAR", n: "Alarko Carrier" }, { s: "MOBTL", n: "Mobiltel İletişim" },
  // Steel & metals
  { s: "ISDMR", n: "İskenderun Demir Çelik" }, { s: "CEMTS", n: "Çemtaş" }, { s: "BURCE", n: "Burçelik" }, { s: "DMSAS", n: "Demisaş" },
  // Chemicals & paint
  { s: "ALKIM", n: "Alkim Kimya" }, { s: "BAGFS", n: "Bagfaş" }, { s: "EGGUB", n: "Ege Gübre" }, { s: "DYOBY", n: "DYO Boya" },
  { s: "SODSN", n: "Sodaş Sodyum" }, { s: "MRSHL", n: "Marshall" },
  // Retail & consumer
  { s: "BIZIM", n: "Bizim Toptan" }, { s: "CRFSA", n: "CarrefourSA" }, { s: "TKNSA", n: "Teknosa" }, { s: "VAKKO", n: "Vakko" },
  { s: "MAVI", n: "Mavi Giyim" }, { s: "SELEC", n: "Selçuk Ecza Deposu" },
  // Food & beverage
  { s: "TATGD", n: "Tat Gıda" }, { s: "KERVT", n: "Kerevitaş" }, { s: "KNFRT", n: "Konfrut Gıda" }, { s: "PNSUT", n: "Pınar Süt" },
  { s: "BANVT", n: "Banvit" }, { s: "PETUN", n: "Pınar Et ve Un" }, { s: "TUKAS", n: "Tukaş" }, { s: "ULUUN", n: "Ulusoy Un" },
  { s: "TBORG", n: "Türk Tuborg" }, { s: "AVOD", n: "A.V.O.D. Gıda" }, { s: "KTSKR", n: "Kütahya Şeker" },
  // Cement & construction materials
  { s: "AKCNS", n: "Akçansa" }, { s: "BUCIM", n: "Bursa Çimento" }, { s: "GOLTS", n: "Göltaş Çimento" }, { s: "NUHCM", n: "Nuh Çimento" },
  { s: "BTCIM", n: "Batıçim" }, { s: "BSOKE", n: "Batısöke Çimento" }, { s: "AFYON", n: "Afyon Çimento" }, { s: "KONYA", n: "Konya Çimento" },
  { s: "ADANA", n: "Adana Çimento" }, { s: "BOLUC", n: "Bolu Çimento" }, { s: "MRDIN", n: "Mardin Çimento" }, { s: "UNYEC", n: "Ünye Çimento" },
  { s: "EGSER", n: "Ege Seramik" }, { s: "KUTPO", n: "Kütahya Porselen" }, { s: "QUAGR", n: "Qua Granite" },
  // Textile & apparel
  { s: "YATAS", n: "Yataş" }, { s: "BLCYT", n: "Bilici Yatırım" }, { s: "DAGI", n: "Dagi Giyim" }, { s: "DESA", n: "Desa Deri" },
  { s: "MNDRS", n: "Menderes Tekstil" }, { s: "KRTEK", n: "Karsu Tekstil" }, { s: "SKTAS", n: "Söktaş" }, { s: "YUNSA", n: "Yünsa" },
  { s: "ARSAN", n: "Arsan Tekstil" }, { s: "BOSSA", n: "Bossa" },
  // Health & pharma
  { s: "DEVA", n: "Deva Holding" }, { s: "RTALB", n: "RTA Laboratuvarları" }, { s: "LKMNH", n: "Lokman Hekim" }, { s: "MPARK", n: "MLP Sağlık" },
  // Real estate (GYO)
  { s: "TRGYO", n: "Torunlar GYO" }, { s: "KLGYO", n: "Kiler GYO" }, { s: "OZKGY", n: "Özak GYO" }, { s: "AKSGY", n: "Akiş GYO" },
  { s: "RYGYO", n: "Reysaş GYO" }, { s: "VKGYO", n: "Vakıf GYO" }, { s: "HLGYO", n: "Halk GYO" }, { s: "ISGYO", n: "İş GYO" },
  { s: "SNGYO", n: "Sinpaş GYO" },
  // Automotive parts
  { s: "PARSN", n: "Parsan" }, { s: "KATMR", n: "Katmerciler" }, { s: "JANTS", n: "Jantsa" }, { s: "BFREN", n: "Bosch Fren" }, { s: "DITAS", n: "Ditaş Doğan" },
  // Tourism, packaging, mining & other
  { s: "MAALT", n: "Marmaris Altınyunus" }, { s: "MARTI", n: "Martı Otel" }, { s: "AYCES", n: "Altınyunus Çeşme" },
  { s: "ANELE", n: "Anel Elektrik" }, { s: "KARTN", n: "Kartonsan" }, { s: "BAKAB", n: "Bak Ambalaj" },
  { s: "IPEKE", n: "İpek Doğal Enerji" }, { s: "PRKME", n: "Park Elektrik" },
];
// BIST 30 (XU030) constituents — used for the 1-year performance leaderboard in TR.
const BIST30 = [
  "AKBNK", "GARAN", "ISCTR", "YKBNK", "VAKBN", "THYAO", "PGSUS", "BIMAS", "MGROS", "ASELS",
  "KCHOL", "SAHOL", "EREGL", "KRDMD", "SISE", "TUPRS", "PETKM", "SASA", "FROTO", "TOASO",
  "ARCLK", "TCELL", "TTKOM", "ENKAI", "ALARK", "KOZAL", "GUBRF", "HEKTS", "OYAKC", "ASTOR",
];
const WITHHOLD_PCT = 15; // approx. withholding tax (stopaj) on deposit/bond interest
let cryptoMarkets = []; // top coins for the active currency: [{ id, symbol, name, price, chg24 }]
let goldPriceGram = 0; // per-gram gold price in the active currency
let goldChg24 = null;  // gold 24h % move
const GRAMS_PER_OZ = 31.1034768;
let usdTry = 0; // TRY per 1 USD (for converting stock prices to the active currency)
let usdTryChg24 = null; // USD/TRY 24h % move
let watchData = {}; // key -> { price, ccy, chg24, chg1mo, chg1y } for watchlist items
let homeMarketData = { usd: null, eur: null, loadedAt: 0, loading: false };
let weatherLoading = false;
let weatherSearchTimer = 0;
let weatherSearchRequest = 0;

// ============================================================
//  i18n dictionary
// ============================================================
const I18N = {
  en: {
    nav_home: "Home", nav_savings: "Expenses", nav_settings: "Settings", nav_more: "More",
    home_title: "Freedom", home_sub: "See how much to save so passive returns cover your expenses.",
    dashboard_title: "Home", dashboard_sub: "Everything important, at a glance.", dashboard_edit: "Edit cards", dashboard_done: "Done",
    fff_hud_aria: "NUMBRR operator status", fff_hud_stats_aria: "Operator statistics", fff_hud_vitals_aria: "Operator indicators", fff_hud_operator: "NUMBRR OPERATOR", fff_hud_role: "Financial field operator", fff_hud_xp: "Experience", fff_hud_energy: "Energy", fff_hud_morale: "Morale", fff_hud_focus: "Focus", fff_hud_active_mission: "ACTIVE MISSION", fff_hud_go: "Open mission", fff_hud_modules: "modules", fff_hud_badges: "badges", fff_hud_level: "Level {level}", fff_hud_status: "{done}/{total} finance modules online", fff_hud_hidden: "This module is hidden. You can enable it from Home settings.", fff_main_menu: "MAIN MENU", fff_system: "SYSTEM:", fff_online: "ONLINE", fff_sync: "DATA SYNC:", fff_version: "VERSION:", fff_connection: "CONNECTION:", fff_strong: "STRONG",
    fff_rank_1: "Ledger recruit", fff_rank_2: "Yield scout", fff_rank_3: "Capital ranger", fff_rank_4: "Vault warden", fff_rank_5: "Finance commander",
    fff_mission_portfolio: "Log your first portfolio asset", fff_mission_income: "Define a monthly income source", fff_mission_expenses: "Create your first expense record", fff_mission_goals: "Set a savings goal", fff_mission_watch: "Add an asset to your watchlist", fff_mission_countdown: "Start a countdown", fff_mission_alert: "Set a price alert", fff_mission_notes: "Leave a field note", fff_mission_savings: "Raise your monthly savings rate", fff_mission_diversity: "Expand portfolio diversity", fff_mission_ready: "Review your smart finance signals",
    currency: "Currency", monthly_expenses: "Monthly expenses", per_month: "/ month",
    real_mode: "Real return mode", real_mode_sub: "Subtract inflation from each rate",
    inflation_label: "Inflation (annual %)",
    headline_tag: "Your easiest path to freedom",
    via: "via {name}", return_word: "return", real_word: "real",
    headline_note: "Save this much and {name}'s return would generate about {monthly}/month, covering your expenses without touching the principal.",
    headline_note_extra: " Some instruments below don't reach freedom at the current inflation assumption.",
    not_reachable: "Not reachable", no_beat_inflation: "No instrument beats inflation",
    not_reachable_note: "At these rates, real returns are zero or negative, passive income can't outpace inflation. Lower your inflation assumption or raise a return rate.",
    rule_badge: "📚 The 4% Rule · Trinity Study", rule_title: "25× your annual expenses",
    rule_text: 'Earn about <strong>4% a year</strong> and you need roughly <strong>25× your annual expenses</strong>, so the returns alone cover your life without draining the principal.',
    rule_number_label: "Your 25× number (at 4%)", rule_link: "Read the Trinity Study →",
    rule_note_USD: "Based on ~30 years of historical US stock & bond returns and a balanced portfolio. A guideline, not a guarantee, past performance doesn't predict the future.",
    rule_note_TL: "Heads-up: the 4% rule is drawn from long-run US market history. In a high-inflation currency like the lira, think in real (after-inflation) terms, switch on Real return mode above for a more honest number.",
    compare_title: "Compare instruments", compare_sub: "Each card shows the savings you'd need so its yearly return pays your expenses. Rates are editable.",
    annual_return: "Annual return", total_required: "total savings required", total_required_re: "total savings required (≈ property value)",
    easiest: "Easiest", volatile: "Volatile", doesnt_outpace: "Doesn't outpace inflation",
    gross_yield: "Gross rental yield", use_property: "Use your own property", optional: "(optional)",
    property_value: "Property value", monthly_rent: "Monthly rent",
    computed_yield: "Computed yield {rate}, rent ÷ property value",
    net_yield: "Net yield", net_yield_sub: "−2% taxes, upkeep & vacancy",
    lbl_real_rate: "Real rate", word_inflation: "inflation", word_gross: "gross", word_costs: "costs", word_yield: "yield",
    eff_real: "Real", eff_net: "Net", eff_effective: "Effective",
    chart_title: "Savings required", chart_sub: "Lower is better, less to save before your money works for you.",
    bar_easiest: "· easiest", out_of_reach: "Out of reach",
    disc_title: "Good to know",
    disc_1: "Estimates for education, not financial advice. Returns are historical or assumed, not guaranteed, and every rate is editable.",
    disc_2: "<strong>Historical ≠ future.</strong> Stock indices (S&P 500, Nasdaq, BIST 100) and Bitcoin returns are historical averages and do not guarantee future performance.",
    disc_3: "<strong>Bitcoin is highly volatile.</strong> Crypto can swing dramatically; treat its return as speculative.",
    disc_4: "<strong>Real estate yields vary.</strong> Rental yields differ widely by city and property type; defaults are national averages (Global Property Guide) and are historical, not a guarantee. Use the property-value & rent fields for your own number.",
    disc_5: "<strong>Rates are defaults.</strong> Every return rate is pre-filled with a reasonable default and is fully editable, tune them to your own assumptions.",
    cut_title: "Your expenses", cut_sub: "Your monthly spending. See what investing it instead could become.",
    expenses_page_title: "Expenses", expenses_page_sub: "Plan the month, track spending and stay ahead of payments.",
    exp_reminders: "Upcoming payments", exp_total: "This month's expenses",
    exp_recurring: "Recurring expenses", exp_recurring_sub: "Add bills and fixed payments that repeat every month.", exp_add_recurring: "+ Add recurring",
    exp_thismonth: "This month's spending", exp_thismonth_sub: "Log everyday spending and see where the month is going.", exp_add: "+ Add expense", exp_history: "Past months",
    exp_cat_ph: "Category", exp_day_ph: "Day", exp_paid: "Paid",
    exp_due_fmt: "Day {day}", exp_empty: "No expenses logged yet.",
    exp_overdue: "Overdue", exp_soon: "Due soon",
    budget_title: "Monthly budget", budget_sub: "Set category limits and follow this month's progress.",
    budget_spent: "Spent", budget_limit: "Budget", budget_remaining: "Remaining", budget_category: "Category",
    budget_save: "Save limit", budget_empty: "No category limit yet.", budget_vehicle: "Vehicle",
    budget_progress: "{rate}% of the monthly budget used", budget_no_limit: "Add a category limit to start planning.",
    budget_over: "Budget exceeded by {amount}", budget_unbudgeted: "{amount} has no category limit.", budget_saved: "Category limit saved.", budget_invalid: "Enter a category and an amount above zero.",
    veh_title: "My vehicles", veh_sub: "Keep vehicle details, reminders and expenses together.", veh_add: "Add vehicle", veh_model_ph: "Vehicle model",
    veh_count: "{count} vehicles", veh_empty_title: "Your garage is empty", veh_empty_sub: "Add a vehicle to calculate route fuel costs and track maintenance.", veh_remove: "Remove vehicle",
    veh_reminders: "Payment reminders", veh_add_reminder: "+ Add reminder", veh_label_ph: "Insurance, tax…",
    veh_expenses: "Expenses", veh_add_expense: "+ Add expense", veh_monthly: "This month",
    vsched: { insurance: "Insurance", kasko: "Casco", tax: "Tax", inspection: "Inspection", service: "Service" },
    vcat: { fuel: "Fuel", service: "Service", parking: "Parking", fine: "Fine", tires: "Tires", wash: "Wash" },
    ecat: { rent: "Rent", bills: "Bills", market: "Groceries", food: "Eating out", electric: "Electricity", water: "Water", internet: "Internet", transport: "Transport", health: "Health", shopping: "Shopping", entertainment: "Entertainment", other: "Other" },
    add_custom: "+ Add custom category", custom_ph: "Custom category", eg: "e.g.",
    redirect_label: "If you redirect this every month", per_mo: "{x} /mo", per_year: "{x} a year",
    invested_in: "Invested in", yr1: "1 year", yr5: "5 years", yr10: "10 years",
    punch: "By cutting these habits and investing, you could have {x} in 10 years.",
    punch_empty: "Toggle on the habits you want to quit and type what you spend to see your number.",
    savings_note: "Projection compounds yearly contributions: FV = annual × [((1 + r)ⁿ − 1) / r], where r is the selected annual return. Returns are assumptions, not guarantees.",
    settings_title: "Settings", language: "Language", theme: "Theme", country: "Country", sound: "Sound", sound_fx: "Sound effects", motion: "Motion", animations: "Animations", animations_sub: "Show interface transitions and decorative motion",
    home_customize_title: "Home screen", home_customize_desc: "Drag cards to reorder them or hide the ones you do not use. Restore hidden cards here.", home_customize_reset: "Reset layout", home_move_up: "Move up", home_move_down: "Move down", home_hide: "Show this widget", home_card_drag: "Drag to move", home_card_drop: "Drop here", home_card_hide: "Hide card", home_card_show: "Show card", home_last_card: "At least one widget must remain visible.",
    home_widget_freedom: "Freedom calculator", home_widget_portfolio: "Portfolio", home_widget_income: "Income", home_widget_expenses: "Expenses", home_widget_monthly: "This month", home_widget_health: "Financial health", home_widget_markets: "FX & gold", home_widget_marketSnapshot: "Market snapshot", home_widget_topPerformers: "Top performers", home_widget_weather: "Weather", home_widget_car: "My car", home_widget_watch: "Watchlist", home_widget_price_bubbles: "Price bubbles", home_widget_goals: "Savings goals", home_widget_notes: "Mini notes", home_widget_insights: "Smart insights", home_widget_alerts: "Price alerts", home_widget_countdown: "Countdowns",
    home_holdings: "{count} holdings", home_passive: "{amount} passive / month", home_upcoming: "{count} upcoming payments", home_vehicles: "{count} vehicles", home_last_trip: "Last trip: {route}", home_no_route: "No saved route", home_watch_count: "{count} tracked assets", home_watch_empty: "No tracked assets", home_freedom_summary: "{amount} · {name}",
    command_nav: "Command", command_nav_title: "Open command bar", command_eyebrow: "Smart command", command_title: "Write a command", command_sub: "Write naturally in Turkish. Portfolio changes are always confirmed first.", command_input_label: "Your command", command_placeholder: "Bir şey yaz…", command_send: "Send command", command_examples_title: "Suggested commands", command_detected: "Detected", command_buy: "Purchase detected", command_sell: "Sale detected", command_swap: "Swap detected", command_alert: "Price alert detected", command_open: "Asset page detected", command_favorite: "Favorite change detected", command_currency: "Base currency change detected", command_query: "Portfolio insight detected", command_asset: "Asset", command_quantity: "Quantity", command_price: "Price", command_total: "Total", command_date: "Date", command_confirm: "Confirm", command_edit: "Edit", command_cancel: "Cancel", command_applied: "Command applied ✓", command_understood: "I understood this command.", command_low_confidence: "I couldn't fully understand that.", command_no_asset: "Choose a supported asset first.", command_no_action: "What would you like to do with this asset?", command_ambiguous: "Which matching asset did you mean?", command_suggestion_buy: "Add to portfolio", command_suggestion_sell: "Record a sale", command_suggestion_cancel: "Cancel", command_needs_price: "A live price is needed to prepare this preview.", command_current_price: "Current price", command_average_cost: "Weighted average cost", command_pnl: "This month's PnL", command_realized: "Realized", command_unrealized: "Unrealized", command_allocation: "Portfolio allocation", command_top_performer: "Top performer", command_no_data: "There is not enough portfolio data yet.", command_no_holding: "This asset is not in your portfolio.", command_insufficient: "The portfolio does not contain enough of this asset.", command_eur_unsupported: "EUR base currency is not available in this version.", command_percent: "Change", command_condition: "Condition", command_above: "above", command_below: "below", command_percent_up: "% up", command_percent_down: "% down", command_today: "today", command_not_saved: "Nothing was changed.", command_help_title: "Available commands", command_help_intro: "Write one of these examples and send it.", command_help_trade: "Transactions & alerts", command_help_portfolio: "Portfolio", command_help_asset: "Assets & favorites", command_help_settings: "Settings", command_app: "App data", command_navigation: "Navigation", command_help_queries: "Quick reports", command_expenses: "Expense", command_income: "Income", command_balance: "Balance", command_monthly_expenses: "Monthly expenses", command_label: "Name / detail", command_target: "Target", command_destination: "Page", command_note: "Note", command_navigation_done: "Opened ✓", command_expense_added: "Expense added ✓", command_goal_added: "Savings goal added ✓", command_countdown_added: "Countdown added ✓", command_invalid_amount: "Enter a positive amount.", command_date_needed: "Choose a future date.", command_label_needed: "Add a name or description.",
    monthly_summary_title: "This month", monthly_summary_sub: "Income, spending and savings at a glance.", monthly_income: "Income", monthly_expense: "Expenses", monthly_net: "Net", monthly_rate: "Savings rate: {rate}%", monthly_no_income: "Add monthly income to calculate your savings rate.", monthly_share: "Share", monthly_share_title: "Share this month's spending", monthly_share_card_title: "Monthly spending", monthly_share_expenses: "Total spent", monthly_share_daily: "Daily average", monthly_share_largest: "Largest expense", monthly_share_records: "Expense entries", monthly_share_no_category: "Uncategorized", monthly_share_photo: "Choose photo", monthly_share_random: "Random cat", monthly_share_photo_loaded: "Photo applied to the card.", monthly_share_photo_failed: "Choose a supported image under 12 MB.", monthly_share_random_loaded: "Random cat background selected.", monthly_share_preview_title: "Monthly spending card", monthly_share_preview_sub: "Choose a background, then copy or download.", monthly_share_copy: "Copy image", monthly_share_download: "Download", monthly_share_system: "Share", monthly_share_close: "Close", monthly_share_copied: "Image copied.", monthly_share_copy_failed: "Image copy is not supported here. Use Download instead.", monthly_share_system_unavailable: "System sharing is not available here. Use Download instead.", monthly_share_text: "I spent {amount} this month.", monthly_share_downloaded: "Summary image downloaded.", monthly_share_failed: "Couldn't prepare the summary image.",
    health_title: "Financial health", health_sub: "A score based on your current data.", health_note: "Savings rate, passive income, buffer and diversification.", health_weak: "Needs attention", health_fair: "Getting stronger", health_good: "Healthy", health_excellent: "Excellent",
    market_summary_title: "FX & gold", market_summary_sub: "Current TRY market snapshot.", market_usd: "USD / TRY", market_eur: "EUR / TRY", market_gold: "Gram gold", market_loading: "Loading live prices…", market_unavailable: "Price unavailable",
    weather_title: "Weather", weather_sub: "Local forecast at a glance.", weather_change_location: "Change location", weather_refresh: "Refresh weather", weather_search_ph: "Search city…", weather_use_location: "Use my location", weather_current_location: "Current location", weather_loading: "Loading weather…", weather_unavailable: "Weather is unavailable right now.", weather_no_results: "No matching city found.", weather_location_denied: "Location access was not available. Search for a city instead.", weather_feels_like: "Feels like {temp}", weather_wind: "Wind {speed}", weather_rain: "Rain {rate}%", weather_updated: "Updated {time}", weather_today: "Today", weather_tomorrow: "Tomorrow", weather_clear: "Clear", weather_partly_cloudy: "Partly cloudy", weather_cloudy: "Cloudy", weather_fog: "Foggy", weather_drizzle: "Drizzle", weather_rainy: "Rainy", weather_snow: "Snowy", weather_showers: "Showers", weather_thunderstorm: "Thunderstorm",
    goal_title: "Savings goals", goal_sub: "Create separate goals in Turkish lira or US dollars.", goal_name: "Goal", goal_name_ph: "Emergency fund, car…", goal_target: "Target", goal_current: "Saved", goal_currency: "Currency", goal_add: "Add goal", goal_empty: "No savings goal yet.", goal_invalid: "Enter a goal name and a valid target amount.", goal_added: "Savings goal added ✓", goal_remove: "Remove goal", goal_progress: "{current} of {target}", goal_completed: "Goal reached",
    notes_title: "Mini notes", notes_sub: "Keep short reminders close.", note_ph: "Write a short note…", note_add: "Add", note_empty: "No notes yet.", note_remove: "Remove note",
    insights_title: "Smart insights", insights_sub: "Automatic observations from your data.", insight_setup_title: "Complete your numbers", insight_setup_body: "Add income and expenses to unlock personalised insights.", insight_cash_positive_title: "Positive cash flow", insight_cash_positive_body: "Income is {amount} above expenses this month.", insight_cash_negative_title: "Spending is above income", insight_cash_negative_body: "You are currently {amount} short this month.", insight_rate_title: "Savings rate", insight_rate_body: "You are keeping {rate}% of monthly income.", insight_passive_title: "Passive coverage", insight_passive_body: "Passive income covers {rate}% of monthly expenses.", insight_expense_up_title: "Expenses increased", insight_expense_up_body: "This month is {rate}% above the last archived month.", insight_expense_down_title: "Expenses decreased", insight_expense_down_body: "This month is {rate}% below the last archived month.", insight_goal_title: "Closest savings goal", insight_goal_body: "{name} is {rate}% complete.", insight_upcoming_title: "Upcoming payments", insight_upcoming_body: "You have {count} unpaid payment or maintenance reminders.", insight_budget_title: "Budget pressure", insight_budget_body: "{name} is at {rate}% of its monthly limit.", insight_concentration_title: "Portfolio concentration", insight_concentration_body: "{name} makes up {rate}% of your portfolio; one move has an outsized impact.", insight_runway_title: "Safety buffer", insight_runway_body: "Your portfolio could cover about {months} months of planned expenses.", insight_diversification_title: "Diversification gap", insight_diversification_body: "Your portfolio spans {count} asset groups; spreading risk can soften shocks.", insight_goal_momentum_title: "Goal momentum", insight_goal_momentum_body: "{name} is {rate}% complete; {amount} remains.", insight_more_title: "More data, sharper insights", insight_more_body: "Add income, expenses or goals so the analyser can surface more useful signals.",
    countdown_title: "Countdowns", countdown_sub: "Pick a target date from the calendar and follow it in days or months.", countdown_name: "Name", countdown_category: "Category", countdown_date: "Target date", countdown_unit: "Show as", countdown_days: "Days", countdown_months: "Months", countdown_add: "Add countdown", countdown_name_ph: "Vacation, exam, goal…", countdown_category_ph: "Travel, work, personal…", countdown_empty: "No countdown yet.", countdown_invalid: "Enter a name and choose a future date.", countdown_day_left: "day left", countdown_days_left: "days left", countdown_month_left: "month left", countdown_months_left: "months left", countdown_done: "Time's up", countdown_target: "Target: {date}", countdown_remove: "Remove countdown", countdown_switch_unit: "Switch days / months", countdown_added: "Countdown added ✓", countdown_active: "{count} active countdowns",
    pwa_title: "App & offline use", pwa_desc: "Install NumBrrr on your phone and keep using saved data without internet.", pwa_install: "Install app", pwa_ready: "Offline use is ready.", pwa_installed: "NumBrrr is installed on this device.", pwa_ios: "Use your browser's Add to Home Screen command to install.", pwa_unsupported: "This browser does not support app installation.", offline_banner: "You are offline · showing the latest saved data",
    notify_title: "Notifications", notify_desc: "Get price alerts and upcoming vehicle maintenance reminders, including while the app is closed when background service is available.", notify_enable: "Enable notifications",
    notify_active: "Background notifications are active.", notify_syncing: "Connecting background notifications…", notify_background_unavailable: "Background service is not configured; alerts will still work while the app is open.", notify_inapp: "System notifications are unavailable; alerts will appear inside the app.", notify_blocked: "Notification permission is blocked in browser settings.", notify_off: "Notifications are off.", notify_privacy: "Only alert conditions and maintenance dates are synced for background delivery.",
    vehicle_notify: "Vehicle maintenance reminder", days_before: "days before",
    price_alerts: "Price alerts", home_alert_sub: "Search any asset and set the price you want to be notified at.", home_alert_ready: "Notifications are on; active alerts are checked automatically.", home_alert_off: "The alert will be saved; turn on notifications in Settings to receive it.", alert_asset: "Asset", alert_search_ph: "Search gold, stocks, crypto…", alert_condition: "Condition", alert_above: "Rises above", alert_below: "Falls below", alert_target: "Target price", alert_add: "Add alert",
    alert_empty: "No price alerts yet.", alert_watch_empty: "Add an asset to your Watch list first.", alert_invalid: "Choose an asset and enter a valid target price.", alert_added: "Price alert added ✓", alert_remove: "Remove alert",
    price_alert_title: "Price alert", price_alert_body: "{name} is now {price} ({condition} {target}).",
    vehicle_alert_title: "Vehicle reminder", vehicle_alert_body: "{vehicle}: {label} {when}.", vehicle_due_today: "is due today", vehicle_due_days: "is due in {days} days", vehicle_overdue_days: "is {days} days overdue",
    backup_title: "Data backup", backup_desc: "Save all your data as a file or restore it on another phone.", backup_export: "Export backup", backup_import: "Import backup",
    backup_ready: "Backup downloaded: {date}", backup_imported: "Backup restored. Reloading…", backup_invalid: "This file is not a valid NumBrrr backup.", backup_too_large: "The backup file is too large.", backup_confirm: "Importing will replace the current data. Continue?", backup_last: "Last backup: {date}",
    onb_title: "Welcome to NumBrrr", onb_sub: "Pick your country and language to get started. You can change these anytime in Settings.",
    onb_country: "Country", onb_language: "Language", onb_start: "Continue",
    guide_title: "Quick guide", guide_ok: "Got it",
    guide_portfolio: "Add everything you own: stocks, crypto, gold, dollars, cash. You'll see your breakdown and monthly cash flow.",
    guide_income: "Enter your monthly income. Tick the passive ones like rent and interest, since only those count toward freedom.",
    guide_expenses: "Enter this month's spending, set reminders for your regular bills, and add what your car costs you.",
    guide_car: "Plan routes by province and district with distance, time, and fuel cost; save car profiles and track trip expenses.",
    guide_freedom: "Your editable dashboard: open summaries, countdowns and the Freedom calculator from one place.",
    guide_watch: "Search for the assets you care about, favorite them, and keep an eye on their prices.",
    theme_glass: "Liquid Glass", theme_glass_desc: "Modern frosted glass (default)",
    theme_xp: "Windows XP", theme_xp_desc: "Nostalgic early-2000s Luna blue",
    theme_medieval: "Medieval", theme_medieval_desc: "Gritty 15th-century parchment & iron",
    theme_doge: "Doge", theme_doge_desc: "such wow · much finance · very meme",
    theme_neon: "Neon", theme_neon_desc: "80s neon dream · A E S T H E T I C",
    theme_solana: "Solana", theme_solana_desc: "Purple & green · degen mode",
    theme_black: "Black Theme", theme_black_desc: "Flat black · blue accents",
    theme_terminal: "NUMBRR Terminal", theme_terminal_desc: "Phosphor green · focused finance console",
    theme_fff: "FFF", theme_fff_desc: "Original phosphor terminal · NUMBRR system",
    more_soon: "More features coming soon ✨",
    nav_car: "My car",
    car_title: "My car",
    car_route: "Route", car_route_sub: "Plan the route and see the estimated trip cost.", car_from: "From", car_to: "To", car_pick_province: "Select province", car_loading: "Loading route data…",
    car_center: "Center (province seat)", car_need_provinces: "Pick origin and destination province.", car_district: "District",
    car_calc: "Calculate route", car_calculating: "Calculating…",
    car_same_province: "Pick two different locations.", car_route_fail: "Couldn't reach the route service, showing an estimate.",
    car_no_profile: "Add a car profile to see fuel cost.",
    car_distance: "Distance", car_duration: "Est. time",
    car_cost_one: "One way fuel", car_cost_round: "Round trip fuel",
    car_oneway: "One way", car_roundtrip: "Round trip", car_toll: "Toll", car_parking: "Parking", car_other_cost: "Other", car_extra_costs_title: "Additional trip costs",
    car_trip_total: "Trip total", car_extra_total: "Extra costs", car_open_map: "Open in Maps ↗",
    car_route_map: "Route map", car_map_hint: "Drag and zoom the map", car_map_unavailable: "The interactive map could not load. Use Open in Maps instead.",
    car_add_favorite: "Add favorite", car_favorite_saved: "Favorite route saved ★", car_favorites: "Favorite routes",
    car_clear: "Clear route", car_details: "Details", car_vehicle: "Vehicle", car_route_type: "Trip type", car_fuel_cost: "Fuel cost",
    car_save_trip: "Save trip", car_trip_saved: "Trip saved ✓",
    car_profiles: "Car profiles", car_add_profile: "+ Add car", car_model_ph: "Brand & model",
    car_fuel_type: "Fuel", car_consumption: "Consumption", car_consumption_hint: "/100 km",
    car_price: "Fuel price", car_price_hint: "per L / kWh", car_active: "Active",
    car_fuel_gas: "Petrol", car_fuel_diesel: "Diesel", car_fuel_lpg: "LPG", car_fuel_electric: "Electric", car_fuel_hybrid: "Hybrid",
    car_history: "Trip history", car_history_sub: "Review saved routes and total trip costs.", car_history_empty: "No trips saved yet.",
    car_oneway_label: "one way", car_roundtrip_label: "round trip",
    car_expenses: "Trip expenses", car_add_expense: "+ Add expense", car_exp_empty: "No expenses added yet.",
    car_general_trip: "General", car_amount_ph: "Amount", car_link_trip: "Trip",
    car_cat_fuel: "Fuel", car_cat_food: "Food", car_cat_parking: "Parking", car_cat_toll: "Toll", car_cat_maintenance: "Maintenance", car_cat_other: "Other",
    car_report: "Expense report", car_report_total: "Grand total", car_report_fuel_est: "Estimated route fuel",
    car_report_empty: "Add trips and expenses to see the report.",
    nav_portfolio: "Portfolio",
    portfolio_title: "Your portfolio", portfolio_sub: "Add what you own and see your allocation.",
    holding_ph: "Holding name", add_holding: "+ Add holding", total_value: "Total portfolio value",
    portfolio_holdings_title: "My assets", portfolio_holdings_sub: "Manage quantities, asset types and current values.", portfolio_count: "{count} assets",
    portfolio_amount: "Amount", portfolio_current_value: "Current value", portfolio_remove: "Remove asset",
    flow_title: "Monthly cash flow", flow_income: "Income", flow_expenses: "Expenses", flow_net: "Net / month", flow_last_month: "Last month: {x}",
    net_worth_title: "Net worth", net_worth_sub: "Monthly portfolio assets minus your total debt.", net_worth_auto: "Auto saved",
    net_worth_assets: "Assets", net_worth_debt: "Debt", net_worth_net: "Net worth", net_worth_history: "Net worth history",
    net_worth_empty: "Add a portfolio asset or debt to start the graph.", net_worth_debt_input: "Total debt",
    net_worth_debt_note: "Credit cards, loans and other outstanding debt.", net_worth_chart_empty: "No monthly record yet.",
    net_worth_chart_desc: "Net worth by month: {values}",
    flow_savings_note: "+{x}/month more if you cut your tracked spending.",
    cat_cash: "Cash", cat_investment: "Investment",
    asset_stocks: "Stocks", asset_usstock: "US Stocks", asset_bist: "Turkish (BIST)", asset_crypto: "Crypto", asset_deposit: "Deposit", asset_bonds: "Bonds", asset_realestate: "Real estate", asset_gold: "Gold", asset_gold_oz: "Gold (oz)", asset_usd: "US Dollar", asset_cash: "Cash",
    stock_search_ph: "Search stock (e.g. Apple)", shares_ph: "Shares",
    nav_watchlist: "Watch", watch_title: "Watchlist", watch_sub: "Search markets and keep important assets close.", watch_count: "{count} assets",
    watch_search_ph: "Search gold, stocks, crypto…", watch_empty: "Search above and tap to add assets to your watchlist.", watch_chart: "Open chart on TradingView",
    market_snapshot_title: "Market snapshot", market_snapshot_sub: "Current BIST, currency and gold prices.",
    top_perf_title: "This year's top performers", top_perf_sub: "Assets with the strongest one-year performance.", asset_silver: "Silver", top_perf_loading: "Ranking the past year…",
    watch_ccy: "Show price in USD / TL", watch_chart_full: "Open full chart on TradingView ↗",
    tr_index: "Borsa Istanbul", tr_forex: "Currencies", tr_gold: "Gold (TRY)",
    gold_gram: "Gram Gold", gold_quarter: "Quarter Gold", gold_half: "Half Gold", gold_full: "Full Gold",
    lbl_24h: "24h", lbl_1mo: "1M", lbl_1yr: "1Y",
    inc_from_portfolio: "+{x}/mo from portfolio",
    net_tax: "Net (−15% tax)", coin_search_ph: "Search coin (e.g. Solana)", qty_ph: "Qty", coin_loading: "Loading live prices…", grams_ph: "Grams", oz_ph: "Ounces",
    target_via: "Freedom target via (pick one or more)", target_x: "Target {x}", to_freedom: "to financial freedom", blended_return: "Blended return",
    income_line: "Right now your portfolio could generate about {income}/month, covering {pct} of your expenses.",
    freedom_reached: "🎉 You've reached your freedom number. Your investments can cover your expenses!",
    portfolio_empty: "Add holdings below to see the breakdown.",
    portfolio_note: "Freedom target = yearly expenses ÷ chosen return. Passive income = value × return. Estimates, not advice.",
    nav_income: "Income",
    income_title: "Your income", income_sub: "Add your income. Mark the passive ones, only they count toward freedom.",
    income_sources_title: "Income sources", income_sources_sub: "Separate active and passive income in one clear view.", income_source_count: "{count} sources",
    add_income: "+ Add income", income_ph: "Income source", total_income: "Total monthly income", income_remove: "Remove income source",
    passive_label: "Passive", active_label: "Active", covered_by_passive: "covered by passive income",
    surplus_line: "You have about {x}/month left to invest.", deficit_line: "You spend about {x}/month more than you earn.",
    income_free: "🎉 Financially free: your passive income already covers your expenses!",
    income_empty: "Add your income above to see where you stand.",
    income_note: "Passive income = rent, interest, dividends, and similar. Financial freedom = passive income ≥ your expenses.",
    inc: { salary: "Salary", rental: "Rental income", interest: "Interest income", dividends: "Dividends", side: "Side / freelance income" },
    note_historical: "Based on historical averages, not a guarantee.",
    note_btc_warn: "Bitcoin is highly volatile; this figure is speculative.",
    note_btc_tl: "Trailing ~12-month return in lira terms (≈ +37%, as of mid-2026, source: CoinGecko). Bitcoin is extremely volatile, a single year is not a forecast.",
    re_note_USD: "Default gross yield ≈ 6.6% (Global Property Guide national average, Q4 2025). Rental yields vary widely by city and property type, historical, not a guarantee.",
    re_note_TL: "Default gross yield ≈ 7.3% (Global Property Guide national average, Q1 2026). Rental yields vary widely by city and property type, historical, not a guarantee.",
    inst: {
      savings: { name: "Savings / Money Market", sub: "High-yield savings" },
      treasury: { name: "US Treasury Bonds", sub: "~10-year approx." },
      sp500: { name: "S&P 500", sub: "SPX historical avg." },
      nasdaq: { name: "Nasdaq 100", sub: "Historical avg." },
      btc: { name: "Bitcoin (BTC)", sub: "Speculative", sub_tl: "Last 12 mo. · TRY" },
      realestate: { name: "Real Estate", sub: "Rental yield · rent ÷ value" },
      deposit: { name: "TL Deposit", sub: "Annual interest rate" },
      gold: { name: "Gold (in TL)", sub: "Gold priced in lira" },
      bist: { name: "BIST 100", sub: "Borsa Istanbul avg." },
      eurobond: { name: "Eurobond / FX deposit", sub: "FX-linked return" },
    },
  },

  tr: {
    nav_home: "Ana Sayfa", nav_savings: "Giderler", nav_settings: "Ayarlar", nav_more: "Daha",
    home_title: "Özgürlük", home_sub: "Giderlerini pasif gelirle karşılamak için ne kadar biriktirmen gerektiğini gör.",
    dashboard_title: "Ana Sayfa", dashboard_sub: "Önemli olan her şey tek bakışta.", dashboard_edit: "Kartları düzenle", dashboard_done: "Bitti",
    fff_hud_aria: "NUMBRR operatör durumu", fff_hud_stats_aria: "Operatör istatistikleri", fff_hud_vitals_aria: "Operatör göstergeleri", fff_hud_operator: "NUMBRR OPERATÖRÜ", fff_hud_role: "Finans saha operatörü", fff_hud_xp: "Deneyim", fff_hud_energy: "Enerji", fff_hud_morale: "Moral", fff_hud_focus: "Odak", fff_hud_active_mission: "AKTİF GÖREV", fff_hud_go: "Göreve git", fff_hud_modules: "modül", fff_hud_badges: "rozet", fff_hud_level: "Seviye {level}", fff_hud_status: "{done}/{total} finans modülü çevrimiçi", fff_hud_hidden: "Bu modül gizli. Ana sayfa ayarlarından görünür yapabilirsin.", fff_main_menu: "ANA MENÜ", fff_system: "SİSTEM:", fff_online: "ÇEVRİMİÇİ", fff_sync: "VERİ SENKRON:", fff_version: "SÜRÜM:", fff_connection: "BAĞLANTI:", fff_strong: "GÜÇLÜ",
    fff_rank_1: "Kayıt çırağı", fff_rank_2: "Getiri izcisi", fff_rank_3: "Sermaye korucusu", fff_rank_4: "Kasa muhafızı", fff_rank_5: "Finans komutanı",
    fff_mission_portfolio: "İlk varlığını portföye kaydet", fff_mission_income: "Aylık gelir kaynağını tanımla", fff_mission_expenses: "İlk gider kaydını oluştur", fff_mission_goals: "Bir birikim hedefi belirle", fff_mission_watch: "Takip listene bir varlık ekle", fff_mission_countdown: "Bir geri sayım başlat", fff_mission_alert: "Bir fiyat alarmı kur", fff_mission_notes: "Bir saha notu bırak", fff_mission_savings: "Aylık birikim oranını yükselt", fff_mission_diversity: "Portföy çeşitliliğini artır", fff_mission_ready: "Akıllı finans sinyallerini incele",
    currency: "Para Birimi", monthly_expenses: "Aylık giderler", per_month: "/ ay",
    real_mode: "Reel getiri modu", real_mode_sub: "Her orandan enflasyonu düş",
    inflation_label: "Enflasyon (yıllık %)",
    headline_tag: "Özgürlüğe en kolay yolun",
    via: "{name} ile", return_word: "getiri", real_word: "reel",
    headline_note: "Bu kadar biriktir; {name} getirisi ayda yaklaşık {monthly} üretir, anaparaya dokunmadan giderlerini karşılar.",
    headline_note_extra: " Aşağıdaki bazı araçlar mevcut enflasyon varsayımında özgürlüğe ulaşamıyor.",
    not_reachable: "Ulaşılamaz", no_beat_inflation: "Hiçbir araç enflasyonu yenmiyor",
    not_reachable_note: "Bu oranlarda reel getiriler sıfır veya negatif, pasif gelir enflasyonu geçemez. Enflasyon varsayımını düşür veya bir getiri oranını yükselt.",
    rule_badge: "📚 %4 Kuralı · Trinity Çalışması", rule_title: "Yıllık giderinin 25 katı",
    rule_text: 'Yılda yaklaşık <strong>%4</strong> kazanırsan, getirinin tek başına yaşamını karşılaması için kabaca <strong>yıllık giderinin 25 katına</strong> ihtiyacın olur, anaparaya dokunmadan.',
    rule_number_label: "25× rakamın (%4'te)", rule_link: "Trinity Çalışması'nı oku →",
    rule_note_USD: "~30 yıllık ABD hisse ve tahvil getirilerine ve dengeli bir portföye dayanır. Bir kılavuzdur, garanti değildir, geçmiş performans geleceği belirlemez.",
    rule_note_TL: "Not: %4 kuralı uzun vadeli ABD piyasa geçmişinden gelir. Lira gibi yüksek enflasyonlu bir para biriminde reel (enflasyon sonrası) düşün, daha dürüst bir rakam için yukarıdaki Reel getiri modunu aç.",
    compare_title: "Araçları karşılaştır", compare_sub: "Her kart, yıllık getirisinin giderlerini karşılaması için gereken birikimi gösterir. Oranlar düzenlenebilir.",
    annual_return: "Yıllık getiri", total_required: "gereken toplam birikim", total_required_re: "gereken toplam birikim (≈ mülk değeri)",
    easiest: "En kolay", volatile: "Oynak", doesnt_outpace: "Enflasyonu geçemiyor",
    gross_yield: "Brüt kira getirisi", use_property: "Kendi mülkünü gir", optional: "(opsiyonel)",
    property_value: "Mülk değeri", monthly_rent: "Aylık kira",
    computed_yield: "Hesaplanan getiri {rate}, kira ÷ mülk değeri",
    net_yield: "Net getiri", net_yield_sub: "−%2 vergi, bakım ve boşluk",
    lbl_real_rate: "Reel oran", word_inflation: "enflasyon", word_gross: "brüt", word_costs: "maliyet", word_yield: "getiri",
    eff_real: "Reel", eff_net: "Net", eff_effective: "Efektif",
    chart_title: "Gereken birikim", chart_sub: "Düşük olması iyidir; paran senin için çalışmaya başlamadan önce daha az birikim gerekir.",
    bar_easiest: "· en kolay", out_of_reach: "Ulaşılamaz",
    disc_title: "Bilmekte fayda var",
    disc_1: "Eğitim amaçlı tahminlerdir, finansal tavsiye değildir. Getiriler tarihsel ya da varsayımdır, garanti edilmez ve tüm oranlar düzenlenebilir.",
    disc_2: "<strong>Geçmiş ≠ gelecek.</strong> Hisse endeksleri (S&P 500, Nasdaq, BIST 100) ve Bitcoin getirileri tarihsel ortalamalardır ve gelecekteki performansı garanti etmez.",
    disc_3: "<strong>Bitcoin son derece oynaktır.</strong> Kripto sert dalgalanabilir; getirisini spekülatif olarak değerlendir.",
    disc_4: "<strong>Kira getirileri değişir.</strong> Kira getirileri şehre ve mülk tipine göre çok farklılaşır; varsayılanlar ulusal ortalamalardır (Global Property Guide) ve tarihseldir, garanti değildir. Kendi rakamın için mülk değeri ve kira alanlarını kullan.",
    disc_5: "<strong>Oranlar varsayılandır.</strong> Her getiri oranı makul bir varsayılanla doldurulmuştur ve tamamen düzenlenebilir, kendi varsayımlarına göre ayarla.",
    cut_title: "Giderlerin", cut_sub: "Aylık harcamaların. Bunları yatırıma yönlendirirsen ne olabileceğini gör.",
    expenses_page_title: "Giderler", expenses_page_sub: "Ayı planla, harcamaları izle ve ödemelerin önünde kal.",
    exp_reminders: "Yaklaşan ödemeler", exp_total: "Bu ayki giderler",
    exp_recurring: "Düzenli giderler", exp_recurring_sub: "Her ay tekrarlanan fatura ve sabit ödemelerini ekle.", exp_add_recurring: "+ Düzenli gider ekle",
    exp_thismonth: "Bu ayki harcamaların", exp_thismonth_sub: "Günlük harcamaları kaydet, ayın nereye gittiğini gör.", exp_add: "+ Harcama ekle", exp_history: "Geçmiş aylar",
    exp_cat_ph: "Kategori", exp_day_ph: "Gün", exp_paid: "Ödendi",
    exp_due_fmt: "Ayın {day}'i", exp_empty: "Henüz harcama eklenmedi.",
    exp_overdue: "Gecikmiş", exp_soon: "Yaklaşıyor",
    budget_title: "Aylık bütçe", budget_sub: "Kategorilere limit koy ve bu ayın ilerlemesini takip et.",
    budget_spent: "Harcanan", budget_limit: "Bütçe", budget_remaining: "Kalan", budget_category: "Kategori",
    budget_save: "Limiti kaydet", budget_empty: "Henüz kategori limiti yok.", budget_vehicle: "Araç",
    budget_progress: "Aylık bütçenin %{rate} kadarı kullanıldı", budget_no_limit: "Planlamaya başlamak için kategori limiti ekle.",
    budget_over: "Bütçe {amount} aşıldı", budget_unbudgeted: "{amount} harcamanın kategori limiti yok.", budget_saved: "Kategori limiti kaydedildi.", budget_invalid: "Kategori ve sıfırdan büyük bir tutar gir.",
    veh_title: "Araçlarım", veh_sub: "Araç bilgilerini, hatırlatmaları ve harcamaları tek yerde yönet.", veh_add: "Araç ekle", veh_model_ph: "Araç modeli",
    veh_count: "{count} araç", veh_empty_title: "Garajın henüz boş", veh_empty_sub: "Rota yakıt maliyetini hesaplamak ve bakımları takip etmek için araç ekle.", veh_remove: "Aracı kaldır",
    veh_reminders: "Ödeme hatırlatmaları", veh_add_reminder: "+ Hatırlatma ekle", veh_label_ph: "Sigorta, vergi…",
    veh_expenses: "Harcamalar", veh_add_expense: "+ Harcama ekle", veh_monthly: "Bu ay",
    vsched: { insurance: "Sigorta", kasko: "Kasko", tax: "Vergi (MTV)", inspection: "Muayene", service: "Bakım" },
    vcat: { fuel: "Yakıt", service: "Bakım", parking: "Otopark", fine: "Ceza", tires: "Lastik", wash: "Yıkama" },
    ecat: { rent: "Kira", bills: "Fatura", market: "Market", food: "Yemek", electric: "Elektrik", water: "Su", internet: "İnternet", transport: "Ulaşım", health: "Sağlık", shopping: "Alışveriş", entertainment: "Eğlence", other: "Diğer" },
    add_custom: "+ Özel kategori ekle", custom_ph: "Özel kategori", eg: "örn.",
    redirect_label: "Bunu her ay yatırıma yönlendirsen", per_mo: "{x} /ay", per_year: "{x} yıllık",
    invested_in: "Şuna yatırılırsa", yr1: "1 yıl", yr5: "5 yıl", yr10: "10 yıl",
    punch: "Bu alışkanlıkları bırakıp yatırım yaparak 10 yılda {x} elde edebilirsin.",
    punch_empty: "Bırakmak istediğin alışkanlıkları aç ve harcamanı yaz; rakamını gör.",
    savings_note: "Projeksiyon yıllık katkıları bileşik hesaplar: GD = yıllık × [((1 + r)ⁿ − 1) / r], r seçilen yıllık getiridir. Getiriler varsayımdır, garanti değildir.",
    settings_title: "Ayarlar", language: "Dil", theme: "Tema", country: "Ülke", sound: "Ses", sound_fx: "Ses efektleri", motion: "Hareket", animations: "Animasyonlar", animations_sub: "Arayüz geçişlerini ve dekoratif hareketleri göster",
    home_customize_title: "Ana sayfa", home_customize_desc: "Kartları tutup sırala veya kullanmadıklarını gizle. Gizlenenleri buradan geri aç.", home_customize_reset: "Düzeni sıfırla", home_move_up: "Yukarı taşı", home_move_down: "Aşağı taşı", home_hide: "Bu kartı göster", home_card_drag: "Taşımak için tut", home_card_drop: "Buraya bırak", home_card_hide: "Kartı gizle", home_card_show: "Kartı göster", home_last_card: "En az bir kart görünür kalmalı.",
    home_widget_freedom: "Özgürlük hesaplayıcısı", home_widget_portfolio: "Portföy", home_widget_income: "Gelirler", home_widget_expenses: "Giderler", home_widget_monthly: "Bu ay", home_widget_health: "Finansal sağlık", home_widget_markets: "Kur ve altın", home_widget_marketSnapshot: "Piyasa özeti", home_widget_topPerformers: "Son 1 yılın yıldızları", home_widget_weather: "Hava durumu", home_widget_car: "Aracım", home_widget_watch: "Takip listesi", home_widget_price_bubbles: "Fiyat balonları", home_widget_goals: "Birikim hedefleri", home_widget_notes: "Mini notlar", home_widget_insights: "Akıllı içgörüler", home_widget_alerts: "Fiyat alarmları", home_widget_countdown: "Geri sayımlar",
    home_holdings: "{count} varlık", home_passive: "Aylık {amount} pasif", home_upcoming: "{count} yaklaşan ödeme", home_vehicles: "{count} araç", home_last_trip: "Son yolculuk: {route}", home_no_route: "Kayıtlı rota yok", home_watch_count: "{count} takip edilen varlık", home_watch_empty: "Takip edilen varlık yok", home_freedom_summary: "{name} · {amount}",
    command_nav: "Komut", command_nav_title: "Komut çubuğunu aç", command_eyebrow: "Akıllı komut", command_title: "Komut yaz", command_sub: "Doğal Türkçe yaz. Portföy değişiklikleri her zaman önce onaylanır.", command_input_label: "Komutun", command_placeholder: "Bir şey yaz…", command_send: "Komutu gönder", command_detected: "Algılanan", command_buy: "Satın alma algılandı", command_sell: "Satış algılandı", command_swap: "Dönüştürme algılandı", command_alert: "Fiyat alarmı algılandı", command_open: "Varlık sayfası algılandı", command_favorite: "Favori değişikliği algılandı", command_currency: "Ana para birimi değişikliği algılandı", command_query: "Portföy analizi algılandı", command_asset: "Varlık", command_quantity: "Miktar", command_price: "Fiyat", command_total: "Toplam", command_date: "Tarih", command_confirm: "Onayla", command_edit: "Düzenle", command_cancel: "İptal", command_applied: "Komut uygulandı ✓", command_understood: "Bu komutu anladım.", command_low_confidence: "Bunu tam anlayamadım.", command_no_asset: "Önce desteklenen bir varlık seç.", command_no_action: "Bu varlıkla ne yapmak istiyorsun?", command_ambiguous: "Hangi eşleşen varlığı kastettin?", command_suggestion_buy: "Portföye ekle", command_suggestion_sell: "Satış olarak kaydet", command_suggestion_cancel: "Vazgeç", command_needs_price: "Bu önizlemeyi hazırlamak için canlı fiyat gerekiyor.", command_current_price: "Güncel fiyat", command_average_cost: "Ağırlıklı ortalama maliyet", command_pnl: "Bu ayın K/Z'si", command_realized: "Gerçekleşen", command_unrealized: "Gerçekleşmemiş", command_allocation: "Portföy ağırlığı", command_top_performer: "En çok kazandıran", command_no_data: "Henüz yeterli portföy verisi yok.", command_no_holding: "Bu varlık portföyünde yok.", command_insufficient: "Portföyünde bu varlıktan yeterli miktar yok.", command_eur_unsupported: "EUR ana para birimi bu sürümde kullanılamıyor.", command_percent: "Değişim", command_condition: "Koşul", command_above: "üzerine çıkarsa", command_below: "altına düşerse", command_percent_up: "% yükselirse", command_percent_down: "% düşerse", command_today: "bugün", command_not_saved: "Herhangi bir değişiklik yapılmadı.", command_help_title: "Kullanabileceğin komutlar", command_help_intro: "Aşağıdaki örneklerden birini yazıp gönder.", command_help_trade: "İşlem ve alarm", command_help_portfolio: "Portföy", command_help_asset: "Varlık ve favoriler", command_help_settings: "Ayarlar", command_app: "Uygulama verileri", command_navigation: "Gezinme", command_help_queries: "Hızlı raporlar", command_expenses: "Gider", command_income: "Gelir", command_balance: "Bakiye", command_monthly_expenses: "Aylık gider", command_label: "Ad / detay", command_target: "Hedef", command_destination: "Sayfa", command_note: "Not", command_navigation_done: "Açıldı ✓", command_expense_added: "Gider eklendi ✓", command_income_added: "Gelir eklendi ✓", command_note_added: "Not eklendi ✓", command_goal_added: "Birikim hedefi eklendi ✓", command_countdown_added: "Geri sayım eklendi ✓", command_invalid_amount: "Pozitif bir tutar gir.", command_date_needed: "Gelecekte bir tarih seç.", command_label_needed: "Bir ad veya açıklama ekle.",
    monthly_summary_title: "Bu ayın özeti", monthly_summary_sub: "Gelir, gider ve birikim tek bakışta.", monthly_income: "Gelir", monthly_expense: "Gider", monthly_net: "Net", monthly_rate: "Birikim oranı: %{rate}", monthly_no_income: "Birikim oranını hesaplamak için aylık gelir ekle.", monthly_share: "Paylaş", monthly_share_title: "Bu ayki harcamalarını paylaş", monthly_share_card_title: "Aylık harcama", monthly_share_expenses: "Toplam harcama", monthly_share_daily: "Günlük ortalama", monthly_share_largest: "En büyük harcama", monthly_share_records: "Harcama kaydı", monthly_share_no_category: "Kategorisiz", monthly_share_photo: "Fotoğraf seç", monthly_share_random: "Rastgele kedi", monthly_share_photo_loaded: "Fotoğraf karta uygulandı.", monthly_share_photo_failed: "12 MB altında desteklenen bir görsel seç.", monthly_share_random_loaded: "Rastgele kedi arka planı seçildi.", monthly_share_preview_title: "Aylık harcama kartı", monthly_share_preview_sub: "Arka planını seç, sonra kopyala veya indir.", monthly_share_copy: "Görseli kopyala", monthly_share_download: "İndir", monthly_share_system: "Paylaş", monthly_share_close: "Kapat", monthly_share_copied: "Görsel kopyalandı.", monthly_share_copy_failed: "Görsel kopyalama desteklenmiyor. Bunun yerine indirebilirsin.", monthly_share_system_unavailable: "Sistem paylaşımı bu cihazda kullanılamıyor. Bunun yerine indirebilirsin.", monthly_share_text: "Bu ay {amount} harcadım.", monthly_share_downloaded: "Özet görseli indirildi.", monthly_share_failed: "Özet görseli hazırlanamadı.",
    health_title: "Finansal sağlık", health_sub: "Mevcut verilerine göre hesaplanan skor.", health_note: "Birikim oranı, pasif gelir, varlık tamponu ve çeşitlilik.", health_weak: "Dikkat gerekli", health_fair: "Güçleniyor", health_good: "Sağlıklı", health_excellent: "Mükemmel",
    market_summary_title: "Kur ve altın", market_summary_sub: "Güncel TL piyasa özeti.", market_usd: "Dolar / TL", market_eur: "Euro / TL", market_gold: "Gram altın", market_loading: "Canlı fiyatlar yükleniyor…", market_unavailable: "Fiyat alınamadı",
    weather_title: "Hava durumu", weather_sub: "Yerel tahmin tek bakışta.", weather_change_location: "Konumu değiştir", weather_refresh: "Hava durumunu yenile", weather_search_ph: "Şehir ara…", weather_use_location: "Konumumu kullan", weather_current_location: "Mevcut konum", weather_loading: "Hava durumu yükleniyor…", weather_unavailable: "Hava durumu şu anda alınamıyor.", weather_no_results: "Eşleşen şehir bulunamadı.", weather_location_denied: "Konum bilgisine ulaşılamadı. Bunun yerine şehir arayabilirsin.", weather_feels_like: "Hissedilen {temp}", weather_wind: "Rüzgâr {speed}", weather_rain: "Yağış %{rate}", weather_updated: "{time} güncellendi", weather_today: "Bugün", weather_tomorrow: "Yarın", weather_clear: "Açık", weather_partly_cloudy: "Parçalı bulutlu", weather_cloudy: "Bulutlu", weather_fog: "Sisli", weather_drizzle: "Çisenti", weather_rainy: "Yağmurlu", weather_snow: "Karlı", weather_showers: "Sağanak", weather_thunderstorm: "Gök gürültülü",
    goal_title: "Birikim hedefleri", goal_sub: "TL veya dolar cinsinden ayrı hedefler oluştur.", goal_name: "Hedef", goal_name_ph: "Acil durum fonu, araba…", goal_target: "Hedef tutar", goal_current: "Mevcut birikim", goal_currency: "Para birimi", goal_add: "Hedef ekle", goal_empty: "Henüz birikim hedefi yok.", goal_invalid: "Hedef adı ve geçerli bir hedef tutar gir.", goal_added: "Birikim hedefi eklendi ✓", goal_remove: "Hedefi kaldır", goal_progress: "{target} hedefinin {current} kadarı", goal_completed: "Hedefe ulaşıldı",
    notes_title: "Mini notlar", notes_sub: "Kısa hatırlatmalarını yanında tut.", note_ph: "Kısa bir not yaz…", note_add: "Ekle", note_empty: "Henüz not yok.", note_remove: "Notu kaldır",
    insights_title: "Akıllı içgörüler", insights_sub: "Verilerinden otomatik çıkarılan kısa yorumlar.", insight_setup_title: "Rakamlarını tamamla", insight_setup_body: "Kişisel içgörüler için gelir ve gider bilgilerini ekle.", insight_cash_positive_title: "Pozitif nakit akışı", insight_cash_positive_body: "Bu ay gelirlerin giderlerinden {amount} fazla.", insight_cash_negative_title: "Gider geliri aşıyor", insight_cash_negative_body: "Bu ay şu anda {amount} açık var.", insight_rate_title: "Birikim oranı", insight_rate_body: "Aylık gelirinin %{rate} kadarını elinde tutuyorsun.", insight_passive_title: "Pasif gelir kapsaması", insight_passive_body: "Pasif gelirin aylık giderlerinin %{rate} kadarını karşılıyor.", insight_expense_up_title: "Giderler arttı", insight_expense_up_body: "Bu ay son arşivlenen aya göre %{rate} daha yüksek.", insight_expense_down_title: "Giderler azaldı", insight_expense_down_body: "Bu ay son arşivlenen aya göre %{rate} daha düşük.", insight_goal_title: "En yakın birikim hedefi", insight_goal_body: "{name} hedefinin %{rate} kadarı tamamlandı.", insight_upcoming_title: "Yaklaşan ödemeler", insight_upcoming_body: "Ödenmemiş {count} ödeme veya bakım hatırlatman var.", insight_budget_title: "Bütçe baskısı", insight_budget_body: "{name} aylık limitinin %{rate} kadarına ulaştı.", insight_concentration_title: "Portföy yoğunlaşması", insight_concentration_body: "Portföyünün %{rate} kadarı {name} varlığında; tek hareketin etkisi yüksek.", insight_runway_title: "Güvenlik tamponu", insight_runway_body: "Portföyün planlanan giderlerini yaklaşık {months} ay karşılayabilir.", insight_diversification_title: "Çeşitlendirme açığı", insight_diversification_body: "Portföyün {count} varlık grubuna yayılıyor; farklı gruplar riski yumuşatabilir.", insight_goal_momentum_title: "Hedef ivmesi", insight_goal_momentum_body: "{name} hedefinin %{rate} kadarı tamamlandı; {amount} kaldı.", insight_more_title: "Daha net içgörüler için", insight_more_body: "Gelir, gider veya hedef ekledikçe analiz daha anlamlı sinyaller gösterecek.",
    countdown_title: "Geri sayımlar", countdown_sub: "Takvimden hedef tarihi seç; gün veya ay olarak takip et.", countdown_name: "Başlık", countdown_category: "Kategori", countdown_date: "Hedef tarih", countdown_unit: "Gösterim", countdown_days: "Gün", countdown_months: "Ay", countdown_add: "Geri sayım ekle", countdown_name_ph: "Tatil, sınav, hedef…", countdown_category_ph: "Seyahat, iş, kişisel…", countdown_empty: "Henüz geri sayım yok.", countdown_invalid: "Bir başlık gir ve takvimden ileri bir tarih seç.", countdown_day_left: "gün kaldı", countdown_days_left: "gün kaldı", countdown_month_left: "ay kaldı", countdown_months_left: "ay kaldı", countdown_done: "Süre doldu", countdown_target: "Hedef: {date}", countdown_remove: "Geri sayımı kaldır", countdown_switch_unit: "Gün / ay görünümünü değiştir", countdown_added: "Geri sayım eklendi ✓", countdown_active: "{count} aktif geri sayım",
    pwa_title: "Uygulama ve çevrimdışı kullanım", pwa_desc: "NumBrrr'ı telefonuna kur; internet yokken kayıtlı verilerinle kullanmaya devam et.", pwa_install: "Uygulamayı yükle", pwa_ready: "Çevrimdışı kullanım hazır.", pwa_installed: "NumBrrr bu cihaza yüklendi.", pwa_ios: "Yüklemek için tarayıcı menüsündeki Ana Ekrana Ekle seçeneğini kullan.", pwa_unsupported: "Bu tarayıcı uygulama yüklemeyi desteklemiyor.", offline_banner: "Çevrimdışısın · son kaydedilen veriler gösteriliyor",
    notify_title: "Bildirimler", notify_desc: "Fiyat alarmlarını ve yaklaşan araç bakım hatırlatmalarını, arka plan hizmeti hazırsa uygulama kapalıyken de al.", notify_enable: "Bildirimleri aç",
    notify_active: "Arka plan bildirimleri aktif.", notify_syncing: "Arka plan bildirimleri bağlanıyor…", notify_background_unavailable: "Arka plan hizmeti henüz yapılandırılmamış; alarmlar uygulama açıkken çalışmaya devam edecek.", notify_inapp: "Sistem bildirimi kullanılamıyor; uyarılar uygulama içinde gösterilecek.", notify_blocked: "Bildirim izni tarayıcı ayarlarından engellenmiş.", notify_off: "Bildirimler kapalı.", notify_privacy: "Arka planda göndermek için yalnızca alarm koşulları ve bakım tarihleri eşitlenir.",
    vehicle_notify: "Araç bakım hatırlatması", days_before: "gün önceden",
    price_alerts: "Fiyat alarmları", home_alert_sub: "İstediğin varlığı ara ve bildirim almak istediğin fiyatı belirle.", home_alert_ready: "Bildirimler açık; aktif alarmlar otomatik kontrol edilir.", home_alert_off: "Alarm kaydedilir; uyarı almak için Ayarlar'dan bildirimleri aç.", alert_asset: "Varlık", alert_search_ph: "Altın, hisse, kripto ara…", alert_condition: "Koşul", alert_above: "Üzerine çıkarsa", alert_below: "Altına düşerse", alert_target: "Hedef fiyat", alert_add: "Alarm ekle",
    alert_empty: "Henüz fiyat alarmı yok.", alert_watch_empty: "Önce Takip listesine bir varlık ekle.", alert_invalid: "Bir varlık seç ve geçerli hedef fiyat gir.", alert_added: "Fiyat alarmı eklendi ✓", alert_remove: "Alarmı kaldır",
    price_alert_title: "Fiyat alarmı", price_alert_body: "{name} şu anda {price} ({target} {condition}).",
    vehicle_alert_title: "Araç hatırlatması", vehicle_alert_body: "{vehicle}: {label} {when}.", vehicle_due_today: "bugün yapılmalı", vehicle_due_days: "{days} gün içinde yapılmalı", vehicle_overdue_days: "{days} gün gecikti",
    backup_title: "Veri yedekleme", backup_desc: "Tüm verilerini dosya olarak sakla veya başka telefonda geri yükle.", backup_export: "Yedeği dışa aktar", backup_import: "Yedeği içe aktar",
    backup_ready: "Yedek indirildi: {date}", backup_imported: "Yedek geri yüklendi. Yeniden açılıyor…", backup_invalid: "Bu dosya geçerli bir NumBrrr yedeği değil.", backup_too_large: "Yedek dosyası çok büyük.", backup_confirm: "İçe aktarma mevcut verilerin yerine geçecek. Devam edilsin mi?", backup_last: "Son yedek: {date}",
    onb_title: "NumBrrr'a hoş geldin", onb_sub: "Başlamak için ülkeni ve dilini seç. Bunları istediğin zaman Ayarlar'dan değiştirebilirsin.",
    onb_country: "Ülke", onb_language: "Dil", onb_start: "Devam",
    guide_title: "Hızlı rehber", guide_ok: "Anladım",
    guide_portfolio: "Neyin varsa ekle: hisse, kripto, altın, dolar, nakit. Dağılımını ve aylık nakit akışını görürsün.",
    guide_income: "Aylık gelirlerini gir. Kira, faiz gibi pasif olanları işaretle, çünkü özgürlük hesabına sadece onlar giriyor.",
    guide_expenses: "Bu ayın harcamalarını gir, düzenli faturaların için hatırlatıcı kur, araç masraflarını da ekle.",
    guide_car: "İl ve ilçe bazında rota planla: mesafe, süre ve yakıt maliyetini hesapla; araç profilleri kaydet ve yolculuk harcamalarını takip et.",
    guide_freedom: "Düzenlenebilir ana sayfan: özetlere, geri sayımlara ve Özgürlük hesaplayıcısına tek yerden ulaş.",
    guide_watch: "Merak ettiğin varlıkları ara, favorine ekle ve fiyatlarını takip et.",
    theme_glass: "Sıvı Cam", theme_glass_desc: "Modern buzlu cam (varsayılan)",
    theme_xp: "Windows XP", theme_xp_desc: "Nostaljik 2000'ler Luna mavisi",
    theme_medieval: "Ortaçağ", theme_medieval_desc: "Sert 15. yüzyıl parşömen ve demir",
    theme_doge: "Doge", theme_doge_desc: "çok vov · büyük para · efsane meme",
    theme_neon: "Neon", theme_neon_desc: "80'ler neon rüyası · A E S T H E T I C",
    theme_solana: "Solana", theme_solana_desc: "Mor & yeşil · degen modu",
    theme_black: "Siyah Tema", theme_black_desc: "Düz siyah · mavi vurgular",
    theme_terminal: "NUMBRR Terminal", theme_terminal_desc: "Fosfor yeşili · odaklı finans konsolu",
    theme_fff: "FFF", theme_fff_desc: "Özgün fosfor terminali · NUMBRR sistemi",
    more_soon: "Yeni özellikler yakında ✨",
    nav_car: "Aracım",
    car_title: "Aracım",
    car_route: "Rota", car_route_sub: "Rotanı planla ve tahmini yolculuk maliyetini gör.", car_from: "Nereden", car_to: "Nereye", car_pick_province: "İl seç", car_loading: "Rota verileri yükleniyor…",
    car_center: "Merkez (il merkezi)", car_need_provinces: "Kalkış ve varış ilini seç.", car_district: "İlçe",
    car_calc: "Rotayı hesapla", car_calculating: "Hesaplanıyor…",
    car_same_province: "İki farklı nokta seç.", car_route_fail: "Rota servisine ulaşılamadı, tahmini değer gösteriliyor.",
    car_no_profile: "Yakıt maliyeti için araç profili ekle.",
    car_distance: "Mesafe", car_duration: "Tahmini süre",
    car_cost_one: "Gidiş yakıt", car_cost_round: "Gidiş-dönüş yakıt",
    car_oneway: "Tek yön", car_roundtrip: "Gidiş-dönüş", car_toll: "Otoyol", car_parking: "Otopark", car_other_cost: "Diğer", car_extra_costs_title: "Ek yol giderleri",
    car_trip_total: "Yolculuk toplamı", car_extra_total: "Ek giderler", car_open_map: "Haritada aç ↗",
    car_route_map: "Rota haritası", car_map_hint: "Haritayı sürükleyip yakınlaştırabilirsin", car_map_unavailable: "Etkileşimli harita yüklenemedi. Haritada aç bağlantısını kullanabilirsin.",
    car_add_favorite: "Favorilere ekle", car_favorite_saved: "Favori rota kaydedildi ★", car_favorites: "Favori rotalar",
    car_clear: "Rotayı temizle", car_details: "Detaylar", car_vehicle: "Araç", car_route_type: "Yolculuk türü", car_fuel_cost: "Yakıt gideri",
    car_save_trip: "Yolculuğu kaydet", car_trip_saved: "Yolculuk kaydedildi ✓",
    car_profiles: "Araç profilleri", car_add_profile: "+ Araç ekle", car_model_ph: "Marka ve model",
    car_fuel_type: "Yakıt", car_consumption: "Tüketim", car_consumption_hint: "/100 km",
    car_price: "Yakıt fiyatı", car_price_hint: "L / kWh başına", car_active: "Aktif",
    car_fuel_gas: "Benzin", car_fuel_diesel: "Dizel", car_fuel_lpg: "LPG", car_fuel_electric: "Elektrik", car_fuel_hybrid: "Hibrit",
    car_history: "Yolculuk geçmişi", car_history_sub: "Kaydedilen rotaları ve toplam yolculuk maliyetlerini incele.", car_history_empty: "Henüz yolculuk kaydedilmedi.",
    car_oneway_label: "tek yön", car_roundtrip_label: "gidiş-dönüş",
    car_expenses: "Yolculuk harcamaları", car_add_expense: "+ Harcama ekle", car_exp_empty: "Henüz harcama eklenmedi.",
    car_general_trip: "Genel", car_amount_ph: "Tutar", car_link_trip: "Yolculuk",
    car_cat_fuel: "Yakıt", car_cat_food: "Yemek", car_cat_parking: "Otopark", car_cat_toll: "Otoyol", car_cat_maintenance: "Bakım", car_cat_other: "Diğer",
    car_report: "Harcama raporu", car_report_total: "Genel toplam", car_report_fuel_est: "Tahmini rota yakıtı",
    car_report_empty: "Rapor için yolculuk ve harcama ekle.",
    nav_portfolio: "Portföy",
    portfolio_title: "Portföyün", portfolio_sub: "Sahip olduklarını ekle, dağılımını gör.",
    holding_ph: "Varlık adı", add_holding: "+ Varlık ekle", total_value: "Toplam portföy değeri",
    portfolio_holdings_title: "Varlıklarım", portfolio_holdings_sub: "Miktarları, varlık türlerini ve güncel değerleri yönet.", portfolio_count: "{count} varlık",
    portfolio_amount: "Miktar", portfolio_current_value: "Güncel değer", portfolio_remove: "Varlığı kaldır",
    flow_title: "Aylık nakit akışı", flow_income: "Gelir", flow_expenses: "Gider", flow_net: "Aylık net", flow_last_month: "Geçen ay: {x}",
    net_worth_title: "Net varlık", net_worth_sub: "Aylık portföy varlıkların eksi toplam borcun.", net_worth_auto: "Otomatik kaydedilir",
    net_worth_assets: "Varlıklar", net_worth_debt: "Borç", net_worth_net: "Net varlık", net_worth_history: "Net varlık geçmişi",
    net_worth_empty: "Grafiği başlatmak için portföy varlığı veya borç ekle.", net_worth_debt_input: "Toplam borç",
    net_worth_debt_note: "Kredi kartları, krediler ve diğer kalan borçlar.", net_worth_chart_empty: "Henüz aylık kayıt yok.",
    net_worth_chart_desc: "Aylara göre net varlık: {values}",
    flow_savings_note: "Takip ettiğin harcamaları kısarsan ayda +{x} daha.",
    cat_cash: "Nakit", cat_investment: "Yatırım",
    asset_stocks: "Hisse", asset_usstock: "ABD Hisse", asset_bist: "Türk Hisse (BIST)", asset_crypto: "Kripto", asset_deposit: "Mevduat", asset_bonds: "Tahvil", asset_realestate: "Gayrimenkul", asset_gold: "Altın", asset_gold_oz: "Ons Altın", asset_usd: "Dolar (USD)", asset_cash: "Nakit",
    stock_search_ph: "Hisse ara (örn. THY)", shares_ph: "Adet",
    nav_watchlist: "Takip", watch_title: "Takip listesi", watch_sub: "Piyasada ara, önemli varlıkları hep yakında tut.", watch_count: "{count} varlık",
    watch_search_ph: "Altın, hisse, kripto ara…", watch_empty: "Yukarıdan ara ve takip listene varlık ekle.", watch_chart: "TradingView'de grafiği aç",
    market_snapshot_title: "Piyasa özeti", market_snapshot_sub: "Güncel BIST, döviz ve altın fiyatları.",
    top_perf_title: "Son 1 yılın yıldızları", top_perf_sub: "Bir yıllık performansı en güçlü varlıklar.", asset_silver: "Gümüş", top_perf_loading: "Son 1 yıl sıralanıyor…",
    watch_ccy: "Fiyatı dolar / TL göster", watch_chart_full: "TradingView'de tam grafiği aç ↗",
    tr_index: "Borsa İstanbul", tr_forex: "Döviz", tr_gold: "Altın (TL)",
    gold_gram: "Gram Altın", gold_quarter: "Çeyrek Altın", gold_half: "Yarım Altın", gold_full: "Tam Altın",
    lbl_24h: "24s", lbl_1mo: "1A", lbl_1yr: "1Y",
    inc_from_portfolio: "+{x}/ay portföyden",
    net_tax: "Net (stopaj −%15)", coin_search_ph: "Coin ara (örn. Solana)", qty_ph: "Adet", coin_loading: "Canlı fiyatlar yükleniyor…", grams_ph: "Gram", oz_ph: "Ons",
    target_via: "Özgürlük hedefi (bir veya birkaçını seç)", target_x: "Hedef {x}", to_freedom: "finansal özgürlüğe", blended_return: "Karma getiri",
    income_line: "Şu an portföyün ayda yaklaşık {income} üretebilir, giderlerinin {pct} kadarını karşılar.",
    freedom_reached: "🎉 Özgürlük rakamına ulaştın. Yatırımların giderlerini karşılayabilir!",
    portfolio_empty: "Dağılımı görmek için aşağıdan varlık ekle.",
    portfolio_note: "Özgürlük hedefi = yıllık gider ÷ seçilen getiri. Pasif gelir = değer × getiri. Tahmindir, tavsiye değildir.",
    nav_income: "Gelirler",
    income_title: "Gelirlerin", income_sub: "Gelirini ekle. Pasif olanları işaretle; özgürlüğe yalnızca onlar sayılır.",
    income_sources_title: "Gelir kaynakları", income_sources_sub: "Aktif ve pasif gelirlerini tek bakışta ayır.", income_source_count: "{count} kaynak",
    add_income: "+ Gelir ekle", income_ph: "Gelir kaynağı", total_income: "Toplam aylık gelir", income_remove: "Gelir kaynağını kaldır",
    passive_label: "Pasif", active_label: "Aktif", covered_by_passive: "pasif gelirle karşılanıyor",
    surplus_line: "Yatırıma ayırabileceğin yaklaşık {x}/ay artıyor.", deficit_line: "Kazandığından ayda yaklaşık {x} fazla harcıyorsun.",
    income_free: "🎉 Finansal özgürsün: pasif gelirin giderlerini zaten karşılıyor!",
    income_empty: "Durumunu görmek için yukarıdan gelir ekle.",
    income_note: "Pasif gelir = kira, faiz, temettü ve benzeri. Finansal özgürlük = pasif gelir ≥ giderlerin.",
    inc: { salary: "Maaş", rental: "Kira geliri", interest: "Faiz geliri", dividends: "Temettü", side: "Ek / serbest gelir" },
    note_historical: "Tarihsel ortalamalara dayanır, garanti değildir.",
    note_btc_warn: "Bitcoin son derece oynaktır; bu rakam spekülatiftir.",
    note_btc_tl: "Lira bazında son ~12 ayın getirisi (≈ +%37, 2026 ortası itibarıyla, kaynak: CoinGecko). Bitcoin son derece oynaktır, tek bir yıl tahmin değildir.",
    re_note_USD: "Varsayılan brüt getiri ≈ %6,6 (Global Property Guide ulusal ortalaması, 2025 Ç4). Kira getirileri şehre ve mülk tipine göre çok değişir, tarihseldir, garanti değildir.",
    re_note_TL: "Varsayılan brüt getiri ≈ %7,3 (Global Property Guide ulusal ortalaması, 2026 Ç1). Kira getirileri şehre ve mülk tipine göre çok değişir, tarihseldir, garanti değildir.",
    inst: {
      savings: { name: "Tasarruf / Para Piyasası", sub: "Yüksek getirili tasarruf" },
      treasury: { name: "ABD Hazine Tahvilleri", sub: "~10 yıllık" },
      sp500: { name: "S&P 500", sub: "SPX tarihsel ort." },
      nasdaq: { name: "Nasdaq 100", sub: "Tarihsel ort." },
      btc: { name: "Bitcoin (BTC)", sub: "Spekülatif", sub_tl: "Son 12 ay · TRY" },
      realestate: { name: "Gayrimenkul", sub: "Kira getirisi · kira ÷ değer" },
      deposit: { name: "TL Mevduat", sub: "Yıllık faiz oranı" },
      gold: { name: "Altın (TL)", sub: "Lira cinsinden altın" },
      bist: { name: "BIST 100", sub: "Borsa İstanbul ort." },
      eurobond: { name: "Eurobond / Döviz mevduatı", sub: "Dövize bağlı getiri" },
    },
  },
};

I18N.en.command_note_added = "Note added ✓";
I18N.tr.command_examples_title = "Önerilen komutlar";
I18N.en.command_context_suggestions = "Suggestions for your text";
I18N.tr.command_context_suggestions = "Yazına uygun komutlar";

// ---- State ----
const HOME_WIDGET_IDS = ["freedom", "portfolio", "income", "expenses", "monthly", "health", "markets", "marketSnapshot", "topPerformers", "car", "watch", "goals", "notes", "insights", "alerts", "countdown"];
const THEME_IDS = ["black", "terminal", "fff"];
function normalizeTheme(value) {
  return THEME_IDS.includes(value) ? value : "black";
}
const state = {
  lang: "tr",
  theme: "black",
  currency: "TL",
  monthlyExpenses: 3000,
  realMode: false,
  sound: true,
  motion: true,
  inflation: { USD: 3, TL: 40 },
  rates: {
    USD: Object.fromEntries(INSTRUMENTS.USD.map((i) => [i.id, i.rate])),
    TL: Object.fromEntries(INSTRUMENTS.TL.map((i) => [i.id, i.rate])),
  },
  realEstate: {
    USD: { propertyValue: 0, monthlyRent: 0, netYield: false },
    TL: { propertyValue: 0, monthlyRent: 0, netYield: false },
  },
  // Monthly expense tracker. recurring = fixed monthly bills (also shown as
  // reminders); oneoff = this month's logged spends (reset each month); history
  // = archived past-month totals. month = the month currently being tracked.
  expenses: {
    month: "", recurring: [], oneoff: [], history: [], recSeq: 0, oneSeq: 0,
  },
  // Reusable category limits, kept separately for USD and TL budgets.
  monthlyBudget: { items: [], seq: 0 },
  // Vehicles: each has a name (brand-model), fuel specs (fuel/consumption/price for
  // route fuel cost), dated payment reminders (sched) and logged expenses (oneoff).
  // Vehicle costs roll into the monthly expense total.
  vehicles: [], vehSeq: 0,
  // Aracım (car hub): route planner + trip history. activeVehicle = the car used for
  // route fuel cost (a state.vehicles entry).
  vehicleHub: {
    activeVehicle: "", trips: [],
    fromP: "", fromD: "", toP: "", toD: "", lastRoute: null, seq: 0,
    tripType: "oneway", extras: { toll: 0, parking: 0, other: 0 }, favorites: [], favSeq: 0,
  },
  portfolio: {
    holdings: [], seq: 0, transactions: [], txSeq: 0,
    target: { USD: [SAVINGS_DEFAULT_INVEST.USD], TL: [SAVINGS_DEFAULT_INVEST.TL] },
  },
  // Monthly snapshots are currency-specific so switching country never mixes scales.
  netWorth: { liabilities: { USD: 0, TL: 0 }, history: { USD: [], TL: [] } },
  portTotalUSD: false, // when currency is TL, show the total portfolio value in USD instead
  watchlist: [], // [{ type, key, name }] — assets to monitor (price + 24h/1mo/1yr performance)
  notifications: { enabled: false, vehicleDays: 7, priceAlerts: [], seq: 0, sent: {} },
  homeLayout: { order: [...HOME_WIDGET_IDS], itemOrder: [...HOME_WIDGET_IDS], hidden: [], freedomExpanded: false },
  weather: {
    location: { name: "İstanbul", latitude: 41.0082, longitude: 28.9784 },
    data: null,
    updatedAt: 0,
  },
  savingsGoals: { items: [], seq: 0 },
  homeNotes: { items: [], seq: 0 },
  countdowns: { items: [], order: [], seq: 0 },
  income: { amounts: {}, passive: {}, custom: [], seq: 0 },
};
INCOME_CATEGORIES.forEach((c) => { state.income.amounts[c.id] = 0; state.income.passive[c.id] = c.passive; });
// New users start with a clean portfolio; the add action creates the first row.

// ---- i18n helpers ----
function langPack() { return I18N[state.lang] || I18N.en; }
function t(key, vars) {
  let s = langPack()[key];
  if (s == null) s = I18N.en[key];
  if (s == null) s = key;
  if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
  return s;
}
function instName(id) { return (langPack().inst[id] || I18N.en.inst[id] || {}).name || id; }
function instSub(inst) {
  const d = langPack().inst[inst.id] || I18N.en.inst[inst.id] || {};
  if (inst.id === "btc" && state.currency === "TL") return d.sub_tl || d.sub || "";
  return d.sub || "";
}
function instNote(inst) {
  if (inst.realEstate) return t("re_note_" + state.currency);
  if (inst.noteKey) return t(inst.noteKey);
  if (inst.warn) return t("note_btc_warn");
  if (inst.historical) return t("note_historical");
  return "";
}
function incLabel(id) { return (langPack().inc && langPack().inc[id]) || I18N.en.inc[id] || id; }

const FFF_HUD_CAT_IMAGES = Object.freeze([
  "/assets/monthly-share/cat-shout.png",
  "/assets/monthly-share/cat-blurry.png",
  "/assets/monthly-share/cat-close.png",
  "/assets/monthly-share/cat-wide.png",
]);

// ---- Elements ----
const el = {
  // Smart command bar
  smartCommandForm: document.getElementById("smartCommandForm"),
  smartCommandInput: document.getElementById("smartCommandInput"),
  smartCommandSend: document.getElementById("smartCommandSend"),
  smartCommandStatus: document.getElementById("smartCommandStatus"),
  smartCommandPreview: document.getElementById("smartCommandPreview"),
  smartCommandChips: document.getElementById("smartCommandChips"),
  smartCommandExamplesTitle: document.getElementById("smartCommandExamplesTitle"),
  commandOrbCanvas: document.getElementById("commandOrbCanvas"),
  smartCommandOrbCanvas: document.getElementById("smartCommandOrbCanvas"),
  fffOperatorHud: document.getElementById("fffOperatorHud"),
  fffHudRank: document.getElementById("fffHudRank"),
  fffHudXp: document.getElementById("fffHudXp"),
  fffHudXpLabel: document.getElementById("fffHudXpLabel"),
  fffHudXpFill: document.getElementById("fffHudXpFill"),
  fffHudStatus: document.getElementById("fffHudStatus"),
  fffHudMission: document.getElementById("fffHudMission"),
  fffHudMissionAction: document.getElementById("fffHudMissionAction"),
  fffHudModules: document.getElementById("fffHudModules"),
  fffHudBadges: document.getElementById("fffHudBadges"),
  fffHudMissionFill: document.getElementById("fffHudMissionFill"),
  fffHudCat: document.getElementById("fffHudCat"),
  fffEditHome: document.getElementById("fffEditHome"),
  fffTerminalPageTitle: document.getElementById("fffTerminalPageTitle"),
  fffTerminalClock: document.getElementById("fffTerminalClock"),
  currencySymbol: document.getElementById("currencySymbol"),
  expenses: document.getElementById("expenses"),
  realMode: document.getElementById("realMode"),
  inflationField: document.getElementById("inflationField"),
  inflation: document.getElementById("inflation"),
  cards: document.getElementById("cards"),
  bars: document.getElementById("bars"),
  bestAmount: document.getElementById("bestAmount"),
  bestLabel: document.getElementById("bestLabel"),
  bestRate: document.getElementById("bestRate"),
  headlineNote: document.getElementById("headlineNote"),
  ruleNumber: document.getElementById("ruleNumber"),
  // expenses (Gider) view
  expMonthLabel: document.getElementById("expMonthLabel"),
  expReminders: document.getElementById("expReminders"),
  expRemTotal: document.getElementById("expRemTotal"),
  expReminderList: document.getElementById("expReminderList"),
  expTotal: document.getElementById("expTotal"),
  expRecList: document.getElementById("expRecList"),
  addRecurring: document.getElementById("addRecurring"),
  expOneList: document.getElementById("expOneList"),
  addExpense: document.getElementById("addExpense"),
  expHistorySec: document.getElementById("expHistorySec"),
  expHistToggle: document.getElementById("expHistToggle"),
  expHistList: document.getElementById("expHistList"),
  budgetMonth: document.getElementById("budgetMonth"),
  budgetSpent: document.getElementById("budgetSpent"),
  budgetLimit: document.getElementById("budgetLimit"),
  budgetRemaining: document.getElementById("budgetRemaining"),
  budgetProgress: document.getElementById("budgetProgress"),
  budgetProgressFill: document.getElementById("budgetProgressFill"),
  budgetProgressText: document.getElementById("budgetProgressText"),
  budgetList: document.getElementById("budgetList"),
  budgetEmpty: document.getElementById("budgetEmpty"),
  budgetForm: document.getElementById("budgetForm"),
  budgetCategory: document.getElementById("budgetCategory"),
  budgetAmount: document.getElementById("budgetAmount"),
  vehList: document.getElementById("vehList"),
  vehCount: document.getElementById("vehCount"),
  addVehicle: document.getElementById("addVehicle"),
  vehSchedList: document.getElementById("vehSchedList"),
  vehCatList: document.getElementById("vehCatList"),
  expCatList: document.getElementById("expCatList"),
  // Aracım (car) view
  carFromP: document.getElementById("carFromP"),
  carFromD: document.getElementById("carFromD"),
  carToP: document.getElementById("carToP"),
  carToD: document.getElementById("carToD"),
  carCalc: document.getElementById("carCalc"),
  carRouteMsg: document.getElementById("carRouteMsg"),
  carResults: document.getElementById("carResults"),
  carMapWrap: document.getElementById("carMapWrap"),
  carMap: document.getElementById("carMap"),
  carSaveTrip: document.getElementById("carSaveTrip"),
  carTripType: document.getElementById("carTripType"),
  carOneWay: document.getElementById("carOneWay"),
  carRoundTrip: document.getElementById("carRoundTrip"),
  carFavorite: document.getElementById("carFavorite"),
  carFavorites: document.getElementById("carFavorites"),
  carClear: document.getElementById("carClear"),
  carToll: document.getElementById("carToll"),
  carParking: document.getElementById("carParking"),
  carOther: document.getElementById("carOther"),
  carHistList: document.getElementById("carHistList"),
  carRouteSec: document.getElementById("carRouteSec"),
  carHistSec: document.getElementById("carHistSec"),
  // portfolio view
  portList: document.getElementById("portList"),
  addHolding: document.getElementById("addHolding"),
  portTotal: document.getElementById("portTotal"),
  port24h: document.getElementById("port24h"),
  portCcyToggle: document.getElementById("portCcyToggle"),
  portChart: document.getElementById("portChart"),
  portDonut: document.getElementById("portDonut"),
  portLegend: document.getElementById("portLegend"),
  portEmpty: document.getElementById("portEmpty"),
  portHoldingCount: document.getElementById("portHoldingCount"),
  flowIncome: document.getElementById("flowIncome"),
  flowExpenses: document.getElementById("flowExpenses"),
  flowNet: document.getElementById("flowNet"),
  flowNetRow: document.getElementById("flowNetRow"),
  flowSavings: document.getElementById("flowSavings"),
  flowLastMonth: document.getElementById("flowLastMonth"),
  netWorthAssets: document.getElementById("netWorthAssets"),
  netWorthDebt: document.getElementById("netWorthDebt"),
  netWorthValue: document.getElementById("netWorthValue"),
  netWorthChart: document.getElementById("netWorthChart"),
  netWorthEmpty: document.getElementById("netWorthEmpty"),
  netWorthDebtInput: document.getElementById("netWorthDebtInput"),
  // income view
  incList: document.getElementById("incList"),
  addIncome: document.getElementById("addIncome"),
  incSourceCount: document.getElementById("incSourceCount"),
  incTotal: document.getElementById("incTotal"),
  incBreakdown: document.getElementById("incBreakdown"),
  incPct: document.getElementById("incPct"),
  incBarFill: document.getElementById("incBarFill"),
  incPunch: document.getElementById("incPunch"),
  incSurplus: document.getElementById("incSurplus"),
  // watchlist view
  watchSearch: document.getElementById("watchSearch"),
  watchDd: document.getElementById("watchDd"),
  watchList: document.getElementById("watchList"),
  watchEmpty: document.getElementById("watchEmpty"),
  watchCount: document.getElementById("watchCount"),
  watchBubblesSec: document.getElementById("watchBubblesSec"),
  watchBubbles: document.getElementById("watchBubbles"),
  homeCardList: document.getElementById("homeCardList"),
  resetHomeCards: document.getElementById("resetHomeCards"),
  dashboardGrid: document.getElementById("dashboardGrid"),
  editHome: document.getElementById("editHome"),
  freedomWidgetToggle: document.getElementById("freedomWidgetToggle"),
  freedomWidgetBody: document.getElementById("freedomWidgetBody"),
  homeFreedomSummary: document.getElementById("homeFreedomSummary"),
  homePortfolioValue: document.getElementById("homePortfolioValue"),
  homePortfolioNote: document.getElementById("homePortfolioNote"),
  homeIncomeValue: document.getElementById("homeIncomeValue"),
  homeIncomeNote: document.getElementById("homeIncomeNote"),
  homeExpensesValue: document.getElementById("homeExpensesValue"),
  homeExpensesNote: document.getElementById("homeExpensesNote"),
  homeMonthlyIncome: document.getElementById("homeMonthlyIncome"),
  homeMonthlyExpense: document.getElementById("homeMonthlyExpense"),
  homeMonthlyNet: document.getElementById("homeMonthlyNet"),
  homeMonthlyBar: document.getElementById("homeMonthlyBar"),
  homeMonthlyRate: document.getElementById("homeMonthlyRate"),
  shareMonthlySummary: document.getElementById("shareMonthlySummary"),
  monthlyShareModal: document.getElementById("monthlyShareModal"),
  monthlyShareBackdrop: document.getElementById("monthlyShareBackdrop"),
  monthlyShareClose: document.getElementById("monthlyShareClose"),
  monthlySharePreviewImage: document.getElementById("monthlySharePreviewImage"),
  monthlyShareUpload: document.getElementById("monthlyShareUpload"),
  monthlyShareRandom: document.getElementById("monthlyShareRandom"),
  monthlySharePhotoInput: document.getElementById("monthlySharePhotoInput"),
  monthlyShareCopy: document.getElementById("monthlyShareCopy"),
  monthlyShareDownload: document.getElementById("monthlyShareDownload"),
  monthlyShareSystem: document.getElementById("monthlyShareSystem"),
  healthRing: document.getElementById("healthRing"),
  healthScore: document.getElementById("healthScore"),
  healthLabel: document.getElementById("healthLabel"),
  homeMarketList: document.getElementById("homeMarketList"),
  weatherHeaderIcon: document.getElementById("weatherHeaderIcon"),
  weatherLocationToggle: document.getElementById("weatherLocationToggle"),
  weatherRefresh: document.getElementById("weatherRefresh"),
  weatherLocationPanel: document.getElementById("weatherLocationPanel"),
  weatherSearch: document.getElementById("weatherSearch"),
  weatherSearchResults: document.getElementById("weatherSearchResults"),
  weatherUseLocation: document.getElementById("weatherUseLocation"),
  weatherContent: document.getElementById("weatherContent"),
  weatherStatus: document.getElementById("weatherStatus"),
  homeCarValue: document.getElementById("homeCarValue"),
  homeCarNote: document.getElementById("homeCarNote"),
  homeWatchPreview: document.getElementById("homeWatchPreview"),
  homeWatchNote: document.getElementById("homeWatchNote"),
  savingsGoalForm: document.getElementById("savingsGoalForm"),
  savingsGoalName: document.getElementById("savingsGoalName"),
  savingsGoalTarget: document.getElementById("savingsGoalTarget"),
  savingsGoalCurrent: document.getElementById("savingsGoalCurrent"),
  savingsGoalCurrency: document.getElementById("savingsGoalCurrency"),
  savingsGoalList: document.getElementById("savingsGoalList"),
  homeNoteForm: document.getElementById("homeNoteForm"),
  homeNoteInput: document.getElementById("homeNoteInput"),
  homeNoteList: document.getElementById("homeNoteList"),
  smartInsightList: document.getElementById("smartInsightList"),
  homePriceAlertSearch: document.getElementById("homePriceAlertSearch"),
  homePriceAlertDd: document.getElementById("homePriceAlertDd"),
  homePriceAlertCondition: document.getElementById("homePriceAlertCondition"),
  homePriceAlertTarget: document.getElementById("homePriceAlertTarget"),
  homeAddPriceAlert: document.getElementById("homeAddPriceAlert"),
  homePriceAlertList: document.getElementById("homePriceAlertList"),
  countdownForm: document.getElementById("countdownForm"),
  countdownName: document.getElementById("countdownName"),
  countdownCategory: document.getElementById("countdownCategory"),
  countdownDate: document.getElementById("countdownDate"),
  countdownUnit: document.getElementById("countdownUnit"),
  countdownList: document.getElementById("countdownList"),
  offlineBanner: document.getElementById("offlineBanner"),
  pwaStatus: document.getElementById("pwaStatus"),
  installPwa: document.getElementById("installPwa"),
  notifyToggle: document.getElementById("notifyToggle"),
  notifyStatus: document.getElementById("notifyStatus"),
  vehicleNotifyDays: document.getElementById("vehicleNotifyDays"),
  exportData: document.getElementById("exportData"),
  importData: document.getElementById("importData"),
  backupStatus: document.getElementById("backupStatus"),
};

// ---- Helpers ----
function parseNumber(str) {
  if (typeof str !== "string") return Number(str) || 0;
  const n = parseFloat(str.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}
// For decimal inputs (rates, quantities, grams) a comma means the decimal point —
// TR phone keyboards type "5,21". Money fields keep parseNumber (comma = grouping).
function parseDecimal(str) {
  if (typeof str !== "string") return Number(str) || 0;
  let s = str.replace(/,/g, ".").replace(/[^0-9.]/g, "");
  const i = s.indexOf(".");
  if (i !== -1) s = s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, ""); // keep only the first dot
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}
function formatMoney(value, { compact = false } = {}) {
  const meta = CURRENCY_META[state.currency];
  if (!isFinite(value)) return "—";
  return new Intl.NumberFormat(meta.locale, {
    style: "currency", currency: meta.code,
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(value);
}
// Format a value in a specific currency (USD or TL), independent of state.currency.
function formatMoneyCcy(value, curKey, { compact = false } = {}) {
  const meta = CURRENCY_META[curKey] || CURRENCY_META[state.currency];
  if (!isFinite(value)) return "—";
  return new Intl.NumberFormat(meta.locale, {
    style: "currency", currency: meta.code,
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(value);
}
function formatThousands(n) { return new Intl.NumberFormat("en-US").format(Math.round(n)); }
function formatThousandsInput(input) {
  if (!input) return;
  const raw = input.value || "";
  const cursor = input.selectionStart == null ? raw.length : input.selectionStart;
  const digitsBeforeCursor = (raw.slice(0, cursor).match(/\d/g) || []).length;
  const digits = raw.replace(/\D/g, "");
  if (!digits) { input.value = ""; return; }
  const formatted = formatThousands(Number(digits));
  input.value = formatted;
  if (document.activeElement !== input || typeof input.setSelectionRange !== "function") return;
  let nextCursor = 0, seen = 0;
  while (nextCursor < formatted.length && seen < digitsBeforeCursor) {
    if (/\d/.test(formatted[nextCursor])) seen += 1;
    nextCursor += 1;
  }
  input.setSelectionRange(nextCursor, nextCursor);
}
function wireThousandsInput(input) {
  if (!input || input.dataset.thousandsWired) return;
  input.dataset.thousandsWired = "true";
  input.addEventListener("input", () => formatThousandsInput(input));
}
function localDateKey(d = new Date()) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
let appToastTimer = 0;
function showAppToast(message) {
  const toast = document.getElementById("toast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(appToastTimer);
  appToastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}
// Show a comma as the decimal separator for Turkish (round-trips with parseDecimal).
function locDec(n) { const s = String(n); return state.lang === "tr" ? s.replace(".", ",") : s; }
function formatRate(value, withSign = true) {
  const r = Math.round(value * 100) / 100;
  return withSign ? locDec(r) + "%" : locDec(r);
}
function effectiveRate(nominalPercent) {
  const infl = state.realMode ? state.inflation[state.currency] : 0;
  return (nominalPercent - infl) / 100;
}
function requiredSavings(nominalPercent) {
  const rate = effectiveRate(nominalPercent);
  if (rate <= 0) return Infinity;
  return (state.monthlyExpenses * 12) / rate;
}

// ---- Real-estate yield helpers ----
function reCustomActive(cur) { const re = state.realEstate[cur]; return re.propertyValue > 0 && re.monthlyRent > 0; }
function reGrossYield(cur) {
  const re = state.realEstate[cur];
  return reCustomActive(cur) ? (re.monthlyRent * 12) / re.propertyValue * 100 : state.rates[cur].realestate;
}
function instrumentNominal(inst) {
  const cur = state.currency;
  if (!inst.realEstate) return state.rates[cur][inst.id];
  let gross = reGrossYield(cur);
  if (state.realEstate[cur].netYield) gross -= NET_COST;
  return gross;
}

// ============================================================
//  Build (structure) + Refresh (values)
// ============================================================
function buildLayout() {
  const cur = state.currency;
  const meta = CURRENCY_META[cur];
  el.currencySymbol.textContent = meta.symbol;

  el.cards.innerHTML = "";
  INSTRUMENTS[cur].forEach((inst, idx) => {
    el.cards.appendChild(inst.realEstate ? buildRealEstateCard(inst, idx, meta) : buildSimpleCard(inst, idx));
  });

  el.bars.innerHTML = "";
  INSTRUMENTS[cur].forEach((inst) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.dataset.bar = inst.id;
    row.innerHTML = `
      <div class="bar-name">${instName(inst.id)}</div>
      <div class="bar-track">
        <div class="bar-fill" style="--bar-color:${inst.color}"></div>
        <span class="bar-value"></span>
      </div>`;
    el.bars.appendChild(row);
  });

  wireDynamicInputs();
}

function buildSimpleCard(inst, idx) {
  const cur = state.currency;
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.card = inst.id;
  card.style.setProperty("--card-color", inst.color);
  card.style.animationDelay = `${idx * 55}ms`;

  card.innerHTML = `
    <div class="card-accent"></div>
    <div class="card-head">
      <div>
        <h3 class="card-title">${instName(inst.id)}</h3>
        <p class="card-sub">${instSub(inst)}</p>
      </div>
      <span class="card-badge" data-badge hidden></span>
    </div>
    <div class="card-rate">
      <span class="card-rate-label">${t("annual_return")}</span>
      <div class="rate-input">
        <input type="text" inputmode="decimal" data-id="${inst.id}" value="${formatRate(state.rates[cur][inst.id], false)}" />
        <span class="rate-sign">%</span>
      </div>
    </div>
    <div class="card-amount">
      <div class="card-amount-value" data-amount>—</div>
      <div class="card-amount-label">${t("total_required")}</div>
      <div class="card-effrate" data-eff hidden></div>
    </div>`;
  return card;
}

function buildRealEstateCard(inst, idx, meta) {
  const cur = state.currency;
  const re = state.realEstate[cur];
  const card = document.createElement("article");
  card.className = "card card--realestate";
  card.dataset.card = "realestate";
  card.style.setProperty("--card-color", inst.color);
  card.style.animationDelay = `${idx * 55}ms`;

  card.innerHTML = `
    <div class="card-accent"></div>
    <div class="re-grid">
      <div class="re-main">
        <div class="card-head">
          <div>
            <h3 class="card-title">${instName("realestate")}</h3>
            <p class="card-sub">${instSub(inst)}</p>
          </div>
          <span class="card-badge" data-badge hidden></span>
        </div>
        <div class="card-rate">
          <span class="card-rate-label">${t("gross_yield")}</span>
          <div class="rate-input">
            <input type="text" inputmode="decimal" data-id="realestate" value="${formatRate(state.rates[cur].realestate, false)}" />
            <span class="rate-sign">%</span>
          </div>
        </div>
        <div class="card-amount">
          <div class="card-amount-value" data-amount>—</div>
          <div class="card-amount-label">${t("total_required_re")}</div>
          <div class="card-effrate" data-eff hidden></div>
        </div>
      </div>
      <div class="re-calc">
        <div class="re-calc-title">${t("use_property")} <span>${t("optional")}</span></div>
        <label class="re-field">${t("property_value")}
          <div class="money-input money-input--sm">
            <span class="money-symbol">${meta.symbol}</span>
            <input type="text" inputmode="numeric" data-re="propertyValue" value="${re.propertyValue ? formatThousands(re.propertyValue) : ""}" placeholder="${t("eg")} ${meta.valueHint}" />
          </div>
        </label>
        <label class="re-field">${t("monthly_rent")}
          <div class="money-input money-input--sm">
            <span class="money-symbol">${meta.symbol}</span>
            <input type="text" inputmode="numeric" data-re="monthlyRent" value="${re.monthlyRent ? formatThousands(re.monthlyRent) : ""}" placeholder="${t("eg")} ${meta.rentHint}" />
          </div>
        </label>
        <div class="re-computed" data-recomputed hidden></div>
        <label class="switch switch--sm">
          <input type="checkbox" data-re="netYield" ${re.netYield ? "checked" : ""} />
          <span class="switch-track"><span class="switch-thumb"></span></span>
          <span class="switch-label">${t("net_yield")} <small>${t("net_yield_sub")}</small></span>
        </label>
      </div>
    </div>`;
  return card;
}

function wireDynamicInputs() {
  el.cards.querySelectorAll("input[data-id]").forEach((input) => {
    input.addEventListener("input", () => {
      if (input.disabled) return;
      state.rates[state.currency][input.dataset.id] = parseDecimal(input.value);
      refresh();
    });
  });
  el.cards.querySelectorAll("input[data-re]").forEach((input) => {
    const field = input.dataset.re;
    if (field === "netYield") {
      input.addEventListener("change", () => { state.realEstate[state.currency].netYield = input.checked; refresh(); });
    } else {
      input.addEventListener("input", () => { state.realEstate[state.currency][field] = parseNumber(input.value); refresh(); });
      input.addEventListener("blur", () => { const v = state.realEstate[state.currency][field]; if (v > 0) input.value = formatThousands(v); });
    }
  });
}

function refresh() {
  saveState();
  const list = INSTRUMENTS[state.currency];
  const results = list.map((inst) => {
    const nominal = instrumentNominal(inst);
    return { inst, nominal, eff: effectiveRate(nominal) * 100, required: requiredSavings(nominal) };
  });
  const reachable = results.filter((r) => isFinite(r.required));
  const best = reachable.reduce((a, b) => (b.required < a.required ? b : a), reachable[0] || null);

  results.forEach((r) => { const card = el.cards.querySelector(`[data-card="${r.inst.id}"]`); if (card) updateCard(card, r, best); });

  const finite = results.filter((r) => isFinite(r.required)).map((r) => r.required);
  const max = finite.length ? Math.max(...finite) : 0;
  results.forEach((r) => { const row = el.bars.querySelector(`[data-bar="${r.inst.id}"]`); if (row) updateBar(row, r, best, max); });

  renderHeadline(best, results, reachable.length);
  renderRule();
  renderHomeSummaries();
}

function updateCard(card, r, best) {
  const { inst, nominal, eff, required } = r;
  const isBest = best && inst.id === best.inst.id;
  const unreachable = !isFinite(required);
  card.classList.toggle("is-best", !!isBest);

  const amountEl = card.querySelector("[data-amount]");
  if (unreachable) { amountEl.textContent = t("doesnt_outpace"); amountEl.classList.add("unreachable"); }
  else { amountEl.textContent = formatMoney(required); amountEl.classList.remove("unreachable"); }

  const badge = card.querySelector("[data-badge]");
  if (isBest) { badge.hidden = false; badge.className = "card-badge badge-best"; badge.textContent = t("easiest"); }
  else if (inst.warn) { badge.hidden = false; badge.className = "card-badge badge-warn"; badge.textContent = t("volatile"); }
  else { badge.hidden = true; badge.textContent = ""; }

  const effEl = card.querySelector("[data-eff]");
  if (inst.realEstate) {
    updateReCard(card, effEl);
  } else if (state.realMode) {
    effEl.hidden = false;
    effEl.innerHTML = `${t("lbl_real_rate")}: ${formatRate(eff)} &nbsp;(${formatRate(nominal)} − ${formatRate(state.inflation[state.currency])} ${t("word_inflation")})`;
  } else {
    effEl.hidden = true;
  }
}

function updateReCard(card, effEl) {
  const cur = state.currency;
  const customActive = reCustomActive(cur);
  const grossRaw = reGrossYield(cur);
  const net = state.realEstate[cur].netYield ? NET_COST : 0;
  const infl = state.realMode ? state.inflation[cur] : 0;
  const effective = grossRaw - net - infl;

  const yInput = card.querySelector('input[data-id="realestate"]');
  if (customActive) {
    yInput.disabled = true; yInput.classList.add("is-auto");
    if (yInput !== document.activeElement) yInput.value = formatRate(grossRaw, false);
  } else if (yInput.disabled) {
    yInput.disabled = false; yInput.classList.remove("is-auto");
    yInput.value = formatRate(state.rates[cur].realestate, false);
  }

  const comp = card.querySelector("[data-recomputed]");
  if (customActive) { comp.hidden = false; comp.textContent = t("computed_yield", { rate: formatRate(grossRaw) }); }
  else comp.hidden = true;

  const parts = [];
  if (net) parts.push(`−${net}% ${t("word_costs")}`);
  if (infl) parts.push(`− ${formatRate(infl)} ${t("word_inflation")}`);
  if (parts.length) {
    effEl.hidden = false;
    const label = net && infl ? t("eff_effective") : net ? t("eff_net") : t("eff_real");
    effEl.innerHTML = `${label} ${t("word_yield")}: ${formatRate(effective)} &nbsp;(${formatRate(grossRaw)} ${t("word_gross")} ${parts.join(" ")})`;
  } else {
    effEl.hidden = true;
  }
}

function updateBar(row, r, best, max) {
  const { inst, required } = r;
  const unreachable = !isFinite(required);
  const isBest = best && inst.id === best.inst.id;
  const fill = row.querySelector(".bar-fill");
  const val = row.querySelector(".bar-value");
  if (unreachable) { fill.classList.add("unreachable"); fill.style.width = "100%"; val.textContent = t("out_of_reach"); }
  else { fill.classList.remove("unreachable"); fill.style.width = (max === 0 ? 0 : Math.max(4, (required / max) * 100)) + "%"; val.textContent = formatMoney(required, { compact: true }); }
}

function renderHeadline(best, results, reachableCount) {
  if (!best) {
    setAnimatedText(el.bestAmount, t("not_reachable"));
    el.bestLabel.textContent = t("no_beat_inflation");
    el.bestRate.textContent = "";
    el.headlineNote.textContent = t("not_reachable_note");
    return;
  }
  setAnimatedText(el.bestAmount, formatMoney(best.required));
  el.bestLabel.textContent = t("via", { name: instName(best.inst.id) });
  el.bestRate.textContent = `${formatRate(best.eff)} ${state.realMode ? t("real_word") + " " : ""}${t("return_word")}`;
  const note = t("headline_note", { name: instName(best.inst.id), monthly: formatMoney(state.monthlyExpenses) });
  el.headlineNote.textContent = note + (reachableCount < results.length ? t("headline_note_extra") : "");
}

function renderRule() {
  setAnimatedText(el.ruleNumber, formatMoney(state.monthlyExpenses * 12 * 25));
}

function setAnimatedText(node, value) {
  if (!node || node.textContent === value) return;
  node.textContent = value;
  if (!state.motion || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
  node.classList.remove("value-change");
  void node.offsetWidth;
  node.classList.add("value-change");
  node.addEventListener("animationend", () => node.classList.remove("value-change"), { once: true });
}

function setupScrollReveal() {
  const savings = document.getElementById("view-savings");
  const targets = [
    ...(savings ? savings.querySelectorAll(":scope > section, :scope > article, :scope > .expense-list-panel") : []),
    ...document.querySelectorAll("#freedomWidgetBody > .controls, #freedomWidgetBody > .headline, #freedomWidgetBody > #learn, #freedomWidgetBody > #compare, #freedomWidgetBody > .chart, #freedomWidgetBody > .disclaimer"),
  ];
  if (!targets.length) return;
  targets.forEach((target) => target.classList.add("reveal-item"));
  const reveal = (target) => target.classList.add("is-visible");
  if (!state.motion || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) || !("IntersectionObserver" in window)) {
    targets.forEach(reveal);
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
  targets.forEach((target) => observer.observe(target));
}

// ============================================================
//  Expenses (Gider) — monthly tracker with reminders + history
// ============================================================
function currentYM(d = new Date()) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); }
function monthLabel(ym) {
  const [y, m] = (ym || currentYM()).split("-").map(Number);
  const locale = state.lang === "tr" ? "tr-TR" : "en-US";
  return new Date(y, m - 1, 1).toLocaleDateString(locale, { month: "long", year: "numeric" });
}
function ecatName(c) { return (langPack().ecat && langPack().ecat[c]) || (I18N.en.ecat && I18N.en.ecat[c]) || c; }

// Roll over to the current calendar month: archive the previous month's total,
// clear one-off entries, and reset each recurring bill's "paid" flag.
function rollExpenseMonth() {
  const e = state.expenses;
  const now = currentYM();
  if (!e.month) { e.month = now; return; }
  if (e.month === now) return;
  e.history.unshift({ month: e.month, total: expensesTotal() });
  if (e.history.length > 36) e.history.length = 36;
  e.oneoff = [];
  (e.recurring || []).forEach((r) => (r.paid = false));
  // Reset per-vehicle spends too, remembering each car's total for "last month".
  (state.vehicles || []).forEach((v) => { v.lastMonthSpent = vehMonthlyTotal(v); v.oneoff = []; });
  e.month = now;
}

// Spent so far this month = PAID recurring bills + this month's logged spends.
// Shown as the Expenses view's "this month" total — an unpaid bill is only an
// upcoming reminder, not yet a real spend.
function expensesTotal() {
  const e = state.expenses;
  let total = 0;
  (e.recurring || []).forEach((r) => { if (r.paid) total += r.amount || 0; });
  (e.oneoff || []).forEach((o) => (total += o.amount || 0));
  return total + vehiclesMonthlyTotal();
}
// Monthly expense level = ALL recurring bills (fixed monthly obligations, paid or
// not) + this month's spends + vehicle costs. Used by the Income freedom check and
// the Portfolio cash flow, so an unpaid rent doesn't make you look "financially free".
function monthlyBurn() {
  const e = state.expenses;
  let total = 0;
  (e.recurring || []).forEach((r) => (total += r.amount || 0));
  (e.oneoff || []).forEach((o) => (total += o.amount || 0));
  return total + vehiclesMonthlyTotal();
}

// A vehicle's spend this month = its logged expenses + scheduled payments paid
// this month. Scheduled (dated) payments are one-time, so they only count in the
// month they were marked paid.
function vehMonthlyTotal(v) {
  let t = 0;
  (v.oneoff || []).forEach((o) => (t += o.amount || 0));
  (v.sched || []).forEach((s) => { if (s.paidMonth && s.paidMonth === state.expenses.month) t += s.amount || 0; });
  return t;
}
function vehiclesMonthlyTotal() { return (state.vehicles || []).reduce((a, v) => a + vehMonthlyTotal(v), 0); }

// ---- Monthly category budgets ----
function normalizedCategory(value) {
  return String(value || "").trim().toLocaleLowerCase(state.lang === "tr" ? "tr-TR" : "en-US").replace(/\s+/g, " ");
}
function expenseCategoryId(value) {
  const normalized = normalizedCategory(value);
  return EXPENSE_CATS.find((id) => [id, I18N.en.ecat[id], I18N.tr.ecat[id]].some((label) => normalizedCategory(label) === normalized)) || "";
}
function resolveBudgetCategory(value) {
  const trimmed = String(value || "").trim().slice(0, 40);
  const preset = expenseCategoryId(trimmed);
  if (preset) return { category: preset, label: "" };
  if (["vehicle", I18N.en.budget_vehicle, I18N.tr.budget_vehicle].some((label) => normalizedCategory(label) === normalizedCategory(trimmed))) {
    return { category: "vehicle", label: "" };
  }
  return { category: "custom", label: trimmed };
}
function budgetItemLabel(item) {
  if (item.category === "vehicle") return t("budget_vehicle");
  if (EXPENSE_CATS.includes(item.category)) return ecatName(item.category);
  return item.label || t("budget_category");
}
function currentBudgetItems() {
  return state.monthlyBudget.items.filter((item) => item.currency === state.currency);
}
function budgetItemMatches(item, rawCategory) {
  if (item.category === "vehicle") return false;
  if (EXPENSE_CATS.includes(item.category)) return expenseCategoryId(rawCategory) === item.category;
  return normalizedCategory(rawCategory) === normalizedCategory(item.label);
}
function budgetItemSpent(item) {
  if (item.category === "vehicle") return vehiclesMonthlyTotal();
  let total = 0;
  state.expenses.recurring.forEach((expense) => { if (expense.paid && budgetItemMatches(item, expense.cat)) total += expense.amount || 0; });
  state.expenses.oneoff.forEach((expense) => { if (budgetItemMatches(item, expense.cat)) total += expense.amount || 0; });
  return total;
}
function renderMonthlyBudget() {
  if (!el.budgetList) return;
  const items = currentBudgetItems();
  const spent = expensesTotal();
  const limit = items.reduce((sum, item) => sum + (item.limit || 0), 0);
  const budgetedSpent = items.reduce((sum, item) => sum + budgetItemSpent(item), 0);
  const unbudgetedSpent = Math.max(0, spent - budgetedSpent);
  const remaining = limit - spent;
  const rate = limit > 0 ? (spent / limit) * 100 : 0;
  const cappedRate = Math.min(100, Math.max(0, rate));

  el.budgetMonth.textContent = monthLabel(state.expenses.month);
  el.budgetSpent.textContent = formatMoney(spent);
  el.budgetLimit.textContent = formatMoney(limit);
  el.budgetRemaining.textContent = limit > 0 ? (remaining >= 0 ? formatMoney(remaining) : "−" + formatMoney(Math.abs(remaining))) : "—";
  el.budgetRemaining.classList.toggle("is-over", limit > 0 && remaining < 0);
  el.budgetProgressFill.style.width = cappedRate + "%";
  el.budgetProgress.classList.toggle("is-near", rate >= 80 && rate < 100);
  el.budgetProgress.classList.toggle("is-over", rate >= 100);
  el.budgetProgress.setAttribute("aria-valuenow", String(Math.round(cappedRate)));
  const progressMessage = limit <= 0
    ? t("budget_no_limit")
    : remaining < 0
      ? t("budget_over", { amount: formatMoney(Math.abs(remaining)) })
      : t("budget_progress", { rate: Math.round(rate) });
  el.budgetProgressText.textContent = progressMessage + (limit > 0 && unbudgetedSpent > 0 ? " · " + t("budget_unbudgeted", { amount: formatMoney(unbudgetedSpent) }) : "");

  el.budgetEmpty.hidden = items.length > 0;
  el.budgetList.innerHTML = items.map((item) => {
    const itemSpent = budgetItemSpent(item);
    const itemRate = item.limit > 0 ? (itemSpent / item.limit) * 100 : 0;
    const itemWidth = Math.min(100, Math.max(0, itemRate));
    const stateClass = itemRate >= 100 ? " is-over" : itemRate >= 80 ? " is-near" : "";
    return `<div class="budget-row${stateClass}" data-budget-id="${escapeHtml(item.id)}">
      <div class="budget-row-head"><strong>${escapeHtml(budgetItemLabel(item))}</strong><span>${formatMoney(itemSpent)} / ${formatMoney(item.limit)}</span></div>
      <div class="budget-row-track" aria-hidden="true"><span style="width:${itemWidth}%"></span></div>
      <div class="budget-row-actions">
        <label class="money-input money-input--sm"><span class="money-symbol exp-symbol">${CURRENCY_META[state.currency].symbol}</span><input type="text" inputmode="numeric" data-budget-limit="${escapeHtml(item.id)}" value="${item.limit ? formatThousands(item.limit) : ""}" aria-label="${escapeHtml(t("budget_limit") + " · " + budgetItemLabel(item))}" /></label>
        <button class="cat-remove" type="button" data-budget-delete="${escapeHtml(item.id)}" aria-label="remove">×</button>
      </div>
    </div>`;
  }).join("");

  el.budgetList.querySelectorAll("[data-budget-limit]").forEach((input) => {
    input.addEventListener("change", () => {
      const item = state.monthlyBudget.items.find((entry) => entry.id === input.dataset.budgetLimit);
      if (!item) return;
      const nextLimit = Math.max(0, parseNumber(input.value));
      if (!(nextLimit > 0)) { showAppToast(t("budget_invalid")); renderMonthlyBudget(); return; }
      item.limit = nextLimit;
      saveState(); renderMonthlyBudget();
    });
    input.addEventListener("blur", () => { if (parseNumber(input.value) > 0) input.value = formatThousands(parseNumber(input.value)); });
  });
  el.budgetList.querySelectorAll("[data-budget-delete]").forEach((button) => button.addEventListener("click", () => {
    state.monthlyBudget.items = state.monthlyBudget.items.filter((item) => item.id !== button.dataset.budgetDelete);
    saveState(); renderMonthlyBudget(); sfx("remove");
  }));
}
function saveBudgetLimit(event) {
  event.preventDefault();
  const resolved = resolveBudgetCategory(el.budgetCategory.value);
  const limit = Math.max(0, parseNumber(el.budgetAmount.value));
  if ((!resolved.label && resolved.category === "custom") || !(limit > 0)) { showAppToast(t("budget_invalid")); return; }
  const existing = currentBudgetItems().find((item) => item.category === resolved.category && (resolved.category !== "custom" || normalizedCategory(item.label) === normalizedCategory(resolved.label)));
  if (existing) existing.limit = limit;
  else state.monthlyBudget.items.push({ id: "b" + ++state.monthlyBudget.seq, currency: state.currency, category: resolved.category, label: resolved.label, limit });
  el.budgetCategory.value = "";
  el.budgetAmount.value = "";
  saveState(); renderMonthlyBudget(); sfx("success"); showAppToast(t("budget_saved"));
}

function buildExpenses() {
  // category suggestions (translated presets; users can still type their own)
  el.expCatList.innerHTML = [...EXPENSE_CATS.map((c) => ecatName(c)), t("budget_vehicle")].map((label) => `<option value="${escapeHtml(label)}"></option>`).join("");
  el.expRecList.innerHTML = "";
  state.expenses.recurring.forEach((r) => el.expRecList.appendChild(makeRecRow(r)));
  el.expOneList.innerHTML = "";
  state.expenses.oneoff.forEach((o) => el.expOneList.appendChild(makeOneRow(o)));
  refreshExpenses();
}

function makeRecRow(r) {
  const sym = CURRENCY_META[state.currency].symbol;
  const row = document.createElement("div");
  row.className = "cat-row exp-row";
  row.dataset.rec = r.id;
  row.innerHTML = `
    <input class="cat-name exp-cat" list="expCatList" data-rec-cat="${escapeHtml(r.id)}" value="${escapeHtml(r.cat || "")}" placeholder="${escapeHtml(t("exp_cat_ph"))}" />
    <div class="exp-day"><span class="exp-day-pre">📅</span><input class="exp-dayfield" inputmode="numeric" data-rec-day="${r.id}" value="${r.dueDay || ""}" placeholder="${t("exp_day_ph")}" maxlength="2" /></div>
    <div class="money-input money-input--sm cat-amount"><span class="money-symbol exp-symbol">${sym}</span><input type="text" inputmode="numeric" data-rec-amt="${r.id}" value="${r.amount ? formatThousands(r.amount) : ""}" placeholder="0" /></div>
    <button class="cat-remove" type="button" data-rec-del="${r.id}" aria-label="remove">×</button>`;

  row.querySelector("[data-rec-cat]").addEventListener("input", (e) => { r.cat = e.target.value; refreshExpenses(); });
  const day = row.querySelector("[data-rec-day]");
  day.addEventListener("input", () => { r.dueDay = clampDay(parseNumber(day.value)); refreshExpenses(); });
  const amt = row.querySelector("[data-rec-amt]");
  amt.addEventListener("input", () => { r.amount = parseNumber(amt.value); refreshExpenses(); });
  amt.addEventListener("blur", () => { if (r.amount > 0) amt.value = formatThousands(r.amount); });
  row.querySelector("[data-rec-del]").addEventListener("click", () => {
    state.expenses.recurring = state.expenses.recurring.filter((x) => x.id !== r.id);
    row.remove(); refreshExpenses();
  });
  return row;
}

function makeOneRow(o) {
  const sym = CURRENCY_META[state.currency].symbol;
  const row = document.createElement("div");
  row.className = "cat-row exp-row";
  row.dataset.one = o.id;
  row.innerHTML = `
    <div class="exp-day"><input class="exp-dayfield" inputmode="numeric" data-one-day="${o.id}" value="${o.day || ""}" placeholder="${t("exp_day_ph")}" maxlength="2" /></div>
    <input class="cat-name exp-cat" list="expCatList" data-one-cat="${escapeHtml(o.id)}" value="${escapeHtml(o.cat || "")}" placeholder="${escapeHtml(t("exp_cat_ph"))}" />
    <div class="money-input money-input--sm cat-amount"><span class="money-symbol exp-symbol">${sym}</span><input type="text" inputmode="numeric" data-one-amt="${o.id}" value="${o.amount ? formatThousands(o.amount) : ""}" placeholder="0" /></div>
    <button class="cat-remove" type="button" data-one-del="${o.id}" aria-label="remove">×</button>`;

  const day = row.querySelector("[data-one-day]");
  day.addEventListener("input", () => { o.day = clampDay(parseNumber(day.value)); refreshExpenses(); });
  row.querySelector("[data-one-cat]").addEventListener("input", (e) => { o.cat = e.target.value; refreshExpenses(); });
  const amt = row.querySelector("[data-one-amt]");
  amt.addEventListener("input", () => { o.amount = parseNumber(amt.value); refreshExpenses(); });
  amt.addEventListener("blur", () => { if (o.amount > 0) amt.value = formatThousands(o.amount); });
  row.querySelector("[data-one-del]").addEventListener("click", () => {
    state.expenses.oneoff = state.expenses.oneoff.filter((x) => x.id !== o.id);
    row.remove(); refreshExpenses();
  });
  return row;
}

function clampDay(n) { n = Math.round(n) || 0; return n < 1 ? 0 : n > 31 ? 31 : n; }

function addRecurring() {
  const r = { id: "r" + ++state.expenses.recSeq, cat: "", amount: 0, dueDay: 1, paid: false };
  state.expenses.recurring.push(r);
  const row = makeRecRow(r);
  el.expRecList.appendChild(row);
  row.querySelector("[data-rec-cat]").focus();
  refreshExpenses();
}
function addExpense() {
  const o = { id: "o" + ++state.expenses.oneSeq, day: new Date().getDate(), cat: "", amount: 0 };
  state.expenses.oneoff.push(o);
  const row = makeOneRow(o);
  el.expOneList.appendChild(row);
  row.querySelector("[data-one-cat]").focus();
  refreshExpenses();
}

function refreshExpenses() {
  saveState();
  const sym = CURRENCY_META[state.currency].symbol;
  document.querySelectorAll("#view-savings .exp-symbol").forEach((s) => (s.textContent = sym));
  el.expMonthLabel.textContent = monthLabel(state.expenses.month);
  el.expTotal.textContent = formatMoney(expensesTotal());
  renderMonthlyBudget();

  // Reminders: recurring bills + vehicle dated payments, combined into one list.
  const todayDay = new Date().getDate();
  const today0 = new Date(); today0.setHours(0, 0, 0, 0);
  const items = [];
  state.expenses.recurring.forEach((r) => {
    if (!((r.amount || 0) > 0 || r.cat)) return;
    const st = remStatusRec(r, todayDay);
    items.push({ id: "rec|" + r.id, title: r.cat || t("exp_cat_ph"), sub: t("exp_due_fmt", { day: r.dueDay || "—" }), urg: (r.dueDay || 99) - todayDay, amount: r.amount || 0, paid: !!r.paid, cls: st.cls, badge: st.badge });
  });
  (state.vehicles || []).forEach((v) => {
    (v.sched || []).forEach((s) => {
      if (!((s.amount || 0) > 0 || s.label)) return;
      const st = remStatusVeh(s, today0);
      const tag = v.plate ? ` · <span class="exp-rem-tag">${escapeHtml(v.plate)}</span>` : "";
      items.push({ id: "veh|" + v.id + "|" + s.id, title: s.label || t("veh_label_ph"), sub: vehDateLabel(s) + tag, urg: st.urg, amount: s.amount || 0, paid: !!s.paidMonth, cls: st.cls, badge: st.badge });
    });
  });
  el.expReminders.hidden = items.length === 0;
  el.expRemTotal.textContent = formatMoney(items.reduce((a, it) => a + (it.paid ? 0 : it.amount), 0));
  items.sort((a, b) => (a.paid - b.paid) || (a.urg - b.urg));
  el.expReminderList.innerHTML = items.map((it) => `
    <div class="exp-reminder ${it.cls}" data-rem-id="${it.id}">
      <button class="exp-paid" type="button" data-rem-paid="${it.id}" aria-label="${t("exp_paid")}">✓</button>
      <div class="exp-rem-main"><div class="exp-rem-cat">${escapeHtml(it.title)}</div>
        <div class="exp-rem-sub">${it.sub}${it.badge ? ` · <span class="exp-rem-badge">${it.badge}</span>` : ""}</div></div>
      <div class="exp-rem-amt">${formatMoney(it.amount)}</div>
    </div>`).join("");
  el.expReminderList.querySelectorAll("[data-rem-paid]").forEach((b) => b.addEventListener("click", () => toggleReminderPaid(b.dataset.remPaid)));

  // History (archived past months)
  const hist = state.expenses.history || [];
  el.expHistorySec.hidden = hist.length === 0;
  el.expHistList.innerHTML = hist
    .map((h) => `<div class="exp-hist-row"><span>${monthLabel(h.month)}</span><strong>${formatMoney(h.total)}</strong></div>`)
    .join("");

  refreshVehicles();
}

// Reminder status helpers (shared by recurring bills + vehicle dated payments).
function remStatusRec(r, todayDay) {
  if (r.paid) return { cls: "is-paid", badge: "" };
  if (r.dueDay && todayDay > r.dueDay) return { cls: "is-over", badge: t("exp_overdue") };
  if (r.dueDay && r.dueDay - todayDay <= 3) return { cls: "is-soon", badge: t("exp_soon") };
  return { cls: "is-up", badge: "" };
}
function remStatusVeh(s, today0) {
  if (s.paidMonth) return { cls: "is-paid", badge: "", urg: 9999 };
  if (!s.date) return { cls: "is-up", badge: "", urg: 999 };
  const due = new Date(s.date + "T00:00:00");
  if (isNaN(due)) return { cls: "is-up", badge: "", urg: 999 };
  const days = Math.round((due - today0) / 86400000);
  if (days < 0) return { cls: "is-over", badge: t("exp_overdue"), urg: days };
  if (days <= 14) return { cls: "is-soon", badge: t("exp_soon"), urg: days };
  return { cls: "is-up", badge: "", urg: days };
}
function vehDateLabel(s) {
  if (!s.date) return "—";
  const d = new Date(s.date + "T00:00:00");
  if (isNaN(d)) return s.date;
  return d.toLocaleDateString(state.lang === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "short" });
}
function toggleReminderPaid(id) {
  if (id.indexOf("rec|") === 0) {
    const r = state.expenses.recurring.find((x) => x.id === id.slice(4));
    if (r) r.paid = !r.paid;
  } else if (id.indexOf("veh|") === 0) {
    const p = id.split("|");
    const v = (state.vehicles || []).find((x) => x.id === p[1]);
    const s = v && (v.sched || []).find((x) => x.id === p[2]);
    if (s) s.paidMonth = s.paidMonth ? "" : state.expenses.month;
  }
  refreshExpenses();
}

// ============================================================
//  Vehicles (Araçlarım) — plate, dated payment reminders, expenses
// ============================================================
function vschedName(c) { return (langPack().vsched && langPack().vsched[c]) || (I18N.en.vsched && I18N.en.vsched[c]) || c; }
function vcatName(c) { return (langPack().vcat && langPack().vcat[c]) || (I18N.en.vcat && I18N.en.vcat[c]) || c; }

function buildVehicles() {
  el.vehSchedList.innerHTML = VEH_SCHED_PRESETS.map((c) => `<option value="${vschedName(c).replace(/"/g, "&quot;")}"></option>`).join("");
  el.vehCatList.innerHTML = VEH_EXP_PRESETS.map((c) => `<option value="${vcatName(c).replace(/"/g, "&quot;")}"></option>`).join("");
  const vehicles = state.vehicles || [];
  if (el.vehCount) el.vehCount.textContent = t("veh_count", { count: vehicles.length });
  el.vehList.innerHTML = "";
  if (!vehicles.length) {
    el.vehList.innerHTML = `<div class="veh-empty-state">
      <span class="veh-empty-icon" aria-hidden="true">${uiIconSvg("car")}</span>
      <div><strong>${t("veh_empty_title")}</strong><p>${t("veh_empty_sub")}</p></div>
    </div>`;
    return;
  }
  vehicles.forEach((v) => el.vehList.appendChild(makeVehicleCard(v)));
}

function refreshVehicles() {
  (state.vehicles || []).forEach((v) => {
    const card = el.vehList.querySelector(`[data-veh="${v.id}"]`);
    if (!card) return;
    const tEl = card.querySelector("[data-veh-total]");
    if (tEl) tEl.textContent = formatMoney(vehMonthlyTotal(v));
    const lm = card.querySelector("[data-veh-lastmonth]");
    if (lm) {
      lm.hidden = !(v.lastMonthSpent > 0);
      if (!lm.hidden) lm.textContent = t("flow_last_month", { x: formatMoney(v.lastMonthSpent) });
    }
    (v.sched || []).forEach((s) => {
      const row = card.querySelector(`[data-vsched="${s.id}"]`);
      if (row) updateVehSchedStatus(row, s);
    });
  });
}

function makeVehicleCard(v) {
  const sym = CURRENCY_META[state.currency].symbol;
  const multi = (state.vehicles || []).length > 1;
  const isActive = (activeVehicle() || {}).id === v.id;
  const card = document.createElement("div");
  card.className = "veh-card" + (isActive ? " is-active" : "");
  card.dataset.veh = v.id;
  const fuelOpts = CAR_FUELS.map((f) => `<option value="${f}"${v.fuel === f ? " selected" : ""}>${t("car_fuel_" + f)}</option>`).join("");
  card.innerHTML = `
    <div class="veh-head">
      <div class="veh-head-main">
        <div class="veh-identity"><span>${t("car_vehicle")}</span><input class="veh-plate" data-veh-plate value="${escapeHtml(v.plate || "")}" placeholder="${escapeHtml(t("car_model_ph"))}" /></div>
      </div>
      <div class="veh-head-actions">
        ${multi ? `<button class="veh-active" type="button" data-veh-active aria-label="${t("car_active")}" title="${t("car_active")}" aria-pressed="${isActive}"><span aria-hidden="true"></span>${t("car_active")}</button>` : `<span class="veh-active-label"><span aria-hidden="true"></span>${t("car_active")}</span>`}
        <button class="cat-remove veh-del" type="button" data-veh-del aria-label="${t("veh_remove")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5"></path></svg></button>
      </div>
    </div>
    <div class="veh-showcase veh-showcase--summary">
      <div class="veh-monthly">
        <span>${t("veh_monthly")}</span>
        <strong data-veh-total>—</strong>
        <small class="veh-lastmonth" data-veh-lastmonth hidden></small>
      </div>
    </div>
    <div class="car-prof-grid veh-specs">
      <label class="car-field"><span>${t("car_fuel_type")}</span><select class="car-select" data-veh-fuel>${fuelOpts}</select></label>
      <label class="car-field"><span>${t("car_consumption")} <small>${t("car_consumption_hint")}</small></span>
        <input class="car-num" inputmode="decimal" data-veh-cons value="${v.consumption ? locDec(v.consumption) : ""}" placeholder="7" /></label>
      <label class="car-field"><span>${t("car_price")} <small>${t("car_price_hint")}</small></span>
        <div class="money-input money-input--sm"><span class="money-symbol">${sym}</span><input inputmode="decimal" data-veh-price value="${v.price ? locDec(v.price) : ""}" placeholder="0" /></div></label>
    </div>
    <div class="veh-sub-grid">
      <details class="veh-sub veh-sub--reminders">
        <summary class="veh-sub-head"><span>${t("veh_reminders")}</span><span class="veh-sub-count" data-veh-reminder-count>${(v.sched || []).length}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg></summary>
        <div class="veh-sub-body"><div class="veh-sched-wrap" data-veh-sched-list></div><button class="veh-add-btn" type="button" data-veh-add-sched>${t("veh_add_reminder")}</button></div>
      </details>
      <details class="veh-sub veh-sub--expenses">
        <summary class="veh-sub-head"><span>${t("veh_expenses")}</span><span class="veh-sub-count" data-veh-expense-count>${(v.oneoff || []).length}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg></summary>
        <div class="veh-sub-body"><div class="veh-exp-wrap" data-veh-exp-list></div><button class="veh-add-btn" type="button" data-veh-add-exp>${t("veh_add_expense")}</button></div>
      </details>
    </div>`;

  card.querySelector("[data-veh-plate]").addEventListener("input", (e) => { v.plate = e.target.value; saveState(); });
  const active = card.querySelector("[data-veh-active]");
  if (active) active.addEventListener("click", () => { state.vehicleHub.activeVehicle = v.id; buildVehicles(); refreshVehicles(); renderCarRoute(); saveState(); });
  card.querySelector("[data-veh-fuel]").addEventListener("change", (e) => { v.fuel = e.target.value; saveState(); });
  const vcons = card.querySelector("[data-veh-cons]");
  vcons.addEventListener("input", () => { v.consumption = parseDecimal(vcons.value); renderCarRoute(); });
  vcons.addEventListener("blur", saveState);
  const vprice = card.querySelector("[data-veh-price]");
  vprice.addEventListener("input", () => { v.price = parseDecimal(vprice.value); renderCarRoute(); });
  vprice.addEventListener("blur", saveState);
  card.querySelector("[data-veh-del]").addEventListener("click", () => {
    state.vehicles = state.vehicles.filter((x) => x.id !== v.id);
    if (state.vehicleHub.activeVehicle === v.id) state.vehicleHub.activeVehicle = "";
    buildVehicles(); refreshVehicles(); renderCarRoute(); refreshExpenses();
  });

  const sl = card.querySelector("[data-veh-sched-list]");
  (v.sched || []).forEach((s) => sl.appendChild(makeVehSchedRow(v, s)));
  const xl = card.querySelector("[data-veh-exp-list]");
  (v.oneoff || []).forEach((o) => xl.appendChild(makeVehExpRow(v, o)));

  card.querySelector("[data-veh-add-sched]").addEventListener("click", () => {
    const s = { id: "s" + ++v.schedSeq, label: "", amount: 0, date: "", paidMonth: "" };
    v.sched.push(s);
    const row = makeVehSchedRow(v, s); sl.appendChild(row); syncVehicleCardCounts(card, v);
    row.querySelector("[data-vs-label]").focus();
    refreshExpenses();
  });
  card.querySelector("[data-veh-add-exp]").addEventListener("click", () => {
    const o = { id: "x" + ++v.expSeq, day: new Date().getDate(), cat: "", amount: 0 };
    v.oneoff.push(o);
    const row = makeVehExpRow(v, o); xl.appendChild(row); syncVehicleCardCounts(card, v);
    row.querySelector("[data-vx-cat]").focus();
    refreshExpenses();
  });
  return card;
}

function syncVehicleCardCounts(card, vehicle) {
  if (!card || !vehicle) return;
  const reminders = card.querySelector("[data-veh-reminder-count]");
  const expenses = card.querySelector("[data-veh-expense-count]");
  if (reminders) reminders.textContent = String((vehicle.sched || []).length);
  if (expenses) expenses.textContent = String((vehicle.oneoff || []).length);
}

function makeVehSchedRow(v, s) {
  const sym = CURRENCY_META[state.currency].symbol;
  const row = document.createElement("div");
  row.className = "veh-sched-row";
  row.dataset.vsched = s.id;
  row.innerHTML = `
    <button class="exp-paid" type="button" data-vs-paid aria-label="${t("exp_paid")}">✓</button>
    <input class="cat-name veh-sched-label" list="vehSchedList" data-vs-label value="${escapeHtml(s.label || "")}" placeholder="${escapeHtml(t("veh_label_ph"))}" />
    <input type="date" class="veh-date" data-vs-date value="${s.date || ""}" />
    <div class="money-input money-input--sm veh-amt"><span class="money-symbol exp-symbol">${sym}</span><input type="text" inputmode="numeric" data-vs-amt value="${s.amount ? formatThousands(s.amount) : ""}" placeholder="0" /></div>
    <button class="cat-remove" type="button" data-vs-del aria-label="remove">×</button>`;

  row.querySelector("[data-vs-paid]").addEventListener("click", () => { s.paidMonth = s.paidMonth ? "" : state.expenses.month; refreshExpenses(); });
  row.querySelector("[data-vs-label]").addEventListener("input", (e) => { s.label = e.target.value; saveState(); });
  row.querySelector("[data-vs-date]").addEventListener("input", (e) => { s.date = e.target.value; updateVehSchedStatus(row, s); saveState(); checkVehicleNotifications(); });
  const amt = row.querySelector("[data-vs-amt]");
  amt.addEventListener("input", () => { s.amount = parseNumber(amt.value); refreshExpenses(); });
  amt.addEventListener("blur", () => { if (s.amount > 0) amt.value = formatThousands(s.amount); });
  row.querySelector("[data-vs-del]").addEventListener("click", () => { v.sched = v.sched.filter((x) => x.id !== s.id); const card = row.closest(".veh-card"); row.remove(); syncVehicleCardCounts(card, v); refreshExpenses(); });
  updateVehSchedStatus(row, s);
  return row;
}

function updateVehSchedStatus(row, s) {
  row.classList.remove("is-paid", "is-over", "is-soon");
  if (s.paidMonth) { row.classList.add("is-paid"); return; }
  if (!s.date) return;
  const due = new Date(s.date + "T00:00:00");
  if (isNaN(due)) return;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const days = Math.round((due - now) / 86400000);
  if (days < 0) row.classList.add("is-over");
  else if (days <= 14) row.classList.add("is-soon");
}

function makeVehExpRow(v, o) {
  const sym = CURRENCY_META[state.currency].symbol;
  const row = document.createElement("div");
  row.className = "cat-row exp-row";
  row.dataset.vexp = o.id;
  row.innerHTML = `
    <div class="exp-day"><input class="exp-dayfield" inputmode="numeric" data-vx-day value="${o.day || ""}" placeholder="${t("exp_day_ph")}" maxlength="2" /></div>
    <input class="cat-name exp-cat" list="vehCatList" data-vx-cat value="${escapeHtml(o.cat || "")}" placeholder="${escapeHtml(t("exp_cat_ph"))}" />
    <div class="money-input money-input--sm cat-amount"><span class="money-symbol exp-symbol">${sym}</span><input type="text" inputmode="numeric" data-vx-amt value="${o.amount ? formatThousands(o.amount) : ""}" placeholder="0" /></div>
    <button class="cat-remove" type="button" data-vx-del aria-label="remove">×</button>`;

  const day = row.querySelector("[data-vx-day]");
  day.addEventListener("input", () => { o.day = clampDay(parseNumber(day.value)); saveState(); });
  row.querySelector("[data-vx-cat]").addEventListener("input", (e) => { o.cat = e.target.value; saveState(); });
  const amt = row.querySelector("[data-vx-amt]");
  amt.addEventListener("input", () => { o.amount = parseNumber(amt.value); refreshExpenses(); });
  amt.addEventListener("blur", () => { if (o.amount > 0) amt.value = formatThousands(o.amount); });
  row.querySelector("[data-vx-del]").addEventListener("click", () => { v.oneoff = v.oneoff.filter((x) => x.id !== o.id); const card = row.closest(".veh-card"); row.remove(); syncVehicleCardCounts(card, v); refreshExpenses(); });
  return row;
}

function addVehicle() {
  const v = { id: "v" + ++state.vehSeq, plate: "", fuel: "gas", consumption: 0, price: 0, sched: [], oneoff: [], schedSeq: 0, expSeq: 0 };
  state.vehicles.push(v);
  if (!state.vehicleHub.activeVehicle) state.vehicleHub.activeVehicle = v.id;
  buildVehicles(); refreshVehicles(); // rebuild so the active picker appears when >1 car
  const card = el.vehList.querySelector(`[data-veh="${v.id}"]`);
  if (card) card.querySelector("[data-veh-plate]").focus();
  refreshExpenses();
}

// ============================================================
//  Aracım (car hub): route planner, profiles, trips, expenses
// ============================================================
// Route-only assets stay out of the critical startup path and load when the car
// tab is opened for the first time.
const CAR_FUELS = ["gas", "diesel", "lpg", "electric", "hybrid"];
let carAssetsPromise = null;

function carAssetsReady() {
  return Array.isArray(window.TR_PROVINCES) && window.TR_PROVINCES.length === 81 && window.TR_DISTRICTS && !!window.L;
}
function appendDeferredStyle(href) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[data-deferred-style="${href}"]`);
    if (existing) { if (existing.dataset.loaded === "true") resolve(); else { existing.addEventListener("load", resolve, { once: true }); existing.addEventListener("error", reject, { once: true }); } return; }
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = href; link.dataset.deferredStyle = href;
    link.addEventListener("load", () => { link.dataset.loaded = "true"; resolve(); }, { once: true });
    link.addEventListener("error", reject, { once: true });
    document.head.appendChild(link);
  });
}
function appendDeferredScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src; script.async = true;
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.appendChild(script);
  });
}
function ensureCarAssets() {
  if (carAssetsReady()) return Promise.resolve(true);
  if (carAssetsPromise) return carAssetsPromise;
  carAssetsPromise = Promise.all([
    appendDeferredStyle("vendor/leaflet/leaflet.css"),
    appendDeferredScript("turkey-locations.js?v=2"),
    appendDeferredScript("vendor/leaflet/leaflet.js"),
  ]).then(() => {
    if (!carAssetsReady()) throw new Error("car assets unavailable");
    const errors = typeof window.validateTurkeyLocations === "function" ? window.validateTurkeyLocations() : [];
    if (errors.length) console.error("Türkiye location data validation failed", errors);
    return true;
  }).catch((error) => { carAssetsPromise = null; throw error; });
  return carAssetsPromise;
}
function showCarAssetState(message) {
  [el.carFromP, el.carFromD, el.carToP, el.carToD].forEach((select) => {
    if (!select) return;
    select.innerHTML = `<option value="">${escapeHtml(message)}</option>`;
    select.disabled = true;
  });
  if (el.carCalc) el.carCalc.disabled = true;
}

function provByName(name) { return (window.TR_PROVINCES || []).find((p) => p.name === name); }
function districtsFor(pName) { const p = provByName(pName); return (p && window.TR_DISTRICTS && window.TR_DISTRICTS[p.plate]) || []; }
// Resolve a province+district selection to a routing point. District empty = province
// center (Merkez).
function resolveLoc(pName, dName) {
  const prov = provByName(pName);
  if (!prov) return null;
  if (dName) {
    const d = ((window.TR_DISTRICTS && window.TR_DISTRICTS[prov.plate]) || []).find((x) => x[0] === dName);
    if (d) return { label: dName + " / " + pName, lat: d[1], lng: d[2], prov };
  }
  return { label: pName, lat: prov.lat, lng: prov.lng, prov };
}
function haversineKm(a, b) {
  const R = 6371, toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
function fmtDuration(mins) {
  const m = Math.max(0, Math.round(mins));
  const h = Math.floor(m / 60), r = m % 60;
  if (h > 0) return state.lang === "tr" ? `${h} sa ${r} dk` : `${h} h ${r} min`;
  return state.lang === "tr" ? `${r} dk` : `${r} min`;
}
function fmtKm(km) { return locDec(Math.round(km)) + " km"; }
// The active car (used for route fuel cost). One unified "car" now = a vehicle with
// fuel specs + reminders + logged expenses. activeVehicle points at it; falls back to
// the first vehicle that has consumption + price set, else the first vehicle.
function activeVehicle() {
  const h = state.vehicleHub, vs = state.vehicles || [];
  return vs.find((v) => v.id === h.activeVehicle) || vs.find((v) => v.consumption && v.price) || vs[0] || null;
}
function fuelCost(km, veh) {
  if (!veh || !veh.consumption || !veh.price) return null;
  return (km / 100) * (veh.consumption || 0) * (veh.price || 0);
}

// ---- Build the province + district dropdowns + list bodies ----
function fillProvinceSelect(sel, val) {
  sel.innerHTML = `<option value="">${t("car_pick_province")}</option>` +
    (window.TR_PROVINCES || []).map((p) => `<option value="${p.name}">${p.plate < 10 ? "0" + p.plate : p.plate} ${p.name}</option>`).join("");
  sel.value = val || "";
  sel.disabled = false;
}
function fillDistrictSelect(sel, pName, val) {
  const ds = districtsFor(pName);
  sel.innerHTML = `<option value="">${t("car_center")}</option>` +
    ds.map((d) => `<option value="${d[0].replace(/"/g, "&quot;")}">${d[0]}</option>`).join("");
  sel.value = val || "";
  sel.disabled = !provByName(pName);
}
function buildCarHub(loadAssets = false) {
  const h = state.vehicleHub;
  if (!el.carFromP) return;
  // Route planner + trip history are Türkiye-only (TR provinces/districts and OSRM
  // over TR roads); in USD mode the view keeps just the car cards.
  const isTR = state.currency === "TL";
  el.carRouteSec.hidden = !isTR;
  el.carHistSec.hidden = !isTR;
  buildVehicles();
  refreshVehicles();
  if (!isTR) return;
  if (!carAssetsReady()) {
    showCarAssetState(t("car_loading"));
    if (loadAssets) ensureCarAssets().then(() => buildCarHub(false)).catch(() => showCarAssetState(t("car_map_unavailable")));
    return;
  }
  fillProvinceSelect(el.carFromP, h.fromP);
  fillProvinceSelect(el.carToP, h.toP);
  fillDistrictSelect(el.carFromD, h.fromP, h.fromD);
  fillDistrictSelect(el.carToD, h.toP, h.toD);
  syncCarOptions();
  renderCarFavorites();
  renderCarRoute();
  buildCarHistory();
  if (el.carCalc) el.carCalc.disabled = false;
}

function tripFactor() { return state.vehicleHub.tripType === "roundtrip" ? 2 : 1; }
function carExtraTotal(extras = state.vehicleHub.extras) { return (extras.toll || 0) + (extras.parking || 0) + (extras.other || 0); }
function syncCarOptions() {
  const h = state.vehicleHub;
  el.carTripType.classList.toggle("is-roundtrip", h.tripType === "roundtrip");
  el.carOneWay.classList.toggle("is-active", h.tripType !== "roundtrip");
  el.carRoundTrip.classList.toggle("is-active", h.tripType === "roundtrip");
  el.carOneWay.setAttribute("aria-pressed", String(h.tripType !== "roundtrip"));
  el.carRoundTrip.setAttribute("aria-pressed", String(h.tripType === "roundtrip"));
  el.carToll.value = h.extras.toll ? formatThousands(h.extras.toll) : "";
  el.carParking.value = h.extras.parking ? formatThousands(h.extras.parking) : "";
  el.carOther.value = h.extras.other ? formatThousands(h.extras.other) : "";
}
function setCarTripType(type) {
  const next = type === "roundtrip" ? "roundtrip" : "oneway";
  if (state.vehicleHub.tripType === next) return;
  state.vehicleHub.tripType = next;
  syncCarOptions();
  renderCarRoute(false);
  saveState();
}
function mapUrlForRoute(r) {
  if (!r || !Number.isFinite(r.fromLat) || !Number.isFinite(r.fromLng) || !Number.isFinite(r.toLat) || !Number.isFinite(r.toLng)) return "";
  return `https://www.google.com/maps/dir/?api=1&origin=${r.fromLat},${r.fromLng}&destination=${r.toLat},${r.toLng}&travelmode=driving`;
}
function clearCarRoute(clearSelections = false) {
  const h = state.vehicleHub;
  h.lastRoute = null;
  if (clearSelections) {
    h.fromP = h.fromD = h.toP = h.toD = "";
    fillProvinceSelect(el.carFromP, ""); fillProvinceSelect(el.carToP, "");
    fillDistrictSelect(el.carFromD, "", ""); fillDistrictSelect(el.carToD, "", "");
  }
  renderCarRoute(); saveState();
}
function favoriteRouteKey(x) { return [x.fromP, x.fromD, x.toP, x.toD].join("|"); }
function renderCarFavorites() {
  const h = state.vehicleHub, favorites = h.favorites || [];
  el.carFavorites.hidden = favorites.length === 0;
  el.carFavorites.innerHTML = favorites.map((f) => `<button class="car-fav" type="button" data-car-fav="${escapeHtml(f.id)}"><span>★ ${escapeHtml(f.fromLabel)} → ${escapeHtml(f.toLabel)}</span><span class="car-fav-del" data-car-fav-del="${escapeHtml(f.id)}">×</span></button>`).join("");
  el.carFavorites.querySelectorAll("[data-car-fav]").forEach((b) => b.addEventListener("click", (e) => {
    const id = b.dataset.carFav;
    if (e.target.closest("[data-car-fav-del]")) { h.favorites = h.favorites.filter((f) => f.id !== id); renderCarFavorites(); saveState(); return; }
    const f = h.favorites.find((x) => x.id === id); if (!f) return;
    h.fromP = f.fromP; h.fromD = f.fromD; h.toP = f.toP; h.toD = f.toD;
    fillProvinceSelect(el.carFromP, h.fromP); fillDistrictSelect(el.carFromD, h.fromP, h.fromD);
    fillProvinceSelect(el.carToP, h.toP); fillDistrictSelect(el.carToD, h.toP, h.toD);
    clearCarRoute(); calcCarRoute();
  }));
  const currentKey = favoriteRouteKey(h);
  el.carFavorite.classList.toggle("is-active", favorites.some((f) => favoriteRouteKey(f) === currentKey));
}
function toggleFavoriteRoute() {
  const h = state.vehicleHub;
  const a = resolveLoc(h.fromP, h.fromD), b = resolveLoc(h.toP, h.toD);
  if (!a || !b) { toastCar(t("car_need_provinces")); return; }
  const key = favoriteRouteKey(h), existing = h.favorites.find((f) => favoriteRouteKey(f) === key);
  if (existing) h.favorites = h.favorites.filter((f) => f.id !== existing.id);
  else {
    h.favorites.push({ id: "cf" + ++h.favSeq, fromP: h.fromP, fromD: h.fromD, toP: h.toP, toD: h.toD, fromLabel: a.label, toLabel: b.label });
    toastCar(t("car_favorite_saved"));
  }
  renderCarFavorites(); saveState();
}

// ---- Route calculation ----
async function calcCarRoute() {
  const h = state.vehicleHub;
  const a = resolveLoc(h.fromP, h.fromD), b = resolveLoc(h.toP, h.toD);
  if (!a || !b) { h.lastRoute = null; renderCarRoute(); toastCar(t("car_need_provinces")); saveState(); return; }
  if (a.lat === b.lat && a.lng === b.lng) { h.lastRoute = null; renderCarRoute(); toastCar(t("car_same_province")); saveState(); return; }
  el.carCalc.disabled = true; el.carCalc.textContent = t("car_calculating");
  let km, mins, geometry, approx = false;
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`;
    const r = await fetch(url);
    if (!r.ok) throw new Error("route service failed");
    const j = await r.json();
    const route = j && j.routes && j.routes[0];
    if (route) { km = route.distance / 1000; mins = route.duration / 60; geometry = route.geometry && route.geometry.coordinates; }
    else throw new Error("no route");
  } catch (e) {
    approx = true;
    km = haversineKm(a, b) * 1.3;
    mins = (km / 85) * 60;
  }
  el.carCalc.disabled = false; el.carCalc.textContent = t("car_calc");
  h.lastRoute = { from: a.label, to: b.label, fromLat: a.lat, fromLng: a.lng, toLat: b.lat, toLng: b.lng, km, mins, geometry: Array.isArray(geometry) ? geometry : [[a.lng, a.lat], [b.lng, b.lat]], approx };
  renderCarRoute();
  if (approx) toastCar(t("car_route_fail"));
  saveState();
}

function renderCarRoute(refreshMap = true) {
  const h = state.vehicleHub, r = h.lastRoute;
  if (!r) { el.carResults.hidden = true; el.carMapWrap.hidden = true; el.carSaveTrip.hidden = true; el.carRouteMsg.hidden = true; return; }
  el.carResults.hidden = false; el.carSaveTrip.hidden = false;
  const veh = activeVehicle();
  const factor = tripFactor(), shownKm = r.km * factor, shownMins = r.mins * factor;
  const fuel = fuelCost(shownKm, veh), extras = carExtraTotal(), total = (fuel || 0) + extras;
  const mapUrl = mapUrlForRoute(r);
  const stat = (label, val) => `<div class="car-stat"><span class="car-stat-v">${val}</span><span class="car-stat-l">${label}</span></div>`;
  const cost = (label, val) => `<div class="car-cost"><span class="car-cost-l">${label}</span><span class="car-cost-v">${val == null ? "—" : formatMoney(val)}</span></div>`;
  el.carResults.innerHTML = `
    <div class="car-stats">
      ${stat(t("car_distance"), fmtKm(shownKm))}
      ${stat(t("car_duration"), fmtDuration(shownMins))}
    </div>
    <div class="car-costs">
      ${cost(t("car_fuel_cost"), fuel)}
      ${cost(t("car_extra_total"), extras)}
    </div>
    <div class="car-costs car-costs--total"><div class="car-cost car-cost--total"><span class="car-cost-l">${t("car_trip_total")}</span><span class="car-cost-v">${formatMoney(total)}</span></div></div>
    ${mapUrl ? `<div class="car-result-actions"><a class="car-map-link" href="${mapUrl}" target="_blank" rel="noopener noreferrer">${t("car_open_map")}</a></div>` : ""}
    ${fuel == null ? `<p class="car-hint">${t("car_no_profile")}</p>` : ""}`;
  el.carRouteMsg.hidden = true;
  if (refreshMap || el.carMapWrap.hidden) renderEmbeddedRouteMap(r);
}

let embeddedCarMap = null;
let embeddedRouteGroup = null;
function renderEmbeddedRouteMap(r) {
  el.carMapWrap.hidden = false;
  if (!window.L) {
    el.carMap.innerHTML = `<div class="car-map-unavailable">${escapeHtml(t("car_map_unavailable"))}</div>`;
    return;
  }
  if (!embeddedCarMap) {
    embeddedCarMap = L.map(el.carMap, { zoomControl: true, scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" }).addTo(embeddedCarMap);
  }
  if (embeddedRouteGroup) embeddedRouteGroup.remove();
  const coords = (Array.isArray(r.geometry) && r.geometry.length ? r.geometry : [[r.fromLng, r.fromLat], [r.toLng, r.toLat]])
    .filter((p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1])).map((p) => [p[1], p[0]]);
  embeddedRouteGroup = L.featureGroup().addTo(embeddedCarMap);
  if (coords.length) L.polyline(coords, { color: "#675cff", weight: 6, opacity: 0.9, lineCap: "round" }).addTo(embeddedRouteGroup);
  L.circleMarker([r.fromLat, r.fromLng], { radius: 8, color: "#ffffff", weight: 3, fillColor: "#34d8a0", fillOpacity: 1 }).bindTooltip(r.from).addTo(embeddedRouteGroup);
  L.circleMarker([r.toLat, r.toLng], { radius: 8, color: "#ffffff", weight: 3, fillColor: "#ff6b87", fillOpacity: 1 }).bindTooltip(r.to).addTo(embeddedRouteGroup);
  embeddedCarMap.fitBounds(embeddedRouteGroup.getBounds(), { padding: [28, 28], maxZoom: 11 });
  setTimeout(() => embeddedCarMap.invalidateSize(), 0);
}

function saveCarTrip() {
  const h = state.vehicleHub, r = h.lastRoute;
  if (!r) return;
  const veh = activeVehicle();
  const factor = tripFactor(), km = r.km * factor, mins = r.mins * factor;
  const fuel = fuelCost(km, veh), extras = { ...h.extras }, extraTotal = carExtraTotal(extras);
  h.trips.unshift({
    id: "ct" + ++h.seq, date: localDateKey(),
    from: r.from, to: r.to, fromLat: r.fromLat, fromLng: r.fromLng, toLat: r.toLat, toLng: r.toLng,
    km, mins, tripType: h.tripType, fuel, extras, total: fuel == null ? extraTotal : fuel + extraTotal,
    profile: veh ? (veh.plate || "") : "",
  });
  buildCarHistory();
  toastCar(t("car_trip_saved"));
  saveState();
}

// ---- Trip history (list + running fuel total) ----
function buildCarHistory() {
  const h = state.vehicleHub;
  el.carHistList.innerHTML = "";
  if (!h.trips.length) { el.carHistList.innerHTML = `<p class="car-empty">${t("car_history_empty")}</p>`; return; }
  h.trips.forEach((tr) => {
    const row = document.createElement("div");
    row.className = "car-trip";
    const type = tr.tripType || "roundtrip";
    const fuel = Number.isFinite(tr.fuel) ? tr.fuel : (type === "roundtrip" ? tr.fuelRound : tr.fuelOne);
    const extras = tr.extras || { toll: 0, parking: 0, other: 0 };
    const totalValue = Number.isFinite(tr.total) ? tr.total : (fuel || 0) + carExtraTotal(extras);
    const mapUrl = mapUrlForRoute(tr);
    row.innerHTML = `
      <div class="car-trip-main">
        <div class="car-trip-route"><b>${escapeHtml(tr.from)} → ${escapeHtml(tr.to)}</b><span class="car-trip-date">${escapeHtml(tr.date)}</span></div>
        <div class="car-trip-meta">${fmtKm(tr.km)} · ${fmtDuration(tr.mins)} · ${t(type === "roundtrip" ? "car_roundtrip" : "car_oneway")}</div>
        <details class="car-trip-details"><summary>${t("car_details")}</summary><div class="car-trip-detail-grid">
          <span>${t("car_vehicle")}: ${escapeHtml(tr.profile || "—")}</span><span>${t("car_fuel_cost")}: ${fuel == null ? "—" : formatMoney(fuel)}</span>
          <span>${t("car_toll")}: ${formatMoney(extras.toll || 0)}</span><span>${t("car_parking")}: ${formatMoney(extras.parking || 0)}</span>
          <span>${t("car_other_cost")}: ${formatMoney(extras.other || 0)}</span>${mapUrl ? `<a class="car-trip-map" href="${mapUrl}" target="_blank" rel="noopener noreferrer">${t("car_open_map")}</a>` : ""}
        </div></details>
      </div>
      <div class="car-trip-right">
        <span class="car-trip-cost">${formatMoney(totalValue)}</span><small>${t("car_trip_total")}</small>
        <button class="cat-remove" type="button" data-ct-del aria-label="remove">×</button>
      </div>`;
    row.querySelector("[data-ct-del]").addEventListener("click", () => {
      h.trips = h.trips.filter((x) => x.id !== tr.id);
      buildCarHistory(); saveState();
    });
    el.carHistList.appendChild(row);
  });
  const total = h.trips.reduce((a, tr) => a + (Number.isFinite(tr.total) ? tr.total : (tr.fuelRound || tr.fuelOne || 0) + carExtraTotal(tr.extras || {})), 0);
  if (total > 0) {
    const foot = document.createElement("div");
    foot.className = "car-hist-total";
    foot.innerHTML = `<span>${t("car_report_total")}</span><span>${formatMoney(total)}</span>`;
    el.carHistList.appendChild(foot);
  }
}

function toastCar(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg; toast.classList.add("show");
  clearTimeout(toastCar._t); toastCar._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ============================================================
//  Portfolio
// ============================================================
function buildPortfolio() {
  el.portList.innerHTML = "";
  state.portfolio.holdings.forEach((h) => el.portList.appendChild(makeHoldingRow(h.id)));
  updatePortfolioHoldingCount();
}

function updatePortfolioHoldingCount() {
  if (el.portHoldingCount) el.portHoldingCount.textContent = t("portfolio_count", { count: meaningfulHoldingCount() });
}

function holdById(id) { return state.portfolio.holdings.find((y) => y.id === id); }
function rebuildHoldingRow(id) {
  const old = el.portList.querySelector(`[data-hold="${id}"]`);
  if (old) old.replaceWith(makeHoldingRow(id));
}
function wireTypeSelect(row, id) {
  row.querySelector("[data-hold-type]").addEventListener("change", (e) => {
    const x = holdById(id);
    if (x) x.assetType = e.target.value;
    rebuildHoldingRow(id); // switch input mode (crypto search / net toggle)
    refreshPortfolio();
    refreshIncome();
  });
}
function wireRemove(row, id) {
  row.querySelector("[data-hold-del]").addEventListener("click", () => {
    state.portfolio.holdings = state.portfolio.holdings.filter((y) => y.id !== id);
    row.remove();
    refreshPortfolio();
    refreshIncome();
  });
}
function fmtPrice(n) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 }); }
function updateStockValue(row, id, loading) {
  const x = holdById(id);
  const node = row.querySelector("[data-stock-value]");
  if (!node || !x) return;
  if (loading) { node.innerHTML = `<small>${t("coin_loading")}</small>`; return; }
  if (x.nativePrice && x.shares) node.textContent = formatMoney(stockValue(x));
  else node.textContent = "";
}
function wireStockRow(row, id, type) {
  wireTypeSelect(row, id);
  wireRemove(row, id);
  const list = type === "bist" ? BIST_STOCKS : US_STOCKS;
  const search = row.querySelector("[data-stock-search]");
  const dd = row.querySelector("[data-stock-dd]");
  const sh = row.querySelector("[data-stock-shares]");
  function renderDropdown(q) {
    const ql = (q || "").trim().toLowerCase();
    const matches = (ql ? list.filter((s) => s.n.toLowerCase().includes(ql) || s.s.toLowerCase().includes(ql)) : list).slice(0, 8);
    if (!matches.length) { dd.hidden = true; return; }
    dd.innerHTML = matches.map((s) => `<button type="button" class="coin-opt" data-stk="${s.s}">${escapeHtml(s.n)} <span>${s.s}</span></button>`).join("");
    dd.hidden = false;
    dd.querySelectorAll("[data-stk]").forEach((b) =>
      b.addEventListener("mousedown", (e) => {
        e.preventDefault();
        const item = list.find((s) => s.s === b.dataset.stk);
        const x = holdById(id);
        x.symbol = item.s; x.stockName = item.n; x.label = item.n; x.nativePrice = 0;
        search.value = item.n; dd.hidden = true;
        updateStockValue(row, id, true); // show loading
        const ys = type === "bist" ? item.s + ".IS" : item.s;
        getStockPrice(ys).then((q) => {
          const y = holdById(id);
          if (!y || y.symbol !== item.s) return;
          if (q && q.price != null) { y.nativePrice = q.price; y.chg24 = q.chg24; }
          y.value = stockValue(y);
          updateStockValue(row, id);
          refreshPortfolio(); refreshIncome();
        });
        x.value = stockValue(x);
        refreshPortfolio(); refreshIncome();
      })
    );
  }
  search.addEventListener("input", () => renderDropdown(search.value));
  search.addEventListener("focus", () => renderDropdown(search.value));
  search.addEventListener("blur", () => setTimeout(() => { dd.hidden = true; }, 150));
  sh.addEventListener("input", () => {
    const x = holdById(id);
    x.shares = parseDecimal(sh.value);
    x.value = stockValue(x);
    updateStockValue(row, id);
    refreshPortfolio(); refreshIncome();
  });
  updateStockValue(row, id);
}
// Gold unit: ounces in USD, grams in TL.
function goldOz() { return state.currency !== "TL"; }
function goldFactor() { return goldOz() ? GRAMS_PER_OZ : 1; } // grams per display unit
function goldUnit() { return goldOz() ? "oz" : "g"; }
function fmtQty(n) { return locDec(Math.round(n * 10000) / 10000); }
function updateGoldValue(row, id) {
  const x = holdById(id);
  const node = row.querySelector("[data-gold-value]");
  if (!node || !x) return;
  const perGram = goldPriceGram || x.price || 0; // app-currency price per gram (fallback to last saved)
  const qty = x.grams ? x.grams / goldFactor() : 0;
  if (perGram && qty) node.textContent = formatMoney(x.grams * perGram);
  else if (x.grams && x.value) node.textContent = formatMoney(x.value);
  else node.textContent = "";
}
// USD held as an investment: the dollar amount is canonical; its app-currency
// value is the live TL conversion (or 1:1 if the app is in USD).
function usdHoldingValue(usd) { return state.currency === "TL" ? (usd || 0) * (usdTry || 0) : (usd || 0); }
function updateUsdValue(row, id) {
  const x = holdById(id);
  const node = row.querySelector("[data-usd-value]");
  if (!node || !x) return;
  const usd = x.usd || 0;
  if (usd && state.currency === "TL" && usdTry) {
    node.textContent = formatMoney(usd * usdTry);
  } else if (usd) {
    node.textContent = formatMoney(x.value || usd);
  } else {
    node.textContent = "";
  }
}
function updateCryptoValue(row, id) {
  const x = holdById(id);
  const node = row.querySelector("[data-coin-value]");
  if (!node || !x) return;
  if (x.price && x.qty) node.textContent = formatMoney(x.value);
  else node.textContent = "";
}
function wireCryptoRow(row, id) {
  const search = row.querySelector("[data-coin-search]");
  const dd = row.querySelector("[data-coin-dd]");
  const qty = row.querySelector("[data-coin-qty]");
  function renderDropdown(q) {
    if (!cryptoMarkets.length) { dd.innerHTML = `<div class="coin-opt coin-opt--msg">${t("coin_loading")}</div>`; dd.hidden = false; return; }
    const ql = (q || "").trim().toLowerCase();
    const list = ql ? cryptoMarkets.filter((c) => c.name.toLowerCase().includes(ql) || c.symbol.toLowerCase().includes(ql)) : cryptoMarkets;
    const matches = list.slice(0, 8);
    if (!matches.length) { dd.hidden = true; return; }
    dd.innerHTML = matches.map((c) => `<button type="button" class="coin-opt" data-coin-id="${c.id}">${escapeHtml(c.name)} <span>${c.symbol}</span></button>`).join("");
    dd.hidden = false;
    dd.querySelectorAll("[data-coin-id]").forEach((b) =>
      b.addEventListener("mousedown", (e) => {
        e.preventDefault();
        const c = cryptoMarkets.find((x) => x.id === b.dataset.coinId);
        const x = holdById(id);
        x.coinId = c.id; x.coinName = c.name; x.coinSymbol = c.symbol; x.price = c.price; x.label = c.name; x.chg24 = c.chg24;
        x.value = (x.qty || 0) * c.price;
        search.value = c.name; dd.hidden = true;
        updateCryptoValue(row, id);
        refreshPortfolio(); refreshIncome();
      })
    );
  }
  search.addEventListener("input", () => renderDropdown(search.value));
  search.addEventListener("focus", () => renderDropdown(search.value));
  search.addEventListener("blur", () => setTimeout(() => { dd.hidden = true; }, 150));
  qty.addEventListener("input", () => {
    const x = holdById(id);
    x.qty = parseDecimal(qty.value);
    x.value = (x.qty || 0) * (x.price || 0);
    updateCryptoValue(row, id);
    refreshPortfolio(); refreshIncome();
  });
  updateCryptoValue(row, id);
}

function makeHoldingRow(id) {
  const meta = CURRENCY_META[state.currency];
  const h = holdById(id) || {};
  const at = h.assetType || "stocks";
  const row = document.createElement("div");
  row.className = "cat-row port-row";
  row.dataset.hold = id;
  row.dataset.assetType = at;
  // "usd" (holding dollars as an investment) is only offered while the app is in
  // TL; in USD mode it would just be cash. Keep it visible if already selected.
  const options = ASSET_TYPES
    .filter((tp) => tp !== "usd" || state.currency === "TL" || tp === at)
    .map((tp) => `<option value="${tp}" ${tp === at ? "selected" : ""}>${t("asset_" + tp)}</option>`).join("");
  const typeSelect = `<select class="hold-type" data-hold-type="${id}" aria-label="asset type">${options}</select>`;
  const removeButton = `<button class="cat-remove" type="button" data-hold-del="${id}" aria-label="${escapeHtml(t("portfolio_remove"))}">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5"></path></svg>
  </button>`;

  if (at === "usstock" || at === "bist") {
    const stockName = escapeHtml(h.stockName || "");
    row.innerHTML = `
      <div class="port-namecell">
        <div class="coin-search">
          <input class="cat-name" type="text" autocomplete="off" data-stock-search="${id}" value="${stockName}" placeholder="${t("stock_search_ph")}" />
          <div class="coin-dropdown" data-stock-dd="${id}" hidden></div>
        </div>
        ${typeSelect}
      </div>
      <div class="crypto-cell">
        <span class="port-field-label">${t("shares_ph")}</span>
        <input class="qty-field" type="text" inputmode="decimal" data-stock-shares="${id}" value="${h.shares ? fmtQty(h.shares) : ""}" placeholder="${t("shares_ph")}" />
        <div class="crypto-value" data-label="${escapeHtml(t("portfolio_current_value"))}" data-stock-value="${id}"></div>
      </div>
      ${removeButton}`;
    wireStockRow(row, id, at);
  } else if (at === "crypto") {
    const coinName = escapeHtml(h.coinName || "");
    row.innerHTML = `
      <div class="port-namecell">
        <div class="coin-search">
          <input class="cat-name" type="text" autocomplete="off" data-coin-search="${id}" value="${coinName}" placeholder="${t("coin_search_ph")}" />
          <div class="coin-dropdown" data-coin-dd="${id}" hidden></div>
        </div>
        ${typeSelect}
      </div>
      <div class="crypto-cell">
        <span class="port-field-label">${t("qty_ph")}</span>
        <input class="qty-field" type="text" inputmode="decimal" data-coin-qty="${id}" value="${h.qty ? fmtQty(h.qty) : ""}" placeholder="${t("qty_ph")}" />
        <div class="crypto-value" data-label="${escapeHtml(t("portfolio_current_value"))}" data-coin-value="${id}"></div>
      </div>
      ${removeButton}`;
    wireTypeSelect(row, id);
    wireRemove(row, id);
    wireCryptoRow(row, id);
  } else if (at === "gold") {
    const safeLabel = escapeHtml(h.label || "");
    row.innerHTML = `
      <div class="port-namecell">
        <input class="cat-name port-name" data-hold-name="${id}" value="${safeLabel}" placeholder="${t("asset_gold")}" />
        ${typeSelect}
      </div>
      <div class="crypto-cell">
        <span class="port-field-label">${goldOz() ? t("oz_ph") : t("grams_ph")}</span>
        <input class="qty-field" type="text" inputmode="decimal" data-gold-grams="${id}" value="${h.grams ? fmtQty(h.grams / goldFactor()) : ""}" placeholder="${goldOz() ? t("oz_ph") : t("grams_ph")}" />
        <div class="crypto-value" data-label="${escapeHtml(t("portfolio_current_value"))}" data-gold-value="${id}"></div>
      </div>
      ${removeButton}`;
    wireTypeSelect(row, id);
    wireRemove(row, id);
    row.querySelector("[data-hold-name]").addEventListener("input", (e) => { const x = holdById(id); if (x) x.label = e.target.value; saveState(); });
    const g = row.querySelector("[data-gold-grams]");
    g.addEventListener("input", () => {
      const x = holdById(id);
      x.grams = parseDecimal(g.value) * goldFactor(); // store canonical grams
      const p = goldPriceGram || x.price || 0;
      x.price = p;
      x.value = (x.grams || 0) * p;
      updateGoldValue(row, id);
      refreshPortfolio();
      refreshIncome();
    });
    updateGoldValue(row, id);
  } else if (at === "usd") {
    const safeLabel = escapeHtml(h.label || "");
    row.innerHTML = `
      <div class="port-namecell">
        <input class="cat-name port-name" data-hold-name="${id}" value="${safeLabel}" placeholder="${t("asset_usd")}" />
        ${typeSelect}
      </div>
      <div class="crypto-cell">
        <span class="port-field-label">USD</span>
        <div class="money-input money-input--sm usd-input"><span class="money-symbol">$</span><input type="text" inputmode="numeric" data-usd-amt="${id}" value="${h.usd ? formatThousands(h.usd) : ""}" placeholder="0" /></div>
        <div class="crypto-value" data-label="${escapeHtml(t("portfolio_current_value"))}" data-usd-value="${id}"></div>
      </div>
      ${removeButton}`;
    wireTypeSelect(row, id);
    wireRemove(row, id);
    row.querySelector("[data-hold-name]").addEventListener("input", (e) => { const x = holdById(id); if (x) x.label = e.target.value; saveState(); });
    const u = row.querySelector("[data-usd-amt]");
    u.addEventListener("input", () => {
      const x = holdById(id);
      x.usd = parseNumber(u.value);
      x.value = usdHoldingValue(x.usd);
      updateUsdValue(row, id);
      refreshPortfolio();
      refreshIncome();
    });
    u.addEventListener("blur", () => { const x = holdById(id); if (x && x.usd > 0) u.value = formatThousands(x.usd); });
    updateUsdValue(row, id);
  } else {
    const safeLabel = escapeHtml(h.label || "");
    const isInterest = at === "deposit" || at === "bonds";
    const netBtn = isInterest
      ? `<button type="button" class="net-tax-btn ${h.netTax ? "is-on" : ""}" data-hold-net="${id}">${t("net_tax")}</button>`
      : "";
    row.innerHTML = `
      <div class="port-namecell">
        <input class="cat-name port-name" data-hold-name="${id}" value="${safeLabel}" placeholder="${t("holding_ph")}" />
        <div class="port-tags">${typeSelect}${netBtn}</div>
      </div>
      <div class="port-amount-cell">
        <span class="port-field-label">${t("portfolio_amount")}</span>
        <div class="money-input money-input--sm cat-amount">
          <span class="money-symbol savings-symbol">${meta.symbol}</span>
          <input type="text" inputmode="numeric" data-hold-val="${id}" value="${h.value ? formatThousands(h.value) : ""}" placeholder="0" />
        </div>
      </div>
      ${removeButton}`;
    wireTypeSelect(row, id);
    wireRemove(row, id);
    row.querySelector("[data-hold-name]").addEventListener("input", (e) => { const x = holdById(id); if (x) x.label = e.target.value; saveState(); });
    const v = row.querySelector("[data-hold-val]");
    v.addEventListener("input", () => { const x = holdById(id); if (x) x.value = parseNumber(v.value); refreshPortfolio(); refreshIncome(); });
    v.addEventListener("blur", () => { const x = holdById(id); if (x && x.value > 0) v.value = formatThousands(x.value); });
    const netBtnEl = row.querySelector("[data-hold-net]");
    if (netBtnEl) netBtnEl.addEventListener("click", () => { const x = holdById(id); x.netTax = !x.netTax; netBtnEl.classList.toggle("is-on", x.netTax); refreshPortfolio(); refreshIncome(); });
  }
  const assetIcons = { usstock: "chart-line", bist: "chart-line", crypto: "coins", gold: "coins", usd: "cash-banknote", deposit: "building-bank", bonds: "building-bank", cash: "cash-banknote" };
  row.insertAdjacentHTML("afterbegin", `<span class="port-asset-icon" aria-hidden="true">${uiIconSvg(assetIcons[at] || "briefcase-2")}</span>`);
  return row;
}

// ---- Live crypto prices (CoinGecko, client-side; works on the deployed site) ----
const PRICE_CACHE_FRESH_MS = 24 * 3600 * 1000;
const PRICE_CACHE_STALE_MS = 72 * 3600 * 1000;
const FX_CACHE_FRESH_MS = 15 * 60 * 1000;

async function fetchWithTimeout(url, options = {}, timeoutMs = 6000) {
  if (typeof AbortController !== "function") return fetch(url, options);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try { return await fetch(url, { ...options, signal: controller.signal }); }
  finally { clearTimeout(timer); }
}

function hydrateHomeMarketCache() {
  const now = Date.now(), vs = state.currency === "TL" ? "try" : "usd";
  let usdCached = null, eurCached = null;
  try {
    const gold = JSON.parse(localStorage.getItem("numbr_gold2_" + vs) || "null");
    if (gold && now - gold.t < PRICE_CACHE_STALE_MS && Number.isFinite(gold.v)) { goldPriceGram = gold.v; goldChg24 = gold.chg; }
    const usdFx = JSON.parse(localStorage.getItem("numbr_fx_TRY=X") || "null");
    const usdLegacy = JSON.parse(localStorage.getItem("numbr_usdtry2") || "null");
    if (usdFx && now - usdFx.t < PRICE_CACHE_STALE_MS && usdFx.d && Number.isFinite(usdFx.d.price)) usdCached = { data: usdFx.d, time: usdFx.t };
    else if (usdLegacy && now - usdLegacy.t < PRICE_CACHE_STALE_MS && Number.isFinite(usdLegacy.v)) usdCached = { data: { price: usdLegacy.v, chg24: usdLegacy.chg }, time: usdLegacy.t };
    const eurFx = JSON.parse(localStorage.getItem("numbr_fx_EURTRY=X") || "null");
    if (eurFx && now - eurFx.t < PRICE_CACHE_STALE_MS && eurFx.d && Number.isFinite(eurFx.d.price)) eurCached = { data: eurFx.d, time: eurFx.t };
  } catch (e) {}
  if (usdCached) { homeMarketData.usd = usdCached.data; usdTry = usdCached.data.price; usdTryChg24 = usdCached.data.chg24; }
  if (eurCached) homeMarketData.eur = eurCached.data;
  homeMarketData.loadedAt = usdCached && eurCached ? Math.min(usdCached.time, eurCached.time) : 0;
}

async function loadCryptoMarkets() {
  const vs = state.currency === "TL" ? "try" : "usd";
  const key = "numbr_crypto3_" + vs;
  try {
    const c = JSON.parse(localStorage.getItem(key) || "null");
    if (c && Date.now() - c.t < PRICE_CACHE_STALE_MS && Array.isArray(c.data)) {
      cryptoMarkets = c.data;
      if (Date.now() - c.t < PRICE_CACHE_FRESH_MS) return;
    }
  } catch (e) {}
  try {
    const res = await fetchWithTimeout(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs}&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`);
    if (!res.ok) return;
    const json = await res.json();
    cryptoMarkets = json.map((c) => ({ id: c.id, symbol: (c.symbol || "").toUpperCase(), name: c.name, price: c.current_price, chg24: c.price_change_percentage_24h_in_currency }));
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), data: cryptoMarkets })); } catch (e) {}
  } catch (e) { /* offline / local file:// — silently ignore, works once deployed */ }
}
// Live gold price (per gram) via PAX Gold (1 PAXG ≈ 1 troy oz), client-side, daily-cached.
async function loadGoldPrice() {
  const vs = state.currency === "TL" ? "try" : "usd";
  const key = "numbr_gold2_" + vs;
  try {
    const c = JSON.parse(localStorage.getItem(key) || "null");
    if (c && Date.now() - c.t < PRICE_CACHE_STALE_MS && Number.isFinite(c.v)) {
      goldPriceGram = c.v; goldChg24 = c.chg;
      if (Date.now() - c.t < PRICE_CACHE_FRESH_MS) return;
    }
  } catch (e) {}
  try {
    const res = await fetchWithTimeout(`https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=${vs}&include_24hr_change=true`);
    if (!res.ok) return;
    const j = await res.json();
    const g = j["pax-gold"];
    const oz = g && g[vs];
    if (oz) {
      goldPriceGram = oz / GRAMS_PER_OZ;
      goldChg24 = (g && typeof g[vs + "_24h_change"] === "number") ? g[vs + "_24h_change"] : null;
      try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: goldPriceGram, chg: goldChg24 })); } catch (e) {}
    }
  } catch (e) { /* offline / local — works once deployed */ }
}
// Live stock price via Yahoo Finance (through a CORS proxy; works on the deployed site).
// Returns { price, chg24 } (chg24 may be null) or null on failure.
async function fetchYahoo(symbol) {
  // 1) Same-origin serverless function — reliable on the deployed (Vercel) site.
  try {
    const r = await fetchWithTimeout(`/api/quote?symbol=${encodeURIComponent(symbol)}`, {}, 4500);
    if (r.ok) { const j = await r.json(); if (typeof j.price === "number") return { price: j.price, chg24: typeof j.chg24 === "number" ? j.chg24 : null }; }
  } catch (e) { /* not deployed / local — fall back to public proxies */ }
  // 2) Public CORS proxies (fallback, mainly for local preview).
  const y = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  const proxies = [`https://api.allorigins.win/raw?url=${encodeURIComponent(y)}`, `https://corsproxy.io/?url=${encodeURIComponent(y)}`];
  for (const url of proxies) {
    try {
      const res = await fetchWithTimeout(url, {}, 4500);
      if (!res.ok) continue;
      const j = await res.json();
      const parsed = parseYahooChart(j);
      if (parsed && parsed.price != null) return { price: parsed.price, chg24: typeof parsed.chg24 === "number" ? parsed.chg24 : null };
    } catch (e) { /* try next proxy */ }
  }
  return null;
}
function parseYahooChart(j) {
  const r0 = j && j.chart && j.chart.result && j.chart.result[0];
  if (!r0) return null;
  const meta = r0.meta;
  const closes = (r0.indicators && r0.indicators.quote && r0.indicators.quote[0] && r0.indicators.quote[0].close) || [];
  const valid = closes.filter((c) => typeof c === "number");
  const price = meta && typeof meta.regularMarketPrice === "number" ? meta.regularMarketPrice : (valid.length ? valid[valid.length - 1] : null);
  if (price == null) return null;
  // previous *daily* close (yesterday) for the 24h move — chartPreviousClose is ~1y ago on a 1y range
  const prev = valid.length >= 2 ? valid[valid.length - 2] : (meta && (meta.chartPreviousClose || meta.previousClose));
  const pct = (a, b) => (a != null && b ? (a / b - 1) * 100 : null);
  return { price, ccy: meta ? meta.currency : null, chg24: pct(price, prev), chg1mo: valid.length > 22 ? pct(price, valid[valid.length - 22]) : null, chg1y: valid.length ? pct(price, valid[0]) : null, spark: valid.slice(-8) };
}
// Full quote (price + 24h/1mo/1yr %) — serverless first, public proxy fallback.
async function fetchStockData(symbol) {
  try {
    const r = await fetchWithTimeout(`/api/quote?symbol=${encodeURIComponent(symbol)}&range=1y`, {}, 5500);
    if (r.ok) { const j = await r.json(); if (typeof j.price === "number") return { price: j.price, ccy: j.currency, chg24: j.chg24, chg1mo: j.chg1mo, chg1y: j.chg1y, spark: j.spark || null }; }
  } catch (e) {}
  const y = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1y`;
  for (const url of [`https://api.allorigins.win/raw?url=${encodeURIComponent(y)}`, `https://corsproxy.io/?url=${encodeURIComponent(y)}`]) {
    try { const res = await fetchWithTimeout(url, {}, 5500); if (!res.ok) continue; const d = parseYahooChart(await res.json()); if (d) return d; } catch (e) {}
  }
  return null;
}
// Returns { price, chg24 } (chg24 may be null) or null.
async function getStockPrice(yahooSymbol) {
  const key = "numbr_stk2_" + yahooSymbol;
  try { const c = JSON.parse(localStorage.getItem(key) || "null"); if (c && Date.now() - c.t < 24 * 3600 * 1000) return { price: c.price, chg24: c.chg24 }; } catch (e) {}
  const v = await fetchYahoo(yahooSymbol);
  if (v && v.price != null) { try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), price: v.price, chg24: v.chg24 })); } catch (e) {} return v; }
  return null;
}
async function loadUsdTry() {
  const key = "numbr_usdtry2";
  try {
    const c = JSON.parse(localStorage.getItem(key) || "null");
    if (c && Date.now() - c.t < PRICE_CACHE_STALE_MS && Number.isFinite(c.v)) {
      usdTry = c.v; usdTryChg24 = c.chg;
      if (Date.now() - c.t < FX_CACHE_FRESH_MS) return;
    }
  } catch (e) {}
  const v = await fetchYahoo("TRY=X");
  if (v && v.price) { usdTry = v.price; usdTryChg24 = v.chg24; try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: usdTry, chg: usdTryChg24 })); } catch (e) {} }
}
// Convert a stock's native-currency value into the app's active currency.
function stockValue(h) {
  const native = h.nativePrice || 0;
  const shares = h.shares || 0;
  const nativeCcy = h.assetType === "bist" ? "TRY" : "USD";
  const appCcy = state.currency === "TL" ? "TRY" : "USD";
  let fx = 1;
  if (nativeCcy !== appCcy) fx = appCcy === "TRY" ? usdTry : (usdTry ? 1 / usdTry : 0);
  return shares * native * fx;
}

async function forEachLimited(items, limit, worker) {
  let cursor = 0;
  const count = Math.min(Math.max(1, limit), items.length);
  await Promise.all(Array.from({ length: count }, async () => {
    while (cursor < items.length) {
      const item = items[cursor++];
      await worker(item);
    }
  }));
}

async function refreshCryptoPrices() {
  await Promise.allSettled([loadCryptoMarkets(), loadGoldPrice(), loadUsdTry()]);
  const stockHoldings = [];
  for (const h of state.portfolio.holdings) {
    if (h.assetType === "crypto" && h.coinId) {
      const m = cryptoMarkets.find((x) => x.id === h.coinId);
      if (m) { h.price = m.price; h.value = (h.qty || 0) * m.price; h.chg24 = m.chg24; }
    } else if (h.assetType === "gold" && goldPriceGram > 0) {
      h.price = goldPriceGram;
      h.value = (h.grams || 0) * goldPriceGram;
      h.chg24 = goldChg24;
    } else if (h.assetType === "usd") {
      h.value = usdHoldingValue(h.usd || 0);
      // In TL the $ holding moves with USD/TRY; in USD mode it's just cash (flat).
      h.chg24 = state.currency === "TL" ? usdTryChg24 : 0;
    } else if ((h.assetType === "usstock" || h.assetType === "bist") && h.symbol) {
      stockHoldings.push(h);
    }
  }
  await forEachLimited(stockHoldings, 3, async (h) => {
    const ys = h.assetType === "bist" ? h.symbol + ".IS" : h.symbol;
    const q = await getStockPrice(ys);
    if (q && q.price != null) { h.nativePrice = q.price; h.chg24 = q.chg24; }
    h.value = stockValue(h);
  });
  buildPortfolio();
  refreshPortfolio();
  refreshIncome();
  renderHomeSummaries();
  renderHomeMarketSummary();
}

function addHolding() {
  const id = "h" + ++state.portfolio.seq;
  state.portfolio.holdings.push({ id, label: "", value: 0, assetType: "usstock" });
  const row = makeHoldingRow(id);
  el.portList.appendChild(row);
  const nameInput = row.querySelector("[data-hold-name]");
  if (nameInput) nameInput.focus();
  refreshPortfolio();
}

const PIE_COLORS = ["#7c5cff", "#21d4fd", "#2ee6a6", "#ffb454", "#ff7eb6", "#ffd54a", "#4f8cff", "#ff5ca8"];
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Annual return rate (%) for a holding's asset type, currency-aware.
function assetRate(type, cur) {
  const r = state.rates[cur];
  switch (type) {
    case "stocks": return cur === "TL" ? r.bist : r.sp500;
    case "crypto": return r.btc;
    case "deposit": return cur === "TL" ? r.deposit : r.savings;
    case "bonds": return cur === "TL" ? r.eurobond : r.treasury;
    case "realestate": return r.realestate;
    case "gold": return cur === "TL" ? r.gold : 0;
    default: return 0; // cash
  }
}
// Monthly income generated by holdings: interest (deposit/bonds), rent (real estate).
function portfolioYield() {
  const cur = state.currency;
  let interest = 0, rental = 0;
  state.portfolio.holdings.forEach((h) => {
    if (!h.value) return;
    let monthly = (h.value * (assetRate(h.assetType, cur) / 100)) / 12;
    if (h.assetType === "deposit" || h.assetType === "bonds") {
      if (h.netTax) monthly *= 1 - WITHHOLD_PCT / 100; // deduct withholding tax (stopaj)
      interest += monthly;
    } else if (h.assetType === "realestate") {
      rental += monthly;
    }
  });
  return { interest, rental };
}
function incomeManualTotal() {
  let t = 0;
  INCOME_CATEGORIES.forEach((c) => (t += state.income.amounts[c.id] || 0));
  state.income.custom.forEach((c) => (t += state.income.amounts[c.id] || 0));
  return t;
}

// Render the total portfolio value. For Turkey (TL) a small toggle lets the user
// view the total in USD (converted via the live USD/TRY rate); USA always shows USD.
function renderPortTotal(totalNative) {
  const isTL = state.currency === "TL";
  el.portCcyToggle.hidden = !isTL;
  if (!isTL) { state.portTotalUSD = false; }

  const showUSD = isTL && state.portTotalUSD && usdTry > 0;
  if (showUSD) {
    el.portTotal.textContent = formatMoneyCcy(totalNative / usdTry, "USD");
  } else {
    el.portTotal.textContent = formatMoney(totalNative);
  }
  // Button shows the currency you'd switch TO.
  if (isTL) el.portCcyToggle.textContent = state.portTotalUSD ? "₺ TL" : "$ USD";
}

// 24h portfolio move: sum the last-24h delta of holdings that have a known % move
// (crypto/gold/stocks/USD). Cash, deposits and bonds are flat, so they add 0.
// Shown small next to the total. Hidden when no priced asset has 24h data.
function renderPort24h(totalNative) {
  if (!el.port24h) return;
  let abs = 0; // 24h change in the app's native currency
  let hasData = false;
  for (const h of state.portfolio.holdings) {
    const c = h.chg24;
    if (typeof c === "number" && isFinite(c) && c > -100 && h.value) {
      abs += h.value - h.value / (1 + c / 100);
      hasData = true;
    }
  }
  if (!hasData || totalNative <= 0) { el.port24h.hidden = true; el.port24h.textContent = ""; return; }
  const prev = totalNative - abs;
  const pct = prev > 0 ? (abs / prev) * 100 : 0;
  const up = abs >= 0;
  const showUSD = state.currency === "TL" && state.portTotalUSD && usdTry > 0;
  const money = Math.abs(showUSD ? abs / usdTry : abs);
  const sign = up ? "+" : "−";
  const moneyTxt = showUSD ? formatMoneyCcy(money, "USD") : formatMoney(money);
  el.port24h.hidden = false;
  el.port24h.className = "port-24h " + (up ? "is-pos" : "is-neg");
  el.port24h.innerHTML = `${sign}${Math.abs(pct).toFixed(1)}% <span class="port-24h-amt">${sign}${moneyTxt}</span> <span class="port-24h-lbl">${t("lbl_24h")}</span>`;
}

function currentNetWorthHistory() {
  return state.netWorth.history[state.currency];
}
function netWorthLiability() {
  return Math.max(0, state.netWorth.liabilities[state.currency] || 0);
}
function recordNetWorthSnapshot(assets) {
  const history = currentNetWorthHistory();
  const debt = netWorthLiability();
  const month = currentYM();
  const existing = history.find((item) => item.month === month);
  if (!(assets > 0) && !(debt > 0) && !existing) return;
  const snapshot = { month, assets: Math.max(0, assets || 0), liabilities: debt, net: Math.max(0, assets || 0) - debt };
  if (existing) Object.assign(existing, snapshot);
  else history.push(snapshot);
  history.sort((a, b) => a.month.localeCompare(b.month));
  if (history.length > 60) history.splice(0, history.length - 60);
}
function shortMonthLabel(ym) {
  const [year, month] = ym.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(state.lang === "tr" ? "tr-TR" : "en-US", { month: "short", year: "2-digit" });
}
function renderNetWorth(totalAssets) {
  if (!el.netWorthChart) return;
  const debt = netWorthLiability();
  const net = totalAssets - debt;
  el.netWorthAssets.textContent = formatMoney(totalAssets);
  el.netWorthDebt.textContent = debt > 0 ? "−" + formatMoney(debt) : formatMoney(0);
  el.netWorthValue.textContent = formatMoney(net);
  el.netWorthValue.classList.toggle("is-negative", net < 0);
  if (document.activeElement !== el.netWorthDebtInput) el.netWorthDebtInput.value = debt > 0 ? formatThousands(debt) : "";

  const points = currentNetWorthHistory().slice(-12);
  el.netWorthEmpty.hidden = points.length > 0;
  el.netWorthChart.hidden = points.length === 0;
  if (!points.length) {
    el.netWorthChart.innerHTML = `<title id="netWorthChartTitle">${escapeHtml(t("net_worth_history"))}</title><desc id="netWorthChartDesc">${escapeHtml(t("net_worth_chart_empty"))}</desc>`;
    return;
  }

  const width = 640, height = 250;
  const margin = { top: 28, right: 30, bottom: 42, left: 78 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const values = points.map((point) => point.net);
  let minValue = Math.min(0, ...values);
  let maxValue = Math.max(0, ...values);
  if (maxValue === minValue) { maxValue += 1; minValue -= 1; }
  const padding = (maxValue - minValue) * 0.12;
  maxValue += padding; minValue -= padding;
  const xAt = (index) => points.length === 1 ? margin.left + plotW / 2 : margin.left + (index / (points.length - 1)) * plotW;
  const yAt = (value) => margin.top + ((maxValue - value) / (maxValue - minValue)) * plotH;
  const linePath = points.map((point, index) => `${index ? "L" : "M"}${xAt(index).toFixed(1)} ${yAt(point.net).toFixed(1)}`).join(" ");
  const zeroY = yAt(0);
  const areaPath = `${linePath} L${xAt(points.length - 1).toFixed(1)} ${zeroY.toFixed(1)} L${xAt(0).toFixed(1)} ${zeroY.toFixed(1)} Z`;
  const ticks = Array.from({ length: 4 }, (_, index) => minValue + ((maxValue - minValue) * index) / 3).reverse();
  const grid = ticks.map((value) => {
    const y = yAt(value);
    return `<line class="net-worth-grid" x1="${margin.left}" y1="${y.toFixed(1)}" x2="${width - margin.right}" y2="${y.toFixed(1)}"></line><text class="net-worth-axis" x="${margin.left - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end">${escapeHtml(formatMoney(value, { compact: true }))}</text>`;
  }).join("");
  const labelStep = points.length > 6 ? 2 : 1;
  const monthLabels = points.map((point, index) => (index % labelStep === 0 || index === points.length - 1)
    ? `<text class="net-worth-month" x="${xAt(index).toFixed(1)}" y="${height - 15}" text-anchor="middle">${escapeHtml(shortMonthLabel(point.month))}</text>` : "").join("");
  const dots = points.map((point, index) => `<circle class="net-worth-dot" cx="${xAt(index).toFixed(1)}" cy="${yAt(point.net).toFixed(1)}" r="4"><title>${escapeHtml(shortMonthLabel(point.month) + ": " + formatMoney(point.net))}</title></circle>`).join("");
  const last = points[points.length - 1];
  const lastX = xAt(points.length - 1), lastY = yAt(last.net);
  const labelAnchor = lastX > width - 120 ? "end" : "start";
  const labelX = lastX + (labelAnchor === "end" ? -10 : 10);
  const summary = points.map((point) => `${shortMonthLabel(point.month)} ${formatMoney(point.net)}`).join(", ");
  el.netWorthChart.innerHTML = `
    <title id="netWorthChartTitle">${escapeHtml(t("net_worth_history"))}</title>
    <desc id="netWorthChartDesc">${escapeHtml(t("net_worth_chart_desc", { values: summary }))}</desc>
    ${grid}
    <line class="net-worth-zero" x1="${margin.left}" y1="${zeroY.toFixed(1)}" x2="${width - margin.right}" y2="${zeroY.toFixed(1)}"></line>
    <path class="net-worth-area" d="${areaPath}"></path>
    <path class="net-worth-line" d="${linePath}"></path>
    ${dots}
    ${monthLabels}
    <text class="net-worth-current" x="${labelX.toFixed(1)}" y="${Math.max(18, lastY - 11).toFixed(1)}" text-anchor="${labelAnchor}">${escapeHtml(formatMoney(last.net, { compact: true }))}</text>`;
}

function refreshPortfolio() {
  const meta = CURRENCY_META[state.currency];
  document.querySelectorAll("#view-portfolio .savings-symbol").forEach((s) => (s.textContent = meta.symbol));
  const total = state.portfolio.holdings.reduce((sum, h) => sum + (h.value || 0), 0);
  updatePortfolioHoldingCount();
  saveState();

  // --- Monthly cash flow (Income incl. portfolio yield − Expenses) ---
  const py = portfolioYield();
  const income = incomeManualTotal() + py.interest + py.rental;
  // Monthly burn (all recurring + this month + vehicles), not just what's paid yet.
  const exp = monthlyBurn();
  const net = income - exp;
  el.flowIncome.textContent = formatMoney(income);
  el.flowExpenses.textContent = "−" + formatMoney(exp);
  // last month's total expense (from the Expenses history), shown as a small note
  const lastMonth = (state.expenses.history || [])[0];
  el.flowLastMonth.hidden = !lastMonth;
  if (lastMonth) el.flowLastMonth.textContent = t("flow_last_month", { x: formatMoney(lastMonth.total) });
  el.flowNet.textContent = formatMoney(net);
  el.flowNetRow.classList.toggle("is-pos", net >= 0);
  el.flowNetRow.classList.toggle("is-neg", net < 0);
  el.flowSavings.textContent = "";

  // --- Holdings total + donut (categorized Cash / Investment) ---
  renderPortTotal(total);
  renderPort24h(total);
  const segs = state.portfolio.holdings.filter((h) => h.value > 0);
  if (!segs.length) {
    el.portChart.hidden = true;
    el.portEmpty.hidden = false;
    el.portDonut.innerHTML = "";
    el.portLegend.innerHTML = "";
    donutSel = null; updateDonutSel();
    return;
  }
  el.portChart.hidden = false;
  el.portEmpty.hidden = true;

  const colorOf = {};
  segs.forEach((h, i) => (colorOf[h.id] = PIE_COLORS[i % PIE_COLORS.length]));

  let cum = 0;
  const ring = segs
    .map((h) => {
      const pct = (h.value / total) * 100;
      const name = h.label && h.label.trim() ? escapeHtml(h.label.trim()) : t("holding_ph");
      const circle = `<circle class="donut-seg" data-seg="${escapeHtml(h.id)}" data-pct="${pct}" data-name="${escapeHtml(name)}" cx="21" cy="21" r="15.915" fill="none" stroke="${colorOf[h.id]}" stroke-width="6" stroke-dasharray="${pct} ${100 - pct}" stroke-dashoffset="${25 - cum}" />`;
      cum += pct;
      return circle;
    })
    .join("");
  el.portDonut.innerHTML = `<circle cx="21" cy="21" r="15.915" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6" />${ring}`;
  // keep a slice selected across re-renders only while it still exists
  if (donutSel && !segs.some((h) => h.id === donutSel)) donutSel = null;
  updateDonutSel();

  // Legend grouped by asset type with subtotals
  el.portLegend.innerHTML = ASSET_TYPES
    .map((key) => {
      const items = segs.filter((h) => (h.assetType || "stocks") === key);
      if (!items.length) return "";
      const label = t("asset_" + key);
      const sub = items.reduce((s, h) => s + h.value, 0);
      const rows = items
        .map((h) => {
          const pct = Math.round((h.value / total) * 100);
          const name = h.label && h.label.trim() ? escapeHtml(h.label.trim()) : t("holding_ph");
          return `<div class="leg-item"><span class="leg-dot" style="background:${colorOf[h.id]}"></span><span class="leg-name">${name}</span><span class="leg-val">${formatMoney(h.value)} · ${pct}%</span></div>`;
        })
        .join("");
      return `<div class="leg-group"><div class="leg-head">${label} <span>${formatMoney(sub)} · ${Math.round((sub / total) * 100)}%</span></div>${rows}</div>`;
    })
    .join("");
}

// ---- Donut slice selection (tap a slice → it grows + center shows the %;
// on desktop hovering a slice does the same, falling back to the tapped one) ----
let donutSel = null;
let donutHover = null;
function updateDonutSel() {
  const center = document.getElementById("donutCenter");
  const active = donutHover || donutSel;
  let sel = null;
  el.portDonut.querySelectorAll(".donut-seg").forEach((c) => {
    const on = c.dataset.seg === active;
    c.classList.toggle("is-sel", on);
    if (on) sel = c;
  });
  el.portDonut.classList.toggle("has-sel", !!sel);
  if (!sel) { center.hidden = true; center.dataset.for = ""; return; }
  const pct = parseFloat(sel.dataset.pct) || 0;
  center.querySelector(".dc-pct").textContent = locDec(pct >= 10 ? Math.round(pct) : Math.round(pct * 10) / 10) + "%";
  center.querySelector(".dc-name").textContent = sel.dataset.name;
  center.hidden = false;
  // pop only when the shown slice changes (not on every mouse move)
  if (center.dataset.for !== active) {
    center.dataset.for = active;
    center.classList.remove("pop"); void center.offsetWidth; center.classList.add("pop");
  }
}
el.portDonut.addEventListener("click", (e) => {
  const seg = e.target.closest && e.target.closest(".donut-seg");
  if (!seg) { donutSel = null; updateDonutSel(); return; }
  donutSel = donutSel === seg.dataset.seg ? null : seg.dataset.seg;
  updateDonutSel();
});
// Mouse-only hover (touch keeps the tap behavior)
el.portDonut.addEventListener("pointerover", (e) => {
  if (e.pointerType && e.pointerType !== "mouse") return;
  const seg = e.target.closest && e.target.closest(".donut-seg");
  if (!seg) return;
  donutHover = seg.dataset.seg;
  updateDonutSel();
});
el.portDonut.addEventListener("pointerout", (e) => {
  if (e.pointerType && e.pointerType !== "mouse") return;
  if (!(e.target.closest && e.target.closest(".donut-seg"))) return;
  donutHover = null;
  updateDonutSel();
});

// ============================================================
//  Income
// ============================================================
function buildIncome() {
  el.incList.innerHTML = "";
  INCOME_CATEGORIES.forEach((c) => el.incList.appendChild(makeIncomeRow(c.id, false)));
  state.income.custom.forEach((c) => el.incList.appendChild(makeIncomeRow(c.id, true)));
  if (el.incSourceCount) el.incSourceCount.textContent = t("income_source_count", { count: INCOME_CATEGORIES.length + state.income.custom.length });
}

function makeIncomeRow(id, isCustom) {
  const meta = CURRENCY_META[state.currency];
  const custom = isCustom ? state.income.custom.find((x) => x.id === id) : null;
  const label = isCustom ? (custom ? custom.label : "") : incLabel(id);
  const passive = !!state.income.passive[id];
  const amt = state.income.amounts[id];
  const row = document.createElement("div");
  row.className = "cat-row inc-row" + (passive ? " is-passive" : "");
  row.dataset.inc = id;

  const labelHtml = isCustom
    ? `<input class="cat-name" data-inc-name="${escapeHtml(id)}" value="${escapeHtml(label || "")}" placeholder="${escapeHtml(t("income_ph"))}" />`
    : `<span class="inc-source-name">${escapeHtml(label)}</span>`;

  // Type badge: fixed (read-only) for preset categories, clickable only for custom ones.
  const badge = isCustom
    ? `<button type="button" class="inc-type inc-type--btn" data-inc-toggle="${id}">${passive ? t("passive_label") : t("active_label")}</button>`
    : `<span class="inc-type">${passive ? t("passive_label") : t("active_label")}</span>`;

  const sourceIcons = { salary: "cash-banknote", rental: "home", interest: "building-bank", dividends: "chart-line", side: "briefcase-2" };
  const sourceIcon = sourceIcons[id] || "wallet";

  row.innerHTML = `
    <span class="inc-source-icon" aria-hidden="true">${uiIconSvg(sourceIcon)}</span>
    <div class="cat-label">${labelHtml}${badge}<small class="inc-from-port" data-inc-port="${id}"></small></div>
    <div class="money-input money-input--sm cat-amount">
      <span class="money-symbol savings-symbol">${meta.symbol}</span>
      <input type="text" inputmode="numeric" data-inc-amt="${id}" value="${amt ? formatThousands(amt) : ""}" placeholder="0" />
    </div>
    ${isCustom ? `<button class="cat-remove" type="button" data-inc-del="${id}" aria-label="${escapeHtml(t("income_remove"))}">×</button>` : ""}`;

  if (isCustom) {
    const toggleBtn = row.querySelector("[data-inc-toggle]");
    toggleBtn.addEventListener("click", () => {
      const next = !state.income.passive[id];
      state.income.passive[id] = next;
      row.classList.toggle("is-passive", next);
      toggleBtn.textContent = next ? t("passive_label") : t("active_label");
      refreshIncome();
    });
  }
  const amtInput = row.querySelector("[data-inc-amt]");
  amtInput.addEventListener("input", () => { state.income.amounts[id] = parseNumber(amtInput.value); refreshIncome(); });
  amtInput.addEventListener("blur", () => { if (state.income.amounts[id] > 0) amtInput.value = formatThousands(state.income.amounts[id]); });
  if (isCustom) {
    row.querySelector("[data-inc-name]").addEventListener("input", (e) => { const c = state.income.custom.find((x) => x.id === id); if (c) c.label = e.target.value; saveState(); });
    row.querySelector("[data-inc-del]").addEventListener("click", () => {
      state.income.custom = state.income.custom.filter((x) => x.id !== id);
      delete state.income.amounts[id]; delete state.income.passive[id];
      row.remove(); refreshIncome();
    });
  }
  return row;
}

function addIncome() {
  const id = "inc" + ++state.income.seq;
  state.income.amounts[id] = 0; state.income.passive[id] = false;
  state.income.custom.push({ id, label: "" });
  const row = makeIncomeRow(id, true);
  el.incList.appendChild(row);
  row.querySelector("[data-inc-name]").focus();
  refreshIncome();
}

function refreshIncome() {
  saveState();
  const meta = CURRENCY_META[state.currency];
  document.querySelectorAll("#view-income .savings-symbol").forEach((s) => (s.textContent = meta.symbol));

  let total = 0, passive = 0;
  const add = (id) => { const a = state.income.amounts[id] || 0; total += a; if (state.income.passive[id]) passive += a; };
  INCOME_CATEGORIES.forEach((c) => add(c.id));
  state.income.custom.forEach((c) => add(c.id));

  // Income generated by the portfolio (interest from deposits/bonds, rent from real estate)
  const py = portfolioYield();
  total += py.interest + py.rental;
  passive += py.interest + py.rental;
  const noteFor = (id, amt) => {
    const node = document.querySelector(`#view-income [data-inc-port="${id}"]`);
    if (node) node.textContent = amt > 0 ? t("inc_from_portfolio", { x: formatMoney(amt) }) : "";
  };
  noteFor("interest", py.interest);
  noteFor("rental", py.rental);

  const active = total - passive;
  // Use the full monthly burn so unpaid recurring bills still count toward freedom.
  const exp = monthlyBurn();

  el.incTotal.textContent = formatMoney(total);
  el.incBreakdown.textContent = `${t("passive_label")}: ${formatMoney(passive)} · ${t("active_label")}: ${formatMoney(active)}`;

  const pct = exp > 0 ? (passive / exp) * 100 : 0;
  el.incPct.textContent = Math.round(pct) + "%";
  el.incBarFill.style.width = Math.max(0, Math.min(100, pct)) + "%";

  const surplus = total - exp;
  if (total <= 0) {
    el.incPunch.textContent = t("income_empty");
    el.incSurplus.textContent = "";
  } else if (pct >= 100) {
    el.incPunch.textContent = t("income_free");
    el.incSurplus.textContent = surplus > 0 ? t("surplus_line", { x: formatMoney(surplus) }) : "";
  } else {
    el.incPunch.textContent = surplus >= 0 ? t("surplus_line", { x: formatMoney(surplus) }) : t("deficit_line", { x: formatMoney(-surplus) });
    el.incSurplus.textContent = "";
  }
}

// ============================================================
//  Home screen personalization
// ============================================================
function normalizeHomeLayout(value) {
  const source = value && typeof value === "object" ? value : {};
  const supplied = Array.isArray(source.order) ? source.order.filter((id) => HOME_WIDGET_IDS.includes(id)) : [];
  const order = [...new Set(supplied)];
  HOME_WIDGET_IDS.forEach((id, index) => {
    if (order.includes(id)) return;
    const nextExisting = HOME_WIDGET_IDS.slice(index + 1).find((candidate) => order.includes(candidate));
    if (nextExisting) order.splice(order.indexOf(nextExisting), 0, id);
    else order.push(id);
  });
  const hidden = Array.isArray(source.hidden) ? [...new Set(source.hidden.filter((id) => HOME_WIDGET_IDS.includes(id)))] : [];
  if (hidden.length >= HOME_WIDGET_IDS.length) hidden.pop();
  const countdownEntries = Array.isArray(state.countdowns?.items) ? state.countdowns.items : [];
  const countdownIds = new Set(countdownEntries.map((item) => item && typeof item.id === "string" ? item.id : "").filter(Boolean));
  const isCountdownToken = (id) => typeof id === "string" && id.startsWith("countdown:");
  const validToken = (id) => HOME_WIDGET_IDS.includes(id) || (isCountdownToken(id) && countdownIds.has(id.slice("countdown:".length)));
  const suppliedItems = Array.isArray(source.itemOrder) ? source.itemOrder.filter(validToken) : [];
  const itemOrder = [];
  let baseIndex = 0;
  suppliedItems.forEach((id) => {
    if (isCountdownToken(id)) itemOrder.push(id);
    else if (baseIndex < order.length) itemOrder.push(order[baseIndex++]);
  });
  while (baseIndex < order.length) itemOrder.push(order[baseIndex++]);
  const countdownOrder = normalizeCountdownOrder(state.countdowns?.order, countdownEntries);
  const missingCountdownTokens = countdownOrder
    .map((id) => `countdown:${id}`)
    .filter((token) => !itemOrder.includes(token));
  if (missingCountdownTokens.length) {
    let insertAt = itemOrder.reduce((last, id, index) => id.startsWith("countdown:") ? index : last, -1);
    if (insertAt < 0) insertAt = itemOrder.lastIndexOf("countdown");
    if (insertAt < 0) insertAt = itemOrder.length - 1;
    itemOrder.splice(insertAt + 1, 0, ...missingCountdownTokens);
  }
  return { order, itemOrder: [...new Set(itemOrder)], hidden, freedomExpanded: !!source.freedomExpanded };
}

function normalizeCountdownOrder(value, items = []) {
  const entries = Array.isArray(items) ? items : [];
  const ids = new Set(entries.map((item) => item && typeof item.id === "string" ? item.id : "").filter(Boolean));
  const supplied = Array.isArray(value) ? value.filter((id) => ids.has(id)) : [];
  const order = [...new Set(supplied)];
  const fallback = [...entries]
    .filter((item) => item && typeof item.id === "string" && !order.includes(item.id))
    .sort((a, b) => Date.parse(a.target) - Date.parse(b.target))
    .map((item) => item.id);
  return [...order, ...fallback];
}

function applyHomeLayout() {
  if (!el.dashboardGrid) return;
  state.homeLayout = normalizeHomeLayout(state.homeLayout);
  state.homeLayout.itemOrder.forEach((id) => {
    if (id.startsWith("countdown:")) {
      const countdownId = id.slice("countdown:".length);
      const tile = [...el.dashboardGrid.querySelectorAll("[data-countdown-id]")].find((node) => node.dataset.countdownId === countdownId);
      if (!tile) return;
      tile.hidden = state.homeLayout.hidden.includes("countdown");
      el.dashboardGrid.appendChild(tile);
      return;
    }
    const widget = [...el.dashboardGrid.querySelectorAll("[data-home-widget]")].find((node) => node.dataset.homeWidget === id);
    if (!widget) return;
    widget.hidden = state.homeLayout.hidden.includes(id);
    el.dashboardGrid.appendChild(widget);
  });
  if (el.freedomWidgetBody && el.freedomWidgetToggle) {
    el.freedomWidgetBody.hidden = !state.homeLayout.freedomExpanded;
    el.freedomWidgetToggle.setAttribute("aria-expanded", String(state.homeLayout.freedomExpanded));
    el.freedomWidgetToggle.closest(".dashboard-widget").classList.toggle("is-expanded", state.homeLayout.freedomExpanded);
  }
}

let homeDashboardEditing = false;
let navigateToAppView = () => false;

function homeWidgetSurface(wrapper) {
  if (!wrapper) return null;
  return wrapper.classList.contains("dashboard-widget") ? wrapper : wrapper.querySelector(".dashboard-widget");
}

function ensureHomeCardControls() {
  if (!el.dashboardGrid) return;
  [...el.dashboardGrid.children].filter((node) => node.matches("[data-home-widget]")).forEach((wrapper) => {
    const surface = homeWidgetSurface(wrapper);
    if (!surface || surface.querySelector(".dashboard-card-controls")) return;
    const id = wrapper.dataset.homeWidget;
    const controls = document.createElement("div");
    controls.className = "dashboard-card-controls";
    controls.innerHTML = `<button class="dashboard-card-grip" type="button" data-home-drag="${escapeHtml(id)}" aria-label="${escapeHtml(t("home_card_drag"))}" title="${escapeHtml(t("home_card_drag"))}"><span aria-hidden="true">⠿</span></button><button class="dashboard-card-hide" type="button" data-home-hide="${escapeHtml(id)}" aria-label="${escapeHtml(t("home_card_hide"))}" title="${escapeHtml(t("home_card_hide"))}">×</button>`;
    surface.prepend(controls);
    controls.querySelector("[data-home-drag]").addEventListener("pointerdown", startHomeDashboardReorder);
    controls.querySelector("[data-home-hide]").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      hideHomeCard(id);
    });
  });
}

function refreshHomeCardControlLabels() {
  document.querySelectorAll("[data-home-drag], [data-countdown-drag]").forEach((button) => {
    button.title = t("home_card_drag");
    button.setAttribute("aria-label", t("home_card_drag"));
  });
  document.querySelectorAll("[data-home-hide]").forEach((button) => {
    button.title = t("home_card_hide");
    button.setAttribute("aria-label", t("home_card_hide"));
  });
}

function setHomeDashboardEditing(enabled) {
  homeDashboardEditing = !!enabled;
  if (el.dashboardGrid) el.dashboardGrid.classList.toggle("is-editing", homeDashboardEditing);
  [el.editHome, el.fffEditHome].filter(Boolean).forEach((button) => {
    button.dataset.i18n = homeDashboardEditing ? "dashboard_done" : "dashboard_edit";
    button.textContent = t(button.dataset.i18n);
    button.setAttribute("aria-pressed", String(homeDashboardEditing));
  });
}

function dashboardLayoutRect(node) {
  if (!node) return null;
  const rawRect = node.getBoundingClientRect();
  if (rawRect.width > 0 && rawRect.height > 0) return rawRect;
  const surface = node.matches("[data-countdown-id]") ? node : homeWidgetSurface(node);
  return surface ? surface.getBoundingClientRect() : rawRect;
}

function dashboardLayoutItems(exclude) {
  if (!el.dashboardGrid) return [];
  return [...el.dashboardGrid.children].filter((node) => {
    if (node === exclude || node.matches(".dashboard-drag-placeholder")) return false;
    if (!node.matches("[data-home-widget], [data-countdown-id]") || node.hidden) return false;
    const rect = dashboardLayoutRect(node);
    return rect && rect.width > 0 && rect.height > 0;
  });
}

function syncHomeOrderFromDashboard() {
  if (!el.dashboardGrid) return;
  const itemOrder = [...el.dashboardGrid.children]
    .filter((node) => node.matches("[data-home-widget], [data-countdown-id]"))
    .map((node) => node.matches("[data-countdown-id]") ? `countdown:${node.dataset.countdownId}` : node.dataset.homeWidget);
  const order = itemOrder.filter((id) => HOME_WIDGET_IDS.includes(id));
  state.homeLayout = normalizeHomeLayout({ ...state.homeLayout, order, itemOrder });
  state.countdowns.order = itemOrder
    .filter((id) => id.startsWith("countdown:"))
    .map((id) => id.slice("countdown:".length));
  saveState();
  applyHomeLayout();
  renderHomeCardSettings();
}

function startHomeDashboardReorder(event) {
  if (!homeDashboardEditing) return;
  event.preventDefault();
  event.stopPropagation();
  const handle = event.currentTarget;
  const wrapper = handle.closest("[data-home-widget]");
  const grid = el.dashboardGrid;
  if (!wrapper || !grid) return;
  const surface = homeWidgetSurface(wrapper);
  if (!surface) return;
  const rawWrapperRect = wrapper.getBoundingClientRect();
  const wrapperRect = rawWrapperRect.width > 0 && rawWrapperRect.height > 0 ? rawWrapperRect : surface.getBoundingClientRect();
  const placeholder = document.createElement("div");
  placeholder.className = "dashboard-drag-placeholder";
  placeholder.textContent = t("home_card_drop");
  placeholder.style.minHeight = `${Math.max(96, Math.round(wrapperRect.height))}px`;
  placeholder.style.gridColumn = getComputedStyle(surface).gridColumn;
  const originalStyles = {
    position: wrapper.style.position,
    left: wrapper.style.left,
    top: wrapper.style.top,
    width: wrapper.style.width,
    height: wrapper.style.height,
    zIndex: wrapper.style.zIndex,
    display: wrapper.style.display,
    pointerEvents: wrapper.style.pointerEvents,
    transition: wrapper.style.transition,
    transform: wrapper.style.transform,
  };
  const pointerOffset = { x: event.clientX - wrapperRect.left, y: event.clientY - wrapperRect.top };
  grid.insertBefore(placeholder, wrapper);
  document.body.appendChild(wrapper);
  wrapper.classList.add("is-dragging", "dashboard-drag-clone");
  surface.classList.add("is-dragging-surface");
  Object.assign(wrapper.style, {
    position: "fixed",
    left: `${Math.round(event.clientX - pointerOffset.x)}px`,
    top: `${Math.round(event.clientY - pointerOffset.y)}px`,
    width: `${Math.round(wrapperRect.width)}px`,
    height: `${Math.round(wrapperRect.height)}px`,
    zIndex: "100",
    display: "block",
    pointerEvents: "none",
    transition: "none",
    transform: "rotate(.65deg) scale(1.025)",
  });
  if (handle.setPointerCapture) try { handle.setPointerCapture(event.pointerId); } catch (e) {}
  let dropTarget = null;
  const clearDropTarget = () => {
    if (dropTarget) dropTarget.classList.remove("is-drop-target");
    dropTarget = null;
  };
  const setDropTarget = (target) => {
    clearDropTarget();
    if (target) {
      target.classList.add("is-drop-target");
      dropTarget = target;
    }
  };
  const move = (e) => {
    e.preventDefault();
    wrapper.style.left = `${Math.round(e.clientX - pointerOffset.x)}px`;
    wrapper.style.top = `${Math.round(e.clientY - pointerOffset.y)}px`;
    const siblings = dashboardLayoutItems(wrapper);
    const before = siblings.find((item) => {
      const rect = dashboardLayoutRect(item);
      const sameRow = Math.abs(e.clientY - (rect.top + rect.height / 2)) <= rect.height * .58;
      return sameRow ? e.clientX < rect.left + rect.width / 2 : e.clientY < rect.top + rect.height / 2;
    });
    if (before) grid.insertBefore(placeholder, before); else grid.appendChild(placeholder);
    setDropTarget(before || siblings[siblings.length - 1]);
  };
  const finish = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", finish);
    document.removeEventListener("pointercancel", finish);
    clearDropTarget();
    if (placeholder.parentNode) placeholder.parentNode.insertBefore(wrapper, placeholder);
    placeholder.remove();
    wrapper.classList.remove("is-dragging", "dashboard-drag-clone");
    surface.classList.remove("is-dragging-surface");
    Object.assign(wrapper.style, originalStyles);
    syncHomeOrderFromDashboard();
  };
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", finish);
  document.addEventListener("pointercancel", finish);
}

function startCountdownReorder(event) {
  if (!homeDashboardEditing) return;
  event.preventDefault();
  event.stopPropagation();
  const handle = event.currentTarget;
  const tile = handle.closest("[data-countdown-id]");
  const grid = el.dashboardGrid;
  if (!tile || !grid) return;
  const tileRect = tile.getBoundingClientRect();
  if (!tileRect.width || !tileRect.height) return;
  const placeholder = document.createElement("div");
  placeholder.className = "dashboard-drag-placeholder countdown-drag-placeholder";
  placeholder.textContent = t("home_card_drop");
  placeholder.style.minHeight = `${Math.max(96, Math.round(tileRect.height))}px`;
  placeholder.style.gridColumn = getComputedStyle(tile).gridColumn;
  const originalStyles = {
    position: tile.style.position,
    left: tile.style.left,
    top: tile.style.top,
    width: tile.style.width,
    height: tile.style.height,
    zIndex: tile.style.zIndex,
    display: tile.style.display,
    pointerEvents: tile.style.pointerEvents,
    transition: tile.style.transition,
    transform: tile.style.transform,
  };
  const pointerOffset = { x: event.clientX - tileRect.left, y: event.clientY - tileRect.top };
  if (tile.parentNode !== grid) grid.appendChild(tile);
  grid.insertBefore(placeholder, tile);
  document.body.appendChild(tile);
  tile.classList.add("is-dragging", "dashboard-drag-clone");
  Object.assign(tile.style, {
    position: "fixed",
    left: `${Math.round(event.clientX - pointerOffset.x)}px`,
    top: `${Math.round(event.clientY - pointerOffset.y)}px`,
    width: `${Math.round(tileRect.width)}px`,
    height: `${Math.round(tileRect.height)}px`,
    zIndex: "100",
    display: "flex",
    pointerEvents: "none",
    transition: "none",
    transform: "rotate(.65deg) scale(1.025)",
  });
  if (handle.setPointerCapture) try { handle.setPointerCapture(event.pointerId); } catch (e) {}
  let dropTarget = null;
  const clearDropTarget = () => {
    if (dropTarget) dropTarget.classList.remove("is-drop-target");
    dropTarget = null;
  };
  const setDropTarget = (target) => {
    clearDropTarget();
    if (target) {
      target.classList.add("is-drop-target");
      dropTarget = target;
    }
  };
  const move = (e) => {
    e.preventDefault();
    tile.style.left = `${Math.round(e.clientX - pointerOffset.x)}px`;
    tile.style.top = `${Math.round(e.clientY - pointerOffset.y)}px`;
    const siblings = dashboardLayoutItems(tile);
    const before = siblings.find((item) => {
      const rect = dashboardLayoutRect(item);
      const sameRow = Math.abs(e.clientY - (rect.top + rect.height / 2)) <= rect.height * .58;
      return sameRow ? e.clientX < rect.left + rect.width / 2 : e.clientY < rect.top + rect.height / 2;
    });
    if (before) grid.insertBefore(placeholder, before); else grid.appendChild(placeholder);
    setDropTarget(before || siblings[siblings.length - 1]);
  };
  const finish = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", finish);
    document.removeEventListener("pointercancel", finish);
    clearDropTarget();
    if (placeholder.parentNode) placeholder.parentNode.insertBefore(tile, placeholder);
    placeholder.remove();
    tile.classList.remove("is-dragging", "dashboard-drag-clone");
    Object.assign(tile.style, originalStyles);
    syncHomeOrderFromDashboard();
  };
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", finish);
  document.addEventListener("pointercancel", finish);
}

function hideHomeCard(id) {
  if (!HOME_WIDGET_IDS.includes(id)) return;
  if (state.homeLayout.hidden.length >= HOME_WIDGET_IDS.length - 1) {
    showAppToast(t("home_last_card"));
    return;
  }
  state.homeLayout.hidden = [...new Set([...state.homeLayout.hidden, id])];
  saveState();
  applyHomeLayout();
  renderHomeCardSettings();
}

function moveHomeCard(id, direction) {
  const order = state.homeLayout.order;
  const from = order.indexOf(id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= order.length) return;
  [order[from], order[to]] = [order[to], order[from]];
  saveState(); applyHomeLayout(); renderHomeCardSettings();
}

function syncHomeOrderFromList() {
  if (!el.homeCardList) return;
  const order = [...el.homeCardList.querySelectorAll("[data-home-item]")].map((row) => row.dataset.homeItem);
  state.homeLayout = normalizeHomeLayout({ ...state.homeLayout, order, itemOrder: state.homeLayout.itemOrder });
  saveState(); applyHomeLayout(); renderHomeCardSettings();
}

function startHomeCardReorder(event) {
  event.preventDefault();
  const list = el.homeCardList;
  const handle = event.currentTarget;
  const row = handle.closest("[data-home-item]");
  if (!list || !row) return;
  row.classList.add("is-dragging");
  if (handle.setPointerCapture) try { handle.setPointerCapture(event.pointerId); } catch (e) {}
  const move = (e) => {
    const siblings = [...list.querySelectorAll("[data-home-item]:not(.is-dragging)")];
    const before = siblings.find((item) => {
      const rect = item.getBoundingClientRect();
      return e.clientY < rect.top + rect.height / 2;
    });
    if (before) list.insertBefore(row, before); else list.appendChild(row);
  };
  const finish = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", finish);
    document.removeEventListener("pointercancel", finish);
    row.classList.remove("is-dragging");
    syncHomeOrderFromList();
  };
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", finish);
  document.addEventListener("pointercancel", finish);
}

function renderHomeCardSettings() {
  if (!el.homeCardList) return;
  state.homeLayout = normalizeHomeLayout(state.homeLayout);
  el.homeCardList.innerHTML = state.homeLayout.order.map((id, index) => {
    const visible = !state.homeLayout.hidden.includes(id);
    return `<div class="home-card-row${visible ? "" : " is-hidden"}" data-home-item="${id}">
      <button class="home-card-grip" type="button" aria-label="${escapeHtml(t("home_customize_desc"))}" title="${escapeHtml(t("home_customize_desc"))}"><span aria-hidden="true">⠿</span></button>
      <span class="home-card-name">${escapeHtml(t("home_widget_" + id))}</span>
      <div class="home-card-actions">
        <button type="button" data-home-up="${id}" aria-label="${escapeHtml(t("home_move_up"))}"${index === 0 ? " disabled" : ""}>↑</button>
        <button type="button" data-home-down="${id}" aria-label="${escapeHtml(t("home_move_down"))}"${index === state.homeLayout.order.length - 1 ? " disabled" : ""}>↓</button>
      </div>
      <label class="switch home-card-switch" title="${escapeHtml(t(visible ? "home_card_hide" : "home_card_show"))}">
        <input type="checkbox" data-home-visible="${id}" ${visible ? "checked" : ""} aria-label="${escapeHtml(`${t(visible ? "home_card_hide" : "home_card_show")}: ${t("home_widget_" + id)}`)}" />
        <span class="switch-track"><span class="switch-thumb"></span></span>
      </label>
    </div>`;
  }).join("");
  el.homeCardList.querySelectorAll(".home-card-grip").forEach((button) => button.addEventListener("pointerdown", startHomeCardReorder));
  el.homeCardList.querySelectorAll("[data-home-up]").forEach((button) => button.addEventListener("click", () => moveHomeCard(button.dataset.homeUp, -1)));
  el.homeCardList.querySelectorAll("[data-home-down]").forEach((button) => button.addEventListener("click", () => moveHomeCard(button.dataset.homeDown, 1)));
  el.homeCardList.querySelectorAll("[data-home-visible]").forEach((input) => input.addEventListener("change", () => {
    const id = input.dataset.homeVisible;
    if (!input.checked && state.homeLayout.hidden.length >= HOME_WIDGET_IDS.length - 1) {
      input.checked = true; showAppToast(t("home_last_card")); return;
    }
    state.homeLayout.hidden = input.checked ? state.homeLayout.hidden.filter((item) => item !== id) : [...state.homeLayout.hidden, id];
    saveState(); applyHomeLayout(); renderHomeCardSettings();
  }));
}

function resetHomeLayout() {
  state.homeLayout = { order: [...HOME_WIDGET_IDS], hidden: [], freedomExpanded: false };
  saveState(); applyHomeLayout(); renderHomeCardSettings();
}

function setFreedomWidgetExpanded(expanded) {
  state.homeLayout.freedomExpanded = !!expanded;
  saveState(); applyHomeLayout();
}

function meaningfulHoldingCount() {
  return state.portfolio.holdings.filter((holding) => (holding.value || 0) > 0 || (holding.qty || 0) > 0 || (holding.shares || 0) > 0 || (holding.grams || 0) > 0 || (holding.oz || 0) > 0 || (holding.usd || 0) > 0).length;
}

function passiveIncomeTotal() {
  let total = 0;
  INCOME_CATEGORIES.forEach((category) => { if (state.income.passive[category.id]) total += state.income.amounts[category.id] || 0; });
  state.income.custom.forEach((category) => { if (state.income.passive[category.id]) total += state.income.amounts[category.id] || 0; });
  const portfolio = portfolioYield();
  return total + portfolio.interest + portfolio.rental;
}

function upcomingPaymentCount() {
  let count = state.expenses.recurring.filter((item) => !item.paid && ((item.amount || 0) > 0 || item.cat)).length;
  state.vehicles.forEach((vehicle) => { count += (vehicle.sched || []).filter((item) => item.date && !item.paidMonth).length; });
  return count;
}

function financialSnapshot() {
  const portfolioIncome = portfolioYield();
  const income = incomeManualTotal() + portfolioIncome.interest + portfolioIncome.rental;
  const expenses = monthlyBurn();
  const net = income - expenses;
  const savingsRate = income > 0 ? (net / income) * 100 : 0;
  const passive = passiveIncomeTotal();
  const passiveCoverage = expenses > 0 ? (passive / expenses) * 100 : 0;
  const portfolioTotal = state.portfolio.holdings.reduce((sum, holding) => sum + Math.max(0, holding.value || 0), 0);
  const bufferMonths = expenses > 0 ? portfolioTotal / expenses : 0;
  const diversity = new Set(state.portfolio.holdings.filter((holding) => (holding.value || 0) > 0).map((holding) => holding.assetType)).size;
  const savingsPoints = Math.max(0, Math.min(40, (savingsRate / 30) * 40));
  const passivePoints = Math.max(0, Math.min(25, (passiveCoverage / 100) * 25));
  const bufferPoints = Math.max(0, Math.min(20, (bufferMonths / 6) * 20));
  const diversityPoints = Math.max(0, Math.min(15, (diversity / 4) * 15));
  const score = Math.round(savingsPoints + passivePoints + bufferPoints + diversityPoints);
  return { income, expenses, net, savingsRate, passive, passiveCoverage, portfolioTotal, bufferMonths, diversity, score };
}

function fffOperatorProgress() {
  const holdingCount = meaningfulHoldingCount();
  const incomeCount = Object.values(state.income.amounts || {}).filter((amount) => Number(amount) > 0).length;
  const vehicleExpenseCount = (state.vehicles || []).reduce((total, vehicle) => total
    + (vehicle.oneoff || []).filter((item) => (item.amount || 0) > 0 || item.cat || item.label).length
    + (vehicle.sched || []).filter((item) => (item.amount || 0) > 0 || item.label).length, 0);
  const expenseCount = (state.expenses.recurring || []).filter((item) => (item.amount || 0) > 0 || item.cat).length
    + (state.expenses.oneoff || []).filter((item) => (item.amount || 0) > 0 || item.cat).length
    + vehicleExpenseCount;
  const goalCount = state.savingsGoals.items.length;
  const completedGoalCount = state.savingsGoals.items.filter((goal) => goal.target > 0 && goal.current >= goal.target).length;
  const watchCount = state.watchlist.length;
  const countdownCount = state.countdowns.items.length;
  const alertCount = state.notifications.priceAlerts.length;
  const noteCount = state.homeNotes.items.length;
  const budgetCount = (state.monthlyBudget.items || []).filter((item) => (item.amount || item.limit || 0) > 0).length;
  const snapshot = financialSnapshot();

  const modules = [
    { id: "portfolio", complete: holdingCount > 0, mission: "fff_mission_portfolio", view: "portfolio" },
    { id: "income", complete: incomeCount > 0, mission: "fff_mission_income", view: "income" },
    { id: "expenses", complete: expenseCount > 0, mission: "fff_mission_expenses", view: "savings" },
    { id: "goals", complete: goalCount > 0, mission: "fff_mission_goals", view: "home", widget: "goals" },
    { id: "watch", complete: watchCount > 0, mission: "fff_mission_watch", view: "watch" },
    { id: "countdown", complete: countdownCount > 0, mission: "fff_mission_countdown", view: "home", widget: "countdown" },
    { id: "alert", complete: alertCount > 0, mission: "fff_mission_alert", view: "home", widget: "alerts" },
    { id: "notes", complete: noteCount > 0, mission: "fff_mission_notes", view: "home", widget: "notes" },
  ];

  const online = modules.filter((module) => module.complete).length;
  const badges = [
    holdingCount > 0,
    incomeCount > 0 && expenseCount > 0,
    goalCount > 0,
    completedGoalCount > 0,
    watchCount >= 3,
    countdownCount > 0,
    alertCount > 0,
    snapshot.net > 0 && snapshot.income > 0,
    snapshot.diversity >= 3,
  ].filter(Boolean).length;
  const totalXp = (holdingCount ? 20 + Math.min(holdingCount, 8) * 6 : 0)
    + (incomeCount ? 15 + Math.min(incomeCount, 6) * 8 : 0)
    + (expenseCount ? 15 + Math.min(expenseCount, 12) * 4 : 0)
    + Math.min(goalCount, 5) * 12
    + completedGoalCount * 12
    + Math.min(watchCount, 8) * 4
    + Math.min(countdownCount, 4) * 6
    + Math.min(alertCount, 4) * 6
    + Math.min(noteCount, 6) * 3
    + Math.min(budgetCount, 5) * 6;
  const level = Math.floor(totalXp / 100) + 1;
  const levelXp = totalXp % 100;

  let mission = modules.find((module) => !module.complete);
  if (!mission) {
    if (snapshot.income <= 0 || snapshot.savingsRate < 20) mission = { mission: "fff_mission_savings", view: "income" };
    else if (snapshot.diversity < 3) mission = { mission: "fff_mission_diversity", view: "portfolio" };
    else mission = { mission: "fff_mission_ready", view: "home", widget: "insights" };
  }
  return { totalXp, level, levelXp, online, total: modules.length, badges, mission };
}

function renderFffOperatorHud() {
  if (!el.fffOperatorHud) return;
  const progress = fffOperatorProgress();
  const completion = progress.total ? progress.online / progress.total : 0;
  const missionProgress = Math.round(completion * 100);
  const previousXp = Number(el.fffOperatorHud.dataset.totalXp);
  const hadPreviousXp = el.fffOperatorHud.dataset.totalXp !== "" && Number.isFinite(previousXp);
  el.fffOperatorHud.dataset.totalXp = String(progress.totalXp);
  el.fffHudRank.textContent = `${t("fff_hud_level", { level: progress.level })} · ${t(`fff_rank_${Math.min(5, progress.level)}`)}`;
  el.fffHudXpLabel.textContent = `${progress.levelXp} / 100 XP`;
  el.fffHudXpFill.style.width = `${progress.levelXp}%`;
  el.fffHudXp.setAttribute("aria-valuenow", String(progress.levelXp));
  el.fffHudXp.setAttribute("aria-label", t("fff_hud_xp"));
  el.fffHudStatus.textContent = t("fff_hud_status", { done: progress.online, total: progress.total });
  if (el.fffHudMissionFill) el.fffHudMissionFill.style.width = `${missionProgress}%`;
  el.fffHudMission.textContent = t(progress.mission.mission);
  el.fffHudMissionAction.dataset.missionView = progress.mission.view || "home";
  el.fffHudMissionAction.dataset.missionWidget = progress.mission.widget || "";
  el.fffHudModules.textContent = String(progress.online);
  el.fffHudBadges.textContent = String(progress.badges);
  if (hadPreviousXp && progress.totalXp > previousXp && state.motion && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.fffOperatorHud.classList.remove("is-updated");
    void el.fffOperatorHud.offsetWidth;
    el.fffOperatorHud.classList.add("is-updated");
    window.setTimeout(() => el.fffOperatorHud?.classList.remove("is-updated"), 780);
  }
}

function renderFffTerminalClock() {
  if (!el.fffTerminalClock) return;
  const now = new Date();
  const locale = state.lang === "tr" ? "tr-TR" : "en-GB";
  const date = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(now).toLocaleUpperCase(locale);
  const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  el.fffTerminalClock.dateTime = now.toISOString();
  el.fffTerminalClock.textContent = `${date} / ${time}`;
}

function selectFffHudCat() {
  if (!el.fffHudCat) return;
  const index = Math.floor(Math.random() * FFF_HUD_CAT_IMAGES.length);
  el.fffHudCat.src = FFF_HUD_CAT_IMAGES[index];
}

function syncFffTerminalPage(view = "home") {
  document.documentElement.dataset.fffView = view;
  if (!el.fffTerminalPageTitle) return;
  const label = document.querySelector(`.tab[data-view="${view}"] .tab-label`);
  el.fffTerminalPageTitle.textContent = label?.textContent?.trim() || t("dashboard_title");
}

function openFffMission() {
  if (!el.fffHudMissionAction) return;
  const view = el.fffHudMissionAction.dataset.missionView || "home";
  const widgetId = el.fffHudMissionAction.dataset.missionWidget || "";
  const tab = document.querySelector(`.tab[data-view="${view}"]`);
  if (tab) tab.click();
  if (view !== "home" || !widgetId) return;
  window.requestAnimationFrame(() => {
    const widget = document.querySelector(`[data-home-widget="${widgetId}"]`);
    if (!widget || widget.hidden || state.homeLayout.hidden.includes(widgetId)) {
      const settingsTab = document.querySelector('.tab[data-view="settings"]');
      if (settingsTab) settingsTab.click();
      showAppToast(t("fff_hud_hidden"));
      return;
    }
    const reduceMotion = !state.motion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    widget.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    widget.classList.remove("is-mission-target");
    void widget.offsetWidth;
    widget.classList.add("is-mission-target");
    window.setTimeout(() => widget.classList.remove("is-mission-target"), 1150);
  });
}

function renderMonthlySummary(snapshot = financialSnapshot()) {
  if (!el.homeMonthlyIncome) return;
  el.homeMonthlyIncome.textContent = formatMoney(snapshot.income);
  el.homeMonthlyExpense.textContent = formatMoney(snapshot.expenses);
  el.homeMonthlyNet.textContent = formatMoney(snapshot.net);
  el.homeMonthlyNet.classList.toggle("is-positive", snapshot.net >= 0);
  el.homeMonthlyNet.classList.toggle("is-negative", snapshot.net < 0);
  const barValue = snapshot.income > 0 ? Math.max(0, Math.min(100, snapshot.savingsRate)) : 0;
  el.homeMonthlyBar.style.width = `${barValue}%`;
  el.homeMonthlyBar.classList.toggle("is-negative", snapshot.net < 0);
  el.homeMonthlyRate.textContent = snapshot.income > 0 ? t("monthly_rate", { rate: Math.round(snapshot.savingsRate) }) : t("monthly_no_income");
}

function monthlyShareRoundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

const MONTHLY_SHARE_REACTION_IMAGES = Object.freeze([
  "/assets/monthly-share/cat-shout.png",
  "/assets/monthly-share/cat-blurry.png",
  "/assets/monthly-share/cat-close.png",
  "/assets/monthly-share/cat-wide.png",
]);
const MONTHLY_SHARE_CUSTOM_PHOTO_KEY = "numbr_monthly_share_photo_v1";
const monthlyShareImageCache = new Map();
let monthlyShareCustomPhoto = "";
try { monthlyShareCustomPhoto = localStorage.getItem(MONTHLY_SHARE_CUSTOM_PHOTO_KEY) || ""; } catch (error) {}

function loadMonthlyShareImage(src) {
  if (!monthlyShareImageCache.has(src)) {
    const promise = new Promise((resolve) => {
      if (typeof Image !== "function") {
        resolve(null);
        return;
      }
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
    });
    monthlyShareImageCache.set(src, promise);
  }
  return monthlyShareImageCache.get(src);
}

async function loadRandomMonthlyShareImage() {
  const start = Math.floor(Math.random() * MONTHLY_SHARE_REACTION_IMAGES.length);
  for (let offset = 0; offset < MONTHLY_SHARE_REACTION_IMAGES.length; offset += 1) {
    const src = MONTHLY_SHARE_REACTION_IMAGES[(start + offset) % MONTHLY_SHARE_REACTION_IMAGES.length];
    const image = await loadMonthlyShareImage(src);
    if (image) return image;
  }
  return null;
}

async function loadMonthlyShareBackgroundImage() {
  if (monthlyShareCustomPhoto) {
    const customImage = await loadMonthlyShareImage(monthlyShareCustomPhoto);
    if (customImage) return customImage;
    monthlyShareImageCache.delete(monthlyShareCustomPhoto);
    monthlyShareCustomPhoto = "";
    try { localStorage.removeItem(MONTHLY_SHARE_CUSTOM_PHOTO_KEY); } catch (error) {}
  }
  return loadRandomMonthlyShareImage();
}

function monthlyShareFileDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
}

async function prepareMonthlySharePhoto(file) {
  if (!file || !String(file.type || "").startsWith("image/") || file.size > 12 * 1024 * 1024) throw new Error("Invalid image");
  const source = await monthlyShareFileDataUrl(file);
  const image = await loadMonthlyShareImage(source);
  if (!image) throw new Error("Image decode failed");
  const maxDimension = 1800;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  monthlyShareImageCache.delete(source);
  return canvas.toDataURL("image/jpeg", .88);
}

function saveMonthlyShareCustomPhoto(dataUrl) {
  if (monthlyShareCustomPhoto) monthlyShareImageCache.delete(monthlyShareCustomPhoto);
  monthlyShareCustomPhoto = dataUrl;
  try { localStorage.setItem(MONTHLY_SHARE_CUSTOM_PHOTO_KEY, dataUrl); } catch (error) {}
}

function clearMonthlyShareCustomPhoto() {
  if (monthlyShareCustomPhoto) monthlyShareImageCache.delete(monthlyShareCustomPhoto);
  monthlyShareCustomPhoto = "";
  try { localStorage.removeItem(MONTHLY_SHARE_CUSTOM_PHOTO_KEY); } catch (error) {}
}

function monthlyShareCoverImage(ctx, image, x, y, width, height) {
  ctx.save();
  monthlyShareRoundRect(ctx, x, y, width, height, 42);
  ctx.clip();
  ctx.fillStyle = "#0a0c18";
  ctx.fillRect(x, y, width, height);
  if (image) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const imageScale = Math.max(width / image.width, height / image.height);
    const imageWidth = image.width * imageScale;
    const imageHeight = image.height * imageScale;
    ctx.drawImage(image, x + (width - imageWidth) / 2, y + (height - imageHeight) / 2, imageWidth, imageHeight);
  }

  const overallShade = ctx.createLinearGradient(0, y, 0, y + height);
  overallShade.addColorStop(0, "rgba(3, 6, 16, .4)");
  overallShade.addColorStop(.28, "rgba(3, 6, 16, .08)");
  overallShade.addColorStop(.52, "rgba(3, 6, 16, .24)");
  overallShade.addColorStop(.72, "rgba(3, 6, 16, .76)");
  overallShade.addColorStop(1, "rgba(3, 6, 16, .96)");
  ctx.fillStyle = overallShade;
  ctx.fillRect(x, y, width, height);

  const bottomGlow = ctx.createRadialGradient(x + 180, y + height - 220, 20, x + 180, y + height - 220, 520);
  bottomGlow.addColorStop(0, "rgba(255, 67, 132, .24)");
  bottomGlow.addColorStop(1, "rgba(255, 67, 132, 0)");
  ctx.fillStyle = bottomGlow;
  ctx.fillRect(x, y + height - 650, width, 650);
  ctx.restore();
}

function monthlyShareExpenseStats(total) {
  const items = [];
  const add = (label, amount) => {
    const value = Number(amount) || 0;
    if (value <= 0) return;
    items.push({ label: String(label || t("monthly_share_no_category")).trim() || t("monthly_share_no_category"), amount: value });
  };
  (state.expenses.recurring || []).forEach((item) => add(item.cat ? ecatName(item.cat) : "", item.amount));
  (state.expenses.oneoff || []).forEach((item) => add(item.cat ? ecatName(item.cat) : "", item.amount));
  (state.vehicles || []).forEach((vehicle) => {
    (vehicle.oneoff || []).forEach((item) => add(item.cat || vehicle.plate || t("car_vehicle"), item.amount));
    (vehicle.sched || []).forEach((item) => {
      if (item.paidMonth === state.expenses.month) add(item.label || vehicle.plate || t("car_vehicle"), item.amount);
    });
  });
  const largest = items.reduce((best, item) => (!best || item.amount > best.amount ? item : best), null);
  const [year, month] = String(state.expenses.month || currentYM()).split("-").map(Number);
  const daysInMonth = year > 0 && month > 0 ? new Date(year, month, 0).getDate() : 30;
  return {
    dailyAverage: total > 0 ? total / daysInMonth : 0,
    count: items.length,
    largest: largest || { label: t("monthly_share_no_category"), amount: 0 },
  };
}

function monthlyShareEllipsize(ctx, value, maxWidth) {
  const text = String(value || "");
  if (ctx.measureText(text).width <= maxWidth) return text;
  let shortened = text;
  while (shortened.length > 1 && ctx.measureText(shortened + "…").width > maxWidth) shortened = shortened.slice(0, -1);
  return shortened + "…";
}

async function monthlyShareCanvas(snapshot) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const backgroundImage = await loadMonthlyShareBackgroundImage();
  const stats = monthlyShareExpenseStats(snapshot.expenses);
  const cardX = 30;
  const cardY = 30;
  const cardWidth = 1020;
  const cardHeight = 1290;

  const fallback = ctx.createLinearGradient(0, 0, 1080, 1350);
  fallback.addColorStop(0, "#11152b");
  fallback.addColorStop(.55, "#17172b");
  fallback.addColorStop(1, "#072b32");
  ctx.fillStyle = fallback;
  ctx.fillRect(0, 0, 1080, 1350);
  monthlyShareCoverImage(ctx, backgroundImage, cardX, cardY, cardWidth, cardHeight);

  monthlyShareRoundRect(ctx, cardX, cardY, cardWidth, cardHeight, 42);
  ctx.strokeStyle = "rgba(238, 247, 255, .48)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#f7fbff";
  ctx.font = '800 46px "Sora", Arial, sans-serif';
  ctx.fillText("NumBrrr", 80, 116);
  ctx.fillStyle = "rgba(255, 255, 255, .78)";
  ctx.font = '800 19px Inter, Arial, sans-serif';
  ctx.fillText(t("monthly_share_card_title").toUpperCase(), 80, 158);

  const month = monthLabel(state.expenses.month);
  monthlyShareRoundRect(ctx, 770, 74, 240, 62, 31);
  ctx.fillStyle = "rgba(4, 10, 23, .62)";
  ctx.fill();
  ctx.strokeStyle = "rgba(210, 238, 255, .42)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#eef9ff";
  ctx.font = '800 21px Inter, Arial, sans-serif';
  ctx.textAlign = "center";
  ctx.fillText(month, 890, 114);
  ctx.textAlign = "left";

  monthlyShareRoundRect(ctx, 80, 570, 250, 46, 23);
  const labelGradient = ctx.createLinearGradient(80, 0, 330, 0);
  labelGradient.addColorStop(0, "rgba(255, 72, 139, .9)");
  labelGradient.addColorStop(1, "rgba(255, 130, 92, .72)");
  ctx.fillStyle = labelGradient;
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = '800 18px Inter, Arial, sans-serif';
  ctx.fillText(t("monthly_share_expenses").toUpperCase(), 104, 600);

  const mainExpense = snapshot.expenses > 0 ? `−${formatMoney(snapshot.expenses)}` : formatMoney(0);
  let mainFontSize = 140;
  ctx.font = `800 ${mainFontSize}px "Sora", Arial, sans-serif`;
  while (ctx.measureText(mainExpense).width > 920 && mainFontSize > 74) {
    mainFontSize -= 2;
    ctx.font = `800 ${mainFontSize}px "Sora", Arial, sans-serif`;
  }
  ctx.save();
  ctx.shadowColor = "rgba(255, 68, 132, .42)";
  ctx.shadowBlur = 28;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(mainExpense, 80, 755);
  ctx.restore();

  const divider = ctx.createLinearGradient(80, 0, 1000, 0);
  divider.addColorStop(0, "rgba(255, 74, 139, .9)");
  divider.addColorStop(.38, "rgba(255, 143, 91, .66)");
  divider.addColorStop(1, "rgba(255, 255, 255, .05)");
  ctx.fillStyle = divider;
  monthlyShareRoundRect(ctx, 80, 806, 920, 5, 3);
  ctx.fill();

  const compactStats = [
    { x: 80, width: 440, label: t("monthly_share_daily"), value: formatMoney(stats.dailyAverage) },
    { x: 540, width: 460, label: t("monthly_share_records"), value: String(stats.count) },
  ];
  compactStats.forEach((item) => {
    monthlyShareRoundRect(ctx, item.x, 855, item.width, 142, 26);
    ctx.fillStyle = "rgba(4, 9, 21, .62)";
    ctx.fill();
    ctx.strokeStyle = "rgba(235, 246, 255, .25)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "rgba(239, 247, 255, .72)";
    ctx.font = '800 17px Inter, Arial, sans-serif';
    ctx.fillText(item.label.toUpperCase(), item.x + 26, 898);
    let valueFontSize = 42;
    ctx.font = `800 ${valueFontSize}px "Sora", Arial, sans-serif`;
    while (ctx.measureText(item.value).width > item.width - 52 && valueFontSize > 26) {
      valueFontSize -= 1;
      ctx.font = `800 ${valueFontSize}px "Sora", Arial, sans-serif`;
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillText(item.value, item.x + 26, 963);
  });

  monthlyShareRoundRect(ctx, 80, 1021, 920, 162, 28);
  ctx.fillStyle = "rgba(4, 9, 21, .7)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 107, 151, .38)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgba(239, 247, 255, .72)";
  ctx.font = '800 17px Inter, Arial, sans-serif';
  ctx.fillText(t("monthly_share_largest").toUpperCase(), 108, 1066);
  let largestLabelSize = 40;
  ctx.font = `800 ${largestLabelSize}px "Sora", Arial, sans-serif`;
  while (ctx.measureText(stats.largest.label).width > 500 && largestLabelSize > 25) {
    largestLabelSize -= 1;
    ctx.font = `800 ${largestLabelSize}px "Sora", Arial, sans-serif`;
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillText(monthlyShareEllipsize(ctx, stats.largest.label, 500), 108, 1135);
  let largestAmountSize = 38;
  const largestAmount = formatMoney(stats.largest.amount);
  ctx.font = `800 ${largestAmountSize}px "Sora", Arial, sans-serif`;
  while (ctx.measureText(largestAmount).width > 330 && largestAmountSize > 24) {
    largestAmountSize -= 1;
    ctx.font = `800 ${largestAmountSize}px "Sora", Arial, sans-serif`;
  }
  ctx.fillStyle = "#ff9bbb";
  ctx.textAlign = "right";
  ctx.fillText(largestAmount, 972, 1135);
  ctx.textAlign = "left";

  ctx.fillStyle = "rgba(245, 250, 255, .68)";
  ctx.font = '700 17px Inter, Arial, sans-serif';
  ctx.fillText("numbr.app", 80, 1260);
  return canvas;
}

function monthlyShareBlob(canvas) {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Image conversion failed")), "image/png"));
}

let monthlySharePreviewState = null;

function openMonthlyShareModal(blob, snapshot) {
  if (!el.monthlyShareModal || !el.monthlySharePreviewImage) return;
  closeMonthlyShareModal();
  const url = URL.createObjectURL(blob);
  const file = new File([blob], `numbr-aylik-harcama-${localDateKey()}.png`, { type: "image/png" });
  monthlySharePreviewState = { blob, file, snapshot, url };
  el.monthlySharePreviewImage.src = url;
  el.monthlySharePreviewImage.alt = t("monthly_share_preview_title");
  if (el.monthlyShareUpload) el.monthlyShareUpload.classList.toggle("is-active", !!monthlyShareCustomPhoto);
  if (el.monthlyShareRandom) el.monthlyShareRandom.classList.toggle("is-active", !monthlyShareCustomPhoto);
  el.monthlyShareModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeMonthlyShareModal() {
  if (monthlySharePreviewState && monthlySharePreviewState.url) URL.revokeObjectURL(monthlySharePreviewState.url);
  monthlySharePreviewState = null;
  if (el.monthlySharePreviewImage) el.monthlySharePreviewImage.removeAttribute("src");
  if (el.monthlyShareModal) el.monthlyShareModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function downloadMonthlyShare(blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `numbr-aylik-harcama-${localDateKey()}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showAppToast(t("monthly_share_downloaded"));
}

async function copyMonthlyShare() {
  if (!monthlySharePreviewState) return;
  try {
    if (!navigator.clipboard || typeof window.ClipboardItem !== "function") throw new Error("Image clipboard unavailable");
    const item = new window.ClipboardItem({ "image/png": monthlySharePreviewState.blob });
    await navigator.clipboard.write([item]);
    showAppToast(t("monthly_share_copied"));
  } catch (error) {
    showAppToast(t("monthly_share_copy_failed"));
  }
}

async function shareMonthlyImage() {
  if (!monthlySharePreviewState) return;
  const { file, snapshot } = monthlySharePreviewState;
  const canShareFile = typeof navigator.share === "function" && (!navigator.canShare || navigator.canShare({ files: [file] }));
  if (!canShareFile) {
    showAppToast(t("monthly_share_system_unavailable"));
    return;
  }
  try {
    await navigator.share({
      title: t("monthly_share_title"),
      text: t("monthly_share_text", { amount: formatMoney(snapshot.expenses) }),
      files: [file],
    });
  } catch (error) {
    if (!error || error.name !== "AbortError") showAppToast(t("monthly_share_system_unavailable"));
  }
}

async function shareMonthlySummary() {
  try {
    const snapshot = financialSnapshot();
    const blob = await monthlyShareBlob(await monthlyShareCanvas(snapshot));
    openMonthlyShareModal(blob, snapshot);
  } catch (error) {
    console.warn("Monthly summary sharing failed", error);
    showAppToast(t("monthly_share_failed"));
  }
}

async function handleMonthlySharePhotoChange(event) {
  const file = event && event.target && event.target.files && event.target.files[0];
  if (!file) return;
  if (el.monthlyShareUpload) el.monthlyShareUpload.disabled = true;
  try {
    const dataUrl = await prepareMonthlySharePhoto(file);
    saveMonthlyShareCustomPhoto(dataUrl);
    await shareMonthlySummary();
    showAppToast(t("monthly_share_photo_loaded"));
  } catch (error) {
    showAppToast(t("monthly_share_photo_failed"));
  } finally {
    if (el.monthlySharePhotoInput) el.monthlySharePhotoInput.value = "";
    if (el.monthlyShareUpload) el.monthlyShareUpload.disabled = false;
  }
}

async function useRandomMonthlySharePhoto() {
  clearMonthlyShareCustomPhoto();
  await shareMonthlySummary();
  showAppToast(t("monthly_share_random_loaded"));
}

function healthLabel(score) {
  if (score >= 80) return t("health_excellent");
  if (score >= 60) return t("health_good");
  if (score >= 35) return t("health_fair");
  return t("health_weak");
}

function renderFinancialHealth(snapshot = financialSnapshot()) {
  if (!el.healthRing) return;
  el.healthRing.style.setProperty("--score", String(snapshot.score));
  el.healthScore.textContent = String(snapshot.score);
  el.healthLabel.textContent = healthLabel(snapshot.score);
  el.healthRing.dataset.level = snapshot.score >= 80 ? "excellent" : snapshot.score >= 60 ? "good" : snapshot.score >= 35 ? "fair" : "weak";
}

function homeMarketChange(change) {
  if (!Number.isFinite(change)) return "";
  const sign = change >= 0 ? "+" : "";
  return `<span class="home-market-change ${change >= 0 ? "is-up" : "is-down"}">${sign}${change.toFixed(2)}%</span>`;
}

function renderHomeMarketSummary() {
  if (!el.homeMarketList) return;
  const waiting = homeMarketData.loading || !homeMarketData.loadedAt;
  const goldTry = goldPriceGram > 0 ? goldPriceGram * (state.currency === "TL" ? 1 : usdTry || 0) : 0;
  const rows = [
    { label: t("market_usd"), value: homeMarketData.usd && homeMarketData.usd.price > 0 ? `₺${fmtPrice(homeMarketData.usd.price)}` : "", change: homeMarketData.usd && homeMarketData.usd.chg24 },
    { label: t("market_eur"), value: homeMarketData.eur && homeMarketData.eur.price > 0 ? `₺${fmtPrice(homeMarketData.eur.price)}` : "", change: homeMarketData.eur && homeMarketData.eur.chg24 },
    { label: t("market_gold"), value: goldTry > 0 ? formatMoneyCcy(goldTry, "TL") : "", change: goldChg24 },
  ];
  el.homeMarketList.innerHTML = rows.map((row) => `<div class="home-market-row"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.value || (waiting ? "…" : t("market_unavailable")))}</strong>${homeMarketChange(row.change)}</div>`).join("");
}

async function refreshHomeMarketSummary(force = false) {
  if (!el.homeMarketList) return;
  if (!force && homeMarketData.usd && homeMarketData.eur && homeMarketData.loadedAt && Date.now() - homeMarketData.loadedAt < FX_CACHE_FRESH_MS) { renderHomeMarketSummary(); return; }
  if (homeMarketData.loading) return;
  homeMarketData.loading = true;
  renderHomeMarketSummary();
  const [usd, eur] = await Promise.all([getFxQuote("TRY=X"), getFxQuote("EURTRY=X")]);
  if (usd) { homeMarketData.usd = usd; if (usd.price > 0) usdTry = usd.price; }
  if (eur) homeMarketData.eur = eur;
  homeMarketData.loadedAt = Date.now();
  homeMarketData.loading = false;
  renderHomeMarketSummary();
}

const WEATHER_FRESH_MS = 20 * 60 * 1000;

function weatherCondition(code, isDay = true) {
  const n = Number(code);
  if (n === 0) return { icon: isDay ? "☀️" : "🌙", label: t("weather_clear") };
  if (n === 1 || n === 2) return { icon: isDay ? "🌤️" : "☁️", label: t("weather_partly_cloudy") };
  if (n === 3) return { icon: "☁️", label: t("weather_cloudy") };
  if (n === 45 || n === 48) return { icon: "🌫️", label: t("weather_fog") };
  if (n >= 51 && n <= 57) return { icon: "🌦️", label: t("weather_drizzle") };
  if (n >= 61 && n <= 67) return { icon: "🌧️", label: t("weather_rainy") };
  if (n >= 71 && n <= 77) return { icon: "🌨️", label: t("weather_snow") };
  if (n >= 80 && n <= 82) return { icon: "🌦️", label: t("weather_showers") };
  if (n === 85 || n === 86) return { icon: "🌨️", label: t("weather_snow") };
  if (n >= 95) return { icon: "⛈️", label: t("weather_thunderstorm") };
  return { icon: "🌡️", label: t("weather_unavailable") };
}

function normalizeWeatherData(value) {
  if (!value || typeof value !== "object" || !value.current || !Array.isArray(value.daily)) return null;
  const current = value.current;
  if (![current.temperature, current.apparent, current.code, current.wind].every(Number.isFinite)) return null;
  const daily = value.daily.map((day) => ({
    date: typeof day.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day.date) ? day.date : "",
    code: Number.isFinite(day.code) ? day.code : 0,
    min: Number.isFinite(day.min) ? day.min : 0,
    max: Number.isFinite(day.max) ? day.max : 0,
    rain: Number.isFinite(day.rain) ? Math.max(0, Math.min(100, day.rain)) : 0,
  })).filter((day) => day.date).slice(0, 3);
  if (!daily.length) return null;
  return {
    current: {
      temperature: current.temperature,
      apparent: current.apparent,
      isDay: current.isDay === false ? false : !!current.isDay,
      code: current.code,
      wind: Math.max(0, current.wind),
    },
    daily,
  };
}

function parseWeatherApi(data) {
  const current = data && data.current;
  const daily = data && data.daily;
  if (!current || !daily || !Array.isArray(daily.time)) return null;
  return normalizeWeatherData({
    current: {
      temperature: current.temperature_2m,
      apparent: current.apparent_temperature,
      isDay: current.is_day === 1,
      code: current.weather_code,
      wind: current.wind_speed_10m,
    },
    daily: daily.time.map((date, index) => ({
      date,
      code: daily.weather_code && daily.weather_code[index],
      min: daily.temperature_2m_min && daily.temperature_2m_min[index],
      max: daily.temperature_2m_max && daily.temperature_2m_max[index],
      rain: daily.precipitation_probability_max && daily.precipitation_probability_max[index],
    })),
  });
}

function renderHomeWeather() {
  if (!el.weatherContent) return;
  const data = state.weather.data;
  const location = state.weather.location;
  if (!data) {
    el.weatherContent.innerHTML = `<p class="weather-placeholder">${escapeHtml(weatherLoading ? t("weather_loading") : t("weather_unavailable"))}</p>`;
    return;
  }
  const current = data.current;
  const condition = weatherCondition(current.code, current.isDay);
  if (el.weatherHeaderIcon) el.weatherHeaderIcon.textContent = condition.icon;
  const locale = state.lang === "tr" ? "tr-TR" : "en-US";
  const days = data.daily.map((day, index) => {
    const dayCondition = weatherCondition(day.code, true);
    let label = index === 0 ? t("weather_today") : index === 1 ? t("weather_tomorrow") : "";
    if (!label) {
      const parts = day.date.split("-").map(Number);
      label = new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString(locale, { weekday: "short" });
    }
    return `<div class="weather-forecast-day"><span>${escapeHtml(label)}</span><b aria-label="${escapeHtml(dayCondition.label)}">${dayCondition.icon}</b><strong>${Math.round(day.max)}°</strong><small>${Math.round(day.min)}°</small></div>`;
  }).join("");
  const updated = new Date(state.weather.updatedAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  el.weatherContent.innerHTML = `
    <div class="weather-current">
      <span class="weather-current-icon" role="img" aria-label="${escapeHtml(condition.label)}">${condition.icon}</span>
      <div class="weather-current-copy"><strong>${escapeHtml(location.name)}</strong><span>${escapeHtml(condition.label)}</span></div>
      <strong class="weather-temperature">${Math.round(current.temperature)}°</strong>
    </div>
    <div class="weather-details">
      <span>${escapeHtml(t("weather_feels_like", { temp: Math.round(current.apparent) + "°" }))}</span>
      <span>${escapeHtml(t("weather_wind", { speed: Math.round(current.wind) + (state.lang === "tr" ? " km/sa" : " km/h") }))}</span>
      <span>${escapeHtml(t("weather_rain", { rate: Math.round(data.daily[0].rain) }))}</span>
    </div>
    <div class="weather-forecast">${days}</div>
    <small class="weather-updated">${escapeHtml(t("weather_updated", { time: updated }))} · <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a></small>`;
}

function weatherWidgetVisible() {
  return !state.homeLayout.hidden.includes("weather");
}

async function refreshHomeWeather(force = false) {
  if (!el.weatherContent || !weatherWidgetVisible()) return;
  if (!force && state.weather.data && state.weather.updatedAt && Date.now() - state.weather.updatedAt < WEATHER_FRESH_MS) {
    renderHomeWeather();
    return;
  }
  if (weatherLoading) return;
  weatherLoading = true;
  if (el.weatherRefresh) el.weatherRefresh.disabled = true;
  if (el.weatherContent) el.weatherContent.setAttribute("aria-busy", "true");
  if (el.weatherStatus) el.weatherStatus.textContent = "";
  renderHomeWeather();
  try {
    const loc = state.weather.location;
    const query = new URLSearchParams({
      latitude: String(loc.latitude), longitude: String(loc.longitude),
      current: "temperature_2m,apparent_temperature,is_day,weather_code,wind_speed_10m",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: "auto", forecast_days: "3",
    });
    const response = await fetchWithTimeout(`https://api.open-meteo.com/v1/forecast?${query}`, {}, 7000);
    if (!response.ok) throw new Error("weather response");
    const data = parseWeatherApi(await response.json());
    if (!data) throw new Error("weather data");
    state.weather.data = data;
    state.weather.updatedAt = Date.now();
    saveState();
  } catch (error) {
    if (el.weatherStatus) el.weatherStatus.textContent = t("weather_unavailable");
  } finally {
    weatherLoading = false;
    if (el.weatherRefresh) el.weatherRefresh.disabled = false;
    if (el.weatherContent) el.weatherContent.removeAttribute("aria-busy");
    renderHomeWeather();
  }
}

function chooseWeatherLocation(location) {
  state.weather.location = {
    name: String(location.name || t("weather_current_location")).slice(0, 80),
    latitude: Math.max(-90, Math.min(90, Number(location.latitude))),
    longitude: Math.max(-180, Math.min(180, Number(location.longitude))),
  };
  state.weather.data = null;
  state.weather.updatedAt = 0;
  if (el.weatherSearch) el.weatherSearch.value = "";
  if (el.weatherSearchResults) el.weatherSearchResults.hidden = true;
  if (el.weatherSearch) el.weatherSearch.setAttribute("aria-expanded", "false");
  if (el.weatherLocationPanel) el.weatherLocationPanel.hidden = true;
  if (el.weatherLocationToggle) el.weatherLocationToggle.setAttribute("aria-expanded", "false");
  saveState();
  renderHomeWeather();
  refreshHomeWeather(true);
}

async function searchWeatherLocations(query, requestId) {
  if (!el.weatherSearchResults || !el.weatherSearch) return;
  try {
    const params = new URLSearchParams({ name: query, count: "6", language: state.lang === "tr" ? "tr" : "en", format: "json" });
    const response = await fetchWithTimeout(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {}, 5500);
    if (!response.ok) throw new Error("geocoding response");
    const payload = await response.json();
    if (requestId !== weatherSearchRequest || el.weatherSearch.value.trim() !== query) return;
    const matches = Array.isArray(payload.results) ? payload.results.filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude)).slice(0, 6) : [];
    if (!matches.length) {
      el.weatherSearchResults.innerHTML = `<p>${escapeHtml(t("weather_no_results"))}</p>`;
    } else {
      el.weatherSearchResults.innerHTML = matches.map((item, index) => {
        const secondary = [item.admin1, item.country].filter(Boolean).filter((part, i, all) => all.indexOf(part) === i).join(" · ");
        return `<button type="button" role="option" data-weather-result="${index}"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(secondary)}</span></button>`;
      }).join("");
      el.weatherSearchResults.querySelectorAll("[data-weather-result]").forEach((button) => {
        button.addEventListener("mousedown", (event) => event.preventDefault());
        button.addEventListener("click", () => {
          const item = matches[Number(button.dataset.weatherResult)];
          const name = [item.name, item.admin1].filter(Boolean).filter((part, i, all) => all.indexOf(part) === i).join(", ");
          chooseWeatherLocation({ name, latitude: item.latitude, longitude: item.longitude });
        });
      });
    }
    el.weatherSearchResults.hidden = false;
    el.weatherSearch.setAttribute("aria-expanded", "true");
  } catch (error) {
    if (requestId !== weatherSearchRequest) return;
    el.weatherSearchResults.innerHTML = `<p>${escapeHtml(t("weather_unavailable"))}</p>`;
    el.weatherSearchResults.hidden = false;
    el.weatherSearch.setAttribute("aria-expanded", "true");
  }
}

function wireWeatherWidget() {
  if (!el.weatherLocationToggle || !el.weatherLocationPanel) return;
  const closeResults = () => {
    if (el.weatherSearchResults) el.weatherSearchResults.hidden = true;
    if (el.weatherSearch) el.weatherSearch.setAttribute("aria-expanded", "false");
  };
  el.weatherLocationToggle.addEventListener("click", () => {
    const open = el.weatherLocationPanel.hidden;
    el.weatherLocationPanel.hidden = !open;
    el.weatherLocationToggle.setAttribute("aria-expanded", String(open));
    if (open && el.weatherSearch) setTimeout(() => el.weatherSearch.focus(), 0);
    else closeResults();
  });
  el.weatherRefresh.addEventListener("click", () => refreshHomeWeather(true));
  el.weatherSearch.addEventListener("input", () => {
    clearTimeout(weatherSearchTimer);
    closeResults();
    const query = el.weatherSearch.value.trim();
    if (query.length < 2) return;
    const requestId = ++weatherSearchRequest;
    weatherSearchTimer = setTimeout(() => searchWeatherLocations(query, requestId), 300);
  });
  el.weatherSearch.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { closeResults(); el.weatherSearch.value = ""; }
    else if (event.key === "ArrowDown" && !el.weatherSearchResults.hidden) {
      event.preventDefault();
      const first = el.weatherSearchResults.querySelector("button");
      if (first) first.focus();
    }
  });
  el.weatherSearch.addEventListener("blur", () => setTimeout(closeResults, 150));
  el.weatherUseLocation.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      if (el.weatherStatus) el.weatherStatus.textContent = t("weather_location_denied");
      return;
    }
    el.weatherUseLocation.disabled = true;
    if (el.weatherStatus) el.weatherStatus.textContent = t("weather_loading");
    navigator.geolocation.getCurrentPosition((position) => {
      el.weatherUseLocation.disabled = false;
      if (el.weatherStatus) el.weatherStatus.textContent = "";
      chooseWeatherLocation({ name: t("weather_current_location"), latitude: position.coords.latitude, longitude: position.coords.longitude });
    }, () => {
      el.weatherUseLocation.disabled = false;
      if (el.weatherStatus) el.weatherStatus.textContent = t("weather_location_denied");
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 });
  });
}

function renderSavingsGoals() {
  if (!el.savingsGoalList) return;
  const items = state.savingsGoals.items;
  if (!items.length) {
    el.savingsGoalList.innerHTML = "";
    return;
  }
  el.savingsGoalList.innerHTML = items.map((goal) => {
    const percent = goal.target > 0 ? Math.max(0, Math.min(100, (goal.current / goal.target) * 100)) : 0;
    const completed = goal.current >= goal.target;
    return `<article class="glass dashboard-widget dashboard-widget--compact savings-goal-row${completed ? " is-complete" : ""}" data-goal-id="${escapeHtml(goal.id)}">
      <div class="savings-goal-head"><div><strong>${escapeHtml(goal.name)}</strong><span>${escapeHtml(goal.currency)}</span></div><b>${completed ? "✓" : Math.round(percent) + "%"}</b></div>
      <div class="savings-goal-foot"><span>${escapeHtml(completed ? t("goal_completed") : t("goal_progress", { current: formatMoneyCcy(goal.current, goal.currency), target: formatMoneyCcy(goal.target, goal.currency) }))}</span><label><span>${escapeHtml(t("goal_current"))}</span><input type="text" inputmode="numeric" data-format-thousands data-goal-current="${escapeHtml(goal.id)}" value="${goal.current ? formatThousands(goal.current) : ""}" placeholder="0" aria-label="${escapeHtml(goal.name + " · " + t("goal_current"))}" /></label><button type="button" data-goal-del="${escapeHtml(goal.id)}" aria-label="${escapeHtml(t("goal_remove"))}">×</button></div>
      <div class="savings-goal-track" aria-hidden="true"><span style="width:${percent}%"></span></div>
    </article>`;
  }).join("");
  el.savingsGoalList.querySelectorAll("[data-goal-current]").forEach((input) => {
    wireThousandsInput(input);
    const update = (finish = false) => {
      const goal = state.savingsGoals.items.find((item) => item.id === input.dataset.goalCurrent);
      if (!goal) return;
      goal.current = Math.max(0, parseNumber(input.value));
      saveState();
      if (finish) renderSavingsGoals();
      else {
        const row = input.closest(".savings-goal-row");
        const percent = goal.target > 0 ? Math.max(0, Math.min(100, (goal.current / goal.target) * 100)) : 0;
        const completed = goal.current >= goal.target;
        row.classList.toggle("is-complete", completed);
        row.querySelector(".savings-goal-track span").style.width = `${percent}%`;
        row.querySelector(".savings-goal-head b").textContent = completed ? "✓" : Math.round(percent) + "%";
        row.querySelector(".savings-goal-foot > span").textContent = completed ? t("goal_completed") : t("goal_progress", { current: formatMoneyCcy(goal.current, goal.currency), target: formatMoneyCcy(goal.target, goal.currency) });
      }
      renderSmartInsights();
    };
    input.addEventListener("input", () => update(false));
    input.addEventListener("change", () => update(true));
    input.addEventListener("blur", () => update(true));
    input.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); input.blur(); } });
  });
  el.savingsGoalList.querySelectorAll("[data-goal-del]").forEach((button) => button.addEventListener("click", () => {
    state.savingsGoals.items = state.savingsGoals.items.filter((item) => item.id !== button.dataset.goalDel);
    saveState(); sfx("remove"); renderSavingsGoals(); renderSmartInsights();
  }));
}

function addSavingsGoal(event) {
  event.preventDefault();
  const name = el.savingsGoalName.value.trim();
  const target = parseNumber(el.savingsGoalTarget.value);
  const current = Math.max(0, parseNumber(el.savingsGoalCurrent.value));
  const currency = el.savingsGoalCurrency.value === "USD" ? "USD" : "TL";
  if (!name || !(target > 0)) { showAppToast(t("goal_invalid")); return; }
  state.savingsGoals.items.unshift({ id: "sg" + ++state.savingsGoals.seq, name: name.slice(0, 60), target, current, currency });
  el.savingsGoalName.value = "";
  el.savingsGoalTarget.value = "";
  el.savingsGoalCurrent.value = "";
  saveState(); renderSavingsGoals(); renderSmartInsights(); sfx("success"); showAppToast(t("goal_added"));
}

function renderHomeNotes() {
  if (!el.homeNoteList) return;
  const items = state.homeNotes.items;
  if (!items.length) {
    el.homeNoteList.innerHTML = `<p class="countdown-empty">${escapeHtml(t("note_empty"))}</p>`;
    return;
  }
  el.homeNoteList.innerHTML = items.map((note) => `<div class="mini-note-row${note.done ? " is-done" : ""}" data-note-id="${escapeHtml(note.id)}"><label><input type="checkbox" data-note-done="${escapeHtml(note.id)}" ${note.done ? "checked" : ""} /><span>${escapeHtml(note.text)}</span></label><button type="button" data-note-del="${escapeHtml(note.id)}" aria-label="${escapeHtml(t("note_remove"))}">×</button></div>`).join("");
  el.homeNoteList.querySelectorAll("[data-note-done]").forEach((input) => input.addEventListener("change", () => {
    const note = state.homeNotes.items.find((item) => item.id === input.dataset.noteDone);
    if (!note) return;
    note.done = input.checked; saveState(); renderHomeNotes();
  }));
  el.homeNoteList.querySelectorAll("[data-note-del]").forEach((button) => button.addEventListener("click", () => {
    state.homeNotes.items = state.homeNotes.items.filter((item) => item.id !== button.dataset.noteDel);
    saveState(); sfx("remove"); renderHomeNotes();
  }));
}

function addHomeNote(event) {
  event.preventDefault();
  const text = el.homeNoteInput.value.trim();
  if (!text) return;
  state.homeNotes.items.unshift({ id: "hn" + ++state.homeNotes.seq, text: text.slice(0, 120), done: false });
  if (state.homeNotes.items.length > 50) state.homeNotes.items.length = 50;
  el.homeNoteInput.value = "";
  saveState(); renderHomeNotes(); sfx("add");
}

function insightPortfolioMetrics() {
  const holdings = state.portfolio.holdings.filter((holding) => (holding.value || 0) > 0).map((holding) => ({
    holding,
    value: Math.max(0, holding.value || 0),
  })).sort((a, b) => b.value - a.value);
  const total = holdings.reduce((sum, item) => sum + item.value, 0);
  const top = holdings[0];
  return {
    total,
    count: holdings.length,
    groups: new Set(holdings.map((item) => item.holding.assetType || "cash")).size,
    topName: top ? (top.holding.label || top.holding.stockName || top.holding.coinSymbol || top.holding.symbol || t("command_asset")) : "",
    topShare: top && total > 0 ? (top.value / total) * 100 : 0,
  };
}

function insightBudgetMetrics() {
  const items = currentBudgetItems().filter((item) => item.limit > 0).map((item) => {
    const spent = budgetItemSpent(item);
    return { item, spent, rate: (spent / item.limit) * 100 };
  });
  if (!items.length) return null;
  const top = [...items].sort((a, b) => b.rate - a.rate)[0];
  const limit = items.reduce((sum, entry) => sum + entry.item.limit, 0);
  const spent = expensesTotal();
  return {
    top,
    rate: limit > 0 ? (spent / limit) * 100 : 0,
  };
}

function smartInsights(snapshot = financialSnapshot()) {
  const candidates = [];
  const add = (id, priority, insight) => candidates.push({ id, priority, ...insight });
  const portfolio = insightPortfolioMetrics();
  const budget = insightBudgetMetrics();
  const hasData = snapshot.income > 0 || snapshot.expenses > 0 || portfolio.total > 0 || state.savingsGoals.items.length > 0 || !!budget;

  if (!hasData) return [{ icon: "🧭", title: t("insight_setup_title"), body: t("insight_setup_body") }];

  // Score each observation by urgency so the widget surfaces decisions, not a fixed checklist.
  if (snapshot.net < 0) {
    const pressure = snapshot.expenses > 0 ? Math.min(40, (Math.abs(snapshot.net) / snapshot.expenses) * 40) : 20;
    add("cash", 120 + pressure, { icon: "↘", tone: "warn", title: t("insight_cash_negative_title"), body: t("insight_cash_negative_body", { amount: formatMoney(Math.abs(snapshot.net)) }) });
  } else if (snapshot.income > 0) {
    add("cash", 62, { icon: "↗", tone: "good", title: t("insight_cash_positive_title"), body: t("insight_cash_positive_body", { amount: formatMoney(snapshot.net) }) });
  }

  if (snapshot.income > 0) {
    const savingsPriority = snapshot.savingsRate < 10 ? 108 : snapshot.savingsRate < 20 ? 82 : 55;
    add("savings", savingsPriority, { icon: "%", tone: snapshot.savingsRate >= 20 ? "good" : "warn", title: t("insight_rate_title"), body: t("insight_rate_body", { rate: Math.round(snapshot.savingsRate) }) });
  }

  if (budget && budget.top) {
    const rate = Math.round(Math.max(0, budget.top.rate));
    if (rate >= 80) add("budget", rate >= 100 ? 132 : 104, {
      icon: "₺", tone: rate >= 100 ? "warn" : "", title: t("insight_budget_title"),
      body: t("insight_budget_body", { name: budgetItemLabel(budget.top.item), rate }),
    });
  }

  if (portfolio.topShare >= 45) {
    const share = Math.round(portfolio.topShare);
    add("concentration", share >= 60 ? 126 : 92, {
      icon: "◉", tone: share >= 60 ? "warn" : "", title: t("insight_concentration_title"),
      body: t("insight_concentration_body", { name: portfolio.topName, rate: share }),
    });
  }

  if (snapshot.expenses > 0 && portfolio.total > 0) {
    const months = snapshot.bufferMonths;
    const roundedMonths = Math.max(0.1, Math.round(months * 10) / 10);
    add("buffer", months < 3 ? 118 : months < 6 ? 84 : 54, {
      icon: "◌", tone: months < 3 ? "warn" : months >= 6 ? "good" : "",
      title: t("insight_runway_title"), body: t("insight_runway_body", { months: roundedMonths }),
    });
  }

  if (portfolio.count >= 2 && portfolio.groups < 3) {
    add("diversification", portfolio.groups === 1 ? 88 : 70, {
      icon: "◇", tone: portfolio.groups === 1 ? "warn" : "", title: t("insight_diversification_title"),
      body: t("insight_diversification_body", { count: portfolio.groups }),
    });
  }

  const lastMonth = state.expenses.history.find((month) => month.total > 0);
  if (lastMonth && lastMonth.total > 0 && snapshot.expenses > 0) {
    const change = ((snapshot.expenses / lastMonth.total) - 1) * 100;
    if (Math.abs(change) >= 5) add("trend", change > 0 ? 110 : 58, change > 0
      ? { icon: "↑", tone: "warn", title: t("insight_expense_up_title"), body: t("insight_expense_up_body", { rate: Math.round(Math.abs(change)) }) }
      : { icon: "↓", tone: "good", title: t("insight_expense_down_title"), body: t("insight_expense_down_body", { rate: Math.round(Math.abs(change)) }) });
  }

  const closestGoal = [...state.savingsGoals.items]
    .filter((goal) => goal.target > 0 && goal.current < goal.target)
    .sort((a, b) => (b.current / b.target) - (a.current / a.target))[0];
  if (closestGoal) {
    const rate = Math.min(100, Math.round((closestGoal.current / closestGoal.target) * 100));
    const remaining = formatMoneyCcy(Math.max(0, closestGoal.target - closestGoal.current), closestGoal.currency);
    add("goal", rate >= 80 ? 78 : 64, {
      icon: "🏁", title: rate >= 80 ? t("insight_goal_momentum_title") : t("insight_goal_title"),
      body: rate >= 80 ? t("insight_goal_momentum_body", { name: closestGoal.name, rate, amount: remaining }) : t("insight_goal_body", { name: closestGoal.name, rate }),
    });
  }

  if (snapshot.passiveCoverage > 0) add("passive", snapshot.passiveCoverage >= 50 ? 72 : 60, {
    icon: "◔", tone: snapshot.passiveCoverage >= 50 ? "good" : "", title: t("insight_passive_title"), body: t("insight_passive_body", { rate: Math.round(snapshot.passiveCoverage) }),
  });

  const upcoming = upcomingPaymentCount();
  if (upcoming > 0) add("upcoming", 68, { icon: "⏰", title: t("insight_upcoming_title"), body: t("insight_upcoming_body", { count: upcoming }) });

  if (!candidates.length) return [{ icon: "🧭", title: t("insight_more_title"), body: t("insight_more_body") }];
  return candidates.sort((a, b) => b.priority - a.priority).slice(0, 4).map(({ priority, id, ...insight }) => insight);
}

function renderSmartInsights(snapshot = financialSnapshot()) {
  if (!el.smartInsightList) return;
  el.smartInsightList.innerHTML = smartInsights(snapshot).map((insight) => `<article class="smart-insight-row${insight.tone ? " is-" + insight.tone : ""}"><span aria-hidden="true">${escapeHtml(insight.icon)}</span><div><strong>${escapeHtml(insight.title)}</strong><p>${escapeHtml(insight.body)}</p></div></article>`).join("");
}

function renderHomeSummaries() {
  if (!el.dashboardGrid) return;
  if (el.homeFreedomSummary) {
    const amount = el.bestAmount && el.bestAmount.textContent !== "—" ? el.bestAmount.textContent : formatMoney(state.monthlyExpenses * 12 * 25);
    const name = el.bestLabel && el.bestLabel.textContent !== "—" ? el.bestLabel.textContent : t("home_widget_freedom");
    el.homeFreedomSummary.textContent = t("home_freedom_summary", { amount, name });
  }
  if (el.homePortfolioValue) el.homePortfolioValue.textContent = el.portTotal && el.portTotal.textContent ? el.portTotal.textContent : formatMoney(0);
  if (el.homePortfolioNote) el.homePortfolioNote.textContent = t("home_holdings", { count: meaningfulHoldingCount() });
  if (el.homeIncomeValue) el.homeIncomeValue.textContent = el.incTotal && el.incTotal.textContent ? el.incTotal.textContent : formatMoney(0);
  if (el.homeIncomeNote) el.homeIncomeNote.textContent = t("home_passive", { amount: formatMoney(passiveIncomeTotal()) });
  if (el.homeExpensesValue) el.homeExpensesValue.textContent = el.expTotal && el.expTotal.textContent ? el.expTotal.textContent : formatMoney(expensesTotal());
  if (el.homeExpensesNote) el.homeExpensesNote.textContent = t("home_upcoming", { count: upcomingPaymentCount() });
  const vehicle = activeVehicle();
  if (el.homeCarValue) el.homeCarValue.textContent = vehicle && vehicle.plate ? vehicle.plate : t("home_vehicles", { count: state.vehicles.length });
  const lastTrip = state.vehicleHub.trips[0];
  if (el.homeCarNote) el.homeCarNote.textContent = lastTrip ? t("home_last_trip", { route: `${lastTrip.from} → ${lastTrip.to}` }) : t("home_no_route");
  const watched = state.watchlist.slice(0, 3);
  if (el.homeWatchPreview) el.homeWatchPreview.hidden = !watched.length;
  if (el.homeWatchNote) el.homeWatchNote.textContent = state.watchlist.length ? t("home_watch_count", { count: state.watchlist.length }) : t("watch_search_ph");
  const snapshot = financialSnapshot();
  renderMonthlySummary(snapshot);
  renderFinancialHealth(snapshot);
  renderHomeMarketSummary();
  renderSavingsGoals();
  renderHomeNotes();
  renderSmartInsights(snapshot);
  renderFffOperatorHud();
  if (el.countdownName) el.countdownName.placeholder = t("countdown_name_ph");
  if (el.countdownCategory) el.countdownCategory.placeholder = t("countdown_category_ph");
  if (el.countdownDate) {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    el.countdownDate.min = dateInputValue(tomorrow);
  }
}

function renderHomeDashboard(refreshMarket = true) {
  if (!el.dashboardGrid) return;
  renderHomeSummaries();
  applyHomeLayout();
  renderCountdowns();
  buildTrPanel();
  buildTopPerformers();
  if (refreshMarket) {
    refreshHomeMarketSummary();
  }
}

function dateInputValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseDateInput(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!match) return null;
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

function calendarDayDistance(from, to) {
  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toUtc - fromUtc) / 86400000);
}

function countdownTargetDate(item) {
  const calendarDate = parseDateInput(item.date);
  if (calendarDate) return calendarDate;
  const target = new Date(item.target);
  return Number.isFinite(target.getTime()) ? target : null;
}

function countdownParts(item, now = Date.now()) {
  const calendarTarget = parseDateInput(item.date);
  if (calendarTarget) {
    const from = new Date(now);
    const days = calendarDayDistance(from, calendarTarget);
    if (days <= 0) return { done: true, value: 0, label: t("countdown_done") };
    if (item.unit === "months") {
      let months = (calendarTarget.getFullYear() - from.getFullYear()) * 12 + calendarTarget.getMonth() - from.getMonth();
      if (calendarTarget.getDate() > from.getDate()) months += 1;
      months = Math.max(1, months);
      return { done: false, value: months, label: t(months === 1 ? "countdown_month_left" : "countdown_months_left") };
    }
    return { done: false, value: days, label: t(days === 1 ? "countdown_day_left" : "countdown_days_left") };
  }
  const target = Date.parse(item.target);
  const diff = target - now;
  if (!Number.isFinite(target) || diff <= 0) return { done: true, value: 0, label: t("countdown_done") };
  const days = Math.max(1, Math.ceil(diff / 86400000));
  if (item.unit === "months") {
    const from = new Date(now), to = new Date(target);
    let months = (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth();
    const fromClock = from.getDate() * 86400000 + from.getHours() * 3600000 + from.getMinutes() * 60000 + from.getSeconds() * 1000 + from.getMilliseconds();
    const toClock = to.getDate() * 86400000 + to.getHours() * 3600000 + to.getMinutes() * 60000 + to.getSeconds() * 1000 + to.getMilliseconds();
    if (toClock > fromClock) months += 1;
    months = Math.max(1, months);
    return { done: false, value: months, label: t(months === 1 ? "countdown_month_left" : "countdown_months_left") };
  }
  return { done: false, value: days, label: t(days === 1 ? "countdown_day_left" : "countdown_days_left") };
}

function renderCountdowns() {
  if (!el.countdownList) return;
  // Countdown tiles are moved from the list into the dashboard grid by
  // applyHomeLayout(). Clear both locations before rendering again so a
  // removed tile cannot remain as an orphan or be duplicated on refresh.
  document.querySelectorAll("[data-countdown-id]").forEach((tile) => tile.remove());
  state.countdowns.order = normalizeCountdownOrder(state.countdowns.order, state.countdowns.items);
  const itemsById = new Map(state.countdowns.items.map((item) => [item.id, item]));
  const items = state.countdowns.order.map((id) => itemsById.get(id)).filter(Boolean);
  if (!items.length) {
    el.countdownList.innerHTML = "";
    applyHomeLayout();
    return;
  }
  const locale = state.lang === "tr" ? "tr-TR" : "en-US";
  el.countdownList.innerHTML = items.map((item) => {
    const remaining = countdownParts(item);
    const target = countdownTargetDate(item);
    const date = target ? target.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) : "—";
    const category = item.category ? item.category : t("countdown_title");
    return `<article class="glass dashboard-widget dashboard-widget--compact countdown-tile${remaining.done ? " is-done" : ""}" data-countdown-id="${escapeHtml(item.id)}">
      <div class="countdown-tile-head">
        <span class="dashboard-widget-icon" aria-hidden="true">${uiIconSvg("hourglass")}</span>
        <div class="countdown-tile-heading"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(category)}</small></div>
        <div class="countdown-tile-actions"><button class="dashboard-card-grip countdown-tile-grip" type="button" data-countdown-drag="${escapeHtml(item.id)}" aria-label="${escapeHtml(t("home_card_drag"))}" title="${escapeHtml(t("home_card_drag"))}"><span aria-hidden="true">⠿</span></button><button class="countdown-tile-remove" type="button" data-countdown-del="${escapeHtml(item.id)}" aria-label="${escapeHtml(t("countdown_remove"))}">×</button></div>
      </div>
      <div class="countdown-tile-value"><b>${remaining.done ? "✓" : remaining.value}</b><span>${escapeHtml(remaining.label)}</span></div>
      <div class="countdown-tile-footer"><small>${escapeHtml(t("countdown_target", { date }))}</small><button type="button" data-countdown-unit="${escapeHtml(item.id)}" aria-label="${escapeHtml(t("countdown_switch_unit"))}">${item.unit === "months" ? t("countdown_days") : t("countdown_months")}</button></div>
    </article>`;
  }).join("");
  el.countdownList.querySelectorAll("[data-countdown-drag]").forEach((button) => button.addEventListener("pointerdown", startCountdownReorder));
  el.countdownList.querySelectorAll("[data-countdown-del]").forEach((button) => button.addEventListener("click", () => {
    state.countdowns.items = state.countdowns.items.filter((item) => item.id !== button.dataset.countdownDel);
    state.countdowns.order = state.countdowns.order.filter((id) => id !== button.dataset.countdownDel);
    state.homeLayout.itemOrder = state.homeLayout.itemOrder.filter((id) => id !== `countdown:${button.dataset.countdownDel}`);
    saveState(); renderCountdowns();
  }));
  el.countdownList.querySelectorAll("[data-countdown-unit]").forEach((button) => button.addEventListener("click", () => {
    const item = state.countdowns.items.find((entry) => entry.id === button.dataset.countdownUnit);
    if (!item) return;
    item.unit = item.unit === "months" ? "days" : "months";
    saveState(); renderCountdowns();
  }));
  applyHomeLayout();
}

function addCountdown(event) {
  event.preventDefault();
  const name = el.countdownName.value.trim();
  const category = el.countdownCategory.value.trim();
  const unit = el.countdownUnit.value === "months" ? "months" : "days";
  const date = el.countdownDate.value;
  const target = parseDateInput(date);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (!name || !target || target <= today) { showAppToast(t("countdown_invalid")); return; }
  const id = "cd" + ++state.countdowns.seq;
  state.countdowns.items.push({ id, name: name.slice(0, 80), category: category.slice(0, 40), date, target: target.toISOString(), unit });
  state.countdowns.order = normalizeCountdownOrder([...state.countdowns.order, id], state.countdowns.items);
  el.countdownName.value = "";
  el.countdownCategory.value = "";
  el.countdownDate.value = "";
  saveState(); renderCountdowns();
  const tile = document.querySelector(`[data-countdown-id="${id}"]`);
  if (tile && state.motion && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    tile.classList.add("is-new");
    tile.addEventListener("animationend", () => tile.classList.remove("is-new"), { once: true });
  }
  showAppToast(t("countdown_added"));
}

function wireHomeDashboard() {
  if (!el.dashboardGrid) return;
  ensureHomeCardControls();
  setHomeDashboardEditing(false);
  if (el.fffHudMissionAction) el.fffHudMissionAction.addEventListener("click", openFffMission);
  document.querySelectorAll("[data-fff-open-settings]").forEach((button) => button.addEventListener("click", () => {
    document.querySelector('.tab[data-view="settings"]')?.click();
  }));
  el.freedomWidgetToggle.addEventListener("click", () => setFreedomWidgetExpanded(!state.homeLayout.freedomExpanded));
  el.dashboardGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-view]");
    if (!button || !el.dashboardGrid.contains(button)) return;
    event.preventDefault();
    navigateToAppView(button.dataset.openView);
  });
  [el.editHome, el.fffEditHome].filter(Boolean).forEach((button) => button.addEventListener("click", () => {
    setHomeDashboardEditing(!homeDashboardEditing);
  }));
  el.savingsGoalForm.addEventListener("submit", addSavingsGoal);
  document.querySelectorAll("[data-format-thousands]").forEach(wireThousandsInput);
  el.homeNoteForm.addEventListener("submit", addHomeNote);
  el.countdownForm.addEventListener("submit", addCountdown);
}

// ============================================================
//  Watchlist
// ============================================================
function watchSearchPool() {
  const pool = [
    { type: "gold", key: "gold", name: t("asset_gold"), sym: "XAU", tag: t("asset_gold") },
    { type: "goldoz", key: "goldoz", name: t("asset_gold_oz"), sym: "XAU", tag: t("asset_gold") },
  ];
  US_STOCKS.forEach((s) => pool.push({ type: "usstock", key: s.s, name: s.n, sym: s.s, tag: t("asset_usstock") }));
  BIST_STOCKS.forEach((s) => pool.push({ type: "bist", key: s.s, name: s.n, sym: s.s, tag: t("asset_bist") }));
  cryptoMarkets.forEach((c) => pool.push({ type: "crypto", key: c.id, name: c.name, sym: c.symbol, tag: t("asset_crypto") }));
  return pool;
}
function addWatch(item) {
  if (state.watchlist.some((w) => w.type === item.type && w.key === item.key)) return;
  state.watchlist.push({ type: item.type, key: item.key, name: item.name, sym: item.sym });
  buildWatchlist(); saveState(); renderNotificationSettings(); refreshWatchData();
}
function removeWatch(type, key) {
  state.watchlist = state.watchlist.filter((w) => !(w.type === type && w.key === key));
  buildWatchlist(); saveState();
  renderNotificationSettings();
}
function chgHtml(label, v) {
  if (v == null || isNaN(v)) return `<span class="perf-chip"><span class="perf-lbl">${label}</span> <b>—</b></span>`;
  return `<span class="perf-chip ${v >= 0 ? "up" : "down"}"><span class="perf-lbl">${label}</span> <b>${v >= 0 ? "+" : ""}${v.toFixed(1)}%</b></span>`;
}
// Tiny 7-day trend line from a price series (crypto: hourly, stocks: daily closes).
function sparklineSvg(series) {
  const pts = (Array.isArray(series) ? series : []).filter((p) => typeof p === "number" && isFinite(p));
  if (pts.length < 2) return "";
  let arr = pts;
  if (arr.length > 32) { arr = []; const step = pts.length / 32; for (let i = 0; i < 32; i++) arr.push(pts[Math.floor(i * step)]); arr.push(pts[pts.length - 1]); }
  const min = Math.min(...arr), max = Math.max(...arr), range = max - min || 1;
  const W = 72, H = 26, pad = 2, n = arr.length;
  const coords = arr.map((v, i) => `${(pad + (i / (n - 1)) * (W - 2 * pad)).toFixed(1)} ${(pad + (1 - (v - min) / range) * (H - 2 * pad)).toFixed(1)}`);
  const path = coords.map((point, i) => `${i ? "L" : "M"}${point}`).join(" ");
  const up = arr[arr.length - 1] >= arr[0];
  return `<svg class="watch-spark ${up ? "up" : "down"}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden="true"><path d="${path}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`;
}
// The currency a row's price is shown in (native by type), optionally flipped by
// the per-row toggle (TR users only).
function watchNativeCcy(w) {
  if (w.type === "usstock") return "USD";
  if (w.type === "bist") return "TRY";
  if (w.type === "fiat") return w.key === "usd" ? "USD" : "TRY";
  return state.currency === "TL" ? "TRY" : "USD"; // gold, crypto follow the app
}
// The per-row toggle only applies for TR users (the feature is TL-only).
function watchFlipped(w) { return !!w.altCcy && state.currency === "TL"; }
function watchDisplayCcy(w) {
  const native = watchNativeCcy(w);
  return watchFlipped(w) ? (native === "USD" ? "TRY" : "USD") : native;
}
function watchPriceLabel(w) {
  if (w.type === "fiat") {
    const value = w.key === "usd" ? (watchDisplayCcy(w) === "TRY" ? usdTry : 1) : (watchDisplayCcy(w) === "USD" && usdTry > 0 ? 1 / usdTry : 1);
    return value > 0 ? (watchDisplayCcy(w) === "TRY" ? "₺" : "$") + fmtPrice(value) : "…";
  }
  const d = watchData[w.key];
  if (!d || d.price == null) return "…";
  let suffix = "", value = d.price;
  if (w.type === "gold") { value = d.price * goldFactor(); suffix = "/" + goldUnit(); }
  else if (w.type === "goldoz") { value = d.price * GRAMS_PER_OZ; suffix = "/oz"; } // always per ounce
  const native = watchNativeCcy(w);
  let ccy = native;
  if (watchFlipped(w) && usdTry > 0) {
    if (native === "USD") { value *= usdTry; ccy = "TRY"; }
    else { value /= usdTry; ccy = "USD"; }
  }
  return (ccy === "TRY" ? "₺" : "$") + fmtPrice(value) + suffix;
}

function watchValueInCurrency(w, ccy) {
  if (w.type === "fiat") {
    if (w.key === "usd") return ccy === "TRY" ? (usdTry > 0 ? usdTry : null) : 1;
    return ccy === "USD" ? (usdTry > 0 ? 1 / usdTry : null) : 1;
  }
  const d = watchData[w.key];
  if (!d || !Number.isFinite(d.price)) return null;
  let value = d.price;
  if (w.type === "gold") value *= goldFactor();
  else if (w.type === "goldoz") value *= GRAMS_PER_OZ;
  const native = watchNativeCcy(w);
  if (native !== ccy) {
    if (!(usdTry > 0)) return null;
    value = native === "USD" ? value * usdTry : value / usdTry;
  }
  return value;
}

function formatAlertPrice(value, ccy) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(ccy === "TRY" ? "tr-TR" : "en-US", {
    style: "currency", currency: ccy, maximumFractionDigits: value < 10 ? 4 : 2,
  }).format(value);
}

// ============================================================
//  Installable PWA, offline state and background Web Push
// ============================================================
let deferredInstallPrompt = null;
let pwaRegistration = null;
let backgroundPushState = "unknown";
let pushSyncTimer = 0;
let lastPushFingerprint = "";

function isStandaloneApp() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function renderPwaSettings() {
  if (el.offlineBanner) el.offlineBanner.hidden = navigator.onLine !== false;
  if (!el.pwaStatus || !el.installPwa) return;
  const supported = "serviceWorker" in navigator;
  el.installPwa.hidden = !deferredInstallPrompt || isStandaloneApp();
  if (isStandaloneApp()) el.pwaStatus.textContent = t("pwa_installed");
  else if (!supported) el.pwaStatus.textContent = t("pwa_unsupported");
  else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) el.pwaStatus.textContent = t("pwa_ios");
  else el.pwaStatus.textContent = t("pwa_ready");
}

async function installPwa() {
  if (!deferredInstallPrompt) { renderPwaSettings(); return; }
  deferredInstallPrompt.prompt();
  try { await deferredInstallPrompt.userChoice; } catch (e) {}
  deferredInstallPrompt = null;
  renderPwaSettings();
}

async function registerPwa() {
  renderPwaSettings();
  if (!("serviceWorker" in navigator)) return null;
  try {
    pwaRegistration = await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
    await navigator.serviceWorker.ready;
    renderPwaSettings();
    if (state.notifications.enabled && notificationPermission() === "granted") syncPushSubscription();
    return pwaRegistration;
  } catch (e) {
    renderPwaSettings();
    return null;
  }
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  renderPwaSettings();
});
window.addEventListener("appinstalled", () => { deferredInstallPrompt = null; renderPwaSettings(); });
window.addEventListener("online", () => { renderPwaSettings(); if (state.notifications.enabled) syncPushSubscription(); });
window.addEventListener("offline", renderPwaSettings);

function urlBase64ToUint8Array(value) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

function pushClientId() {
  const key = "numbr_push_client";
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch (e) { return ""; }
}

function backgroundPushPayload(subscription) {
  return {
    clientId: pushClientId(),
    subscription: subscription.toJSON ? subscription.toJSON() : subscription,
    lang: state.lang === "tr" ? "tr" : "en",
    currency: state.currency === "TL" ? "TRY" : "USD",
    vehicleDays: state.notifications.vehicleDays,
    priceAlerts: state.notifications.priceAlerts.map((alert) => ({
      id: alert.id, type: alert.type, key: alert.key, name: alert.name, sym: alert.sym || "",
      condition: alert.condition, target: alert.target, percentage: alert.percentage, referencePrice: alert.referencePrice, ccy: alert.ccy,
    })),
    vehicles: state.vehicles.map((vehicle) => ({
      id: vehicle.id, plate: vehicle.plate || "",
      sched: (vehicle.sched || []).filter((item) => item && item.date && !item.paidMonth).map((item) => ({ id: item.id, label: item.label || "", date: item.date })),
    })),
  };
}

async function removePushSubscription() {
  const clientId = pushClientId();
  try {
    await fetch("/api/push-subscription", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId }), keepalive: true,
    });
  } catch (e) {}
  try {
    const registration = pwaRegistration || await navigator.serviceWorker.ready;
    const subscription = registration.pushManager ? await registration.pushManager.getSubscription() : null;
    if (subscription) await subscription.unsubscribe();
  } catch (e) {}
  backgroundPushState = "unknown";
  lastPushFingerprint = "";
}

async function syncPushSubscription(force = false) {
  if (!state.notifications.enabled || notificationPermission() !== "granted" || navigator.onLine === false) return false;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    backgroundPushState = "fallback"; renderNotificationStatus(); return false;
  }
  backgroundPushState = "syncing"; renderNotificationStatus();
  try {
    const configResponse = await fetch("/api/push-config", { cache: "no-store" });
    if (!configResponse.ok) throw new Error("push config unavailable");
    const config = await configResponse.json();
    if (!config.enabled || !config.publicKey) throw new Error("push not configured");
    const registration = pwaRegistration || await navigator.serviceWorker.ready;
    pwaRegistration = registration;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(config.publicKey) });
    }
    const payload = backgroundPushPayload(subscription);
    const fingerprint = JSON.stringify(payload);
    if (!force && fingerprint === lastPushFingerprint) {
      backgroundPushState = "ready"; renderNotificationStatus(); return true;
    }
    const response = await fetch("/api/push-subscription", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: fingerprint,
    });
    if (!response.ok) throw new Error("push subscription failed");
    lastPushFingerprint = fingerprint;
    backgroundPushState = "ready"; renderNotificationStatus();
    return true;
  } catch (e) {
    backgroundPushState = "fallback"; renderNotificationStatus();
    return false;
  }
}

function schedulePushSync() {
  clearTimeout(pushSyncTimer);
  if (!state.notifications.enabled) return;
  pushSyncTimer = setTimeout(() => syncPushSubscription(), 1400);
}

function notificationPermission() {
  return "Notification" in window ? Notification.permission : "unsupported";
}

function renderNotificationStatus() {
  if (!el.notifyStatus || !el.notifyToggle) return;
  const permission = notificationPermission();
  el.notifyToggle.checked = !!state.notifications.enabled;
  if (!state.notifications.enabled) el.notifyStatus.textContent = permission === "denied" ? t("notify_blocked") : t("notify_off");
  else if (permission === "granted" && backgroundPushState === "ready") el.notifyStatus.textContent = t("notify_active");
  else if (permission === "granted" && backgroundPushState === "syncing") el.notifyStatus.textContent = t("notify_syncing");
  else if (permission === "granted") el.notifyStatus.textContent = t("notify_background_unavailable");
  else el.notifyStatus.textContent = t("notify_inapp");
}

let selectedPriceAlertAsset = null;

function priceAlertForm() {
  return {
    search: el.homePriceAlertSearch,
    dropdown: el.homePriceAlertDd,
    condition: el.homePriceAlertCondition,
    target: el.homePriceAlertTarget,
    add: el.homeAddPriceAlert,
    list: el.homePriceAlertList,
  };
}

function priceAlertSelectionText(asset) {
  return `${asset.name}${asset.sym ? " · " + String(asset.sym).toUpperCase() : ""}`;
}

function syncPriceAlertSelectionUi() {
  const form = priceAlertForm();
  if (!form.search) return;
  const ready = !!selectedPriceAlertAsset;
  form.target.disabled = !ready;
  form.condition.disabled = !ready;
  form.add.disabled = !ready;
}

function renderPriceAlertList(container) {
  if (!container) return;
  const alerts = state.notifications.priceAlerts;
  if (!alerts.length) {
    container.innerHTML = `<p class="settings-note">${escapeHtml(t("alert_empty"))}</p>`;
    return;
  }
  container.innerHTML = alerts.map((a) => {
    const condition = commandAlertConditionLabel(a);
    const target = a.percentage != null ? `${a.percentage}%` : formatAlertPrice(a.target, a.ccy);
    return `<div class="alert-row"><div><strong>${escapeHtml(a.name || a.key)}</strong><span>${escapeHtml(condition)} · ${escapeHtml(target)}</span></div><button type="button" data-alert-del="${escapeHtml(a.id)}" aria-label="${escapeHtml(t("alert_remove"))}">×</button></div>`;
  }).join("");
  container.querySelectorAll("[data-alert-del]").forEach((button) => button.addEventListener("click", () => {
    state.notifications.priceAlerts = state.notifications.priceAlerts.filter((a) => a.id !== button.dataset.alertDel);
    saveState();
    sfx("remove");
    renderNotificationSettings();
  }));
}

function renderNotificationSettings() {
  renderNotificationStatus();
  if (el.vehicleNotifyDays) el.vehicleNotifyDays.value = String(state.notifications.vehicleDays);
  const form = priceAlertForm();
  if (form.search) {
    form.search.placeholder = t("alert_search_ph");
    syncPriceAlertSelectionUi();
    renderPriceAlertList(form.list);
  }

  if (el.backupStatus) {
    let last = "";
    try { last = localStorage.getItem("numbr_last_backup") || ""; } catch (e) {}
    el.backupStatus.textContent = last ? t("backup_last", { date: new Date(last).toLocaleString(state.lang === "tr" ? "tr-TR" : "en-US") }) : "";
  }
}

async function setNotificationsEnabled(enabled) {
  if (!enabled) {
    state.notifications.enabled = false;
  } else if (!("Notification" in window)) {
    state.notifications.enabled = true;
  } else if (Notification.permission === "denied") {
    state.notifications.enabled = false;
  } else {
    let permission = Notification.permission;
    if (permission === "default") {
      try { permission = await Notification.requestPermission(); } catch (e) { permission = "default"; }
    }
    state.notifications.enabled = permission !== "denied";
  }
  saveState(); renderNotificationSettings();
  if (state.notifications.enabled) {
    runNotificationChecks();
    await registerPwa();
    await syncPushSubscription(true);
  } else await removePushSubscription();
  renderNotificationSettings();
}

function deliverUserAlert(id, title, body, daily = false) {
  if (!state.notifications.enabled) return false;
  const today = localDateKey();
  if (daily && state.notifications.sent[id] === today) return false;
  sfx("alert");
  showAppToast(`${title}: ${body}`);
  if (notificationPermission() === "granted") {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => registration.showNotification(title, { body, tag: "numbrrr-" + id, icon: "/icons/icon-192.png", badge: "/icons/badge-96.png", data: { url: "/" } })).catch(() => {});
    } else try { new Notification(title, { body, tag: "numbrrr-" + id }); } catch (e) {}
  }
  if (daily) state.notifications.sent[id] = today;
  return true;
}

function addPriceAlert() {
  const form = priceAlertForm();
  const target = parseDecimal(form.target.value);
  const w = selectedPriceAlertAsset;
  if (!w || !(target > 0)) { showAppToast(t("alert_invalid")); return; }
  state.notifications.priceAlerts.push({
    id: "pa" + ++state.notifications.seq, type: w.type, key: w.key, name: w.name, sym: w.sym || "",
    condition: form.condition.value === "below" ? "below" : "above",
    target, ccy: watchDisplayCcy(w), triggered: false,
  });
  selectedPriceAlertAsset = null;
  form.search.value = "";
  form.target.value = "";
  saveState();
  renderNotificationSettings();
  refreshWatchData();
  sfx("success");
  showAppToast(t("alert_added"));
}

function checkPriceAlerts() {
  if (!state.notifications.enabled) return;
  let changed = false;
  state.notifications.priceAlerts.forEach((a) => {
    const w = state.watchlist.find((x) => x.type === a.type && x.key === a.key) || { type: a.type, key: a.key, name: a.name, sym: a.sym || "" };
    const value = watchValueInCurrency(w, a.ccy);
    if (!Number.isFinite(value)) return;
    const change = a.referencePrice > 0 ? ((value / a.referencePrice) - 1) * 100 : 0;
    const hit = a.condition === "percent_down" ? change <= -(a.percentage || 0)
      : a.condition === "percent_up" ? change >= (a.percentage || 0)
      : a.condition === "below" ? value <= a.target : value >= a.target;
    if (hit && !a.triggered) {
      const condition = commandAlertConditionLabel(a).toLowerCase();
      deliverUserAlert("price-" + a.id, t("price_alert_title"), t("price_alert_body", {
        name: w.name, price: formatAlertPrice(value, a.ccy), condition, target: a.percentage != null ? `${a.percentage}%` : formatAlertPrice(a.target, a.ccy),
      }));
      a.triggered = true; changed = true;
    } else if (!hit && a.triggered) { a.triggered = false; changed = true; }
  });
  if (changed) saveState();
}

function checkVehicleNotifications() {
  if (!state.notifications.enabled) return;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  let changed = false;
  state.vehicles.forEach((v) => (v.sched || []).forEach((s) => {
    if (!s.date || s.paidMonth) return;
    const due = new Date(s.date + "T00:00:00");
    if (isNaN(due)) return;
    const days = Math.round((due - now) / 86400000);
    if (days > state.notifications.vehicleDays) return;
    const when = days < 0 ? t("vehicle_overdue_days", { days: Math.abs(days) }) : days === 0 ? t("vehicle_due_today") : t("vehicle_due_days", { days });
    const id = "vehicle-" + v.id + "-" + s.id;
    if (deliverUserAlert(id, t("vehicle_alert_title"), t("vehicle_alert_body", {
      vehicle: v.plate || t("veh_model_ph"), label: s.label || t("veh_reminders"), when,
    }), true)) changed = true;
  }));
  if (changed) saveState();
}

function runNotificationChecks() {
  checkVehicleNotifications();
  checkPriceAlerts();
}
// Map a watchlist item to a TradingView symbol and open its chart in a new tab.
function tradingViewSymbol(w) {
  const sym = (w.sym || w.key || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (w.type === "gold" || w.type === "goldoz") return "TVC:GOLD";
  if (w.type === "silver") return "TVC:SILVER";
  if (w.type === "index") return "TVC:" + sym; // TVC:SPX / TVC:NDX / TVC:DJI
  if (w.type === "crypto") return "CRYPTO:" + sym + "USD"; // TradingView's aggregated index — far broader than a single exchange's USDT pairs
  if (w.type === "bist") return "BIST:" + sym;
  return sym; // US stocks: TradingView resolves the bare ticker
}
// Open the chart inside the app as a popup with an embedded TradingView widget,
// instead of leaving the site for a new tab.
function openTradingView(w) {
  const s = tradingViewSymbol(w);
  if (!s) return;
  const modal = document.getElementById("tvModal");
  const frame = document.getElementById("tvFrame");
  const fullUrl = "https://www.tradingview.com/chart/?symbol=" + encodeURIComponent(s);
  // The free embedded widget has no Borsa İstanbul data (it errors out and falls
  // back to a default chart), so BIST symbols open on TradingView in a new tab.
  if (!modal || !frame || w.type === "bist") {
    window.open(fullUrl, "_blank", "noopener,noreferrer");
    return;
  }
  const dark = !["xp", "doge", "medieval"].includes(state.theme);
  const locale = state.lang === "tr" ? "tr" : "en";
  frame.src = "https://s.tradingview.com/widgetembed/?frameElementId=tvFrame&symbol=" +
    encodeURIComponent(s) + "&interval=D&hidesidetoolbar=0&symboledit=0&saveimage=0&toolbarbg=rgba(0,0,0,0)" +
    "&studies=[]&theme=" + (dark ? "dark" : "light") + "&style=1&timezone=Etc/UTC&withdateranges=1&hideideas=1&locale=" + locale;
  const title = document.getElementById("tvTitle");
  const sym = w.sym ? String(w.sym).toUpperCase() : "";
  if (title) title.textContent = [w.name, sym].filter(Boolean).join(" · ");
  const openLink = document.getElementById("tvOpen");
  if (openLink) openLink.href = fullUrl;
  modal.hidden = false;
}
function closeChartModal() {
  const modal = document.getElementById("tvModal");
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  const frame = document.getElementById("tvFrame");
  if (frame) frame.src = "about:blank"; // stop the embedded chart when closed
}

// ============================================================
//  Smart command bar
// ============================================================
let smartCommandDraft = null;
let smartCommandRequest = 0;

function commandAssetCatalog() {
  const items = [];
  const seen = new Set();
  const add = (item) => {
    if (!item || !item.key || !item.sym) return;
    const id = `${item.type}|${item.key}`;
    if (seen.has(id)) return;
    seen.add(id); items.push(item);
  };
  // watchSearchPool is built from the live crypto list and the app's supported
  // stock/metals lists; parser itself remains unaware of any of these assets.
  watchSearchPool().forEach((item) => add({ ...item, aliases: [item.sym, item.name] }));
  state.watchlist.forEach((item) => add({ ...item, aliases: [item.sym, item.name] }));
  state.portfolio.holdings.forEach((holding) => {
    if (holding.assetType === "crypto" && holding.coinId) add({ type: "crypto", key: holding.coinId, sym: holding.coinSymbol || holding.label, name: holding.coinName || holding.label, aliases: [holding.coinSymbol, holding.coinName] });
    if (holding.assetType === "usstock" && holding.symbol) add({ type: "usstock", key: holding.symbol, sym: holding.symbol, name: holding.stockName || holding.symbol, aliases: [holding.symbol, holding.stockName] });
    if (holding.assetType === "bist" && holding.symbol) add({ type: "bist", key: holding.symbol, sym: holding.symbol, name: holding.stockName || holding.symbol, aliases: [holding.symbol, holding.stockName] });
  });
  // Fiat balances are app-supported assets too, and are useful for commands
  // such as "USD 50 olunca bildir" even before a market search is performed.
  add({ type: "fiat", key: "usd", sym: "USD", name: "US Dollar", aliases: ["usd", "dolar"] });
  add({ type: "fiat", key: "try", sym: "TRY", name: "Türk Lirası", aliases: ["try", "tl", "lira"] });
  return items;
}

function commandCurrencyKey(currency) {
  if (currency === "TRY" || currency === "TL") return "TL";
  if (currency === "USD") return "USD";
  return currency || (state.currency === "TL" ? "TL" : "USD");
}

function convertCommandCurrency(value, from, to) {
  if (!Number.isFinite(value)) return null;
  const source = commandCurrencyKey(from), target = commandCurrencyKey(to);
  if (source === target) return value;
  if (source === "USD" && target === "TL") return usdTry > 0 ? value * usdTry : null;
  if (source === "TL" && target === "USD") return usdTry > 0 ? value / usdTry : null;
  return null;
}

function commandMoney(value, currency) {
  if (!Number.isFinite(value)) return "—";
  const key = commandCurrencyKey(currency);
  if (key === "USD" || key === "TL") {
    const meta = CURRENCY_META[key];
    return new Intl.NumberFormat(meta.locale, { style: "currency", currency: meta.code, maximumFractionDigits: Math.abs(value) < 10 ? 4 : 2 }).format(value);
  }
  return `${value.toLocaleString(state.lang === "tr" ? "tr-TR" : "en-US", { maximumFractionDigits: 2 })} ${key}`;
}

function commandQuantity(value) {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(state.lang === "tr" ? "tr-TR" : "en-US", { maximumFractionDigits: 8 });
}

function commandAssetFromParsed(parsed) {
  if (!parsed) return null;
  const catalog = commandAssetCatalog();
  return catalog.find((item) => item.key === parsed.assetKey) || catalog.find((item) => String(item.sym).toUpperCase() === parsed.asset);
}

async function commandQuote(asset) {
  if (!asset) return null;
  if (asset.type === "crypto") {
    if (!cryptoMarkets.some((item) => item.id === asset.key)) await loadCryptoMarkets();
    const coin = cryptoMarkets.find((item) => item.id === asset.key || item.symbol === asset.sym);
    if (coin && Number.isFinite(coin.price)) return { appPrice: coin.price, nativePrice: coin.price, nativeCurrency: state.currency === "TL" ? "TRY" : "USD", asset };
    const holding = state.portfolio.holdings.find((item) => item.coinId === asset.key || item.coinSymbol === asset.sym);
    if (holding && Number.isFinite(holding.price) && holding.price > 0) return { appPrice: holding.price, nativePrice: holding.price, nativeCurrency: state.currency === "TL" ? "TRY" : "USD", asset };
  }
  if (asset.type === "gold" || asset.type === "goldoz") {
    if (!(goldPriceGram > 0)) await loadGoldPrice();
    if (goldPriceGram > 0) {
      const grams = asset.type === "goldoz" ? GRAMS_PER_OZ : 1;
      return { appPrice: goldPriceGram * grams, nativePrice: goldPriceGram * grams, nativeCurrency: state.currency === "TL" ? "TRY" : "USD", asset };
    }
  }
  if (asset.type === "fiat") {
    if (asset.key === "usd") { if (!(usdTry > 0)) await loadUsdTry(); return { appPrice: state.currency === "TL" ? usdTry : 1, nativePrice: 1, nativeCurrency: "USD", asset }; }
    if (asset.key === "try") { if (!(usdTry > 0)) await loadUsdTry(); return { appPrice: state.currency === "TL" ? 1 : (usdTry > 0 ? 1 / usdTry : 0), nativePrice: 1, nativeCurrency: "TRY", asset }; }
  }
  if (asset.type === "usstock" || asset.type === "bist") {
    const nativeCurrency = asset.type === "bist" ? "TRY" : "USD";
    const quote = await getStockPrice(asset.type === "bist" ? asset.key + ".IS" : asset.key);
    if (quote && Number.isFinite(quote.price)) {
      if (!(usdTry > 0) && nativeCurrency !== (state.currency === "TL" ? "TRY" : "USD")) await loadUsdTry();
      const appPrice = convertCommandCurrency(quote.price, nativeCurrency, state.currency === "TL" ? "TRY" : "USD");
      if (appPrice != null) return { appPrice, nativePrice: quote.price, nativeCurrency, chg24: quote.chg24, asset };
    }
  }
  const watched = watchData[asset.key];
  if (watched && Number.isFinite(watched.price)) return { appPrice: watched.price, nativePrice: watched.price, nativeCurrency: state.currency === "TL" ? "TRY" : "USD", asset };
  return null;
}

function commandPriceInCurrency(quote, currency) {
  if (!quote) return null;
  return convertCommandCurrency(quote.nativePrice, quote.nativeCurrency, commandCurrencyKey(currency));
}

function commandOccurredAt(date) {
  return date ? `${date}T12:00:00` : new Date().toISOString();
}

function commandHoldingForAsset(asset) {
  if (!asset) return null;
  return state.portfolio.holdings.find((holding) => {
    if (asset.type === "crypto") return holding.assetType === "crypto" && (holding.coinId === asset.key || holding.coinSymbol === asset.sym);
    if (asset.type === "usstock" || asset.type === "bist") return holding.assetType === asset.type && holding.symbol === asset.key;
    if (asset.type === "gold" || asset.type === "goldoz") return holding.assetType === "gold";
    if (asset.type === "fiat") return holding.assetType === "usd" && asset.key === "usd";
    return false;
  }) || null;
}

function commandTradeQuantity(holding) {
  if (!holding) return 0;
  if (holding.assetType === "crypto") return holding.qty || 0;
  if (holding.assetType === "usstock" || holding.assetType === "bist") return holding.shares || 0;
  if (holding.assetType === "gold") return holding.grams || 0;
  if (holding.assetType === "usd") return holding.usd || 0;
  return 0;
}

function commandAssetLabel(asset) { return asset ? `${asset.name} · ${String(asset.sym || asset.key).toUpperCase()}` : "—"; }

function commandTransactionCost(assetKey, { monthOnly = false } = {}) {
  const month = currentYM();
  const txs = (state.portfolio.transactions || []).filter((tx) => tx.assetKey === assetKey || tx.targetAssetKey === assetKey);
  const position = { quantity: 0, cost: 0, realized: 0 };
  txs.slice().sort((a, b) => String(a.occurredAt).localeCompare(String(b.occurredAt))).forEach((tx) => {
    const relevantMonth = !monthOnly || String(tx.occurredAt || "").slice(0, 7) === month;
    if (tx.type === "BUY" && tx.assetKey === assetKey) {
      position.quantity += tx.amount || 0;
      position.cost += tx.totalApp || 0;
    } else if (tx.type === "SELL" && tx.assetKey === assetKey) {
      const sold = Math.min(position.quantity, tx.amount || 0);
      const average = position.quantity > 0 ? position.cost / position.quantity : 0;
      if (relevantMonth) position.realized += (tx.totalApp || 0) - sold * average;
      position.quantity = Math.max(0, position.quantity - sold);
      position.cost = Math.max(0, position.cost - sold * average);
    } else if (tx.type === "SWAP" && Array.isArray(tx.legs)) {
      const leg = tx.legs.find((item) => item.assetKey === assetKey);
      if (!leg) return;
      if (leg.direction === "in") { position.quantity += leg.amount || 0; position.cost += leg.totalApp || 0; }
      else {
        const sold = Math.min(position.quantity, leg.amount || 0);
        const average = position.quantity > 0 ? position.cost / position.quantity : 0;
        if (relevantMonth) position.realized += (leg.totalApp || 0) - sold * average;
        position.quantity = Math.max(0, position.quantity - sold);
        position.cost = Math.max(0, position.cost - sold * average);
      }
    }
  });
  return position;
}

function commandQueryResult(parsed, asset) {
  const holdings = state.portfolio.holdings.filter((holding) => (holding.value || 0) > 0 || commandTradeQuantity(holding) > 0);
  const total = holdings.reduce((sum, holding) => sum + Math.max(0, holding.value || 0), 0);
  if (parsed.query === "AVERAGE_COST") {
    const target = commandHoldingForAsset(asset);
    if (!target) return { title: t("command_average_cost"), body: t("command_no_holding") };
    const cost = commandTransactionCost(asset.key);
    const average = cost.quantity > 0 ? cost.cost / cost.quantity : target.avgCostApp;
    return { title: t("command_average_cost"), body: average > 0 ? `${commandMoney(average, state.currency)} · ${commandQuantity(cost.quantity || commandTradeQuantity(target))} ${asset.sym}` : t("command_no_data") };
  }
  if (parsed.query === "ALLOCATION") {
    const value = holdings.filter((holding) => commandHoldingForAsset(asset) === holding || (asset && ((asset.type === "crypto" && holding.coinId === asset.key) || ((asset.type === "usstock" || asset.type === "bist") && holding.symbol === asset.key)))).reduce((sum, holding) => sum + (holding.value || 0), 0);
    return { title: t("command_allocation"), body: total > 0 ? `${Math.round((value / total) * 1000) / 10}% · ${commandMoney(value, state.currency)}` : t("command_no_data") };
  }
  if (parsed.query === "TOP_PERFORMER") {
    const ranked = holdings.map((holding) => ({ holding, gain: (holding.value || 0) - (holding.costBasisApp || 0) })).sort((a, b) => b.gain - a.gain);
    const winner = ranked[0];
    return winner ? { title: t("command_top_performer"), body: `${winner.holding.label || winner.holding.coinSymbol || winner.holding.symbol || t("holding_ph")} · ${commandMoney(winner.gain, state.currency)}` } : { title: t("command_top_performer"), body: t("command_no_data") };
  }
  if (parsed.query === "PNL") {
    const relevant = asset ? commandTransactionCost(asset.key, { monthOnly: true }).realized : [...new Set((state.portfolio.transactions || []).flatMap((tx) => [tx.assetKey, tx.targetAssetKey].filter(Boolean)))].reduce((sum, key) => sum + commandTransactionCost(key, { monthOnly: true }).realized, 0);
    const unrealized = holdings.reduce((sum, holding) => sum + ((holding.value || 0) - (holding.costBasisApp || 0)), 0);
    return { title: t("command_pnl"), body: `${t("command_realized")}: ${commandMoney(relevant, state.currency)} · ${t("command_unrealized")}: ${commandMoney(unrealized, state.currency)}` };
  }
  return { title: t("command_query"), body: total > 0 ? commandMoney(total, state.currency) : t("command_no_data") };
}

function commandAppQueryResult(parsed) {
  if (parsed.query === "EXPENSES") {
    const tracked = expensesTotal();
    const monthly = monthlyBurn();
    return { title: t("command_expenses"), body: `${formatMoney(tracked)} · ${t("command_monthly_expenses")}: ${formatMoney(monthly)}` };
  }
  if (parsed.query === "INCOME") {
    const manual = incomeManualTotal();
    const generated = portfolioYield();
    const total = manual + generated.interest + generated.rental;
    return { title: t("command_income"), body: total > 0 ? formatMoney(total) : t("command_no_data") };
  }
  const balance = state.portfolio.holdings.reduce((sum, holding) => sum + Math.max(0, holding.value || 0), 0);
  return { title: t("command_balance"), body: balance > 0 ? formatMoney(balance) : t("command_no_data") };
}

function commandAppActionTitle(intent) {
  return {
    SET_MONTHLY_EXPENSES: t("command_monthly_expenses"),
    ADD_EXPENSE: t("command_expenses"),
    ADD_INCOME: t("command_income"),
    ADD_NOTE: t("command_note"),
    ADD_GOAL: t("goal_title"),
    ADD_COUNTDOWN: t("countdown_title"),
  }[intent] || t("command_app");
}

function commandNavigationLabel(page) {
  return ({ home: t("command_nav"), portfolio: t("nav_portfolio"), income: t("nav_income"), savings: t("expenses_page_title"), car: t("nav_car"), watch: t("nav_watchlist"), settings: t("settings_title") })[page] || page;
}

async function prepareSmartCommand(parsed) {
  const asset = commandAssetFromParsed(parsed);
  if (["BUY", "SELL", "SWAP", "ADD_BALANCE", "REMOVE_BALANCE", "CREATE_ALERT", "OPEN_ASSET", "ADD_FAVORITE", "REMOVE_FAVORITE"].includes(parsed.intent) && !asset) throw new Error(t("command_no_asset"));
  if (parsed.intent === "CHANGE_BASE_CURRENCY") return { parsed, asset, kind: "currency", title: t("command_currency"), result: parsed.baseCurrency === "TRY" ? "TL" : parsed.baseCurrency };
  if (parsed.intent === "PORTFOLIO_QUERY") return { parsed, asset, kind: "query", title: t("command_query"), result: commandQueryResult(parsed, asset) };
  if (parsed.intent === "APP_QUERY") return { parsed, asset, kind: "query", title: t("command_app"), result: commandAppQueryResult(parsed) };
  if (parsed.intent === "NAVIGATE") return { parsed, asset, kind: "navigate", title: t("command_navigation"), page: parsed.page };
  if (["SET_MONTHLY_EXPENSES", "ADD_EXPENSE", "ADD_INCOME", "ADD_NOTE", "ADD_GOAL", "ADD_COUNTDOWN"].includes(parsed.intent)) {
    return { parsed, asset, kind: "app-action", title: commandAppActionTitle(parsed.intent), amount: parsed.amount, label: parsed.label, date: parsed.date };
  }
  if (parsed.intent === "OPEN_ASSET" || parsed.intent === "ADD_FAVORITE" || parsed.intent === "REMOVE_FAVORITE") return { parsed, asset, kind: "simple", title: parsed.intent === "OPEN_ASSET" ? t("command_open") : t("command_favorite") };

  const quote = await commandQuote(asset);
  if (!quote) throw new Error(t("command_needs_price"));
  const appCurrency = state.currency === "TL" ? "TRY" : "USD";
  const tradeCurrency = parsed.currency || appCurrency;
  if (tradeCurrency !== quote.nativeCurrency && !(usdTry > 0)) await loadUsdTry();
  const livePrice = commandPriceInCurrency(quote, tradeCurrency);
  if (!(livePrice > 0)) throw new Error(t("command_needs_price"));
  if (parsed.intent === "CREATE_ALERT") return {
    parsed, asset, kind: "alert", quote, title: t("command_alert"), alertCurrency: tradeCurrency,
    alertPrice: parsed.price, referencePrice: quote.appPrice, referenceCurrency: appCurrency,
  };
  if (parsed.intent === "SWAP") {
    const target = commandAssetCatalog().find((item) => item.key === parsed.targetAssetKey) || commandAssetCatalog().find((item) => String(item.sym).toUpperCase() === parsed.targetAsset);
    if (!target) throw new Error(t("command_no_asset"));
    const targetQuote = await commandQuote(target);
    if (!targetQuote) throw new Error(t("command_needs_price"));
    const amount = parsed.amount;
    if (!(amount > 0)) throw new Error(t("command_no_action"));
    const sourceAppPrice = quote.appPrice, targetAppPrice = targetQuote.appPrice;
    const targetAmount = amount * sourceAppPrice / targetAppPrice;
    return { parsed, asset, target, quote, targetQuote, kind: "trade", title: t("command_swap"), amount, quantity: amount, targetAmount, tradePrice: sourceAppPrice, tradeCurrency: appCurrency, total: amount * sourceAppPrice, totalApp: amount * sourceAppPrice, occurredAt: commandOccurredAt(parsed.date) };
  }
  const tradePrice = parsed.price != null ? parsed.price : livePrice;
  const quantity = parsed.amount != null ? parsed.amount : (parsed.fiatAmount != null ? parsed.fiatAmount / tradePrice : 0);
  if (!(quantity > 0) || !(tradePrice > 0)) throw new Error(t("command_no_action"));
  const priceApp = convertCommandCurrency(tradePrice, tradeCurrency, appCurrency);
  if (!(priceApp > 0)) throw new Error(t("command_needs_price"));
  return { parsed, asset, quote, kind: "trade", title: ["BUY", "ADD_BALANCE"].includes(parsed.intent) ? t("command_buy") : t("command_sell"), quantity, amount: quantity, tradePrice, tradeCurrency, priceApp, currentPriceApp: quote.appPrice, total: quantity * tradePrice, totalApp: quantity * priceApp, occurredAt: commandOccurredAt(parsed.date) };
}

function commandIntentTitle(draft) {
  if (!draft) return "";
  if (draft.kind === "trade") return draft.title;
  if (draft.kind === "alert") return draft.title;
  return draft.title;
}

function renderSmartCommandPreview(draft) {
  if (!el.smartCommandPreview || !draft) return;
  const p = draft.parsed, assetName = commandAssetLabel(draft.asset);
  const rows = [];
  if (draft.asset) rows.push([t("command_asset"), assetName]);
  if (draft.kind === "trade") {
    rows.push([t("command_quantity"), `${commandQuantity(draft.quantity)} ${draft.asset.sym}`]);
    rows.push([t("command_price"), commandMoney(draft.tradePrice, draft.tradeCurrency)]);
    rows.push([t("command_total"), commandMoney(draft.total, draft.tradeCurrency)]);
    if (draft.parsed.date) rows.push([t("command_date"), draft.parsed.date]);
    if (draft.target) rows.push([t("command_asset"), `${t("command_asset")} → ${commandAssetLabel(draft.target)} · ${commandQuantity(draft.targetAmount)} ${draft.target.sym}`]);
  } else if (draft.kind === "alert") {
    rows.push([t("command_condition"), draft.parsed.percentage != null ? `${draft.parsed.percentage}${draft.parsed.condition === "PERCENT_DOWN" ? t("command_percent_down") : t("command_percent_up")}` : `${commandMoney(draft.alertPrice, draft.alertCurrency)} ${draft.parsed.condition === "BELOW" ? t("command_below") : t("command_above")}`]);
    if (draft.parsed.percentage == null) rows.push([t("command_price"), commandMoney(draft.alertPrice, draft.alertCurrency)]);
    else rows.push([t("command_current_price"), commandMoney(draft.referencePrice, draft.referenceCurrency)]);
  } else if (draft.kind === "currency") rows.push([t("currency"), draft.result]);
  else if (draft.kind === "query") rows.push([draft.result.title, draft.result.body]);
  else if (draft.kind === "navigate") rows.push([t("command_destination"), commandNavigationLabel(draft.page)]);
  else if (draft.kind === "app-action") {
    if (p.intent === "SET_MONTHLY_EXPENSES") rows.push([t("command_monthly_expenses"), formatMoney(draft.amount)]);
    if (p.intent === "ADD_EXPENSE") { rows.push([t("command_label"), draft.label]); rows.push([t("command_total"), formatMoney(draft.amount)]); }
    if (p.intent === "ADD_INCOME") { rows.push([t("command_label"), draft.label]); rows.push([t("command_total"), formatMoney(draft.amount)]); }
    if (p.intent === "ADD_NOTE") rows.push([t("command_note"), draft.label]);
    if (p.intent === "ADD_GOAL") { rows.push([t("command_label"), draft.label]); rows.push([t("command_target"), formatMoney(draft.amount)]); }
    if (p.intent === "ADD_COUNTDOWN") { rows.push([t("command_label"), draft.label]); rows.push([t("command_date"), draft.date]); }
  }
  const detailHtml = rows.map(([label, value]) => `<div class="smart-command-detail"><dt>${escapeHtml(label)}</dt><dd title="${escapeHtml(value)}">${escapeHtml(value)}</dd></div>`).join("");
  el.smartCommandPreview.innerHTML = `<div class="smart-command-preview-head"><div><div class="smart-command-preview-kicker">${escapeHtml(t("command_detected"))}</div><div class="smart-command-preview-title">${escapeHtml(commandIntentTitle(draft))}</div></div><span class="smart-command-confidence">${Math.round(p.confidence * 100)}%</span></div><dl class="smart-command-details">${detailHtml}</dl><div class="smart-command-actions"><button type="button" class="is-primary" data-command-confirm>${escapeHtml(draft.kind === "query" || draft.kind === "simple" ? t("command_confirm") : t("command_confirm"))}</button><button type="button" data-command-edit>${escapeHtml(t("command_edit"))}</button><button type="button" data-command-cancel>${escapeHtml(t("command_cancel"))}</button></div>`;
  el.smartCommandPreview.hidden = false;
  el.smartCommandPreview.querySelector("[data-command-confirm]").addEventListener("click", executeSmartCommand);
  el.smartCommandPreview.querySelector("[data-command-edit]").addEventListener("click", () => { el.smartCommandInput.focus(); el.smartCommandInput.select(); });
  el.smartCommandPreview.querySelector("[data-command-cancel]").addEventListener("click", clearSmartCommand);
}

function renderSmartCommandMessage(message, isError = false) {
  if (!el.smartCommandStatus) return;
  el.smartCommandStatus.textContent = message || "";
  el.smartCommandStatus.classList.toggle("is-error", !!isError);
  el.smartCommandStatus.classList.toggle("is-success", !isError && !!message);
}

function setSmartCommandMode(mode) {
  const command = el.smartCommandForm?.closest(".smart-command");
  if (!command) return;
  const next = ["idle", "typing", "processing", "success"].includes(mode) ? mode : "idle";
  command.dataset.commandState = next;
  command.classList.toggle("is-typing", next === "typing");
  command.classList.toggle("is-processing", next === "processing");
  command.classList.toggle("is-success", next === "success");
  command.setAttribute("aria-busy", String(next === "processing"));
  commandOrbRuntime.entries.forEach((entry) => { entry.mode = next; });
  paintCommandOrb();
}

function renderSmartCommandSuggestions() {
  if (!el.smartCommandPreview) return;
  el.smartCommandPreview.innerHTML = `<div class="smart-command-preview-head"><div><div class="smart-command-preview-kicker">${escapeHtml(t("command_detected"))}</div><div class="smart-command-preview-title">${escapeHtml(t("command_no_action"))}</div></div></div><div class="smart-command-suggestions"><button type="button" data-command-suggest="buy">${escapeHtml(t("command_suggestion_buy"))}</button><button type="button" data-command-suggest="sell">${escapeHtml(t("command_suggestion_sell"))}</button><button type="button" data-command-suggest="cancel">${escapeHtml(t("command_suggestion_cancel"))}</button></div>`;
  el.smartCommandPreview.hidden = false;
  el.smartCommandPreview.querySelector('[data-command-suggest="buy"]').addEventListener("click", () => { el.smartCommandInput.value = `${el.smartCommandInput.value} aldım`; el.smartCommandForm.requestSubmit(); });
  el.smartCommandPreview.querySelector('[data-command-suggest="sell"]').addEventListener("click", () => { el.smartCommandInput.value = `${el.smartCommandInput.value} sattım`; el.smartCommandForm.requestSubmit(); });
  el.smartCommandPreview.querySelector('[data-command-suggest="cancel"]').addEventListener("click", clearSmartCommand);
}

function renderSmartCommandAmbiguity(parsed) {
  if (!el.smartCommandPreview) return;
  const choices = (parsed.ambiguity || []).slice(0, 6);
  el.smartCommandPreview.innerHTML = `<div class="smart-command-preview-head"><div><div class="smart-command-preview-kicker">${escapeHtml(t("command_detected"))}</div><div class="smart-command-preview-title">${escapeHtml(t("command_ambiguous"))}</div></div></div><div class="smart-command-suggestions">${choices.map((choice, index) => `<button type="button" data-command-ambiguity="${index}">${escapeHtml(choice.name)} · ${escapeHtml(String(choice.sym || "").toUpperCase())}</button>`).join("")}</div>`;
  el.smartCommandPreview.hidden = false;
  el.smartCommandPreview.querySelectorAll("[data-command-ambiguity]").forEach((button) => button.addEventListener("click", () => {
    const choice = choices[Number(button.dataset.commandAmbiguity)];
    if (!choice) return;
    const withoutSymbol = el.smartCommandInput.value.replace(new RegExp(String(parsed.asset).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "").trim();
    el.smartCommandInput.value = `${withoutSymbol} ${choice.name}`.trim();
    el.smartCommandForm.requestSubmit();
  }));
}

function commandHelpGroups() {
  if (state.lang === "tr") {
    return [
      { title: t("command_help_trade"), examples: [
        "100 SOL aldım", "XMR 100 adet aldım", "20 SOL 150 dolardan aldım", "500 USDC sattım",
        "20 SOL'u USDC'ye çevirdim", "100 USD bakiye ekle", "SOL 200 olunca haber ver", "BTC %10 düşerse bildir",
      ] },
      { title: t("command_help_portfolio"), examples: [
        "portföyümü göster", "ortalama SOL maliyetim ne", "bu ay ne kadar kazandım",
        "portföyümün yüzde kaçı BTC", "en çok kazandıran varlığımı göster",
      ] },
      { title: t("command_help_asset"), examples: [
        "SOL grafiğini aç", "ETH'i favorilere ekle", "ETH'i favorilerden çıkar",
      ] },
      { title: t("command_app"), examples: [
        "aylık giderim 50000", "gider ekle market 500", "gelir ekle maaş 50000",
        "not ekle bankayı ara", "hedef ekle araba 1000000", "geri sayım tatil 2026-12-20",
      ] },
      { title: t("command_help_queries"), examples: [
        "giderlerimi göster", "gelirimi göster", "bakiyemi göster",
      ] },
      { title: t("command_navigation"), examples: [
        "giderlere git", "gelir sayfasını aç", "portföyü aç", "aracımı aç", "takibi aç", "ayarları aç",
      ] },
      { title: t("command_help_settings"), examples: [
        "ana para birimini TL yap",
      ] },
    ];
  }
  return [
    { title: t("command_help_trade"), examples: [
      "Buy 100 SOL", "Buy 20 SOL at 150 dollars", "Sell 500 USDC",
      "Swap 20 SOL to USDC", "Add 100 USD balance", "Alert me when SOL reaches 200", "Alert me if BTC drops 10%",
    ] },
    { title: t("command_help_portfolio"), examples: [
      "Show my portfolio", "What is my average SOL cost", "How much did I earn this month",
      "What percentage of my portfolio is BTC", "Show my top performer",
    ] },
    { title: t("command_help_asset"), examples: [
      "Open SOL chart", "Add ETH to favorites", "Remove ETH from favorites",
    ] },
    { title: t("command_app"), examples: [
      "Set monthly expenses to 5000", "Add expense groceries 50", "Add income salary 5000",
      "Add note call the bank", "Create savings goal car 10000", "Countdown vacation 2026-12-20",
    ] },
    { title: t("command_help_queries"), examples: [
      "Show my expenses", "Show my income", "Show my balance",
    ] },
    { title: t("command_navigation"), examples: [
      "Open expenses", "Open income", "Open portfolio", "Open my car", "Open watchlist", "Open settings",
    ] },
    { title: t("command_help_settings"), examples: [
      "Set base currency to USD",
    ] },
  ];
}

function normalizeCommandSuggestionText(value) {
  return String(value || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u");
}

function commandSuggestionAsset(value) {
  const normalized = normalizeCommandSuggestionText(value);
  if (!normalized) return "";
  const candidates = commandAssetCatalog().flatMap((asset) => {
    const aliases = [asset.sym, asset.name, ...(asset.aliases || [])].filter(Boolean);
    return aliases.map((alias) => ({
      alias: normalizeCommandSuggestionText(alias),
      symbol: String(asset.sym || alias).toUpperCase(),
    }));
  }).filter((item) => item.alias.length >= 2).sort((a, b) => b.alias.length - a.alias.length);
  return candidates.find((item) => normalized.includes(item.alias))?.symbol || "";
}

function commandSuggestionTopicMatches(value, keywords) {
  const words = value.split(/\s+/).filter((word) => word.length >= 2);
  return keywords.some((keyword) => value.includes(keyword) || words.some((word) => keyword.startsWith(word)));
}

function smartCommandExampleItems(value = "") {
  const normalized = normalizeCommandSuggestionText(value.trim());
  const asset = commandSuggestionAsset(value) || "SOL";
  const isEnglish = state.lang === "en";
  const examples = isEnglish ? {
    default: ["Show my portfolio", "Show my expenses", "Show my balance"],
    income: ["Show my income", "Add income salary 5000", "How much did I earn this month"],
    expense: ["Show my expenses", "Add expense groceries 50", "Set monthly expenses to 5000"],
    portfolio: ["Show my portfolio", "Show my balance", "Show my top performer"],
    asset: [`Open ${asset} chart`, `Buy 100 ${asset}`, `Alert me when ${asset} reaches 200`],
    watch: ["Open watchlist", `Add ${asset} to favorites`, `Alert me when ${asset} reaches 200`],
    goal: ["Create savings goal car 10000", "Show my portfolio", "Show my balance"],
    note: ["Add note call the bank", "Show my expenses", "Open watchlist"],
    countdown: ["Countdown vacation 2026-12-20", "Open settings", "Show my portfolio"],
    car: ["Open my car", "Add expense fuel 50", "Show my expenses"],
    settings: ["Open settings", "Set base currency to USD", "Show my balance"],
  } : {
    default: ["Portföyümü göster", "Giderlerimi göster", "Bakiyemi göster"],
    income: ["Gelirimi göster", "Gelir ekle maaş 50000", "Bu ay ne kadar kazandım"],
    expense: ["Giderlerimi göster", "Gider ekle market 500", "Aylık giderim 50000"],
    portfolio: ["Portföyümü göster", "Bakiyemi göster", "En çok kazandıran varlığımı göster"],
    asset: [`${asset} grafiğini aç`, `100 ${asset} aldım`, `${asset} 200 olunca haber ver`],
    watch: ["Takibi aç", `${asset}'i favorilere ekle`, `${asset} 200 olunca haber ver`],
    goal: ["Hedef ekle araba 1000000", "Portföyümü göster", "Bakiyemi göster"],
    note: ["Not ekle bankayı ara", "Giderlerimi göster", "Takibi aç"],
    countdown: ["Geri sayım tatil 2026-12-20", "Ayarları aç", "Portföyümü göster"],
    car: ["Aracımı aç", "Gider ekle yakıt 1000", "Giderlerimi göster"],
    settings: ["Ayarları aç", "Ana para birimini TL yap", "Bakiyemi göster"],
  };
  if (!normalized) return examples.default;
  if (commandSuggestionTopicMatches(normalized, ["gelir", "maas", "kazanc", "earn", "income", "salary"])) return examples.income;
  if (commandSuggestionTopicMatches(normalized, ["gider", "harca", "odeme", "fatura", "masraf", "expense", "spend", "bill"])) return examples.expense;
  if (commandSuggestionTopicMatches(normalized, ["hedef", "birikim", "goal", "saving"])) return examples.goal;
  if (commandSuggestionTopicMatches(normalized, ["not", "note"])) return examples.note;
  if (commandSuggestionTopicMatches(normalized, ["geri say", "tarih", "countdown", "date"])) return examples.countdown;
  if (commandSuggestionTopicMatches(normalized, ["arac", "araba", "yakit", "car", "fuel"])) return examples.car;
  if (commandSuggestionTopicMatches(normalized, ["ayar", "tema", "para birimi", "setting", "theme", "currency"])) return examples.settings;
  if (commandSuggestionTopicMatches(normalized, ["takip", "favori", "alarm", "bildir", "haber", "watch", "favorite", "alert"])) return examples.watch;
  if (commandSuggestionTopicMatches(normalized, ["portfoy", "bakiye", "varlik", "perform", "portfolio", "balance", "holding"])) return examples.portfolio;
  if (commandSuggestionAsset(value) || commandSuggestionTopicMatches(normalized, ["kripto", "hisse", "altin", "dolar", "grafik", "sat", "coin", "stock", "gold", "chart", "buy", "sell"])) return examples.asset;
  return examples.default;
}

function renderSmartCommandExamples(value = "") {
  if (!el.smartCommandChips) return;
  const hasContext = !!String(value || "").trim();
  if (el.smartCommandExamplesTitle) {
    el.smartCommandExamplesTitle.textContent = t(hasContext ? "command_context_suggestions" : "command_examples_title");
  }
  el.smartCommandChips.innerHTML = smartCommandExampleItems(value).map((command) =>
    `<button type="button" class="smart-command-chip" data-command-example="${escapeHtml(command)}">${escapeHtml(command)}</button>`
  ).join("");
}

function renderSmartCommandHelp() {
  if (!el.smartCommandPreview) return;
  const groups = commandHelpGroups();
  el.smartCommandPreview.innerHTML = `<div class="smart-command-preview-head"><div><div class="smart-command-preview-kicker">${escapeHtml(t("command_detected"))}</div><div class="smart-command-preview-title">${escapeHtml(t("command_help_title"))}</div></div></div><p class="smart-command-help-intro">${escapeHtml(t("command_help_intro"))}</p><div class="smart-command-help">${groups.map((group) => `<section class="smart-command-help-group"><h3>${escapeHtml(group.title)}</h3><div class="smart-command-help-list">${group.examples.map((example) => `<button type="button" data-command-help-example="${escapeHtml(example)}">${escapeHtml(example)}</button>`).join("")}</div></section>`).join("")}</div>`;
  el.smartCommandPreview.hidden = false;
  el.smartCommandPreview.querySelectorAll("[data-command-help-example]").forEach((button) => button.addEventListener("click", () => {
    el.smartCommandInput.value = button.dataset.commandHelpExample || "";
    el.smartCommandInput.focus();
    parseSmartCommand();
  }));
}

function clearSmartCommand() {
  smartCommandDraft = null;
  smartCommandRequest += 1;
  if (el.smartCommandPreview) { el.smartCommandPreview.hidden = true; el.smartCommandPreview.innerHTML = ""; }
  renderSmartCommandMessage("");
  renderSmartCommandExamples(el.smartCommandInput?.value || "");
  setSmartCommandMode("idle");
}

async function parseSmartCommand() {
  const text = el.smartCommandInput && el.smartCommandInput.value.trim();
  if (!text) return;
  const request = ++smartCommandRequest;
  setSmartCommandMode("processing");
  el.smartCommandSend.disabled = true;
  renderSmartCommandMessage(t("command_understood"));
  let parsed = NumBrrrCommandParser.parseCommand(text, { assets: commandAssetCatalog() });
  // Crypto prices are loaded in the background. If a user types a command
  // before that finishes, give the live catalog one bounded chance to catch up.
  if (!parsed.asset && (parsed.intent !== "UNKNOWN" && parsed.intent !== "COMMAND_HELP" || (parsed.intent === "UNKNOWN" && /\d|%/.test(text)))) {
    await Promise.race([loadCryptoMarkets(), new Promise((resolve) => setTimeout(resolve, 4500))]);
    parsed = NumBrrrCommandParser.parseCommand(text, { assets: commandAssetCatalog() });
  }
  if (request !== smartCommandRequest) return;
  el.smartCommandSend.disabled = false;
  if (parsed.intent === "UNKNOWN" && parsed.asset && (parsed.amount != null || /\d/.test(parsed.originalText))) {
    smartCommandDraft = null;
    renderSmartCommandMessage(t("command_low_confidence"), true);
    renderSmartCommandSuggestions();
    setSmartCommandMode("idle");
    return;
  }
  if (parsed.ambiguity && parsed.ambiguity.length > 1) {
    smartCommandDraft = null;
    renderSmartCommandMessage(t("command_ambiguous"), true);
    renderSmartCommandAmbiguity(parsed);
    setSmartCommandMode("idle");
    return;
  }
  if (parsed.intent === "COMMAND_HELP") {
    smartCommandDraft = null;
    renderSmartCommandHelp();
    renderSmartCommandMessage(t("command_understood"));
    setSmartCommandMode("idle");
    return;
  }
  if (parsed.confidence < 0.7 || parsed.missing.length) {
    smartCommandDraft = null;
    renderSmartCommandMessage(parsed.missing.includes("asset") ? t("command_no_asset") : t("command_low_confidence"), true);
    if (parsed.asset && parsed.missing.includes("amount")) renderSmartCommandSuggestions();
    else if (el.smartCommandPreview) el.smartCommandPreview.hidden = true;
    setSmartCommandMode("idle");
    return;
  }
  try {
    smartCommandDraft = await prepareSmartCommand(parsed);
    if (request !== smartCommandRequest) return;
    renderSmartCommandPreview(smartCommandDraft);
    renderSmartCommandMessage(t("command_understood"));
    setSmartCommandMode("idle");
  } catch (error) {
    smartCommandDraft = null;
    renderSmartCommandMessage(error.message || t("command_low_confidence"), true);
    if (el.smartCommandPreview) el.smartCommandPreview.hidden = true;
    setSmartCommandMode("idle");
  } finally {
    if (request === smartCommandRequest) el.smartCommandSend.disabled = false;
  }
}

function commandHoldingUnits(asset, holding) {
  if (!holding) return 0;
  if (asset && asset.type === "goldoz") return (holding.grams || 0) / GRAMS_PER_OZ;
  return commandTradeQuantity(holding);
}

function createCommandHolding(asset) {
  const id = "h" + ++state.portfolio.seq;
  const holding = { id, label: asset.name || asset.sym, value: 0, assetType: asset.type === "fiat" ? "usd" : asset.type };
  if (asset.type === "crypto") { holding.coinId = asset.key; holding.coinName = asset.name; holding.coinSymbol = asset.sym; }
  if (asset.type === "usstock" || asset.type === "bist") { holding.symbol = asset.key; holding.stockName = asset.name; }
  state.portfolio.holdings.push(holding);
  return holding;
}

function updateCommandHolding(asset, holding, units, quote) {
  if (asset.type === "crypto") { holding.qty = units; holding.price = quote.appPrice; holding.value = units * quote.appPrice; holding.chg24 = quote.chg24; }
  else if (asset.type === "usstock" || asset.type === "bist") { holding.shares = units; holding.nativePrice = quote.nativePrice; holding.value = stockValue(holding); holding.chg24 = quote.chg24; }
  else if (asset.type === "gold" || asset.type === "goldoz") { holding.grams = asset.type === "goldoz" ? units * GRAMS_PER_OZ : units; holding.price = goldPriceGram || quote.appPrice; holding.value = units * quote.appPrice; holding.chg24 = goldChg24; }
  else if (asset.type === "fiat") { holding.usd = units; holding.value = usdHoldingValue(units); holding.chg24 = state.currency === "TL" ? usdTryChg24 : 0; }
  else { holding.value = units * quote.appPrice; }
  holding.label = holding.label || asset.name || asset.sym;
}

function updateCommandCostBasis(holding, direction, units, totalApp, oldUnits = commandTradeQuantity(holding)) {
  const previousUnits = Math.max(0, oldUnits);
  const oldCost = Math.max(0, holding.costBasisApp || 0);
  if (direction === "in") {
    holding.costBasisApp = oldCost + totalApp;
    holding.avgCostApp = (oldCost + totalApp) / Math.max(0.00000001, previousUnits + units);
  } else {
    const average = previousUnits > 0 ? oldCost / previousUnits : 0;
    holding.costBasisApp = Math.max(0, oldCost - average * units);
    holding.avgCostApp = previousUnits - units > 0 ? holding.costBasisApp / (previousUnits - units) : 0;
  }
}

function applyCommandHoldingDelta(asset, delta, quote, totalApp, direction) {
  let holding = commandHoldingForAsset(asset);
  if (!holding) {
    if (delta < 0) throw new Error(t("command_no_holding"));
    holding = createCommandHolding(asset);
  }
  const current = commandHoldingUnits(asset, holding);
  if (delta < 0 && current + delta < -0.00000001) throw new Error(t("command_insufficient"));
  const next = Math.max(0, current + delta);
  updateCommandHolding(asset, holding, next, quote);
  updateCommandCostBasis(holding, direction, Math.abs(delta), Math.abs(totalApp), current);
  return holding;
}

function recordCommandTransaction(transaction) {
  state.portfolio.transactions.push({
    id: "tx" + ++state.portfolio.txSeq,
    source: "manual-command",
    note: "",
    fee: { amount: 0, currency: transaction.quoteCurrency },
    appCurrency: state.currency === "TL" ? "TRY" : "USD",
    ...transaction,
  });
  if (state.portfolio.transactions.length > 1000) state.portfolio.transactions.splice(0, state.portfolio.transactions.length - 1000);
}

function commandAlertConditionLabel(alert) {
  if (alert.condition === "percent_up") return `${alert.percentage}${t("command_percent_up")}`;
  if (alert.condition === "percent_down") return `${alert.percentage}${t("command_percent_down")}`;
  return alert.condition === "below" ? t("alert_below") : t("alert_above");
}

function addSmartCommandAlert(draft) {
  const alertCurrency = draft.alertCurrency === "TRY" ? "TRY" : "USD";
  const currentReference = convertCommandCurrency(draft.referencePrice, draft.referenceCurrency, alertCurrency);
  state.notifications.priceAlerts.push({
    id: "pa" + ++state.notifications.seq,
    type: draft.asset.type, key: draft.asset.key, name: draft.asset.name, sym: draft.asset.sym || "",
    condition: draft.parsed.percentage != null ? (draft.parsed.condition === "PERCENT_DOWN" ? "percent_down" : "percent_up") : (draft.parsed.condition === "BELOW" ? "below" : "above"),
    target: draft.alertPrice || 0, percentage: draft.parsed.percentage, referencePrice: currentReference,
    ccy: alertCurrency, triggered: false,
  });
  saveState(); renderNotificationSettings(); refreshWatchData();
}

function navigateToCommandAsset(asset) {
  if (!asset) return;
  openTradingView({ type: asset.type, key: asset.key, sym: asset.sym, name: asset.name });
}

function finishSmartCommand(message) {
  smartCommandDraft = null;
  if (el.smartCommandPreview) { el.smartCommandPreview.hidden = true; el.smartCommandPreview.innerHTML = ""; }
  if (el.smartCommandInput) el.smartCommandInput.value = "";
  renderSmartCommandExamples("");
  renderSmartCommandMessage(message || t("command_applied"));
  setSmartCommandMode("success");
  clearTimeout(finishSmartCommand._modeTimer);
  finishSmartCommand._modeTimer = setTimeout(() => setSmartCommandMode("idle"), 1000);
}

function navigateToCommandPage(page) {
  const tab = document.querySelector(`.tab[data-view="${page || ""}"]`);
  if (tab) tab.click();
}

function applySmartCommandAppAction(draft) {
  const { parsed } = draft;
  if (parsed.intent === "SET_MONTHLY_EXPENSES") {
    if (!(draft.amount > 0)) throw new Error(t("command_invalid_amount"));
    state.monthlyExpenses = draft.amount;
    if (el.expenses) el.expenses.value = formatThousands(draft.amount);
    refresh();
    return t("command_applied");
  }
  if (parsed.intent === "ADD_EXPENSE") {
    rollExpenseMonth();
    state.expenses.oneoff.unshift({ id: "o" + ++state.expenses.oneSeq, day: new Date().getDate(), cat: draft.label.slice(0, 60), amount: draft.amount });
    buildExpenses();
    renderHomeSummaries();
    return t("command_expense_added");
  }
  if (parsed.intent === "ADD_INCOME") {
    const id = "inc" + ++state.income.seq;
    state.income.amounts[id] = draft.amount;
    state.income.passive[id] = false;
    state.income.custom.push({ id, label: draft.label.slice(0, 60) });
    buildIncome();
    refreshIncome();
    renderHomeSummaries();
    return t("command_income_added");
  }
  if (parsed.intent === "ADD_NOTE") {
    state.homeNotes.items.unshift({ id: "hn" + ++state.homeNotes.seq, text: draft.label.slice(0, 120), done: false });
    if (state.homeNotes.items.length > 50) state.homeNotes.items.length = 50;
    saveState(); renderHomeNotes(); renderSmartInsights();
    return t("command_note_added");
  }
  if (parsed.intent === "ADD_GOAL") {
    state.savingsGoals.items.unshift({ id: "sg" + ++state.savingsGoals.seq, name: draft.label.slice(0, 60), target: draft.amount, current: 0, currency: state.currency });
    saveState(); renderSavingsGoals(); renderSmartInsights();
    return t("command_goal_added");
  }
  if (parsed.intent === "ADD_COUNTDOWN") {
    const target = parseDateInput(draft.date);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (!target || target <= today) throw new Error(t("command_date_needed"));
    const id = "cd" + ++state.countdowns.seq;
    state.countdowns.items.push({ id, name: draft.label.slice(0, 80), category: "", date: draft.date, target: target.toISOString(), unit: "days" });
    state.countdowns.order = normalizeCountdownOrder([...state.countdowns.order, id], state.countdowns.items);
    saveState(); renderCountdowns(); renderSmartInsights();
    return t("command_countdown_added");
  }
  throw new Error(t("command_no_action"));
}

function executeSmartCommand() {
  const draft = smartCommandDraft;
  if (!draft) return;
  setSmartCommandMode("processing");
  try {
    if (draft.kind === "trade") {
      if (draft.parsed.intent === "SWAP") {
        const sourceUnits = commandHoldingUnits(draft.asset, commandHoldingForAsset(draft.asset));
        if (sourceUnits < draft.quantity) throw new Error(t("command_insufficient"));
        applyCommandHoldingDelta(draft.asset, -draft.quantity, draft.quote, draft.totalApp, "out");
        const targetTotalApp = draft.targetAmount * draft.targetQuote.appPrice;
        applyCommandHoldingDelta(draft.target, draft.targetAmount, draft.targetQuote, targetTotalApp, "in");
        recordCommandTransaction({
          type: "SWAP", assetKey: draft.asset.key, asset: draft.asset.sym, targetAssetKey: draft.target.key, targetAsset: draft.target.sym,
          amount: draft.quantity, price: draft.tradePrice, priceApp: draft.tradePrice, total: draft.total, totalApp: draft.totalApp,
          quoteCurrency: draft.tradeCurrency, occurredAt: draft.occurredAt,
          legs: [
            { assetKey: draft.asset.key, asset: draft.asset.sym, direction: "out", amount: draft.quantity, totalApp: draft.totalApp },
            { assetKey: draft.target.key, asset: draft.target.sym, direction: "in", amount: draft.targetAmount, totalApp: targetTotalApp },
          ],
        });
      } else {
        const direction = ["BUY", "ADD_BALANCE"].includes(draft.parsed.intent) ? "in" : "out";
        applyCommandHoldingDelta(draft.asset, direction === "in" ? draft.quantity : -draft.quantity, draft.quote, draft.totalApp, direction);
        recordCommandTransaction({
          type: direction === "in" ? "BUY" : "SELL", operation: draft.parsed.intent, assetKey: draft.asset.key, asset: draft.asset.sym, amount: draft.quantity,
          price: draft.tradePrice, priceApp: draft.priceApp, total: draft.total, totalApp: draft.totalApp,
          quoteCurrency: draft.tradeCurrency, occurredAt: draft.occurredAt,
        });
      }
      saveState(); buildPortfolio(); refreshPortfolio(); refreshIncome(); renderHomeSummaries();
      refreshCryptoPrices();
      sfx("success"); finishSmartCommand(t("command_applied"));
      return;
    }
    if (draft.kind === "alert") { addSmartCommandAlert(draft); sfx("success"); finishSmartCommand(t("alert_added")); return; }
    if (draft.kind === "currency") {
      if (draft.result === "EUR") throw new Error(t("command_eur_unsupported"));
      setCurrency(draft.result === "TL" ? "TL" : "USD");
      finishSmartCommand(t("command_applied"));
      return;
    }
    if (draft.kind === "navigate") {
      navigateToCommandPage(draft.page);
      finishSmartCommand(t("command_navigation_done"));
      return;
    }
    if (draft.kind === "app-action") {
      const message = applySmartCommandAppAction(draft);
      sfx("success"); finishSmartCommand(message);
      return;
    }
    if (draft.kind === "simple") {
      if (draft.parsed.intent === "OPEN_ASSET") navigateToCommandAsset(draft.asset);
      else if (draft.parsed.intent === "ADD_FAVORITE") addWatch(draft.asset);
      else if (draft.parsed.intent === "REMOVE_FAVORITE") removeWatch(draft.asset.type, draft.asset.key);
      finishSmartCommand(t("command_applied"));
      return;
    }
    if (draft.kind === "query") { renderSmartCommandMessage(`${draft.result.title}: ${draft.result.body}`); if (el.smartCommandPreview) el.smartCommandPreview.hidden = true; smartCommandDraft = null; return; }
  } catch (error) {
    renderSmartCommandMessage(error.message || t("command_low_confidence"), true);
    setSmartCommandMode("idle");
  }
}

const commandOrbRuntime = { entries: [], raf: 0, phase: 0, last: 0 };

function commandOrbMotionAllowed() {
  return state.motion && !document.hidden && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

function paintCommandOrb() {
  if (!commandOrbRuntime.entries.length) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  commandOrbRuntime.entries.forEach((entry) => {
    const { canvas, ctx, size } = entry;
    if (!canvas || !ctx) return;
    const pixelSize = Math.round(size * dpr);
    if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
      canvas.width = pixelSize;
      canvas.height = pixelSize;
      entry.dpr = dpr;
    }
    ctx.setTransform(entry.dpr, 0, 0, entry.dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    if (entry.style === "thinking") {
      paintThinkingOrb(entry);
      return;
    }
    const cx = size / 2, cy = size / 2, radius = size * .375;
    const pulse = 0.8 + Math.sin(commandOrbRuntime.phase * 1.7) * 0.12;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.35);
    glow.addColorStop(0, `rgba(130, 240, 255, ${0.28 * pulse})`);
    glow.addColorStop(.45, "rgba(73, 167, 255, .12)");
    glow.addColorStop(1, "rgba(123, 77, 255, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
    ctx.fill();

    const dots = size > 32 ? 84 : 64;
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < dots; i += 1) {
      const y = 1 - ((i + .5) / dots) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const angle = i * 2.399963 + commandOrbRuntime.phase;
      const x = Math.cos(angle) * ring;
      const z = Math.sin(angle) * ring;
      const depth = (z + 1) / 2;
      const dotRadius = size * (.0125 + depth * .0278);
      const alpha = .16 + depth * .78;
      const px = cx + x * radius;
      const py = cy + y * radius * .96;
      ctx.fillStyle = `hsla(${190 + depth * 55}, 98%, ${70 + depth * 18}%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  });
}

function paintThinkingOrb(entry) {
  const { ctx, size } = entry;
  const mode = entry.mode || "idle";
  const isTyping = mode === "typing";
  const isProcessing = mode === "processing";
  const isSuccess = mode === "success";
  const cx = size / 2, cy = size / 2, radius = size * .37;
  const pulse = (isProcessing ? 0.92 : isTyping ? 0.82 : 0.72) + Math.sin(commandOrbRuntime.phase * (isProcessing ? 2.2 : isTyping ? 1.7 : 1.35)) * (isProcessing ? 0.13 : 0.08);
  const hue = isSuccess ? 155 : isProcessing ? 192 : isTyping ? 205 : 0;
  const color = isSuccess ? [82, 230, 167] : isProcessing ? [112, 224, 255] : isTyping ? [149, 180, 255] : [180, 188, 198];
  const glow = ctx.createRadialGradient(cx, cy, radius * .08, cx, cy, radius * 1.18);
  glow.addColorStop(0, `hsla(${hue}, 92%, 84%, ${.1 * pulse})`);
  glow.addColorStop(.54, `rgba(${color.join(", ")}, .05)`);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.18, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "lighter";
  const meridians = 17;
  const steps = 26;
  for (let meridian = 0; meridian < meridians; meridian += 1) {
    const longitude = (meridian / meridians) * Math.PI * 2 + commandOrbRuntime.phase * .45;
    for (let step = 0; step < steps; step += 1) {
      const latitude = (step / (steps - 1)) * Math.PI;
      const sinLatitude = Math.sin(latitude);
      const x = sinLatitude * Math.cos(longitude);
      const y = Math.cos(latitude);
      const z = sinLatitude * Math.sin(longitude);
      const depth = (z + 1) / 2;
      const px = cx + x * radius;
      const py = cy + y * radius;
      const dotRadius = size * (.006 + depth * .012);
      const light = Math.round((isProcessing ? 145 : isTyping ? 130 : 120) + depth * 120);
      const alpha = (.07 + depth * .5) * pulse;
      ctx.fillStyle = isSuccess
        ? `rgba(82, 230, 167, ${alpha})`
        : `rgba(${isProcessing ? 100 : isTyping ? 135 : light}, ${isProcessing ? 220 : isTyping ? 175 : light}, ${isProcessing ? 255 : isTyping ? 255 : light}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const dust = 72;
  for (let i = 0; i < dust; i += 1) {
    const y = 1 - ((i + .5) / dust) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const angle = i * 2.399963 + commandOrbRuntime.phase * .82;
    const x = Math.cos(angle) * ring;
    const z = Math.sin(angle) * ring;
    const depth = (z + 1) / 2;
    const px = cx + x * radius;
    const py = cy + y * radius;
    const dotRadius = size * (.005 + depth * .012);
    const light = Math.round(145 + depth * 105);
    ctx.fillStyle = isSuccess
      ? `rgba(82, 230, 167, ${(0.08 + depth * .42) * pulse})`
      : `rgba(${isProcessing ? 100 : isTyping ? 135 : light}, ${isProcessing ? 220 : isTyping ? 175 : light}, ${isProcessing ? 255 : isTyping ? 255 : light}, ${(0.08 + depth * .42) * pulse})`;
    ctx.beginPath();
    ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

function stopCommandOrbMotion() {
  if (commandOrbRuntime.raf) cancelAnimationFrame(commandOrbRuntime.raf);
  commandOrbRuntime.raf = 0;
  commandOrbRuntime.last = 0;
  paintCommandOrb();
}

function syncCommandOrbMotion() {
  if (!commandOrbRuntime.entries.length) return;
  if (!commandOrbMotionAllowed()) {
    stopCommandOrbMotion();
    return;
  }
  if (commandOrbRuntime.raf) return;
  const tick = (now) => {
    if (!commandOrbMotionAllowed()) {
      stopCommandOrbMotion();
      return;
    }
    if (commandOrbRuntime.last) commandOrbRuntime.phase += Math.min(40, now - commandOrbRuntime.last) * .0018;
    commandOrbRuntime.last = now;
    paintCommandOrb();
    commandOrbRuntime.raf = requestAnimationFrame(tick);
  };
  commandOrbRuntime.raf = requestAnimationFrame(tick);
}

function initCommandOrb() {
  const canvases = [
    { canvas: el.commandOrbCanvas, size: 28, style: "color" },
    { canvas: el.smartCommandOrbCanvas, size: 34, style: "thinking" },
  ].filter(({ canvas }) => canvas && canvas.getContext);
  if (!canvases.length) return;
  commandOrbRuntime.entries = canvases.map(({ canvas, size, style }) => ({
    canvas,
    ctx: canvas.getContext("2d"),
    size,
    style,
    dpr: 1,
    mode: "idle",
  }));
  paintCommandOrb();
  syncCommandOrbMotion();
}

function wireSmartCommand() {
  initCommandOrb();
  if (!el.smartCommandForm || !el.smartCommandInput) return;
  renderSmartCommandExamples("");
  el.smartCommandForm.addEventListener("submit", (event) => { event.preventDefault(); parseSmartCommand(); });
  el.smartCommandChips?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-command-example]");
    if (!button || !el.smartCommandChips.contains(button)) return;
    el.smartCommandInput.value = button.dataset.commandExample || "";
    el.smartCommandInput.focus();
    parseSmartCommand();
  });
  el.smartCommandInput.addEventListener("input", () => {
    const value = el.smartCommandInput.value;
    renderSmartCommandExamples(value);
    setSmartCommandMode(value.trim() ? "typing" : "idle");
  });
  el.smartCommandInput.addEventListener("focus", () => { if (el.smartCommandInput.value.trim()) setSmartCommandMode("typing"); });
  el.smartCommandInput.addEventListener("keydown", (event) => { if (event.key === "Escape") clearSmartCommand(); });
  document.querySelector("[data-command-focus]")?.addEventListener("click", focusSmartCommand);
}

function focusSmartCommand() {
  const homeView = document.getElementById("view-home");
  const homeTab = document.querySelector('.tab[data-view="home"]');
  const shouldSwitchHome = !!homeView && homeView.hidden;
  if (shouldSwitchHome && homeTab) homeTab.click();
  const focusInput = () => {
    if (!el.smartCommandInput) return;
    el.smartCommandInput.focus({ preventScroll: true });
    el.smartCommandInput.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  if (shouldSwitchHome) setTimeout(focusInput, 80);
  else focusInput();
}
// ---- Crypto bubbles: floating, draggable physics field ----
// One circle per watched asset, sized by 24h-move magnitude, colored by direction.
// Bubbles drift, collide, bounce off the walls, and can be dragged/flung.
const bubbleSim = {
  raf: 0,
  bubbles: [],
  drag: null,
  pending: null,
  lastFrame: 0,
  fastUntil: 0,
  width: 0,
  height: 0,
  // Updated by the observer and synchronously before a loop starts.
  inViewport: false,
};
function clampN(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

// Radius is proportional to how big the 24h move is relative to the biggest
// mover currently in the list, so the largest gainer/loser is the largest
// bubble and the smallest move is the smallest, with a clear spread.
const BUBBLE_MIN_R = 26, BUBBLE_MAX_R = 52, BUBBLE_GAP = 2;
const BUBBLE_FLING_SCALE = 0.46, BUBBLE_MAX_FLING_SPEED = 6.5;
const BUBBLE_RETURN_DELAY = 420, BUBBLE_RETURN_RAMP = 950;
function bubbleRadius(ch, maxMag) {
  const mag = ch == null ? 0 : Math.abs(ch);
  const frac = maxMag > 0 ? Math.min(mag / maxMag, 1) : 0.35;
  return Math.round(BUBBLE_MIN_R + frac * (BUBBLE_MAX_R - BUBBLE_MIN_R));
}
function paintBubble(b) {
  const cls = b.ch == null ? "flat" : b.ch >= 0 ? "up" : "down";
  b.node.className = "bubble " + cls + (bubbleSim.drag === b ? " is-drag" : "");
  b.node.style.width = b.node.style.height = b.r * 2 + "px";
  b.node.style.setProperty("--fs", Math.max(10, Math.round(b.r * 0.32)) + "px");
  const chTxt = b.ch == null ? "—" : (b.ch >= 0 ? "+" : "") + b.ch.toFixed(1) + "%";
  b.node.innerHTML = `<span class="bubble-sym">${escapeHtml(b.sym)}</span><span class="bubble-chg">${chTxt}</span>`;
  b.node.title = b.name;
}
function bubbleHosts() {
  return [el.watchBubbles, el.homeWatchPreview].filter(Boolean);
}
function activeBubbleHost() {
  const homeView = document.getElementById("view-home");
  const watchView = document.getElementById("view-watch");
  if (homeView && !homeView.hidden && el.homeWatchPreview) return el.homeWatchPreview;
  if (watchView && !watchView.hidden && el.watchBubbles) return el.watchBubbles;
  return bubbleHosts().find((host) => host.offsetParent !== null) || null;
}
function syncBubbles() {
  const hosts = bubbleHosts();
  if (!hosts.length) return;
  const host = activeBubbleHost();
  el.watchBubblesSec.hidden = !state.watchlist.length;
  if (el.homeWatchPreview) el.homeWatchPreview.hidden = !state.watchlist.length;
  if (!state.watchlist.length) {
    stopBubbles();
    hosts.forEach((bubbleHost) => { bubbleHost.innerHTML = ""; });
    bubbleSim.bubbles = [];
    return;
  }
  if (!host) return;
  // Biggest absolute 24h move in the current set → drives proportional sizing.
  const maxMag = state.watchlist.reduce((m, w) => {
    const c = (watchData[w.key] || {}).chg24;
    return (typeof c === "number" && !isNaN(c)) ? Math.max(m, Math.abs(c)) : m;
  }, 0);
  const existing = new Map(bubbleSim.bubbles.map((b) => [b.key, b]));
  const keep = [];
  state.watchlist.forEach((w) => {
    const d = watchData[w.key] || {};
    const ch = (typeof d.chg24 === "number" && !isNaN(d.chg24)) ? d.chg24 : null;
    let b = existing.get(w.key);
    if (!b) {
      b = {
        key: w.key,
        node: document.createElement("div"),
        x: 0, y: 0, vx: 0, vy: 0,
        dragX: 0, dragY: 0, dragVx: 0, dragVy: 0,
        phase: Math.random() * Math.PI * 2,
        freeUntil: 0,
        place: true,
      };
      b.node.addEventListener("pointerdown", (e) => startBubbleDrag(b, e));
      host.appendChild(b.node);
    }
    existing.delete(w.key);
    b.name = w.name; b.sym = (w.sym || w.name || "").toUpperCase().slice(0, 5); b.ch = ch; b.r = bubbleRadius(ch, maxMag);
    paintBubble(b);
    keep.push(b);
  });
  existing.forEach((b) => b.node.remove());
  keep.forEach((b) => {
    if (b.node.parentElement !== host) host.appendChild(b.node);
  });
  bubbleSim.bubbles = keep;
  kickBubbles();
}
// Place new bubbles on a compact spiral, then let the damped physics field keep
// them touching around the centre. This matches the dense Crypto Bubbles feel
// without needing a heavyweight canvas/physics dependency.
function kickBubbles() {
  const host = activeBubbleHost();
  if (!host || host.offsetParent === null) return;
  const W = host.clientWidth, H = host.clientHeight;
  if (!W || !H) return;
  const resized = W !== bubbleSim.width || H !== bubbleSim.height;
  bubbleSim.width = W;
  bubbleSim.height = H;
  let placedNew = false;
  const cx = W / 2, cy = H / 2;
  bubbleSim.bubbles.forEach((b, index) => {
    if (b.place) {
      const angle = index * 2.399963;
      const ring = Math.sqrt(index) * Math.min(W, H) * 0.13;
      b.x = clampN(cx + Math.cos(angle) * ring, b.r, W - b.r);
      b.y = clampN(cy + Math.sin(angle) * ring, b.r, H - b.r);
      b.place = false; placedNew = true;
    }
  });
  for (const b of bubbleSim.bubbles) { b.x = clampN(b.x, b.r, W - b.r); b.y = clampN(b.y, b.r, H - b.r); }
  if (placedNew || resized) {
    relaxBubbles(W, H);
    for (const b of bubbleSim.bubbles) {
      const a = b.phase, speed = 0.12 + Math.random() * 0.12;
      b.vx = Math.cos(a) * speed;
      b.vy = Math.sin(a) * speed;
    }
    bubbleSim.fastUntil = performance.now() + 650;
  }
  renderBubbles();
  startBubbles();
}
function renderBubbles() {
  for (const b of bubbleSim.bubbles) b.node.style.transform = `translate3d(${(b.x - b.r).toFixed(1)}px, ${(b.y - b.r).toFixed(1)}px, 0)`;
}
function separateBubbleOverlaps(bs, W, H, passes, applyImpulse) {
  for (let pass = 0; pass < passes; pass++) {
    for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
      const a = bs[i], c = bs[j];
      let dx = c.x - a.x, dy = c.y - a.y, dist = Math.hypot(dx, dy);
      if (dist < 0.001) {
        const angle = i * 2.399963 + j * 0.917;
        dx = Math.cos(angle) * 0.01; dy = Math.sin(angle) * 0.01; dist = 0.01;
      }
      const min = a.r + c.r + BUBBLE_GAP;
      if (dist >= min) continue;
      const nx = dx / dist, ny = dy / dist, overlap = min - dist + 0.08;
      const invA = bubbleSim.drag === a ? 0 : 1 / Math.max(1, a.r * a.r);
      const invC = bubbleSim.drag === c ? 0 : 1 / Math.max(1, c.r * c.r);
      const invSum = invA + invC;
      if (invSum <= 0) continue;
      a.x -= nx * overlap * (invA / invSum); a.y -= ny * overlap * (invA / invSum);
      c.x += nx * overlap * (invC / invSum); c.y += ny * overlap * (invC / invSum);
      if (applyImpulse && pass === 0) {
        const relativeSpeed = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (relativeSpeed < 0) {
          // Low restitution prevents the whole cluster exploding after a fling.
          const impulse = -(1 + 0.24) * relativeSpeed / invSum;
          a.vx -= impulse * invA * nx; a.vy -= impulse * invA * ny;
          c.vx += impulse * invC * nx; c.vy += impulse * invC * ny;
        }
      }
    }
    for (const b of bs) {
      b.x = clampN(b.x, b.r, W - b.r);
      b.y = clampN(b.y, b.r, H - b.r);
    }
  }
}
// One-time compacting pass used for initial layout and responsive resizes.
function relaxBubbles(W, H) {
  const bs = bubbleSim.bubbles;
  const cx = W / 2, cy = H / 2;
  const iterations = Math.min(90, Math.max(34, bs.length * 7));
  for (let it = 0; it < iterations; it++) {
    for (const b of bs) {
      // A wider-than-tall field needs a flatter cluster; stronger vertical
      // centring lets collisions distribute spare space horizontally.
      b.x += (cx - b.x) * 0.012;
      b.y += (cy - b.y) * 0.026;
    }
    separateBubbleOverlaps(bs, W, H, 1, false);
  }
  // The central pull above can reintroduce a tiny overlap in the final pass.
  // Finish with strict separation passes that do not apply any attraction.
  separateBubbleOverlaps(bs, W, H, 8, false);
}
// Resting bubbles use a light 30fps loop; dragging and a short post-fling window
// switch to 60fps. Dimensions are cached so scrolling never forces layout reads.
function stepBubbles(now) {
  bubbleSim.raf = requestAnimationFrame(stepBubbles);
  const W = bubbleSim.width, H = bubbleSim.height;
  if (!W || !H) { stopBubbles(); return; }
  const frameInterval = bubbleSim.drag || now < bubbleSim.fastUntil ? 16 : 32;
  if (bubbleSim.lastFrame && now - bubbleSim.lastFrame < frameInterval) return;
  const dt = bubbleSim.lastFrame ? Math.min((now - bubbleSim.lastFrame) / 16.667, 2) : 1;
  bubbleSim.lastFrame = now;
  const bs = bubbleSim.bubbles, cx = W / 2, cy = H / 2;
  for (const b of bs) {
    if (bubbleSim.drag === b) {
      b.x = clampN(b.dragX, b.r, W - b.r);
      b.y = clampN(b.dragY, b.r, H - b.r);
      b.vx = b.dragVx;
      b.vy = b.dragVy;
      continue;
    }
    // Give a released bubble room to glide, then restore the centre pull
    // gradually so it does not snap straight back into the cluster.
    const returnProgress = clampN((now - (b.freeUntil || 0)) / BUBBLE_RETURN_RAMP, 0, 1);
    const returnEase = returnProgress * returnProgress * (3 - 2 * returnProgress);
    b.vx += (cx - b.x) * 0.00034 * returnEase * dt;
    b.vy += (cy - b.y) * 0.00054 * returnEase * dt;
    // Tiny deterministic motion prevents the field looking frozen at rest.
    const phase = now * 0.00055 + b.phase;
    b.vx += Math.cos(phase) * 0.0024 * dt;
    b.vy += Math.sin(phase) * 0.0024 * dt;
    b.x += b.vx * dt; b.y += b.vy * dt;
    const friction = Math.pow(0.952, dt);
    b.vx *= friction; b.vy *= friction;
    const sp = Math.hypot(b.vx, b.vy);
    if (sp > 16) { b.vx *= 16 / sp; b.vy *= 16 / sp; }
    if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.42; } else if (b.x > W - b.r) { b.x = W - b.r; b.vx = -Math.abs(b.vx) * 0.42; }
    if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy) * 0.42; } else if (b.y > H - b.r) { b.y = H - b.r; b.vy = -Math.abs(b.vy) * 0.42; }
  }
  // Multiple solver passes prevent a later neighbour correction from pushing
  // an already-resolved pair back into each other.
  separateBubbleOverlaps(bs, W, H, 4, true);
  for (const b of bs) {
    b.x = clampN(b.x, b.r, W - b.r);
    b.y = clampN(b.y, b.r, H - b.r);
    b.node.style.transform = `translate3d(${(b.x - b.r).toFixed(1)}px, ${(b.y - b.r).toFixed(1)}px, 0)`;
  }
}
function bubblesAreOnScreen() {
  const host = activeBubbleHost();
  if (!host || host.offsetParent === null) return false;
  const rect = host.getBoundingClientRect();
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight || 0;
  return rect.bottom >= -80 && rect.top <= viewportHeight + 80;
}
function bubbleMotionAllowed() {
  // Recheck synchronously as well as through IntersectionObserver so older
  // mobile WebViews cannot restart an offscreen loop after a delayed callback.
  bubbleSim.inViewport = bubblesAreOnScreen();
  return bubbleSim.inViewport && state.motion && !document.hidden && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
function startBubbles() {
  if (!bubbleSim.raf && bubbleMotionAllowed()) {
    bubbleSim.lastFrame = 0;
    bubbleSim.raf = requestAnimationFrame(stepBubbles);
  }
}
function stopBubbles() {
  if (bubbleSim.raf) cancelAnimationFrame(bubbleSim.raf);
  bubbleSim.raf = 0;
  bubbleSim.lastFrame = 0;
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopBubbles();
  else if (activeBubbleHost()) startBubbles();
});

if (typeof IntersectionObserver === "function" && bubbleHosts().length) {
  const bubbleVisibilityObserver = new IntersectionObserver((entries) => {
    const inViewport = entries.some((entry) => entry.isIntersecting) && !!activeBubbleHost();
    if (bubbleSim.inViewport === inViewport) return;
    bubbleSim.inViewport = inViewport;
    if (inViewport && activeBubbleHost()) kickBubbles();
    else stopBubbles();
  }, { rootMargin: "80px 0px" });
  bubbleHosts().forEach((host) => bubbleVisibilityObserver.observe(host));
}

if (typeof ResizeObserver === "function" && bubbleHosts().length) {
  bubbleHosts().forEach((host) => new ResizeObserver(() => {
    if (activeBubbleHost() === host) kickBubbles();
  }).observe(host));
} else {
  let bubbleResizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(bubbleResizeTimer);
    bubbleResizeTimer = setTimeout(kickBubbles, 120);
  }, { passive: true });
}
function startBubbleDrag(b, e) {
  if ((e.pointerType === "mouse" && e.button !== 0) || bubbleSim.drag || bubbleSim.pending) return;
  const host = activeBubbleHost();
  if (!host) return;
  const pointerId = e.pointerId;
  const isTouch = e.pointerType === "touch";
  let active = false;
  let startX = e.clientX, startY = e.clientY;
  let lastX = e.clientX, lastY = e.clientY, lastTime = e.timeStamp || performance.now();
  bubbleSim.pending = b;

  const activate = (ev) => {
    if (active) return;
    active = true;
    bubbleSim.pending = null;
    bubbleSim.drag = b;
    const rect = host.getBoundingClientRect();
    b.dragX = clampN(ev.clientX - rect.left, b.r, rect.width - b.r);
    b.dragY = clampN(ev.clientY - rect.top, b.r, rect.height - b.r);
    b.dragVx = 0; b.dragVy = 0; b.vx = 0; b.vy = 0;
    b.node.classList.add("is-drag");
    if (b.node.setPointerCapture) try { b.node.setPointerCapture(pointerId); } catch (err) {}
    bubbleSim.fastUntil = performance.now() + 1200;
    startBubbles();
  };

  if (!isTouch) {
    e.preventDefault();
    activate(e);
  }

  const move = (ev) => {
    if (ev.pointerId !== pointerId) return;
    if (!active) {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      if (Math.hypot(dx, dy) < 7) return;
      // A vertical touch remains native page scrolling; a horizontal-first
      // gesture grabs the bubble and can then move freely in both directions.
      if (isTouch && Math.abs(dy) > Math.abs(dx) * 1.08) { cleanup(); return; }
      activate(ev);
      lastX = ev.clientX; lastY = ev.clientY; lastTime = ev.timeStamp || performance.now();
      return;
    }
    if (ev.cancelable) ev.preventDefault();
    const rect = host.getBoundingClientRect();
    const now = ev.timeStamp || performance.now();
    const elapsed = Math.max(8, Math.min(50, now - lastTime || 16.667));
    const scale = 16.667 / elapsed;
    const instantVx = (ev.clientX - lastX) * scale;
    const instantVy = (ev.clientY - lastY) * scale;
    b.dragVx = b.dragVx * 0.62 + instantVx * 0.38;
    b.dragVy = b.dragVy * 0.62 + instantVy * 0.38;
    b.dragX = clampN(ev.clientX - rect.left, b.r, rect.width - b.r);
    b.dragY = clampN(ev.clientY - rect.top, b.r, rect.height - b.r);
    lastX = ev.clientX; lastY = ev.clientY; lastTime = now;
    bubbleSim.fastUntil = performance.now() + 1200;
    startBubbles();
  };
  const finish = (ev) => {
    if (ev.pointerId !== pointerId) return;
    const wasActive = active;
    const cancelled = ev.type === "pointercancel";
    cleanup();
    if (!wasActive) return;
    b.x = b.dragX; b.y = b.dragY;
    b.vx = cancelled ? 0 : clampN(b.dragVx * BUBBLE_FLING_SCALE, -BUBBLE_MAX_FLING_SPEED, BUBBLE_MAX_FLING_SPEED);
    b.vy = cancelled ? 0 : clampN(b.dragVy * BUBBLE_FLING_SCALE, -BUBBLE_MAX_FLING_SPEED, BUBBLE_MAX_FLING_SPEED);
    b.freeUntil = performance.now() + BUBBLE_RETURN_DELAY;
    b.dragVx = 0; b.dragVy = 0;
    b.node.classList.remove("is-drag");
    bubbleSim.drag = null;
    bubbleSim.fastUntil = performance.now() + 1600;
    startBubbles();
  };
  const cleanup = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", finish);
    document.removeEventListener("pointercancel", finish);
    if (bubbleSim.pending === b) bubbleSim.pending = null;
  };
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", finish);
  document.addEventListener("pointercancel", finish);
}

function buildWatchlist() {
  if (el.watchSearch) el.watchSearch.placeholder = t("watch_search_ph");
  if (el.watchCount) el.watchCount.textContent = t("watch_count", { count: state.watchlist.length });
  syncBubbles();
  if (!state.watchlist.length) { el.watchList.innerHTML = ""; el.watchEmpty.hidden = false; return; }
  el.watchEmpty.hidden = true;
  const showCcyToggle = state.currency === "TL";
  el.watchList.innerHTML = state.watchlist.map((w) => {
    const d = watchData[w.key] || {};
    const toSym = watchDisplayCcy(w) === "TRY" ? "$" : "₺"; // switch-to currency
    const ccyBtn = showCcyToggle
      ? `<button class="watch-ccy" type="button" data-wccy="${w.type}|${w.key}" aria-label="${t("watch_ccy")}" title="${t("watch_ccy")}">${toSym}</button>`
      : "";
    return `<div class="watch-row" data-wkey="${w.type}|${w.key}">
      <button class="watch-grip" type="button" data-wgrip aria-label="reorder">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><circle cx="5" cy="3" r="1.3"/><circle cx="11" cy="3" r="1.3"/><circle cx="5" cy="8" r="1.3"/><circle cx="11" cy="8" r="1.3"/><circle cx="5" cy="13" r="1.3"/><circle cx="11" cy="13" r="1.3"/></svg>
      </button>
      <div class="watch-body">
        <div class="watch-top">
          <div class="watch-name">${escapeHtml(w.name)} <small>${escapeHtml((w.sym || "").toUpperCase())}</small></div>
          ${sparklineSvg(d.spark)}
          <div class="watch-price">${watchPriceLabel(w)}</div>
        </div>
        <div class="watch-perf">
          ${chgHtml(t("lbl_24h"), d.chg24)}${chgHtml(t("lbl_1mo"), d.chg1mo)}${chgHtml(t("lbl_1yr"), d.chg1y)}
          <div class="watch-actions">
            ${ccyBtn}
            <button class="watch-chart" type="button" data-wchart="${w.type}|${w.key}" aria-label="${t("watch_chart")}" title="${t("watch_chart")}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16l3.5-4 3 3L20 8"/></svg>
            </button>
            <button class="watch-del" type="button" data-wdel="${w.type}|${w.key}" aria-label="remove">×</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join("");
  el.watchList.querySelectorAll("[data-wdel]").forEach((b) => b.addEventListener("click", () => {
    const idx = b.dataset.wdel.indexOf("|");
    removeWatch(b.dataset.wdel.slice(0, idx), b.dataset.wdel.slice(idx + 1));
  }));
  el.watchList.querySelectorAll("[data-wchart]").forEach((b) => b.addEventListener("click", () => {
    const idx = b.dataset.wchart.indexOf("|");
    const type = b.dataset.wchart.slice(0, idx), key = b.dataset.wchart.slice(idx + 1);
    const w = state.watchlist.find((x) => x.type === type && x.key === key);
    if (w) openTradingView(w);
  }));
  el.watchList.querySelectorAll("[data-wccy]").forEach((b) => b.addEventListener("click", () => {
    const idx = b.dataset.wccy.indexOf("|");
    const type = b.dataset.wccy.slice(0, idx), key = b.dataset.wccy.slice(idx + 1);
    const w = state.watchlist.find((x) => x.type === type && x.key === key);
    if (w) { w.altCcy = !w.altCcy; saveState(); buildWatchlist(); }
  }));
  el.watchList.querySelectorAll("[data-wgrip]").forEach((g) => g.addEventListener("pointerdown", startWatchReorder));
}
// Drag-to-reorder the watchlist via each row's grip handle (touch + mouse).
function startWatchReorder(e) {
  e.preventDefault();
  const list = el.watchList;
  const grip = e.currentTarget;
  const row = grip.closest(".watch-row");
  if (!row) return;
  row.classList.add("wl-dragging");
  if (grip.setPointerCapture) try { grip.setPointerCapture(e.pointerId); } catch (err) {}
  const move = (ev) => {
    const others = [...list.querySelectorAll(".watch-row:not(.wl-dragging)")];
    let before = null;
    for (const r of others) {
      const rect = r.getBoundingClientRect();
      if (ev.clientY < rect.top + rect.height / 2) { before = r; break; }
    }
    if (before) list.insertBefore(row, before); else list.appendChild(row);
  };
  const finish = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", finish);
    document.removeEventListener("pointercancel", finish);
    row.classList.remove("wl-dragging");
    const order = [...list.querySelectorAll(".watch-row")].map((r) => r.dataset.wkey);
    state.watchlist.sort((a, b) => order.indexOf(a.type + "|" + a.key) - order.indexOf(b.type + "|" + b.key));
    saveState();
  };
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", finish);
  document.addEventListener("pointercancel", finish);
}
function monitoredPriceItems() {
  const items = new Map();
  state.watchlist.forEach((w) => items.set(w.type + "|" + w.key, w));
  state.notifications.priceAlerts.forEach((a) => {
    const id = a.type + "|" + a.key;
    if (!items.has(id)) items.set(id, { type: a.type, key: a.key, name: a.name, sym: a.sym || "" });
  });
  return [...items.values()];
}

async function refreshWatchData() {
  const monitored = monitoredPriceItems();
  if (!monitored.length) { renderHomeSummaries(); return; }
  if (monitored.some((w) => w.type === "fiat")) await loadUsdTry();
  const vs = state.currency === "TL" ? "try" : "usd";
  const ids = [...new Set(monitored.filter((w) => w.type === "crypto").map((w) => w.key))];
  if (monitored.some((w) => w.type === "gold" || w.type === "goldoz")) ids.push("pax-gold");
  if (ids.length) {
    try {
      const r = await fetchWithTimeout(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs}&ids=${ids.join(",")}&price_change_percentage=24h,30d,1y&sparkline=true`);
      if (r.ok) {
        (await r.json()).forEach((c) => {
          const d = { price: c.current_price, chg24: c.price_change_percentage_24h_in_currency, chg1mo: c.price_change_percentage_30d_in_currency, chg1y: c.price_change_percentage_1y_in_currency, spark: (c.sparkline_in_7d && c.sparkline_in_7d.price) || null };
          if (c.id === "pax-gold") {
            const g = Object.assign({}, d, { price: c.current_price / GRAMS_PER_OZ }); // per-gram in active ccy
            watchData["gold"] = g; watchData["goldoz"] = g; // ounce row derives from the same data
          } else watchData[c.id] = d;
        });
      }
    } catch (e) {}
  }
  const stocks = monitored.filter((w) => w.type === "usstock" || w.type === "bist");
  await forEachLimited(stocks, 3, async (w) => {
    const d = await fetchStockData(w.type === "bist" ? w.key + ".IS" : w.key);
    if (d) watchData[w.key] = d;
  });
  buildWatchlist();
  renderNotificationSettings();
  checkPriceAlerts();
  renderHomeSummaries();
}

// ---- Best 1-year performers (fixed pool: top-10 crypto, top-10 US stocks, gold,
// silver, and the BIST 30 when on TL). Ranked by 1y return, best 15 shown. ----
let topPerfData = null;      // ranked list currently shown
let topPerfBuiltFor = null;  // currency it was built for (rebuild on change)
async function getStock1y(ysym) {
  const key = "numbr_p1y_" + ysym;
  try { const c = JSON.parse(localStorage.getItem(key) || "null"); if (c && Date.now() - c.t < 24 * 3600 * 1000) return c.d; } catch (e) {}
  const d = await fetchStockData(ysym);
  if (d && d.price != null) { try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d })); } catch (e) {} return d; }
  return null;
}
// Stablecoins (~0% return) and wrapped/staked tokens (near-duplicates of BTC/ETH)
// are excluded from the leaderboard so they don't crowd out real performers.
const TOP_PERF_SKIP = new Set([
  "USDT", "USDC", "DAI", "BUSD", "TUSD", "USDD", "FDUSD", "PYUSD", "USDE", "USDS",
  "USD1", "GUSD", "FRAX", "LUSD", "USDP", "EURT", "EURS", "RLUSD", "USDG", "USDTB",
  "BUIDL", "AEUR", "EURC", "USDX", "CRVUSD",
  "WBTC", "WETH", "STETH", "WSTETH", "WEETH", "WBETH", "CBBTC", "RETH", "LBTC",
  "SOLVBTC", "BNSOL", "JITOSOL", "METH", "RSETH", "EZETH", "CBETH",
]);
async function getTopCrypto1y() {
  const key = "numbr_topcrypto1y2";
  try { const c = JSON.parse(localStorage.getItem(key) || "null"); if (c && Date.now() - c.t < 24 * 3600 * 1000) return c.data; } catch (e) {}
  try {
    const r = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=40&page=1&price_change_percentage=1y");
    if (r.ok) {
      const data = (await r.json())
        .filter((c) => !TOP_PERF_SKIP.has((c.symbol || "").toUpperCase()))
        .slice(0, 25)
        .map((c) => ({ type: "crypto", key: c.id, sym: (c.symbol || "").toUpperCase(), name: c.name, price: c.current_price, ccy: "USD", chg1y: c.price_change_percentage_1y_in_currency }));
      try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), data })); } catch (e) {}
      return data;
    }
  } catch (e) {}
  return [];
}
function rankTopPerf(candidates) {
  return candidates
    .filter((c) => typeof c.chg1y === "number" && isFinite(c.chg1y))
    .sort((a, b) => b.chg1y - a.chg1y)
    .slice(0, 15);
}
// Names are attached client-side so gold/silver/BIST labels stay localized.
function decorateTopPerfNames(items) {
  const usName = {}; US_STOCKS.forEach((s) => (usName[s.s] = s.n));
  const bistName = {}; BIST_STOCKS.forEach((s) => (bistName[s.s] = s.n));
  const idxName = { spx: "S&P 500", ndx: "Nasdaq 100", dji: "Dow Jones" };
  return items.map((it) => Object.assign({}, it, {
    name: it.type === "crypto" ? (it.name || it.sym)
      : it.type === "usstock" ? (usName[it.key] || it.key)
      : it.type === "index" ? (idxName[it.key] || it.sym)
      : it.type === "gold" ? t("asset_gold")
      : it.type === "silver" ? t("asset_silver")
      : it.type === "bist" ? (bistName[it.key] || it.key)
      : (it.name || it.sym),
  }));
}

async function buildTopPerformers() {
  const listEl = document.getElementById("topPerfList");
  const homeListEl = document.getElementById("homeTopPerfList");
  if (!listEl && !homeListEl) return;
  if (topPerfData && topPerfBuiltFor === state.currency) { renderTopPerformers(); return; }
  const built = state.currency; // guard against currency changing mid-fetch
  const today = localDateKey();
  const cacheKey = "numbr_topperf_" + built;
  // Same-day cache: the list is ready the moment the app opens, zero fetches.
  try {
    const c = JSON.parse(localStorage.getItem(cacheKey) || "null");
    if (c && c.day === today && Array.isArray(c.items) && c.items.length) {
      topPerfBuiltFor = built;
      topPerfData = decorateTopPerfNames(c.items);
      renderTopPerformers();
      return;
    }
  } catch (e) {}
  if (topPerfBuiltFor !== built || !((listEl && listEl.children.length) || (homeListEl && homeListEl.children.length))) renderTopPerformers();
  topPerfBuiltFor = built;
  // Server-computed daily leaderboard (Vercel CDN caches it for a day and
  // refreshes it by itself, so this is one cheap request, not ~35 quotes).
  try {
    const r = await Promise.race([fetch(`/api/topperf?market=${built === "TL" ? "TR" : "US"}`), new Promise((res) => setTimeout(() => res(null), 9000))]);
    if (r && r.ok) {
      const j = await r.json();
      if (Array.isArray(j.items) && j.items.length) {
        if (topPerfBuiltFor !== built) return;
        try { localStorage.setItem(cacheKey, JSON.stringify({ day: today, items: j.items })); } catch (e) {}
        topPerfData = decorateTopPerfNames(j.items);
        renderTopPerformers();
        return;
      }
    }
  } catch (e) {}
  if (topPerfBuiltFor !== built) return;
  await buildTopPerformersClient(built); // fallback: compute in the browser (local dev / endpoint down)
}

async function buildTopPerformersClient(built) {
  const isTL = built === "TL";

  // Gather every source, then render once. Showing the crypto-only batch first
  // made the list look all-crypto while the stocks/metals were still loading.
  const candidates = [];
  (await getTopCrypto1y()).forEach((c) => candidates.push(c));
  if (topPerfBuiltFor !== built) return;

  const jobs = [];
  // Curated megacaps plus a few notable high-momentum names for the US pool.
  const usPool = US_STOCKS.slice(0, 18).map((s) => s.s);
  ["AVGO", "LLY", "UBER", "COIN", "PLTR", "MSTR", "HOOD", "AMD", "NFLX", "CRWD"]
    .forEach((s) => { if (!usPool.includes(s)) usPool.push(s); });
  const usName = {}; US_STOCKS.forEach((s) => (usName[s.s] = s.n));
  usPool.forEach((s) => jobs.push({ type: "usstock", key: s, sym: s, name: usName[s] || s, ysym: s, ccy: "USD" }));
  // Major US indices.
  jobs.push({ type: "index", key: "spx", sym: "SPX", name: "S&P 500", ysym: "^GSPC", ccy: "USD" });
  jobs.push({ type: "index", key: "ndx", sym: "NDX", name: "Nasdaq 100", ysym: "^NDX", ccy: "USD" });
  jobs.push({ type: "index", key: "dji", sym: "DJI", name: "Dow Jones", ysym: "^DJI", ccy: "USD" });
  jobs.push({ type: "gold", key: "gold", sym: "XAU", name: t("asset_gold"), ysym: "GC=F", ccy: "USD" });
  jobs.push({ type: "silver", key: "silver", sym: "XAG", name: t("asset_silver"), ysym: "SI=F", ccy: "USD" });
  if (isTL) {
    const bistName = {};
    BIST_STOCKS.forEach((s) => (bistName[s.s] = s.n));
    BIST30.forEach((sym) => jobs.push({ type: "bist", key: sym, sym, name: bistName[sym] || sym, ysym: sym + ".IS", ccy: "TRY" }));
  }

  // Per-job timeout so one stuck quote can't hang the whole leaderboard.
  const withTimeout = (p, ms) => Promise.race([p, new Promise((res) => setTimeout(() => res(null), ms))]);
  // Fetch the USD/TRY rate in parallel with the quotes (not before them).
  const fxP = isTL ? withTimeout(getStock1y("TRY=X"), 7000) : Promise.resolve(null);
  const resultsP = Promise.all(jobs.map(async (j) => {
    const d = await withTimeout(getStock1y(j.ysym), 7000);
    return d && typeof d.chg1y === "number" ? Object.assign({}, j, { price: d.price, chg1y: d.chg1y }) : null;
  }));
  const [fx, results] = await Promise.all([fxP, resultsP]);
  if (topPerfBuiltFor !== built) return; // a newer build owns the list now
  const fxChg = fx && typeof fx.chg1y === "number" ? fx.chg1y : null;
  results.forEach((r) => {
    if (!r) return;
    // BIST: rank on the USD return (lira inflation aside), but keep the ₺ price.
    if (r.type === "bist") {
      if (fxChg == null) return; // no USD/TRY → can't express a dollar return
      r.chg1y = ((1 + r.chg1y / 100) / (1 + fxChg / 100) - 1) * 100;
    }
    candidates.push(r);
  });
  topPerfData = rankTopPerf(candidates);
  renderTopPerformers();
}
function perfPrice(c) {
  if (c.price == null) return "";
  if (c.type === "index") return fmtPrice(c.price); // index level, no currency symbol
  return (c.ccy === "TRY" ? "₺" : "$") + fmtPrice(c.price);
}
function renderTopPerfList(listEl, ranked, limit) {
  if (!listEl) return;
  const visible = ranked.slice(0, limit);
  if (!visible.length) { listEl.innerHTML = `<div class="top-perf-msg">${t("top_perf_loading")}</div>`; return; }
  listEl.innerHTML = visible.map((c, i) => {
    const cls = c.chg1y >= 0 ? "up" : "down";
    const txt = (c.chg1y >= 0 ? "+" : "") + c.chg1y.toFixed(1) + "%";
    return `<button class="top-perf-row" type="button" data-tv="${c.type}|${c.key}|${c.sym}" title="${t("watch_chart")}">
      <span class="top-perf-rank">${i + 1}</span>
      <span class="top-perf-name">${escapeHtml(c.name)} <small>${escapeHtml(c.sym)}</small></span>
      <span class="top-perf-price">${perfPrice(c)}</span>
      <span class="top-perf-chg ${cls}">${txt}</span>
    </button>`;
  }).join("");
  listEl.querySelectorAll("[data-tv]").forEach((b) => b.addEventListener("click", () => {
    const p = b.dataset.tv.split("|");
    const item = (topPerfData || []).find((c) => c.type === p[0] && c.key === p[1]);
    openTradingView({ type: p[0], key: p[1], sym: p[2], name: item ? item.name : p[2] });
  }));
}
function renderTopPerformers() {
  const ranked = topPerfData || [];
  renderTopPerfList(document.getElementById("topPerfList"), ranked, 15);
  renderTopPerfList(document.getElementById("homeTopPerfList"), ranked, 15);
}

// ---- Turkey panel: live FX rates + gram/quarter gold in lira (TL mode only) ----
// Standard Turkish gold coins as a multiple of the 24k gram price (metal content).
const GOLD_COIN_MULT = { gram: 1, quarter: 1.6, half: 3.2, full: 6.4 };
async function getFxQuote(ysym) {
  const key = "numbr_fx_" + ysym;
  try { const c = JSON.parse(localStorage.getItem(key) || "null"); if (c && Date.now() - c.t < FX_CACHE_FRESH_MS) return c.d; } catch (e) {}
  const d = await fetchYahoo(ysym); // { price, chg24 } or null
  if (d && d.price != null) { try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d })); } catch (e) {} return d; }
  return null;
}
function trChgHtml(v) {
  return typeof v === "number" ? `<span class="tr-chg ${v >= 0 ? "up" : "down"}">${v >= 0 ? "+" : ""}${v.toFixed(2)}%</span>` : "";
}
function trRow(name, price, chg24) {
  return `<div class="tr-row"><span class="tr-name">${name}</span><span class="tr-vals"><span class="tr-price">${price}</span>${trChgHtml(chg24)}</span></div>`;
}
// One flat list (no headings): BIST 100, USD/TRY, EUR/TRY, gram / quarter / full gold.
function trListHtml(bist, usdtry, eurtry, compact = false) {
  const gram = goldPriceGram; // TL per gram when on TL
  const fx = (d, isTry) => d && d.price != null ? (isTry ? "₺" : "$") + fmtPrice(d.price) : "…";
  const gold = (m) => gram > 0 ? formatMoney(gram * m) : "…";
  const rows = [
    trRow("BIST 100", bist && bist.price != null ? fmtPrice(bist.price) : "…"),
    trRow("USD/TRY", fx(usdtry, true)),
    trRow("EUR/TRY", fx(eurtry, true)),
    trRow(t("gold_gram"), gold(GOLD_COIN_MULT.gram)),
    trRow(t("gold_quarter"), gold(GOLD_COIN_MULT.quarter)),
    trRow(t("gold_full"), gold(GOLD_COIN_MULT.full)),
  ];
  return rows.slice(0, compact ? 4 : rows.length).join("");
}
async function buildTrPanel() {
  const sec = document.getElementById("trPanel");
  const homeSec = document.querySelector('[data-home-widget="marketSnapshot"]');
  const homeList = document.getElementById("homeTrList");
  if (!sec && !homeSec) return;
  if (state.currency !== "TL") { if (sec) sec.hidden = true; if (homeSec) homeSec.hidden = true; return; }
  if (sec) sec.hidden = false;
  if (homeSec) homeSec.hidden = false;
  const listEl = document.getElementById("trList");
  if (!listEl && !homeList) return;
  // Gold is instant; index/forex fill in once fetched (show "…" placeholders meanwhile).
  if (listEl) listEl.innerHTML = trListHtml(null, null, null);
  if (homeList) homeList.innerHTML = trListHtml(null, null, null, true);
  const [bist, usdtry, eurtry] = await Promise.all([getFxQuote("XU100.IS"), getFxQuote("TRY=X"), getFxQuote("EURTRY=X")]);
  if (state.currency !== "TL") return; // currency changed mid-fetch
  if (listEl) listEl.innerHTML = trListHtml(bist, usdtry, eurtry);
  if (homeList) homeList.innerHTML = trListHtml(bist, usdtry, eurtry, true);
}
function wireWatchSearch() {
  const search = el.watchSearch, dd = el.watchDd;
  if (!search) return;
  function render(q) {
    const ql = (q || "").trim().toLowerCase();
    if (!ql) { dd.hidden = true; return; }
    const matches = watchSearchPool().filter((p) => p.name.toLowerCase().includes(ql) || (p.sym || "").toLowerCase().includes(ql)).slice(0, 10);
    if (!matches.length) { dd.hidden = true; return; }
    dd.innerHTML = matches.map((p, i) => `<button type="button" class="coin-opt" data-wi="${i}">${escapeHtml(p.name)} <span>${escapeHtml(p.sym || "")} · ${escapeHtml(p.tag)}</span></button>`).join("");
    dd.hidden = false;
    dd.querySelectorAll("[data-wi]").forEach((b) => b.addEventListener("mousedown", (e) => { e.preventDefault(); addWatch(matches[+b.dataset.wi]); search.value = ""; dd.hidden = true; }));
  }
  search.addEventListener("input", () => render(search.value));
  search.addEventListener("focus", () => render(search.value));
  search.addEventListener("blur", () => setTimeout(() => { dd.hidden = true; }, 150));
}

function wirePriceAlertSearch() {
  const form = priceAlertForm();
  const search = form.search, dd = form.dropdown;
  if (!search || !dd) return;
  let currentMatches = [];
  const close = () => { dd.hidden = true; search.setAttribute("aria-expanded", "false"); };
  const choose = (item) => {
    selectedPriceAlertAsset = { type: item.type, key: item.key, name: item.name, sym: item.sym || "" };
    search.value = priceAlertSelectionText(selectedPriceAlertAsset);
    close(); syncPriceAlertSelectionUi(); form.target.focus();
  };
  const render = () => {
    const selected = selectedPriceAlertAsset;
    if (selected && search.value !== priceAlertSelectionText(selected)) {
      selectedPriceAlertAsset = null; syncPriceAlertSelectionUi();
    }
    const q = search.value.trim().toLocaleLowerCase(state.lang === "tr" ? "tr-TR" : "en-US");
    if (!q || selectedPriceAlertAsset) { currentMatches = []; close(); return; }
    currentMatches = watchSearchPool().filter((item) => item.name.toLocaleLowerCase(state.lang === "tr" ? "tr-TR" : "en-US").includes(q) || String(item.sym || "").toLowerCase().includes(q)).slice(0, 12);
    if (!currentMatches.length) { close(); return; }
    dd.innerHTML = currentMatches.map((item, i) => `<button type="button" class="coin-opt" role="option" data-alert-result="${i}">${escapeHtml(item.name)} <span>${escapeHtml(item.sym || "")} · ${escapeHtml(item.tag)}</span></button>`).join("");
    dd.hidden = false; search.setAttribute("aria-expanded", "true");
    dd.querySelectorAll("[data-alert-result]").forEach((button) => {
      button.addEventListener("mousedown", (e) => e.preventDefault());
      button.addEventListener("click", () => choose(currentMatches[+button.dataset.alertResult]));
    });
  };
  search.addEventListener("input", render);
  search.addEventListener("focus", render);
  search.addEventListener("blur", () => setTimeout(close, 150));
  search.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { close(); return; }
    if (e.key === "ArrowDown" && !dd.hidden) { e.preventDefault(); const first = dd.querySelector("[data-alert-result]"); if (first) first.focus(); }
    else if (e.key === "Enter" && currentMatches.length && !selectedPriceAlertAsset) { e.preventDefault(); choose(currentMatches[0]); }
  });
}

// ============================================================
//  Language + Theme
// ============================================================
function applyLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach((node) => { node.innerHTML = t(node.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-title]").forEach((node) => { node.title = t(node.dataset.i18nTitle); node.setAttribute("aria-label", t(node.dataset.i18nTitle)); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = t(node.dataset.i18nPlaceholder); });
  buildLayout(); refresh();
  buildExpenses();
  buildCarHub();
  buildPortfolio(); refreshPortfolio();
  buildIncome(); refreshIncome();
  buildWatchlist();
  renderHomeDashboard(false);
  renderHomeCardSettings();
  refreshHomeCardControlLabels();
  renderPwaSettings();
  renderNotificationSettings();
  renderSmartCommandExamples(el.smartCommandInput?.value || "");
  updateSettingsActive();
  hydrateUiIcons();
  try { localStorage.setItem("numbr_lang", lang); } catch (e) {}
}
function applyTheme(theme = "black") {
  state.theme = normalizeTheme(theme || state.theme);
  document.documentElement.dataset.theme = state.theme;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", state.theme === "fff" ? "#050805" : state.theme === "terminal" ? "#061009" : "#000000");
  updateSettingsActive();
  saveState();
  window.requestAnimationFrame(() => replayFffViewMotion(document.querySelector(".view:not([hidden])")));
  try { localStorage.setItem("numbr_theme", state.theme); } catch (e) {}
}

function replayFffViewMotion(view) {
  if (!view || document.documentElement.dataset.theme !== "fff" || !state.motion) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  view.classList.remove("fff-view-reveal");
  void view.offsetWidth;
  view.classList.add("fff-view-reveal");
}
function applyMotion(enabled) {
  state.motion = !!enabled;
  document.documentElement.dataset.motion = state.motion ? "on" : "off";
  const toggle = document.getElementById("motionToggle");
  if (toggle) toggle.checked = state.motion;
  if (!state.motion) stopBubbles();
  else if (activeBubbleHost()) kickBubbles();
  syncCommandOrbMotion();
  saveState();
}
// Warm the browser cache with the wallpaper-backed themes so switching to them is
// instant instead of waiting ~1s for the image to download on first use.
let themeWallpapersPreloaded = false;
function preloadThemeWallpapers() {
  if (themeWallpapersPreloaded) return;
  const wallpaperByTheme = { neon: "Themes/Neon/neon2.jpg", xp: "Themes/win/winwal.jpg" };
  const sources = [...document.querySelectorAll("[data-theme-pick]:not([hidden])")]
    .map((button) => wallpaperByTheme[button.dataset.themePick])
    .filter(Boolean);
  // Do not download assets for themes that are currently hidden in Settings.
  if (!sources.length) return;
  themeWallpapersPreloaded = true;
  sources.forEach((src) => { const img = new Image(); img.src = src; });
}
function updateSettingsActive() {
  document.querySelectorAll(".opt-cur").forEach((b) => b.classList.toggle("is-active", b.dataset.currency === state.currency));
  document.querySelectorAll(".opt-lang").forEach((b) => b.classList.toggle("is-active", b.dataset.lang === state.lang));
  document.querySelectorAll(".opt-theme").forEach((b) => b.classList.toggle("is-active", b.dataset.themePick === state.theme));
}

function rebasePortfolioCommandCosts(fromCurrency, toCurrency) {
  const from = fromCurrency === "TL" ? "TRY" : "USD";
  const to = toCurrency === "TL" ? "TRY" : "USD";
  if (from === to || !(usdTry > 0)) return;
  state.portfolio.holdings.forEach((holding) => {
    const cost = convertCommandCurrency(holding.costBasisApp, from, to);
    const average = convertCommandCurrency(holding.avgCostApp, from, to);
    if (cost != null) holding.costBasisApp = cost;
    if (average != null) holding.avgCostApp = average;
  });
  (state.portfolio.transactions || []).forEach((transaction) => {
    if (transaction.appCurrency !== from) return;
    const total = convertCommandCurrency(transaction.totalApp, from, to);
    const price = convertCommandCurrency(transaction.priceApp, from, to);
    if (total != null) transaction.totalApp = total;
    if (price != null) transaction.priceApp = price;
    transaction.appCurrency = to;
    (transaction.legs || []).forEach((leg) => {
      const legTotal = convertCommandCurrency(leg.totalApp, from, to);
      if (legTotal != null) leg.totalApp = legTotal;
    });
  });
}

function setCurrency(cur) {
  if (cur === state.currency || !CURRENCY_META[cur]) return;
  const previousCurrency = state.currency;
  rebasePortfolioCommandCosts(previousCurrency, cur);
  state.currency = cur;
  if (el.savingsGoalCurrency) el.savingsGoalCurrency.value = cur;
  el.inflation.value = formatRate(state.inflation[cur], false);
  // USD holdings convert differently per app currency; recompute before rendering.
  state.portfolio.holdings.forEach((h) => { if (h.assetType === "usd") h.value = usdHoldingValue(h.usd || 0); });
  buildLayout(); refresh(); refreshExpenses(); buildCarHub(); buildPortfolio(); refreshPortfolio(); refreshIncome();
  refreshCryptoPrices(); // refetch crypto prices in the new currency
  buildWatchlist(); refreshWatchData();
  renderHomeDashboard();
  renderNotificationSettings();
  updateSettingsActive();
  try { localStorage.setItem("numbr_currency", cur); } catch (e) {}
}

// ---- First-run onboarding (country + language, shown once) ----
let obCountry = "TR", obLang = "tr";
function updateObActive() {
  document.querySelectorAll(".ob-country").forEach((b) => b.classList.toggle("is-active", b.dataset.obCountry === obCountry));
  document.querySelectorAll(".ob-lang").forEach((b) => b.classList.toggle("is-active", b.dataset.obLang === obLang));
}
function showOnboarding() {
  // NumBrrr is Turkish-first; the user can switch country and language.
  obCountry = "TR"; obLang = "tr";
  applyLanguage(obLang);
  updateObActive();
  document.getElementById("onboard").hidden = false;
}
function finishOnboarding() {
  applyLanguage(obLang);
  setCurrency(COUNTRIES[obCountry].currency);
  try { localStorage.setItem("numbr_onboarded", "1"); } catch (e) {}
  document.getElementById("onboard").hidden = true;
  showGuide(); // first-run section guide right after onboarding
}
document.querySelectorAll(".ob-country").forEach((b) => b.addEventListener("click", () => { obCountry = b.dataset.obCountry; updateObActive(); }));
document.querySelectorAll(".ob-lang").forEach((b) => b.addEventListener("click", () => { obLang = b.dataset.obLang; applyLanguage(obLang); updateObActive(); }));
document.getElementById("obStart").addEventListener("click", finishOnboarding);

// ---- First-run section guide (what each tab does; shown once) ----
function showGuide() { const g = document.getElementById("guide"); if (g) g.hidden = false; }
function dismissGuide() {
  const g = document.getElementById("guide"); if (g) g.hidden = true;
  try { localStorage.setItem("numbr_guide_seen", "1"); } catch (e) {}
}
document.getElementById("guideClose").addEventListener("click", dismissGuide);
document.getElementById("guideStart").addEventListener("click", dismissGuide);

// Chart popup close handlers (button, backdrop, Escape).
const tvCloseBtn = document.getElementById("tvClose");
const tvBackdrop = document.getElementById("tvBackdrop");
if (tvCloseBtn) tvCloseBtn.addEventListener("click", closeChartModal);
if (tvBackdrop) tvBackdrop.addEventListener("click", closeChartModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeChartModal(); closeMonthlyShareModal(); } });

// ---- Soft interface sounds (Web Audio; respects the Sound setting) ----
let audioCtx = null;
let audioMaster = null;
let audioNoiseBuffer = null;

function ensureAudioGraph() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (!audioMaster) {
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -26;
    compressor.knee.value = 20;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.13;
    audioMaster = audioCtx.createGain();
    audioMaster.gain.value = 0.72;
    audioMaster.connect(compressor);
    compressor.connect(audioCtx.destination);
  }
  if (!audioNoiseBuffer) {
    const length = Math.max(1, Math.floor(audioCtx.sampleRate * 0.08));
    audioNoiseBuffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = audioNoiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.4);
  }
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

function softTone(ctx, frequency, endFrequency, when, duration, gainValue) {
  const oscillator = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(Math.max(1, frequency), when);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), when + duration);
  filter.type = "lowpass";
  filter.frequency.value = 2400;
  filter.Q.value = 0.45;
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(gainValue, when + Math.min(0.012, duration * 0.24));
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioMaster);
  oscillator.start(when);
  oscillator.stop(when + duration + 0.025);
}

function softTick(ctx, when, duration = 0.018, gainValue = 0.0028) {
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  source.buffer = audioNoiseBuffer;
  filter.type = "bandpass";
  filter.frequency.value = 1750;
  filter.Q.value = 0.7;
  gain.gain.setValueAtTime(gainValue, when);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioMaster);
  source.start(when);
  source.stop(when + duration + 0.01);
}

function sfx(name) {
  if (!state.sound) return;
  try {
    const ctx = ensureAudioGraph();
    if (!ctx) return;
    const now = ctx.currentTime + 0.006;
    if (name === "add" || name === "success") {
      softTone(ctx, 494, 554, now, 0.07, 0.016);
      softTone(ctx, 659, 740, now + 0.045, 0.09, 0.015);
    } else if (name === "remove") {
      softTone(ctx, 330, 230, now, 0.075, 0.014);
      softTick(ctx, now, 0.022, 0.0024);
    } else if (name === "toggle") {
      softTone(ctx, 480, 580, now, 0.052, 0.014);
      softTone(ctx, 960, 1160, now, 0.042, 0.0035);
    } else if (name === "alert") {
      softTone(ctx, 659, 740, now, 0.11, 0.018);
      softTone(ctx, 880, 988, now + 0.075, 0.13, 0.016);
    } else {
      softTone(ctx, 360, 300, now, 0.045, 0.012);
      softTick(ctx, now, 0.016, 0.0025);
    }
  } catch (e) {}
}
// One delegated listener picks the right sound from the clicked control.
document.addEventListener("click", (e) => {
  if (!state.sound) return;
  const t = e.target;
  if (t.closest(".cat-remove, .watch-del")) sfx("remove");
  else if (t.closest(".alert-search-dd .coin-opt")) sfx("toggle");
  else if (t.closest(".add-cat, .veh-add-btn, .coin-opt")) sfx("add");
  else if (t.closest(".opt, .exp-paid, .net-tax-btn, .port-ccy-toggle, .exp-hist-toggle, .switch, .watch-grip, .donut-seg")) sfx("toggle");
  else if (t.closest(".tab")) sfx("tap");
}, true);

// ---- Event wiring ----
document.querySelectorAll("[data-currency]").forEach((b) => b.addEventListener("click", () => setCurrency(b.dataset.currency)));

el.addRecurring.addEventListener("click", addRecurring);
el.addExpense.addEventListener("click", addExpense);
el.budgetForm.addEventListener("submit", saveBudgetLimit);
el.addVehicle.addEventListener("click", addVehicle);
el.carCalc.addEventListener("click", calcCarRoute);
el.carSaveTrip.addEventListener("click", saveCarTrip);
el.carFavorite.addEventListener("click", toggleFavoriteRoute);
el.carClear.addEventListener("click", () => clearCarRoute(true));
el.carOneWay.addEventListener("click", (event) => {
  setCarTripType("oneway");
  if (event.detail > 0) event.currentTarget.blur();
});
el.carRoundTrip.addEventListener("click", (event) => {
  setCarTripType("roundtrip");
  if (event.detail > 0) event.currentTarget.blur();
});
[el.carOneWay, el.carRoundTrip].forEach((button) => {
  button.addEventListener("pointerup", () => button.blur());
});
[[el.carToll, "toll"], [el.carParking, "parking"], [el.carOther, "other"]].forEach(([input, key]) => {
  input.addEventListener("input", () => { state.vehicleHub.extras[key] = parseNumber(input.value); renderCarRoute(false); saveState(); });
  input.addEventListener("blur", () => { if (state.vehicleHub.extras[key]) input.value = formatThousands(state.vehicleHub.extras[key]); });
});
el.carFromP.addEventListener("change", () => { const h = state.vehicleHub; h.fromP = el.carFromP.value; h.fromD = ""; fillDistrictSelect(el.carFromD, h.fromP, ""); clearCarRoute(); renderCarFavorites(); });
el.carFromD.addEventListener("change", () => { state.vehicleHub.fromD = el.carFromD.value; clearCarRoute(); renderCarFavorites(); });
el.carToP.addEventListener("change", () => { const h = state.vehicleHub; h.toP = el.carToP.value; h.toD = ""; fillDistrictSelect(el.carToD, h.toP, ""); clearCarRoute(); renderCarFavorites(); });
el.carToD.addEventListener("change", () => { state.vehicleHub.toD = el.carToD.value; clearCarRoute(); renderCarFavorites(); });
el.expHistToggle.addEventListener("click", () => {
  const open = el.expHistList.hidden;
  el.expHistList.hidden = !open;
  el.expHistToggle.setAttribute("aria-expanded", String(open));
  el.expHistToggle.classList.toggle("is-open", open);
});

el.addHolding.addEventListener("click", addHolding);
el.addIncome.addEventListener("click", addIncome);
el.shareMonthlySummary.addEventListener("click", shareMonthlySummary);
el.monthlyShareClose.addEventListener("click", closeMonthlyShareModal);
el.monthlyShareBackdrop.addEventListener("click", closeMonthlyShareModal);
el.monthlyShareUpload.addEventListener("click", () => el.monthlySharePhotoInput.click());
el.monthlyShareRandom.addEventListener("click", useRandomMonthlySharePhoto);
el.monthlySharePhotoInput.addEventListener("change", handleMonthlySharePhotoChange);
el.monthlyShareCopy.addEventListener("click", copyMonthlyShare);
el.monthlyShareDownload.addEventListener("click", () => { if (monthlySharePreviewState) downloadMonthlyShare(monthlySharePreviewState.blob); });
el.monthlyShareSystem.addEventListener("click", shareMonthlyImage);
el.portCcyToggle.addEventListener("click", () => { state.portTotalUSD = !state.portTotalUSD; refreshPortfolio(); });
el.expenses.addEventListener("input", () => { state.monthlyExpenses = parseNumber(el.expenses.value); refresh(); });
el.expenses.addEventListener("blur", () => { if (state.monthlyExpenses > 0) el.expenses.value = formatThousands(state.monthlyExpenses); });

el.realMode.addEventListener("change", () => { state.realMode = el.realMode.checked; el.inflationField.hidden = !state.realMode; refresh(); });

const soundToggle = document.getElementById("soundToggle");
soundToggle.addEventListener("change", () => { state.sound = soundToggle.checked; saveState(); if (state.sound) sfx("toggle"); });
const motionToggle = document.getElementById("motionToggle");
motionToggle.addEventListener("change", () => applyMotion(motionToggle.checked));
el.inflation.addEventListener("input", () => { state.inflation[state.currency] = parseDecimal(el.inflation.value); refresh(); });

el.notifyToggle.addEventListener("change", () => setNotificationsEnabled(el.notifyToggle.checked));
el.vehicleNotifyDays.addEventListener("change", () => {
  state.notifications.vehicleDays = Math.max(0, Math.min(30, Math.round(parseNumber(el.vehicleNotifyDays.value))));
  el.vehicleNotifyDays.value = String(state.notifications.vehicleDays);
  saveState(); checkVehicleNotifications();
});
el.homeAddPriceAlert.addEventListener("click", addPriceAlert);
el.homePriceAlertTarget.addEventListener("keydown", (e) => { if (e.key === "Enter") addPriceAlert(); });
el.resetHomeCards.addEventListener("click", resetHomeLayout);
el.installPwa.addEventListener("click", installPwa);
el.exportData.addEventListener("click", exportBackup);
el.importData.addEventListener("change", importBackup);

document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => applyLanguage(b.dataset.lang)));
document.querySelectorAll("[data-theme-pick]").forEach((b) => b.addEventListener("click", () => applyTheme(b.dataset.themePick)));

// ---- Bottom navigation ----
(function () {
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const tabbar = document.querySelector(".tabbar");
  const homeTab = document.querySelector('.tab[data-view="home"]');
  const fffNavToggle = document.querySelector("[data-fff-nav-toggle]");
  const toast = document.getElementById("toast");
  let toastTimer;
  function isFffDesktopNav() {
    return document.documentElement.dataset.theme === "fff" && window.matchMedia("(min-width: 1181px)").matches;
  }
  function setFffNavCollapsed(collapsed) {
    if (!tabbar || !homeTab || !isFffDesktopNav()) return;
    tabbar.classList.toggle("is-collapsed", collapsed);
    homeTab.setAttribute("aria-expanded", String(!collapsed));
    if (fffNavToggle) fffNavToggle.setAttribute("aria-expanded", String(!collapsed));
  }
  function toggleFffNav() {
    if (!tabbar) return;
    setFffNavCollapsed(!tabbar.classList.contains("is-collapsed"));
  }
  fffNavToggle?.addEventListener("click", () => {
    if (isFffDesktopNav()) toggleFffNav();
  });
  function showToast(msg) { showAppToast(msg); }
  function setActive(tab) {
    tabs.forEach((tt) => { const on = tt === tab; tt.classList.toggle("is-active", on); if (on) tt.setAttribute("aria-current", "page"); else tt.removeAttribute("aria-current"); });
  }
  function showView(name) {
    if (name !== "home") setHomeDashboardEditing(false);
    syncFffTerminalPage(name);
    document.getElementById("view-home").hidden = name !== "home";
    document.getElementById("view-savings").hidden = name !== "savings";
    document.getElementById("view-car").hidden = name !== "car";
    document.getElementById("view-settings").hidden = name !== "settings";
    document.getElementById("view-portfolio").hidden = name !== "portfolio";
    document.getElementById("view-income").hidden = name !== "income";
    document.getElementById("view-watch").hidden = name !== "watch";
    if (name === "savings") { rollExpenseMonth(); buildExpenses(); }
    if (name === "car") { rollExpenseMonth(); buildCarHub(true); }
    if (name === "portfolio") refreshPortfolio();
    if (name === "income") refreshIncome();
    if (name === "watch") { refreshWatchData(); buildTopPerformers(); buildTrPanel(); }
    if (name === "home" || name === "watch") { syncBubbles(); kickBubbles(); }
    else stopBubbles(); // pause the bubble animation loop off the dashboard views
    if (name === "settings") { preloadThemeWallpapers(); renderHomeCardSettings(); renderPwaSettings(); renderNotificationSettings(); }
    if (name === "home") renderHomeDashboard();
    window.scrollTo({ top: 0, behavior: "auto" });
    window.requestAnimationFrame(() => replayFffViewMotion(document.getElementById(`view-${name}`)));
  }
  navigateToAppView = (name) => {
    const tab = tabs.find((candidate) => candidate.dataset.view === name);
    if (!tab || tab.hasAttribute("data-soon")) return false;
    tab.classList.remove("is-bouncing");
    void tab.offsetWidth;
    tab.classList.add("is-bouncing");
    setActive(tab);
    showView(name);
    return true;
  };
  tabs.forEach((tab) => {
    tab.addEventListener("animationend", () => tab.classList.remove("is-bouncing"));
    tab.addEventListener("click", () => {
      if (tab.hasAttribute("data-soon")) { showToast(t("more_soon")); return; }
      const view = tab.dataset.view;
      if (!view) return;
      if (view === "home" && isFffDesktopNav() && tab.classList.contains("is-active")) {
        toggleFffNav();
        return;
      }
      if (view === "home") setFffNavCollapsed(false);
      navigateToAppView(view);
    });
  });
})();

// ---- Persistence (localStorage; survives page refresh) ----
function persistedState() {
  return {
    v: 2,
    lang: state.lang, theme: state.theme, currency: state.currency,
    monthlyExpenses: state.monthlyExpenses, realMode: state.realMode, sound: state.sound, motion: state.motion,
    inflation: state.inflation, rates: state.rates, realEstate: state.realEstate,
    expenses: state.expenses, monthlyBudget: state.monthlyBudget, vehicles: state.vehicles, vehSeq: state.vehSeq,
    vehicleHub: state.vehicleHub,
    income: state.income, portfolio: state.portfolio, netWorth: state.netWorth, watchlist: state.watchlist,
    notifications: state.notifications, homeLayout: state.homeLayout, weather: state.weather, savingsGoals: state.savingsGoals, homeNotes: state.homeNotes, countdowns: state.countdowns, portTotalUSD: state.portTotalUSD,
  };
}

function saveState() {
  try { localStorage.setItem("numbr_state", JSON.stringify(persistedState())); } catch (e) {}
  renderFffOperatorHud();
  schedulePushSync();
}

function exportBackup() {
  saveState();
  const now = new Date();
  const backup = { format: "numbrrr-backup", version: 1, exportedAt: now.toISOString(), data: persistedState() };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `numbrrr-yedek-${localDateKey(now)}.json`;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  try { localStorage.setItem("numbr_last_backup", now.toISOString()); } catch (e) {}
  if (el.backupStatus) el.backupStatus.textContent = t("backup_ready", { date: now.toLocaleString(state.lang === "tr" ? "tr-TR" : "en-US") });
}

function validBackupState(value) {
  return value && typeof value === "object" && !Array.isArray(value) &&
    (value.currency === "USD" || value.currency === "TL") &&
    (value.lang === "en" || value.lang === "tr") &&
    value.expenses && typeof value.expenses === "object" &&
    Array.isArray(value.vehicles) && value.portfolio && typeof value.portfolio === "object";
}

async function importBackup(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = "";
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showAppToast(t("backup_too_large")); return; }
  try {
    const parsed = JSON.parse(await file.text());
    const restored = parsed && parsed.format === "numbrrr-backup" ? parsed.data : parsed;
    if (!validBackupState(restored)) throw new Error("invalid backup");
    if (!window.confirm(t("backup_confirm"))) return;
    restored.theme = normalizeTheme(restored.theme);
    localStorage.setItem("numbr_state", JSON.stringify(restored));
    localStorage.setItem("numbr_lang", restored.lang);
    localStorage.setItem("numbr_theme", restored.theme);
    localStorage.setItem("numbr_currency", restored.currency);
    if (el.backupStatus) el.backupStatus.textContent = t("backup_imported");
    setTimeout(() => window.location.reload(), 350);
  } catch (e) {
    showAppToast(t("backup_invalid"));
    if (el.backupStatus) el.backupStatus.textContent = t("backup_invalid");
  }
}
function loadState() {
  let s;
  try { s = JSON.parse(localStorage.getItem("numbr_state") || "null"); } catch (e) { return; }
  if (!s) return;
  if (s.lang && I18N[s.lang]) state.lang = s.lang;
  state.theme = normalizeTheme(s.theme);
  if (s.currency && CURRENCY_META[s.currency]) state.currency = s.currency;
  if (typeof s.monthlyExpenses === "number") state.monthlyExpenses = s.monthlyExpenses;
  if (typeof s.realMode === "boolean") state.realMode = s.realMode;
  if (typeof s.sound === "boolean") state.sound = s.sound;
  if (typeof s.motion === "boolean") state.motion = s.motion;
  if (s.inflation && typeof s.inflation === "object") {
    ["USD", "TL"].forEach((cur) => { if (Number.isFinite(s.inflation[cur])) state.inflation[cur] = s.inflation[cur]; });
  }
  if (s.rates && typeof s.rates === "object") {
    ["USD", "TL"].forEach((cur) => {
      if (!s.rates[cur] || typeof s.rates[cur] !== "object") return;
      INSTRUMENTS[cur].forEach((inst) => { if (Number.isFinite(s.rates[cur][inst.id])) state.rates[cur][inst.id] = s.rates[cur][inst.id]; });
    });
  }
  if (s.realEstate && typeof s.realEstate === "object") {
    ["USD", "TL"].forEach((cur) => {
      const re = s.realEstate[cur];
      if (!re || typeof re !== "object") return;
      state.realEstate[cur] = {
        propertyValue: Number.isFinite(re.propertyValue) ? Math.max(0, re.propertyValue) : 0,
        monthlyRent: Number.isFinite(re.monthlyRent) ? Math.max(0, re.monthlyRent) : 0,
        netYield: !!re.netYield,
      };
    });
  }
  if (s.expenses && Array.isArray(s.expenses.recurring)) {
    const e = s.expenses;
    state.expenses = {
      month: e.month || "", recurring: e.recurring || [], oneoff: e.oneoff || [],
      history: e.history || [], recSeq: e.recSeq || 0, oneSeq: e.oneSeq || 0,
    };
  }
  if (s.monthlyBudget && typeof s.monthlyBudget === "object") {
    const seenBudgetIds = new Set();
    const items = Array.isArray(s.monthlyBudget.items) ? s.monthlyBudget.items.map((item) => ({
      id: typeof item.id === "string" ? item.id.slice(0, 40) : "",
      currency: item.currency === "TL" ? "TL" : "USD",
      category: [...EXPENSE_CATS, "vehicle", "custom"].includes(item.category) ? item.category : "custom",
      label: typeof item.label === "string" ? item.label.trim().slice(0, 40) : "",
      limit: Number.isFinite(item.limit) ? Math.max(0, item.limit) : 0,
    })).filter((item) => {
      if (!item.id || !(item.limit > 0) || (item.category === "custom" && !item.label) || seenBudgetIds.has(item.id)) return false;
      seenBudgetIds.add(item.id); return true;
    }).slice(0, 100) : [];
    const highestBudgetSeq = items.reduce((max, item) => Math.max(max, Number((/^b(\d+)$/.exec(item.id) || [])[1]) || 0), 0);
    state.monthlyBudget = { items, seq: Math.max(Number.isFinite(s.monthlyBudget.seq) ? Math.round(s.monthlyBudget.seq) : 0, highestBudgetSeq) };
  }
  if (Array.isArray(s.vehicles)) {
    const seenVehicleIds = new Set();
    state.vehicles = s.vehicles
      .filter((v) => {
        if (!v || typeof v !== "object" || typeof v.id !== "string") return false;
        const id = v.id.trim().slice(0, 40);
        if (!id || seenVehicleIds.has(id)) return false;
        seenVehicleIds.add(id);
        return true;
      })
      .slice(0, 50)
      .map((v) => {
        const sched = Array.isArray(v.sched) ? v.sched.filter((item) => item && typeof item === "object").slice(0, 100) : [];
        const oneoff = Array.isArray(v.oneoff) ? v.oneoff.filter((item) => item && typeof item === "object").slice(0, 500) : [];
        return {
          id: v.id.trim().slice(0, 40),
          plate: typeof v.plate === "string" ? v.plate.slice(0, 80) : "",
          fuel: CAR_FUELS.includes(v.fuel) ? v.fuel : "gas",
          consumption: Number.isFinite(v.consumption) ? Math.max(0, v.consumption) : 0,
          price: Number.isFinite(v.price) ? Math.max(0, v.price) : 0,
          lastMonthSpent: Number.isFinite(v.lastMonthSpent) ? Math.max(0, v.lastMonthSpent) : 0,
          sched,
          oneoff,
          schedSeq: Number.isFinite(v.schedSeq) ? Math.max(0, Math.round(v.schedSeq)) : sched.length,
          expSeq: Number.isFinite(v.expSeq) ? Math.max(0, Math.round(v.expSeq)) : oneoff.length,
        };
      });
  }
  const highestVehicleSeq = state.vehicles.reduce((max, vehicle) => Math.max(max, Number((/^v(\d+)$/.exec(vehicle.id) || [])[1]) || 0), 0);
  state.vehSeq = Math.max(Number.isFinite(s.vehSeq) ? Math.max(0, Math.round(s.vehSeq)) : 0, highestVehicleSeq);
  if (s.vehicleHub && typeof s.vehicleHub === "object") {
    const v = s.vehicleHub;
    state.vehicleHub = {
      activeVehicle: v.activeVehicle || "",
      trips: Array.isArray(v.trips) ? v.trips : [],
      fromP: v.fromP || v.from || "", fromD: v.fromD || "", toP: v.toP || v.to || "", toD: v.toD || "",
      lastRoute: v.lastRoute || null, seq: v.seq || 0,
      tripType: v.tripType === "roundtrip" ? "roundtrip" : "oneway",
      extras: v.extras && typeof v.extras === "object" ? {
        toll: Number.isFinite(v.extras.toll) ? Math.max(0, v.extras.toll) : 0,
        parking: Number.isFinite(v.extras.parking) ? Math.max(0, v.extras.parking) : 0,
        other: Number.isFinite(v.extras.other) ? Math.max(0, v.extras.other) : 0,
      } : { toll: 0, parking: 0, other: 0 },
      favorites: Array.isArray(v.favorites) ? v.favorites.filter((f) => f && typeof f.id === "string") : [],
      favSeq: Number.isFinite(v.favSeq) ? v.favSeq : 0,
    };
    // Migrate legacy separate car "profiles" onto vehicles (fuel specs merged into the car).
    if (Array.isArray(v.profiles) && v.profiles.length) {
      v.profiles.forEach((p, i) => {
        let veh = state.vehicles[i];
        if (!veh) { veh = { id: "v" + ++state.vehSeq, plate: "", fuel: "gas", consumption: 0, price: 0, sched: [], oneoff: [], schedSeq: 0, expSeq: 0 }; state.vehicles.push(veh); }
        if (!veh.plate && p.name) veh.plate = p.name;
        if (!veh.consumption && p.consumption) veh.consumption = p.consumption;
        if (!veh.price && p.price) veh.price = p.price;
        if (p.fuel) veh.fuel = p.fuel;
      });
    }
  }
  if (s.income && typeof s.income === "object") {
    const amounts = s.income.amounts && typeof s.income.amounts === "object" ? s.income.amounts : {};
    const passive = s.income.passive && typeof s.income.passive === "object" ? s.income.passive : {};
    const custom = Array.isArray(s.income.custom) ? s.income.custom.filter((c) => c && typeof c.id === "string") : [];
    state.income = { amounts: {}, passive: {}, custom, seq: Number.isFinite(s.income.seq) ? s.income.seq : custom.length };
    INCOME_CATEGORIES.forEach((c) => {
      state.income.amounts[c.id] = Number.isFinite(amounts[c.id]) ? amounts[c.id] : 0;
      state.income.passive[c.id] = typeof passive[c.id] === "boolean" ? passive[c.id] : c.passive;
    });
    custom.forEach((c) => {
      state.income.amounts[c.id] = Number.isFinite(amounts[c.id]) ? amounts[c.id] : 0;
      state.income.passive[c.id] = !!passive[c.id];
      c.label = typeof c.label === "string" ? c.label : "";
    });
  }
  if (s.portfolio && typeof s.portfolio === "object") {
    const holdings = Array.isArray(s.portfolio.holdings) ? s.portfolio.holdings.filter((h) => h && typeof h.id === "string") : [];
    const transactions = Array.isArray(s.portfolio.transactions) ? s.portfolio.transactions.map((tx) => ({
      id: typeof tx.id === "string" ? tx.id.slice(0, 80) : "",
      type: ["BUY", "SELL", "SWAP"].includes(tx.type) ? tx.type : "BUY",
      assetKey: typeof tx.assetKey === "string" ? tx.assetKey.slice(0, 120) : "",
      asset: typeof tx.asset === "string" ? tx.asset.slice(0, 30) : "",
      targetAssetKey: typeof tx.targetAssetKey === "string" ? tx.targetAssetKey.slice(0, 120) : "",
      targetAsset: typeof tx.targetAsset === "string" ? tx.targetAsset.slice(0, 30) : "",
      amount: Number.isFinite(tx.amount) ? Math.max(0, tx.amount) : 0,
      price: Number.isFinite(tx.price) ? Math.max(0, tx.price) : 0,
      priceApp: Number.isFinite(tx.priceApp) ? Math.max(0, tx.priceApp) : 0,
      total: Number.isFinite(tx.total) ? Math.max(0, tx.total) : 0,
      totalApp: Number.isFinite(tx.totalApp) ? Math.max(0, tx.totalApp) : 0,
      quoteCurrency: typeof tx.quoteCurrency === "string" ? tx.quoteCurrency.slice(0, 8) : "USD",
      appCurrency: tx.appCurrency === "TRY" ? "TRY" : "USD",
      occurredAt: typeof tx.occurredAt === "string" ? tx.occurredAt.slice(0, 40) : new Date().toISOString(),
      source: tx.source === "manual-command" ? "manual-command" : "manual",
      note: typeof tx.note === "string" ? tx.note.slice(0, 240) : "",
      fee: tx.fee && typeof tx.fee === "object" ? { amount: Number.isFinite(tx.fee.amount) ? Math.max(0, tx.fee.amount) : 0, currency: typeof tx.fee.currency === "string" ? tx.fee.currency.slice(0, 8) : "USD" } : { amount: 0, currency: "USD" },
      legs: Array.isArray(tx.legs) ? tx.legs.slice(0, 4).map((leg) => ({ assetKey: typeof leg.assetKey === "string" ? leg.assetKey.slice(0, 120) : "", asset: typeof leg.asset === "string" ? leg.asset.slice(0, 30) : "", direction: leg.direction === "out" ? "out" : "in", amount: Number.isFinite(leg.amount) ? Math.max(0, leg.amount) : 0, totalApp: Number.isFinite(leg.totalApp) ? Math.max(0, leg.totalApp) : 0 })) : undefined,
    })).filter((tx) => tx.id && tx.assetKey).slice(-1000) : [];
    state.portfolio = {
      holdings,
      seq: Number.isFinite(s.portfolio.seq) ? s.portfolio.seq : holdings.length,
      target: s.portfolio.target && typeof s.portfolio.target === "object" ? s.portfolio.target : { USD: [SAVINGS_DEFAULT_INVEST.USD], TL: [SAVINGS_DEFAULT_INVEST.TL] },
      transactions,
      txSeq: Math.max(Number.isFinite(s.portfolio.txSeq) ? s.portfolio.txSeq : 0, transactions.reduce((max, tx) => Math.max(max, Number((/^tx(\d+)$/.exec(tx.id) || [])[1]) || 0), 0)),
    };
  }
  if (s.netWorth && typeof s.netWorth === "object") {
    ["USD", "TL"].forEach((currency) => {
      const liability = s.netWorth.liabilities && s.netWorth.liabilities[currency];
      state.netWorth.liabilities[currency] = Number.isFinite(liability) ? Math.max(0, liability) : 0;
      const seenMonths = new Set();
      const history = s.netWorth.history && Array.isArray(s.netWorth.history[currency]) ? s.netWorth.history[currency] : [];
      state.netWorth.history[currency] = history.map((item) => {
        const assets = Number.isFinite(item.assets) ? Math.max(0, item.assets) : 0;
        const liabilities = Number.isFinite(item.liabilities) ? Math.max(0, item.liabilities) : 0;
        return { month: typeof item.month === "string" ? item.month : "", assets, liabilities, net: assets - liabilities };
      }).filter((item) => {
        if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(item.month) || seenMonths.has(item.month)) return false;
        seenMonths.add(item.month); return true;
      }).sort((a, b) => a.month.localeCompare(b.month)).slice(-60);
    });
  }
  if (Array.isArray(s.watchlist)) state.watchlist = s.watchlist.filter((w) => w && typeof w.type === "string" && typeof w.key === "string");
  if (s.notifications && typeof s.notifications === "object") {
    const n = s.notifications;
    const alerts = Array.isArray(n.priceAlerts) ? n.priceAlerts.filter((a) => a && typeof a.id === "string" && typeof a.type === "string" && typeof a.key === "string" && ((Number.isFinite(a.target) && a.target > 0) || (Number.isFinite(a.percentage) && a.percentage > 0))).slice(0, 100).map((a) => ({
      id: a.id, type: a.type, key: a.key, name: typeof a.name === "string" ? a.name : "", sym: typeof a.sym === "string" ? a.sym : "",
      condition: ["percent_up", "percent_down"].includes(a.condition) ? a.condition : a.condition === "below" ? "below" : "above", target: Number.isFinite(a.target) ? a.target : 0,
      percentage: Number.isFinite(a.percentage) ? a.percentage : undefined, referencePrice: Number.isFinite(a.referencePrice) ? a.referencePrice : 0,
      ccy: a.ccy === "TRY" ? "TRY" : "USD", triggered: !!a.triggered,
    })) : [];
    const sent = {};
    if (n.sent && typeof n.sent === "object") Object.keys(n.sent).slice(0, 300).forEach((key) => { if (typeof n.sent[key] === "string") sent[key] = n.sent[key]; });
    state.notifications = {
      enabled: !!n.enabled,
      vehicleDays: Number.isFinite(n.vehicleDays) ? Math.max(0, Math.min(30, Math.round(n.vehicleDays))) : 7,
      priceAlerts: alerts,
      seq: Number.isFinite(n.seq) ? n.seq : alerts.length,
      sent,
    };
  }
  state.homeLayout = s.homeLayout && typeof s.homeLayout === "object" ? s.homeLayout : state.homeLayout;
  if (s.weather && typeof s.weather === "object") {
    const savedLocation = s.weather.location;
    const latitude = savedLocation && Number(savedLocation.latitude);
    const longitude = savedLocation && Number(savedLocation.longitude);
    if (savedLocation && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180) {
      state.weather.location = {
        name: typeof savedLocation.name === "string" && savedLocation.name.trim() ? savedLocation.name.trim().slice(0, 80) : "İstanbul",
        latitude,
        longitude,
      };
    }
    state.weather.data = normalizeWeatherData(s.weather.data);
    state.weather.updatedAt = state.weather.data && Number.isFinite(s.weather.updatedAt) ? Math.max(0, Math.min(Date.now(), s.weather.updatedAt)) : 0;
  }
  if (s.savingsGoals && typeof s.savingsGoals === "object") {
    const seenGoalIds = new Set();
    const items = Array.isArray(s.savingsGoals.items) ? s.savingsGoals.items.map((goal) => ({
      id: typeof goal.id === "string" ? goal.id.slice(0, 80) : "",
      name: typeof goal.name === "string" ? goal.name.slice(0, 60) : "",
      target: Number.isFinite(goal.target) ? Math.max(0, goal.target) : 0,
      current: Number.isFinite(goal.current) ? Math.max(0, goal.current) : 0,
      currency: goal.currency === "USD" ? "USD" : "TL",
    })).filter((goal) => {
      if (!goal.id || !goal.name || !(goal.target > 0) || seenGoalIds.has(goal.id)) return false;
      seenGoalIds.add(goal.id); return true;
    }).slice(0, 100) : [];
    const highestGoalSeq = items.reduce((max, goal) => Math.max(max, Number((/^sg(\d+)$/.exec(goal.id) || [])[1]) || 0), 0);
    state.savingsGoals = { items, seq: Math.max(Number.isFinite(s.savingsGoals.seq) ? Math.round(s.savingsGoals.seq) : 0, highestGoalSeq) };
  }
  if (s.homeNotes && typeof s.homeNotes === "object") {
    const seenNoteIds = new Set();
    const items = Array.isArray(s.homeNotes.items) ? s.homeNotes.items.map((note) => ({
      id: typeof note.id === "string" ? note.id.slice(0, 80) : "",
      text: typeof note.text === "string" ? note.text.slice(0, 120) : "",
      done: !!note.done,
    })).filter((note) => {
      if (!note.id || !note.text || seenNoteIds.has(note.id)) return false;
      seenNoteIds.add(note.id); return true;
    }).slice(0, 50) : [];
    const highestNoteSeq = items.reduce((max, note) => Math.max(max, Number((/^hn(\d+)$/.exec(note.id) || [])[1]) || 0), 0);
    state.homeNotes = { items, seq: Math.max(Number.isFinite(s.homeNotes.seq) ? Math.round(s.homeNotes.seq) : 0, highestNoteSeq) };
  }
  if (s.countdowns && typeof s.countdowns === "object") {
    const seenCountdownIds = new Set();
    const items = Array.isArray(s.countdowns.items) ? s.countdowns.items.map((item) => {
      const date = typeof item.date === "string" && parseDateInput(item.date) ? item.date : "";
      const storedTarget = typeof item.target === "string" && Number.isFinite(Date.parse(item.target)) ? new Date(item.target).toISOString() : "";
      return {
        id: typeof item.id === "string" ? item.id.slice(0, 80) : "",
        name: typeof item.name === "string" ? item.name.slice(0, 80) : "",
        category: typeof item.category === "string" ? item.category.slice(0, 40) : "",
        date,
        target: storedTarget || (date ? parseDateInput(date).toISOString() : ""),
        unit: item.unit === "months" ? "months" : "days",
      };
    }).filter((item) => {
      if (!item.id || !item.name || !item.target || seenCountdownIds.has(item.id)) return false;
      seenCountdownIds.add(item.id); return true;
    }).slice(0, 200) : [];
    const highestItemSeq = items.reduce((max, item) => Math.max(max, Number((/^cd(\d+)$/.exec(item.id) || [])[1]) || 0), 0);
    const savedSeq = Number.isFinite(s.countdowns.seq) ? Math.max(0, Math.round(s.countdowns.seq)) : 0;
    const savedOrder = Array.isArray(s.countdowns.order) ? s.countdowns.order.filter((id) => typeof id === "string").slice(0, 200) : [];
    state.countdowns = { items, order: normalizeCountdownOrder(savedOrder, items), seq: Math.max(savedSeq, highestItemSeq) };
  }
  state.homeLayout = normalizeHomeLayout(state.homeLayout);
  if (typeof s.portTotalUSD === "boolean") state.portTotalUSD = s.portTotalUSD;
  // normalize any legacy/removed asset types from older saves
  if (state.portfolio && Array.isArray(state.portfolio.holdings)) {
    state.portfolio.holdings.forEach((h) => {
      if (!ASSET_TYPES.includes(h.assetType)) h.assetType = h.assetType === "stocks" ? "usstock" : "cash";
    });
  }
}

// ---- Init ----
// Detect a brand-new user BEFORE anything writes to localStorage (applyLanguage/
// refresh call saveState, which would otherwise create numbr_state immediately).
let isFirstRun = false;
try { isFirstRun = !(localStorage.getItem("numbr_onboarded") || localStorage.getItem("numbr_state")); } catch (e) {}

try {
  const savedLang = localStorage.getItem("numbr_lang");
  const savedCur = localStorage.getItem("numbr_currency");
  if (savedLang && I18N[savedLang]) state.lang = savedLang;
  const savedTheme = localStorage.getItem("numbr_theme");
  state.theme = normalizeTheme(savedTheme || state.theme);
  localStorage.setItem("numbr_theme", state.theme);
  if (savedCur && CURRENCY_META[savedCur]) state.currency = savedCur;
} catch (e) {}
loadState(); // full saved snapshot restores user data while keeping the only available theme
hydrateHomeMarketCache(); // show the latest small cached quote snapshot on the first paint
rollExpenseMonth(); // archive past months + start the current month before rendering

el.expenses.value = formatThousands(state.monthlyExpenses);
el.inflation.value = formatRate(state.inflation[state.currency], false);
if (el.savingsGoalCurrency) el.savingsGoalCurrency.value = state.currency;
applyTheme(state.theme);
soundToggle.checked = state.sound;
applyMotion(state.motion);
applyLanguage(state.lang); // builds layout + savings, applies all translations
selectFffHudCat();
syncFffTerminalPage("home");
renderFffTerminalClock();

if (isFirstRun) showOnboarding();
else { try { if (!localStorage.getItem("numbr_guide_seen")) showGuide(); } catch (e) {} }
wireWatchSearch();
wirePriceAlertSearch();
wireHomeDashboard();
wireSmartCommand();
setupScrollReveal();

let startupBackgroundStarted = false;
function startStartupBackgroundWork() {
  if (startupBackgroundStarted) return;
  startupBackgroundStarted = true;
  refreshHomeMarketSummary();
  refreshCryptoPrices();
  runNotificationChecks();
  setTimeout(refreshWatchData, 450);
  setTimeout(registerPwa, 900);
}
function scheduleStartupBackgroundWork() {
  const queue = () => {
    if (typeof requestIdleCallback === "function") requestIdleCallback(startStartupBackgroundWork, { timeout: 700 });
    else setTimeout(startStartupBackgroundWork, 120);
  };
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => requestAnimationFrame(queue));
  else setTimeout(queue, 0);
}
scheduleStartupBackgroundWork();

setInterval(() => { checkVehicleNotifications(); refreshWatchData(); }, 60 * 60 * 1000);
setInterval(renderCountdowns, 60 * 1000);
setInterval(renderFffTerminalClock, 30 * 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) { checkVehicleNotifications(); refreshWatchData(); renderFffTerminalClock(); } syncCommandOrbMotion(); });
