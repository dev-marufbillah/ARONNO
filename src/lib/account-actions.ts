"use server";

import { compare, hash } from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { authAccounts, users } from "@/db/schema";
import { requireAuth } from "@/lib/auth-helpers";
import { passwordChangeSchema, profileUpdateSchema } from "@/lib/validators";

export async function updateAccountProfileAction(data: unknown) {
  const user = await requireAuth();
  const parsed = profileUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Profile details are invalid." };
  }

  try {
    await db
      .update(users)
      .set({
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));
    revalidatePath("/account/settings");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Update account profile error:", error);
    return { success: false, error: "Could not update your profile." };
  }
}

export async function changeAccountPasswordAction(data: unknown) {
  const user = await requireAuth();
  const parsed = passwordChangeSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Password details are invalid." };
  }

  try {
    const [account] = await db
      .select({ passwordHash: authAccounts.password })
      .from(authAccounts)
      .where(
        and(
          eq(authAccounts.userId, user.id),
          eq(authAccounts.providerId, "credential"),
        ),
      )
      .limit(1);
    if (!account?.passwordHash) {
      return { success: false, error: "Password account not found." };
    }

    const currentPasswordValid = await compare(parsed.data.currentPassword, account.passwordHash);
    if (!currentPasswordValid) {
      return { success: false, error: "Current password is incorrect." };
    }
    if (await compare(parsed.data.newPassword, account.passwordHash)) {
      return { success: false, error: "Choose a new password different from your current one." };
    }

    const updatedAt = new Date();
    await db.transaction(async (tx) => {
      await tx
        .update(authAccounts)
        .set({
          password: await hash(parsed.data.newPassword, 12),
          updatedAt,
        })
        .where(
          and(
            eq(authAccounts.userId, user.id),
            eq(authAccounts.providerId, "credential"),
          ),
        );
      await tx
        .update(users)
        .set({ updatedAt })
        .where(eq(users.id, user.id));
    });
    revalidatePath("/account/settings");
    return { success: true };
  } catch (error) {
    console.error("Change account password error:", error);
    return { success: false, error: "Could not change your password." };
  }
}
