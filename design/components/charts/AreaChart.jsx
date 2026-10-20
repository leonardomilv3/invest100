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

export function AreaChart({ data = [], labels = [], yTicks = [], highlight, onHighlight, tooltip, height = 240, color = 'var(--chart-positive)', style }) {
  const [ref, w] = useWidth();
  const [hover, setHover] = useState(null);
  const idRef = useRef('i100-area-' + (++uid));
  const id = idRef.current;
  const padL = yTicks.length ? 44 : 4, padR = 8, padT = 40, padB = labels.length ? 28 : 6;
  const iw = Math.max(0, w - padL - padR), ih = height - padT - padB;
  const min = Math.min.apply(null, data), max = Math.max.apply(null, data);
  const span = max - min || 1;
  const x = i => padL + (data.length > 1 ? (i / (data.length - 1)) * iw : 0);
  const y = v => padT + ih - ((v - min) / span) * ih * 0.86 - ih * 0.07;
  const line = data.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
  const area = data.length ? line + ' L' + x(data.length - 1) + ' ' + (padT + ih) + ' L' + x(0) + ' ' + (padT + ih) + ' Z' : '';
  const hi = hover != null ? hover : highlight;
  const move = e => {
    if (!iw || !data.length) return;
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left - padL) / iw) * (data.length - 1));
    const c = Math.max(0, Math.min(data.length - 1, i));
    setHover(c);
    if (onHighlight) onHighlight(c, data[c]);
  };
  const tip = hi != null ? (typeof tooltip === 'function' ? tooltip(hi, data[hi]) : tooltip) : null;
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height, ...style }}>
      {w > 0 ? (
        <svg width={w} height={height} onMouseMove={move} onMouseLeave={() => setHover(null)} style={{ display: 'block', overflow: 'visible', fontFamily: 'var(--font-sans)' }}>
          <defs>
            <pattern id={id + '-dots'} width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.7" fill={color} /></pattern>
            <linearGradient id={id + '-fade'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.9" /><stop offset="1" stopColor="#fff" stopOpacity="0.05" /></linearGradient>
            <mask id={id + '-mask'}><rect x="0" y="0" width={w} height={height} fill={'url(#' + id + '-fade)'} /></mask>
          </defs>
          {yTicks.map((t, i) => (
            <text key={i} x={0} y={padT + (yTicks.length > 1 ? (i / (yTicks.length - 1)) * ih : 0) + 4} fontSize="10" fill="var(--ink-400)">{t}</text>
          ))}
          <line x1={padL} x2={padL} y1={padT - 10} y2={padT + ih} stroke="rgba(20,20,20,0.12)" />
          <line x1={padL} x2={padL + iw} y1={padT + ih} y2={padT + ih} stroke="rgba(20,20,20,0.12)" />
          <path d={area} fill={'url(#' + id + '-dots)'} mask={'url(#' + id + '-mask)'} />
          <path d={area} fill="var(--chart-fill)" />
          <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          {hi != null && data[hi] != null ? (
            <g>
              <line x1={padL} x2={padL + iw} y1={y(data[hi])} y2={y(data[hi])} stroke="var(--ink-700)" strokeDasharray="3 4" strokeWidth="1" opacity="0.6" />
              <line x1={x(hi)} x2={x(hi)} y1={y(data[hi])} y2={padT + ih} stroke="var(--ink-700)" strokeDasharray="3 4" strokeWidth="1" opacity="0.6" />
              <circle cx={x(hi)} cy={y(data[hi])} r="4.5" fill="var(--ink-900)" stroke="#fff" strokeWidth="2" />
            </g>
          ) : null}
          {labels.map((l, i) => (
            <text key={l + i} x={padL + (labels.length > 1 ? (i / (labels.length - 1)) * iw : 0)} y={height - 6} fontSize="10.5" fill="var(--ink-400)" textAnchor={i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'}>{l}</text>
          ))}
        </svg>
      ) : null}
      {tip && hi != null && w > 0 ? (
        <div style={{
          position: 'absolute', left: x(hi), top: y(data[hi]) - 14, transform: 'translate(-50%,-100%)', background: 'var(--ink-900)', color: 'var(--white)',
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, padding: '6px 10px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: 'var(--shadow-md)',
        }}>
          {tip}
          <span style={{ position: 'absolute', left: '50%', bottom: -4, marginLeft: -4, width: 8, height: 8, background: 'var(--ink-900)', transform: 'rotate(45deg)', borderRadius: 1 }} />
        </div>
      ) : null}
    </div>
  );
}
