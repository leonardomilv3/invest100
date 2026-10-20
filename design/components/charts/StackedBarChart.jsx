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
function niceStep(span) {
  const raw = span / 4 || 1;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}
const defFmt = v => { const a = Math.abs(v); const s = a >= 1000 ? (a / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'k' : a.toLocaleString('pt-BR'); return (v < 0 ? '−' : '') + 'R$ ' + s; };
const defTip = v => (v < 0 ? '−' : '') + 'R$\u00a0' + Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function StackedBarChart({ data = [], series = [], height = 260, formatAxis = defFmt, formatValue = defTip, highlight, onSelect, showLegend = true, style }) {
  const [ref, w] = useWidth();
  const [hover, setHover] = useState(null);
  let max = 0, min = 0;
  data.forEach(d => { let p = 0, n = 0; d.values.forEach(v => { if (v >= 0) p += v; else n += v; }); max = Math.max(max, p); min = Math.min(min, n); });
  const step = niceStep(max - min);
  const top = Math.ceil(max / step) * step || step;
  const bot = min < 0 ? (-min < step * 0.6 ? Math.min(min * 1.5, -step * 0.25) : Math.floor(min / step) * step) : 0;
  const ticks = [];
  for (let v = top; v >= bot - 1e-9; v -= step) ticks.push(v);
  if (bot < 0 && ticks[ticks.length - 1] > bot + 1e-9 && ticks[ticks.length - 1] - bot > step * 0.2) ticks.push(bot);
  const padL = 58, padT = 10, padB = 28;
  const ih = height - padT - padB, iw = Math.max(0, w - padL - 4);
  const y = v => padT + ((top - v) / (top - bot)) * ih;
  const band = data.length ? iw / data.length : 0;
  const bw = Math.min(44, band * 0.58);
  const act = hover != null ? hover : highlight;
  const tipD = hover != null ? data[hover] : null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'var(--font-sans)', ...style }}>
      {showLegend ? (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {series.map(s => <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-600)' }}><span style={{ width: 12, height: 10, borderRadius: 3, background: s.color }} />{s.label}</span>)}
        </div>
      ) : null}
      <div ref={ref} style={{ position: 'relative', width: '100%', height }} onMouseLeave={() => setHover(null)}>
        {w > 0 ? (
          <svg width={w} height={height} style={{ display: 'block', overflow: 'visible' }}>
            {ticks.map(t => (
              <g key={t}>
                <line x1={padL} x2={w} y1={y(t)} y2={y(t)} stroke={Math.abs(t) < 1e-9 ? 'rgba(20,20,20,0.35)' : 'var(--chart-grid)'} strokeWidth="1" />
                <text x={padL - 10} y={y(t) + 3.5} fontSize="10.5" fill="var(--ink-400)" textAnchor="end">{formatAxis(t)}</text>
              </g>
            ))}
            {data.map((d, i) => {
              const cx = padL + band * i + band / 2;
              let p = 0, n = 0;
              const on = act === i;
              return (
                <g key={d.label} onMouseEnter={() => setHover(i)} onClick={() => onSelect && onSelect(d, i)} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
                  <rect x={padL + band * i + 2} y={padT} width={Math.max(0, band - 4)} height={ih} rx="8" fill={on ? 'rgba(20,20,20,0.04)' : 'transparent'} />
                  {d.values.map((v, si) => {
                    if (!v) return null;
                    let y0, y1;
                    if (v >= 0) { y0 = y(p + v); y1 = y(p); p += v; } else { y0 = y(n); y1 = y(n + v); n += v; }
                    return <rect key={si} x={cx - bw / 2} y={y0} width={bw} height={Math.max(1, y1 - y0)} rx="4" fill={series[si] ? series[si].color : 'var(--ink-300)'} opacity={hover == null || on ? 1 : 0.5} style={{ transition: 'opacity var(--dur-base) var(--ease-out)' }} />;
                  })}
                  <text x={cx} y={height - 8} fontSize="10.5" fill={on ? 'var(--ink-900)' : 'var(--ink-400)'} fontWeight={on ? 600 : 400} textAnchor="middle">{d.label}</text>
                </g>
              );
            })}
          </svg>
        ) : null}
        {tipD && w > 0 ? (
          <div style={{
            position: 'absolute', top: 0, left: Math.min(Math.max(padL, padL + band * act + band / 2 - 80), w - 170), width: 170, pointerEvents: 'none',
            background: 'var(--ink-900)', color: 'var(--white)', borderRadius: 12, padding: '10px 12px', boxShadow: 'var(--shadow-float)', fontSize: 12,
          }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{tipD.label}</div>
            {series.map((s, si) => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', marginTop: 3 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)' }}><span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />{s.label}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{formatValue(tipD.values[si] || 0)}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
