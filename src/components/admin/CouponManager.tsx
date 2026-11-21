"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Plus, Tag, Trash2, X } from "lucide-react";
import { deleteCouponAction, saveCouponAction } from "@/lib/admin-actions";

type CouponRow = {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minimumOrder: number;
  expiresAt: Date | null;
  expired: boolean;
  usageLimit: number | null;
  isActive: boolean;
  usedCount: number;
};

type CouponDraft = {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minimumOrder: number;
  expiresAt: string;
  usageLimit: number | null;
  isActive: boolean;
};

const blankCoupon: CouponDraft = {
  code: "",
  type: "PERCENTAGE",
  value: 10,
  minimumOrder: 0,
  expiresAt: "",
  usageLimit: null,
  isActive: true,
};
const inputClass = "w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#C4A265] focus:ring-2 focus:ring-[#C4A265]/10";
const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500";

function toLocalDateTime(value: Date | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

export default function CouponManager({
  coupons,
}: {
  coupons: CouponRow[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CouponRow | null>(null);
  const [draft, setDraft] = useState(blankCoupon);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function openForm(coupon?: CouponRow) {
    setEditing(coupon ?? null);
    setDraft(coupon ? {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minimumOrder: coupon.minimumOrder,
      expiresAt: toLocalDateTime(coupon.expiresAt),
      usageLimit: coupon.usageLimit,
      isActive: coupon.isActive,
    } : blankCoupon);
    setError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setError("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const result = await saveCouponAction({
      ...draft,
      id: editing?.id,
      code: draft.code.toUpperCase().trim(),
      expiresAt: draft.expiresAt || null,
    });
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Could not save coupon.");
      return;
    }
    closeForm();
    router.refresh();
  }

  async function remove(coupon: CouponRow) {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;
    const result = await deleteCouponAction(coupon.id);
    if (!result.success) {
      setError(result.error ?? "Could not delete coupon.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {error && !formOpen ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">{coupons.length} discount codes</p>
        <button type="button" onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold tracking-widest text-white hover:bg-neutral-700"><Plus className="h-4 w-4 text-[#D4AF37]" /> CREATE COUPON</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b border-neutral-100 bg-neutral-50 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Minimum spend</th><th className="px-4 py-3">Usage</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {coupons.map((coupon) => {
                const expired = coupon.expired;
                const exhausted = coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit;
                return (
                  <tr key={coupon.id} className="hover:bg-neutral-50/60">
                    <td className="px-4 py-4"><span className="inline-flex items-center gap-2 font-mono font-bold tracking-wider text-neutral-900"><Tag className="h-3.5 w-3.5 text-[#C4A265]" />{coupon.code}</span>{coupon.expiresAt ? <span className="mt-1 block pl-5 text-[10px] text-neutral-400">Expires {new Date(coupon.expiresAt).toLocaleDateString()}</span> : null}</td>
                    <td className="px-4 py-4 font-semibold">{coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `৳${coupon.value.toLocaleString("en-BD")}`}</td>
                    <td className="px-4 py-4">৳{coupon.minimumOrder.toLocaleString("en-BD")}</td>
                    <td className="px-4 py-4">{coupon.usedCount}{coupon.usageLimit === null ? " / ∞" : ` / ${coupon.usageLimit}`}</td>
                    <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${!coupon.isActive || expired || exhausted ? "bg-neutral-100 text-neutral-500" : "bg-emerald-50 text-emerald-700"}`}>{!coupon.isActive ? "Disabled" : expired ? "Expired" : exhausted ? "Limit reached" : "Active"}</span></td>
                    <td className="px-4 py-4 text-right"><button type="button" onClick={() => openForm(coupon)} title="Edit coupon" className="mr-1 rounded-lg p-2 text-neutral-500 hover:bg-amber-50 hover:text-amber-700"><Edit2 className="h-4 w-4" /></button><button type="button" onClick={() => void remove(coupon)} title="Delete coupon" className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                );
              })}
              {coupons.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-sm text-neutral-400">No coupons yet. Create a discount code for your customers.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/55 p-3 sm:p-6">
          <form onSubmit={submit} className="mx-auto my-6 w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4"><div><h2 className="font-serif text-xl text-neutral-900">{editing ? "Edit coupon" : "Create coupon"}</h2><p className="mt-1 text-xs text-neutral-500">Set discount value, minimum spend and limits.</p></div><button type="button" onClick={closeForm} aria-label="Close" className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"><X className="h-5 w-5" /></button></div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className={labelClass}>Coupon code</span><input className={inputClass} required minLength={3} maxLength={40} value={draft.code} onChange={(event) => setDraft({ ...draft, code: event.target.value.toUpperCase().replace(/\s/g, "") })} placeholder="WELCOME10" /></label>
              <label><span className={labelClass}>Discount type</span><select className={inputClass} value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as CouponDraft["type"] })}><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed amount</option></select></label>
              <label><span className={labelClass}>{draft.type === "PERCENTAGE" ? "Percent off" : "Amount off (৳)"}</span><input className={inputClass} type="number" min="1" max={draft.type === "PERCENTAGE" ? 100 : undefined} step="1" required value={draft.value} onChange={(event) => setDraft({ ...draft, value: Number(event.target.value) })} /></label>
              <label><span className={labelClass}>Minimum order (৳)</span><input className={inputClass} type="number" min="0" step="1" value={draft.minimumOrder} onChange={(event) => setDraft({ ...draft, minimumOrder: Number(event.target.value) })} /></label>
              <label><span className={labelClass}>Usage limit (blank = unlimited)</span><input className={inputClass} type="number" min="1" step="1" value={draft.usageLimit ?? ""} onChange={(event) => setDraft({ ...draft, usageLimit: event.target.value ? Number(event.target.value) : null })} /></label>
              <label className="sm:col-span-2"><span className={labelClass}>Expires at (optional)</span><input className={inputClass} type="datetime-local" value={draft.expiresAt} onChange={(event) => setDraft({ ...draft, expiresAt: event.target.value })} /></label>
              <label className="inline-flex items-center gap-2 text-sm text-neutral-700 sm:col-span-2"><input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} className="accent-[#C4A265]" /> Coupon is active</label>
            </div>
            {error ? <p role="alert" className="mx-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
            <div className="flex justify-end gap-3 border-t border-neutral-100 px-5 py-4"><button type="button" onClick={closeForm} className="rounded-lg px-4 py-2.5 text-xs font-bold uppercase text-neutral-500 hover:bg-neutral-100">Cancel</button><button disabled={saving} className="rounded-lg bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50">{saving ? "Saving..." : editing ? "Save changes" : "Create coupon"}</button></div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
