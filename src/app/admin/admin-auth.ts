import { cookies } from "next/headers";
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { createServiceRoleClient } from "@/lib/supabase/service";

const ADMIN_COOKIE_NAME = "mycoreskills_admin_unlocked";

const getAdminPassword = () => process.env.ADMIN_PASSWORD ?? "brianBRIAN";
const getAdminCookieSecret = () =>
  process.env.ADMIN_COOKIE_SECRET ?? "dev-only-change-me";
const scrypt = promisify(scryptCallback);

export function adminExpectedCookieValue() {
  const secret = getAdminCookieSecret();
  return createHmac("sha256", secret).update("mycoreskills-admin-unlocked").digest("hex");
}

async function getStoredAdminPasswordHash(): Promise<string | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("admin_security")
    .select("password_hash")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    // Migration not applied yet: keep unlock working with env fallback password.
    if ((error as { code?: string }).code === "PGRST205") return null;
    throw error;
  }
  return data?.password_hash ?? null;
}

export async function hashAdminPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${key.toString("hex")}`;
}

async function verifyAgainstHash(password: string, stored: string): Promise<boolean> {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hashHex, "hex");
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

export async function isValidAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;
  const storedHash = await getStoredAdminPasswordHash();
  if (storedHash) return verifyAgainstHash(password, storedHash);
  return password === getAdminPassword();
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  const supabase = createServiceRoleClient();
  const password_hash = await hashAdminPassword(newPassword);
  const { error } = await supabase
    .from("admin_security")
    .upsert({ id: 1, password_hash }, { onConflict: "id" });
  if (error) {
    if ((error as { code?: string }).code === "PGRST205") {
      throw new Error(
        "Password update table is not set up yet. Please run migration 003_admin_security_password_hash.sql."
      );
    }
    throw error;
  }
}

export async function isAdminUnlocked() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  const expected = adminExpectedCookieValue();
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    // Buffer length mismatch or other crypto issues
    return false;
  }
}

export async function requireAdminUnlocked() {
  if (!(await isAdminUnlocked())) {
    throw new Error("Admin unlock required");
  }
}

