import * as React from 'react';

export interface LegendItem { label: string; tone?: 'positive' | 'low' | 'negative' | 'accent' | 'ink' | 'muted' | string; color?: string; }

/** Dot legend for charts: "● alta positiva  ● baixa alta  ● retorno negativo". */
export interface LegendProps {
  items: LegendItem[];
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export function Legend(props: LegendProps): JSX.Element;
