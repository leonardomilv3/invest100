import * as React from 'react';

/**
 * Signature progress bar. fill = lime bar + white ⋮ handle + hatched remainder (session progress,
 * goal completion). marker = thin rule over a hatched band with a lime/black value pill.
 */
export interface ProgressTrackProps {
  /** 0–100 */
  value: number;
  variant?: 'fill' | 'marker';
  /** marker label, defaults to "{value}%" */
  label?: string;
  tone?: 'accent' | 'inverse';
  style?: React.CSSProperties;
}

export function ProgressTrack(props: ProgressTrackProps): JSX.Element;
