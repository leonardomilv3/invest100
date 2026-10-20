import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
import { Avatar } from '../core/Avatar.jsx';

export function UserChip({ name, email, avatarSrc, compact = false, onClick, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10, height: 48, padding: compact ? 4 : '4px 6px 4px 4px', borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--border-highlight)', background: hover ? 'var(--white)' : 'rgba(255,255,255,0.6)', cursor: 'pointer',
        fontFamily: 'var(--font-sans)', textAlign: 'left', transition: 'background var(--dur-base) var(--ease-out)', ...style,
      }}
    >
      <Avatar src={avatarSrc} name={name} size={38} tone="neutral" />
      {compact ? null : (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-900)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{name}</span>
          <span style={{ fontSize: 11, color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>{email}</span>
        </span>
      )}
      {compact ? null : (
        <span style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-700)', marginLeft: 6 }}>
          <Icon name="chevron-down" size={16} />
        </span>
      )}
    </button>
  );
}
