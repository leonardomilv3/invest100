import * as React from 'react';
import { IconName } from '../core/Icon';

export type SelectFieldOption = string | { value: string; label: string };

/**
 * Boxed form select (native <select> for accessibility + mobile pickers), same box as TextField.
 * Also used as compact chart filters ("Últimos 12 meses", "Todos os tipos") with size="sm" and an icon.
 */
export interface SelectFieldProps {
  label?: React.ReactNode;
  optional?: boolean;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  icon?: IconName;
  options: SelectFieldOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** sm 36 · md 44 · lg 52 */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function SelectField(props: SelectFieldProps): JSX.Element;
