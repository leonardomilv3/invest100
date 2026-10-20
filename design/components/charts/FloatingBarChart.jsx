import React, { useState } from 'react';

const CAPS = { positive: 'var(--chart-positive)', low: 'var(--chart-low)', negative: 'var(--chart-negative)' };

export function FloatingBarChart({ bars = [], labels = [], highlight, onHighlight, height = 220, showLabels = true, style }) {
  const [inner, setInner] = useState(highlight != null ? highlight : null);
  const [hover, setHover] = useState(null);
  const active = hover != null ? hover : (highlight != null ? highlight : inner);
  const pick = i => { setInner(i); if (onHighlight) onHighlight(i, bars[i]); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...style }}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 3, height }} onMouseLeave={() => setHover(null)}>
        {bars.map((b, i) => {
          const on = i === active;
          const v = Math.max(0.04, Math.min(1, b.value));
          return (
            <div key={i} onMouseEnter={() => setHover(i)} onClick={() => pick(i)} style={{ position: 'relative', flex: 1, minWidth: 0, cursor: 'pointer' }}>
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, height: (v * 100) + '%',
                background: on ? 'linear-gradient(180deg, rgba(194,248,108,0.75) 0%, rgba(194,248,108,0.18) 100%)' : 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.35) 55%, rgba(255,255,255,0) 100%)',
                borderTop: '2px solid ' + (on ? 'var(--lime-400)' : (CAPS[b.tone] || CAPS.positive)),
                transition: 'height var(--dur-slow) var(--ease-out), background var(--dur-base) var(--ease-out)',
              }}>
                {on ? <span style={{ position: 'absolute', left: '50%', top: -6, width: 9, height: 9, marginLeft: -4.5, borderRadius: '50%', background: 'var(--ink-900)', boxShadow: '0 0 0 2px var(--white)' }} /> : null}
              </div>
            </div>
          );
        })}
      </div>
      {showLabels && labels.length ? (
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 32, borderRadius: 'var(--radius-pill)', background: 'rgba(20,20,20,0.03)', padding: '0 8px' }}>
          {labels.map(l => <span key={l} style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-500)', flex: 1, textAlign: 'center' }}>{l}</span>)}
        </div>
      ) : null}
    </div>
  );
}
