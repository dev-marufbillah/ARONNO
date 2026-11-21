import Container from "@/components/ui/Container";
import AccountNav from "@/components/account/AccountNav";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/product/ProductCard";
import { requireAuth } from "@/lib/auth-helpers";
import { getWishlistProducts } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export default async function AccountWishlistPage() {
  const user = await requireAuth();
  const products = await getWishlistProducts(user.id);

  return (
    <Container className="py-16 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <AccountNav />
        <div>
          <h1 className="text-4xl text-black-deep">Saved Wishlist</h1>
          {products.length ? (
            <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-3">
              {products.map((product) => <ProductCard key={product.id} product={product} showRating />)}
            </div>
          ) : (
            <div className="mt-8"><EmptyState title="No saved products" description="Wishlist items saved while signed in will appear here." actionLabel="Explore Products" actionHref="/shop" /></div>
          )}
        </div>
      </div>
    </Container>
  );
}
