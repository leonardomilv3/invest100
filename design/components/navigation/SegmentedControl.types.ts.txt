import * as React from 'react';

export type SegmentOption = string | { value: string; label: string };

/**
 * Capsule of mutually-exclusive filters (Commodities / Ações / Renda fixa / Índices).
 * Active segment = black pill; inactive = grey text.
 */
export interface SegmentedControlProps {
  options: SegmentOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** sm 32 · md 40 · lg 48 */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch segments equally (mobile) */
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
