// Mock data — Investidor100 Finanças (pt-BR). Illustrative values only.
(function () {
  const fmt = (v, d = 2) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const brl = v => (v < 0 ? '\u2212' : '') + 'R$\u00a0' + fmt(Math.abs(v));
  const signed = v => (v >= 0 ? '+' : '\u2212') + 'R$\u00a0' + fmt(Math.abs(v));
  const pct = (v, d = 2) => (v >= 0 ? '+' : '\u2212') + fmt(Math.abs(v), d) + '%';
  const parse = s => { const n = Number(String(s).replace(/\s|R\$/g, '').replace(/\./g, '').replace(',', '.')); return isFinite(n) ? n : 0; };

  const cards = [
    { id: 'c1', name: 'Cartão Black', last4: '4821', brand: 'Mastercard', tone: 'ink', limit: 15000, used: 6240.5, invoice: 3184.2, close: '03 NOV', due: '10 NOV', status: 'Aberta', recurring: 420 },
    { id: 'c2', name: 'Cartão Verde', last4: '0937', brand: 'Visa', tone: 'lime', limit: 8000, used: 2110.9, invoice: 1288.7, close: '08 NOV', due: '15 NOV', status: 'Aberta', recurring: 260 },
    { id: 'c3', name: 'Cartão Digital', last4: '5512', brand: 'Elo', tone: 'white', limit: 3000, used: 420, invoice: 420, close: '29 OUT', due: '05 NOV', status: 'Fechada', recurring: 80 },
  ];
  const installments = [
    { id: 'i1', desc: 'Notebook', sub: 'Loja de informática', category: 'compras', card: 'c1', current: 4, total: 10, amount: 489.9 },
    { id: 'i2', desc: 'Geladeira', sub: 'Eletrodomésticos', category: 'moradia', card: 'c1', current: 7, total: 12, amount: 312.5 },
    { id: 'i3', desc: 'Passagens aéreas', sub: 'Viagem de férias', category: 'viagem', card: 'c2', current: 2, total: 6, amount: 268.3 },
    { id: 'i4', desc: 'Celular', sub: 'Loja de eletrônicos', category: 'compras', card: 'c2', current: 9, total: 12, amount: 199.9 },
    { id: 'i5', desc: 'Curso de inglês', sub: 'Escola de idiomas', category: 'educacao', card: 'c1', current: 3, total: 5, amount: 159 },
    { id: 'i6', desc: 'Pneus', sub: 'Auto center', category: 'transporte', card: 'c3', current: 1, total: 4, amount: 105 },
  ];
  const budgets = { moradia: 2200, alimentacao: 1500, transporte: 500, lazer: 300, saude: 400, educacao: 350, assinaturas: 150, compras: 700, contas: 450, viagem: 400 };
  const methods = { pix: 'Pix', debito: 'Débito', conta: 'Conta corrente', dinheiro: 'Dinheiro', c1: 'Cartão Black •• 4821', c2: 'Cartão Verde •• 0937', c3: 'Cartão Digital •• 5512' };
  const months = [{ id: '08', label: 'Agosto 2026', short: '08/26' }, { id: '09', label: 'Setembro 2026', short: '09/26' }, { id: '10', label: 'Outubro 2026', short: '10/26' }];
  const base = [
    ['20', 'Supermercado', 'alimentacao', 'c1', -312.4], ['19', 'Delivery de comida', 'alimentacao', 'c2', -58.9], ['19', 'Corrida por app', 'transporte', 'pix', -23.5],
    ['18', 'Posto de combustível', 'transporte', 'c1', -220], ['17', 'Cinema', 'lazer', 'c2', -76], ['15', 'Farmácia', 'saude', 'debito', -84.3],
    ['15', 'Dividendos de FIIs', 'proventos', 'conta', 72.44], ['12', 'Restaurante', 'alimentacao', 'c1', -164.8], ['10', 'Conta de luz', 'contas', 'pix', -186.4],
    ['10', 'Internet', 'contas', 'debito', -119.9], ['08', 'Streaming de vídeo', 'assinaturas', 'c1', -55.9], ['08', 'Streaming de música', 'assinaturas', 'c2', -21.9],
    ['05', 'Aluguel', 'moradia', 'pix', -2200], ['05', 'Salário', 'salario', 'conta', 9800], ['04', 'Feira', 'alimentacao', 'debito', -96.2],
    ['03', 'Academia', 'saude', 'debito', -99.9], ['02', 'Show', 'lazer', 'c1', -240],
  ];
  const factor = { '08': 0.9, '09': 1.07, '10': 1 };
  const txs = [];
  months.forEach(m => {
    base.forEach((b, i) => {
      const f = b[4] > 0 && b[2] === 'salario' ? 1 : factor[m.id];
      txs.push({ id: 't' + m.id + i, month: m.id, date: b[0] + '/' + m.id, desc: b[1], category: b[2], method: b[3], amount: +(b[4] * f).toFixed(2) });
    });
    installments.forEach(it => {
      const n = it.current - (10 - Number(m.id));
      if (n >= 1) txs.push({ id: 'p' + m.id + it.id, month: m.id, date: '01/' + m.id, desc: it.desc, category: it.category, method: it.card, amount: -it.amount, inst: n + '/' + it.total });
    });
  });

  const invest = [
    { id: 'acoes', title: 'Ações', icon: 'chart-candlestick', ideal: 40, rows: [
      { symbol: 'PETR4', name: 'Petrobras', qty: 100, pm: 32.1, price: 38.42, day: 2.45 },
      { symbol: 'ITUB4', name: 'Itaú Unibanco', qty: 80, pm: 30.2, price: 34.9, day: 1.12 },
      { symbol: 'WEGE3', name: 'WEG', qty: 40, pm: 36, price: 41.25, day: 0.25 },
      { symbol: 'VALE3', name: 'Vale', qty: 30, pm: 66.4, price: 61.07, day: -0.78 },
    ] },
    { id: 'fiis', title: 'FIIs', icon: 'building-2', ideal: 30, rows: [
      { symbol: 'HGLG11', name: 'Logística', qty: 12, pm: 154.3, price: 156.15, day: 0.35 },
      { symbol: 'MXRF11', name: 'Papel / recebíveis', qty: 300, pm: 10.2, price: 10.05, day: -0.2 },
      { symbol: 'XPLG11', name: 'Logística', qty: 20, pm: 98, price: 104.2, day: 0.6 },
      { symbol: 'KNCR11', name: 'Papel / CDI', qty: 15, pm: 101, price: 104.8, day: 0.1 },
    ] },
    { id: 'rf', title: 'Renda fixa', icon: 'landmark', ideal: 30, fixed: true, rows: [
      { symbol: 'Tesouro Selic 2029', name: 'Tesouro Direto', index: '100% Selic', qty: 1, pm: 8000, price: 8450.2, day: 0.04 },
      { symbol: 'CDB Pós-fixado', name: 'Banco digital · 2028', index: '110% CDI', qty: 1, pm: 12000, price: 12930.6, day: 0.05 },
      { symbol: 'LCI Imobiliária', name: 'Isenta de IR · 2027', index: '95% CDI', qty: 1, pm: 5000, price: 5212.4, day: 0.04 },
    ] },
  ];

  const patrimonio = [
    ['10/25', 30200, -420], ['11/25', 31100, 820], ['12/25', 32400, -1300], ['01/26', 33300, 1500], ['02/26', 34500, 600], ['03/26', 35200, -900],
    ['04/26', 36400, 1900], ['05/26', 37300, 2400], ['06/26', 38200, 1200], ['07/26', 39100, -600], ['08/26', 40300, 2100], ['09/26', 41500, 2500],
  ];
  const proventos = [['11/25', 40.1], ['12/25', 46.3], ['01/26', 54.5], ['02/26', 63.8], ['03/26', 140.7], ['04/26', 75], ['05/26', 127.7], ['06/26', 111.8], ['07/26', 70.6], ['08/26', 76.8], ['09/26', 28], ['10/26', 72.4]];
  const spendingPast = [['05/26', [2200, 1180, 410, 260, 1380]], ['06/26', [2200, 1260, 455, 520, 1510]], ['07/26', [2200, 1090, 390, 340, 1620]]];

  window.I100F = {
    fmt, brl, signed, pct, parse, cards, installments, budgets, methods, months, txs, invest, patrimonio, proventos, spendingPast,
    user: { name: 'Marina Costa', email: 'marina@investidor100.com.br' },
    today: '2026-10-20',
  };
})();
