"use server";

import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { categories, coupons, inventoryHistory, orders, products, storeSettings, users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth-helpers";
import { getPaymentProviderStatuses } from "@/lib/store-settings";
import {
  adminCategorySchema,
  adminCouponSchema,
  adminProductSchema,
  paymentSettingsSchema,
  siteSettingsSchema,
} from "@/lib/validators";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function deleteProductAction(id: string) {
  try {
    await requireAdmin();
    await db.delete(products).where(eq(products.id, id));

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false, error: errorMessage(error, "Failed to delete product") };
  }
}

export async function saveProductAction(data: z.input<typeof adminProductSchema> & { id?: string }) {
  try {
    await requireAdmin();
    const slug =
      data.slug.trim() ||
      data.name
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    const parsed = adminProductSchema.safeParse({
      ...data,
      slug,
      images: [...new Set(data.images)],
      thumbnail: data.thumbnail || data.images[0],
    });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Product details are invalid." };
    }

    const product = parsed.data;
    if (!product.images.includes(product.thumbnail)) {
      return { success: false, error: "Choose the cover image from the product image gallery." };
    }
    const productData = {
      name: product.name.trim(),
      slug: product.slug,
      price: product.price,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
      compareAtPrice: product.compareAtPrice ?? null,
      brand: product.brand.trim(),
      description: product.description.trim(),
      shortDescription: product.shortDescription.trim(),
      categoryId: product.categoryId,
      subcategory: product.subcategory || null,
      images: product.images,
      sku: product.sku.trim(),
      thumbnail: product.thumbnail,
      featured: product.featured,
      bestSeller: product.bestSeller,
      newArrival: product.newArrival,
      tags: product.tags,
      specifications: product.specifications,
      rating: product.rating,
      reviewCount: product.reviewCount,
      updatedAt: new Date(),
    };

    if (data.id) {
      await db
        .update(products)
        .set(productData)
        .where(eq(products.id, data.id));
    } else {
      await db.insert(products).values(productData);
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/products/[slug]", "page");
    return { success: true };
  } catch (error) {
    console.error("Save product error:", error);
    return { success: false, error: errorMessage(error, "Failed to save product") };
  }
}

export async function saveCategoryAction(data: {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  isActive?: boolean;
  showInNav?: boolean;
  showOnHome?: boolean;
  sortOrder?: number;
}) {
  try {
    await requireAdmin();
    const parsed = adminCategorySchema.safeParse({
      ...data,
      slug:
        data.slug.trim() ||
        data.name
          .toLowerCase()
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
    });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Category details are invalid." };
    }
    const values = {
      name: parsed.data.name.trim(),
      slug: parsed.data.slug,
      description: parsed.data.description?.trim() || null,
      imageUrl: parsed.data.imageUrl?.trim() || null,
      parentId: data.parentId || null,
      isActive: data.isActive ?? true,
      showInNav: data.showInNav ?? true,
      showOnHome: data.showOnHome ?? false,
      sortOrder: Number(data.sortOrder) || 0,
    };
    if (data.id) {
      await db.update(categories).set(values).where(eq(categories.id, data.id));
    } else {
      await db.insert(categories).values(values);
    }
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/category/[slug]", "page");
    return { success: true };
  } catch (error) {
    console.error("Save category error:", error);
    return { success: false, error: errorMessage(error, "Failed to save category") };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await requireAdmin();
    const [{ productCount }] = await db
      .select({ productCount: count() })
      .from(products)
      .where(eq(products.categoryId, id));
    if (productCount > 0) {
      return {
        success: false,
        error: "This category contains products. Move or delete those products before removing it.",
      };
    }
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, error: errorMessage(error, "Could not delete category") };
  }
}

export async function saveSiteSettingsAction(data: unknown) {
  try {
    await requireAdmin();
    const parsed = siteSettingsSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Store content is invalid." };
    }
    await db
      .insert(storeSettings)
      .values({ key: "site", value: parsed.data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: storeSettings.key,
        set: { value: parsed.data, updatedAt: new Date() },
      });
    revalidatePath("/");
    revalidatePath("/checkout");
    revalidatePath("/admin/cms");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Save site settings error:", error);
    return { success: false, error: errorMessage(error, "Could not save store content") };
  }
}

export async function savePaymentSettingsAction(data: unknown) {
  try {
    await requireAdmin();
    const parsed = paymentSettingsSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Payment settings are invalid." };
    }
    const providers = await getPaymentProviderStatuses();
    const unavailable = providers.find(
      (provider) => parsed.data[provider.key] && !provider.configured,
    );
    if (unavailable) {
      return {
        success: false,
        error: `${unavailable.label} is not configured. Add its credentials to the server environment first.`,
      };
    }
    if (!Object.values(parsed.data).some(Boolean)) {
      return { success: false, error: "Enable at least one payment method." };
    }
    await db
      .insert(storeSettings)
      .values({ key: "payment", value: parsed.data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: storeSettings.key,
        set: { value: parsed.data, updatedAt: new Date() },
      });
    revalidatePath("/admin/settings");
    revalidatePath("/checkout");
    revalidatePath("/api/payment");
    return { success: true };
  } catch (error) {
    console.error("Save payment settings error:", error);
    return { success: false, error: errorMessage(error, "Could not save payment settings") };
  }
}

export async function saveCouponAction(data: unknown) {
  try {
    await requireAdmin();
    const parsed = adminCouponSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Coupon details are invalid." };
    }
    if (parsed.data.type === "PERCENTAGE" && parsed.data.value > 100) {
      return { success: false, error: "Percentage coupons cannot exceed 100%." };
    }
    const expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null;
    if (expiresAt && Number.isNaN(expiresAt.getTime())) {
      return { success: false, error: "Enter a valid coupon expiry date." };
    }
    const values = {
      code: parsed.data.code.toUpperCase(),
      type: parsed.data.type,
      value: parsed.data.value,
      minimumOrder: parsed.data.minimumOrder,
      expiresAt,
      usageLimit: parsed.data.usageLimit,
      isActive: parsed.data.isActive,
    };
    if (parsed.data.id) {
      await db.update(coupons).set(values).where(eq(coupons.id, parsed.data.id));
    } else {
      await db.insert(coupons).values(values);
    }
    revalidatePath("/admin/coupons");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Save coupon error:", error);
    return { success: false, error: errorMessage(error, "Could not save coupon") };
  }
}

export async function deleteCouponAction(id: string) {
  try {
    await requireAdmin();
    await db.delete(coupons).where(eq(coupons.id, id));
    revalidatePath("/admin/coupons");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Delete coupon error:", error);
    return { success: false, error: errorMessage(error, "Could not delete coupon") };
  }
}

export async function updateOrderStatusAction(
  id: string,
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED",
) {
  try {
    await requireAdmin();
    await db.update(orders).set({ status, paymentStatus, updatedAt: new Date() }).where(eq(orders.id, id));
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update order" };
  }
}

export async function updateInventoryAction(id: string, stockQuantity: number, note: string) {
  try {
    await requireAdmin();
    const quantity = Math.max(0, Number(stockQuantity) || 0);
    const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!product) return { success: false, error: "Product not found" };
    const quantityChange = quantity - product.stockQuantity;
    await db.update(products).set({ stockQuantity: quantity, updatedAt: new Date() }).where(eq(products.id, id));
    await db.insert(inventoryHistory).values({
      productId: id,
      quantityChange,
      resultingStock: quantity,
      type: "ADJUSTMENT",
      note: note.trim() || "Manual stock adjustment",
    });
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update inventory" };
  }
}

export async function setUserAdminAction(userId: string, makeAdmin: boolean) {
  await requireSuperAdmin();
  const parsed = z.object({ userId: z.uuid(), makeAdmin: z.boolean() }).safeParse({ userId, makeAdmin });
  if (!parsed.success) {
    return { success: false, error: "User access request is invalid." };
  }

  try {
    const [target] = await db
      .select({ id: users.id, isSuperAdmin: users.isSuperAdmin })
      .from(users)
      .where(eq(users.id, parsed.data.userId))
      .limit(1);
    if (!target) {
      return { success: false, error: "User not found." };
    }
    if (target.isSuperAdmin) {
      return { success: false, error: "The super-admin account cannot be changed here." };
    }

    await db
      .update(users)
      .set({ role: parsed.data.makeAdmin ? "ADMIN" : "CUSTOMER", updatedAt: new Date() })
      .where(eq(users.id, target.id));
    revalidatePath("/admin/team");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Change user access error:", error);
    return { success: false, error: errorMessage(error, "Could not update user access.") };
  }
}