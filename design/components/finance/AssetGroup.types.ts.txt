import * as React from 'react';
import { IconName } from '../core/Icon';

export interface AssetGroupMetric { label: string; value: React.ReactNode; }

/**
 * Collapsible asset-class section (Ações · FIIs · Renda fixa): drag handle, icon tile, title (count), right-aligned
 * summary metrics, chevron toggle; body holds a table/list and an optional footer action row.
 * `compact` = mobile layout (metrics in a 2×2 grid).
 * @startingPoint section="Finance" subtitle="Collapsible asset-class group with metrics" viewport="900x320"
 */
export interface AssetGroupProps {
  icon?: IconName;
  title: string;
  count?: number;
  metrics?: AssetGroupMetric[];
  open?: boolean;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  footer?: React.ReactNode;
  compact?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function AssetGroup(props: AssetGroupProps): JSX.Element;
