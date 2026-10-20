import React, { useState } from 'react';
import { Icon } from './Icon.jsx';

const SIZES = {
  sm: { h: 32, px: 14, fs: 13, gap: 6, icon: 15 },
  md: { h: 40, px: 18, fs: 14, gap: 8, icon: 16 },
  lg: { h: 48, px: 22, fs: 15, gap: 8, icon: 18 },
};

const VARIANTS = {
  primary: { bg: 'var(--ink-900)', hover: 'var(--ink-700)', fg: 'var(--white)', border: 'transparent' },
  secondary: { bg: 'var(--white)', hover: 'var(--ink-50)', fg: 'var(--ink-900)', border: 'var(--border-subtle)' },
  soft: { bg: 'var(--ink-75)', hover: 'var(--ink-150)', fg: 'var(--ink-600)', border: 'transparent' },
  accent: { bg: 'var(--lime-300)', hover: 'var(--lime-400)', fg: 'var(--ink-900)', border: 'transparent' },
  ghost: { bg: 'transparent', hover: 'rgba(20,20,20,0.05)', fg: 'var(--ink-900)', border: 'transparent' },
};

export function Button({ variant = 'primary', size = 'md', iconLeft, iconRight, fullWidth = false, disabled = false, type = 'button', onClick, children, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const live = !disabled;
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined,
        alignItems: 'center', justifyContent: 'center', gap: s.gap,
        height: s.h, padding: '0 ' + s.px + 'px', borderRadius: 'var(--radius-pill)',
        border: '1px solid ' + v.border, background: live && hover ? v.hover : v.bg, color: v.fg,
        fontFamily: 'var(--font-sans)', fontSize: s.fs, fontWeight: 500, letterSpacing: '-0.005em', lineHeight: 1,
        whiteSpace: 'nowrap', cursor: live ? 'pointer' : 'not-allowed', opacity: live ? 1 : 0.45,
        transform: live && press ? 'scale(0.97)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {iconLeft ? <Icon name={iconLeft} size={s.icon} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={s.icon} /> : null}
    </button>
  );
}
