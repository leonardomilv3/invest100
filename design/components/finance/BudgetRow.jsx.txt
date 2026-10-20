import React from 'react';
import { CategoryIcon, CATEGORY_META } from './CategoryIcon.jsx';

const brl = v => 'R$\u00a0' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function BudgetRow({ category = 'outros', label, caption, spent = 0, limit = 0, onClick, style }) {
  const m = CATEGORY_META[category] || CATEGORY_META.outros;
  const pct = limit > 0 ? spent / limit : 0;
  const tone = pct > 1 ? 'var(--red-500)' : pct >= 0.85 ? 'var(--amber-400)' : 'var(--lime-400)';
  const left = limit - spent;
  return (
    <div onClick={onClick} role={onClick ? 'button' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 0', cursor: onClick ? 'pointer' : 'default', fontFamily: 'var(--font-sans)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <CategoryIcon category={category} size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label || m.label}</span>
            <span style={{ fontSize: 13, color: 'var(--ink-500)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}><b style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{brl(spent)}</b> de {brl(limit)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 3, fontSize: 11.5 }}>
            <span style={{ color: 'var(--ink-400)' }}>{caption}</span>
            <span style={{ color: pct > 1 ? 'var(--red-600)' : 'var(--ink-500)', fontWeight: pct > 1 ? 600 : 400, whiteSpace: 'nowrap' }}>{left >= 0 ? brl(left) + ' restantes' : brl(-left) + ' acima'}</span>
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', height: 8, borderRadius: 999, background: 'var(--ink-100)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--pattern-hatch-soft)' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.min(100, pct * 100) + '%', borderRadius: 999, background: tone, transition: 'width var(--dur-slow) var(--ease-out)' }} />
      </div>
    </div>
  );
}
