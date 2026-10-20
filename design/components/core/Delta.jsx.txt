import React from 'react';
import { Icon } from './Icon.jsx';

const SIZES = { sm: { fs: 11, icon: 12, h: 22, px: 8 }, md: { fs: 13, icon: 14, h: 28, px: 10 }, lg: { fs: 16, icon: 18, h: 34, px: 12 }, xl: { fs: 40, icon: 40, h: 56, px: 0 } };

export function Delta({ value = 0, decimals = 2, suffix = '%', prefix = '', locale = 'pt-BR', label, variant = 'pill', size = 'md', showIcon = true, iconPosition = 'end', style, ...rest }) {
  const up = value >= 0;
  const s = SIZES[size] || SIZES.md;
  const color = up ? 'var(--text-positive)' : 'var(--text-negative)';
  const num = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Math.abs(value));
  const text = label != null ? label : (up ? '+' : '\u2212') + prefix + num + suffix;
  const bg = variant === 'pill' ? 'var(--white)' : variant === 'soft' ? (up ? 'var(--green-50)' : 'var(--red-50)') : 'transparent';
  const padded = variant !== 'plain';
  const icon = showIcon ? <Icon name={up ? 'trending-up' : 'trending-down'} size={s.icon} strokeWidth={size === 'xl' ? 2 : 1.8} /> : null;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: size === 'xl' ? 16 : 4, height: padded ? s.h : undefined,
        padding: padded ? '0 ' + s.px + 'px' : 0, borderRadius: 'var(--radius-pill)', background: bg, color,
        fontFamily: 'var(--font-sans)', fontSize: s.fs, fontWeight: size === 'xl' ? 500 : 600, letterSpacing: size === 'xl' ? '-0.03em' : '-0.01em',
        fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', lineHeight: 1, ...style,
      }}
      {...rest}
    >
      {iconPosition === 'start' ? icon : null}
      {text}
      {iconPosition === 'end' ? icon : null}
    </span>
  );
}
