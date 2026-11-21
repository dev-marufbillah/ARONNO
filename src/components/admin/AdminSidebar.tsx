"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Boxes,
  ArrowUpRight,
  FileText,
  TicketPercent,
  CreditCard,
  UsersRound,
  UserRound,
} from "lucide-react";

export default function AdminSidebar({
  user,
}: {
  user: { name: string; email: string; isSuperAdmin: boolean };
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "DASHBOARD", href: "/admin", icon: LayoutDashboard },
    { label: "PRODUCTS", href: "/admin/products", icon: Package },
    { label: "CATEGORIES", href: "/admin/categories", icon: FolderTree },
    { label: "ORDERS", href: "/admin/orders", icon: ShoppingBag },
    { label: "INVENTORY", href: "/admin/inventory", icon: Boxes },
    { label: "SITE CMS", href: "/admin/cms", icon: FileText },
    { label: "COUPONS", href: "/admin/coupons", icon: TicketPercent },
    { label: "PAYMENTS", href: "/admin/settings", icon: CreditCard },
    ...(user.isSuperAdmin ? [{ label: "TEAM ACCESS", href: "/admin/team", icon: UsersRound }] : []),
  ];

  return (
    <aside className="w-full bg-[#111111] text-white rounded-2xl p-5 shadow-2xl border border-neutral-800 flex flex-col justify-between min-h-[calc(100vh-5rem)] sticky top-6">
      <div className="space-y-8">
        <div className="px-3 pt-2">
          <p className="text-[10px] tracking-[0.3em] font-mono uppercase text-neutral-500">MANAGEMENT</p>
          <h2 className="text-xl font-serif text-white tracking-widest mt-1 uppercase">ARONNO</h2>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[11px] font-bold tracking-widest transition-all duration-200 ${
                  isActive
                    ? "bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/20 shadow-lg"
                    : "text-neutral-500 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#D4AF37]" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-neutral-800/80">
        <div className="mb-5 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
            <UserRound className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">{user.name}</p>
            <p className="truncate text-[10px] text-neutral-500">{user.email}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
              {user.isSuperAdmin ? "Super Admin" : "Admin"}
            </p>
          </div>
        </div>
        <Link
          href="/account/settings"
          className="mb-3 block rounded-xl border border-neutral-800 px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 transition hover:border-[#D4AF37]/40 hover:text-white"
        >
          My Profile
        </Link>
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-bold tracking-widest text-neutral-500 hover:text-white bg-neutral-900/40 border border-neutral-800 transition"
        >
          <span>LIVE STORE</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}