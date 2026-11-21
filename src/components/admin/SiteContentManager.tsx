"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Plus, Save, Trash2, Upload } from "lucide-react";
import { saveSiteSettingsAction } from "@/lib/admin-actions";
import type { SiteSettings } from "@/lib/store-settings";
import { uploadAdminImage } from "@/lib/upload-admin-image";

type StringSettingKey = {
  [Key in keyof SiteSettings]: SiteSettings[Key] extends string ? Key : never;
}[keyof SiteSettings];
type ImageSettingKey = "heroImage" | "signatureImage" | "storyImage" | "giftImage";
type NumberSettingKey = "freeDeliveryThreshold" | "deliveryFee";
type FooterLinkGroupKey =
  | "footerShopLinks"
  | "footerAboutLinks"
  | "footerCustomerCareLinks"
  | "footerLegalLinks";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#C4A265] focus:ring-2 focus:ring-[#C4A265]/10";
const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="border-b border-neutral-100 pb-4 font-serif text-lg text-neutral-900">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export default function SiteContentManager({ initialSettings }: { initialSettings: SiteSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<ImageSettingKey | null>(null);

  function update<Key extends keyof SiteSettings>(key: Key, value: SiteSettings[Key]) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function textField<Key extends StringSettingKey>(key: Key, label: string, options?: { type?: string; wide?: boolean }) {
    return (
      <label key={key} className={options?.wide ? "md:col-span-2" : ""}>
        <span className={labelClass}>{label}</span>
        <input
          className={inputClass}
          type={options?.type ?? "text"}
          value={settings[key]}
          onChange={(event) => update(key, event.target.value)}
        />
      </label>
    );
  }

  function textArea<Key extends StringSettingKey>(key: Key, label: string, rows = 3) {
    return (
      <label key={key} className="md:col-span-2">
        <span className={labelClass}>{label}</span>
        <textarea
          className={`${inputClass} resize-y`}
          rows={rows}
          value={settings[key]}
          onChange={(event) => update(key, event.target.value)}
        />
      </label>
    );
  }

  async function uploadImage(key: ImageSettingKey, file: File | undefined) {
    if (!file) return;
    setUploading(key);
    setError("");
    try {
      update(key, await uploadAdminImage(file));
    } catch (uploadError) {
      console.error("Site image upload failed:", uploadError);
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload this image.");
    } finally {
      setUploading(null);
    }
  }

  function imageField(key: ImageSettingKey, label: string) {
    return (
      <div key={key} className="md:col-span-2">
        <span className={labelClass}>{label}</span>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input className={inputClass} value={settings[key]} onChange={(event) => update(key, event.target.value)} placeholder="Paste an image URL or upload an image" />
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 py-3 text-xs font-semibold text-neutral-700 hover:border-[#C4A265]">
            <Upload className="h-4 w-4" />{uploading === key ? "Uploading..." : "Upload"}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading !== null} onChange={(event) => { void uploadImage(key, event.target.files?.[0]); event.currentTarget.value = ""; }} />
          </label>
        </div>
        {settings[key] ? (
          <div className="relative mt-3 h-40 overflow-hidden rounded-xl bg-neutral-100">
            <Image src={settings[key]} alt={`${label} preview`} fill unoptimized className="object-cover" />
          </div>
        ) : <div className="mt-3 flex h-20 items-center justify-center rounded-xl border border-dashed border-neutral-200 text-xs text-neutral-400"><ImagePlus className="mr-2 h-4 w-4" />No image selected</div>}
      </div>
    );
  }

  function numberField<Key extends NumberSettingKey>(key: Key, label: string) {
    return (
      <label key={key}>
        <span className={labelClass}>{label}</span>
        <input className={inputClass} type="number" min="0" step="1" value={settings[key]} onChange={(event) => update(key, Number(event.target.value))} />
      </label>
    );
  }

  function updateFooterLink(
    group: FooterLinkGroupKey,
    index: number,
    field: "label" | "href",
    value: string,
  ) {
    setSettings((current) => ({
      ...current,
      [group]: current[group].map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link,
      ),
    }));
    setSaved(false);
  }

  function addFooterLink(group: FooterLinkGroupKey) {
    setSettings((current) => ({
      ...current,
      [group]: [...current[group], { label: "New link", href: "/" }],
    }));
    setSaved(false);
  }

  function removeFooterLink(group: FooterLinkGroupKey, index: number) {
    setSettings((current) => ({
      ...current,
      [group]: current[group].filter((_, linkIndex) => linkIndex !== index),
    }));
    setSaved(false);
  }

  function footerLinksEditor(group: FooterLinkGroupKey, label: string) {
    return (
      <div key={group} className="space-y-3 md:col-span-2">
        <div className="flex items-center justify-between">
          <span className={labelClass}>{label}</span>
          <button
            type="button"
            onClick={() => addFooterLink(group)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[#9B7840] hover:text-black"
          >
            <Plus className="h-3.5 w-3.5" /> Add link
          </button>
        </div>
        {settings[group].map((link, index) => (
          <div key={`${group}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1.2fr_auto]">
            <input
              className={inputClass}
              aria-label={`${label} link ${index + 1} label`}
              value={link.label}
              maxLength={60}
              onChange={(event) => updateFooterLink(group, index, "label", event.target.value)}
              placeholder="Link label"
            />
            <input
              className={inputClass}
              aria-label={`${label} link ${index + 1} URL`}
              value={link.href}
              onChange={(event) => updateFooterLink(group, index, "href", event.target.value)}
              placeholder="/page or https://example.com"
            />
            <button
              type="button"
              onClick={() => removeFooterLink(group, index)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition hover:border-red-200 hover:text-red-600"
              aria-label={`Remove ${label} link ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    const result = await saveSiteSettingsAction(settings);
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Could not save your site content.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Section title="Announcement bar">
        <label className="flex items-center gap-3 text-sm text-neutral-700 md:col-span-2">
          <input type="checkbox" checked={settings.announcementEnabled} onChange={(event) => update("announcementEnabled", event.target.checked)} className="h-4 w-4 accent-[#C4A265]" />
          Show announcement at the top of the store
        </label>
        {textField("announcementText", "Announcement text", { wide: true })}
      </Section>

      <Section title="Homepage hero">
        {textField("heroEyebrow", "Small heading")}
        {textField("heroPrimaryLabel", "Primary button label")}
        {textArea("heroTitle", "Main headline (line breaks are supported)", 3)}
        {textArea("heroDescription", "Description")}
        {imageField("heroImage", "Hero background")}
        {textField("heroPrimaryHref", "Primary button link")}
        {textField("heroSecondaryLabel", "Secondary button label")}
        {textField("heroSecondaryHref", "Secondary button link")}
      </Section>

      <Section title="Homepage collections and stories">
        {textField("signatureEyebrow", "Signature eyebrow")}
        {textField("signatureTitle", "Signature heading")}
        {textArea("signatureDescription", "Signature description")}
        {imageField("signatureImage", "Signature collection image")}
        {textField("storyEyebrow", "Story eyebrow")}
        {textField("storyTitle", "Story heading")}
        {textArea("storyDescription", "Story description")}
        {imageField("storyImage", "Brand story image")}
        {textField("giftTitle", "Gift banner heading", { wide: true })}
        {textArea("giftDescription", "Gift banner description")}
        {imageField("giftImage", "Gift banner image")}
        {textField("newsletterTitle", "Newsletter heading", { wide: true })}
        {textArea("newsletterDescription", "Newsletter description")}
      </Section>

      <Section title="Store identity and customer contact">
        {textField("brandName", "Store name")}
        {textField("tagline", "Tagline")}
        {textField("contactEmail", "Contact email", { type: "email" })}
        {textField("contactPhone", "Contact phone", { type: "tel" })}
        {textField("contactAddress", "Store address", { wide: true })}
        {textField("instagramUrl", "Instagram URL", { type: "url" })}
        {textField("facebookUrl", "Facebook URL", { type: "url" })}
        {textField("youtubeUrl", "YouTube URL", { type: "url" })}
        {textField("pinterestUrl", "Pinterest URL", { type: "url" })}
      </Section>

      <Section title="Footer content and links">
        {textField("footerLocation", "Footer location")}
        {textField("footerShopTitle", "Shop column heading")}
        {textField("footerAboutTitle", "About column heading")}
        {textField("footerCustomerCareTitle", "Customer care column heading")}
        {textField("footerContactTitle", "Contact column heading")}
        {footerLinksEditor("footerShopLinks", "Shop links")}
        {footerLinksEditor("footerAboutLinks", "About links")}
        {footerLinksEditor("footerCustomerCareLinks", "Customer care links")}
        {footerLinksEditor("footerLegalLinks", "Legal links")}
        <p className="text-xs leading-5 text-neutral-500 md:col-span-2">
          Use a site path such as /shipping or a full http(s) URL. Changes appear in the storefront footer after publishing.
        </p>
      </Section>

      <Section title="Delivery pricing">
        {numberField("freeDeliveryThreshold", "Free delivery above (৳)")}
        {numberField("deliveryFee", "Standard delivery fee (৳)")}
        <p className="text-xs leading-5 text-neutral-500 md:col-span-2">These values are used in the cart, checkout and final order calculation.</p>
      </Section>

      {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white/95 p-3 shadow-lg backdrop-blur">
        <p className="px-2 text-xs text-neutral-500">{saved ? "Changes saved and published." : "Changes are not live until you save."}</p>
        <button type="submit" disabled={saving || uploading !== null} className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-neutral-700 disabled:opacity-50">
          <Save className="h-4 w-4 text-[#D4AF37]" />{saving ? "Saving..." : "Save and publish"}
        </button>
      </div>
    </form>
  );
}
