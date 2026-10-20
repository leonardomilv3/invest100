import React from 'react';
import { CategoryIcon } from './CategoryIcon.jsx';

const brl = v => 'R$\u00a0' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function InstallmentRow({ description, subtitle, category = 'compras', card, current = 1, total = 1, amount = 0, compact = false, onClick, style }) {
  const remaining = (total - current) * amount;
  const segs = Math.min(total, 12);
  const filled = Math.round((current / total) * segs);
  const bar = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: segs }, (_, i) => <span key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < filled ? 'var(--ink-900)' : 'var(--ink-150)', minWidth: 4 }} />)}
      </div>
      <span style={{ fontSize: 11.5, color: 'var(--ink-500)' }}>Parcela <b style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{current}/{total}</b>{card ? ' · ' + card : ''}</span>
    </div>
  );
  return (
    <div onClick={onClick} role={onClick ? 'button' : undefined} style={{
      display: 'grid', gridTemplateColumns: compact ? 'minmax(0,1fr) auto' : 'minmax(0,1.4fr) minmax(120px,1fr) auto', alignItems: 'center', gap: compact ? '10px 12px' : 20,
      padding: '12px 0', cursor: onClick ? 'pointer' : 'default', fontFamily: 'var(--font-sans)', ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <CategoryIcon category={category} size={34} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{description}</div>
          {subtitle ? <div style={{ fontSize: 11.5, color: 'var(--ink-400)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</div> : null}
        </div>
      </div>
      {compact ? null : bar}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-900)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{brl(amount)}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--ink-400)' }}>/mês</span></div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-400)', marginTop: 2, whiteSpace: 'nowrap' }}>{remaining > 0 ? 'Restam ' + brl(remaining) : 'Última parcela'}</div>
      </div>
      {compact ? <div style={{ gridColumn: '1 / -1' }}>{bar}</div> : null}
    </div>
  );
}
