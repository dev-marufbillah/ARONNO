"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  return (
    <div className="inline-flex items-center border border-black/10">
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} className="flex h-11 w-11 items-center justify-center">
        <Minus size={16} />
      </button>
      <div className="flex h-11 min-w-12 items-center justify-center px-4 text-sm">{value}</div>
      <button type="button" onClick={() => onChange(value + 1)} className="flex h-11 w-11 items-center justify-center">
        <Plus size={16} />
      </button>
    </div>
  );
}
