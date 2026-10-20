import React, { useState, useMemo } from 'react';
import { Icon } from '../core/Icon.jsx';

export function DataTable({ columns = [], rows = [], rowKey = 'id', sortKey, sortDir, onSort, defaultSort, onRowClick, dense = false, minWidth = 720, empty = 'Nenhum resultado', style }) {
  const [inner, setInner] = useState(defaultSort || { key: null, dir: 'desc' });
  const controlled = onSort !== undefined;
  const sk = controlled ? sortKey : inner.key;
  const sd = controlled ? sortDir : inner.dir;
  const [hoverRow, setHoverRow] = useState(null);
  const sorted = useMemo(() => {
    if (!sk || controlled) return rows;
    const col = columns.find(c => c.key === sk);
    const get = col && col.sortValue ? col.sortValue : r => r[sk];
    return rows.slice().sort((a, b) => {
      const x = get(a), y = get(b);
      const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'pt-BR');
      return sd === 'asc' ? c : -c;
    });
  }, [rows, sk, sd, columns, controlled]);
  const toggle = key => {
    const dir = sk === key && sd === 'desc' ? 'asc' : 'desc';
    if (controlled) onSort(key, dir); else setInner({ key, dir });
  };
  const rh = dense ? 44 : 56;
  return (
    <div style={{ width: '100%', overflowX: 'auto', ...style }}>
      <table style={{ width: '100%', minWidth, borderCollapse: 'separate', borderSpacing: 0, fontFamily: 'var(--font-sans)' }}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} style={{ textAlign: c.align || 'left', fontSize: 11, fontWeight: 500, color: 'var(--ink-400)', padding: '0 12px', height: 36, whiteSpace: 'nowrap', width: c.width, borderBottom: '1px solid var(--border-subtle)' }}>
                {c.sortable ? (
                  <button type="button" onClick={() => toggle(c.key)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'none', padding: 0, font: 'inherit', color: sk === c.key ? 'var(--ink-900)' : 'inherit', cursor: 'pointer' }}>
                    {c.label}
                    <Icon name={sk === c.key ? (sd === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevrons-up-down'} size={12} strokeWidth={2} />
                  </button>
                ) : c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: 32, textAlign: 'center', color: 'var(--ink-400)', fontSize: 13 }}>{empty}</td></tr>
          ) : sorted.map((r, i) => {
            const k = r[rowKey] != null ? r[rowKey] : i;
            const hov = hoverRow === k;
            return (
              <tr key={k} onClick={onRowClick ? () => onRowClick(r) : undefined} onMouseEnter={() => setHoverRow(k)} onMouseLeave={() => setHoverRow(null)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                {columns.map((c, ci) => (
                  <td key={c.key} style={{
                    textAlign: c.align || 'left', height: rh, padding: '0 12px', fontSize: 13, color: 'var(--ink-900)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
                    background: hov ? 'rgba(255,255,255,0.85)' : 'transparent', borderBottom: '1px solid var(--border-subtle)',
                    borderTopLeftRadius: ci === 0 ? 14 : 0, borderBottomLeftRadius: ci === 0 ? 14 : 0,
                    borderTopRightRadius: ci === columns.length - 1 ? 14 : 0, borderBottomRightRadius: ci === columns.length - 1 ? 14 : 0,
                    transition: 'background var(--dur-fast) var(--ease-out)',
                  }}>
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
