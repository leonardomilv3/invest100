import React, { useState } from 'react';
import { Icon } from './Icon.jsx';

const SIZES = { sm: { d: 32, icon: 15 }, md: { d: 40, icon: 18 }, lg: { d: 48, icon: 20 } };
const VARIANTS = {
  raised: { bg: 'var(--white)', hover: 'var(--ink-50)', fg: 'var(--ink-800)', shadow: 'var(--shadow-xs)' },
  inverse: { bg: 'var(--ink-900)', hover: 'var(--ink-700)', fg: 'var(--white)', shadow: 'none' },
  soft: { bg: 'var(--ink-75)', hover: 'var(--ink-150)', fg: 'var(--ink-500)', shadow: 'none' },
  accent: { bg: 'var(--lime-300)', hover: 'var(--lime-400)', fg: 'var(--ink-900)', shadow: 'none' },
  ghost: { bg: 'transparent', hover: 'rgba(20,20,20,0.05)', fg: 'var(--ink-700)', shadow: 'none' },
};

export function IconButton({ icon, label, variant = 'raised', size = 'md', badge = false, active, disabled = false, onClick, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[active ? 'inverse' : variant] || VARIANTS.raised;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: s.d, height: s.d, padding: 0, borderRadius: '50%', border: 'none',
        background: hover && !disabled ? v.hover : v.bg, color: v.fg, boxShadow: v.shadow,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1,
        transform: press && !disabled ? 'scale(0.94)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        flexShrink: 0, ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={s.icon} />
      {badge ? (
        <span style={{ position: 'absolute', top: s.d * 0.2, right: s.d * 0.22, width: 8, height: 8, borderRadius: '50%', background: 'var(--red-500)', boxShadow: '0 0 0 2px ' + (variant === 'inverse' ? 'var(--ink-900)' : 'var(--white)') }} />
      ) : null}
    </button>
  );
}
