import Link from "next/link";
import Container from "@/components/ui/Container";
import AccountNav from "@/components/account/AccountNav";
import EmptyState from "@/components/ui/EmptyState";
import { requireAuth } from "@/lib/auth-helpers";
import { getOrdersByUser } from "@/lib/storefront";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const user = await requireAuth();
  const orders = await getOrdersByUser(user.id);

  return (
    <Container className="py-16 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <AccountNav />
        <div>
          <h1 className="text-4xl text-black-deep">Orders</h1>
          {orders.length ? (
            <div className="mt-8 space-y-4">
              {orders.map((order) => (
                <Link key={order.id} href={`/account/orders/${order.id}`} className="grid gap-3 border border-black/10 bg-[#fbfaf7] p-5 md:grid-cols-5">
                  <div><p className="text-xs uppercase tracking-[0.16em] text-black/45">Order</p><p className="mt-2 text-sm text-black-deep">{order.orderNumber}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.16em] text-black/45">Date</p><p className="mt-2 text-sm text-black-deep">{formatDate(order.createdAt)}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.16em] text-black/45">Status</p><p className="mt-2 text-sm text-black-deep">{order.status}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.16em] text-black/45">Payment</p><p className="mt-2 text-sm text-black-deep">{order.paymentStatus}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.16em] text-black/45">Total</p><p className="mt-2 text-sm text-black-deep">{formatCurrency(order.total)}</p></div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState title="No orders yet" description="When you place an order, it will appear here with elegant order tracking." actionLabel="Start Shopping" actionHref="/shop" />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
