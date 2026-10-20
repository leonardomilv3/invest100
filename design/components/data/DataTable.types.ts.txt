import * as React from 'react';

export interface DataTableColumn<Row = any> {
  key: string;
  label: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  width?: number | string;
  render?: (row: Row) => React.ReactNode;
  /** Value used for internal sorting (defaults to row[key]) */
  sortValue?: (row: Row) => number | string;
}

/**
 * Market table: tiny grey headers with sort chevrons, airy 56px rows, hairline separators,
 * rounded white row-hover. Horizontally scrolls below minWidth.
 * @startingPoint section="Data" subtitle="Sortable market table" viewport="900x380"
 */
export interface DataTableProps<Row = any> {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  /** default 'id' */
  rowKey?: string;
  /** Controlled sort (pass with onSort) */
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string, dir: 'asc' | 'desc') => void;
  /** Uncontrolled initial sort */
  defaultSort?: { key: string; dir: 'asc' | 'desc' };
  onRowClick?: (row: Row) => void;
  /** 44px rows */
  dense?: boolean;
  /** px before horizontal scroll kicks in, default 720 */
  minWidth?: number;
  empty?: React.ReactNode;
  style?: React.CSSProperties;
}

export function DataTable<Row = any>(props: DataTableProps<Row>): JSX.Element;
