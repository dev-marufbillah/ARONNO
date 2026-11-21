import Link from "next/link";
import { ArrowRight, Home, SearchX } from "lucide-react";
import MotionReveal from "@/components/ui/MotionReveal";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#11110F] px-5 py-20 text-[#F8F5EE]">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#C4A265]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#C4A265]/10 blur-3xl" />
      <MotionReveal className="relative w-full max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#C4A265]/35 bg-white/[0.03] text-[#D4B77E]">
          <SearchX className="h-7 w-7" strokeWidth={1.4} />
        </div>
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4B77E]">
          The page has left the collection
        </p>
        <p className="mt-3 font-serif text-7xl leading-none text-[#C4A265] sm:text-8xl">404</p>
        <h1 className="mt-5 font-serif text-3xl sm:text-4xl">We couldn&apos;t find that page</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/60 sm:text-base">
          The link may be incorrect, or this piece may have moved. Explore the collection to find something you love.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#C4A265] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#11110F] transition hover:bg-[#D8BD8D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C4A265]"
          >
            <Home className="h-4 w-4" /> Back to home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:border-[#C4A265] hover:text-[#D4B77E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C4A265]"
          >
            Browse the shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </MotionReveal>
    </section>
  );
}
