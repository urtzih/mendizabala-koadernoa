-- Extensions required for UUID generation (Supabase usually has pgcrypto)
create extension if not exists pgcrypto;

-- Teachers
create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null default '',
  substitute_name text null,
  inserted_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Companies
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text null,
  contact_person text null,
  email text null,
  phone text null,
  website text null,
  assigned_teacher_id uuid null references public.teachers(id) on delete set null,
  status text not null default 'orange' check (status in ('green','orange','red')),
  demand_dual1 int null default 0,
  demand_dual_general int null default 0,
  demand_dual_intensive int null default 0,
  inserted_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Simple updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_teachers on public.teachers;
create trigger set_updated_at_teachers before update on public.teachers
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_companies on public.companies;
create trigger set_updated_at_companies before update on public.companies
for each row execute function public.set_updated_at();

-- Realtime publications
alter publication supabase_realtime add table public.teachers;
alter publication supabase_realtime add table public.companies;

-- Row Level Security (authenticated users only)
alter table public.teachers enable row level security;
alter table public.companies enable row level security;

create policy teachers_authenticated_read on public.teachers for select
  using (auth.uid() is not null);
create policy teachers_authenticated_write on public.teachers for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

create policy companies_authenticated_read on public.companies for select
  using (auth.uid() is not null);
create policy companies_authenticated_write on public.companies for all
  using (auth.uid() is not null) with check (auth.uid() is not null);
