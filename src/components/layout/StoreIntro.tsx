"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function StoreIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#10100F] px-6 text-center text-[#F8F5EE]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0], visibility: ["visible", "visible", "hidden"] }}
      transition={{ duration: 1.9, times: [0, 0.72, 1], ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute left-1/2 top-1/2 h-[min(70vw,34rem)] w-[min(70vw,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C4A265]/10" />
      <div className="absolute left-1/2 top-1/2 h-[min(54vw,26rem)] w-[min(54vw,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C4A265]/15" />
      <div className="relative max-w-3xl">
        <motion.p
          className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#D4B77E] sm:text-xs"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          className="mt-5 font-serif text-4xl tracking-[0.12em] sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.5 }}
        >
          {description}
        </motion.p>
        <motion.div
          className="mx-auto mt-8 h-px w-20 origin-center bg-[#C4A265]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
        <p className="mt-5 text-[9px] uppercase tracking-[0.28em] text-white/45 sm:text-[10px]">
          Perfume <span className="mx-2 text-[#C4A265]">•</span>
          Watches <span className="mx-2 text-[#C4A265]">•</span>
          Bags <span className="mx-2 text-[#C4A265]">•</span>
          Jewelry
        </p>
      </div>
    </motion.div>
  );
}
