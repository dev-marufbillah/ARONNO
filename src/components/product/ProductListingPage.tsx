"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X, Search, RotateCcw, ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeading from "@/components/ui/SectionHeading";
import type { StoreProduct } from "@/lib/storefront";

export default function ProductListingPage({
  title,
  description,
  products,
  categories,
  brands,
  current,
}: {
  title: string;
  description: string;
  products: StoreProduct[];
  categories: Array<{ slug: string; name: string }>;
  brands: string[];
  current: {
    query?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  };
}) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Active filter count calculation
  const activeFiltersCount = [
    current.query,
    current.category,
    current.brand,
    current.minPrice,
    current.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="bg-white pb-24 pt-8 md:pt-12">
      <Container>
        {/* Header Section */}
        <div className="border-b border-black/10 pb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            Curated Selection
          </p>
          <SectionHeading title={title} />
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/60 md:text-base">
            {description}
          </p>
        </div>

        {/* Action Bar (Filter trigger & Sort) */}
        <div className="sticky top-[72px] z-30 flex items-center justify-between border-b border-black/10 bg-white/95 py-4 backdrop-blur-md md:top-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 border border-black-deep bg-black-deep px-4 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-gold lg:hidden"
            >
              <SlidersHorizontal size={14} />
              Filter & Sort {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            <p className="hidden text-xs uppercase tracking-[0.16em] text-black/50 sm:block">
              Showing <span className="font-semibold text-black-deep">{products.length}</span>{" "}
              {products.length === 1 ? "Product" : "Products"}
            </p>
          </div>

          {/* Top Sort Selector */}
          <form method="GET" action="/shop" className="flex items-center gap-2">
            {current.query && <input type="hidden" name="query" value={current.query} />}
            {current.category && <input type="hidden" name="category" value={current.category} />}
            {current.brand && <input type="hidden" name="brand" value={current.brand} />}
            {current.minPrice && <input type="hidden" name="minPrice" value={current.minPrice} />}
            {current.maxPrice && <input type="hidden" name="maxPrice" value={current.maxPrice} />}

            <span className="hidden text-xs uppercase tracking-[0.16em] text-black/50 md:inline-block">
              Sort By:
            </span>
            <div className="relative">
              <select
                name="sort"
                defaultValue={current.sort ?? "featured"}
                onChange={(e) => e.target.form?.submit()}
                className="h-10 cursor-pointer appearance-none border border-black/10 bg-[#fbfaf7] pl-4 pr-9 text-xs uppercase tracking-[0.14em] text-black-deep outline-none transition focus:border-black-deep"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/40"
              />
            </div>
          </form>
        </div>

        {/* Active Filter Badges */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs uppercase tracking-[0.14em] text-black/40">Active:</span>
            {current.query && (
              <span className="inline-flex items-center gap-1.5 border border-black/15 bg-[#f5f1e8] px-3 py-1 text-xs text-black-deep">
                Search: &quot;{current.query}&quot;
              </span>
            )}
            {current.category && (
              <span className="inline-flex items-center gap-1.5 border border-black/15 bg-[#f5f1e8] px-3 py-1 text-xs text-black-deep">
                Cat: {categories.find((c) => c.slug === current.category)?.name || current.category}
              </span>
            )}
            {current.brand && (
              <span className="inline-flex items-center gap-1.5 border border-black/15 bg-[#f5f1e8] px-3 py-1 text-xs text-black-deep">
                Brand: {current.brand}
              </span>
            )}
            {(current.minPrice || current.maxPrice) && (
              <span className="inline-flex items-center gap-1.5 border border-black/15 bg-[#f5f1e8] px-3 py-1 text-xs text-black-deep">
                Price: ৳{current.minPrice || "0"} - ৳{current.maxPrice || "∞"}
              </span>
            )}
            <Link
              href="/shop"
              className="ml-2 inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-gold hover:underline"
            >
              <RotateCcw size={12} /> Clear All
            </Link>
          </div>
        )}

        {/* Main Grid Section */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden h-fit lg:sticky lg:top-28 lg:block">
            <div className="border border-black/10 bg-[#fbfaf7] p-6">
              <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-3">
                <h3 className="font-serif text-lg tracking-[0.08em] text-black-deep">
                  Filter Products
                </h3>
                {activeFiltersCount > 0 && (
                  <Link
                    href="/shop"
                    className="text-[11px] uppercase tracking-[0.14em] text-black/50 hover:text-black-deep"
                  >
                    Reset
                  </Link>
                )}
              </div>

              <form method="GET" action="/shop" className="space-y-6">
                {/* Search */}
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">
                    Keyword
                  </label>
                  <div className="relative">
                    <input
                      name="query"
                      defaultValue={current.query}
                      className="h-10 w-full border border-black/15 bg-white pl-3 pr-8 text-xs text-black-deep outline-none transition focus:border-black-deep"
                      placeholder="Perfume, Watch, Chanel..."
                    />
                    <Search
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/35"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue={current.category ?? ""}
                      className="h-10 w-full appearance-none border border-black/15 bg-white px-3 text-xs text-black-deep outline-none transition focus:border-black-deep"
                    >
                      <option value="">All Categories</option>
                      {categories.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/35"
                    />
                  </div>
                </div>

                {/* Brand */}
                {brands.length > 0 && (
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">
                      Brand
                    </label>
                    <div className="relative">
                      <select
                        name="brand"
                        defaultValue={current.brand ?? ""}
                        className="h-10 w-full appearance-none border border-black/15 bg-white px-3 text-xs text-black-deep outline-none transition focus:border-black-deep"
                      >
                        <option value="">All Brands</option>
                        {brands.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/35"
                      />
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">
                    Price Range (৳)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      name="minPrice"
                      defaultValue={current.minPrice}
                      type="number"
                      placeholder="Min"
                      className="h-10 w-full border border-black/15 bg-white px-3 text-xs text-black-deep outline-none transition focus:border-black-deep"
                    />
                    <input
                      name="maxPrice"
                      defaultValue={current.maxPrice}
                      type="number"
                      placeholder="Max"
                      className="h-10 w-full border border-black/15 bg-white px-3 text-xs text-black-deep outline-none transition focus:border-black-deep"
                    />
                  </div>
                </div>

                <input type="hidden" name="sort" value={current.sort ?? "featured"} />

                <button
                  type="submit"
                  className="mt-2 h-11 w-full bg-black-deep text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          {/* MOBILE FILTER DRAWER */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
              <div
                onClick={() => setMobileFilterOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              />
              <div className="relative z-10 flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <h3 className="font-serif text-xl tracking-[0.08em] text-black-deep">
                    Filter & Sort
                  </h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex h-8 w-8 items-center justify-center text-black/60 hover:text-black-deep"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form method="GET" action="/shop" className="mt-6 flex-1 space-y-6 overflow-y-auto pr-1">
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">
                      Search Keyword
                    </label>
                    <input
                      name="query"
                      defaultValue={current.query}
                      className="h-11 w-full border border-black/15 bg-white px-3 text-sm text-black-deep outline-none"
                      placeholder="Search..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">
                      Category
                    </label>
                    <select
                      name="category"
                      defaultValue={current.category ?? ""}
                      className="h-11 w-full border border-black/15 bg-white px-3 text-sm text-black-deep outline-none"
                    >
                      <option value="">All Categories</option>
                      {categories.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">
                      Brand
                    </label>
                    <select
                      name="brand"
                      defaultValue={current.brand ?? ""}
                      className="h-11 w-full border border-black/15 bg-white px-3 text-sm text-black-deep outline-none"
                    >
                      <option value="">All Brands</option>
                      {brands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">
                      Price Range (৳)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        name="minPrice"
                        defaultValue={current.minPrice}
                        type="number"
                        placeholder="Min"
                        className="h-11 w-full border border-black/15 bg-white px-3 text-sm outline-none"
                      />
                      <input
                        name="maxPrice"
                        defaultValue={current.maxPrice}
                        type="number"
                        placeholder="Max"
                        className="h-11 w-full border border-black/15 bg-white px-3 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">
                      Sort By
                    </label>
                    <select
                      name="sort"
                      defaultValue={current.sort ?? "featured"}
                      className="h-11 w-full border border-black/15 bg-white px-3 text-sm text-black-deep outline-none"
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest Arrivals</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>

                  <div className="space-y-3 pt-4">
                    <button
                      type="submit"
                      onClick={() => setMobileFilterOpen(false)}
                      className="h-12 w-full bg-black-deep text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold"
                    >
                      Apply Filters
                    </button>
                    <Link
                      href="/shop"
                      onClick={() => setMobileFilterOpen(false)}
                      className="block py-2 text-center text-xs uppercase tracking-[0.16em] text-black/50"
                    >
                      Reset All
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* PRODUCT GRID */}
          <main>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} showRating />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Products Match Your Criteria"
                description="Try resetting your filters or search terms to discover our luxury collections."
                actionLabel="Reset All Filters"
                actionHref="/shop"
              />
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}