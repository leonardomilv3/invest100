import * as React from 'react';
import { IconName } from '../core/Icon';

/**
 * Labelled form input. Box radius 12, 1px border; focus = ink border + lime glow; error = red border + message.
 * `prefix` renders a grey addon segment (e.g. "R$").
 */
export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix' | 'value' | 'defaultValue'> {
  label?: React.ReactNode;
  /** Shows "(Opcional)" on the right of the label */
  optional?: boolean;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** Addon segment, e.g. "R$" */
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: IconName;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** sm 36 · md 44 · lg 52 (mobile) */
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'right';
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}

export function TextField(props: TextFieldProps): JSX.Element;
