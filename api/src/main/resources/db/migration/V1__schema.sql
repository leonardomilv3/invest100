-- Investidor100 · schema inicial (Flyway). Postgres 15+.
create schema if not exists app;
create extension if not exists pgcrypto;

create or replace function app.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create table app.profiles (
  user_id uuid primary key,
  display_name text not null,
  email text not null,
  monthly_dividend_goal numeric(14,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table app.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  slug text not null,
  label text not null,
  kind text not null check (kind in ('expense','income','system')),
  icon text not null,
  color_token text not null,
  bg_hex text not null,
  fg_hex text not null,
  sort_order int not null default 100,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  constraint categories_user_slug_uk unique nulls not distinct (user_id, slug)
);

create table app.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category_id uuid not null references app.categories(id),
  monthly_limit numeric(14,2) not null check (monthly_limit >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category_id)
);

create table app.credit_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  last4 char(4) not null check (last4 ~ '^[0-9]{4}$'),
  brand text not null check (brand in ('Mastercard','Visa','Elo','Amex','Hipercard','Outro')),
  tone text not null default 'ink' check (tone in ('ink','lime','white')),
  credit_limit numeric(14,2) not null check (credit_limit >= 0),
  closing_day smallint not null check (closing_day between 1 and 31),
  due_day smallint not null check (due_day between 1 and 31),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on app.credit_cards (user_id);

create table app.card_invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  card_id uuid not null references app.credit_cards(id) on delete cascade,
  reference_month date not null check (extract(day from reference_month) = 1),
  closing_date date not null,
  due_date date not null,
  paid_at timestamptz,
  paid_amount numeric(14,2),
  created_at timestamptz not null default now(),
  unique (card_id, reference_month)
);
create index on app.card_invoices (user_id, reference_month);

create table app.card_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  card_id uuid not null references app.credit_cards(id),
  description text not null,
  note text,
  category_id uuid not null references app.categories(id),
  total_amount numeric(14,2) not null check (total_amount > 0),
  installments smallint not null check (installments between 1 and 24),
  purchase_date date not null,
  created_at timestamptz not null default now()
);
create index on app.card_purchases (user_id, card_id);

create table app.recurring_charges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  description text not null,
  category_id uuid not null references app.categories(id),
  amount numeric(14,2) not null check (amount > 0),
  payment_method text not null check (payment_method in ('pix','debito','conta','dinheiro','cartao')),
  card_id uuid references app.credit_cards(id),
  day_of_month smallint not null check (day_of_month between 1 and 31),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check ((payment_method = 'cartao') = (card_id is not null))
);

create table app.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  asset_class text not null check (asset_class in ('acoes','fiis','renda_fixa','etfs','bdrs','cripto')),
  symbol text not null,
  name text not null,
  sector text,
  issuer text,
  indexer text check (indexer in ('CDI','SELIC','IPCA','PRE')),
  rate_label text,
  maturity_date date,
  tax_exempt boolean not null default false,
  created_at timestamptz not null default now(),
  constraint assets_user_symbol_uk unique nulls not distinct (user_id, symbol),
  check (asset_class <> 'renda_fixa' or user_id is not null)
);

create table app.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  asset_id uuid not null references app.assets(id),
  side text not null check (side in ('buy','sell')),
  trade_date date not null,
  quantity numeric(20,8) not null check (quantity > 0),
  unit_price numeric(20,8) not null check (unit_price >= 0),
  costs numeric(14,2) not null default 0 check (costs >= 0),
  created_at timestamptz not null default now()
);
create index on app.trades (user_id, asset_id, trade_date, created_at);

create table app.dividends (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  asset_id uuid not null references app.assets(id),
  type text not null check (type in ('dividendo','jcp','rendimento','amortizacao')),
  payment_date date not null,
  amount numeric(14,2) not null check (amount > 0),
  created_at timestamptz not null default now()
);
create index on app.dividends (user_id, payment_date);

create table app.fixed_income_valuations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  asset_id uuid not null references app.assets(id) on delete cascade,
  as_of date not null,
  current_value numeric(14,2) not null check (current_value >= 0),
  unique (asset_id, as_of)
);

create table app.allocation_targets (
  user_id uuid not null,
  asset_class text not null check (asset_class in ('acoes','fiis','renda_fixa','etfs','bdrs','cripto')),
  target_pct numeric(5,2) not null check (target_pct between 0 and 100),
  primary key (user_id, asset_class)
);

create table app.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  kind text not null check (kind in ('expense','income','investment')),
  description text not null check (length(trim(description)) > 0),
  category_id uuid not null references app.categories(id),
  amount numeric(14,2) not null check (amount <> 0),
  occurred_on date not null,
  competence_month date not null check (extract(day from competence_month) = 1),
  payment_method text not null check (payment_method in ('pix','debito','conta','dinheiro','cartao')),
  card_id uuid references app.credit_cards(id),
  invoice_id uuid references app.card_invoices(id),
  purchase_id uuid references app.card_purchases(id) on delete cascade,
  installment_number smallint,
  installment_total smallint,
  trade_id uuid unique references app.trades(id) on delete cascade,
  dividend_id uuid unique references app.dividends(id) on delete cascade,
  recurring_id uuid references app.recurring_charges(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((payment_method = 'cartao') = (card_id is not null)),
  check ((kind = 'expense' and amount < 0) or (kind = 'income' and amount > 0) or kind = 'investment'),
  check ((installment_number is null) = (installment_total is null))
);
create index on app.transactions (user_id, competence_month);
create index on app.transactions (user_id, category_id, competence_month);
create index on app.transactions (invoice_id);
create index on app.transactions (purchase_id);

create table app.quotes (
  symbol text primary key,
  price numeric(20,8) not null,
  change_pct numeric(7,4),
  previous_close numeric(20,8),
  updated_at timestamptz not null default now(),
  source text not null default 'brapi'
);

create table app.portfolio_snapshots (
  user_id uuid not null,
  month date not null check (extract(day from month) = 1),
  invested numeric(14,2) not null,
  market_value numeric(14,2) not null,
  primary key (user_id, month)
);

do $$ declare t text; begin
  foreach t in array array['profiles','budgets','credit_cards','transactions'] loop
    execute format('create trigger %I_touch before update on app.%I for each row execute function app.touch_updated_at()', t, t);
  end loop;
  -- exclui a tabela de controle do Flyway: alterá-la durante a migração trava no lock que o próprio Flyway segura
  for t in select tablename from pg_tables where schemaname = 'app' and tablename <> 'flyway_schema_history' loop
    execute format('alter table app.%I enable row level security', t);
  end loop;
end $$;
