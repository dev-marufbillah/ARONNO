"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { setUserAdminAction } from "@/lib/admin-actions";

type TeamUser = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  isSuperAdmin: boolean;
  createdAt: string;
};

export default function AdminUserManager({
  users,
  query,
}: {
  users: TeamUser[];
  query: string;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState("");
  const [error, setError] = useState("");

  async function changeAccess(user: TeamUser) {
    setPendingId(user.id);
    setError("");
    const result = await setUserAdminAction(user.id, user.role !== "ADMIN");
    setPendingId("");
    if (!result.success) {
      setError(result.error ?? "Could not update user access.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <form method="get" className="flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search by name or email"
          className="min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C4A265]"
        />
        <button className="rounded-lg bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-700">
          Search users
        </button>
      </form>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-neutral-50 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Account</th>
                <th className="px-5 py-4 font-semibold">Joined</th>
                <th className="px-5 py-4 font-semibold">Access</th>
                <th className="px-5 py-4 text-right font-semibold">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-neutral-900">{user.name}</p>
                    <p className="mt-1 text-xs text-neutral-500">{user.email}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        user.isSuperAdmin
                          ? "bg-[#C4A265]/15 text-[#8A692F]"
                          : user.role === "ADMIN"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {user.isSuperAdmin ? "Super Admin" : user.role === "ADMIN" ? "Admin" : "Customer"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {user.isSuperAdmin ? (
                      <span className="text-xs text-neutral-400">Owner account</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void changeAccess(user)}
                        disabled={pendingId !== ""}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition disabled:opacity-50 ${
                          user.role === "ADMIN"
                            ? "border-red-200 text-red-700 hover:bg-red-50"
                            : "border-neutral-200 text-neutral-700 hover:border-[#C4A265] hover:text-[#8A692F]"
                        }`}
                      >
                        {user.role === "ADMIN" ? (
                          <ShieldOff className="h-3.5 w-3.5" />
                        ) : (
                          <ShieldCheck className="h-3.5 w-3.5" />
                        )}
                        {pendingId === user.id
                          ? "Saving..."
                          : user.role === "ADMIN"
                            ? "Remove admin"
                            : "Make admin"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-sm text-neutral-500">
                    No matching accounts found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <p className="border-t border-neutral-100 px-5 py-3 text-[11px] text-neutral-500">
          Showing up to 100 accounts. Search by email or name to find a specific user.
        </p>
      </div>
    </div>
  );
}
