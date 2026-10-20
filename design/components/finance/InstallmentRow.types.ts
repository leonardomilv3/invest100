import * as React from 'react';
import { CategoryKey } from './CategoryIcon';

/**
 * Credit-card installment ("parcelamento"): description, segmented progress (filled = paid), "Parcela 4/10 · •• 4821",
 * monthly amount and remaining balance. `compact` stacks the bar under the row (mobile, narrow cards).
 */
export interface InstallmentRowProps {
  description: string;
  subtitle?: string;
  category?: CategoryKey;
  /** e.g. "•• 4821" */
  card?: string;
  current: number;
  total: number;
  /** Per-installment amount */
  amount: number;
  compact?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function InstallmentRow(props: InstallmentRowProps): JSX.Element;
