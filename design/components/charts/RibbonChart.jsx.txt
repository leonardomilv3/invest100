import React, { useState, useRef, useEffect } from 'react';

function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return undefined;
    const ro = new ResizeObserver(es => { for (const e of es) setW(e.contentRect.width); });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

let uid = 0;

export function RibbonChart({ upper = [], lower = [], highlight, label, height = 96, style }) {
  const [ref, w] = useWidth();
  const idRef = useRef('i100-rib-' + (++uid));
  const id = idRef.current;
  const all = upper.concat(lower);
  const min = Math.min.apply(null, all), max = Math.max.apply(null, all);
  const span = max - min || 1;
  const n = Math.max(upper.length, 2);
  const pad = 8;
  const x = i => (i / (n - 1)) * w;
  const y = v => pad + (1 - (v - min) / span) * (height - pad * 2);
  const up = upper.map((v, i) => [x(i), y(v)]);
  const lo = lower.map((v, i) => [x(i), y(v)]);
  const poly = up.concat(lo.slice().reverse()).map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const pl = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height, ...style }}>
      {w > 0 ? (
        <svg width={w} height={height} style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <pattern id={id} width="3.2" height="8" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="1" height="8" fill="rgba(20,20,20,0.22)" /></pattern>
          </defs>
          <polygon points={poly} fill="rgba(20,20,20,0.03)" />
          <polygon points={poly} fill={'url(#' + id + ')'} />
          <polyline points={pl(up)} fill="none" stroke="rgba(20,20,20,0.16)" strokeWidth="1" />
          <polyline points={pl(lo)} fill="none" stroke="rgba(20,20,20,0.16)" strokeWidth="1" />
          {up.slice(1, -1).map((p, i) => <circle key={'u' + i} cx={p[0]} cy={p[1]} r="2.4" fill="var(--ink-900)" />)}
          {lo.slice(1, -1).map((p, i) => <circle key={'l' + i} cx={p[0]} cy={p[1]} r="2.4" fill="var(--ink-900)" />)}
          {highlight != null && up[highlight] && lo[highlight] ? (
            <line x1={up[highlight][0]} x2={lo[highlight][0]} y1={up[highlight][1] - 4} y2={lo[highlight][1] + 4} stroke="var(--ink-900)" strokeWidth="1.2" />
          ) : null}
        </svg>
      ) : null}
      {label && highlight != null && up[highlight] && w > 0 ? (
        <span style={{
          position: 'absolute', left: up[highlight][0], top: (up[highlight][1] + lo[highlight][1]) / 2, transform: 'translate(-50%,-50%)',
          height: 26, padding: '0 10px', display: 'inline-flex', alignItems: 'center', borderRadius: 'var(--radius-pill)', background: 'var(--lime-300)',
          color: 'var(--ink-900)', fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', boxShadow: '0 0 0 3px rgba(255,255,255,0.7)',
        }}>{label}</span>
      ) : null}
    </div>
  );
}
