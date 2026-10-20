import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../core/Icon.jsx';

export function Select({ options = [], value, onChange, placeholder = 'Selecionar', variant = 'plain', size = 'md', leading, align = 'left', style }) {
  const opts = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o));
  const [open, setOpen] = useState(false);
  const [inner, setInner] = useState(undefined);
  const [hover, setHover] = useState(false);
  const ref = useRef(null);
  const current = value !== undefined ? value : inner;
  const sel = opts.find(o => o.value === current);
  useEffect(() => {
    if (!open) return undefined;
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const pill = variant === 'pill';
  const h = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', ...style }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, height: pill ? h : 28, padding: pill ? '0 12px 0 16px' : '0 4px',
          borderRadius: 'var(--radius-pill)', border: pill ? '1px solid var(--border-subtle)' : 'none',
          background: pill ? (hover ? 'var(--ink-50)' : 'var(--white)') : 'transparent', color: pill ? 'var(--ink-900)' : (hover ? 'var(--ink-900)' : 'var(--ink-500)'),
          fontFamily: 'var(--font-sans)', fontSize: pill ? 13 : 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        {leading}
        <span>{sel ? sel.label : placeholder}</span>
        <Icon name="chevron-down" size={pill ? 16 : 14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)' }} />
      </button>
      {open ? (
        <div
          role="listbox"
          style={{
            position: 'absolute', top: '100%', marginTop: 6, [align === 'right' ? 'right' : 'left']: 0, minWidth: 180, zIndex: 50,
            background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-float)', border: '1px solid var(--border-subtle)', padding: 6,
          }}
        >
          {opts.map(o => {
            const on = o.value === current;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => { setInner(o.value); setOpen(false); if (onChange) onChange(o.value); }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink-75)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                style={{
                  display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 12, height: 38, padding: '0 12px',
                  border: 'none', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--ink-900)', fontFamily: 'var(--font-sans)',
                  fontSize: 13, fontWeight: on ? 600 : 400, cursor: 'pointer', textAlign: 'left', whiteSpace: 'nowrap',
                }}
              >
                {o.label}
                {on ? <Icon name="check" size={15} color="var(--ink-900)" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
