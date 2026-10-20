import React from 'react';

const TONES = {
  accent: { bg: 'var(--lime-300)', fg: 'var(--ink-900)' },
  inverse: { bg: 'var(--ink-900)', fg: 'var(--white)' },
  white: { bg: 'var(--white)', fg: 'var(--ink-900)' },
  neutral: { bg: 'var(--ink-150)', fg: 'var(--ink-700)' },
  positive: { bg: 'var(--green-50)', fg: 'var(--green-600)' },
  negative: { bg: 'var(--red-50)', fg: 'var(--red-600)' },
  warning: { bg: 'var(--amber-50)', fg: 'var(--amber-500)' },
  info: { bg: 'var(--blue-50)', fg: 'var(--blue-500)' },
};
const SIZES = { sm: { h: 20, px: 7, fs: 11 }, md: { h: 26, px: 10, fs: 12 }, lg: { h: 32, px: 14, fs: 14 } };

export function Badge({ tone = 'accent', size = 'md', children, style, ...rest }) {
  const t = TONES[tone] || TONES.accent;
  const s = SIZES[size] || SIZES.md;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: s.h, padding: '0 ' + s.px + 'px',
        borderRadius: 'var(--radius-pill)', background: t.bg, color: t.fg, fontFamily: 'var(--font-sans)',
        fontSize: s.fs, fontWeight: 600, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', lineHeight: 1,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
