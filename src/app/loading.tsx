export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-20 md:px-10 lg:px-20">
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-32 bg-black/5" />
        <div className="h-14 w-96 max-w-full bg-black/10" />
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="aspect-[4/5] bg-black/5" />
              <div className="h-4 w-24 bg-black/5" />
              <div className="h-6 w-40 bg-black/10" />
              <div className="h-5 w-28 bg-black/5" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
