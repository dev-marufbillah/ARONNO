"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Categories", icon: LayoutGrid },
  { href: "/cart", label: "Bag", icon: ShoppingBag, isCenter: true },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account", label: "Account", icon: User },
];

export default function MobileBottomNav() {
  const { cartCount } = useStore();
  const pathname = usePathname();

  // Admin প্যানেলে এটি হাইড থাকবে
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200/80 bg-white/95 pb-[env(safe-area-inset-bottom,4px)] pt-1.5 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="grid grid-cols-5 items-center justify-items-center px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          // 🛍️ মাঝখানের Bag Button (বড় এবং উচু করা ভাসমান বাটন)
          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mt-5 flex flex-col items-center justify-center"
              >
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
                    isActive
                      ? "bg-[#C4A265] text-white ring-4 ring-[#C4A265]/20 scale-105"
                      : "bg-black text-white hover:bg-[#C4A265]"
                  }`}
                >
                  <Icon size={21} strokeWidth={2} />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C4A265] px-1 text-[9px] font-bold text-white ring-2 ring-white shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span
                  className={`mt-1 text-[9px] font-bold tracking-tight uppercase ${
                    isActive ? "text-[#C4A265]" : "text-neutral-900"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          // সাধারণ অন্যান্য বাটনগুলো
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex w-full flex-col items-center justify-center gap-1 py-1 transition-colors duration-200 ${
                isActive ? "text-[#C4A265]" : "text-neutral-500 hover:text-black"
              }`}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <span className="absolute -top-1.5 h-[2px] w-6 rounded-full bg-[#C4A265]" />
              )}

              <Icon size={19} strokeWidth={isActive ? 2 : 1.5} />

              <span className="text-[9px] font-medium tracking-tight uppercase leading-none whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}