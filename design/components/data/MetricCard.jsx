import React from 'react';
import { Card } from '../core/Card.jsx';
import { Delta } from '../core/Delta.jsx';
import { IconButton } from '../core/IconButton.jsx';

export function MetricCard({ label, value, unit, caption, delta, deltaSuffix = '%', action, actionLabel = 'Abrir', onAction, emphasis = 'value', variant = 'default', children, style }) {
  const big = emphasis === 'value';
  return (
    <Card variant={variant} padding={20} style={{ display: 'flex', flexDirection: 'column', gap: 14, ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: big ? 14 : 15, color: big ? 'var(--ink-500)' : 'var(--ink-900)', fontWeight: big ? 400 : 500, letterSpacing: '-0.01em' }}>{label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 10 }}>
            <span style={{ fontSize: big ? 24 : 22, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-900)', lineHeight: 1.1 }}>{value}</span>
            {unit ? <span style={{ fontSize: 13, color: 'var(--ink-400)', fontWeight: 500 }}>{unit}</span> : null}
          </div>
          {caption ? <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 6 }}>{caption}</div> : null}
        </div>
        {action ? <IconButton icon={action} label={actionLabel} size="sm" onClick={onAction} /> : null}
      </div>
      {children}
      {delta != null ? <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: children ? 0 : 'auto' }}><Delta value={delta} suffix={deltaSuffix} /></div> : null}
    </Card>
  );
}
