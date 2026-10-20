import * as React from 'react';

/**
 * Modal dialog: white panel radius 20, title row with close ×, hairline divider, scrollable body, footer row
 * (Cancelar left · primary right). `sheet` turns it into a mobile bottom sheet; `contained` positions it inside the nearest
 * positioned ancestor (phone frames) instead of the viewport. Esc and backdrop click close.
 */
export interface DialogProps {
  open?: boolean;
  title: React.ReactNode;
  onClose?: () => void;
  footer?: React.ReactNode;
  /** px, default 560 */
  width?: number;
  sheet?: boolean;
  contained?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Dialog(props: DialogProps): JSX.Element | null;
