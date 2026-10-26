"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { validateCoupon } from "@/lib/api";

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
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  clearCart: () => void;
}

const initialCartItems: CartItem[] = [
  {
    id: "cart-lhr-package",
    name: "Full Body Laser Hair Reduction (Soprano Titanium US-FDA)",
    slug: "laser-hair-reduction-noida",
    price: 39999,
    priceFormatted: "₹39,999",
    sessions: "6 Full Body Sessions",
    category: "Laser Treatments",
    image: "/images/treatments/banner-laser.webp",
    quantity: 1,
  },
  {
    id: "cart-hydrafacial",
    name: "Signature Sugarcane HydraFacial MD Glass Glow",
    slug: "sugarcane-hydrafacial-noida",
    price: 3499,
    priceFormatted: "₹3,499",
    sessions: "1 Clinical Session",
    category: "Medi-Facials",
    image: "/images/treatments/banner-hydrafacial.webp",
    quantity: 1,
  },
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>("DERMA10");
  const [discountPercent, setDiscountPercent] = useState<number>(10);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("skinfinity_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("skinfinity_cart", JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    const existing = items.find((i) => i.id === item.id);
    let updated: CartItem[];
    if (existing) {
      updated = items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updated = [...items, { ...item, quantity: 1 }];
    }
    saveCart(updated);
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    saveCart(updated);
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    const updated = items.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
    saveCart(updated);
  };

  const applyPromoCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const clean = code.trim().toUpperCase();
    if (!clean) return { success: false, message: "Please enter a coupon code." };

    try {
      const res = await validateCoupon({
        code: clean,
        treatmentSlugs: items.map((i) => i.slug),
        subtotal,
      });

      if (res && res.valid) {
        setDiscountCode(res.code || clean);
        const percent = res.discountPercent || (res.discountType === "percent" ? res.discountValue : undefined);
        if (typeof percent === "number" && percent > 0) {
          setDiscountPercent(percent);
        } else if (typeof res.discountAmount === "number" && subtotal > 0) {
          setDiscountPercent(Math.min(100, Math.round((res.discountAmount / subtotal) * 100)));
        } else {
          setDiscountPercent(10);
        }
        return { success: true, message: res.message || `${percent || 10}% Clinical Discount Applied!` };
      } else if (res && !res.valid && res.message) {
        return { success: false, message: res.message };
      }
    } catch {
      // fallback
    }

    // Static fallback for offline / standard test codes
    if (clean === "DERMA10" || clean === "SKIN10") {
      setDiscountCode(clean);
      setDiscountPercent(10);
      return { success: true, message: "10% Clinical Discount Applied!" };
    }
    if (clean === "VIP20") {
      setDiscountCode(clean);
      setDiscountPercent(20);
      return { success: true, message: "20% VIP Club Discount Applied!" };
    }
    return { success: false, message: "Invalid promo code. Try 'DERMA10'." };
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const discount = Math.round((subtotal * discountPercent) / 100);
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
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        applyPromoCode,
        clearCart,
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
