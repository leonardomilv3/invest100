import * as React from 'react';

/**
 * Base surface. default = soft grey card with white hairline edge (most widgets);
 * raised = white (nested items, rows); accent = lime (the one hero KPI); inverse = black;
 * sunken = recessed grey; glass = translucent over imagery; outlined = white + 1px border, radius 16 (v2 finance screens — pass radius="var(--radius-card)").
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'raised' | 'accent' | 'inverse' | 'sunken' | 'glass' | 'outlined';
  /** px number or CSS padding; default 20 */
  padding?: number | string;
  /** default var(--radius-xl) = 24px */
  radius?: string | number;
  /** Lifts on hover */
  interactive?: boolean;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
