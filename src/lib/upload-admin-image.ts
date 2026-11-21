export async function uploadAdminImage(file: File) {
  const body = new FormData();
  body.set("file", file);
  const response = await fetch("/api/admin/media", { method: "POST", body });
  const result = (await response.json()) as { url?: string; message?: string };
  if (!response.ok || !result.url) {
    throw new Error(result.message ?? "Image upload failed.");
  }
  return result.url;
}
