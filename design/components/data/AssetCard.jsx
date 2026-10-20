import React from 'react';
import { Card } from '../core/Card.jsx';
import { Icon } from '../core/Icon.jsx';
import { TickerLogo } from '../core/TickerLogo.jsx';

export function AssetCard({ name, symbol, logo, label = 'Valor atual', value, delta, locale = 'pt-BR', variant = 'raised', onClick, style }) {
  const up = (delta || 0) >= 0;
  const color = up ? 'var(--text-positive)' : 'var(--text-negative)';
  const num = delta != null ? new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(delta)) : null;
  return (
    <Card variant={variant} interactive={!!onClick} onClick={onClick} padding={18} radius="var(--radius-lg)" style={{ display: 'flex', flexDirection: 'column', gap: 14, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {logo || <TickerLogo symbol={symbol} size={30} />}
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--ink-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--ink-400)' }}>({symbol})</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-900)' }}>{value}</div>
        </div>
        {num != null ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, color }}>
            <Icon name={up ? 'trending-up' : 'trending-down'} size={16} strokeWidth={1.8} />
            <span style={{ fontSize: 14, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{(up ? '+' : '\u2212') + num + '%'}</span>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
