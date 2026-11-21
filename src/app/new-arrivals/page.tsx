import ProductListingPage from "@/components/product/ProductListingPage";
import { getBrands, getCategories, getProducts } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export default async function NewArrivalsPage() {
  const [products, categories, brands] = await Promise.all([
    getProducts({ newArrival: true, sort: "newest" }),
    getCategories(),
    getBrands(),
  ]);

  return (
    <ProductListingPage
      title="New Arrivals"
      description="Freshly curated luxury arrivals, from statement timepieces to refined fragrance and leather essentials."
      products={products}
      categories={categories}
      brands={brands}
      current={{ sort: "newest" }}
    />
  );
}
