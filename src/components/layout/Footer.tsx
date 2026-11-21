"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants";
import Container from "@/components/ui/Container";
import type { SiteSettings } from "@/lib/store-settings";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  PinterestIcon,
} from "@/components/ui/SocialIcons";

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-sans text-[11px] tracking-luxury uppercase text-ivory/50 mb-6">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={`${link.href}-${index}`}>
            {/^https?:\/\//i.test(link.href) ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[13px] text-ivory/70 hover:text-gold transition-colors duration-300"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="font-sans text-[13px] text-ivory/70 hover:text-gold transition-colors duration-300"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({
  siteSettings,
}: {
  siteSettings: SiteSettings;
}) {
  const pathname = usePathname();

  // Admin পেজে Footer দেখাবে না
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-black-deep text-ivory pt-20 pb-8">
      <Container>
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label={BRAND.name}>
              <h3 className="font-serif text-[24px] font-semibold tracking-[0.08em] text-ivory">
                {siteSettings.brandName}
              </h3>
            </Link>
            <p className="mt-3 font-sans text-[12px] italic text-ivory/40">
              {siteSettings.tagline}
            </p>
            <p className="mt-1 font-sans text-[12px] text-ivory/30">
              {siteSettings.footerLocation}
            </p>
          </div>

          {/* Shop */}
          <FooterLinkGroup title={siteSettings.footerShopTitle} links={siteSettings.footerShopLinks} />

          {/* About */}
          <FooterLinkGroup title={siteSettings.footerAboutTitle} links={siteSettings.footerAboutLinks} />

          {/* Customer Care */}
          <FooterLinkGroup
            title={siteSettings.footerCustomerCareTitle}
            links={siteSettings.footerCustomerCareLinks}
          />

          {/* Contact */}
          <div>
            <h4 className="font-sans text-[11px] tracking-luxury uppercase text-ivory/50 mb-6">
              {siteSettings.footerContactTitle}
            </h4>
            <ul className="space-y-3">
              <li className="font-sans text-[13px] text-ivory/70">
                {siteSettings.contactAddress}
              </li>
              <li>
                <a
                  href={`mailto:${siteSettings.contactEmail}`}
                  className="font-sans text-[13px] text-ivory/70 hover:text-gold transition-colors duration-300"
                >
                  {siteSettings.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteSettings.contactPhone}`}
                  className="font-sans text-[13px] text-ivory/70 hover:text-gold transition-colors duration-300"
                >
                  {siteSettings.contactPhone}
                </a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href={siteSettings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 hover:text-gold transition-colors duration-300"
                aria-label="Facebook"
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 hover:text-gold transition-colors duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={siteSettings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 hover:text-gold transition-colors duration-300"
                aria-label="YouTube"
              >
                <YoutubeIcon size={18} />
              </a>
              <a
                href={siteSettings.pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 hover:text-gold transition-colors duration-300"
                aria-label="Pinterest"
              >
                <PinterestIcon size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 mb-6 h-px bg-ivory/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[11px] text-ivory/30">
            © {new Date().getFullYear()} {siteSettings.brandName}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            {siteSettings.footerLegalLinks.map((link, index) => (
              /^https?:\/\//i.test(link.href) ? (
                <a
                  key={`${link.href}-${index}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[11px] text-ivory/30 hover:text-ivory/60 transition-colors duration-300"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={`${link.href}-${index}`}
                  href={link.href}
                  className="font-sans text-[11px] text-ivory/30 hover:text-ivory/60 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}