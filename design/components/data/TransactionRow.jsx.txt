import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function TransactionRow({ side = 'buy', symbol, date, price, shares, amount, buyLabel = 'Compra', sellLabel = 'Venda', positive, style }) {
  const isBuy = side === 'buy';
  const pos = positive != null ? positive : isBuy;
  const tri = isBuy ? 'var(--green-500)' : 'var(--red-500)';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr) auto', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)', ...style }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, letterSpacing: '-0.02em' }}>
          <span style={{ color: 'var(--ink-600)' }}>{isBuy ? buyLabel : sellLabel}</span>
          <Icon name="play" size={9} fill={tri} color={tri} strokeWidth={1} />
          <span style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{symbol}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-400)', marginTop: 4, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{date}</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--ink-500)', fontVariantNumeric: 'tabular-nums' }}>{price}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 3 }}>{shares}</div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: pos ? 'var(--text-positive)' : 'var(--text-negative)', textAlign: 'right' }}>{amount}</div>
    </div>
  );
}
