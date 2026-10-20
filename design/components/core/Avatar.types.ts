import * as React from 'react';

/**
 * User avatar. circle in chrome (UserChip); squircle on lime for testimonials / personas.
 * Falls back to initials when no src.
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  name?: string;
  /** px, default 40 */
  size?: number;
  shape?: 'circle' | 'squircle';
  /** Background behind cut-out portraits / initials */
  tone?: 'accent' | 'neutral' | 'inverse';
}

export function Avatar(props: AvatarProps): JSX.Element;
