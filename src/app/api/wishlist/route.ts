import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { wishlists } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ ids: [] });
  }

  const userWishlist = await db
    .select({ productId: wishlists.productId })
    .from(wishlists)
    .where(eq(wishlists.userId, session.user.id));

  return NextResponse.json({
    ids: userWishlist.map((w) => w.productId),
  });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { productId } = body;
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  await db.insert(wishlists).values({
    userId: session.user.id,
    productId,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  await db
    .delete(wishlists)
    .where(
      and(
        eq(wishlists.userId, session.user.id),
        eq(wishlists.productId, productId)
      )
    );

  return NextResponse.json({ success: true });
}