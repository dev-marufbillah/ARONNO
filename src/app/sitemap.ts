import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/storefront";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const base = SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/new-arrivals`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/login`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/register`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/wishlist`, changeFrequency: "weekly", priority: 0.6 },
  ];

  return [
    ...staticRoutes,
    ...categories.map((category) => ({
      url: `${base}/category/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
