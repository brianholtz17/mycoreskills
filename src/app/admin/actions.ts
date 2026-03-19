"use server";

import { createServiceRoleClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
import { isValidAdminPassword, requireAdminUnlocked, setAdminPassword } from "./admin-auth";

export async function getAdminLaunchAreasWithTiles() {
  await requireAdminUnlocked();
  const supabase = createServiceRoleClient();
  const { data: areas, error: areasError } = await supabase
    .from("launch_areas")
    .select("*")
    .order("sort_order", { ascending: true });

  if (areasError) throw areasError;

  const { data: tiles, error: tilesError } = await supabase
    .from("tiles")
    .select("*")
    .order("sort_order", { ascending: true });

  if (tilesError) throw tilesError;

  const tilesByArea = (tiles ?? []).reduce<Record<string, typeof tiles>>((acc, t) => {
    if (!acc[t.launch_area_id]) acc[t.launch_area_id] = [];
    acc[t.launch_area_id].push(t);
    return acc;
  }, {});

  return (areas ?? []).map((a) => ({
    ...a,
    tiles: tilesByArea[a.id] ?? [],
  }));
}

export async function reorderLaunchAreas(areaIds: string[]) {
  await requireAdminUnlocked();
  const supabase = createServiceRoleClient();
  for (let i = 0; i < areaIds.length; i++) {
    await supabase
      .from("launch_areas")
      .update({ sort_order: i })
      .eq("id", areaIds[i]);
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function reorderTiles(launchAreaId: string, tileIds: string[]) {
  await requireAdminUnlocked();
  const supabase = createServiceRoleClient();
  for (let i = 0; i < tileIds.length; i++) {
    await supabase
      .from("tiles")
      .update({ sort_order: i })
      .eq("id", tileIds[i])
      .eq("launch_area_id", launchAreaId);
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateLaunchArea(id: string, data: { title?: string }) {
  await requireAdminUnlocked();
  const supabase = createServiceRoleClient();
  await supabase.from("launch_areas").update(data).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createTile(launchAreaId: string, data: { title: string; url: string }) {
  await requireAdminUnlocked();
  const supabase = createServiceRoleClient();
  const { data: existing } = await supabase
    .from("tiles")
    .select("sort_order")
    .eq("launch_area_id", launchAreaId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  const sortOrder = (existing?.sort_order ?? -1) + 1;
  await supabase.from("tiles").insert({
    launch_area_id: launchAreaId,
    title: data.title,
    url: data.url,
    sort_order: sortOrder,
    is_visible: true,
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateTile(
  id: string,
  data: { title?: string; url?: string; is_visible?: boolean }
) {
  await requireAdminUnlocked();
  const supabase = createServiceRoleClient();
  await supabase.from("tiles").update(data).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteTile(id: string) {
  await requireAdminUnlocked();
  const supabase = createServiceRoleClient();
  await supabase.from("tiles").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateAdminPassword(
  currentPassword: string,
  nextPassword: string,
  confirmPassword: string
) {
  await requireAdminUnlocked();

  if (!currentPassword || !nextPassword || !confirmPassword) {
    throw new Error("All password fields are required.");
  }
  if (nextPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }
  if (nextPassword !== confirmPassword) {
    throw new Error("New password and confirmation do not match.");
  }
  if (!(await isValidAdminPassword(currentPassword))) {
    throw new Error("Current password is incorrect.");
  }

  await setAdminPassword(nextPassword);
}
