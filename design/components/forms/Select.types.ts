import * as React from 'react';

export type SelectOption = string | { value: string; label: string };

/**
 * Dropdown. plain = grey text + chevron (table filter headers: "Setor ▾", "Bolsa ▾");
 * pill = white capsule trigger. Menu = white popover, radius 20, floating shadow, check on selected.
 */
export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: 'plain' | 'pill';
  /** pill heights: sm 32 · md 40 · lg 48 */
  size?: 'sm' | 'md' | 'lg';
  /** Node before the label (flag, icon) */
  leading?: React.ReactNode;
  /** Menu alignment */
  align?: 'left' | 'right';
  style?: React.CSSProperties;
}

export function Select(props: SelectProps): JSX.Element;
