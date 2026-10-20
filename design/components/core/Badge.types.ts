import * as React from 'react';

/**
 * Compact pill for figures and status: lime "29,2%" highlight, black "+104,45%" chart tooltip,
 * tinted positive/negative for statuses.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'accent' | 'inverse' | 'white' | 'neutral' | 'positive' | 'negative' | 'warning' | 'info';
  /** sm 20 · md 26 · lg 32 */
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): JSX.Element;
