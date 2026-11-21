import { notFound } from "next/navigation";
import ProductListingPage from "@/components/product/ProductListingPage";
import { getBrands, getCategories, getProducts } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [products, categories, brands] = await Promise.all([
    getProducts({ category: slug, sort: "featured" }),
    getCategories(),
    getBrands(),
  ]);

  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  return (
    <ProductListingPage
      title={category.name}
      description={category.description ?? `Discover curated ${category.name.toLowerCase()} at ARONNO.`}
      products={products}
      categories={categories}
      brands={brands}
      current={{ category: slug, sort: "featured" }}
    />
  );
}
