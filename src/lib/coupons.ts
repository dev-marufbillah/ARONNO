import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { coupons, orders } from "@/db/schema";

export async function validateCoupon(code: string, subtotal: number) {
  const normalizedCode = code.trim().toUpperCase();
  const [coupon] = await db.select().from(coupons).where(eq(coupons.code, normalizedCode)).limit(1);
  if (!coupon || !coupon.isActive) {
    return { valid: false as const, message: "This coupon code is not available." };
  }
  if (coupon.expiresAt && coupon.expiresAt.getTime() <= Date.now()) {
    return { valid: false as const, message: "This coupon has expired." };
  }
  if (subtotal < coupon.minimumOrder) {
    return {
      valid: false as const,
      message: `This code requires a minimum order of ৳${coupon.minimumOrder.toLocaleString("en-BD")}.`,
    };
  }
  if (coupon.usageLimit !== null) {
    const [usage] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.couponCode, normalizedCode));
    if ((usage?.count ?? 0) >= coupon.usageLimit) {
      return { valid: false as const, message: "This coupon has reached its usage limit." };
    }
  }

  const discount =
    coupon.type === "PERCENTAGE"
      ? Math.min(subtotal, Math.floor((subtotal * coupon.value) / 100))
      : Math.min(subtotal, coupon.value);

  return {
    valid: true as const,
    code: coupon.code,
    discount,
  };
}
