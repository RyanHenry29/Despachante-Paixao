create table if not exists public.rate_limits (
  id bigint generated always as identity primary key,
  ip_address text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_rate_limits_ip_created
  on public.rate_limits (ip_address, created_at);

alter table public.rate_limits enable row level security;
