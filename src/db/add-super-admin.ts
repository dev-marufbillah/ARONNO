import { sql } from "drizzle-orm";
import { db } from "./index";

async function main() {
  await db.execute(sql.raw(`
    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "is_super_admin" boolean NOT NULL DEFAULT false
  `));
  await db.execute(sql.raw(`
    UPDATE "users"
    SET "role" = 'CUSTOMER', "is_super_admin" = false
    WHERE "role" = 'ADMIN' AND "is_super_admin" = false
  `));
  await db.execute(sql.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "users_single_super_admin_idx"
    ON "users" ("is_super_admin")
    WHERE "is_super_admin" = true
  `));

  console.log("Super-admin fields are ready; legacy admin accounts now require explicit promotion.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Could not prepare super-admin access:", error);
  process.exit(1);
});
