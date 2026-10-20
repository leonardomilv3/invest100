import React, { useState } from 'react';

const pct = v => v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';

export function DonutChart({ data = [], size = 200, thickness = 26, centerLabel = 'Total', centerValue, format, legend = 'right', onSelect, style }) {
  const [hover, setHover] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2 - 4;
  const C = 2 * Math.PI * r;
  const gap = data.length > 1 ? 2 : 0;
  let acc = 0;
  const segs = data.map((d, i) => {
    const len = (d.value / total) * C;
    const s = { d, i, len: Math.max(0, len - gap), off: acc };
    acc += len;
    return s;
  });
  const hd = hover != null ? data[hover] : null;
  const fmt = format || (v => pct((v / total) * 100));
  const chart = (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ink-75)" strokeWidth={thickness} />
        {segs.map(s => (
          <circle key={s.i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.d.color} strokeWidth={hover === s.i ? thickness + 8 : thickness}
            strokeDasharray={s.len + ' ' + (C - s.len)} strokeDashoffset={-s.off} opacity={hover == null || hover === s.i ? 1 : 0.35}
            onMouseEnter={() => setHover(s.i)} onMouseLeave={() => setHover(null)} onClick={() => onSelect && onSelect(s.d, s.i)}
            style={{ cursor: onSelect ? 'pointer' : 'default', transition: 'stroke-width var(--dur-base) var(--ease-out), opacity var(--dur-base) var(--ease-out)' }} />
        ))}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none', fontFamily: 'var(--font-sans)', padding: thickness + 8 }}>
        <span style={{ fontSize: 11.5, color: 'var(--ink-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{hd ? hd.label : centerLabel}</span>
        <span style={{ fontSize: size >= 180 ? 20 : 16, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--ink-900)', fontVariantNumeric: 'tabular-nums', marginTop: 2, whiteSpace: 'nowrap' }}>{hd ? fmt(hd.value) : centerValue}</span>
      </div>
    </div>
  );
  if (!legend) return <div style={style}>{chart}</div>;
  return (
    <div style={{ display: 'flex', flexDirection: legend === 'bottom' ? 'column' : 'row', alignItems: 'center', gap: legend === 'bottom' ? 18 : 28, fontFamily: 'var(--font-sans)', ...style }}>
      {chart}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0, width: legend === 'bottom' ? '100%' : 'auto' }}>
        {data.map((d, i) => (
          <div key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => onSelect && onSelect(d, i)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, cursor: onSelect ? 'pointer' : 'default', opacity: hover == null || hover === i ? 1 : 0.5, transition: 'opacity var(--dur-fast) var(--ease-out)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
            <span style={{ flex: 1, minWidth: 0, color: 'var(--ink-700)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.label}</span>
            <span style={{ color: 'var(--ink-900)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{pct((d.value / total) * 100)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
