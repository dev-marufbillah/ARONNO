import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["CUSTOMER", "ADMIN"]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "COD",
  "BKASH",
  "NAGAD",
  "SSLCOMMERZ",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
]);
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);
export const couponTypeEnum = pgEnum("coupon_type", ["PERCENTAGE", "FIXED"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    passwordHash: text("password_hash"),
    role: userRoleEnum("role").default("CUSTOMER").notNull(),
    isSuperAdmin: boolean("is_super_admin").default(false).notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_unique_idx").on(table.email),
    uniqueIndex("users_single_super_admin_idx")
      .on(table.isSuperAdmin)
      .where(sql`${table.isSuperAdmin}`),
  ],
);

export const authSessions = pgTable(
  "auth_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("auth_sessions_token_unique_idx").on(table.token),
    index("auth_sessions_user_idx").on(table.userId),
  ],
);

export const authAccounts = pgTable(
  "auth_accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("auth_accounts_provider_account_unique_idx").on(
      table.providerId,
      table.accountId,
    ),
    index("auth_accounts_user_idx").on(table.userId),
  ],
);

export const authVerifications = pgTable(
  "auth_verifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("auth_verifications_identifier_idx").on(table.identifier)],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    parentId: uuid("parent_id"),
    isActive: boolean("is_active").default(true).notNull(),
    showInNav: boolean("show_in_nav").default(true).notNull(),
    showOnHome: boolean("show_on_home").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("categories_slug_unique_idx").on(table.slug),
    index("categories_name_idx").on(table.name),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sku: text("sku").notNull(),
    brand: text("brand").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    categoryId: uuid("category_id").notNull(),
    subcategory: text("subcategory"),
    description: text("description").notNull(),
    shortDescription: text("short_description").notNull(),
    price: integer("price").notNull(),
    compareAtPrice: integer("compare_at_price"),
    currency: text("currency").default("BDT").notNull(),
    stockQuantity: integer("stock_quantity").default(0).notNull(),
    thumbnail: text("thumbnail").notNull(),
    images: jsonb("images").$type<string[]>().default([]).notNull(),
    rating: real("rating").default(0).notNull(),
    reviewCount: integer("review_count").default(0).notNull(),
    featured: boolean("featured").default(false).notNull(),
    bestSeller: boolean("best_seller").default(false).notNull(),
    newArrival: boolean("new_arrival").default(false).notNull(),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    specifications: jsonb("specifications").$type<Record<string, string>>().default({}).notNull(),
    lowStockThreshold: integer("low_stock_threshold").default(3).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("products_sku_unique_idx").on(table.sku),
    uniqueIndex("products_slug_unique_idx").on(table.slug),
    index("products_brand_idx").on(table.brand),
    index("products_name_idx").on(table.name),
    index("products_category_idx").on(table.categoryId),
  ],
);

export const wishlists = pgTable(
  "wishlists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    productId: uuid("product_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("wishlists_user_product_unique_idx").on(table.userId, table.productId)],
);

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  division: text("division").notNull(),
  district: text("district").notNull(),
  area: text("area").notNull(),
  fullAddress: text("full_address").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: text("order_number").notNull(),
    userId: uuid("user_id"),
    customerName: text("customer_name").notNull(),
    email: text("email").notNull(),
    phoneNumber: text("phone_number").notNull(),
    status: orderStatusEnum("status").default("PENDING").notNull(),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    paymentStatus: paymentStatusEnum("payment_status").default("PENDING").notNull(),
    subtotal: integer("subtotal").notNull(),
    discount: integer("discount").default(0).notNull(),
    deliveryFee: integer("delivery_fee").notNull(),
    total: integer("total").notNull(),
    couponCode: text("coupon_code"),
    shippingAddress: jsonb("shipping_address")
      .$type<{
        fullName: string;
        phoneNumber: string;
        email: string;
        division: string;
        district: string;
        area: string;
        fullAddress: string;
      }>()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("orders_order_number_unique_idx").on(table.orderNumber),
    index("orders_user_idx").on(table.userId),
  ],
);

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull(),
  productId: uuid("product_id").notNull(),
  productName: text("product_name").notNull(),
  productSlug: text("product_slug").notNull(),
  brand: text("brand").notNull(),
  image: text("image").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  totalPrice: integer("total_price").notNull(),
});

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    productId: uuid("product_id").notNull(),
    rating: integer("rating").notNull(),
    title: text("title").notNull(),
    review: text("review").notNull(),
    isApproved: boolean("is_approved").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("reviews_product_idx").on(table.productId)],
);

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    type: couponTypeEnum("type").notNull(),
    value: integer("value").notNull(),
    minimumOrder: integer("minimum_order").default(0).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    usageLimit: integer("usage_limit"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("coupons_code_unique_idx").on(table.code)],
);

export const inventoryHistory = pgTable("inventory_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull(),
  quantityChange: integer("quantity_change").notNull(),
  resultingStock: integer("resulting_stock").notNull(),
  type: text("type").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("newsletter_subscribers_email_unique_idx").on(table.email)],
);

export const storeSettings = pgTable("store_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
