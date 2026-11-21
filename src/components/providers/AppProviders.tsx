"use client";

import type { ReactNode } from "react";
import AuthProvider from "@/components/providers/AuthProvider";
import StoreProvider from "@/components/providers/StoreProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>{children}</StoreProvider>
    </AuthProvider>
  );
}
