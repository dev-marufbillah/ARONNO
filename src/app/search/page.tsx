import ProductListingPage from "@/components/product/ProductListingPage";
import { getBrands, getCategories, getProducts } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";
  const [products, categories, brands] = await Promise.all([
    getProducts({ query, sort: "popular" }),
    getCategories(),
    getBrands(),
  ]);

  return (
    <ProductListingPage
      title="Search"
      description="Search products, brands and curated categories across the ARONNO world."
      products={products}
      categories={categories}
      brands={brands}
      current={{ query, sort: "popular" }}
    />
  );
}
