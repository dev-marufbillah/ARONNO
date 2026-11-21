import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ShoppingBag, Eye, Calendar, User, Phone } from "lucide-react";
import OrderStatusControl from "@/components/admin/OrderStatusControl";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orderList = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif tracking-wide text-neutral-900 uppercase">Orders Management</h1>
        <p className="text-xs text-neutral-500 tracking-wider font-mono mt-1">Review, process & fulfill luxury customer orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 uppercase tracking-widest font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {orderList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-neutral-400 font-mono">
                    No orders have been recorded yet.
                  </td>
                </tr>
              ) : (
                orderList.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3.5 px-4 font-bold font-mono text-neutral-900">{order.orderNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-neutral-800">{order.customerName}</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-500">{order.phoneNumber}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] uppercase">
                      {order.paymentMethod}
                      <span className={`block text-[9px] font-bold ${order.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600"}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold font-serif text-neutral-900">৳{order.total.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <OrderStatusControl orderId={order.id} status={order.status} paymentStatus={order.paymentStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-neutral-400 text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}