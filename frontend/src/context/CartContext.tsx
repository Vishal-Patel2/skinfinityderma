"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceFormatted: string;
  sessions: string;
  category: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  discountCode: string | null;
  total: number;
  isCartOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => Promise<boolean>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (paymentMethod?: string, clinicId?: number, notes?: string) => Promise<{ success: boolean; order?: any; error?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, token, openAuthModal } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [backendDiscount, setBackendDiscount] = useState<number>(0);

  const getBackendUrl = () => {
    if (typeof window !== "undefined") {
      if (window.location.port === "3000") return "http://localhost:4000";
      const envUrl = process.env.NEXT_PUBLIC_API_URL || "";
      if (envUrl) {
        return envUrl.replace(/\/api\/public\/?$/, "").replace(/\/api\/?$/, "");
      }
      return window.location.origin;
    }
    return "http://localhost:4000";
  };

  // Helper to map backend items to frontend CartItem interface
  const mapBackendItems = (rawItems: any[]): CartItem[] => {
    if (!Array.isArray(rawItems)) return [];
    return rawItems.map((it: any) => ({
      id: String(it.id || it.itemId || it.treatment_id),
      name: it.name || it.itemName || it.item_name || "Clinical Treatment",
      slug: it.slug || it.itemSlug || it.item_slug || "treatment",
      price: Number(it.price || 0),
      priceFormatted: `₹${Number(it.price || 0).toLocaleString("en-IN")}`,
      sessions: it.sessionInfo || it.session_info || "1 Clinical Session",
      category: it.category || "Dermatology",
      image: it.image || it.imageUrl || it.image_url || "/images/treatments/banner-laser.webp",
      quantity: Number(it.quantity || 1),
    }));
  };

  // Fetch cart directly from backend API for logged-in user
  const fetchCartFromBackend = useCallback(async (authToken: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${getBackendUrl()}/api/cart`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        const mapped = mapBackendItems(data.data.items);
        setItems(mapped);
        setDiscountCode(data.data.discountCode || null);
        setBackendDiscount(Number(data.data.discount || 0));
        try {
          localStorage.setItem("skinfinity_cart", JSON.stringify(mapped));
        } catch (e) {}
      }
    } catch (err) {
      console.warn("Failed to fetch cart from backend:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // When auth state changes, synchronize cart with backend or clear for guests
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchCartFromBackend(token);

      // Check if a pending item was queued by a guest before sign-in
      try {
        const pendingRaw = localStorage.getItem("skinfinity_pending_cart_item");
        if (pendingRaw) {
          localStorage.removeItem("skinfinity_pending_cart_item");
          const pendingItem = JSON.parse(pendingRaw);
          if (pendingItem && (pendingItem.id || pendingItem.slug)) {
            // Auto add to cart now that user is authenticated
            fetch(`${getBackendUrl()}/api/cart/add`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                treatmentId: pendingItem.id || pendingItem.slug,
                quantity: 1,
              }),
            })
              .then((res) => res.json())
              .then((resData) => {
                if (resData && resData.success && resData.data) {
                  setItems(mapBackendItems(resData.data.items));
                  setDiscountCode(resData.data.discountCode || null);
                  setBackendDiscount(Number(resData.data.discount || 0));
                  setIsCartOpen(true);
                }
              })
              .catch(() => {});
          }
        }
      } catch (e) {}
    } else {
      // Guest: strictly clear active cart so guest users cannot browse or see another's items
      setItems([]);
      setDiscountCode(null);
      setBackendDiscount(0);
      try {
        localStorage.removeItem("skinfinity_cart");
      } catch (e) {}
    }
  }, [isLoggedIn, token, fetchCartFromBackend]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  /**
   * BUSINESS RULE: NO GUEST CAN ADD TO CART.
   * If not logged in: store pending item, open auth modal, return false.
   */
  const addItem = async (item: Omit<CartItem, "quantity">): Promise<boolean> => {
    if (!isLoggedIn || !token) {
      try {
        localStorage.setItem("skinfinity_pending_cart_item", JSON.stringify(item));
      } catch (e) {}
      openAuthModal("signin", "Please sign in or create an account to add treatments to your cart.");
      return false;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${getBackendUrl()}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          treatmentId: item.id || item.slug,
          quantity: 1,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        // Fallback for offline demo tokens
        const existing = items.find((i) => i.id === item.id || i.slug === item.slug);
        let updated: CartItem[];
        if (existing) {
          updated = items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          updated = [...items, { ...item, quantity: 1 }];
        }
        setItems(updated);
        try {
          localStorage.setItem("skinfinity_cart", JSON.stringify(updated));
        } catch (e) {}
        setIsCartOpen(true);
        return true;
      }

      setItems(mapBackendItems(resData.data.items));
      setDiscountCode(resData.data.discountCode || null);
      setBackendDiscount(Number(resData.data.discount || 0));
      setIsCartOpen(true);
      return true;
    } catch (err) {
      console.error("Cart add error", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    try {
      localStorage.setItem("skinfinity_cart", JSON.stringify(updated));
    } catch (e) {}

    if (token && !token.startsWith("demo-")) {
      try {
        const res = await fetch(`${getBackendUrl()}/api/cart/item/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const resData = await res.json();
        if (resData && resData.success && resData.data) {
          setItems(mapBackendItems(resData.data.items));
          setDiscountCode(resData.data.discountCode || null);
          setBackendDiscount(Number(resData.data.discount || 0));
        }
      } catch (e) {}
    }
  };

  const updateQuantity = async (id: string, qty: number) => {
    if (qty <= 0) {
      await removeItem(id);
      return;
    }

    const updated = items.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
    setItems(updated);
    try {
      localStorage.setItem("skinfinity_cart", JSON.stringify(updated));
    } catch (e) {}

    if (token && !token.startsWith("demo-")) {
      try {
        const res = await fetch(`${getBackendUrl()}/api/cart/item/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: qty }),
        });
        const resData = await res.json();
        if (resData && resData.success && resData.data) {
          setItems(mapBackendItems(resData.data.items));
          setDiscountCode(resData.data.discountCode || null);
          setBackendDiscount(Number(resData.data.discount || 0));
        }
      } catch (e) {}
    }
  };

  const applyPromoCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const clean = code.trim().toUpperCase();
    if (!clean) return { success: false, message: "Please enter a coupon code." };

    if (token && !token.startsWith("demo-")) {
      try {
        const res = await fetch(`${getBackendUrl()}/api/cart/apply-coupon`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code: clean }),
        });
        const resData = await res.json();
        if (res.ok && resData.success && resData.data) {
          setDiscountCode(clean);
          setBackendDiscount(Number(resData.data.discount || 0));
          return { success: true, message: resData.message || `Coupon ${clean} applied!` };
        } else {
          return { success: false, message: resData.message || "Invalid coupon code." };
        }
      } catch (e) {}
    }

    // Offline demo fallback
    if (clean === "DERMA10" || clean === "SKIN10") {
      setDiscountCode(clean);
      setBackendDiscount(Math.round(subtotal * 0.1));
      return { success: true, message: "10% Clinical Discount Applied!" };
    }
    if (clean === "VIP20") {
      setDiscountCode(clean);
      setBackendDiscount(Math.round(subtotal * 0.2));
      return { success: true, message: "20% VIP Club Discount Applied!" };
    }
    return { success: false, message: "Invalid promo code. Try 'DERMA10'." };
  };

  const removePromoCode = async () => {
    setDiscountCode(null);
    setBackendDiscount(0);
    if (token && !token.startsWith("demo-")) {
      try {
        await fetch(`${getBackendUrl()}/api/cart/remove-coupon`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {}
    }
  };

  const clearCart = async () => {
    setItems([]);
    setDiscountCode(null);
    setBackendDiscount(0);
    try {
      localStorage.removeItem("skinfinity_cart");
    } catch (e) {}

    if (token && !token.startsWith("demo-")) {
      try {
        await fetch(`${getBackendUrl()}/api/cart/clear`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {}
    }
  };

  const checkout = async (
    paymentMethod: string = "UPI",
    clinicId?: number,
    notes?: string
  ): Promise<{ success: boolean; order?: any; error?: string }> => {
    if (!isLoggedIn || !token) {
      openAuthModal("signin", "Please sign in to confirm and checkout your treatment package.");
      return { success: false, error: "Authentication required" };
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${getBackendUrl()}/api/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod,
          clinicId: clinicId || 1,
          notes: notes || "Online treatment booking",
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, error: resData.message || "Failed to process checkout" };
      }

      setItems([]);
      setDiscountCode(null);
      setBackendDiscount(0);
      try {
        localStorage.removeItem("skinfinity_cart");
      } catch (e) {}

      return { success: true, order: resData.data };
    } catch (err: any) {
      return { success: false, error: "Network error during checkout" };
    } finally {
      setIsLoading(false);
    }
  };

  const cartCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const discount = backendDiscount > 0 ? backendDiscount : (discountCode ? Math.round(subtotal * 0.1) : 0);
  const total = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        discount,
        discountCode,
        total,
        isCartOpen,
        isLoading,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        applyPromoCode,
        removePromoCode,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
