import { CreditCard } from "lucide-react";
import PaymentSettingsManager from "@/components/admin/PaymentSettingsManager";
import { getPaymentProviderStatuses } from "@/lib/store-settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const providers = await getPaymentProviderStatuses();
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700"><CreditCard className="h-5 w-5" /></div>
        <div><h1 className="font-serif text-2xl uppercase tracking-wide text-neutral-900">Payment settings</h1><p className="mt-1 text-xs text-neutral-500">Control which configured payment methods appear at checkout.</p></div>
      </div>
      <PaymentSettingsManager providers={providers} />
    </div>
  );
}
