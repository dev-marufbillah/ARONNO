import { FileText } from "lucide-react";
import SiteContentManager from "@/components/admin/SiteContentManager";
import { getStoreAdminConfig } from "@/lib/store-settings";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  const { site } = await getStoreAdminConfig();
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700"><FileText className="h-5 w-5" /></div>
        <div><h1 className="font-serif text-2xl uppercase tracking-wide text-neutral-900">Site CMS</h1><p className="mt-1 text-xs text-neutral-500">Edit homepage content, footer sections and links, images, contact details and delivery pricing.</p></div>
      </div>
      <SiteContentManager initialSettings={site} />
    </div>
  );
}
