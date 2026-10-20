import React from 'react';

const DOTS = { ink: 'var(--ink-900)', positive: 'var(--green-500)', negative: 'var(--red-500)', warning: 'var(--amber-400)', accent: 'var(--lime-400)' };
const TONES = {
  white: { bg: 'var(--white)', fg: 'var(--ink-800)' },
  soft: { bg: 'var(--ink-150)', fg: 'var(--ink-800)' },
  accent: { bg: 'var(--lime-300)', fg: 'var(--ink-900)' },
  inverse: { bg: 'var(--ink-900)', fg: 'var(--white)' },
  outline: { bg: 'transparent', fg: 'var(--ink-700)', border: 'var(--border-default)' },
};
const SIZES = { sm: { h: 28, px: 12, fs: 12, dot: 6 }, md: { h: 36, px: 16, fs: 14, dot: 8 }, lg: { h: 48, px: 22, fs: 18, dot: 10 } };

export function Tag({ dot, tone = 'white', size = 'md', children, style, ...rest }) {
  const t = TONES[tone] || TONES.white;
  const s = SIZES[size] || SIZES.md;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: s.dot, height: s.h, padding: '0 ' + s.px + 'px',
        borderRadius: 'var(--radius-pill)', background: t.bg, color: t.fg, border: t.border ? '1px solid ' + t.border : 'none',
        fontFamily: 'var(--font-sans)', fontSize: s.fs, fontWeight: 500, letterSpacing: '-0.01em', whiteSpace: 'nowrap', lineHeight: 1,
        ...style,
      }}
      {...rest}
    >
      {dot ? <span style={{ width: s.dot, height: s.dot, borderRadius: '50%', background: DOTS[dot] || dot, flexShrink: 0 }} /> : null}
      {children}
    </span>
  );
}
