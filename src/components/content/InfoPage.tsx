import Container from "@/components/ui/Container";

export default function InfoPage({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <Container className="py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{label}</p>
        <h1 className="mt-4 text-4xl text-black-deep md:text-5xl">{title}</h1>
        <p className="mt-6 text-base leading-8 text-black/65">{description}</p>
      </div>
    </Container>
  );
}
