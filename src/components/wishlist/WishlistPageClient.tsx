"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/product/ProductCard";
import { useStore } from "@/components/providers/StoreProvider";

export default function WishlistPageClient() {
  const { wishlistIds } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!wishlistIds.length) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const response = await fetch(`/api/products?ids=${wishlistIds.join(",")}`, { cache: "no-store" });
      const data = (await response.json()) as { products: any[] };
      setProducts(data.products ?? []);
      setLoading(false);
    };

    void load();
  }, [wishlistIds]);

  return (
    <Container className="py-16 md:py-20">
      <h1 className="text-4xl text-black-deep md:text-5xl">Wishlist</h1>
      {loading ? <p className="mt-8 text-sm text-black/50">Loading wishlist...</p> : null}
      {!loading && !products.length ? (
        <div className="mt-10">
          <EmptyState
            title="Your wishlist is empty"
            description="Save your favorite fragrances, watches and curated essentials here."
            actionLabel="Browse Products"
            actionHref="/shop"
          />
        </div>
      ) : null}
      <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} showRating />)}
      </div>
    </Container>
  );
}
