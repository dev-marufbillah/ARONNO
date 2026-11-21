"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 right-0 top-0 z-[150] h-0.5 origin-left bg-[#C4A265]"
        initial={reduceMotion ? false : { scaleX: 0, opacity: 1 }}
        animate={reduceMotion ? { opacity: 0 } : { scaleX: [0, 0.72, 1], opacity: [1, 1, 0] }}
        transition={{ duration: reduceMotion ? 0 : 0.55, times: [0, 0.72, 1], ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[140] flex items-center justify-center bg-[#11110F] text-[#F8F5EE]"
        initial={reduceMotion ? false : { opacity: 1 }}
        animate={
          reduceMotion
            ? { opacity: 0, visibility: "hidden" }
            : { opacity: [1, 1, 0], visibility: ["visible", "visible", "hidden"] }
        }
        transition={{ duration: reduceMotion ? 0 : 1, times: [0, 0.55, 1], ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col items-center">
          <span className="font-serif text-3xl tracking-[0.24em]">ARONNO</span>
          <span className="mt-5 flex items-center gap-2.5 text-[9px] font-medium uppercase tracking-[0.25em] text-[#D4B77E]">
            <span className="h-3 w-3 rounded-full border border-[#C4A265]/30 border-t-[#C4A265] motion-safe:animate-spin motion-reduce:animate-none" />
            Curating your collection
          </span>
        </div>
      </motion.div>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0.8, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
