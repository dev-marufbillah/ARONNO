import { cache } from "react";
import { and, asc, desc, eq, ilike, inArray, lte, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  inventoryHistory,
  orderItems,
  orders,
  products,
  reviews,
  users,
  wishlists,
} from "@/db/schema";
import { categorySeed, productSeed } from "@/lib/demo-data";

export type StoreProduct = Awaited<ReturnType<typeof getProducts>>[number];

export const ensureSeeded = cache(async () => {
  if (process.env.NODE_ENV === "production") return;

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(categories);

  if (Number(count) === 0) {
    await db.insert(categories).values([...categorySeed]).onConflictDoNothing();
  }

  const categoryRows = await db.select().from(categories);
  const categoryMap = new Map(categoryRows.map((item) => [item.slug, item.id]));

  const [{ productCount }] = await db
    .select({ productCount: sql<number>`count(*)::int` })
    .from(products);

  if (Number(productCount) === 0) {
    await db
      .insert(products)
      .values(
        productSeed.map((item) => ({
          sku: item.sku,
          brand: item.brand,
          name: item.name,
          slug: item.slug,
          categoryId: categoryMap.get(item.categorySlug)!,
          subcategory: item.subcategory,
          description: item.description,
          shortDescription: item.shortDescription,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          currency: "BDT",
          stockQuantity: item.stockQuantity,
          thumbnail: item.thumbnail,
          images: [...item.images],
          rating: item.rating,
          reviewCount: item.reviewCount,
          featured: item.featured,
          bestSeller: item.bestSeller,
          newArrival: item.newArrival,
          tags: [...item.tags],
          specifications: { ...item.specifications },
          lowStockThreshold: 3,
        })),
      )
      .onConflictDoNothing();
  }

  const [{ reviewCount }] = await db
    .select({ reviewCount: sql<number>`count(*)::int` })
    .from(reviews);

  if (Number(reviewCount) === 0) {
    const seededProducts = await db.select().from(products);
    const seededUsers = await db.select().from(users);
    const customer = seededUsers.find((item) => item.role === "CUSTOMER");
    const sampleTargets = seededProducts.slice(0, 3);

    if (customer && sampleTargets.length > 0) {
      await db.insert(reviews).values(
        sampleTargets.map((item, index) => ({
          userId: customer.id,
          productId: item.id,
          rating: 5 - (index % 2),
          title: ["Absolutely exceptional", "Refined and authentic", "Worth every taka"][index] ?? "Excellent",
          review: [
            "Authentic product, premium packaging and a seamless experience from start to finish.",
            "The craftsmanship and presentation felt genuinely luxurious.",
            "Fast delivery in Dhaka and the product quality exceeded expectations.",
          ][index] ?? "Excellent experience.",
        })),
      );
    }
  }
});

function mapProductRow(row: {
  product: typeof products.$inferSelect;
  categoryName: string;
  categorySlug: string;
}) {
  return {
    ...row.product,
    images: Array.isArray(row.product.images) ? (row.product.images as string[]) : [],
    tags: Array.isArray(row.product.tags) ? (row.product.tags as string[]) : [],
    specifications:
      typeof row.product.specifications === "object" && row.product.specifications !== null
        ? (row.product.specifications as Record<string, string>)
        : {},
    categoryName: row.categoryName,
    categorySlug: row.categorySlug,
  };
}

export async function getCategories() {
  await ensureSeeded();
  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function getProducts(options?: {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  limit?: number;
}) {
  await ensureSeeded();

  const conditions: SQL[] = [eq(categories.isActive, true)];

  if (options?.query) {
    const queryCondition = or(
      ilike(products.name, `%${options.query}%`),
      ilike(products.brand, `%${options.query}%`),
      ilike(products.description, `%${options.query}%`),
    );
    if (queryCondition) conditions.push(queryCondition);
  }

  if (options?.category) {
    conditions.push(eq(categories.slug, options.category));
  }

  if (options?.brand) {
    conditions.push(eq(products.brand, options.brand));
  }

  if (typeof options?.minPrice === "number") {
    conditions.push(sql`${products.price} >= ${options.minPrice}`);
  }

  if (typeof options?.maxPrice === "number") {
    conditions.push(sql`${products.price} <= ${options.maxPrice}`);
  }

  if (options?.featured) {
    conditions.push(eq(products.featured, true));
  }

  if (options?.bestSeller) {
    conditions.push(eq(products.bestSeller, true));
  }

  if (options?.newArrival) {
    conditions.push(eq(products.newArrival, true));
  }

  const baseQuery = db
    .select({
      product: products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(conditions.length ? and(...conditions) : undefined);

  const sort = options?.sort ?? "featured";

  const rows = await (sort === "price-asc"
    ? baseQuery.orderBy(asc(products.price))
    : sort === "price-desc"
      ? baseQuery.orderBy(desc(products.price))
      : sort === "popular"
        ? baseQuery.orderBy(desc(products.reviewCount), desc(products.rating))
        : sort === "newest"
          ? baseQuery.orderBy(desc(products.createdAt))
          : baseQuery.orderBy(desc(products.featured), desc(products.newArrival), desc(products.createdAt))).limit(
    options?.limit ?? 100,
  );

  return rows.map(mapProductRow);
}

export async function getProductBySlug(slug: string) {
  await ensureSeeded();
  const rows = await db
    .select({
      product: products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(categories.isActive, true)))
    .limit(1);

  if (!rows[0]) return null;
  return mapProductRow(rows[0]);
}

export async function getRelatedProducts(categoryId: string, productId: string) {
  const rows = await db
    .select({
      product: products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.categoryId, categoryId),
        eq(categories.isActive, true),
        sql`${products.id} <> ${productId}`,
      ),
    )
    .orderBy(desc(products.featured), desc(products.reviewCount))
    .limit(4);

  return rows.map(mapProductRow);
}

export async function getProductReviews(productId: string) {
  await ensureSeeded();
  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      review: reviews.review,
      createdAt: reviews.createdAt,
      userName: users.name,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)))
    .orderBy(desc(reviews.createdAt));
}

export async function getFeaturedCategories(limit = 5) {
  const activeCategories = await getCategories();
  const homepageCategories = activeCategories.filter((category) => category.showOnHome);
  return (homepageCategories.length ? homepageCategories : activeCategories).slice(0, limit);
}

export async function getBrands() {
  await ensureSeeded();
  const rows = await db
    .selectDistinct({ brand: products.brand })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(categories.isActive, true))
    .orderBy(asc(products.brand));
  return rows.map((item) => item.brand);
}

export async function getWishlistProducts(userId: string) {
  await ensureSeeded();
  const rows = await db
    .select({
      product: products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(wishlists)
    .innerJoin(products, eq(wishlists.productId, products.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(wishlists.userId, userId), eq(categories.isActive, true)))
    .orderBy(desc(wishlists.createdAt));

  return rows.map(mapProductRow);
}

export async function getOrdersByUser(userId: string) {
  await ensureSeeded();
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(orderId: string, userId?: string) {
  await ensureSeeded();
  const orderRows = await db
    .select()
    .from(orders)
    .where(
      userId ? and(eq(orders.id, orderId), eq(orders.userId, userId)) : eq(orders.id, orderId),
    )
    .limit(1);

  const order = orderRows[0];
  if (!order) return null;

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { order, items };
}

export async function getDashboardStats() {
  await ensureSeeded();

  const [salesRow] = await db.select({ value: sql<number>`coalesce(sum(${orders.total}), 0)::int` }).from(orders);
  const [ordersRow] = await db.select({ value: sql<number>`count(*)::int` }).from(orders);
  const [customersRow] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.role, "CUSTOMER"));
  const [productsRow] = await db.select({ value: sql<number>`count(*)::int` }).from(products);

  const lowStock = await db
    .select()
    .from(products)
    .where(lte(products.stockQuantity, products.lowStockThreshold))
    .orderBy(asc(products.stockQuantity))
    .limit(5);

  const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);

  return {
    totalSales: Number(salesRow?.value ?? 0),
    totalOrders: Number(ordersRow?.value ?? 0),
    totalCustomers: Number(customersRow?.value ?? 0),
    totalProducts: Number(productsRow?.value ?? 0),
    lowStock,
    recentOrders,
  };
}

export async function getProductByIds(ids: string[]) {
  await ensureSeeded();
  if (!ids.length) return [];
  const rows = await db
    .select({
      product: products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(inArray(products.id, ids), eq(categories.isActive, true)));
  return rows.map(mapProductRow);
}

export async function createInventoryLog(productId: string, quantityChange: number, resultingStock: number, note: string) {
  await db.insert(inventoryHistory).values({
    productId,
    quantityChange,
    resultingStock,
    type: quantityChange < 0 ? "ORDER" : "ADJUSTMENT",
    note,
  });
}
