import Container from "@/components/ui/Container";
import { CheckoutForm } from "@/components/forms/StoreForms";
import { getPaymentProviderStatuses, getStoreAdminConfig } from "@/lib/store-settings";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const [{ site }, providers] = await Promise.all([
    getStoreAdminConfig(),
    getPaymentProviderStatuses(),
  ]);
  const paymentMethods = providers.filter((provider) => provider.enabled).map((provider) => provider.key);

  return (
    <Container className="py-16 md:py-20">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl text-black-deep md:text-5xl">Checkout</h1>
        <p className="mt-4 text-sm leading-7 text-black/60">
          Secure checkout for luxury delivery across Bangladesh. Payment architecture supports Cash on Delivery, bKash, Nagad and SSLCommerz.
        </p>
      </div>
      <CheckoutForm
        paymentMethods={paymentMethods}
        freeDeliveryThreshold={site.freeDeliveryThreshold}
        standardDeliveryFee={site.deliveryFee}
      />
    </Container>
  );
}
