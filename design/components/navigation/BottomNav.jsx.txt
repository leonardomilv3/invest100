import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function BottomNav({ items = [], value, onChange, style }) {
  const [inner, setInner] = useState(items[0] && items[0].id);
  const current = value !== undefined ? value : inner;
  const select = id => { setInner(id); if (onChange) onChange(id); };
  return (
    <nav
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, padding: 6, borderRadius: 'var(--radius-pill)',
        background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-highlight)', boxShadow: 'var(--shadow-float)', ...style,
      }}
    >
      {items.map(it => {
        const active = it.id === current;
        return (
          <button
            key={it.id}
            type="button"
            aria-label={it.label}
            aria-current={active ? 'page' : undefined}
            onClick={() => select(it.id)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, minWidth: 52,
              padding: active ? '0 18px 0 16px' : 0, flex: active ? '0 0 auto' : '1 1 0', borderRadius: 'var(--radius-pill)', border: 'none',
              background: active ? 'var(--ink-900)' : 'transparent', color: active ? 'var(--white)' : 'var(--ink-500)', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
              transition: 'background var(--dur-base) var(--ease-out), padding var(--dur-base) var(--ease-out)',
            }}
          >
            <Icon name={it.icon} size={20} />
            {active ? it.label : null}
          </button>
        );
      })}
    </nav>
  );
}
