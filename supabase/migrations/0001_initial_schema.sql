-- ============================================================================
-- DirectParé — Schéma initial Supabase (Postgres)
-- Dérivé de types.ts. À appliquer via `supabase db push` ou l'éditeur SQL.
-- Point de départ : les politiques RLS sont volontairement simples et devront
-- être durcies avant la production (finance = données sensibles).
-- ============================================================================

-- Types énumérés (miroir de types.ts) ---------------------------------------
create type global_role        as enum ('USER', 'TREASURER', 'MEMBER', 'SUPERVISOR');
create type organization_role  as enum ('ADMIN', 'MEMBER');
create type transaction_type   as enum ('CONTRIBUTION', 'LOAN', 'LOAN_REPAYMENT', 'INCOME', 'EXPENSE');
create type member_status      as enum ('UP_TO_DATE', 'LATE');
create type cycle_type         as enum ('ROTATING', 'SAVINGS');
create type selection_method   as enum ('ORDER', 'RANDOM', 'VOTE');
create type visibility         as enum ('PUBLIC', 'PRIVATE');
create type business_plan_status as enum ('PENDING', 'VALIDATED', 'REJECTED');
create type payment_provider   as enum ('CASH', 'AIRTEL_MONEY', 'MOOV_MONEY', 'KONOOM');

-- Profils (1-1 avec auth.users) ---------------------------------------------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  display_name text not null default '',
  role         global_role not null default 'USER',
  is_verified  boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Organisations (tontines) --------------------------------------------------
create table public.organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text not null default '',
  visibility  visibility not null default 'PRIVATE',
  region      text,
  city        text,
  currency    text not null default 'XAF',
  balance     numeric not null default 0,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Membres d'une organisation ------------------------------------------------
create table public.members (
  id                uuid primary key default gen_random_uuid(),
  org_id            uuid not null references public.organizations (id) on delete cascade,
  user_id           uuid references public.profiles (id) on delete set null,
  full_name         text not null,
  phone             text,
  status            member_status not null default 'UP_TO_DATE',
  role              organization_role not null default 'MEMBER',
  avatar_url        text,
  total_contributed numeric not null default 0,
  created_at        timestamptz not null default now()
);
create index members_org_id_idx on public.members (org_id);

-- Transactions --------------------------------------------------------------
create table public.transactions (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  type        transaction_type not null,
  amount      numeric not null,
  category    text not null default '',
  member_id   uuid references public.members (id) on delete set null,
  member_name text,
  provider    payment_provider,
  fees        numeric,
  created_at  timestamptz not null default now()
);
create index transactions_org_id_idx on public.transactions (org_id);

-- Cycles --------------------------------------------------------------------
create table public.cycles (
  id                     uuid primary key default gen_random_uuid(),
  org_id                 uuid not null references public.organizations (id) on delete cascade,
  type                   cycle_type not null,
  status                 text not null default 'ACTIVE',
  current_beneficiary_id uuid references public.members (id) on delete set null,
  method                 selection_method not null default 'ORDER',
  amount_per_member      numeric not null default 0,
  frequency              text not null default 'MONTHLY',
  created_at             timestamptz not null default now()
);
create index cycles_org_id_idx on public.cycles (org_id);

-- Participants d'un cycle (relation N-N) ------------------------------------
create table public.cycle_participants (
  cycle_id  uuid not null references public.cycles (id) on delete cascade,
  member_id uuid not null references public.members (id) on delete cascade,
  primary key (cycle_id, member_id)
);

-- Demandes de prêt ----------------------------------------------------------
create table public.loan_requests (
  id                    uuid primary key default gen_random_uuid(),
  org_id                uuid not null references public.organizations (id) on delete cascade,
  member_id             uuid references public.members (id) on delete set null,
  member_name           text,
  amount                numeric not null,
  business_plan_summary text,
  jobs_promise          integer not null default 0,
  status                business_plan_status not null default 'PENDING',
  request_date          timestamptz not null default now()
);
create index loan_requests_org_id_idx on public.loan_requests (org_id);

-- ============================================================================
-- Row-Level Security (base à durcir)
-- ============================================================================
alter table public.profiles          enable row level security;
alter table public.organizations     enable row level security;
alter table public.members           enable row level security;
alter table public.transactions      enable row level security;
alter table public.cycles            enable row level security;
alter table public.cycle_participants enable row level security;
alter table public.loan_requests     enable row level security;

-- Un utilisateur gère son propre profil.
create policy "profiles: self read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: self update" on public.profiles for update using (auth.uid() = id);
create policy "profiles: self insert" on public.profiles for insert with check (auth.uid() = id);

-- Fonction utilitaire : l'utilisateur courant est-il membre de l'organisation ?
create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.members m
    where m.org_id = target_org and m.user_id = auth.uid()
  ) or exists (
    select 1 from public.organizations o
    where o.id = target_org and o.created_by = auth.uid()
  );
$$;

-- Les membres d'une organisation voient les données de cette organisation.
create policy "orgs: members read"   on public.organizations for select using (public.is_org_member(id));
create policy "members: org read"    on public.members       for select using (public.is_org_member(org_id));
create policy "tx: org read"         on public.transactions  for select using (public.is_org_member(org_id));
create policy "cycles: org read"     on public.cycles        for select using (public.is_org_member(org_id));
create policy "loans: org read"      on public.loan_requests for select using (public.is_org_member(org_id));
