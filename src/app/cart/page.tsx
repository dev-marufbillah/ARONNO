import CartPageClient from "@/components/cart/CartPageClient";
import { getStoreAdminConfig } from "@/lib/store-settings";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const { site } = await getStoreAdminConfig();
  return <CartPageClient freeDeliveryThreshold={site.freeDeliveryThreshold} deliveryFee={site.deliveryFee} />;
}
