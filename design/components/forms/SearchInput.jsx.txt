import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function SearchInput({ value, defaultValue = '', onChange, placeholder = 'Buscar ativo ou código', size = 'md', fullWidth = false, shortcut, autoFocus, style, ...rest }) {
  const [inner, setInner] = useState(defaultValue);
  const [focus, setFocus] = useState(false);
  const v = value !== undefined ? value : inner;
  const h = size === 'sm' ? 34 : size === 'lg' ? 48 : 40;
  return (
    <label
      style={{
        display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : 280, alignItems: 'center', gap: 8, height: h, padding: '0 14px',
        borderRadius: 'var(--radius-pill)', background: 'var(--white)', border: '1px solid ' + (focus ? 'var(--ink-900)' : 'var(--border-subtle)'),
        boxShadow: focus ? '0 0 0 4px var(--lime-glow)' : 'none', color: 'var(--ink-400)', cursor: 'text',
        transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)', ...style,
      }}
    >
      <Icon name="search" size={size === 'lg' ? 18 : 16} />
      <input
        value={v}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={e => { setInner(e.target.value); if (onChange) onChange(e.target.value); }}
        style={{
          flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)',
          fontSize: size === 'sm' ? 12 : size === 'lg' ? 15 : 13, color: 'var(--ink-900)', height: '100%', padding: 0,
        }}
        {...rest}
      />
      {v ? (
        <button type="button" aria-label="Limpar" onClick={() => { setInner(''); if (onChange) onChange(''); }} style={{ border: 'none', background: 'var(--ink-100)', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-500)', padding: 0 }}>
          <Icon name="x" size={12} strokeWidth={2} />
        </button>
      ) : shortcut ? (
        <span style={{ fontSize: 11, color: 'var(--ink-400)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '2px 6px', fontFamily: 'var(--font-sans)' }}>{shortcut}</span>
      ) : null}
    </label>
  );
}
