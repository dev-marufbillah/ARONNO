import { getPaymentProviderStatuses } from "@/lib/store-settings";

export async function GET() {
  const providers = await getPaymentProviderStatuses();
  return Response.json({
    providers: providers.map(({ key, label, configured, enabled }) => ({
      key,
      label,
      configured,
      enabled,
    })),
    message: "Gateway credentials stay in the server environment.",
  });
}
