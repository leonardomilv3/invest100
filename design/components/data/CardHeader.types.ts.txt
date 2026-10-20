import * as React from 'react';

/** Widget title row: 18px medium title (+ optional caption) left, icon actions right. */
export interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** IconButtons / SegmentedControl / RangeToggle */
  actions?: React.ReactNode;
  /** md 18px · sm 15px */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export function CardHeader(props: CardHeaderProps): JSX.Element;
