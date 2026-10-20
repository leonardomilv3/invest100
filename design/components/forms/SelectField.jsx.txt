import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function SelectField({ label, optional = false, hint, error, icon, options = [], value, defaultValue, onChange, placeholder, size = 'md', disabled = false, style }) {
  const opts = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o));
  const [inner, setInner] = useState(defaultValue !== undefined ? defaultValue : (placeholder ? '' : (opts[0] && opts[0].value)));
  const [focus, setFocus] = useState(false);
  const id = React.useId();
  const v = value !== undefined ? value : inner;
  const h = size === 'lg' ? 52 : size === 'sm' ? 36 : 44;
  const border = error ? 'var(--red-500)' : focus ? 'var(--ink-900)' : 'var(--border-field)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, ...style }}>
      {label ? (
        <label htmlFor={id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--ink-600)' }}>
          <span>{label}</span>
          {optional ? <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--ink-400)' }}>(Opcional)</span> : null}
        </label>
      ) : null}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', height: h, borderRadius: 'var(--radius-field)', border: '1px solid ' + border,
        background: disabled ? 'var(--ink-75)' : 'var(--white)', boxShadow: focus ? '0 0 0 4px var(--lime-glow)' : 'none',
        transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      }}>
        {icon ? <span style={{ position: 'absolute', left: 12, display: 'flex', color: 'var(--ink-500)', pointerEvents: 'none' }}><Icon name={icon} size={16} /></span> : null}
        <select
          id={id}
          value={v}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={e => { setInner(e.target.value); if (onChange) onChange(e.target.value); }}
          style={{
            appearance: 'none', WebkitAppearance: 'none', width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent',
            padding: '0 38px 0 ' + (icon ? 38 : 12) + 'px', fontFamily: 'var(--font-sans)', fontSize: size === 'lg' ? 16 : size === 'sm' ? 13 : 14,
            color: v === '' ? 'var(--ink-400)' : 'var(--ink-900)', cursor: disabled ? 'not-allowed' : 'pointer', borderRadius: 'var(--radius-field)',
          }}
        >
          {placeholder ? <option value="" disabled>{placeholder}</option> : null}
          {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span style={{ position: 'absolute', right: 12, display: 'flex', color: 'var(--ink-600)', pointerEvents: 'none' }}><Icon name="chevron-down" size={16} /></span>
      </div>
      {error || hint ? <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: error ? 'var(--red-600)' : 'var(--ink-500)' }}>{error || hint}</span> : null}
    </div>
  );
}
