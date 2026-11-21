import { db } from "@/db";
import { categories } from "@/db/schema";
import { desc } from "drizzle-orm";
import { FolderTree, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categoryList = await db
    .select()
    .from(categories)
    .orderBy(desc(categories.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif tracking-wide text-neutral-900 uppercase">Categories</h1>
          <p className="text-xs text-neutral-500 tracking-wider font-mono mt-1">Organize luxury collections & groupings</p>
        </div>
        <CategoryManager categories={categoryList} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {categoryList.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-neutral-200/80 p-12 text-center text-neutral-400 font-mono">
            <FolderTree className="w-10 h-10 mx-auto text-neutral-300 mb-3" />
            <p>No categories found. Click &quot;New Category&quot; to create one.</p>
          </div>
        ) : (
          categoryList.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-5 flex flex-col justify-between hover:border-neutral-400 transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden relative shrink-0 flex items-center justify-center">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-neutral-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">{cat.name}</h3>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">/{cat.slug}</p>
                  {cat.description && (
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-2">{cat.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}