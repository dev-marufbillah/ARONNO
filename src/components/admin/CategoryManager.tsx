"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit2, FolderTree, ImagePlus, Plus, Trash2, Upload, X } from "lucide-react";
import { deleteCategoryAction, saveCategoryAction } from "@/lib/admin-actions";
import { uploadAdminImage } from "@/lib/upload-admin-image";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  isActive: boolean;
  showInNav: boolean;
  showOnHome: boolean;
  sortOrder: number;
};

const emptyCategory = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  parentId: "",
  isActive: true,
  showInNav: true,
  showOnHome: false,
  sortOrder: 0,
};

const fieldClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#C4A265] focus:ring-2 focus:ring-[#C4A265]/10";

export default function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [draft, setDraft] = useState(emptyCategory);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function openForm(category?: CategoryRow) {
    setEditing(category ?? null);
    setDraft(category ? { ...category, description: category.description ?? "", imageUrl: category.imageUrl ?? "", parentId: category.parentId ?? "" } : emptyCategory);
    setError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setError("");
  }

  async function uploadImage(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadAdminImage(file);
      setDraft((current) => ({ ...current, imageUrl: url }));
    } catch (uploadError) {
      console.error("Category image upload failed:", uploadError);
      setError("Could not upload this image. Try again.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = await saveCategoryAction({
      ...draft,
      id: editing?.id,
      parentId: draft.parentId || undefined,
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "Could not save category.");
      return;
    }
    closeForm();
    router.refresh();
  }

  async function remove(category: CategoryRow) {
    if (!window.confirm(`Remove "${category.name}"?`)) return;
    const result = await deleteCategoryAction(category.id);
    if (!result.success) {
      setError(result.error ?? "Could not remove category.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {error && !formOpen ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <article key={category.id} className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-300">
            <div className="flex items-start gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                {category.imageUrl ? <Image src={category.imageUrl} alt="" fill unoptimized className="object-cover" /> : <FolderTree className="h-6 w-6 text-neutral-300" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">{category.name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${category.isActive ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>{category.isActive ? "Active" : "Hidden"}</span>
                </div>
                <p className="mt-1 truncate font-mono text-[11px] text-neutral-400">/{category.slug}</p>
                {category.description ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500">{category.description}</p> : null}
                <p className="mt-2 text-[10px] text-neutral-400">{category.showInNav ? "Navigation" : "Not in navigation"} · {category.showOnHome ? "Homepage" : "Not on homepage"}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">Sort order {category.sortOrder}</span>
              <div>
                <button type="button" onClick={() => openForm(category)} title="Edit category" className="mr-1 rounded-lg p-2 text-neutral-500 hover:bg-amber-50 hover:text-amber-700"><Edit2 className="h-4 w-4" /></button>
                <button type="button" onClick={() => void remove(category)} title="Delete category" className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </article>
        ))}
        {categories.length === 0 ? <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-400">No categories yet. Add one to organize your products.</div> : null}
      </div>

      <button type="button" onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold tracking-widest text-white transition hover:bg-neutral-700">
        <Plus className="h-4 w-4 text-[#D4AF37]" /> ADD CATEGORY
      </button>

      {formOpen ? (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/55 p-3 sm:p-6">
          <form onSubmit={submit} className="mx-auto my-6 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div><h2 className="font-serif text-xl text-neutral-900">{editing ? "Edit category" : "Add category"}</h2><p className="mt-1 text-xs text-neutral-500">Manage visibility and collection artwork.</p></div>
              <button type="button" onClick={closeForm} aria-label="Close" className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <label><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Name</span><input className={fieldClass} required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
              <label><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Slug</span><input className={fieldClass} placeholder="Auto-generated if blank" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} /></label>
              <label><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Parent category</span><select className={fieldClass} value={draft.parentId} onChange={(event) => setDraft({ ...draft, parentId: event.target.value })}><option value="">No parent</option>{categories.filter((category) => category.id !== editing?.id).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              <label><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Sort order</span><input className={fieldClass} type="number" min="0" value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })} /></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Description</span><textarea className={`${fieldClass} min-h-24`} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
              <div className="sm:col-span-2">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Category image</span>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input className={fieldClass} type="text" value={draft.imageUrl} onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })} placeholder="Paste an image URL or upload a file" />
                  <label className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 py-3 text-xs font-semibold text-neutral-700 hover:border-[#C4A265]"><Upload className="h-4 w-4" />{uploading ? "Uploading..." : "Upload"}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(event) => { void uploadImage(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>
                </div>
                {draft.imageUrl ? <div className="relative mt-3 h-32 w-full overflow-hidden rounded-lg bg-neutral-100"><Image src={draft.imageUrl} alt="Category preview" fill unoptimized className="object-cover" /></div> : <div className="mt-3 flex h-20 items-center justify-center rounded-lg border border-dashed border-neutral-200 text-xs text-neutral-400"><ImagePlus className="mr-2 h-4 w-4" />No image selected</div>}
              </div>
              <div className="flex flex-wrap gap-5 sm:col-span-2">
                {([
                  ["isActive", "Visible in store"],
                  ["showInNav", "Show in navigation"],
                  ["showOnHome", "Show on homepage"],
                ] as const).map(([key, label]) => <label key={key} className="inline-flex items-center gap-2 text-sm text-neutral-700"><input type="checkbox" checked={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.checked })} className="accent-[#C4A265]" />{label}</label>)}
              </div>
            </div>
            {error ? <p role="alert" className="mx-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
            <div className="flex justify-end gap-3 border-t border-neutral-100 px-5 py-4">
              <button type="button" onClick={closeForm} className="rounded-lg px-4 py-2.5 text-xs font-bold uppercase text-neutral-500 hover:bg-neutral-100">Cancel</button>
              <button disabled={loading || uploading} className="rounded-lg bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50">{loading ? "Saving..." : editing ? "Save changes" : "Create category"}</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
