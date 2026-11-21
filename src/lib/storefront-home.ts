import { getFeaturedCategories, getProducts } from "@/lib/storefront";

export async function getNewArrivals() {
  return getProducts({ newArrival: true, limit: 4, sort: "newest" });
}

export async function getBestSellers() {
  return getProducts({ bestSeller: true, limit: 4, sort: "popular" });
}

export { getFeaturedCategories };
