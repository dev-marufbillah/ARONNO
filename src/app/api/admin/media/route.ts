import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", { extension: "jpg", signature: (bytes: Buffer) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff }],
  ["image/png", { extension: "png", signature: (bytes: Buffer) => bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) }],
  ["image/webp", { extension: "webp", signature: (bytes: Buffer) => bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" }],
]);

async function uploadToCloudinary(file: File, publicId: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const hasAnyCredentials = cloudName || apiKey || apiSecret;

  if (!hasAnyCredentials && process.env.NODE_ENV !== "production") return null;
  if (
    !cloudName ||
    !apiKey ||
    !apiSecret ||
    !/^[a-z0-9-]+$/i.test(cloudName)
  ) {
    throw new Error("Cloudinary image storage is not configured correctly.");
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "aronno";
  const signature = createHash("sha1")
    .update(`folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
  const uploadData = new FormData();
  uploadData.set("file", file);
  uploadData.set("api_key", apiKey);
  uploadData.set("folder", folder);
  uploadData.set("public_id", publicId);
  uploadData.set("timestamp", timestamp);
  uploadData.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: uploadData },
  );
  if (!response.ok) {
    console.error("Cloudinary image upload failed with status", response.status);
    throw new Error("Cloudinary could not store this image.");
  }

  const result = (await response.json()) as { secure_url?: unknown };
  if (typeof result.secure_url !== "string") {
    throw new Error("Cloudinary returned an invalid image URL.");
  }

  const imageUrl = new URL(result.secure_url);
  if (imageUrl.protocol !== "https:" || imageUrl.hostname !== "res.cloudinary.com") {
    throw new Error("Cloudinary returned an untrusted image URL.");
  }
  return imageUrl.toString();
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return Response.json({ message: "Sign in as an administrator to upload images." }, { status: 401 });
  }
  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (user?.role !== "ADMIN") {
    return Response.json({ message: "Administrator access is required." }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("Could not read uploaded image form data:", error);
    return Response.json({ message: "The image upload was not valid." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ message: "Choose an image file to upload." }, { status: 400 });
  }
  if (file.size < 1 || file.size > MAX_FILE_SIZE) {
    return Response.json({ message: "Image must be 4 MB or smaller." }, { status: 400 });
  }

  const fileType = allowedTypes.get(file.type);
  if (!fileType) {
    return Response.json({ message: "Only JPG, PNG and WebP images are supported." }, { status: 415 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!fileType.signature(bytes)) {
    return Response.json({ message: "The file content does not match its image type." }, { status: 415 });
  }

  const filename = randomUUID();
  try {
    const cloudinaryUrl = await uploadToCloudinary(file, filename);
    if (cloudinaryUrl) {
      return Response.json({ url: cloudinaryUrl }, { status: 201 });
    }
  } catch (error) {
    console.error("Could not upload image to Cloudinary:", error);
    return Response.json(
      { message: "Image storage is not configured or could not save this image." },
      { status: 503 },
    );
  }

  const localFilename = `${filename}.${fileType.extension}`;
  const uploadDirectory = path.join(process.cwd(), "public", "uploads");

  try {
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, localFilename), bytes, { flag: "wx" });
  } catch (error) {
    console.error("Could not persist uploaded image:", error);
    return Response.json({ message: "The server could not save this image." }, { status: 500 });
  }

  return Response.json({ url: `/uploads/${localFilename}` }, { status: 201 });
}
