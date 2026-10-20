import React, { useEffect, useState } from 'react';
import { IconButton } from '../core/IconButton.jsx';

export function Dialog({ open = true, title, onClose, footer, width = 560, sheet = false, contained = false, children, style }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!open) { setShown(false); return undefined; }
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  useEffect(() => {
    if (!open || !onClose) return undefined;
    const k = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  if (!open) return null;
  const panel = sheet
    ? { left: 0, right: 0, bottom: 0, maxHeight: '92%', borderRadius: '24px 24px 0 0', transform: shown ? 'none' : 'translateY(40px)' }
    : { left: '50%', top: '50%', width: 'min(' + width + 'px, calc(100% - 32px))', maxHeight: 'calc(100% - 48px)', borderRadius: 20, transform: 'translate(-50%,-50%)' + (shown ? '' : ' translateY(16px) scale(0.98)') };
  return (
    <div style={{ position: contained ? 'absolute' : 'fixed', inset: 0, zIndex: 200 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--surface-overlay)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', opacity: shown ? 1 : 0, transition: 'opacity var(--dur-slow) var(--ease-out)' }} />
      <div role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined} style={{
        position: 'absolute', display: 'flex', flexDirection: 'column', background: 'var(--white)', boxShadow: 'var(--shadow-float)', overflow: 'hidden',
        opacity: shown ? 1 : 0, transition: 'transform var(--dur-slow) var(--ease-out), opacity var(--dur-slow) var(--ease-out)', fontFamily: 'var(--font-sans)', ...panel, ...style,
      }}>
        {sheet ? <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--ink-200)', margin: '10px auto 0', flexShrink: 0 }} /> : null}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: sheet ? '12px 20px 14px' : '18px 24px', borderBottom: '1px solid var(--border-card)', flexShrink: 0 }}>
          <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>{title}</div>
          {onClose ? <IconButton icon="x" label="Fechar" variant="ghost" size="sm" onClick={onClose} /> : null}
        </div>
        <div style={{ padding: sheet ? '18px 20px' : '22px 24px', overflowY: 'auto', flex: 1 }}>{children}</div>
        {footer ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: sheet ? '12px 20px 28px' : '14px 24px 20px', flexShrink: 0 }}>{footer}</div> : null}
      </div>
    </div>
  );
}
