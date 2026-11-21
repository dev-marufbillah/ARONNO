import HomePageContent from "@/components/home/HomePageContent";
import {
  getFeaturedCategories,
  getNewArrivals,
  getBestSellers,
} from "@/lib/storefront-home";
import { categorySeed, productSeed } from "@/lib/demo-data";
import { getStoreAdminConfig } from "@/lib/store-settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof getFeaturedCategories>>;
  let newArrivals: Awaited<ReturnType<typeof getNewArrivals>>;
  let bestSellers: Awaited<ReturnType<typeof getBestSellers>>;

  try {
    [categories, newArrivals, bestSellers] = await Promise.all([
      getFeaturedCategories(5),
      getNewArrivals(),
      getBestSellers(),
    ]);
  } catch (error) {
    console.error("Could not load storefront data.", error);
    if (process.env.NODE_ENV === "production") throw error;

    categories = categorySeed.slice(0, 5).map((item) => ({
      id: item.slug,
      name: item.name,
      slug: item.slug,
      imageUrl: item.imageUrl,
      description: item.description,
    })) as Awaited<ReturnType<typeof getFeaturedCategories>>;

    const mapFallbackProduct = (item: (typeof productSeed)[number]) => ({
      id: item.slug,
      slug: item.slug,
      brand: item.brand,
      name: item.name,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      currency: "BDT",
      thumbnail: item.thumbnail,
      rating: item.rating,
      reviewCount: item.reviewCount,
      stockQuantity: item.stockQuantity,
      categoryName: categorySeed.find((category) => category.slug === item.categorySlug)?.name ?? "Luxury",
      categorySlug: item.categorySlug,
      category: categorySeed.find((category) => category.slug === item.categorySlug)?.name ?? "Luxury",
      description: item.description,
      images: [...item.images],
      tags: [...item.tags],
      specifications: { ...item.specifications },
    });

    newArrivals = productSeed
      .filter((item) => item.newArrival)
      .slice(0, 4)
      .map(mapFallbackProduct) as unknown as Awaited<ReturnType<typeof getNewArrivals>>;
    bestSellers = productSeed
      .filter((item) => item.bestSeller)
      .slice(0, 4)
      .map(mapFallbackProduct) as unknown as Awaited<ReturnType<typeof getBestSellers>>;
  }

  const { site: settings } = await getStoreAdminConfig();

  return (
    <HomePageContent
      categories={categories}
      newArrivals={newArrivals}
      bestSellers={bestSellers}
      settings={settings}
    />
  );
}