import * as React from 'react';
import { IconName } from './Icon';

/**
 * Pill button. Primary = black (Depositar), secondary = white (Sacar / Transferir),
 * soft = grey (Vender in rows), accent = lime (rare, celebratory / follow), ghost = text.
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: 'primary' | 'secondary' | 'soft' | 'accent' | 'ghost';
  /** sm 32px · md 40px · lg 48px (use lg on touch) */
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: IconName;
  iconRight?: IconName;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
