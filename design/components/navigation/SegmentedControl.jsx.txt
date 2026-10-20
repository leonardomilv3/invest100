import React, { useState } from 'react';

const SIZES = { sm: { h: 32, ih: 26, px: 12, fs: 12 }, md: { h: 40, ih: 32, px: 16, fs: 13 }, lg: { h: 48, ih: 40, px: 18, fs: 14 } };

function Seg({ opt, active, s, onSelect, fill }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={() => onSelect(opt.value)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: fill ? 1 : '0 0 auto', height: s.ih, padding: '0 ' + s.px + 'px', border: 'none', borderRadius: 'var(--radius-pill)',
        background: active ? 'var(--ink-900)' : 'transparent', color: active ? 'var(--white)' : hover ? 'var(--ink-800)' : 'var(--ink-400)',
        fontFamily: 'var(--font-sans)', fontSize: s.fs, fontWeight: 500, letterSpacing: '-0.01em', cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',
      }}
    >
      {opt.label}
    </button>
  );
}

export function SegmentedControl({ options = [], value, onChange, size = 'md', fullWidth = false, style }) {
  const opts = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o));
  const [inner, setInner] = useState(opts[0] && opts[0].value);
  const current = value !== undefined ? value : inner;
  const s = SIZES[size] || SIZES.md;
  const select = v => { setInner(v); if (onChange) onChange(v); };
  return (
    <div
      role="radiogroup"
      style={{
        display: fullWidth ? 'flex' : 'inline-flex', alignItems: 'center', gap: 2, height: s.h, padding: (s.h - s.ih) / 2 - 1,
        borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,0.6)', border: '1px solid var(--border-subtle)',
        overflowX: 'auto', scrollbarWidth: 'none', maxWidth: '100%', ...style,
      }}
    >
      {opts.map(o => <Seg key={o.value} opt={o} active={o.value === current} s={s} onSelect={select} fill={fullWidth} />)}
    </div>
  );
}
