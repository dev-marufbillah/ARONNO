import { sql } from "drizzle-orm";
import { db } from "./index";

async function reset() {
  console.log("🗑️  Dropping all tables...");
  await db.execute(sql.raw(`DROP SCHEMA public CASCADE`));
  await db.execute(sql.raw(`CREATE SCHEMA public`));
  await db.execute(sql.raw(`GRANT ALL ON SCHEMA public TO postgres`));
  await db.execute(sql.raw(`GRANT ALL ON SCHEMA public TO public`));
  console.log("✅ Done! All tables dropped.");
  process.exit(0);
}

reset().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});