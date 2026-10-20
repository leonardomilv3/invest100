import * as React from 'react';

/**
 * Label capsule with optional status dot — section eyebrows ("● Objetivo"), categories, filters applied.
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Dot colour key or any CSS colour */
  dot?: 'ink' | 'positive' | 'negative' | 'warning' | 'accent' | string;
  tone?: 'white' | 'soft' | 'accent' | 'inverse' | 'outline';
  /** sm 28 · md 36 · lg 48 */
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export function Tag(props: TagProps): JSX.Element;
