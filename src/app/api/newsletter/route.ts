import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { newsletterSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = newsletterSchema.safeParse(json);

  if (!parsed.success) {
    return Response.json({ message: "Valid email is required." }, { status: 400 });
  }

  await db.insert(newsletterSubscribers).values({ email: parsed.data.email }).onConflictDoNothing();
  return Response.json({ message: "You are now subscribed to the ARONNO newsletter." });
}
