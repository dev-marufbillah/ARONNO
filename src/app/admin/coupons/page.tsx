import { count, desc, getTableColumns, isNotNull, sql } from "drizzle-orm";
import { Tag } from "lucide-react";
import CouponManager from "@/components/admin/CouponManager";
import { db } from "@/db";
import { coupons, orders } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const [couponList, usageRows] = await Promise.all([
    db
      .select({
        ...getTableColumns(coupons),
        expired: sql<boolean>`coalesce(${coupons.expiresAt} <= now(), false)`,
      })
      .from(coupons)
      .orderBy(desc(coupons.createdAt)),
    db
      .select({ code: orders.couponCode, usedCount: count() })
      .from(orders)
      .where(isNotNull(orders.couponCode))
      .groupBy(orders.couponCode),
  ]);
  const usageByCode = new Map(usageRows.map((row) => [row.code, row.usedCount]));

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700"><Tag className="h-5 w-5" /></div>
        <div><h1 className="font-serif text-2xl uppercase tracking-wide text-neutral-900">Coupons & promotions</h1><p className="mt-1 text-xs text-neutral-500">Create discounts, minimum order requirements, expiry dates and usage limits.</p></div>
      </div>
      <CouponManager
        coupons={couponList.map((coupon) => ({
          ...coupon,
          usedCount: usageByCode.get(coupon.code) ?? 0,
        }))}
      />
    </div>
  );
}
