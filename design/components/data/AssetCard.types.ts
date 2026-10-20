import * as React from 'react';

/**
 * Holding tile: logo + name + (TICKER), "Valor atual" + bold value, stacked arrow + % on the right.
 * White (raised) inside a grey Holdings card by default.
 */
export interface AssetCardProps {
  name: string;
  symbol: string;
  logo?: React.ReactNode;
  /** default "Valor atual" */
  label?: string;
  value: React.ReactNode;
  delta?: number;
  locale?: string;
  variant?: 'raised' | 'default';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function AssetCard(props: AssetCardProps): JSX.Element;
