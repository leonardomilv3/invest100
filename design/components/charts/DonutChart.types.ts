import * as React from 'react';

export interface DonutDatum { label: string; value: number; color: string; }

/**
 * Donut with hover-to-inspect (segment thickens, centre shows its label + value) and an optional % legend.
 * Spending by category, allocation by asset class.
 */
export interface DonutChartProps {
  data: DonutDatum[];
  /** px, default 200 */
  size?: number;
  /** ring width, default 26 */
  thickness?: number;
  centerLabel?: React.ReactNode;
  centerValue?: React.ReactNode;
  /** Formats the hovered value in the centre (default: % of total) */
  format?: (value: number) => React.ReactNode;
  legend?: 'right' | 'bottom' | false;
  onSelect?: (datum: DonutDatum, index: number) => void;
  style?: React.CSSProperties;
}

export function DonutChart(props: DonutChartProps): JSX.Element;
