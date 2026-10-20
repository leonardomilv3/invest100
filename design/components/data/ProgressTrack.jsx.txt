import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function ProgressTrack({ value = 50, variant = 'fill', label, tone = 'accent', style }) {
  const pct = Math.max(0, Math.min(100, value));
  if (variant === 'marker') {
    return (
      <div style={{ position: 'relative', height: 40, ...style }}>
        <div style={{ position: 'absolute', inset: '4px 0', background: 'var(--pattern-hatch-soft)', borderRadius: 4 }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'var(--ink-300)' }} />
        <span style={{
          position: 'absolute', left: pct + '%', top: '50%', transform: 'translate(-50%,-50%)', height: 26, padding: '0 10px', borderRadius: 'var(--radius-pill)',
          display: 'inline-flex', alignItems: 'center', background: tone === 'inverse' ? 'var(--ink-900)' : 'var(--lime-300)', color: tone === 'inverse' ? 'var(--white)' : 'var(--ink-900)',
          fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
        }}>{label != null ? label : pct + '%'}</span>
      </div>
    );
  }
  return (
    <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} style={{ position: 'relative', height: 28, display: 'flex', alignItems: 'center', ...style }}>
      <div style={{ position: 'absolute', left: 0, right: 0, height: 12, borderRadius: 'var(--radius-pill)', background: 'var(--pattern-hatch)' }} />
      <div style={{ position: 'absolute', left: 0, width: pct + '%', height: 12, borderRadius: 'var(--radius-pill)', background: tone === 'inverse' ? 'var(--ink-900)' : 'var(--lime-300)' }} />
      <span style={{
        position: 'absolute', left: pct + '%', transform: 'translateX(-50%)', width: 26, height: 26, borderRadius: '50%', background: 'var(--white)',
        border: '1px solid var(--ink-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-900)', boxShadow: '0 0 0 4px var(--lime-glow)',
      }}>
        <Icon name="ellipsis-vertical" size={13} strokeWidth={2.2} />
      </span>
    </div>
  );
}
