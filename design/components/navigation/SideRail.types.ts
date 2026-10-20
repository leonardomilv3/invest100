import * as React from 'react';
import { IconName } from '../core/Icon';

export interface SideRailItem { id: string; icon: IconName; label: string; }

/**
 * Vertical icon rail (desktop). White discs in a translucent capsule; the active section is a black disc.
 * Labels appear as black tooltips on hover. Hidden on mobile — replaced by BottomNav.
 */
export interface SideRailProps {
  items: SideRailItem[];
  /** Bottom group (Configurações, Ajuda) */
  footerItems?: SideRailItem[];
  value?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}

export function SideRail(props: SideRailProps): JSX.Element;
