import * as React from 'react';

/**
 * Credit-card summary tile (card-shaped): name, •••• last4, current invoice, limit-used bar, due date, available limit, network.
 * Tones: ink (default), lime (one per screen), white (outlined). `selected` adds an ink focus ring.
 * @startingPoint section="Finance" subtitle="Credit card tile with invoice + limit" viewport="360x220"
 */
export interface CreditCardTileProps {
  name: string;
  last4: string;
  /** Network as plain text, e.g. "Visa" (no logos) */
  brand?: string;
  tone?: 'ink' | 'lime' | 'white';
  invoice: number;
  /** e.g. "10 NOV" */
  dueDate?: string;
  limit: number;
  used: number;
  /** e.g. "Aberta", "Fechada" */
  status?: string;
  selected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function CreditCardTile(props: CreditCardTileProps): JSX.Element;
