import Container from "@/components/ui/Container";
import AccountNav from "@/components/account/AccountNav";
import { requireAuth } from "@/lib/auth-helpers";
import { getOrderWithItems } from "@/lib/storefront";
import { formatCurrency, formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AccountOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  const { id } = await params;
  const data = await getOrderWithItems(id, user.id);
  if (!data) notFound();

  return (
    <Container className="py-16 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <AccountNav />
        <div>
          <h1 className="text-4xl text-black-deep">Order {data.order.orderNumber}</h1>
          <p className="mt-3 text-sm text-black/60">Placed on {formatDate(data.order.createdAt)}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="border border-black/10 p-4"><p className="text-xs uppercase tracking-[0.16em] text-black/45">Order Status</p><p className="mt-2 text-sm">{data.order.status}</p></div>
            <div className="border border-black/10 p-4"><p className="text-xs uppercase tracking-[0.16em] text-black/45">Payment</p><p className="mt-2 text-sm">{data.order.paymentStatus}</p></div>
            <div className="border border-black/10 p-4"><p className="text-xs uppercase tracking-[0.16em] text-black/45">Total</p><p className="mt-2 text-sm">{formatCurrency(data.order.total)}</p></div>
          </div>
          <div className="mt-8 space-y-4">
            {data.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 border border-black/10 p-4 text-sm">
                <div>
                  <p className="font-medium text-black-deep">{item.productName}</p>
                  <p className="text-black/50">Qty {item.quantity}</p>
                </div>
                <p>{formatCurrency(item.totalPrice)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
