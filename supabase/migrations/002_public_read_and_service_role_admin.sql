-- Public dashboard should be accessible without Supabase auth.
-- Admin operations are protected by:
--  1) app-level password->cookie gate (see `src/app/admin/*`)
--  2) Supabase service-role client (bypasses RLS)

-- Allow anonymous users to read launch areas.
create policy "Public can read launch areas"
  on public.launch_areas for select
  to anon
  using (true);

-- Allow anonymous users to read only visible tiles.
create policy "Public can read visible tiles"
  on public.tiles for select
  to anon
  using (is_visible = true);

-- Remove broad "manage everything" policies for authenticated users.
-- Admin will use the service role key instead of relying on RLS privileges.
drop policy if exists "Authenticated can manage launch areas" on public.launch_areas;
drop policy if exists "Authenticated can manage tiles" on public.tiles;

