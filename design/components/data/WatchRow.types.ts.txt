import * as React from 'react';

/** Watchlist item: logo, name, ticker · price with plain delta below. Translucent white capsule-row. */
export interface WatchRowProps {
  name: string;
  symbol: string;
  logo?: React.ReactNode;
  /** Pre-formatted price */
  price: React.ReactNode;
  delta?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function WatchRow(props: WatchRowProps): JSX.Element;
