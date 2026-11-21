import { ilike, or, desc } from "drizzle-orm";
import { UsersRound } from "lucide-react";
import AdminUserManager from "@/components/admin/AdminUserManager";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireSuperAdmin } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireSuperAdmin();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const matches = query
    ? or(ilike(users.name, `%${query}%`), ilike(users.email, `%${query}%`))
    : undefined;
  const accountRows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isSuperAdmin: users.isSuperAdmin,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(matches)
    .orderBy(desc(users.createdAt))
    .limit(100);

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
          <UsersRound className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wide text-neutral-900">Team access</h1>
          <p className="mt-1 text-xs text-neutral-500">
            Promote trusted accounts to admin or return them to customer access.
          </p>
        </div>
      </header>
      <AdminUserManager
        users={accountRows.map((user) => ({
          ...user,
          createdAt: user.createdAt.toISOString(),
        }))}
        query={query}
      />
    </div>
  );
}
