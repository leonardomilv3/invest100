import React from 'react';

export function CardHeader({ title, subtitle, actions, size = 'md', style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, ...style }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: size === 'sm' ? 15 : 18, fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink-900)', lineHeight: 1.25 }}>{title}</div>
        {subtitle ? <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 4 }}>{subtitle}</div> : null}
      </div>
      {actions ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>{actions}</div> : null}
    </div>
  );
}
