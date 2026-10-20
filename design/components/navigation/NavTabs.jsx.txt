import React, { useState } from 'react';

const SIZES = { sm: { h: 36, px: 16, fs: 13 }, md: { h: 44, px: 22, fs: 15 } };

function Tab({ item, active, size, onSelect }) {
  const [hover, setHover] = useState(false);
  const s = SIZES[size] || SIZES.md;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onSelect(item.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: s.h, padding: '0 ' + s.px + 'px', borderRadius: 'var(--radius-pill)', border: 'none', flexShrink: 0,
        background: active ? 'var(--ink-900)' : hover ? 'rgba(20,20,20,0.05)' : 'transparent',
        color: active ? 'var(--white)' : 'var(--ink-900)', fontFamily: 'var(--font-sans)', fontSize: s.fs, fontWeight: 500,
        letterSpacing: '-0.01em', cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',
      }}
    >
      {item.label}
    </button>
  );
}

export function NavTabs({ items = [], value, onChange, size = 'md', scrollable = false, style }) {
  const [inner, setInner] = useState(items[0] && items[0].id);
  const current = value !== undefined ? value : inner;
  const select = id => { setInner(id); if (onChange) onChange(id); };
  return (
    <nav
      role="tablist"
      style={{
        display: 'flex', alignItems: 'center', gap: 4, overflowX: scrollable ? 'auto' : 'visible',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', ...style,
      }}
    >
      {items.map(it => <Tab key={it.id} item={it} active={it.id === current} size={size} onSelect={select} />)}
    </nav>
  );
}
