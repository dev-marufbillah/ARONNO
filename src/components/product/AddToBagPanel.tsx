"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/components/providers/StoreProvider";

export default function AddToBagPanel({
  product,
}: {
  product: { id: string; slug: string; name: string; brand: string; price: number; thumbnail: string; stockQuantity: number };
}) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, updateCartQuantity, cart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const liked = isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product);
    const existing = cart.find((item) => item.id === product.id);
    const nextQuantity = existing ? existing.quantity + quantity - 1 : quantity;
    updateCartQuantity(product.id, nextQuantity);
  };

  const handleBuyNow = () => {
    handleAdd();
    router.push("/checkout");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <QuantitySelector value={quantity} onChange={setQuantity} />
        <button onClick={() => void toggleWishlist(product.id)} className="flex h-11 w-11 items-center justify-center border border-black/10" aria-label="Add to wishlist">
          <Heart size={18} fill={liked ? "currentColor" : "none"} className={liked ? "text-gold" : "text-black-deep"} />
        </button>
      </div>
      <Button type="button" onClick={handleAdd} className="h-12 w-full" disabled={product.stockQuantity < 1}>Add to Bag</Button>
      <Button type="button" onClick={handleBuyNow} variant="secondary" className="h-12 w-full">Buy Now</Button>
    </div>
  );
}
