import { format } from "date-fns";

export function formatCurrency(amount: number, currencySymbol = "৳") {
  return `${currencySymbol} ${amount.toLocaleString("en-BD")}`;
}

export function formatDate(value: Date | string) {
  return format(new Date(value), "dd MMM yyyy");
}

export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getDeliveryFee(
  subtotal: number,
  freeDeliveryThreshold = 5000,
  standardFee = 120,
) {
  return subtotal >= freeDeliveryThreshold ? 0 : standardFee;
}

export function generateOrderNumber() {
  return `AUR-${Date.now().toString().slice(-8)}`;
}
