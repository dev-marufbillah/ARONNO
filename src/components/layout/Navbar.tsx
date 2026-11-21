"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import MobileMenu from "./MobileMenu";
import { useStore } from "@/components/providers/StoreProvider";
import { authClient } from "@/lib/auth-client";

const emptySubscribe = () => () => {};

export default function Navbar({
  brandName = BRAND.name,
  tagline = BRAND.tagline,
  navLinks = NAV_LINKS,
}: {
  brandName?: string;
  tagline?: string;
  navLinks?: ReadonlyArray<{ label: string; href: string; image: string }>;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { cartCount } = useStore();
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const desktopInputRef = useRef<HTMLInputElement>(null);

  // ✅ শুধু আসল ADMIN ইউজার হলেই Atelier বাটন দেখতে পারবে
  const userRole = session?.user.role;
  const isAdmin = isClient && userRole === "ADMIN";

  useEffect(() => {
    if (desktopSearchOpen) {
      const t = setTimeout(() => desktopInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [desktopSearchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDesktopSearchOpen(false);
        setCollectionsOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    setDesktopSearchOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/shop") return pathname === "/shop";
    return pathname === href || pathname.startsWith(href + "/");
  };
  const primaryLinks = navLinks.filter(
    (link) => link.href === "/shop" || link.href === "/new-arrivals",
  );
  const collectionLinks = navLinks.filter((link) => link.href.startsWith("/category/"));

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
        {/* ========================================================= */}
        {/* 📱 1. MOBILE HEADER (মোবাইলে সেন্টার্ড লোগো + সার্চ বার)   */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:hidden">
          {/* Row 1: Brand Logo Centered + Left Menu + Right Atelier */}
          <div className="relative flex h-14 w-full items-center justify-between px-4">
            {/* Left: Menu Drawer Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-800 transition-colors hover:bg-neutral-100"
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>

            {/* Center: Stylish Centered Brand Name */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 text-center"
              aria-label={brandName}
            >
              <span className="font-serif text-[23px] font-semibold tracking-[0.24em] text-neutral-900 uppercase">
                {brandName}
              </span>
            </Link>

            {/* Right: Atelier Button — PC-র মতো হুবহু একই লুক, শুধু Admin লগইন করলে আসবে */}
            <div className="flex items-center">
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="border border-[#C4A265] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#C4A265] transition-all hover:bg-[#C4A265] hover:text-white"
                >
                  Atelier
                </Link>
              ) : (
                <div className="w-9" />
              )}
            </div>
          </div>

          {/* Row 2: Stylish Full-Width Luxury Search Bar */}
          <div className="px-4 pb-3 pt-0.5">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search luxury perfumes, watches, bags..."
                className="w-full rounded-full border border-neutral-200/90 bg-[#F7F7F6] py-2.5 pl-10 pr-9 text-xs text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-[#C4A265] focus:bg-white focus:shadow-[0_2px_12px_rgba(196,162,101,0.12)]"
              />
              <Search
                size={16}
                strokeWidth={1.75}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              {query.trim() && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                >
                  <X size={15} />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 💻 2. DESKTOP HEADER (ডেস্কটপ / ল্যাপটপ ভিউ)            */}
        {/* ========================================================= */}
        <div className="relative mx-auto hidden h-[76px] w-full max-w-[1600px] grid-cols-[minmax(150px,1fr)_auto_minmax(190px,1fr)] items-center gap-5 px-6 lg:grid xl:gap-8 xl:px-10 2xl:px-14">
          {/* LEFT — Logo */}
          <div className="flex min-w-0 items-center">
            <Link href="/" aria-label={BRAND.name}>
              <span className="whitespace-nowrap font-serif text-[27px] font-semibold tracking-[0.14em] text-black xl:text-[29px]">
                {brandName}
              </span>
            </Link>
          </div>

          {/* CENTER — concise primary navigation and category menu */}
          <div className="flex h-full min-w-0 items-center justify-center gap-4 xl:gap-7">
            {primaryLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <div key={link.href} className="group relative flex h-full items-center">
                  <Link
                    href={link.href}
                    className={`relative flex h-full items-center whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-200 xl:text-xs ${
                      active ? "text-neutral-950" : "text-neutral-600 hover:text-neutral-950"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-[#C4A265] transition-all duration-200 ${
                        active ? "w-full opacity-100" : "w-full opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </Link>
                </div>
              );
            })}

            {collectionLinks.length > 0 && (
              <div
                className="relative flex h-full items-center"
                onMouseEnter={() => setCollectionsOpen(true)}
                onMouseLeave={() => setCollectionsOpen(false)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setCollectionsOpen(false);
                  }
                }}
              >
                <button
                  type="button"
                  aria-expanded={collectionsOpen}
                  aria-controls="collections-dropdown"
                  onClick={() => setCollectionsOpen(true)}
                  onFocus={() => setCollectionsOpen(true)}
                  className={`flex h-full cursor-pointer items-center gap-1.5 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.12em] transition-colors hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#C4A265] xl:text-xs ${
                    collectionLinks.some((link) => isActive(link.href))
                      ? "text-neutral-950"
                      : "text-neutral-600"
                  }`}
                >
                  Collections
                  <ChevronDown
                    size={14}
                    strokeWidth={1.6}
                    className={`transition-transform ${collectionsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {collectionsOpen && (
                  <div
                    id="collections-dropdown"
                    className="absolute left-1/2 top-full z-[100] w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 border border-neutral-200 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
                  >
                    <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                        Shop by category
                      </p>
                      <Link
                        href="/shop"
                        className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9B7840] hover:text-black"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                      {collectionLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`border-b border-neutral-100 py-3 text-sm transition-colors hover:text-[#9B7840] ${
                            isActive(link.href) ? "font-medium text-[#9B7840]" : "text-neutral-700"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Link
              href="/our-story"
              className={`whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.12em] transition-colors hover:text-neutral-950 xl:text-xs ${
                isActive("/our-story") ? "text-neutral-950" : "text-neutral-600"
              }`}
            >
              Our Story
            </Link>
          </div>

          {/* RIGHT — Search, account, wishlist and bag */}
          <div className="flex min-w-0 items-center justify-end gap-1 xl:gap-2">
            <button
              type="button"
              onClick={() => setDesktopSearchOpen((open) => !open)}
              className="flex h-10 w-10 shrink-0 items-center justify-center text-neutral-600 transition-colors hover:text-black"
              aria-label={desktopSearchOpen ? "Close search" : "Open search"}
              aria-expanded={desktopSearchOpen}
            >
              {desktopSearchOpen ? <X size={19} strokeWidth={1.5} /> : <Search size={19} strokeWidth={1.5} />}
            </button>

            {/* Atelier Admin Button (Desktop) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden shrink-0 items-center justify-center border border-[#C4A265] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B7840] transition-all hover:bg-[#C4A265] hover:text-white xl:inline-flex"
              >
                Atelier
              </Link>
            )}

            {/* Account Icon */}
            <Link
              href="/account"
              className="flex h-10 w-10 shrink-0 items-center justify-center text-neutral-600 transition-colors hover:text-black"
              aria-label="Account"
            >
              <User size={19} strokeWidth={1.5} />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="flex h-10 w-10 shrink-0 items-center justify-center text-neutral-600 transition-colors hover:text-black"
              aria-label="Wishlist"
            >
              <Heart size={19} strokeWidth={1.5} />
            </Link>

            {/* Cart Bag Icon */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center text-neutral-600 transition-colors hover:text-black"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {isClient && cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C4A265] px-1 text-[9px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {desktopSearchOpen && (
            <form
              onSubmit={handleSearchSubmit}
              className="absolute right-6 top-[calc(100%+0.5rem)] z-[110] flex w-[min(360px,calc(100vw-2rem))] items-center gap-3 border border-neutral-200 bg-white px-4 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.14)] xl:right-10"
            >
              <Search size={17} strokeWidth={1.5} className="shrink-0 text-neutral-400" />
              <input
                ref={desktopInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9B7840] hover:text-black"
              >
                Search
              </button>
            </form>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        brandName={brandName}
        tagline={tagline}
        navLinks={navLinks}
      />
    </>
  );
}