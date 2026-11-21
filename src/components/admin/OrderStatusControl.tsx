"use client";

import { useState } from "react";
import { updateOrderStatusAction } from "@/lib/admin-actions";

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export default function OrderStatusControl({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}) {
  const [orderStatus, setOrderStatus] = useState(status);
  const [payment, setPayment] = useState(paymentStatus);

  async function update(nextOrderStatus = orderStatus, nextPaymentStatus = payment) {
    await updateOrderStatusAction(orderId, nextOrderStatus, nextPaymentStatus);
  }

  return (
    <div className="flex flex-col gap-2">
      <select value={orderStatus} onChange={(event) => { const value = event.target.value as OrderStatus; setOrderStatus(value); void update(value, payment); }} className="rounded-lg border border-neutral-200 px-2 py-1.5 text-[10px] font-bold uppercase">
        {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
      <select value={payment} onChange={(event) => { const value = event.target.value as PaymentStatus; setPayment(value); void update(orderStatus, value); }} className="rounded-lg border border-neutral-200 px-2 py-1.5 text-[10px] font-bold uppercase">
        {["PENDING", "PAID", "FAILED", "REFUNDED"].map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
    </div>
  );
}
