import React from 'react';
import { TickerLogo } from '../core/TickerLogo.jsx';
import { Button } from '../core/Button.jsx';

export function PositionRow({ symbol, company, logo, label = 'Valor atual', value, actionLabel = 'Vender', onAction, style }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) auto', alignItems: 'center', gap: 12, padding: '10px 0', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {logo || <TickerLogo symbol={symbol} size={30} />}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>{symbol}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-400)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{company}</div>
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: 'var(--ink-400)' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-800)', marginTop: 2 }}>{value}</div>
      </div>
      {actionLabel ? <Button variant="soft" size="sm" onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
