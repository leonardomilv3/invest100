import React from 'react';
import { Icon } from '../core/Icon.jsx';

export const CATEGORY_META = {
  moradia: { label: 'Moradia', icon: 'house', bg: '#E7EDFE', fg: '#3D6BF5', color: 'var(--cat-blue)' },
  alimentacao: { label: 'Alimentação', icon: 'utensils', bg: '#FDF3DC', fg: '#A87406', color: 'var(--cat-amber)' },
  transporte: { label: 'Transporte', icon: 'car', bg: '#EEEBFE', fg: '#6F5DE8', color: 'var(--cat-violet)' },
  lazer: { label: 'Lazer', icon: 'gamepad-2', bg: '#FDE9E3', fg: '#D9431E', color: 'var(--cat-coral)' },
  saude: { label: 'Saúde', icon: 'heart-pulse', bg: '#FCE8F1', fg: '#C8457F', color: 'var(--cat-pink)' },
  educacao: { label: 'Educação', icon: 'graduation-cap', bg: '#E3F5FD', fg: '#0E7FB0', color: 'var(--cat-sky)' },
  assinaturas: { label: 'Assinaturas', icon: 'repeat', bg: '#ECECEB', fg: '#141414', color: 'var(--cat-ink)' },
  compras: { label: 'Compras', icon: 'shopping-bag', bg: '#E2F7EE', fg: '#16924A', color: 'var(--cat-teal)' },
  contas: { label: 'Contas da casa', icon: 'zap', bg: '#EDFCD3', fg: '#4D7A10', color: 'var(--cat-lime)' },
  viagem: { label: 'Viagem', icon: 'plane', bg: '#E3F5FD', fg: '#0E7FB0', color: 'var(--cat-sky)' },
  pets: { label: 'Pets', icon: 'paw-print', bg: '#F0F0EF', fg: '#6B6B6B', color: 'var(--cat-stone)' },
  salario: { label: 'Salário', icon: 'banknote', bg: '#E2F7EE', fg: '#16924A', color: 'var(--cat-teal)' },
  investimentos: { label: 'Investimentos', icon: 'piggy-bank', bg: '#EDFCD3', fg: '#4D7A10', color: 'var(--cat-lime)' },
  proventos: { label: 'Proventos', icon: 'coins', bg: '#EDFCD3', fg: '#4D7A10', color: 'var(--cat-lime)' },
  outros: { label: 'Outros', icon: 'tag', bg: '#F0F0EF', fg: '#6B6B6B', color: 'var(--cat-stone)' },
};

export function CategoryIcon({ category = 'outros', icon, size = 36, shape = 'circle', style }) {
  const m = CATEGORY_META[category] || CATEGORY_META.outros;
  return (
    <span title={m.label} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0, borderRadius: shape === 'square' ? Math.round(size * 0.3) : '50%', background: m.bg, color: m.fg, ...style }}>
      <Icon name={icon || m.icon} size={Math.round(size * 0.46)} strokeWidth={1.8} />
    </span>
  );
}
