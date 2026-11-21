import { NextRequest } from "next/server";
import { getProductByIds, getProducts } from "@/lib/storefront";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (ids) {
    const products = await getProductByIds(ids.split(",").filter(Boolean));
    return Response.json({ products });
  }

  const products = await getProducts({
    query: searchParams.get("query") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    brand: searchParams.get("brand") ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sort: searchParams.get("sort") ?? undefined,
  });

  return Response.json({ products });
}
