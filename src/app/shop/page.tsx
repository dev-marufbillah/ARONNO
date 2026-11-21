import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { getCategories } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export default async function ShopLandingPage() {
  const categories = await getCategories();

  return (
    <Container className="py-16 md:py-20">
      <header className="mb-12 text-center">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#C4A265]">ARONNO Collections</p>
        <h1 className="mt-3 font-serif text-4xl uppercase tracking-widest text-neutral-900 md:text-5xl">Explore Collections</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-500">
          Discover our curated selection of luxury goods across every category.
        </p>
        <Link href="/search" className="mt-7 inline-flex bg-neutral-900 px-7 py-3 text-xs font-bold tracking-[0.18em] text-white transition hover:bg-neutral-700">
          SHOP ALL PRODUCTS
        </Link>
      </header>

      {categories.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-neutral-100">
              {category.imageUrl ? (
                <Image src={category.imageUrl} alt={category.name} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-colors group-hover:from-black/80" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">Explore collection</p>
                <h2 className="mt-2 font-serif text-2xl uppercase tracking-wide">{category.name}</h2>
                {category.description ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/75">{category.description}</p> : null}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-neutral-300 py-16 text-center text-sm text-neutral-500">
          No active collections yet. Please check back soon.
        </div>
      )}
    </Container>
  );
}
