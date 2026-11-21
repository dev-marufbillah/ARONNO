import { sql } from "drizzle-orm";
import { db } from "./index";

async function main() {
  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "store_settings" (
      "key" text PRIMARY KEY,
      "value" jsonb NOT NULL,
      "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `));
  await db.execute(sql.raw(`
    ALTER TABLE "orders"
    ADD COLUMN IF NOT EXISTS "discount" integer NOT NULL DEFAULT 0
  `));

  console.log("Admin CMS settings table and order discount column are ready.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Could not prepare admin CMS database:", error);
  process.exit(1);
});
