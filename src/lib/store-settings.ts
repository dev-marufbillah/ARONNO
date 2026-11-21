import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { BRAND, FOOTER_LINKS } from "@/lib/constants";
import { heroImage, storyImages } from "@/lib/demo-data";

export const DEFAULT_SITE_SETTINGS = {
  brandName: BRAND.name,
  tagline: BRAND.tagline,
  announcementEnabled: true,
  announcementText: "Complimentary Delivery on Orders Above ৳5,000",
  introEyebrow: "A CURATED LUXURY DESTINATION",
  introTitle: "Welcome to ARONNO",
  introDescription: "Discover refined perfumes, watches, bags and jewelry for every moment.",
  heroEyebrow: "Luxury Lifestyle Store",
  heroTitle: "TIMELESS.\nREFINED.\nYOURS.",
  heroDescription: "Curated luxury pieces for those who appreciate the finer things.",
  heroImage,
  heroPrimaryLabel: "Explore Collection",
  heroPrimaryHref: "/shop",
  heroSecondaryLabel: "Discover ARONNO",
  heroSecondaryHref: "/about",
  signatureEyebrow: "The Signature Edit",
  signatureTitle: "Luxury, Curated Differently.",
  signatureDescription: "Discover carefully selected pieces designed to elevate everyday moments.",
  signatureImage: storyImages.signature,
  storyEyebrow: "The ARONNO Story",
  storyTitle: "Elegance Is In The Details.",
  storyDescription: "ARONNO brings carefully curated luxury lifestyle products together in one refined destination.",
  storyImage: storyImages.brandStory,
  giftTitle: "FIND A GIFT THEY'LL REMEMBER",
  giftDescription: "Curated gifts for birthdays, weddings, anniversaries and unforgettable moments.",
  giftImage: storyImages.gift,
  newsletterTitle: "Enter The World Of Luxury",
  newsletterDescription: "Be the first to discover new collections, exclusive pieces and curated stories.",
  contactEmail: BRAND.email,
  contactPhone: BRAND.phone,
  whatsappNumber: "",
  contactAddress: BRAND.address,
  instagramUrl: BRAND.socialMedia.instagram,
  facebookUrl: BRAND.socialMedia.facebook,
  youtubeUrl: BRAND.socialMedia.youtube,
  pinterestUrl: BRAND.socialMedia.pinterest,
  footerLocation: `${BRAND.city}, ${BRAND.country}`,
  footerShopTitle: "Shop",
  footerAboutTitle: "About",
  footerCustomerCareTitle: "Customer Care",
  footerContactTitle: "Contact",
  footerShopLinks: FOOTER_LINKS.shop.map((link) => ({ ...link })),
  footerAboutLinks: FOOTER_LINKS.about.map((link) => ({ ...link })),
  footerCustomerCareLinks: FOOTER_LINKS.customerCare.map((link) => ({ ...link })),
  footerLegalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
  freeDeliveryThreshold: 5000,
  deliveryFee: 120,
};

type WidenSetting<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends ReadonlyArray<infer Item>
      ? Item[]
      : T;
export type SiteSettings = {
  [Key in keyof typeof DEFAULT_SITE_SETTINGS]: WidenSetting<(typeof DEFAULT_SITE_SETTINGS)[Key]>;
};
export type PaymentMethodKey = "COD" | "BKASH" | "NAGAD" | "SSLCOMMERZ";

const paymentProviders: Array<{
  key: PaymentMethodKey;
  label: string;
  envKey: string | null;
}> = [
  { key: "COD", label: "Cash on Delivery", envKey: null },
  { key: "BKASH", label: "bKash", envKey: "BKASH_APP_KEY" },
  { key: "NAGAD", label: "Nagad", envKey: "NAGAD_API_KEY" },
  { key: "SSLCOMMERZ", label: "SSLCommerz", envKey: "SSLCOMMERZ_STORE_ID" },
];

export async function getStoreAdminConfig() {
  try {
    const rows = await db
      .select()
      .from(storeSettings)
      .where(inArray(storeSettings.key, ["site", "payment"]));
    const siteRow = rows.find((row) => row.key === "site");
    const paymentRow = rows.find((row) => row.key === "payment");
    const savedSite =
      siteRow?.value && typeof siteRow.value === "object"
        ? (siteRow.value as Partial<SiteSettings>)
        : {};
    const savedPayment =
      paymentRow?.value && typeof paymentRow.value === "object"
        ? (paymentRow.value as Partial<Record<PaymentMethodKey, boolean>>)
        : {};

    return {
      site: { ...DEFAULT_SITE_SETTINGS, ...savedSite },
      payment: savedPayment,
    };
  } catch (error) {
    console.error("Could not load store settings; showing the built-in defaults.", error);
    return { site: DEFAULT_SITE_SETTINGS, payment: {} };
  }
}

export async function getPaymentProviderStatuses() {
  const { payment } = await getStoreAdminConfig();
  return paymentProviders.map((provider) => {
    const configured = provider.envKey === null || Boolean(process.env[provider.envKey]);
    const enabled = configured && (payment[provider.key] ?? configured);
    return {
      key: provider.key,
      label: provider.label,
      configured,
      enabled,
      envKey: provider.envKey,
    };
  });
}
