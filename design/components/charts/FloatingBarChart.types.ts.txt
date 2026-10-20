import * as React from 'react';

export interface FloatingBar { value: number; tone?: 'positive' | 'low' | 'negative'; }

/**
 * Signature portfolio chart: frosted white columns fading downward, each topped by a 2px coloured cap
 * (teal positive / amber low / orange negative). The selected column turns lime with an ink dot.
 * Month labels sit in a faint pill track below.
 * @startingPoint section="Charts" subtitle="Floating-cap bar chart (portfolio value)" viewport="760x300"
 */
export interface FloatingBarChartProps {
  /** value 0–1 (relative height) */
  bars: FloatingBar[];
  /** X labels, evenly distributed (may be fewer than bars, e.g. 12 months × 2 bars) */
  labels?: string[];
  /** Controlled selected index */
  highlight?: number;
  onHighlight?: (index: number, bar: FloatingBar) => void;
  /** px, default 220 */
  height?: number;
  showLabels?: boolean;
  style?: React.CSSProperties;
}

export function FloatingBarChart(props: FloatingBarChartProps): JSX.Element;
