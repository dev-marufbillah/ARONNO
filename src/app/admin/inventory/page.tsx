import { db } from "@/db";
import { products } from "@/db/schema";
import { asc } from "drizzle-orm";
import { Boxes, AlertTriangle } from "lucide-react";
import InventoryControl from "@/components/admin/InventoryControl";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const stockList = await db
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      stockQuantity: products.stockQuantity,
      lowStockThreshold: products.lowStockThreshold,
    })
    .from(products)
    .orderBy(asc(products.stockQuantity));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif tracking-wide text-neutral-900 uppercase">Inventory & Stock</h1>
        <p className="text-xs text-neutral-500 tracking-wider font-mono mt-1">Real-time stock threshold tracking & replenishment</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 uppercase tracking-widest font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Threshold Alert</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {stockList.map((item) => {
                const isLow = item.stockQuantity <= item.lowStockThreshold;
                return (
                  <tr key={item.id} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-neutral-900">{item.name}</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-500">{item.brand}</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-500">{item.lowStockThreshold} units</td>
                    <td className="py-3.5 px-4">
                      <InventoryControl productId={item.id} stockQuantity={item.stockQuantity} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-widest rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          LOW STOCK
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          IN STOCK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}