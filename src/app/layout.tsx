import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import Navbar from "@/components/layout/Navbar";
import AppProviders from "@/components/providers/AppProviders";
import { getCategories } from "@/lib/storefront";
import { NAV_LINKS } from "@/lib/constants";
import { heroImage } from "@/lib/demo-data";
import { getStoreAdminConfig } from "@/lib/store-settings";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ARONNO — Luxury Lifestyle, Curated.",
    template: "%s | ARONNO",
  },
  description:
    "ARONNO brings carefully curated luxury lifestyle products together in one refined destination. Premium perfumes, watches, eyewear, bags and jewelry in Dhaka, Bangladesh.",
  openGraph: {
    title: "ARONNO — Luxury Lifestyle, Curated.",
    description: "Curated luxury lifestyle products for those who appreciate the finer things.",
    siteName: "ARONNO",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [{ site }, categories] = await Promise.all([
    getStoreAdminConfig(),
    getCategories().catch((error) => {
      console.error("Could not load navigation categories.", error);
      return [];
    }),
  ]);
  const navLinks = [
    { label: "Shop", href: "/shop", image: NAV_LINKS[0].image },
    { label: "New Arrivals", href: "/new-arrivals", image: NAV_LINKS[1].image },
    ...categories
      .filter((category) => category.showInNav)
      .map((category) => ({
        label: category.name,
        href: `/category/${category.slug}`,
        image:
          category.imageUrl ??
          NAV_LINKS.find((link) => link.href === `/category/${category.slug}`)?.image ??
          heroImage,
      })),
  ];

  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="bg-white font-sans text-black-deep antialiased">
        <AppProviders>
          <AnnouncementBar enabled={site.announcementEnabled} text={site.announcementText} />
          <Navbar brandName={site.brandName} tagline={site.tagline} navLinks={navLinks} />
          <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
          <Footer siteSettings={site} />
          <MobileBottomNav />
        </AppProviders>
      </body>
    </html>
  );
}