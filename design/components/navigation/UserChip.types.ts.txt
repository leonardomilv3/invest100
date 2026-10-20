import * as React from 'react';

/**
 * Account switcher in the top-right of the app bar: avatar + name + e-mail + chevron in a translucent capsule.
 */
export interface UserChipProps {
  name: string;
  email?: string;
  avatarSrc?: string;
  /** Avatar only (mobile header) */
  compact?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function UserChip(props: UserChipProps): JSX.Element;
