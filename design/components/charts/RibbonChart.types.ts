import * as React from 'react';

/**
 * Range ribbon (index card): hatched vertical-rib band between an upper and lower series, ink vertex dots,
 * an ink marker line at the highlight with a lime value pill.
 */
export interface RibbonChartProps {
  /** Upper bound series (e.g. daily highs) */
  upper: number[];
  /** Lower bound series, same length */
  lower: number[];
  /** Index for the marker + pill */
  highlight?: number;
  /** Pill text, e.g. "8,65%" */
  label?: string;
  /** px, default 96 */
  height?: number;
  style?: React.CSSProperties;
}

export function RibbonChart(props: RibbonChartProps): JSX.Element;
