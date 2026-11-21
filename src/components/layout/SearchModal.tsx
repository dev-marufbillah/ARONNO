"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";
import { CATEGORIES } from "@/lib/constants";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      handleClose();
    }
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/category/${slug}`);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex flex-col justify-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full border-b border-gray-200 bg-white py-10 shadow-2xl"
          >
            <Container>
              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-black-deep"
                  aria-label="Close search"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleSearch} className="mt-2">
                <div className="relative flex items-center border-b-2 border-black-deep/10 pb-4 transition-colors focus-within:border-black-deep">
                  <Search size={28} className="mr-4 shrink-0 text-gray-400" strokeWidth={1.5} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for Perfume, Watches, Eyewear..."
                    className="w-full bg-transparent font-serif text-2xl text-black-deep outline-none placeholder:text-gray-300 md:text-4xl"
                  />
                  {query && (
                    <button
                      type="submit"
                      className="ml-4 flex shrink-0 items-center gap-2 rounded-full bg-black-deep px-6 py-3 text-xs uppercase tracking-widest text-white transition-all hover:bg-gold"
                    >
                      Search <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Popular Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.slice(0, 6).map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="border border-gray-200 px-4 py-2 text-xs uppercase tracking-widest text-gray-700 transition-all hover:border-black-deep hover:bg-black-deep hover:text-white"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </Container>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}