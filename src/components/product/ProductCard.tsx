"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, X, ShoppingBag, Check } from "lucide-react";
import Rating from "@/components/ui/Rating";
import { formatCurrency } from "@/lib/utils";
import { useStore } from "@/components/providers/StoreProvider";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    brand: string;
    name: string;
    price: number;
    compareAtPrice: number | null;
    thumbnail: string;
    rating: number;
    reviewCount: number;
    stockQuantity: number;
    category?: string;
    description?: string;
  };
  showRating?: boolean;
}

export default function ProductCard({ product, showRating = false }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const liked = isInWishlist(product.id);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <article className="group flex h-full flex-col border border-[#EDEDED] bg-white p-3 transition-all duration-300 hover:border-neutral-300 hover:shadow-md">
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F5F5]">
          <Link href={`/products/${product.slug}`} className="relative block h-full w-full">
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Top-Right Action Icons (Wishlist & Quick View) */}
          <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void toggleWishlist(product.id);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm transition-all hover:scale-110 hover:bg-white hover:text-black active:scale-95"
              aria-label="Toggle wishlist"
            >
              <Heart
                size={16}
                strokeWidth={1.5}
                fill={liked ? "currentColor" : "none"}
                className={liked ? "fill-red-500 text-red-500" : ""}
              />
            </button>

            {/* Quick View Icon */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm transition-all hover:scale-110 hover:bg-white hover:text-black active:scale-95 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Quick View"
              title="Quick View"
            >
              <Eye size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Bottom Hover Bar: Full-Width ADD TO BAG (মাউস হোভার করলে ভেসে উঠবে) */}
          <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stockQuantity < 1}
              className="flex w-full items-center justify-center gap-2 bg-black py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {added ? (
                <>
                  <Check size={14} className="text-green-400" />
                  ADDED TO BAG
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  {product.stockQuantity < 1 ? "OUT OF STOCK" : "ADD TO BAG"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Info Below */}
        <div className="flex flex-col pb-1 pt-4 text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            {product.brand || "ARONNO"}
          </p>

          <Link
            href={`/products/${product.slug}`}
            className="mt-1 block font-serif text-[15px] font-normal leading-snug text-neutral-900 transition-colors line-clamp-1 hover:text-neutral-600"
          >
            {product.name}
          </Link>

          <span className="mt-0.5 text-[12px] font-normal text-neutral-400">
            {product.category || "Luxury"}
          </span>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[16px] font-bold text-neutral-900">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-xs text-neutral-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            ) : null}
          </div>

          {showRating && (
            <div className="mt-2">
              <Rating value={product.rating} reviewCount={product.reviewCount} />
            </div>
          )}
        </div>
      </article>

      {/* QUICK VIEW POPUP MODAL */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickViewOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative z-10 grid max-h-[90vh] w-full grid-cols-1 overflow-hidden overflow-y-auto rounded-t-2xl bg-white shadow-2xl md:max-h-none md:max-w-3xl md:grid-cols-2 md:rounded-none"
            >
              {/* Mobile drag handle */}
              <div className="col-span-full flex justify-center pt-3 md:hidden">
                <div className="h-1 w-10 rounded-full bg-neutral-300" />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 text-neutral-500 shadow-sm transition-colors hover:text-black md:right-4 md:top-4"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {/* Product Image */}
              <div className="relative aspect-square bg-neutral-100">
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-between p-6 md:p-8">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                    {product.brand}
                  </span>
                  <h2 className="mb-3 mt-1 font-serif text-2xl text-neutral-900">
                    {product.name}
                  </h2>
                  <div className="mb-4 text-xl font-bold text-neutral-900">
                    {formatCurrency(product.price)}
                    {product.compareAtPrice && (
                      <span className="ml-3 text-sm font-normal text-neutral-400 line-through">
                        {formatCurrency(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  <p className="mb-6 text-xs leading-relaxed text-neutral-600">
                    {product.description ||
                      "Experience timeless elegance and luxury craftsmanship with this exclusive piece from ARONNO."}
                  </p>
                </div>

                <div className="space-y-3 pb-2 md:pb-0">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity < 1}
                    className="flex w-full items-center justify-center gap-2 bg-black py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 disabled:bg-neutral-400"
                  >
                    <ShoppingBag size={15} />
                    {added ? "ADDED TO BAG" : "ADD TO BAG"}
                  </button>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={() => setIsQuickViewOpen(false)}
                    className="block w-full border border-neutral-300 py-3 text-center text-xs font-bold uppercase tracking-widest text-neutral-800 transition-colors hover:bg-neutral-50"
                  >
                    VIEW FULL DETAILS
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}