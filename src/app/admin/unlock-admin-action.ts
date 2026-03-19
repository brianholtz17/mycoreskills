"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminExpectedCookieValue, isValidAdminPassword } from "./admin-auth";

const ADMIN_COOKIE_NAME = "mycoreskills_admin_unlocked";

type AdminUnlockState = { error?: string | null };

// Server action: verifies the admin password and sets an httpOnly cookie.
export async function unlockAdmin(prevState: AdminUnlockState, formData: FormData): Promise<AdminUnlockState> {
  const password = String(formData.get("password") ?? "");
  if (!(await isValidAdminPassword(password))) {
    return { ...prevState, error: "Incorrect password" };
  }

  const value = adminExpectedCookieValue();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  redirect("/admin");
}

