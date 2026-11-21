import { z } from "zod";
import { validateCoupon } from "@/lib/coupons";

const requestSchema = z.object({
  code: z.string().trim().min(1).max(40),
  subtotal: z.number().int().nonnegative(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ message: "Enter a valid coupon code." }, { status: 400 });
  }

  const result = await validateCoupon(parsed.data.code, parsed.data.subtotal);
  if (!result.valid) {
    return Response.json({ message: result.message }, { status: 400 });
  }
  return Response.json({ code: result.code, discount: result.discount });
}
