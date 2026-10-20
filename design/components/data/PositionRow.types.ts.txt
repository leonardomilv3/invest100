import * as React from 'react';

/** Compact position line with a quick action: ticker/company · "Valor atual" value · [Vender]. */
export interface PositionRowProps {
  symbol: string;
  company?: string;
  logo?: React.ReactNode;
  label?: string;
  value: React.ReactNode;
  /** default "Vender"; pass null to hide */
  actionLabel?: string | null;
  onAction?: () => void;
  style?: React.CSSProperties;
}

export function PositionRow(props: PositionRowProps): JSX.Element;
