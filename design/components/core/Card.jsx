import React, { useState } from 'react';

const VARIANTS = {
  default: { bg: 'var(--surface-card)', fg: 'var(--text-primary)', border: '1px solid var(--border-highlight)', shadow: 'var(--shadow-card)' },
  raised: { bg: 'var(--surface-raised)', fg: 'var(--text-primary)', border: '1px solid var(--border-subtle)', shadow: 'var(--shadow-xs)' },
  accent: { bg: 'var(--surface-accent)', fg: 'var(--text-on-accent)', border: '1px solid transparent', shadow: 'none' },
  inverse: { bg: 'var(--surface-inverse)', fg: 'var(--text-on-inverse)', border: '1px solid transparent', shadow: 'none' },
  sunken: { bg: 'var(--surface-sunken)', fg: 'var(--text-primary)', border: '1px solid transparent', shadow: 'none' },
  outlined: { bg: 'var(--surface-outlined)', fg: 'var(--text-primary)', border: '1px solid var(--border-card)', shadow: 'none' },
  glass: { bg: 'rgba(255,255,255,0.55)', fg: 'var(--text-primary)', border: '1px solid var(--border-highlight)', shadow: 'var(--shadow-sm)' },
};

export function Card({ variant = 'default', padding = 20, radius = 'var(--radius-xl)', interactive = false, onClick, children, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.default;
  return (
    <div
      onClick={onClick}
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      style={{
        position: 'relative', background: v.bg, color: v.fg, border: v.border, borderRadius: radius,
        padding: typeof padding === 'number' ? padding + 'px' : padding,
        boxShadow: interactive && hover ? 'var(--shadow-md)' : v.shadow,
        transform: interactive && hover ? 'translateY(-1px)' : 'none',
        transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
        cursor: interactive ? 'pointer' : undefined, minWidth: 0, ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
