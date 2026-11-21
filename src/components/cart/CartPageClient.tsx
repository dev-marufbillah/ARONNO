"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import { useStore } from "@/components/providers/StoreProvider";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { formatCurrency, getDeliveryFee } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";

export default function CartPageClient({
  freeDeliveryThreshold,
  deliveryFee: standardDeliveryFee,
}: {
  freeDeliveryThreshold: number;
  deliveryFee: number;
}) {
  const { cart, subtotal, removeFromCart, updateCartQuantity } = useStore();
  const deliveryFee = getDeliveryFee(subtotal, freeDeliveryThreshold, standardDeliveryFee);
  const total = subtotal + deliveryFee;

  if (!cart.length) {
    return (
      <Container className="py-16 md:py-20">
        <EmptyState
          title="Your bag is empty"
          description="Explore curated luxury products and add your favorite pieces to the bag."
          actionLabel="Explore Collection"
          actionHref="/shop"
        />
      </Container>
    );
  }

  return (
    <Container className="py-16 md:py-20">
      <h1 className="text-4xl text-black-deep md:text-5xl font-serif tracking-tight">
        Your Bag ({cart.length})
      </h1>
      
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px] items-start">
        {/* Cart Item List */}
        <div className="space-y-5">
          {cart.map((item) => (
            <article 
              key={item.id} 
              className="grid gap-6 border border-black/10 bg-white p-5 sm:p-6 sm:grid-cols-[120px_1fr_auto] sm:items-center transition-colors hover:border-black/20"
            >
              <Link href={`/products/${item.slug}`} className="block overflow-hidden bg-[#f8f5ef] shrink-0">
                <Image 
                  src={item.thumbnail} 
                  alt={item.name} 
                  width={240} 
                  height={280} 
                  className="aspect-[4/5] h-full w-full object-cover" 
                />
              </Link>

              <div className="py-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-black/45 font-medium">{item.brand}</p>
                <Link href={`/products/${item.slug}`} className="mt-1 block font-serif text-xl text-black-deep hover:text-[#C4A265] transition-colors leading-snug">
                  {item.name}
                </Link>
                <p className="mt-3 text-base font-bold text-black-deep">{formatCurrency(item.price)}</p>
              </div>

              <div className="flex flex-col gap-4 justify-self-start sm:justify-self-end sm:items-end">
                <QuantitySelector value={item.quantity} onChange={(next) => updateCartQuantity(item.id, next)} />
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-[11px] uppercase tracking-[0.16em] text-black/45 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="h-fit border border-black/10 bg-[#fbfaf7] p-8 md:p-10 sticky top-28 shadow-sm">
          <h2 className="text-2xl font-serif text-black-deep mb-6">Order Summary</h2>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-black/60 uppercase tracking-widest text-[11px]">Subtotal</span>
              <span className="font-medium text-black-deep">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-black/60 uppercase tracking-widest text-[11px]">Delivery</span>
              <span className="font-medium text-black-deep">{deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}</span>
            </div>

            <div className="my-4 border-t border-black/10 pt-4 flex items-center justify-between text-lg font-medium">
              <span className="font-serif text-black-deep">Total</span>
              <span className="font-bold text-black-deep">{formatCurrency(total)}</span>
            </div>
          </div>

          <ButtonLink href="/checkout" className="mt-8 h-12 w-full uppercase tracking-[0.18em] text-[11px] font-bold">
            Proceed to Checkout
          </ButtonLink>
        </aside>
      </div>
    </Container>
  );
}