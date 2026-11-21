"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Search, User, Heart, ShoppingBag, ChevronRight } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  tagline: string;
  navLinks: ReadonlyArray<{ label: string; href: string; image: string }>;
}

const secondaryItems = [
  { label: "Search", href: "/search", icon: Search },
  { label: "My Account", href: "/account", icon: User },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Shopping Bag", href: "/cart", icon: ShoppingBag },
];

export default function MobileMenu({ isOpen, onClose, brandName, tagline, navLinks }: MobileMenuProps) {
  const menuItems = [{ label: "Home", href: "/" }, ...navLinks];
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black-deep/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Menu Panel */}
          <motion.div
            className="absolute inset-0 bg-black-deep flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
              <Link
                href="/"
                onClick={onClose}
                className="font-serif text-[22px] font-semibold tracking-[0.08em] text-ivory"
              >
                {brandName}
              </Link>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 text-ivory/70 hover:text-ivory transition-colors"
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + index * 0.05,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between py-4 font-serif text-[18px] text-ivory/90 hover:text-gold transition-colors duration-300"
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={18} strokeWidth={1.5} className="text-ivory/30" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Divider */}
              <div className="my-8 h-px bg-white/10" />

              {/* Secondary Links */}
              <nav className="space-y-1">
                {secondaryItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.4 + index * 0.05,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-4 py-3.5 font-sans text-[14px] tracking-wide text-ivory/60 hover:text-gold transition-colors duration-300"
                    >
                      <item.icon size={18} strokeWidth={1.5} />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="px-6 py-6 border-t border-white/10">
              <p className="font-sans text-[11px] tracking-luxury uppercase text-ivory/30">
                {tagline}
              </p>
              <p className="mt-1 font-sans text-[11px] text-ivory/20">
                {BRAND.city}, {BRAND.country}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
