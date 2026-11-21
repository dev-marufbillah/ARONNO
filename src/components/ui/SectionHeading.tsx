import type { ReactNode } from "react";

export default function SectionHeading({
  label,
  title,
  action,
}: {
  label?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {label ? (
          <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-gold">{label}</p>
        ) : null}
        <h2 className="text-3xl font-medium uppercase tracking-[0.06em] text-black-deep md:text-4xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
