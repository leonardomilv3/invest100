import * as React from 'react';

/**
 * Asset mark. Pass the company's real logo via src when licensed; otherwise renders a
 * deterministic colour monogram from the ticker (PETR4 → "PE").
 */
export interface TickerLogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  symbol: string;
  /** Real logo URL (preferred in production) */
  src?: string;
  /** Override monogram background */
  color?: string;
  textColor?: string;
  /** px, default 36 */
  size?: number;
  shape?: 'circle' | 'square';
}

export function TickerLogo(props: TickerLogoProps): JSX.Element;
