-- Add new launch area: Geography of the World
-- Insert at sort_order 5 and shift later sections down by 1.

update public.launch_areas
set sort_order = sort_order + 1
where sort_order >= 5
  and slug <> 'geography-of-the-world';

insert into public.launch_areas (slug, title, sort_order)
values ('geography-of-the-world', 'Geography of the World', 5)
on conflict (slug) do update
set title = excluded.title,
    sort_order = excluded.sort_order;

