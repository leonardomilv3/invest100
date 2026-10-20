import React from 'react';

const TONES = { positive: 'var(--chart-positive)', low: 'var(--chart-low)', negative: 'var(--chart-negative)', accent: 'var(--lime-400)', ink: 'var(--ink-900)', muted: 'var(--ink-300)' };

export function Legend({ items = [], size = 'md', style }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: size === 'sm' ? 12 : 16, ...style }}>
      {items.map(it => (
        <span key={it.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontSize: size === 'sm' ? 11 : 12, color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: TONES[it.tone] || it.color || it.tone }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
