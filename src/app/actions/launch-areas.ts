"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
import type { LaunchArea, LaunchAreaWithTiles, Tile } from "@/lib/supabase/types";

export async function getLaunchAreasWithTiles(): Promise<LaunchAreaWithTiles[]> {
  const userScoped = await createClient();
  const serviceRole = (() => {
    try {
      return createServiceRoleClient();
    } catch {
      return null;
    }
  })();
  const reader = serviceRole ?? userScoped;

  const { data: areas, error: areasError } = await reader
    .from("launch_areas")
    .select("*")
    .order("sort_order", { ascending: true });

  if (areasError) throw areasError;
  if (!areas?.length) return [];

  const { data: tiles, error: tilesError } = await reader
    .from("tiles")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (tilesError) throw tilesError;

  const tilesByArea = (tiles ?? []).reduce<Record<string, Tile[]>>((acc, t) => {
    if (!acc[t.launch_area_id]) acc[t.launch_area_id] = [];
    acc[t.launch_area_id].push(t);
    return acc;
  }, {});

  return (areas as LaunchArea[]).map((a) => ({
    ...a,
    tiles: tilesByArea[a.id] ?? [],
  }));
}
