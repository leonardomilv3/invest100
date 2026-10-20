import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

function RailButton({ item, active, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button
        type="button"
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
        onClick={() => onSelect(item.id)}
        style={{
          width: 48, height: 48, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: active ? 'var(--ink-900)' : hover ? 'var(--ink-50)' : 'var(--white)', color: active ? 'var(--white)' : 'var(--ink-600)',
          boxShadow: active ? 'none' : 'var(--shadow-xs)', cursor: 'pointer',
          transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',
        }}
      >
        <Icon name={item.icon} size={19} />
      </button>
      <span
        style={{
          position: 'absolute', left: 58, top: '50%', transform: 'translateY(-50%) translateX(' + (hover ? 0 : -4) + 'px)',
          opacity: hover ? 1 : 0, pointerEvents: 'none', background: 'var(--ink-900)', color: 'var(--white)', fontFamily: 'var(--font-sans)',
          fontSize: 12, fontWeight: 500, padding: '6px 10px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap', zIndex: 20,
          transition: 'opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        }}
      >
        {item.label}
      </span>
    </div>
  );
}

export function SideRail({ items = [], footerItems = [], value, onChange, style }) {
  const [inner, setInner] = useState(items[0] && items[0].id);
  const current = value !== undefined ? value : inner;
  const select = id => { setInner(id); if (onChange) onChange(id); };
  const group = list => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 6, borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border-highlight)' }}>
      {list.map(it => <RailButton key={it.id} item={it} active={it.id === current} onSelect={select} />)}
    </div>
  );
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap: 24, width: 'var(--rail-width)', ...style }}>
      {group(items)}
      {footerItems.length ? group(footerItems) : null}
    </aside>
  );
}
