"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/components/providers/StoreProvider";
import { authClient } from "@/lib/auth-client";
import {
  adminProductSchema,
  adminCategorySchema,
  addressSchema,
  loginSchema,
  newsletterSchema,
  registerSchema,
} from "@/lib/validators";
import { getDeliveryFee } from "@/lib/utils";
import type { PaymentMethodKey } from "@/lib/store-settings";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-xs text-red-600">{message}</p>;
}

/* ==========================================================================
   NEWSLETTER FORM
   ========================================================================== */
export function NewsletterForm() {
  const [message, setMessage] = useState<string>("");
  const form = useForm<z.infer<typeof newsletterSchema>>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await response.json()) as { message?: string };
    setMessage(data.message ?? "Subscribed");
    if (response.ok) form.reset();
  });

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <Input placeholder="Your email address" {...form.register("email")} />
        <FieldError message={form.formState.errors.email?.message} />
      </div>
      <Button type="submit" className="h-12 min-w-40">Subscribe</Button>
      {message ? <p className="w-full text-xs text-ivory/70 sm:pt-3">{message}</p> : null}
    </form>
  );
}

/* ==========================================================================
   LOGIN FORM
   ========================================================================== */
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError("");
    try {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password.");
        return;
      }

      const response = await fetch("/api/auth/get-session", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Could not verify the new session.");
      }
      const session = (await response.json()) as { user?: { role?: string } } | null;
      router.push(session?.user?.role === "ADMIN" ? "/admin" : "/account");
      router.refresh();
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Could not sign in. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Input placeholder="Email address" type="email" {...form.register("email")} />
        <FieldError message={form.formState.errors.email?.message} />
      </div>
      <div>
        <Input placeholder="Password" type="password" {...form.register("password")} />
        <FieldError message={form.formState.errors.password?.message} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={form.formState.isSubmitting} className="h-12 w-full">
        {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}

/* ==========================================================================
   REGISTER FORM
   ========================================================================== */
export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError("");
    try {
      const result = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
        callbackURL: "/account",
      });

      if (result.error) {
        setError(result.error.message || "Registration failed.");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      setError("Could not create your account. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Input placeholder="Full name" {...form.register("name")} />
        <FieldError message={form.formState.errors.name?.message} />
      </div>
      <div>
        <Input placeholder="Email address" type="email" {...form.register("email")} />
        <FieldError message={form.formState.errors.email?.message} />
      </div>
      <div>
        <Input placeholder="Phone number" {...form.register("phone")} />
        <FieldError message={form.formState.errors.phone?.message} />
      </div>
      <div>
        <Input placeholder="Password" type="password" {...form.register("password")} />
        <FieldError message={form.formState.errors.password?.message} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={form.formState.isSubmitting} className="h-12 w-full">
        {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}

/* ==========================================================================
   FORGOT PASSWORD FORM
   ========================================================================== */
export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const form = useForm<z.infer<typeof newsletterSchema>>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async () => {
    setMessage("Password reset email architecture is prepared. Connect EMAIL_SERVER to enable delivery.");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Input placeholder="Email address" type="email" {...form.register("email")} />
        <FieldError message={form.formState.errors.email?.message} />
      </div>
      <Button type="submit" className="h-12 w-full">Send Reset Link</Button>
      {message ? <p className="text-sm text-black/60">{message}</p> : null}
    </form>
  );
}

/* ==========================================================================
   CHECKOUT FORM
   ========================================================================== */
const checkoutSchema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(11),
  paymentMethod: z.enum(["COD", "BKASH", "NAGAD", "SSLCOMMERZ"]),
  fullName: addressSchema.shape.fullName,
  division: addressSchema.shape.division,
  district: addressSchema.shape.district,
  area: addressSchema.shape.area,
  fullAddress: addressSchema.shape.fullAddress,
});

export function CheckoutForm({
  paymentMethods,
  freeDeliveryThreshold,
  standardDeliveryFee,
}: {
  paymentMethods: PaymentMethodKey[];
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
}) {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useStore();
  const [error, setError] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponSubtotal, setCouponSubtotal] = useState<number | null>(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const couponIsCurrent = couponSubtotal === subtotal;
  const currentCoupon = couponIsCurrent ? appliedCoupon : "";
  const discount = currentCoupon ? couponDiscount : 0;
  const deliveryFee = useMemo(
    () => getDeliveryFee(subtotal - discount, freeDeliveryThreshold, standardDeliveryFee),
    [subtotal, discount, freeDeliveryThreshold, standardDeliveryFee],
  );
  const total = subtotal - discount + deliveryFee;

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phoneNumber: "",
      fullName: "",
      division: "Dhaka",
      district: "Dhaka",
      area: "Gulshan",
      fullAddress: "",
      paymentMethod: paymentMethods[0] ?? "COD",
    },
  });

  async function applyCoupon() {
    setApplyingCoupon(true);
    setCouponMessage("");
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = (await response.json()) as { message?: string; code?: string; discount?: number };
      if (!response.ok || !data.code || typeof data.discount !== "number") {
        setAppliedCoupon("");
        setCouponDiscount(0);
        setCouponSubtotal(null);
        setCouponMessage(data.message ?? "This coupon could not be applied.");
        return;
      }
      setAppliedCoupon(data.code);
      setCouponDiscount(data.discount);
      setCouponSubtotal(subtotal);
      setCouponMessage(`${data.code} applied successfully.`);
    } catch (couponError) {
      console.error("Could not validate coupon:", couponError);
      setCouponMessage("Could not validate this coupon. Try again.");
    } finally {
      setApplyingCoupon(false);
    }
  }

  function removeCoupon() {
    setAppliedCoupon("");
    setCouponDiscount(0);
    setCouponSubtotal(null);
    setCouponMessage("");
  }

  const onSubmit = form.handleSubmit(async (values) => {
    if (!cart.length) {
      setError("Your bag is empty.");
      return;
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: values.customerName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        paymentMethod: values.paymentMethod,
        couponCode: currentCoupon || undefined,
        shippingAddress: {
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          email: values.email,
          division: values.division,
          district: values.district,
          area: values.area,
          fullAddress: values.fullAddress,
        },
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
      }),
    });

    const data = (await response.json()) as { message?: string; orderNumber?: string };
    if (!response.ok || !data.orderNumber) {
      setError(data.message ?? "Order failed.");
      return;
    }

    clearCart();
    router.push(`/order-confirmation/${data.orderNumber}`);
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-8">
        <section className="border border-black/10 p-6">
          <h2 className="text-2xl text-black-deep">Contact Information</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input placeholder="Full Name" {...form.register("customerName")} />
              <FieldError message={form.formState.errors.customerName?.message} />
            </div>
            <div>
              <Input placeholder="Email" type="email" {...form.register("email")} />
              <FieldError message={form.formState.errors.email?.message} />
            </div>
            <div>
              <Input placeholder="Phone Number" {...form.register("phoneNumber")} />
              <FieldError message={form.formState.errors.phoneNumber?.message} />
            </div>
          </div>
        </section>

        <section className="border border-black/10 p-6">
          <h2 className="text-2xl text-black-deep">Delivery Address</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input placeholder="Recipient Full Name" {...form.register("fullName")} />
              <FieldError message={form.formState.errors.fullName?.message} />
            </div>
            <div>
              <Input placeholder="Division" {...form.register("division")} />
              <FieldError message={form.formState.errors.division?.message} />
            </div>
            <div>
              <Input placeholder="District" {...form.register("district")} />
              <FieldError message={form.formState.errors.district?.message} />
            </div>
            <div>
              <Input placeholder="Area" {...form.register("area")} />
              <FieldError message={form.formState.errors.area?.message} />
            </div>
            <div className="md:col-span-2">
              <Input placeholder="Full Address" {...form.register("fullAddress")} />
              <FieldError message={form.formState.errors.fullAddress?.message} />
            </div>
          </div>
        </section>

        <section className="border border-black/10 p-6">
          <h2 className="text-2xl text-black-deep">Payment Method</h2>
          <div className="mt-5 grid gap-3">
            {paymentMethods.map((value) => (
              <label key={value} className="flex items-center gap-3 border border-black/10 px-4 py-4 text-sm">
                <input type="radio" value={value} {...form.register("paymentMethod")} />
                <span>{{
                  COD: "Cash on Delivery",
                  BKASH: "bKash",
                  NAGAD: "Nagad",
                  SSLCOMMERZ: "SSLCommerz",
                }[value]}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <aside className="h-fit border border-black/10 bg-[#fbfaf7] p-6">
        <h2 className="text-2xl text-black-deep">Order Summary</h2>
        <div className="mt-6 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 border-b border-black/10 pb-4 text-sm">
              <div>
                <p className="font-medium text-black-deep">{item.name}</p>
                <p className="text-black/50">Qty {item.quantity}</p>
              </div>
              <p className="text-black-deep">৳ {(item.price * item.quantity).toLocaleString("en-BD")}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 border-y border-black/10 py-4">
          <label htmlFor="checkout-coupon" className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/60">Discount code</label>
          <div className="flex gap-2">
            <Input id="checkout-coupon" placeholder="Enter code" value={couponInput} disabled={Boolean(currentCoupon)} onChange={(event) => setCouponInput(event.target.value.toUpperCase())} />
            {currentCoupon ? (
              <button type="button" onClick={removeCoupon} className="shrink-0 border border-black/15 px-3 text-xs font-semibold uppercase">Remove</button>
            ) : (
              <button type="button" disabled={!couponInput.trim() || applyingCoupon} onClick={() => void applyCoupon()} className="shrink-0 bg-neutral-900 px-3 text-xs font-semibold uppercase text-white disabled:opacity-50">{applyingCoupon ? "..." : "Apply"}</button>
            )}
          </div>
          {couponMessage || (appliedCoupon && !couponIsCurrent) ? (
            <p role="status" className={`mt-2 text-xs ${currentCoupon ? "text-emerald-700" : "text-red-600"}`}>
              {appliedCoupon && !couponIsCurrent ? "Cart changed. Apply the coupon again." : couponMessage}
            </p>
          ) : null}
        </div>
        <div className="mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between"><span>Subtotal</span><span>৳ {subtotal.toLocaleString("en-BD")}</span></div>
          {discount > 0 ? <div className="flex items-center justify-between text-emerald-700"><span>Discount ({currentCoupon})</span><span>− ৳ {discount.toLocaleString("en-BD")}</span></div> : null}
          <div className="flex items-center justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : `৳ ${deliveryFee.toLocaleString("en-BD")}`}</span></div>
          <div className="flex items-center justify-between border-t border-black/10 pt-3 text-base font-medium"><span>Total</span><span>৳ {total.toLocaleString("en-BD")}</span></div>
        </div>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={form.formState.isSubmitting} className="mt-6 h-12 w-full">
          {form.formState.isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </aside>
    </form>
  );
}

/* ==========================================================================
   ADMIN PRODUCT FORM (ADD + EDIT SUPPORT)
   ========================================================================== */
const adminFormSchema = adminProductSchema
  .extend({
    tagsText: z.string().optional(),
    specificationsText: z.string().optional(),
  })
  .omit({ tags: true, specifications: true });

interface AdminProductFormProps {
  categories: Array<{ id: string; name: string }>;
  initialData?: any;
}

export function AdminProductForm({ categories, initialData }: AdminProductFormProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  const specsToText = (specs: Record<string, string> | null | undefined) => {
    if (!specs || typeof specs !== "object") return "Origin: Bangladesh";
    return Object.entries(specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
  };

  const form = useForm<any>({
    resolver: zodResolver(adminFormSchema as any),
    defaultValues: {
      sku: initialData?.sku ?? "",
      brand: initialData?.brand ?? "",
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      categoryId: initialData?.categoryId ?? categories[0]?.id ?? "",
      subcategory: initialData?.subcategory ?? "",
      description: initialData?.description ?? "",
      shortDescription: initialData?.shortDescription ?? "",
      price: initialData?.price ?? 0,
      compareAtPrice: initialData?.compareAtPrice ?? 0,
      stockQuantity: initialData?.stockQuantity ?? 0,
      thumbnail:
        initialData?.thumbnail ??
        "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
      images:
        Array.isArray(initialData?.images) && initialData.images.length
          ? initialData.images
          : [
              initialData?.thumbnail ??
                "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
            ],
      rating: initialData?.rating ?? 0,
      reviewCount: initialData?.reviewCount ?? 0,
      featured: initialData?.featured ?? false,
      bestSeller: initialData?.bestSeller ?? false,
      newArrival: initialData?.newArrival ?? false,
      tagsText: Array.isArray(initialData?.tags)
        ? initialData.tags.join(", ")
        : "",
      specificationsText: specsToText(initialData?.specifications),
    },
  });

  const onSubmit = form.handleSubmit(async (values: any) => {
    setMessage("");
    setError("");

    const specs = Object.fromEntries(
      (values.specificationsText ?? "")
        .split("\n")
        .map((line: string) => line.trim())
        .filter(Boolean)
        .map((line: string) => {
          const [key, ...rest] = line.split(":");
          return [key.trim(), rest.join(":").trim() || "-"];
        }),
    );

    const url = isEdit ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          compareAtPrice: values.compareAtPrice || null,
          images: (values.images ?? []).filter(Boolean),
          tags: (values.tagsText ?? "")
            .split(",")
            .map((item: string) => item.trim())
            .filter(Boolean),
          specifications: specs,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Failed to save product.");
        return;
      }

      setMessage(data.message ?? (isEdit ? "Product updated!" : "Saved"));
      if (!isEdit) {
        form.reset();
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving the product.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4 border border-black/10 bg-[#fbfaf7] p-6 md:grid-cols-2">
      <div>
        <Input placeholder="SKU" {...form.register("sku")} />
        <FieldError message={form.formState.errors.sku?.message as string} />
      </div>
      <div>
        <Input placeholder="Brand" {...form.register("brand")} />
        <FieldError message={form.formState.errors.brand?.message as string} />
      </div>
      <div>
        <Input placeholder="Product Name" {...form.register("name")} />
        <FieldError message={form.formState.errors.name?.message as string} />
      </div>
      <div>
        <Input placeholder="Slug" {...form.register("slug")} />
        <FieldError message={form.formState.errors.slug?.message as string} />
      </div>

      <select className="h-12 border border-black/10 bg-white px-4 text-sm" {...form.register("categoryId")}>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <Input placeholder="Subcategory" {...form.register("subcategory")} />

      <div className="md:col-span-2">
        <Input placeholder="Thumbnail URL" {...form.register("thumbnail")} />
      </div>

      <div>
        <Input placeholder="Price" type="number" {...form.register("price", { valueAsNumber: true })} />
        <FieldError message={form.formState.errors.price?.message as string} />
      </div>
      <div>
        <Input placeholder="Compare at price" type="number" {...form.register("compareAtPrice", { valueAsNumber: true })} />
      </div>
      <div>
        <Input placeholder="Stock quantity" type="number" {...form.register("stockQuantity", { valueAsNumber: true })} />
        <FieldError message={form.formState.errors.stockQuantity?.message as string} />
      </div>
      <div>
        <Input placeholder="Image URL" {...form.register("images.0")} />
      </div>

      <div className="md:col-span-2">
        <Input placeholder="Short description" {...form.register("shortDescription")} />
      </div>
      <div className="md:col-span-2">
        <textarea
          className="min-h-28 w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
          placeholder="Description"
          {...form.register("description")}
        />
      </div>
      <div className="md:col-span-2">
        <Input placeholder="Tags separated by commas" {...form.register("tagsText")} />
      </div>
      <div className="md:col-span-2">
        <textarea
          className="min-h-28 w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
          placeholder="Specifications format: Key: Value"
          {...form.register("specificationsText")}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...form.register("featured")} /> Featured
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...form.register("bestSeller")} /> Best Seller
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...form.register("newArrival")} /> New Arrival
      </label>

      <div className="md:col-span-2 flex items-center gap-4">
        <Button type="submit" disabled={form.formState.isSubmitting} className="min-w-40">
          {form.formState.isSubmitting ? "Saving..." : isEdit ? "Update Product" : "Save Product"}
        </Button>
        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </form>
  );
}

/* ==========================================================================
   ADMIN CATEGORY FORM
   ========================================================================== */
export function AdminCategoryForm() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof adminCategorySchema>>({
    resolver: zodResolver(adminCategorySchema),
    defaultValues: { name: "", slug: "", description: "", imageUrl: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await response.json()) as { message?: string };
    setMessage(data.message ?? "Saved");
    if (response.ok) {
      form.reset();
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4 border border-black/10 bg-[#fbfaf7] p-6 md:grid-cols-2">
      <Input placeholder="Category Name (e.g. Smart Watches)" {...form.register("name")} />
      <Input placeholder="Slug (e.g. smart-watches)" {...form.register("slug")} />
      <div className="md:col-span-2">
        <Input placeholder="Image URL (Optional)" {...form.register("imageUrl")} />
      </div>
      <div className="md:col-span-2">
        <textarea
          className="min-h-20 w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
          placeholder="Description (Optional)"
          {...form.register("description")}
        />
      </div>
      <div className="md:col-span-2 flex items-center gap-4">
        <Button type="submit">Add Category</Button>
        {message ? <p className="text-sm text-black/60">{message}</p> : null}
      </div>
    </form>
  );
}