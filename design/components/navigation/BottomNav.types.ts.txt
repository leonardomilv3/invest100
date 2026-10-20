import * as React from 'react';
import { IconName } from '../core/Icon';

export interface BottomNavItem { id: string; icon: IconName; label: string; }

/**
 * Mobile floating tab bar — the SideRail translated to touch. Inactive = grey icons,
 * active = black pill with icon + label. 52px targets.
 * @startingPoint section="Navigation" subtitle="Mobile floating tab bar" viewport="390x120"
 */
export interface BottomNavProps {
  /** 4–5 items */
  items: BottomNavItem[];
  value?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}

export function BottomNav(props: BottomNavProps): JSX.Element;
