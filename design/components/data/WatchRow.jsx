import React, { useState } from 'react';
import { Delta } from '../core/Delta.jsx';
import { TickerLogo } from '../core/TickerLogo.jsx';

export function WatchRow({ name, symbol, logo, price, delta, onClick, style }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 14px', minHeight: 60,
        borderRadius: 'var(--radius-lg)', background: hover ? 'var(--white)' : 'rgba(255,255,255,0.7)', border: '1px solid var(--border-highlight)',
        cursor: onClick ? 'pointer' : 'default', transition: 'background var(--dur-fast) var(--ease-out)', ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {logo || <TickerLogo symbol={symbol} size={34} />}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-400)', marginTop: 2 }}>{symbol}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-900)' }}>{price}</span>
        {delta != null ? <Delta value={delta} variant="plain" size="sm" iconPosition="start" /> : null}
      </div>
    </div>
  );
}
