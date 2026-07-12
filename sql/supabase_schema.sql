-- 洛书量化观察仓 / Supabase schema
-- Run this in Supabase SQL Editor. Use service-role key only on Vercel server functions.

create extension if not exists pgcrypto;

create table if not exists users (
  id text primary key,
  auth_user_id uuid null,
  email text null,
  created_at timestamptz not null default now()
);

create table if not exists portfolio_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  base_currency text not null default 'USD',
  initial_cash_usd numeric(18,4) not null default 100000,
  cash_usd numeric(18,4) not null default 100000,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists stock_pool (
  id uuid primary key default gen_random_uuid(),
  user_id text null references users(id) on delete cascade,
  symbol text not null,
  market text not null,
  currency text not null,
  name text null,
  sector text null,
  source text not null default 'user',
  enabled boolean not null default true,
  priority integer not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, symbol)
);

create table if not exists virtual_positions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  account_id uuid not null references portfolio_accounts(id) on delete cascade,
  symbol text not null,
  market text not null,
  currency text not null,
  quantity numeric(22,8) not null default 0,
  avg_price_local numeric(18,6) not null default 0,
  cost_local numeric(22,6) not null default 0,
  cost_usd numeric(22,6) not null default 0,
  current_price_local numeric(18,6) null,
  current_value_usd numeric(22,6) not null default 0,
  pnl_usd numeric(22,6) not null default 0,
  pnl_pct numeric(12,4) not null default 0,
  status text not null default 'open',
  opened_at timestamptz not null default now(),
  closed_at timestamptz null,
  updated_at timestamptz not null default now()
);

create index if not exists virtual_positions_user_status_idx on virtual_positions(user_id,status);
create index if not exists virtual_positions_account_symbol_idx on virtual_positions(account_id,symbol);

create table if not exists virtual_trades (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  account_id uuid not null references portfolio_accounts(id) on delete cascade,
  position_id uuid null references virtual_positions(id) on delete set null,
  symbol text not null,
  market text not null,
  currency text not null,
  side text not null,
  quantity numeric(22,8) not null,
  price_local numeric(18,6) not null,
  notional_local numeric(22,6) not null,
  fx_rate_local_to_usd numeric(18,10) not null,
  notional_usd numeric(22,6) not null,
  cash_before_usd numeric(22,6) not null,
  cash_after_usd numeric(22,6) not null,
  realized_pnl_usd numeric(22,6) null,
  reason text null,
  created_at timestamptz not null default now()
);

create index if not exists virtual_trades_user_created_idx on virtual_trades(user_id,created_at desc);

create table if not exists stock_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  market text not null,
  date date not null,
  close numeric(18,6) null,
  ma30 numeric(18,6) null,
  ma60 numeric(18,6) null,
  ma30_slope numeric(12,4) null,
  ma60_slope numeric(12,4) null,
  bias30 numeric(12,4) null,
  bias60 numeric(12,4) null,
  observe_score integer null,
  risk_label text null,
  source text null,
  created_at timestamptz not null default now(),
  unique(symbol, market, date)
);

create table if not exists fx_rates (
  id uuid primary key default gen_random_uuid(),
  base text not null,
  quote text not null,
  rate numeric(18,8) not null,
  fetched_at timestamptz not null default now(),
  unique(base, quote)
);

-- Optional: keep RLS disabled for service-role prototype.
-- Later multi-user auth should enable RLS and map auth.uid() to users.auth_user_id.
