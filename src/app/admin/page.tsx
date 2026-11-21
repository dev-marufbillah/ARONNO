import { db } from "@/db";
import { orders, products, users } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import Link from "next/link";
import { DollarSign, ShoppingBag, Package, Users as UsersIcon, ArrowRight, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Aggregate Metrics
  const [totalRevenueResult] = await db
    .select({ total: sql<number>`COALESCE(SUM(${orders.total}), 0)` })
    .from(orders);

  const [totalOrdersResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders);

  const [totalProductsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products);

  const [totalCustomersResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);

  // Recent Orders
  const recentOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(5);

  // Low Stock Products
  const lowStockProducts = await db
    .select()
    .from(products)
    .where(sql`${products.stockQuantity} <= ${products.lowStockThreshold}`)
    .limit(4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif tracking-wide text-neutral-900 uppercase">Dashboard Overview</h1>
        <p className="text-xs text-neutral-500 tracking-wider font-mono mt-1">Real-time metrics & luxury store operations</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">Total Revenue</p>
            <h3 className="text-2xl font-bold font-serif text-neutral-900 mt-2">
              ৳{Number(totalRevenueResult?.total || 0).toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">Total Orders</p>
            <h3 className="text-2xl font-bold font-serif text-neutral-900 mt-2">
              {Number(totalOrdersResult?.count || 0)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">Active Products</p>
            <h3 className="text-2xl font-bold font-serif text-neutral-900 mt-2">
              {Number(totalProductsResult?.count || 0)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">Registered Customers</p>
            <h3 className="text-2xl font-bold font-serif text-neutral-900 mt-2">
              {Number(totalCustomersResult?.count || 0)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <UsersIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold tracking-wider text-neutral-900 uppercase">Recent Orders</h2>
              <p className="text-xs text-neutral-400 mt-0.5 font-mono">Latest client purchases</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#111111] hover:text-[#D4AF37] flex items-center gap-1.5 transition"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-neutral-400 py-8 text-center font-mono">No orders placed yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-neutral-900">{order.orderNumber}</p>
                    <p className="text-[11px] text-neutral-500 font-mono mt-0.5">{order.customerName} • ৳{order.total.toLocaleString()}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold tracking-widest rounded-full uppercase ${
                    order.status === "DELIVERED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : order.status === "CANCELLED"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-base font-bold tracking-wider text-neutral-900 uppercase">Low Stock Alerts</h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-bold text-[#111111] hover:text-[#D4AF37] transition"
            >
              MANAGE
            </Link>
          </div>

          <div className="divide-y divide-neutral-100 mt-2">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-neutral-400 py-8 text-center font-mono">Inventory is fully stocked.</p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="py-3.5 flex items-center justify-between">
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-bold text-neutral-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-neutral-400 font-mono uppercase">{p.brand}</p>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-50 text-rose-700 rounded border border-rose-200">
                    {p.stockQuantity} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}