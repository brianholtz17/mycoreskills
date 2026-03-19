-- Stores admin password hash for the in-app admin unlock flow.
-- Single-row table (id=1) to keep the current password hash.
create table if not exists public.admin_security (
  id int primary key check (id = 1),
  password_hash text not null,
  updated_at timestamptz not null default now()
);

alter table public.admin_security enable row level security;

create or replace function public.touch_admin_security_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists admin_security_updated_at on public.admin_security;
create trigger admin_security_updated_at
  before update on public.admin_security
  for each row execute function public.touch_admin_security_updated_at();

