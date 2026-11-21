import { hash } from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { db } from "./index";
import { authAccounts, users } from "./schema";
import { SUPER_ADMIN_EMAIL } from "@/lib/roles";

function readHiddenPassword(prompt: string) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    throw new Error("Run this command directly in an interactive terminal to set the password securely.");
  }

  return new Promise<string>((resolve, reject) => {
    const input = process.stdin;
    let value = "";
    process.stdout.write(prompt);
    input.setEncoding("utf8");
    input.setRawMode(true);
    input.resume();

    const finish = (error?: Error) => {
      input.off("data", onData);
      input.setRawMode(false);
      input.pause();
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    };

    const onData = (chunk: string) => {
      for (const character of chunk) {
        if (character === "\u0003") {
          finish(new Error("Password setup cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u0008" || character === "\u007f") {
          value = value.slice(0, -1);
        } else {
          value += character;
        }
      }
    };

    input.on("data", onData);
  });
}

async function main() {
  const password = await readHiddenPassword("Create super-admin password (minimum 12 characters): ");
  if (password.length < 12) {
    throw new Error("Choose a password with at least 12 characters.");
  }
  const confirmation = await readHiddenPassword("Confirm super-admin password: ");
  if (password !== confirmation) {
    throw new Error("The passwords did not match.");
  }

  const passwordHash = await hash(password, 12);
  await db.execute(sql.raw(`
    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "is_super_admin" boolean NOT NULL DEFAULT false
  `));

  await db.transaction(async (tx) => {
    await tx.execute(sql.raw(`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_single_super_admin_idx"
      ON "users" ("is_super_admin")
      WHERE "is_super_admin" = true
    `));

    const [existing] = await tx
      .select({ id: users.id })
      .from(users)
      .where(sql`lower(${users.email}) = ${SUPER_ADMIN_EMAIL}`)
      .limit(1);

    const owner = {
      name: "Maruf Salauddin",
      email: SUPER_ADMIN_EMAIL,
      role: "ADMIN" as const,
      isSuperAdmin: true,
      emailVerified: true,
      updatedAt: new Date(),
    };

    let ownerId: string;
    if (existing) {
      await tx.update(users).set(owner).where(eq(users.id, existing.id));
      ownerId = existing.id;
    } else {
      const [created] = await tx.insert(users).values(owner).returning({ id: users.id });
      ownerId = created.id;
    }

    await tx
      .insert(authAccounts)
      .values({
        accountId: ownerId,
        providerId: "credential",
        userId: ownerId,
        password: passwordHash,
      })
      .onConflictDoUpdate({
        target: [authAccounts.providerId, authAccounts.accountId],
        set: { password: passwordHash, updatedAt: new Date() },
      });
  });

  console.log(`Super-admin account is ready for ${SUPER_ADMIN_EMAIL}. The password was not stored in source files.`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Could not bootstrap super-admin:", error);
  process.exit(1);
});
