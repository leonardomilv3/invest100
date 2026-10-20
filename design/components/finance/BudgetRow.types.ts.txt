import * as React from 'react';
import { CategoryKey } from './CategoryIcon';

/**
 * Category budget line: icon, name, "R$ spent de R$ limit", remaining/over, and a progress bar
 * (lime < 85% · amber 85–100% · red > 100%) over a hatched track.
 */
export interface BudgetRowProps {
  category?: CategoryKey;
  /** Defaults to the category label */
  label?: string;
  /** e.g. "12 lançamentos" */
  caption?: React.ReactNode;
  spent: number;
  limit: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function BudgetRow(props: BudgetRowProps): JSX.Element;
