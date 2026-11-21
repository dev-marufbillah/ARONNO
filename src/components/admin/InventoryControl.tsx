"use client";

import { useState } from "react";
import { updateInventoryAction } from "@/lib/admin-actions";

export default function InventoryControl({
  productId,
  stockQuantity,
}: {
  productId: string;
  stockQuantity: number;
}) {
  const [quantity, setQuantity] = useState(stockQuantity);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await updateInventoryAction(productId, quantity, "Admin stock adjustment");
    setSaving(false);
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <input
        type="number"
        min="0"
        value={quantity}
        onChange={(event) => setQuantity(Math.max(0, Number(event.target.value) || 0))}
        className="w-20 rounded-lg border border-neutral-200 px-2 py-1.5 text-right font-mono text-sm"
      />
      <button disabled={saving} onClick={() => void save()} className="rounded-lg bg-neutral-900 px-3 py-2 text-[10px] font-bold uppercase text-white disabled:opacity-50">
        {saving ? "Saving" : "Update"}
      </button>
    </div>
  );
}
