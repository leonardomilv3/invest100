import React from 'react';

export function Wordmark({ size = 20, tone = 'ink', style, ...rest }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-sans)', fontSize: size, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1,
        color: tone === 'white' ? 'var(--white)' : 'var(--ink-900)', whiteSpace: 'nowrap', ...style,
      }}
      {...rest}
    >
      Investidor100
    </span>
  );
}
