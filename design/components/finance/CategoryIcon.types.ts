import * as React from 'react';
import { IconName } from '../core/Icon';

export type CategoryKey = 'moradia' | 'alimentacao' | 'transporte' | 'lazer' | 'saude' | 'educacao' | 'assinaturas' | 'compras' | 'contas' | 'viagem' | 'pets' | 'salario' | 'investimentos' | 'proventos' | 'outros';

export interface CategoryMeta { label: string; icon: IconName; bg: string; fg: string; color: string; }

/** Label, glyph, tint and chart colour for every spending/income category. */
export const CATEGORY_META: Record<CategoryKey, CategoryMeta>;

/** Category glyph in a tinted disc — transactions, budgets, installments, donut legends. */
export interface CategoryIconProps {
  category?: CategoryKey;
  /** Override glyph */
  icon?: IconName;
  /** px, default 36 */
  size?: number;
  shape?: 'circle' | 'square';
  style?: React.CSSProperties;
}

export function CategoryIcon(props: CategoryIconProps): JSX.Element;
