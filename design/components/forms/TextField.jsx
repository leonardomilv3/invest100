import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function TextField({ label, optional = false, hint, error, prefix, suffix, icon, value, defaultValue = '', onChange, placeholder, type = 'text', inputMode, size = 'md', disabled = false, align = 'left', autoFocus, style, inputStyle, ...rest }) {
  const [inner, setInner] = useState(defaultValue);
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
        display: 'flex', alignItems: 'stretch', height: h, borderRadius: 'var(--radius-field)', border: '1px solid ' + border, overflow: 'hidden',
        background: disabled ? 'var(--ink-75)' : 'var(--white)', boxShadow: focus ? '0 0 0 4px ' + (error ? 'rgba(240,83,45,0.14)' : 'var(--lime-glow)') : 'none',
        transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      }}>
        {prefix ? <span style={{ display: 'flex', alignItems: 'center', padding: '0 14px', background: 'var(--ink-75)', borderRight: '1px solid var(--border-subtle)', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink-600)' }}>{prefix}</span> : null}
        {icon ? <span style={{ display: 'flex', alignItems: 'center', paddingLeft: 12, color: 'var(--ink-400)' }}><Icon name={icon} size={16} /></span> : null}
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          value={v}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={e => { setInner(e.target.value); if (onChange) onChange(e.target.value); }}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', padding: '0 12px', fontFamily: 'var(--font-sans)', fontSize: size === 'lg' ? 16 : 14, color: 'var(--ink-900)', textAlign: align, fontVariantNumeric: 'tabular-nums', ...inputStyle }}
          {...rest}
        />
        {suffix ? <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-500)' }}>{suffix}</span> : null}
      </div>
      {error || hint ? <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: error ? 'var(--red-600)' : 'var(--ink-500)' }}>{error || hint}</span> : null}
    </div>
  );
}
