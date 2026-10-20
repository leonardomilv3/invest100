import * as React from 'react';

/**
 * Brand name set in plain type. No Investidor100 logo/mark was supplied — this is a typographic
 * placeholder; swap for the official mark when available.
 */
export interface WordmarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** px font-size, default 20 */
  size?: number;
  tone?: 'ink' | 'white';
}

export function Wordmark(props: WordmarkProps): JSX.Element;
