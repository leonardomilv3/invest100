import * as React from 'react';

export interface StackedSeries { label: string; color: string; }
export interface StackedDatum { label: string; values: number[]; }

/**
 * Stacked columns with positive and negative stacking around a zero line, nice y-ticks (R$ k), centred legend,
 * hover band + dark tooltip listing every series. "Evolução do patrimônio" (aplicado + ganho), "Gastos por mês" (by category),
 * "Compromissos futuros" (by card).
 */
export interface StackedBarChartProps {
  data: StackedDatum[];
  series: StackedSeries[];
  /** px, default 260 */
  height?: number;
  formatAxis?: (v: number) => string;
  formatValue?: (v: number) => string;
  highlight?: number;
  onSelect?: (datum: StackedDatum, index: number) => void;
  showLegend?: boolean;
  style?: React.CSSProperties;
}

export function StackedBarChart(props: StackedBarChartProps): JSX.Element;
