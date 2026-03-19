"use client";

import { useActionState } from "react";
import { unlockAdmin } from "./unlock-admin-action";

type AdminUnlockState = { error?: string | null };

const initialState: AdminUnlockState = { error: null };

export function AdminPasswordPrompt() {
  const [state, formAction] = useActionState(unlockAdmin, initialState);

  return (
    <div className="max-w-sm mx-auto w-full px-4 py-10">
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-xl p-6">
        <h1 className="text-2xl font-semibold text-white mb-2">Admin Access</h1>
        <p className="text-slate-300 text-sm mb-6">Enter the admin password to continue.</p>

        <form action={formAction} className="space-y-4">
          <label className="block text-sm font-medium text-slate-200" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950/50 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />

          {state.error ? (
            <p className="text-sm text-red-300" role="alert">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:pointer-events-none transition-colors"
          >
            Unlock Admin
          </button>
        </form>
      </div>
    </div>
  );
}

