const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.BETTER_AUTH_URL ||
  process.env.NEXTAUTH_URL ||
  (process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000");

if (!configuredSiteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be configured for production.");
}

const siteUrl = new URL(configuredSiteUrl);

if (process.env.NODE_ENV === "production" && siteUrl.protocol !== "https:") {
  throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production.");
}

export const SITE_URL = siteUrl.origin;
