import * as React from 'react';
import { IconName } from '../core/Icon';

/**
 * Single-figure card: label, big value (+unit), caption, optional chart slot, open-action ↗ and delta pill.
 * Covers Ibovespa / Market cap / Volume total / P&L margin / Best & worst performer.
 */
export interface MetricCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Small grey suffix, e.g. "BRL" */
  unit?: string;
  caption?: React.ReactNode;
  delta?: number;
  deltaSuffix?: string;
  /** Top-right IconButton glyph, e.g. 'arrow-up-right' */
  action?: IconName;
  actionLabel?: string;
  onAction?: () => void;
  /** 'value' = grey label + 24px value (default); 'label' = ink 15px title */
  emphasis?: 'value' | 'label';
  variant?: 'default' | 'raised' | 'accent';
  /** Chart slot (RibbonChart, sparkline) */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function MetricCard(props: MetricCardProps): JSX.Element;
