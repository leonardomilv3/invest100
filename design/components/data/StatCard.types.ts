import * as React from 'react';

/**
 * KPI card for a named asset — "Maior alta / Maior baixa". variant="accent" makes it the lime hero card
 * (one per view). Delta pill sits bottom-right.
 * @startingPoint section="Data" subtitle="Top gainer / loser KPI card" viewport="420x220"
 */
export interface StatCardProps {
  /** Eyebrow, e.g. "Maior alta" */
  label?: string;
  name?: string;
  symbol?: string;
  /** Custom logo node; defaults to TickerLogo(symbol) */
  logo?: React.ReactNode;
  /** e.g. "2.340 Volume" */
  meta?: string;
  /** Pre-formatted value, e.g. "R$ 585.235,52" */
  value: React.ReactNode;
  caption?: string;
  delta?: number;
  deltaSuffix?: string;
  variant?: 'default' | 'accent';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function StatCard(props: StatCardProps): JSX.Element;
