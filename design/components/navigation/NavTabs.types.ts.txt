import * as React from 'react';

export interface NavTabItem { id: string; label: string; }

/**
 * Top-level text navigation. Inactive items are plain ink text; the active one becomes a black pill.
 */
export interface NavTabsProps {
  items: NavTabItem[];
  /** Controlled active id (uncontrolled if omitted) */
  value?: string;
  onChange?: (id: string) => void;
  /** md 44px (top bar) · sm 36px (sub-nav, mobile) */
  size?: 'sm' | 'md';
  /** Horizontal scroll instead of wrap — use on mobile */
  scrollable?: boolean;
  style?: React.CSSProperties;
}

export function NavTabs(props: NavTabsProps): JSX.Element;
