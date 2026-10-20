import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function TopTabs({ items = [], value, onChange, size = 'md', style }) {
  const [inner, setInner] = useState(items[0] && items[0].id);
  const [hover, setHover] = useState(null);
  const current = value !== undefined ? value : inner;
  const h = size === 'sm' ? 44 : 56;
  return (
    <nav role="tablist" style={{ display: 'flex', alignItems: 'stretch', gap: size === 'sm' ? 2 : 6, overflowX: 'auto', scrollbarWidth: 'none', minWidth: 0, ...style }}>
      {items.map(it => {
        const on = it.id === current;
        return (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => { setInner(it.id); if (onChange) onChange(it.id); }}
            onMouseEnter={() => setHover(it.id)}
            onMouseLeave={() => setHover(null)}
            style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, height: h, padding: '0 10px', border: 'none',
              background: 'transparent', cursor: 'pointer', flexShrink: 0, fontFamily: 'var(--font-sans)', fontSize: size === 'sm' ? 13 : 14,
              fontWeight: on ? 600 : 500, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
              color: on ? 'var(--ink-900)' : hover === it.id ? 'var(--ink-800)' : 'var(--ink-500)', transition: 'color var(--dur-fast) var(--ease-out)',
            }}
          >
            {it.icon ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: on ? 'var(--lime-300)' : hover === it.id ? 'var(--ink-75)' : 'transparent', transition: 'background var(--dur-base) var(--ease-out)' }}>
                <Icon name={it.icon} size={15} />
              </span>
            ) : null}
            {it.label}
            {it.badge != null ? <span style={{ minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: 'var(--ink-900)', color: 'var(--white)', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{it.badge}</span> : null}
            <span style={{ position: 'absolute', left: 10, right: 10, bottom: 0, height: 2, borderRadius: 2, background: on ? 'var(--ink-900)' : 'transparent', transition: 'background var(--dur-base) var(--ease-out)' }} />
          </button>
        );
      })}
    </nav>
  );
}
