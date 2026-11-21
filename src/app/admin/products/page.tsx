import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import ProductManager from "@/components/admin/ProductManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [productList, categoryList] = await Promise.all([
    db.select().from(products).orderBy(desc(products.createdAt)),
    db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.name)),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif tracking-wide text-neutral-900 uppercase">Products</h1>
        <p className="text-xs text-neutral-500 tracking-wider font-mono mt-1">Create, edit and manage the ARONNO catalog</p>
      </div>
      <ProductManager
        products={productList.map((product) => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          brand: product.brand,
          slug: product.slug,
          categoryId: product.categoryId,
          subcategory: product.subcategory,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          stockQuantity: product.stockQuantity,
          lowStockThreshold: product.lowStockThreshold,
          thumbnail: product.thumbnail,
          images: product.images,
          description: product.description,
          shortDescription: product.shortDescription,
          rating: product.rating,
          reviewCount: product.reviewCount,
          featured: product.featured,
          bestSeller: product.bestSeller,
          newArrival: product.newArrival,
          tags: product.tags,
          specifications: product.specifications,
        }))}
        categories={categoryList}
      />
    </div>
  );
}
