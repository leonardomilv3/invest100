import * as React from 'react';

/**
 * Performance line chart: thin teal line over a dot-matrix fill that fades downward, dashed crosshair
 * to a ringed ink point, black pill tooltip. Width is responsive (ResizeObserver).
 * @startingPoint section="Charts" subtitle="Portfolio performance area chart" viewport="760x300"
 */
export interface AreaChartProps {
  data: number[];
  /** Evenly spaced x labels */
  labels?: string[];
  /** Top → bottom y labels */
  yTicks?: string[];
  /** Pinned index (shown when not hovering) */
  highlight?: number;
  onHighlight?: (index: number, value: number) => void;
  /** Tooltip text or (index, value) => text */
  tooltip?: React.ReactNode | ((index: number, value: number) => React.ReactNode);
  /** px, default 240 */
  height?: number;
  /** Line + dot colour, default var(--chart-positive) */
  color?: string;
  style?: React.CSSProperties;
}

export function AreaChart(props: AreaChartProps): JSX.Element;
