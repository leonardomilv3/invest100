import React, { useState } from 'react';

function Dot({ label, active, d, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={() => onSelect(label)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: d, height: d, borderRadius: '50%', border: 'none', padding: 0, flexShrink: 0,
        background: active ? 'var(--lime-300)' : hover ? 'var(--ink-50)' : 'var(--white)', color: 'var(--ink-800)',
        boxShadow: active ? '0 0 0 3px var(--lime-glow)' : 'var(--shadow-xs)', fontFamily: 'var(--font-sans)',
        fontSize: d >= 40 ? 12 : 10.5, fontWeight: 600, letterSpacing: '-0.02em', cursor: 'pointer',
        transition: 'background var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      }}
    >
      {label}
    </button>
  );
}

export function RangeToggle({ options = ['1D', '1S', '1M', '1A', '5A'], value, onChange, size = 'md', style }) {
  const [inner, setInner] = useState(options[3] || options[0]);
  const current = value !== undefined ? value : inner;
  const d = size === 'sm' ? 28 : size === 'lg' ? 40 : 32;
  const select = v => { setInner(v); if (onChange) onChange(v); };
  return (
    <div role="radiogroup" style={{ display: 'inline-flex', gap: 6, alignItems: 'center', ...style }}>
      {options.map(o => <Dot key={o} label={o} active={o === current} d={d} onSelect={select} />)}
    </div>
  );
}
