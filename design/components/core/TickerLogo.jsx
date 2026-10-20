import React from 'react';

const PALETTE = [
  ['#141414', '#FFFFFF'], ['#3D6BF5', '#FFFFFF'], ['#1FA855', '#FFFFFF'], ['#F0532D', '#FFFFFF'],
  ['#E9AE2A', '#141414'], ['#0FA3B1', '#FFFFFF'], ['#C2F86C', '#141414'], ['#6B6B6B', '#FFFFFF'],
];

function hash(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }

export function TickerLogo({ symbol = '', src, color, textColor, size = 36, shape = 'circle', style, ...rest }) {
  const pair = PALETTE[hash(symbol) % PALETTE.length];
  const letters = symbol.replace(/[0-9]/g, '').slice(0, 2).toUpperCase();
  return (
    <span
      aria-label={symbol}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0,
        borderRadius: shape === 'square' ? Math.round(size * 0.28) : '50%', overflow: 'hidden',
        background: src ? 'var(--white)' : (color || pair[0]), color: textColor || pair[1],
        fontFamily: 'var(--font-sans)', fontSize: Math.round(size * 0.34), fontWeight: 700, letterSpacing: '-0.03em', ...style,
      }}
      {...rest}
    >
      {src ? <img src={src} alt="" style={{ width: '72%', height: '72%', objectFit: 'contain' }} /> : letters}
    </span>
  );
}
