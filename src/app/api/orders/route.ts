import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { createInventoryLog } from "@/lib/storefront";
import { generateOrderNumber, getDeliveryFee } from "@/lib/utils";
import { createOrderSchema } from "@/lib/validators";
import { getPaymentProviderStatuses, getStoreAdminConfig } from "@/lib/store-settings";
import { validateCoupon } from "@/lib/coupons";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Invalid order request." }, { status: 400 });
  }
  const parsed = createOrderSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json({ message: parsed.error.issues[0]?.message ?? "Invalid order input." }, { status: 400 });
  }

  const paymentMethods = await getPaymentProviderStatuses();
  if (!paymentMethods.some((method) => method.key === parsed.data.paymentMethod && method.enabled)) {
    return Response.json({ message: "That payment method is currently unavailable." }, { status: 400 });
  }

  const productRows = await Promise.all(
    parsed.data.items.map(async (item) => {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
      return { product, quantity: item.quantity };
    }),
  );

  if (productRows.some((item) => !item.product)) {
    return Response.json({ message: "Product unavailable." }, { status: 400 });
  }

  for (const item of productRows) {
    if (!item.product || item.product.stockQuantity < item.quantity) {
      return Response.json({ message: `${item.product?.name ?? "Item"} is out of stock.` }, { status: 400 });
    }
  }

  const subtotal = productRows.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);
  const coupon = parsed.data.couponCode
    ? await validateCoupon(parsed.data.couponCode, subtotal)
    : null;
  if (coupon && !coupon.valid) {
    return Response.json({ message: coupon.message }, { status: 400 });
  }
  const discount = coupon?.valid ? coupon.discount : 0;
  const { site } = await getStoreAdminConfig();
  const deliveryFee = getDeliveryFee(
    subtotal - discount,
    site.freeDeliveryThreshold,
    site.deliveryFee,
  );
  const total = subtotal - discount + deliveryFee;
  const orderNumber = generateOrderNumber();

  const [createdOrder] = await db.insert(orders).values({
    orderNumber,
    userId: session?.user?.id ?? null,
    customerName: parsed.data.customerName,
    email: parsed.data.email,
    phoneNumber: parsed.data.phoneNumber,
    paymentMethod: parsed.data.paymentMethod,
    paymentStatus: "PENDING",
    status: "PENDING",
    subtotal,
    discount,
    deliveryFee,
    total,
    couponCode: coupon?.valid ? coupon.code : null,
    shippingAddress: parsed.data.shippingAddress,
  }).returning();

  await db.insert(orderItems).values(
    productRows.map((item) => ({
      orderId: createdOrder.id,
      productId: item.product!.id,
      productName: item.product!.name,
      productSlug: item.product!.slug,
      brand: item.product!.brand,
      image: item.product!.thumbnail,
      quantity: item.quantity,
      unitPrice: item.product!.price,
      totalPrice: item.quantity * item.product!.price,
    })),
  );

  for (const item of productRows) {
    if (!item.product) continue;
    const resultingStock = item.product.stockQuantity - item.quantity;
    await db.update(products).set({ stockQuantity: resultingStock, updatedAt: new Date() }).where(eq(products.id, item.product.id));
    await createInventoryLog(item.product.id, -item.quantity, resultingStock, `Order ${orderNumber}`);
  }

  return Response.json({ message: "Order placed successfully.", orderNumber });
}
