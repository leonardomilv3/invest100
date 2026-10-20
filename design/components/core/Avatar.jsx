import React from 'react';

const TONES = { accent: 'var(--lime-300)', neutral: 'var(--ink-150)', inverse: 'var(--ink-900)' };

export function Avatar({ src, name = '', size = 40, shape = 'circle', tone = 'accent', style, ...rest }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  const radius = shape === 'squircle' ? Math.round(size * 0.3) : '50%';
  return (
    <span
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size,
        borderRadius: radius, overflow: 'hidden', background: TONES[tone] || TONES.accent, flexShrink: 0,
        color: tone === 'inverse' ? 'var(--white)' : 'var(--ink-900)', fontFamily: 'var(--font-sans)', fontWeight: 600,
        fontSize: Math.max(10, Math.round(size * 0.36)), letterSpacing: '-0.02em', ...style,
      }}
      {...rest}
    >
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : initials}
    </span>
  );
}
