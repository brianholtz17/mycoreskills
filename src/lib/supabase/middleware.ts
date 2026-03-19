import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Public dashboard: do not enforce Supabase auth or admin gating in middleware.
  // Admin access is handled separately via a password->cookie gate in `src/app/admin/*`.
  return NextResponse.next({ request });
}
