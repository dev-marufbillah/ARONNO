import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Valid email is required").transform((email) => email.trim().toLowerCase()),
  phone: z.string().min(11, "Phone number is required").max(20),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.email("Valid email is required").transform((email) => email.trim().toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  phone: z
    .string()
    .trim()
    .max(20)
    .refine((phone) => phone.length === 0 || phone.length >= 11, "Enter a valid phone number."),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(8, "Enter your current password."),
    newPassword: z.string().min(12, "New password must be at least 12 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

export const newsletterSchema = z.object({
  email: z.email("Valid email is required"),
});

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phoneNumber: z.string().min(11, "Phone number is required"),
  email: z.email("Valid email is required"),
  division: z.string().min(2, "Division is required"),
  district: z.string().min(2, "District is required"),
  area: z.string().min(2, "Area is required"),
  fullAddress: z.string().min(10, "Full address is required"),
});

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2),
  email: z.email(),
  phoneNumber: z.string().min(11),
  shippingAddress: addressSchema,
  paymentMethod: z.enum(["COD", "BKASH", "NAGAD", "SSLCOMMERZ"]),
  couponCode: z.string().trim().max(40).optional(),
  items: z.array(orderItemSchema).min(1),
});

export const wishlistSchema = z.object({
  productId: z.string().uuid(),
});

const imageReferenceSchema = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine((value) => {
    if (value.startsWith("/uploads/") && !value.includes("..")) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }, "Enter a valid image URL or upload an image.");

export const adminProductSchema = z.object({
  sku: z.string().min(3),
  brand: z.string().min(2),
  name: z.string().min(2),
  slug: z.string().min(2),
  categoryId: z.string().uuid(),
  subcategory: z.string().optional().default(""),
  description: z.string().min(10),
  shortDescription: z.string().min(10),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().nonnegative().nullable().optional(),
  stockQuantity: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().nonnegative().default(3),
  thumbnail: imageReferenceSchema,
  images: z.array(imageReferenceSchema).min(1),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.string()).default({}),
});

export const adminCategorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required (e.g. smart-watches)"),
  description: z.string().optional(),
  imageUrl: imageReferenceSchema.optional().or(z.literal("")),
});

const safeLinkSchema = z
  .string()
  .trim()
  .refine((value) => /^(\/(?!\/)|https?:\/\/)/i.test(value), "Use a site path or an http(s) URL.");
const footerLinkSchema = z.object({
  label: z.string().trim().min(1).max(60),
  href: safeLinkSchema,
});

export const siteSettingsSchema = z.object({
  brandName: z.string().trim().min(1).max(80),
  tagline: z.string().trim().max(180),
  announcementEnabled: z.boolean(),
  announcementText: z.string().trim().max(180),
  heroEyebrow: z.string().trim().max(100),
  heroTitle: z.string().trim().min(1).max(180),
  heroDescription: z.string().trim().max(500),
  heroImage: imageReferenceSchema,
  heroPrimaryLabel: z.string().trim().max(60),
  heroPrimaryHref: safeLinkSchema,
  heroSecondaryLabel: z.string().trim().max(60),
  heroSecondaryHref: safeLinkSchema,
  signatureEyebrow: z.string().trim().max(100),
  signatureTitle: z.string().trim().max(180),
  signatureDescription: z.string().trim().max(500),
  signatureImage: imageReferenceSchema,
  storyEyebrow: z.string().trim().max(100),
  storyTitle: z.string().trim().max(180),
  storyDescription: z.string().trim().max(500),
  storyImage: imageReferenceSchema,
  giftTitle: z.string().trim().max(180),
  giftDescription: z.string().trim().max(500),
  giftImage: imageReferenceSchema,
  newsletterTitle: z.string().trim().max(180),
  newsletterDescription: z.string().trim().max(500),
  contactEmail: z.email(),
  contactPhone: z.string().trim().max(40),
  contactAddress: z.string().trim().max(240),
  instagramUrl: z.url().or(z.literal("")),
  facebookUrl: z.url().or(z.literal("")),
  youtubeUrl: z.url().or(z.literal("")),
  pinterestUrl: z.url().or(z.literal("")),
  footerLocation: z.string().trim().max(180),
  footerShopTitle: z.string().trim().min(1).max(40),
  footerAboutTitle: z.string().trim().min(1).max(40),
  footerCustomerCareTitle: z.string().trim().min(1).max(40),
  footerContactTitle: z.string().trim().min(1).max(40),
  footerShopLinks: z.array(footerLinkSchema).max(20),
  footerAboutLinks: z.array(footerLinkSchema).max(20),
  footerCustomerCareLinks: z.array(footerLinkSchema).max(20),
  footerLegalLinks: z.array(footerLinkSchema).max(10),
  freeDeliveryThreshold: z.number().int().nonnegative(),
  deliveryFee: z.number().int().nonnegative(),
});

export const paymentSettingsSchema = z.object({
  COD: z.boolean(),
  BKASH: z.boolean(),
  NAGAD: z.boolean(),
  SSLCOMMERZ: z.boolean(),
});

export const adminCouponSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().min(3).max(40),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().int().positive(),
  minimumOrder: z.number().int().nonnegative(),
  expiresAt: z.string().nullable(),
  usageLimit: z.number().int().positive().nullable(),
  isActive: z.boolean(),
});