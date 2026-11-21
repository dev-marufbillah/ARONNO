"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";

export interface StoreProductInput {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  thumbnail: string;
  stockQuantity: number;
}

export interface CartItem extends StoreProductInput {
  quantity: number;
}

interface StoreContextValue {
  cart: CartItem[];
  wishlistIds: string[];
  addToCart: (product: StoreProductInput) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  subtotal: number;
  clearCart: () => void;
}

const CART_KEY = "aronno-cart";
const WISHLIST_KEY = "aronno-wishlist";

const StoreContext = createContext<StoreContextValue | null>(null);

function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(CART_KEY);
  return stored ? (JSON.parse(stored) as CartItem[]) : [];
}

function getInitialWishlist(): string[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(WISHLIST_KEY);
  return stored ? (JSON.parse(stored) as string[]) : [];
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  const { data: session } = authClient.useSession();
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);
  const [wishlistIds, setWishlistIds] = useState<string[]>(getInitialWishlist);

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!session?.user) {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
      return;
    }

    const loadServerWishlist = async () => {
      try {
        const response = await fetch("/api/wishlist", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        setWishlistIds(Array.isArray(data?.ids) ? data.ids : []);
      } catch {
        // silently fail
      }
    };

    void loadServerWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  const addToCart = useCallback((product: StoreProductInput) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stockQuantity || 1) }
            : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  }, []);

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const exists = wishlistIds.includes(productId);

      if (session?.user) {
        const response = await fetch(
          `/api/wishlist${exists ? `?productId=${productId}` : ""}`,
          exists
            ? { method: "DELETE" }
            : {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
              },
        );

        if (response.ok) {
          setWishlistIds((current) =>
            exists
              ? current.filter((id) => id !== productId)
              : [...new Set([...current, productId])],
          );
        }
        return;
      }

      setWishlistIds((current) =>
        exists
          ? current.filter((id) => id !== productId)
          : [...new Set([...current, productId])],
      );
    },
    [session?.user, wishlistIds],
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      wishlistIds,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      toggleWishlist,
      isInWishlist: (productId: string) => wishlistIds.includes(productId),
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      clearCart,
    }),
    [addToCart, cart, clearCart, removeFromCart, toggleWishlist, updateCartQuantity, wishlistIds],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}