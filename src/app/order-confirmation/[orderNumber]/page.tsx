import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!order) notFound();

  return (
    <Container className="py-16 md:py-20">
      <div className="mx-auto max-w-2xl border border-black/10 bg-[#fbfaf7] p-8 text-center md:p-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Order Confirmed</p>
        <h1 className="mt-4 text-4xl text-black-deep">Thank you for shopping with ARONNO</h1>
        <p className="mt-4 text-sm leading-7 text-black/60">Your order has been placed successfully and our team will begin processing it shortly.</p>
        <div className="mt-8 grid gap-4 text-left md:grid-cols-2">
          <div className="border border-black/10 p-4"><p className="text-xs uppercase tracking-[0.16em] text-black/45">Order Number</p><p className="mt-2 text-sm text-black-deep">{order.orderNumber}</p></div>
          <div className="border border-black/10 p-4"><p className="text-xs uppercase tracking-[0.16em] text-black/45">Total</p><p className="mt-2 text-sm text-black-deep">{formatCurrency(order.total)}</p></div>
          <div className="border border-black/10 p-4"><p className="text-xs uppercase tracking-[0.16em] text-black/45">Payment Method</p><p className="mt-2 text-sm text-black-deep">{order.paymentMethod}</p></div>
          <div className="border border-black/10 p-4"><p className="text-xs uppercase tracking-[0.16em] text-black/45">Placed On</p><p className="mt-2 text-sm text-black-deep">{formatDate(order.createdAt)}</p></div>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <ButtonLink href="/account/orders">Track Orders</ButtonLink>
          <ButtonLink href="/shop" variant="secondary">Continue Shopping</ButtonLink>
        </div>
      </div>
    </Container>
  );
}
