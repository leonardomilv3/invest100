import * as React from 'react';
import { IconName } from './Icon';

/**
 * Circular icon-only button. raised = white disc (search, calendar, bell), inverse = black disc
 * (active filter, add), soft = grey disc (card-header filter), accent = lime.
 */
export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  icon: IconName;
  /** Required accessible label (also used as tooltip) */
  label: string;
  variant?: 'raised' | 'inverse' | 'soft' | 'accent' | 'ghost';
  /** sm 32 · md 40 · lg 48 */
  size?: 'sm' | 'md' | 'lg';
  /** Red notification dot */
  badge?: boolean;
  /** Forces the inverse (black) look — for toggles */
  active?: boolean;
  disabled?: boolean;
}

export function IconButton(props: IconButtonProps): JSX.Element;
