import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import Container from "@/components/ui/Container";
import AddToBagPanel from "@/components/product/AddToBagPanel";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, ShoppingBag, CheckCircle2, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SingleProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const result = await db
    .select()
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);

  if (!result.length) {
    notFound();
  }

  const product = result[0].products;
  const category = result[0].categories;

  // images এখন string[] (Drizzle array), JSON.parse লাগবে না!
  const imagesArray: string[] = Array.isArray(product.images)
    ? product.images
    : [];

  const mainImage =
    imagesArray.length > 0
      ? imagesArray[0]
      : product.thumbnail || null;

  const isOut = product.stockQuantity <= 0;

  return (
    <Container className="py-12 md:py-16">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C4A265] hover:underline mb-8"
      >
        <ArrowLeft size={14} /> Back to Shop
      </Link>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16 items-start">
        {/* Left: Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 border border-neutral-200 rounded">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4A265]">
              {product.brand || category?.name || "Aronno Collection"}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 mt-1">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold font-serif text-neutral-900">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg text-neutral-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Stock Badge */}
          <div>
            {isOut ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                <AlertTriangle size={14} /> Out of Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 size={14} /> In Stock ({product.stockQuantity} remaining)
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-neutral-600 border-t border-b border-neutral-100 py-4">
            {product.description || product.shortDescription || "No description provided for this product."}
          </p>

          <AddToBagPanel
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              price: product.price,
              thumbnail: product.thumbnail,
              stockQuantity: product.stockQuantity,
            }}
          />
        </div>
      </div>
    </Container>
  );
}