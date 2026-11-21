import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import ProductGallery from "@/components/product/ProductGallery";
import Rating from "@/components/ui/Rating";
import { formatCurrency } from "@/lib/utils";
import AddToBagPanel from "@/components/product/AddToBagPanel";
import { getProductBySlug, getProductReviews, getRelatedProducts } from "@/lib/storefront";
import ProductReviews from "@/components/product/ProductReviews";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | ARONNO`,
      description: product.shortDescription,
      images: [product.thumbnail],
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product.categoryId, product.id),
  ]);

  return (
    <Container className="py-16 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery images={product.images.length ? product.images : [product.thumbnail]} alt={product.name} />
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">{product.brand}</p>
          <h1 className="mt-3 text-4xl leading-tight text-black-deep md:text-5xl">{product.name}</h1>
          <div className="mt-5"><Rating value={product.rating} reviewCount={product.reviewCount} /></div>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-3xl text-black-deep">{formatCurrency(product.price)}</span>
            {product.compareAtPrice ? <span className="text-base text-black/35 line-through">{formatCurrency(product.compareAtPrice)}</span> : null}
          </div>
          <p className="mt-6 text-base leading-8 text-black/65">{product.description}</p>
          <div className="mt-6 text-sm text-black/60">
            <p>Stock Status: {product.stockQuantity > 0 ? `${product.stockQuantity} available` : "Out of stock"}</p>
          </div>
          <div className="mt-8">
            <AddToBagPanel product={product} />
          </div>

          <div className="mt-10 grid gap-4 border-t border-black/10 pt-8 text-sm leading-7 text-black/65">
            <div><span className="font-medium text-black-deep">Delivery:</span> Reliable premium delivery across Bangladesh.</div>
            <div><span className="font-medium text-black-deep">Returns:</span> Easy return architecture prepared for eligible orders.</div>
            <div><span className="font-medium text-black-deep">Authenticity:</span> Every product is carefully sourced for quality and authenticity.</div>
          </div>

          <div className="mt-10 border-t border-black/10 pt-8">
            <h2 className="text-2xl text-black-deep">Specifications</h2>
            <div className="mt-5 grid gap-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-6 border-b border-black/5 pb-3 text-sm">
                  <span className="text-black/45">{key}</span>
                  <span className="text-right text-black-deep">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 space-y-20">
        <ProductReviews reviews={reviews.map((review) => ({ ...review, createdAt: review.createdAt ?? new Date() }))} />

        <section>
          <SectionHeading title="Related Products" />
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item.id} product={item} showRating />)}
          </div>
        </section>
      </div>
    </Container>
  );
}
