"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Save, ShieldCheck } from "lucide-react";
import { savePaymentSettingsAction } from "@/lib/admin-actions";
import type { PaymentMethodKey } from "@/lib/store-settings";

type ProviderStatus = {
  key: PaymentMethodKey;
  label: string;
  configured: boolean;
  enabled: boolean;
  envKey: string | null;
};

export default function PaymentSettingsManager({ providers }: { providers: ProviderStatus[] }) {
  const router = useRouter();
  const [methods, setMethods] = useState<Record<PaymentMethodKey, boolean>>(
    Object.fromEntries(providers.map((provider) => [provider.key, provider.enabled])) as Record<PaymentMethodKey, boolean>,
  );
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    const result = await savePaymentSettingsAction(methods);
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Could not save payment settings.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3 border-b border-neutral-100 pb-4">
          <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700"><CreditCard className="h-5 w-5" /></div>
          <div><h2 className="font-serif text-lg text-neutral-900">Checkout payment methods</h2><p className="mt-1 text-xs leading-5 text-neutral-500">Choose which methods customers can select at checkout.</p></div>
        </div>
        <div className="mt-4 divide-y divide-neutral-100">
          {providers.map((provider) => (
            <label key={provider.key} className="flex items-center justify-between gap-4 py-4">
              <span>
                <span className="block text-sm font-semibold text-neutral-900">{provider.label}</span>
                <span className="mt-1 block text-xs text-neutral-500">
                  {provider.configured
                    ? provider.key === "COD" ? "Available without gateway credentials." : `Server credential detected (${provider.envKey}).`
                    : provider.key === "COD" ? "Always available." : `Add ${provider.envKey} to the server environment to enable.`}
                </span>
              </span>
              <input
                type="checkbox"
                checked={methods[provider.key]}
                disabled={!provider.configured}
                onChange={(event) => {
                  setMethods((current) => ({ ...current, [provider.key]: event.target.checked }));
                  setSaved(false);
                }}
                aria-label={`Enable ${provider.label}`}
                className="h-5 w-5 shrink-0 accent-[#C4A265] disabled:opacity-40"
              />
            </label>
          ))}
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-900">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Gateway credentials are never displayed or saved in this panel; keep them in the server environment. Turning a method on controls its checkout visibility. A real online payment flow still requires the corresponding provider integration and merchant account.</p>
      </div>

      {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
        <p className="px-2 text-xs text-neutral-500">{saved ? "Payment settings saved." : "At least one payment method must stay active."}</p>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-neutral-700 disabled:opacity-50">
          <Save className="h-4 w-4 text-[#D4AF37]" />{saving ? "Saving..." : "Save payment settings"}
        </button>
      </div>
    </form>
  );
}
