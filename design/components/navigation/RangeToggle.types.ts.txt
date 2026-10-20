import * as React from 'react';

/**
 * Time-range picker for charts: a row of small white discs, active = lime disc with soft glow.
 */
export interface RangeToggleProps {
  /** default ['1D','1S','1M','1A','5A'] (pt-BR: S = semana, A = ano) */
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
  /** sm 28 · md 32 · lg 40 (touch) */
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export function RangeToggle(props: RangeToggleProps): JSX.Element;
