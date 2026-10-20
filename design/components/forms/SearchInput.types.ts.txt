import * as React from 'react';

/**
 * Pill search field with leading magnifier, clear button and optional shortcut hint.
 * Focus = ink border + lime glow.
 */
export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'value' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** sm 34 · md 40 · lg 48 */
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /** e.g. '⌘K' */
  shortcut?: string;
  autoFocus?: boolean;
  style?: React.CSSProperties;
}

export function SearchInput(props: SearchInputProps): JSX.Element;
