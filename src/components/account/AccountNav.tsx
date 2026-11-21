"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  MapPin,
  PackageCheck,
  Settings2,
  UserRound,
} from "lucide-react";

const links = [
  { href: "/account", label: "Overview", icon: UserRound },
  { href: "/account/orders", label: "My orders", icon: PackageCheck },
  { href: "/account/wishlist", label: "Saved pieces", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/settings", label: "Profile & security", icon: Settings2 },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Account navigation"
      className="rounded-2xl border border-black/8 bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-4"
    >
      <p className="px-3 pb-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
        My account
      </p>
      <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/account"
              ? pathname === link.href
              : pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-xs font-medium transition duration-200 ${
                  isActive
                    ? "bg-[#F6F1E8] text-[#76582D]"
                    : "text-black/60 hover:bg-black/[0.035] hover:text-black-deep"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-[#9A7741]"
                      : "text-black/35 group-hover:text-[#9A7741]"
                  }`}
                />
                <span>{link.label}</span>
                {isActive ? (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#C4A265]" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
