import Rating from "@/components/ui/Rating";
import { formatDate } from "@/lib/utils";

export default function ProductReviews({
  reviews,
}: {
  reviews: Array<{ id: string; rating: number; title: string; review: string; createdAt: Date; userName: string }>;
}) {
  return (
    <section className="border-t border-black/10 pt-10">
      <h3 className="text-2xl text-black-deep">Customer Reviews</h3>
      <div className="mt-6 space-y-6">
        {reviews.map((item) => (
          <article key={item.id} className="border border-black/10 bg-[#fbfaf7] p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-black-deep">{item.userName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-black/40">{formatDate(item.createdAt)}</p>
              </div>
              <Rating value={item.rating} />
            </div>
            <h4 className="mt-4 text-lg text-black-deep">{item.title}</h4>
            <p className="mt-2 text-sm leading-7 text-black/65">{item.review}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
