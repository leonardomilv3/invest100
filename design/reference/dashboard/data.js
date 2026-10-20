// Mock data for the Investidor100 dashboard UI kit (pt-BR, B3 tickers). Values are illustrative.
(function () {
  const fmt = (v, d = 2) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const brl = v => 'R$\u00a0' + fmt(v);
  const signedBrl = v => (v >= 0 ? '+' : '\u2212') + 'R$\u00a0' + fmt(Math.abs(v));
  const compact = v => v >= 1e12 ? fmt(v / 1e12, 2) + ' tri' : v >= 1e9 ? fmt(v / 1e9, 1) + ' bi' : v >= 1e6 ? fmt(v / 1e6, 1) + ' mi' : v >= 1e3 ? fmt(v / 1e3, 1) + ' mil' : fmt(v, 0);
  function rng(seed) { let s = (seed >>> 0) || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function makeBars(seed, peak) {
    const r = rng(seed);
    const b = Array.from({ length: 24 }, () => { const x = r(); return { value: 0.32 + r() * 0.5, tone: x < 0.55 ? 'positive' : x < 0.78 ? 'low' : 'negative' }; });
    if (peak != null) b[peak] = { value: 0.97, tone: 'positive' };
    return b;
  }
  function makeSeries(seed, n = 60) {
    const r = rng(seed); let v = 52; const out = [];
    for (let i = 0; i < n; i++) { v += (r() - 0.47) * 5.5; v = Math.max(32, Math.min(76, v)); out.push(+v.toFixed(2)); }
    return out;
  }

  const stocks = [
    { symbol: 'PETR4', name: 'Petrobras', sector: 'Energia', price: 38.42, change: 2.45, high: 38.9, low: 37.61, cap: 512.3e9, volume: 61.2e6, trades: 11200 },
    { symbol: 'VALE3', name: 'Vale', sector: 'Mineração', price: 61.07, change: -0.78, high: 61.88, low: 60.52, cap: 276.8e9, volume: 24.5e6, trades: 14000 },
    { symbol: 'ITUB4', name: 'Itaú Unibanco', sector: 'Financeiro', price: 34.9, change: 1.12, high: 35.1, low: 34.4, cap: 341.0e9, volume: 29.8e6, trades: 21000 },
    { symbol: 'BBDC4', name: 'Bradesco', sector: 'Financeiro', price: 13.21, change: -0.45, high: 13.4, low: 13.05, cap: 140.2e9, volume: 41.3e6, trades: 3200 },
    { symbol: 'BBAS3', name: 'Banco do Brasil', sector: 'Financeiro', price: 27.86, change: 3.12, high: 28.02, low: 27.0, cap: 159.4e9, volume: 12.4e6, trades: 987 },
    { symbol: 'WEGE3', name: 'WEG', sector: 'Industrial', price: 41.25, change: 0.25, high: 41.6, low: 40.88, cap: 173.1e9, volume: 9.7e6, trades: 1300 },
    { symbol: 'ABEV3', name: 'Ambev', sector: 'Consumo', price: 12.84, change: -1.16, high: 13.02, low: 12.8, cap: 202.5e9, volume: 10.2e6, trades: 1100 },
    { symbol: 'MGLU3', name: 'Magazine Luiza', sector: 'Varejo', price: 9.47, change: -3.41, high: 9.95, low: 9.4, cap: 6.4e9, volume: 15.6e6, trades: 1800 },
    { symbol: 'B3SA3', name: 'B3', sector: 'Financeiro', price: 12.85, change: 0.94, high: 12.99, low: 12.7, cap: 69.8e9, volume: 18.0e6, trades: 2400 },
    { symbol: 'RENT3', name: 'Localiza', sector: 'Consumo', price: 44.1, change: 1.87, high: 44.5, low: 43.2, cap: 47.1e9, volume: 6.1e6, trades: 900 },
    { symbol: 'SUZB3', name: 'Suzano', sector: 'Materiais', price: 57.33, change: -0.62, high: 58.0, low: 56.9, cap: 72.9e9, volume: 3.9e6, trades: 760 },
    { symbol: 'PRIO3', name: 'PRIO', sector: 'Energia', price: 42.18, change: 4.05, high: 42.6, low: 40.7, cap: 35.6e9, volume: 8.8e6, trades: 1500 },
  ];

  const holdings = {
    'Ações': [
      { symbol: 'PETR4', name: 'Petrobras', value: 142310.4, change: 24.45 },
      { symbol: 'VALE3', name: 'Vale', value: 98204.11, change: 8.12 },
      { symbol: 'ITUB4', name: 'Itaú Unibanco', value: 76880.0, change: 12.4 },
      { symbol: 'WEGE3', name: 'WEG', value: 54120.75, change: 31.02 },
      { symbol: 'ABEV3', name: 'Ambev', value: 28490.1, change: -4.12 },
      { symbol: 'BBAS3', name: 'Banco do Brasil', value: 22520.46, change: 6.3 },
    ],
    'Renda fixa': [
      { symbol: 'SELIC29', name: 'Tesouro Selic 2029', value: 45210.0, change: 10.85 },
      { symbol: 'CDB120', name: 'CDB 120% CDI', value: 30000.0, change: 11.2 },
      { symbol: 'LCA98', name: 'LCA 98% CDI', value: 15400.0, change: 9.1 },
    ],
    'Commodities': [
      { symbol: 'GOLD11', name: 'Ouro', value: 8420.1, change: 18.3 },
      { symbol: 'AGRI11', name: 'Agronegócio', value: 3120.45, change: -2.4 },
    ],
    'Índices': [
      { symbol: 'BOVA11', name: 'iShares Ibovespa', value: 12300.55, change: 6.72 },
      { symbol: 'IVVB11', name: 'iShares S&P 500', value: 9870.2, change: 21.4 },
    ],
  };

  const recent = [
    { symbol: 'VALE3', company: 'Vale S.A.', value: 4525.82 },
    { symbol: 'WEGE3', company: 'WEG S.A.', value: 7892.56 },
    { symbol: 'ITUB4', company: 'Itaú Unibanco', value: 6721.93 },
    { symbol: 'BBAS3', company: 'Banco do Brasil', value: 3142.9 },
    { symbol: 'ABEV3', company: 'Ambev S.A.', value: 2845.64 },
    { symbol: 'PRIO3', company: 'PRIO S.A.', value: 7892.56 },
  ];

  const transactions = [
    { id: 't1', side: 'buy', symbol: 'PETR4', date: '12 out 2025', price: 38.42, qty: 50 },
    { id: 't2', side: 'buy', symbol: 'WEGE3', date: '11 out 2025', price: 41.25, qty: 20 },
    { id: 't3', side: 'sell', symbol: 'MGLU3', date: '10 out 2025', price: 9.47, qty: 100 },
    { id: 't4', side: 'sell', symbol: 'ABEV3', date: '08 out 2025', price: 12.84, qty: 40 },
  ];

  window.I100Data = {
    fmt, brl, signedBrl, compact, rng, makeBars, makeSeries,
    stocks, holdings, recent, transactions,
    watchlist: ['ITUB4', 'WEGE3', 'B3SA3', 'RENT3', 'PRIO3'],
    months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    monthsShort: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    user: { name: 'Marina Costa', email: 'marina@investidor100.com.br' },
    ibov: { value: '128.021,16', upper: [44, 45, 56, 60, 61, 68, 76], lower: [30, 29, 33, 34, 36, 52, 66] },
    stock: s => stocks.find(x => x.symbol === s),
  };
})();
