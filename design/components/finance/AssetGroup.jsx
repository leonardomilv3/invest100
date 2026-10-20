import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';

export function AssetGroup({ icon = 'chart-pie', title, count, metrics = [], open, defaultOpen = true, onToggle, footer, compact = false, children, style }) {
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open !== undefined ? open : inner;
  const toggle = () => { setInner(!isOpen); if (onToggle) onToggle(!isOpen); };
  return (
    <section style={{ background: 'var(--surface-outlined)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-card)', overflow: 'hidden', fontFamily: 'var(--font-sans)', ...style }}>
      <div onClick={toggle} style={{ display: 'flex', alignItems: compact ? 'flex-start' : 'center', gap: compact ? 12 : 20, padding: compact ? 16 : '16px 20px', cursor: 'pointer', flexWrap: compact ? 'wrap' : 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: compact ? '1 1 auto' : '1 1 0', minWidth: 0 }}>
          {compact ? null : <span style={{ color: 'var(--ink-300)', display: 'flex' }}><Icon name="grip-vertical" size={16} /></span>}
          <span style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-800)', background: 'var(--ink-50)', flexShrink: 0 }}><Icon name={icon} size={19} /></span>
          <span style={{ fontSize: compact ? 17 : 19, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>{title}</span>
          {count != null ? <span style={{ fontSize: 13, color: 'var(--ink-400)' }}>({count})</span> : null}
        </div>
        {compact ? <IconButton icon={isOpen ? 'chevron-up' : 'chevron-down'} label={isOpen ? 'Recolher' : 'Expandir'} variant="soft" size="sm" onClick={e => { e.stopPropagation(); toggle(); }} /> : null}
        <div style={{ display: compact ? 'grid' : 'flex', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: compact ? '12px 16px' : 28, width: compact ? '100%' : 'auto', alignItems: 'center' }}>
          {metrics.map(m => (
            <div key={m.label} style={{ display: 'flex', flexDirection: 'column', alignItems: compact ? 'flex-start' : 'flex-end', gap: 4, minWidth: compact ? 0 : 84 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>{m.label}</span>
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink-900)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{m.value}</span>
            </div>
          ))}
        </div>
        {compact ? null : <IconButton icon={isOpen ? 'chevron-up' : 'chevron-down'} label={isOpen ? 'Recolher' : 'Expandir'} variant="soft" size="sm" onClick={e => { e.stopPropagation(); toggle(); }} />}
      </div>
      {isOpen ? (
        <div>
          <div style={{ borderTop: '1px solid var(--border-card)' }}>{children}</div>
          {footer ? <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: compact ? '12px 16px 16px' : '14px 20px', borderTop: '1px solid var(--border-subtle)' }}>{footer}</div> : null}
        </div>
      ) : null}
    </section>
  );
}
