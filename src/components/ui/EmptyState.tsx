import { ButtonLink } from "@/components/ui/Button";

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="border border-black/10 bg-[#fbfaf7] px-6 py-16 text-center">
      <h2 className="text-3xl text-black-deep">{title}</h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-black/60">{description}</p>
      <div className="mt-8 flex justify-center">
        <ButtonLink href={actionHref}>{actionLabel}</ButtonLink>
      </div>
    </div>
  );
}
