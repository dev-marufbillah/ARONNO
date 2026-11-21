import { sql } from "drizzle-orm";
import { db } from "./index";

async function main() {
  await db.execute(sql.raw(`
    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "image" text
  `));
  await db.execute(sql.raw(`
    ALTER TABLE "users"
    ALTER COLUMN "password_hash" DROP NOT NULL
  `));
  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "auth_sessions" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "expires_at" timestamp with time zone NOT NULL,
      "token" text NOT NULL,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "ip_address" text,
      "user_agent" text,
      "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE
    )
  `));
  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "auth_accounts" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "account_id" text NOT NULL,
      "provider_id" text NOT NULL,
      "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
      "access_token" text,
      "refresh_token" text,
      "id_token" text,
      "access_token_expires_at" timestamp with time zone,
      "refresh_token_expires_at" timestamp with time zone,
      "scope" text,
      "password" text,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));
  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "auth_verifications" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "identifier" text NOT NULL,
      "value" text NOT NULL,
      "expires_at" timestamp with time zone NOT NULL,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));
  await db.execute(sql.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "auth_sessions_token_unique_idx"
    ON "auth_sessions" ("token")
  `));
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "auth_sessions_user_idx"
    ON "auth_sessions" ("user_id")
  `));
  await db.execute(sql.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "auth_accounts_provider_account_unique_idx"
    ON "auth_accounts" ("provider_id", "account_id")
  `));
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "auth_accounts_user_idx"
    ON "auth_accounts" ("user_id")
  `));
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "auth_verifications_identifier_idx"
    ON "auth_verifications" ("identifier")
  `));

  await db.transaction(async (tx) => {
    await tx.execute(sql.raw(`
      INSERT INTO "auth_accounts" (
        "account_id",
        "provider_id",
        "user_id",
        "password",
        "created_at",
        "updated_at"
      )
      SELECT
        "id"::text,
        'credential',
        "id",
        "password_hash",
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      FROM "users"
      WHERE "password_hash" IS NOT NULL
      ON CONFLICT ("provider_id", "account_id")
      DO UPDATE SET "password" = COALESCE("auth_accounts"."password", EXCLUDED."password")
    `));
    await tx.execute(sql.raw(`
      UPDATE "users"
      SET "password_hash" = NULL
      WHERE "password_hash" IS NOT NULL
        AND EXISTS (
          SELECT 1
          FROM "auth_accounts"
          WHERE "auth_accounts"."user_id" = "users"."id"
            AND "auth_accounts"."provider_id" = 'credential'
            AND "auth_accounts"."password" IS NOT NULL
        )
    `));
  });

  console.log("Better Auth tables are ready; existing bcrypt credentials have been migrated.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Could not migrate Better Auth tables:", error);
  process.exit(1);
});
