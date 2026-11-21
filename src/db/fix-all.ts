import { sql } from "drizzle-orm";
import { db } from "./index";

async function fixAll() {
  // 1. Drop everything
  console.log("1️⃣  Dropping all tables...");
  await db.execute(sql.raw(`DROP SCHEMA public CASCADE`));
  await db.execute(sql.raw(`CREATE SCHEMA public`));
  await db.execute(sql.raw(`GRANT ALL ON SCHEMA public TO postgres`));
  await db.execute(sql.raw(`GRANT ALL ON SCHEMA public TO public`));
  console.log("   ✅ All tables dropped.");

  // 2. Create tables with correct DEFAULTs
  console.log("2️⃣  Creating tables with Drizzle schema...");

  // Enums
  await db.execute(sql.raw(`CREATE TYPE "user_role" AS ENUM ('CUSTOMER', 'ADMIN')`));
  await db.execute(sql.raw(`CREATE TYPE "payment_method" AS ENUM ('COD', 'BKASH', 'NAGAD', 'SSLCOMMERZ')`));
  await db.execute(sql.raw(`CREATE TYPE "payment_status" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED')`));
  await db.execute(sql.raw(`CREATE TYPE "order_status" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')`));
  await db.execute(sql.raw(`CREATE TYPE "coupon_type" AS ENUM ('PERCENTAGE', 'FIXED')`));

  // Users
  await db.execute(sql.raw(`
    CREATE TABLE "users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL,
      "email" text NOT NULL,
      "phone" text,
      "password_hash" text NOT NULL,
      "role" "user_role" DEFAULT 'CUSTOMER' NOT NULL,
      "is_super_admin" boolean DEFAULT false NOT NULL,
      "email_verified" boolean DEFAULT false NOT NULL,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));
  await db.execute(sql.raw(`CREATE UNIQUE INDEX "users_email_unique_idx" ON "users" ("email")`));
  await db.execute(sql.raw(`CREATE UNIQUE INDEX "users_single_super_admin_idx" ON "users" ("is_super_admin") WHERE "is_super_admin" = true`));

  // Categories
  await db.execute(sql.raw(`
    CREATE TABLE "categories" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL,
      "slug" text NOT NULL,
      "description" text,
      "image_url" text,
      "parent_id" uuid,
      "is_active" boolean DEFAULT true NOT NULL,
      "show_in_nav" boolean DEFAULT true NOT NULL,
      "show_on_home" boolean DEFAULT false NOT NULL,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));
  await db.execute(sql.raw(`CREATE UNIQUE INDEX "categories_slug_unique_idx" ON "categories" ("slug")`));
  await db.execute(sql.raw(`CREATE INDEX "categories_name_idx" ON "categories" ("name")`));

  // Products (THE KEY TABLE)
  await db.execute(sql.raw(`
    CREATE TABLE "products" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "sku" text NOT NULL,
      "brand" text NOT NULL,
      "name" text NOT NULL,
      "slug" text NOT NULL,
      "category_id" uuid NOT NULL,
      "subcategory" text,
      "description" text NOT NULL,
      "short_description" text NOT NULL,
      "price" integer NOT NULL,
      "compare_at_price" integer,
      "currency" text DEFAULT 'BDT' NOT NULL,
      "stock_quantity" integer DEFAULT 0 NOT NULL,
      "thumbnail" text NOT NULL,
      "images" jsonb DEFAULT '[]' NOT NULL,
      "rating" real DEFAULT 0 NOT NULL,
      "review_count" integer DEFAULT 0 NOT NULL,
      "featured" boolean DEFAULT false NOT NULL,
      "best_seller" boolean DEFAULT false NOT NULL,
      "new_arrival" boolean DEFAULT false NOT NULL,
      "tags" jsonb DEFAULT '[]' NOT NULL,
      "specifications" jsonb DEFAULT '{}' NOT NULL,
      "low_stock_threshold" integer DEFAULT 3 NOT NULL,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));
  await db.execute(sql.raw(`CREATE UNIQUE INDEX "products_sku_unique_idx" ON "products" ("sku")`));
  await db.execute(sql.raw(`CREATE UNIQUE INDEX "products_slug_unique_idx" ON "products" ("slug")`));
  await db.execute(sql.raw(`CREATE INDEX "products_brand_idx" ON "products" ("brand")`));
  await db.execute(sql.raw(`CREATE INDEX "products_name_idx" ON "products" ("name")`));
  await db.execute(sql.raw(`CREATE INDEX "products_category_idx" ON "products" ("category_id")`));

  // Wishlists
  await db.execute(sql.raw(`
    CREATE TABLE "wishlists" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid NOT NULL,
      "product_id" uuid NOT NULL,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));
  await db.execute(sql.raw(`CREATE UNIQUE INDEX "wishlists_user_product_unique_idx" ON "wishlists" ("user_id", "product_id")`));

  // Addresses
  await db.execute(sql.raw(`
    CREATE TABLE "addresses" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid NOT NULL,
      "full_name" text NOT NULL,
      "phone_number" text NOT NULL,
      "email" text NOT NULL,
      "division" text NOT NULL,
      "district" text NOT NULL,
      "area" text NOT NULL,
      "full_address" text NOT NULL,
      "is_default" boolean DEFAULT false NOT NULL,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));

  // Orders
  await db.execute(sql.raw(`
    CREATE TABLE "orders" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "order_number" text NOT NULL,
      "user_id" uuid,
      "customer_name" text NOT NULL,
      "email" text NOT NULL,
      "phone_number" text NOT NULL,
      "status" "order_status" DEFAULT 'PENDING' NOT NULL,
      "payment_method" "payment_method" NOT NULL,
      "payment_status" "payment_status" DEFAULT 'PENDING' NOT NULL,
      "subtotal" integer NOT NULL,
      "discount" integer DEFAULT 0 NOT NULL,
      "delivery_fee" integer NOT NULL,
      "total" integer NOT NULL,
      "coupon_code" text,
      "shipping_address" jsonb NOT NULL,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));
  await db.execute(sql.raw(`CREATE UNIQUE INDEX "orders_order_number_unique_idx" ON "orders" ("order_number")`));
  await db.execute(sql.raw(`CREATE INDEX "orders_user_idx" ON "orders" ("user_id")`));

  // Order Items
  await db.execute(sql.raw(`
    CREATE TABLE "order_items" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "order_id" uuid NOT NULL,
      "product_id" uuid NOT NULL,
      "product_name" text NOT NULL,
      "product_slug" text NOT NULL,
      "brand" text NOT NULL,
      "image" text NOT NULL,
      "quantity" integer NOT NULL,
      "unit_price" integer NOT NULL,
      "total_price" integer NOT NULL
    )
  `));

  // Reviews
  await db.execute(sql.raw(`
    CREATE TABLE "reviews" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid NOT NULL,
      "product_id" uuid NOT NULL,
      "rating" integer NOT NULL,
      "title" text NOT NULL,
      "review" text NOT NULL,
      "is_approved" boolean DEFAULT true NOT NULL,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));
  await db.execute(sql.raw(`CREATE INDEX "reviews_product_idx" ON "reviews" ("product_id")`));

  // Coupons
  await db.execute(sql.raw(`
    CREATE TABLE "coupons" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "code" text NOT NULL,
      "type" "coupon_type" NOT NULL,
      "value" integer NOT NULL,
      "minimum_order" integer DEFAULT 0 NOT NULL,
      "expires_at" timestamp with time zone,
      "usage_limit" integer,
      "is_active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));
  await db.execute(sql.raw(`CREATE UNIQUE INDEX "coupons_code_unique_idx" ON "coupons" ("code")`));

  // Inventory History
  await db.execute(sql.raw(`
    CREATE TABLE "inventory_history" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "product_id" uuid NOT NULL,
      "quantity_change" integer NOT NULL,
      "resulting_stock" integer NOT NULL,
      "type" text NOT NULL,
      "note" text,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));

  // Newsletter Subscribers
  await db.execute(sql.raw(`
    CREATE TABLE "newsletter_subscribers" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "email" text NOT NULL,
      "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));
  await db.execute(sql.raw(`CREATE UNIQUE INDEX "newsletter_subscribers_email_unique_idx" ON "newsletter_subscribers" ("email")`));

  // Storefront content and payment availability
  await db.execute(sql.raw(`
    CREATE TABLE "store_settings" (
      "key" text PRIMARY KEY,
      "value" jsonb NOT NULL,
      "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `));

  console.log("   ✅ All tables created!");

  // 3. Verify
  console.log("3️⃣  Verifying updated_at DEFAULT...");
  const result = await db.execute(sql`
    SELECT column_name, column_default
    FROM information_schema.columns
    WHERE table_name = 'products'
    AND column_name IN ('created_at', 'updated_at')
  `);
  const verificationRows = Array.from(result as unknown as Array<Record<string, unknown>>);
  console.log("   Result:", JSON.stringify(verificationRows, null, 2));

  const hasDefault = verificationRows.every(
    (r: any) => r.column_default && r.column_default.includes("CURRENT_TIMESTAMP")
  );

  if (hasDefault) {
    console.log("\n🎉 SUCCESS! DEFAULT CURRENT_TIMESTAMP is set on both columns.");
    console.log("   Now run your seed again — the error will be gone.");
  } else {
    console.log("\n❌ DEFAULT not found. Something went wrong.");
  }

  process.exit(0);
}

fixAll().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});