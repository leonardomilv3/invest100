// "Adicionar lançamento" — despesa (com parcelamento no cartão), receita ou investimento (compra/venda).
(() => {
  const { Dialog, Button, SegmentedControl, TextField, SelectField, CategoryIcon, CATEGORY_META, Icon } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100F;
  const EXP = ['alimentacao', 'moradia', 'transporte', 'lazer', 'saude', 'educacao', 'assinaturas', 'compras', 'contas', 'viagem', 'pets', 'outros'];
  const INC = ['salario', 'proventos', 'outros'];

  function Total({ label, value, note }) {
    return (
      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'var(--ink-75)', borderRadius: 'var(--radius-field)', padding: '14px 16px' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{label}</div>
          {note ? <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>{note}</div> : null}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{value}</div>
      </div>
    );
  }

  function Lancamento({ preset, cards, invest, mobile, framed, onClose, onSave }) {
    const p = preset || {};
    const [type, setType] = React.useState(p.type || 'Despesa');
    const [desc, setDesc] = React.useState('');
    const [valor, setValor] = React.useState('');
    const [date, setDate] = React.useState(D.today);
    const [cat, setCat] = React.useState(p.type === 'Receita' ? 'salario' : 'alimentacao');
    const [method, setMethod] = React.useState('c1');
    const [parc, setParc] = React.useState('1');
    const [side, setSide] = React.useState('Compra');
    const [group, setGroup] = React.useState(p.group || 'fiis');
    const g = invest.find(x => x.id === group) || invest[0];
    const [symbol, setSymbol] = React.useState(p.symbol || g.rows[0].symbol);
    const [qty, setQty] = React.useState('10');
    const row = g.rows.find(r => r.symbol === symbol) || g.rows[0];
    const [price, setPrice] = React.useState(D.fmt(row.price));
    const [costs, setCosts] = React.useState('0,00');
    const [tried, setTried] = React.useState(false);

    const isCard = method.charAt(0) === 'c';
    const amount = D.parse(valor);
    const n = Number(parc);
    const invTotal = D.parse(qty) * D.parse(price) + (side === 'Compra' ? 1 : -1) * D.parse(costs);
    const sizeF = mobile ? 'lg' : 'md';
    const two = mobile ? '1 / -1' : 'auto';

    const pickGroup = v => { setGroup(v); const ng = invest.find(x => x.id === v); setSymbol(ng.rows[0].symbol); setPrice(D.fmt(ng.rows[0].price)); };
    const pickSymbol = v => { setSymbol(v); const r = g.rows.find(x => x.symbol === v); if (r) setPrice(D.fmt(r.price)); };

    const errDesc = tried && type !== 'Investimento' && !desc.trim() ? 'Informe uma descrição' : null;
    const errVal = tried && type !== 'Investimento' && amount <= 0 ? 'Informe um valor maior que zero' : null;
    const errQty = tried && type === 'Investimento' && D.parse(qty) <= 0 ? 'Quantidade inválida' : null;
    const errSell = tried && type === 'Investimento' && side === 'Venda' && D.parse(qty) > row.qty ? 'Você tem ' + row.qty + ' cotas' : null;

    const save = () => {
      setTried(true);
      if (type !== 'Investimento' && (!desc.trim() || amount <= 0)) return;
      if (type === 'Investimento' && (D.parse(qty) <= 0 || (side === 'Venda' && D.parse(qty) > row.qty))) return;
      const month = date.slice(5, 7), day = date.slice(8, 10);
      if (type === 'Investimento') onSave({ type, side, group, symbol, qty: D.parse(qty), price: D.parse(price), costs: D.parse(costs), month, date: day + '/' + month });
      else onSave({ type, desc: desc.trim(), amount, category: cat, method: type === 'Receita' ? 'conta' : method, parcelas: isCard && type === 'Despesa' ? n : 1, month, date: day + '/' + month });
    };

    const catOpts = (type === 'Receita' ? INC : EXP).map(k => ({ value: k, label: CATEGORY_META[k].label }));
    const payOpts = [{ value: 'pix', label: 'Pix' }, { value: 'debito', label: 'Débito' }, { value: 'dinheiro', label: 'Dinheiro' }].concat(cards.map(c => ({ value: c.id, label: c.name + ' •• ' + c.last4 })));

    let body;
    if (type === 'Investimento') {
      body = (
        <>
          <div style={{ gridColumn: '1 / -1' }}><SegmentedControl fullWidth size={mobile ? 'lg' : 'md'} options={['Compra', 'Venda']} value={side} onChange={setSide} /></div>
          <SelectField label="Tipo de ativo" size={sizeF} value={group} onChange={pickGroup} options={invest.map(x => ({ value: x.id, label: x.title }))} style={{ gridColumn: two }} />
          <SelectField label="Ativo" size={sizeF} value={symbol} onChange={pickSymbol} options={g.rows.map(r => ({ value: r.symbol, label: r.symbol }))} style={{ gridColumn: two }} />
          <TextField label="Data da transação" size={sizeF} type="date" icon="calendar" value={date} onChange={setDate} style={{ gridColumn: two }} />
          <TextField label="Quantidade" size={sizeF} inputMode="numeric" value={qty} onChange={setQty} error={errQty || errSell} hint={side === 'Venda' && !errSell ? 'Disponível: ' + row.qty + ' cotas' : null} style={{ gridColumn: two }} />
          <TextField label="Preço" size={sizeF} prefix="R$" inputMode="decimal" value={price} onChange={setPrice} style={{ gridColumn: two }} />
          <TextField label="Outros custos" optional size={sizeF} prefix="R$" inputMode="decimal" value={costs} onChange={setCosts} style={{ gridColumn: two }} />
          <Total label="Valor total" value={D.brl(Math.max(0, invTotal))} note={side === 'Compra' ? 'Novo preço médio ' + D.brl((row.qty * row.pm + Math.max(0, invTotal)) / (row.qty + (D.parse(qty) || 0) || 1)) : 'Resultado estimado ' + D.signed((D.parse(price) - row.pm) * D.parse(qty))} />
        </>
      );
    } else {
      body = (
        <>
          <TextField label="Descrição" size={sizeF} placeholder={type === 'Despesa' ? 'Ex.: Supermercado' : 'Ex.: Salário'} value={desc} onChange={setDesc} error={errDesc} autoFocus={!mobile} style={{ gridColumn: '1 / -1' }} />
          <TextField label={type === 'Despesa' && isCard && n > 1 ? 'Valor total da compra' : 'Valor'} size={sizeF} prefix="R$" inputMode="decimal" placeholder="0,00" value={valor} onChange={setValor} error={errVal} style={{ gridColumn: two }} />
          <TextField label="Data" size={sizeF} type="date" icon="calendar" value={date} onChange={setDate} style={{ gridColumn: two }} />
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-600)' }}>Categoria</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(type === 'Receita' ? INC : EXP).map(k => {
                const on = k === cat;
                return (
                  <button key={k} type="button" onClick={() => setCat(k)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: mobile ? 44 : 38, padding: '0 12px 0 4px', borderRadius: 999, border: '1px solid ' + (on ? 'var(--ink-900)' : 'var(--border-field)'), background: on ? 'var(--ink-900)' : 'var(--white)', color: on ? 'var(--white)' : 'var(--ink-800)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                    <CategoryIcon category={k} size={mobile ? 34 : 30} />{CATEGORY_META[k].label}
                  </button>
                );
              })}
            </div>
          </div>
          {type === 'Despesa' ? <SelectField label="Forma de pagamento" size={sizeF} value={method} onChange={setMethod} options={payOpts} style={{ gridColumn: isCard ? two : '1 / -1' }} /> : null}
          {type === 'Despesa' && isCard ? <SelectField label="Parcelas" size={sizeF} value={parc} onChange={setParc} options={Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: i ? (i + 1) + 'x' + (amount ? ' de ' + D.brl(amount / (i + 1)) : '') : 'À vista' }))} style={{ gridColumn: two }} /> : null}
          <Total
            label={type === 'Receita' ? 'Valor a receber' : 'Valor total'}
            value={D.brl(amount)}
            note={type === 'Despesa' && isCard ? (n > 1 ? n + 'x de ' + D.brl(amount / n) + ' · 1ª parcela na fatura de novembro' : 'Entra na fatura de novembro') : null}
          />
        </>
      );
    }

    return (
      <Dialog
        title="Adicionar lançamento"
        onClose={onClose}
        sheet={mobile}
        contained={framed}
        width={600}
        footer={<><Button variant="ghost" size={mobile ? 'lg' : 'md'} onClick={onClose}>Cancelar</Button><Button size={mobile ? 'lg' : 'md'} iconLeft="check" onClick={save}>Salvar lançamento</Button></>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}><SegmentedControl fullWidth size={mobile ? 'lg' : 'md'} options={['Despesa', 'Receita', 'Investimento']} value={type} onChange={v => { setType(v); setTried(false); setCat(v === 'Receita' ? 'salario' : 'alimentacao'); }} /></div>
          {body}
        </div>
      </Dialog>
    );
  }

  window.I100Lancamento = Lancamento;
})();
