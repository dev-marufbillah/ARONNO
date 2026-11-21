import Link from "next/link";
import {
  ArrowRight,
  Heart,
  MapPin,
  PackageCheck,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Container from "@/components/ui/Container";
import AccountNav from "@/components/account/AccountNav";
import LogoutButton from "@/components/account/LogoutButton";
import MotionReveal from "@/components/ui/MotionReveal";
import { requireAuth } from "@/lib/auth-helpers";
import { getOrdersByUser, getWishlistProducts } from "@/lib/storefront";

export const dynamic = "force-dynamic";

const orderStatusClasses: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800 ring-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-800 ring-blue-200",
  PROCESSING: "bg-violet-50 text-violet-800 ring-violet-200",
  SHIPPED: "bg-cyan-50 text-cyan-800 ring-cyan-200",
  DELIVERED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-800 ring-rose-200",
};

export default async function AccountPage() {
  const user = await requireAuth();
  const [orders, wishlist] = await Promise.all([
    getOrdersByUser(user.id),
    getWishlistProducts(user.id),
  ]);
  const firstName = user.name.trim().split(/\s+/)[0] || "there";
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const roleLabel = user.isSuperAdmin
    ? "Super Admin"
    : user.role === "ADMIN"
      ? "Administrator"
      : "Customer";

  return (
    <Container className="py-10 sm:py-14 lg:py-16">
      <MotionReveal>
        <section className="relative isolate overflow-hidden rounded-3xl bg-[#171613] px-6 py-8 text-white shadow-[0_24px_70px_rgba(23,22,19,0.16)] sm:px-9 sm:py-10 lg:px-12">
          <div className="pointer-events-none absolute -right-20 -top-32 -z-10 h-80 w-80 rounded-full bg-[#C4A265]/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 -z-10 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#C4A265]/35 bg-[#C4A265]/15 font-serif text-2xl text-[#E6C98E] shadow-inner sm:h-20 sm:w-20 sm:text-3xl">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D9BB82]">
                    Your ARONNO account
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/75">
                    <ShieldCheck className="h-3 w-3 text-[#D9BB82]" />
                    {roleLabel}
                  </span>
                </div>
                <h1 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                  Welcome back, {firstName}.
                </h1>
                <p className="mt-2 truncate text-sm text-white/60">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#C4A265]/60 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#E6C98E] transition hover:bg-[#C4A265] hover:text-[#171613]"
                >
                  Admin workspace <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              <LogoutButton />
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-white/55">
            <Sparkles className="h-4 w-4 text-[#D9BB82]" />
            Your orders, saved pieces and personal details—together in one place.
          </div>
        </section>
      </MotionReveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        <MotionReveal delay={0.05}>
          <AccountNav />
        </MotionReveal>

        <div className="min-w-0 space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <MotionReveal delay={0.08}>
              <Link
                href="/account/orders"
                className="group flex min-h-36 items-start justify-between rounded-2xl border border-black/8 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#C4A265]/50 hover:shadow-[0_18px_38px_rgba(0,0,0,0.08)] sm:p-6"
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                    Orders placed
                  </p>
                  <p className="mt-4 font-serif text-4xl text-black-deep">{orders.length}</p>
                  <p className="mt-2 text-xs text-black/45">View your order history</p>
                </div>
                <span className="rounded-xl bg-[#F6F1E8] p-3 text-[#9A7741] transition group-hover:bg-[#C4A265] group-hover:text-white">
                  <ShoppingBag className="h-5 w-5" />
                </span>
              </Link>
            </MotionReveal>
            <MotionReveal delay={0.14}>
              <Link
                href="/account/wishlist"
                className="group flex min-h-36 items-start justify-between rounded-2xl border border-black/8 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#C4A265]/50 hover:shadow-[0_18px_38px_rgba(0,0,0,0.08)] sm:p-6"
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                    Saved pieces
                  </p>
                  <p className="mt-4 font-serif text-4xl text-black-deep">{wishlist.length}</p>
                  <p className="mt-2 text-xs text-black/45">Your personal shortlist</p>
                </div>
                <span className="rounded-xl bg-rose-50 p-3 text-rose-700 transition group-hover:bg-rose-600 group-hover:text-white">
                  <Heart className="h-5 w-5" />
                </span>
              </Link>
            </MotionReveal>
            <MotionReveal delay={0.2}>
              <Link
                href="/account/settings"
                className="group flex min-h-36 items-start justify-between rounded-2xl border border-black/8 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#C4A265]/50 hover:shadow-[0_18px_38px_rgba(0,0,0,0.08)] sm:p-6"
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                    Account
                  </p>
                  <p className="mt-4 font-serif text-2xl text-black-deep">{roleLabel}</p>
                  <p className="mt-2 text-xs text-black/45">Review profile and security</p>
                </div>
                <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                  <ShieldCheck className="h-5 w-5" />
                </span>
              </Link>
            </MotionReveal>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(250px,0.8fr)]">
            <MotionReveal delay={0.12}>
              <section className="h-full rounded-2xl border border-black/8 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-7">
                <div className="flex items-start justify-between gap-4 border-b border-black/7 pb-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A7741]">
                      Your activity
                    </p>
                    <h2 className="mt-2 font-serif text-2xl text-black-deep">Recent orders</h2>
                  </div>
                  <Link
                    href="/account/orders"
                    className="inline-flex items-center gap-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-black/55 transition hover:text-[#9A7741]"
                  >
                    All orders <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                {orders.length ? (
                  <ul className="divide-y divide-black/7">
                    {orders.slice(0, 3).map((order) => (
                      <li key={order.id}>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="flex flex-wrap items-center justify-between gap-3 py-4 transition hover:bg-[#FBFAF7]"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="rounded-xl bg-[#F6F1E8] p-2.5 text-[#9A7741]">
                              <PackageCheck className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-black-deep">
                                {order.orderNumber}
                              </span>
                              <span className="mt-1 block text-xs text-black/45">
                                {new Intl.DateTimeFormat("en-BD", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }).format(new Date(order.createdAt))}
                              </span>
                            </span>
                          </div>
                          <span className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ring-1 ring-inset ${
                                orderStatusClasses[order.status] ?? "bg-neutral-50 text-neutral-700 ring-neutral-200"
                              }`}
                            >
                              {order.status.toLowerCase()}
                            </span>
                            <span className="text-sm font-semibold text-black-deep">
                              ৳{order.total.toLocaleString("en-BD")}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex min-h-44 flex-col items-center justify-center py-8 text-center">
                    <span className="rounded-2xl bg-[#F6F1E8] p-3 text-[#9A7741]">
                      <ShoppingBag className="h-5 w-5" />
                    </span>
                    <p className="mt-4 text-sm font-semibold text-black-deep">Your story starts here.</p>
                    <p className="mt-1 max-w-xs text-xs leading-5 text-black/50">
                      When you place an order, its progress will appear here.
                    </p>
                    <Link
                      href="/shop"
                      className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#9A7741] hover:text-black"
                    >
                      Explore the collection <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </section>
            </MotionReveal>

            <MotionReveal delay={0.18}>
              <section className="h-full rounded-2xl border border-black/8 bg-[#FBFAF7] p-5 sm:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A7741]">
                  Quick access
                </p>
                <h2 className="mt-2 font-serif text-2xl text-black-deep">Make it yours</h2>
                <p className="mt-2 text-xs leading-5 text-black/50">
                  Keep your details current for a smoother checkout.
                </p>
                <div className="mt-6 space-y-2">
                  <Link
                    href="/account/settings"
                    className="group flex items-center justify-between rounded-xl border border-black/7 bg-white px-4 py-3.5 text-sm text-black/75 transition hover:border-[#C4A265]/50 hover:text-black"
                  >
                    <span className="flex items-center gap-3">
                      <Settings2 className="h-4 w-4 text-[#9A7741]" />
                      Profile & security
                    </span>
                    <ArrowRight className="h-4 w-4 text-black/30 transition group-hover:translate-x-1 group-hover:text-[#9A7741]" />
                  </Link>
                  <Link
                    href="/account/addresses"
                    className="group flex items-center justify-between rounded-xl border border-black/7 bg-white px-4 py-3.5 text-sm text-black/75 transition hover:border-[#C4A265]/50 hover:text-black"
                  >
                    <span className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-[#9A7741]" />
                      Delivery addresses
                    </span>
                    <ArrowRight className="h-4 w-4 text-black/30 transition group-hover:translate-x-1 group-hover:text-[#9A7741]" />
                  </Link>
                </div>
                <div className="mt-5 border-t border-black/8 pt-4 text-[11px] leading-5 text-black/45">
                  Your account details are protected and only used to support your orders.
                </div>
              </section>
            </MotionReveal>
          </div>
        </div>
      </div>
    </Container>
  );
}
