import { Star } from "lucide-react";

export default function Rating({ value, reviewCount }: { value: number; reviewCount?: number }) {
  return (
    <div className="flex items-center gap-1.5 text-gold">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={14} fill={index < Math.round(value) ? "currentColor" : "none"} />
      ))}
      <span className="ml-1 text-xs text-black/55">
        ({value.toFixed(1)}){reviewCount ? ` · ${reviewCount} Reviews` : ""}
      </span>
    </div>
  );
}
