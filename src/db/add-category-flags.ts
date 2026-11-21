import { sql } from "drizzle-orm";
import { db } from "./index";

async function main() {
  console.log("Adding category control columns...");

  await db.execute(sql.raw(`
    ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS show_in_nav boolean NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS show_on_home boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0
  `));

  console.log("✅ Done!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});