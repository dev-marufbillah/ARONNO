export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-[60vh] items-center justify-center px-5 py-20"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#C4A265]/25">
          <span className="absolute inset-1 rounded-full border border-transparent border-t-[#C4A265] motion-safe:animate-spin motion-reduce:animate-none" />
          <span className="font-serif text-xl tracking-widest text-[#9B7840]">A</span>
        </div>
        <p className="mt-6 font-serif text-lg tracking-[0.22em] text-neutral-900">ARONNO</p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          Curating your collection
        </p>
        <span className="mt-6 h-px w-24 overflow-hidden bg-neutral-200">
          <span className="block h-full w-1/2 origin-left animate-pulse bg-[#C4A265]" />
        </span>
      </div>
    </main>
  );
}
