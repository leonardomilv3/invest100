import * as React from 'react';

/** Lucide glyph names shipped with the system (see assets/icons/). */
export type IconName =
  | 'layout-grid'
  | 'chart-column'
  | 'chart-pie'
  | 'activity'
  | 'chart-candlestick'
  | 'chart-no-axes-column-increasing'
  | 'file-text'
  | 'settings'
  | 'circle-help'
  | 'bell'
  | 'search'
  | 'sliders-horizontal'
  | 'calendar'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-right'
  | 'chevron-left'
  | 'arrow-up-right'
  | 'arrow-down-right'
  | 'trending-up'
  | 'trending-down'
  | 'plus'
  | 'minus'
  | 'list-filter'
  | 'clock'
  | 'x'
  | 'menu'
  | 'arrow-left-right'
  | 'chevrons-up-down'
  | 'play'
  | 'ellipsis-vertical'
  | 'star'
  | 'log-out'
  | 'user'
  | 'wallet'
  | 'house'
  | 'briefcase'
  | 'globe'
  | 'check'
  | 'eye'
  | 'download'
  | 'refresh-cw'
  | 'arrow-up'
  | 'arrow-down'
  | 'info'
  | 'bookmark'
  | 'newspaper'
  | 'layers'
  | 'utensils'
  | 'car'
  | 'gamepad-2'
  | 'heart-pulse'
  | 'graduation-cap'
  | 'repeat'
  | 'shopping-bag'
  | 'plane'
  | 'credit-card'
  | 'receipt'
  | 'piggy-bank'
  | 'target'
  | 'landmark'
  | 'building-2'
  | 'coins'
  | 'banknote'
  | 'arrow-down-left'
  | 'calendar-clock'
  | 'circle-check'
  | 'circle-x'
  | 'pencil'
  | 'grip-vertical'
  | 'columns-3'
  | 'trophy'
  | 'shopping-cart'
  | 'zap'
  | 'smartphone'
  | 'paw-print'
  | 'gift'
  | 'fuel'
  | 'hand-coins'
  | 'chart-bar'
  | 'link'
  | 'percent'
  | 'ellipsis'
  | 'calendar-days'
  | 'tag'
  | 'nfc'
  | 'circle-plus'
  | 'lock';

/**
 * Line icon — Lucide outline set rendered inline at a thin 1.6 stroke to match the reference UI.
 * Inherits currentColor by default.
 */
export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  /** px, default 18 */
  size?: number;
  /** default 1.6 — use 1.4 at ≥24px, 2 at ≤12px */
  strokeWidth?: number;
  color?: string;
  /** 'none' (default) or a color for solid glyphs (e.g. play ▸ in TransactionRow) */
  fill?: string;
  /** Accessible label; omit for decorative icons */
  title?: string;
}

export function Icon(props: IconProps): JSX.Element | null;
export const iconNames: IconName[];
