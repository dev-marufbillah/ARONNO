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
        initial={reduceMotion ? false : { opacity: 0.8, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
