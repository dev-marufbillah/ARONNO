"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit2, ImagePlus, PackagePlus, Plus, Trash2, Upload, X } from "lucide-react";
import { deleteProductAction, saveProductAction } from "@/lib/admin-actions";
import { uploadAdminImage } from "@/lib/upload-admin-image";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  categoryId: string;
  subcategory: string | null;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  thumbnail: string;
  images: string[];
  description: string;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  tags: string[];
  specifications: Record<string, string>;
};

type ProductDraft = Omit<ProductRow, "id">;

const blankProduct = (categoryId: string): ProductDraft => ({
  name: "",
  slug: "",
  sku: "",
  brand: "",
  categoryId,
  subcategory: "",
  price: 0,
  compareAtPrice: null,
  stockQuantity: 0,
  lowStockThreshold: 3,
  thumbnail: "",
  images: [],
  description: "",
  shortDescription: "",
  rating: 0,
  reviewCount: 0,
  featured: false,
  bestSeller: false,
  newArrival: false,
  tags: [],
  specifications: {},
});

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#C4A265] focus:ring-2 focus:ring-[#C4A265]/10";
const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500";

export default function ProductManager({
  products,
  categories,
}: {
  products: ProductRow[];
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(blankProduct(categories[0]?.id ?? ""));
  const [imageInput, setImageInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [specsInput, setSpecsInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function openForm(product?: ProductRow) {
    const selected = product ?? null;
    setFormOpen(true);
    setEditing(selected);
    setDraft(product ? { ...product, images: [...product.images] } : blankProduct(categories[0]?.id ?? ""));
    setTagsInput(product?.tags.join(", ") ?? "");
    setSpecsInput(
      product
        ? Object.entries(product.specifications).map(([key, value]) => `${key}: ${value}`).join("\n")
        : "",
    );
    setImageInput("");
    setError("");
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setError("");
  }

  function addImage(url: string) {
    const image = url.trim();
    if (!image) return;
    if (!image.startsWith("/uploads/")) {
      try {
        const parsed = new URL(image);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error();
      } catch {
        setError("Enter a valid http(s) image URL or upload an image file.");
        return;
      }
    }
    if (draft.images.includes(image)) {
      setError("That image is already in this product gallery.");
      return;
    }
    setDraft((current) => ({
      ...current,
      images: [...current.images, image],
      thumbnail: current.thumbnail || image,
    }));
    setImageInput("");
    setError("");
  }

  async function uploadImage(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      addImage(await uploadAdminImage(file));
    } catch (uploadError) {
      console.error("Product image upload failed:", uploadError);
      setError("Could not upload this image. Try again.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const specifications = Object.fromEntries(
      specsInput
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [key, ...value] = line.split(":");
          return [key.trim(), value.join(":").trim()];
        })
        .filter(([key, value]) => key && value),
    );
    const result = await saveProductAction({
      ...draft,
      subcategory: draft.subcategory || "",
      id: editing?.id,
      slug: draft.slug,
      compareAtPrice: draft.compareAtPrice || null,
      images: draft.images,
      tags: tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean),
      specifications,
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "Could not save product.");
      return;
    }
    closeForm();
    router.refresh();
  }

  async function remove(product: ProductRow) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    const result = await deleteProductAction(product.id);
    if (!result.success) {
      setError(result.error ?? "Could not delete product.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">{products.length} products in your catalog</p>
        <button
          type="button"
          onClick={() => openForm()}
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold tracking-widest text-white transition hover:bg-neutral-700"
        >
          <PackagePlus className="h-4 w-4 text-[#D4AF37]" /> ADD PRODUCT
        </button>
      </div>

      {error && !editing ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b border-neutral-100 bg-neutral-50 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        {product.thumbnail ? (
                          <Image src={product.thumbnail} alt="" fill unoptimized className="object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-neutral-900">{product.name}</p>
                        <p className="mt-0.5 text-[10px] text-neutral-400">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono">{product.sku}</td>
                  <td className="px-4 py-3 font-semibold">৳{product.price.toLocaleString("en-BD")}</td>
                  <td className="px-4 py-3">{product.stockQuantity}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openForm(product)}
                      title="Edit product"
                      className="mr-1 rounded-lg p-2 text-neutral-500 transition hover:bg-amber-50 hover:text-amber-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(product)}
                      title="Delete product"
                      className="rounded-lg p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-sm text-neutral-400">No products yet. Add your first product to get started.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/55 p-3 sm:p-6">
          <form onSubmit={submit} className="mx-auto my-3 w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-4 sm:px-7">
              <div>
                <h2 className="font-serif text-xl text-neutral-900">{editing ? "Edit product" : "Add a product"}</h2>
                <p className="mt-1 text-xs text-neutral-500">Manage details, pricing, stock and product images.</p>
              </div>
              <button type="button" onClick={closeForm} aria-label="Close" className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_320px]">
              <div className="space-y-5">
                <section className="grid gap-4 sm:grid-cols-2">
                  <label><span className={labelClass}>Product name</span><input className={inputClass} required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
                  <label><span className={labelClass}>Brand</span><input className={inputClass} required value={draft.brand} onChange={(event) => setDraft({ ...draft, brand: event.target.value })} /></label>
                  <label><span className={labelClass}>SKU</span><input className={inputClass} required value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value })} /></label>
                  <label><span className={labelClass}>URL slug</span><input className={inputClass} placeholder="Auto-generated if blank" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} /></label>
                  <label><span className={labelClass}>Category</span><select className={inputClass} required value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
                  <label><span className={labelClass}>Subcategory</span><input className={inputClass} value={draft.subcategory ?? ""} onChange={(event) => setDraft({ ...draft, subcategory: event.target.value })} /></label>
                  <label><span className={labelClass}>Price (৳)</span><input className={inputClass} required type="number" min="0" step="1" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} /></label>
                  <label><span className={labelClass}>Compare-at price (৳)</span><input className={inputClass} type="number" min="0" step="1" value={draft.compareAtPrice ?? ""} onChange={(event) => setDraft({ ...draft, compareAtPrice: event.target.value ? Number(event.target.value) : null })} /></label>
                  <label><span className={labelClass}>Stock quantity</span><input className={inputClass} required type="number" min="0" step="1" value={draft.stockQuantity} onChange={(event) => setDraft({ ...draft, stockQuantity: Number(event.target.value) })} /></label>
                  <label><span className={labelClass}>Low stock threshold</span><input className={inputClass} required type="number" min="0" step="1" value={draft.lowStockThreshold ?? 3} onChange={(event) => setDraft({ ...draft, lowStockThreshold: Number(event.target.value) })} /></label>
                </section>
                <label className="block"><span className={labelClass}>Short description</span><input className={inputClass} required value={draft.shortDescription} onChange={(event) => setDraft({ ...draft, shortDescription: event.target.value })} /></label>
                <label className="block"><span className={labelClass}>Full description</span><textarea className={`${inputClass} min-h-32`} required value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
                <label className="block"><span className={labelClass}>Tags (comma separated)</span><input className={inputClass} value={tagsInput} onChange={(event) => setTagsInput(event.target.value)} placeholder="leather, gift, premium" /></label>
                <label className="block"><span className={labelClass}>Specifications (one “Name: Value” per line)</span><textarea className={`${inputClass} min-h-24`} value={specsInput} onChange={(event) => setSpecsInput(event.target.value)} placeholder={"Material: Leather\nOrigin: Italy"} /></label>
                <div className="flex flex-wrap gap-5">
                  {([
                    ["featured", "Featured"],
                    ["bestSeller", "Best seller"],
                    ["newArrival", "New arrival"],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="inline-flex items-center gap-2 text-sm text-neutral-700"><input type="checkbox" checked={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.checked })} className="accent-[#C4A265]" />{label}</label>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label><span className={labelClass}>Rating</span><input className={inputClass} type="number" min="0" max="5" step="0.1" value={draft.rating} onChange={(event) => setDraft({ ...draft, rating: Number(event.target.value) })} /></label>
                  <label><span className={labelClass}>Review count</span><input className={inputClass} type="number" min="0" step="1" value={draft.reviewCount} onChange={(event) => setDraft({ ...draft, reviewCount: Number(event.target.value) })} /></label>
                </div>
              </div>

              <aside className="h-fit rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <h3 className="text-sm font-bold text-neutral-900">Product images</h3>
                <p className="mt-1 text-xs leading-5 text-neutral-500">Upload JPG, PNG or WebP (up to 8 MB), or add an image URL. Choose one as the cover.</p>
                <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-white px-3 py-3 text-xs font-semibold text-neutral-700 hover:border-[#C4A265]">
                  <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload image"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(event) => { void uploadImage(event.target.files?.[0]); event.currentTarget.value = ""; }} />
                </label>
                <div className="mt-3 flex gap-2">
                  <input className={`${inputClass} min-w-0 px-3 py-2 text-xs`} type="url" value={imageInput} onChange={(event) => setImageInput(event.target.value)} placeholder="https://image-url..." />
                  <button type="button" onClick={() => addImage(imageInput)} className="shrink-0 rounded-lg bg-neutral-900 px-3 text-white" aria-label="Add image URL"><Plus className="h-4 w-4" /></button>
                </div>
                <div className="mt-4 space-y-2">
                  {draft.images.map((image) => (
                    <div key={image} className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-2">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                        <Image src={image} alt="" fill unoptimized className="object-cover" />
                      </div>
                      <button type="button" onClick={() => setDraft({ ...draft, thumbnail: image })} className={`min-w-0 flex-1 truncate text-left text-[10px] ${draft.thumbnail === image ? "font-bold text-amber-700" : "text-neutral-500"}`}>
                        {draft.thumbnail === image ? "COVER IMAGE" : image}
                      </button>
                      <button type="button" onClick={() => setDraft({ ...draft, images: draft.images.filter((item) => item !== image), thumbnail: draft.thumbnail === image ? draft.images.find((item) => item !== image) ?? "" : draft.thumbnail })} aria-label="Remove image" className="rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                  {draft.images.length === 0 ? <div className="rounded-lg border border-dashed border-neutral-200 py-8 text-center text-xs text-neutral-400"><ImagePlus className="mx-auto mb-2 h-5 w-5" />No images added</div> : null}
                </div>
              </aside>
            </div>
            {error ? <p role="alert" className="mx-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-7">{error}</p> : null}
            <div className="flex justify-end gap-3 border-t border-neutral-100 px-5 py-4 sm:px-7">
              <button type="button" onClick={closeForm} className="rounded-lg px-4 py-2.5 text-xs font-bold uppercase text-neutral-500 hover:bg-neutral-100">Cancel</button>
              <button disabled={loading || uploading} className="rounded-lg bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50">{loading ? "Saving..." : editing ? "Save changes" : "Create product"}</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
