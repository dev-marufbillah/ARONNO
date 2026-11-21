import { getCategories } from "@/lib/storefront";

export async function GET() {
  const categories = await getCategories();
  return Response.json({ categories });
}
