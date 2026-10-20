import * as React from 'react';

/** Order history line: "Compra ▸ PETR4 / 12 OUT 2025" · price + shares · signed amount (green/red). */
export interface TransactionRowProps {
  side?: 'buy' | 'sell';
  symbol: string;
  /** e.g. "12 OUT 2025" (rendered uppercase) */
  date: string;
  /** Unit price, pre-formatted */
  price: React.ReactNode;
  /** e.g. "5 cotas" */
  shares: React.ReactNode;
  /** Signed, pre-formatted: "+R$ 4.525,82" */
  amount: React.ReactNode;
  buyLabel?: string;
  sellLabel?: string;
  /** Override amount colour (defaults: buy = positive) */
  positive?: boolean;
  style?: React.CSSProperties;
}

export function TransactionRow(props: TransactionRowProps): JSX.Element;
