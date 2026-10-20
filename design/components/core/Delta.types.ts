import * as React from 'react';

/**
 * Signed market change with direction arrow: "+2,15% ↗" (green) / "−3,41% ↘" (red).
 * pill = white capsule (on cards), soft = tinted capsule, plain = text only (rows, tables).
 */
export interface DeltaProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Signed number; sign decides colour + arrow */
  value: number;
  decimals?: number;
  /** default '%'; use '' for points, or pass prefix 'R$ ' for currency */
  suffix?: string;
  prefix?: string;
  /** default 'pt-BR' (1.234,56) */
  locale?: string;
  /** Override the rendered text entirely (colour still follows value) */
  label?: string;
  variant?: 'pill' | 'soft' | 'plain';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  iconPosition?: 'start' | 'end';
}

export function Delta(props: DeltaProps): JSX.Element;
