// ===== ARONNO BRAND CONSTANTS =====

export const BRAND = {
  name: "ARONNO",
  tagline: "Luxury Lifestyle, Curated.",
  description:
    "ARONNO brings carefully curated luxury lifestyle products together in one refined destination.",
  currency: "৳",
  currencyCode: "BDT",
  country: "Bangladesh",
  city: "Dhaka",
  email: "hello@aronno.com.bd",
  phone: "+880 1700-000000",
  address: "Gulshan 2, Dhaka 1212, Bangladesh",
  socialMedia: {
    instagram: "https://instagram.com/aronno",
    facebook: "https://facebook.com/aronno",
    youtube: "https://youtube.com/aronno",
    pinterest: "https://pinterest.com/aronno",
  },
} as const;

export const NAV_LINKS = [
  {
    label: "Shop",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop",
  },
  {
    label: "New Arrivals",
    href: "/new-arrivals",
    image:
      "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600&auto=format&fit=crop",
  },
  {
    label: "Perfume",
    href: "/category/perfume",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
  },
  {
    label: "Watches",
    href: "/category/watches",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600&auto=format&fit=crop",
  },
  {
    label: "Eyewear",
    href: "/category/eyewear",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop",
  },
  {
    label: "Bags & Leather",
    href: "/category/bags-leather",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
  },
  {
    label: "Jewelry",
    href: "/category/jewelry",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop",
  },
  {
    label: "Gifts",
    href: "/category/gift-sets",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
  },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "Shop All", href: "/shop" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Perfume", href: "/category/perfume" },
    { label: "Watches", href: "/category/watches" },
    { label: "Eyewear", href: "/category/eyewear" },
    { label: "Bags & Leather", href: "/category/bags-leather" },
    { label: "Jewelry", href: "/category/jewelry" },
    { label: "Gifts", href: "/category/gift-sets" },
  ],
  about: [
    { label: "Our Story", href: "/our-story" },
    { label: "About ARONNO", href: "/about" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
  ],
  customerCare: [
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
} as const;

export const CATEGORIES = [
  { name: "Perfume", slug: "perfume" },
  { name: "Watches", slug: "watches" },
  { name: "Eyewear", slug: "eyewear" },
  { name: "Bags & Leather", slug: "bags-leather" },
  { name: "Wallets & Card Holders", slug: "wallets-card-holders" },
  { name: "Jewelry", slug: "jewelry" },
  { name: "Shoes", slug: "shoes" },
  { name: "Grooming", slug: "grooming" },
  { name: "Gift Sets", slug: "gift-sets" },
] as const;

export const FREE_DELIVERY_THRESHOLD = 5000;