import { isAdminUnlocked } from "./admin-auth";
import { getAdminLaunchAreasWithTiles } from "./actions";
import { AdminClient } from "./admin-client";
import { AdminPasswordPrompt } from "./admin-password-prompt";

export default async function AdminPage() {
  if (!(await isAdminUnlocked())) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-start justify-center pt-16">
        <AdminPasswordPrompt />
      </div>
    );
  }

  let areas;
  try {
    areas = await getAdminLaunchAreasWithTiles();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-start justify-center pt-16 px-4">
        <div className="max-w-lg w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <h1 className="text-xl font-semibold mb-2">Admin is not configured</h1>
          <p className="text-sm text-slate-600 mb-4">
            {message}
          </p>
          <p className="text-sm text-slate-600">
            Add the missing environment variables and restart the server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <AdminClient initialAreas={areas} />
    </div>
  );
}
