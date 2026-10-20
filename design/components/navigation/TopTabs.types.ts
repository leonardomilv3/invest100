import * as React from 'react';
import { IconName } from '../core/Icon';

export interface TopTabItem { id: string; label: string; icon?: IconName; badge?: React.ReactNode; }

/**
 * Section tabs for the v2 (finance) app bar: icon + label, 2px ink underline on the active tab and a lime disc behind its icon.
 * Scrolls horizontally when it overflows.
 */
export interface TopTabsProps {
  items: TopTabItem[];
  value?: string;
  onChange?: (id: string) => void;
  /** md 56px · sm 44px */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export function TopTabs(props: TopTabsProps): JSX.Element;
