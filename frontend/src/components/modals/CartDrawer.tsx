"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  CreditCard,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { 
    isCartOpen, 
    closeCart, 
    items, 
    cartCount, 
    subtotal, 
    discount, 
    discountCode, 
    total, 
    removeItem, 
    updateQuantity, 
    applyPromoCode,
    clearCart,
    checkout
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = await Promise.resolve(applyPromoCode(promoInput));
    setPromoMsg({ success: res.success, text: res.message });
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const res = await checkout("UPI");
    setIsCheckingOut(false);
    if (res.success) {
      setCheckoutSuccess(true);
    } else {
      alert(res.error || "Unable to complete checkout. Please sign in or contact clinic support.");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] overflow-hidden">
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Slide-over Right Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
          
          {/* 1. Drawer Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-[#008081] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">Clinical Treatment Cart</h3>
                <p className="text-xs text-slate-500">
                  {cartCount} {cartCount === 1 ? "treatment package" : "treatment packages"} selected
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              aria-label="Close Cart"
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all shadow-sm border border-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Drawer Body (Items List) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {checkoutSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-[#008081] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 font-serif">
                  Clinical Booking Reserved!
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Your treatment package and priority doctor slot have been saved. Our senior clinic coordinator will call you to confirm your convenient timing.
                </p>
                <div className="pt-4 flex flex-col gap-2">
                  <Link
                    href="/account"
                    onClick={closeCart}
                    className="w-full py-2.5 rounded-xl bg-[#008081] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#006d6e] transition-all"
                  >
                    View in My Account Details
                  </Link>
                  <button
                    onClick={() => {
                      setCheckoutSuccess(false);
                      clearCart();
                      closeCart();
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Done &amp; Close
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-800">Your Cart is Empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse our popular clinical laser, skin rejuvenation and hair loss treatments to add them to your cart.
                </p>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 rounded-xl bg-[#008081] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#006d6e] transition-all"
                >
                  Explore Clinical SKUs
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 flex gap-3 relative group hover:border-[#008081]/40 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#008081] uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{item.sessions}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {item.priceFormatted}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-white rounded-lg border border-slate-200 px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 rounded hover:bg-slate-100 text-slate-600 flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 rounded hover:bg-slate-100 text-slate-600 flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Quick Promo Code Input */}
            {items.length > 0 && !checkoutSuccess && (
              <div className="pt-2">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. DERMA10)"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none uppercase font-semibold focus:border-[#008081]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-[#008081] text-white text-xs font-bold transition-all"
                  >
                    Apply
                  </button>
                </form>
                {promoMsg && (
                  <p className={`text-[11px] mt-1.5 ${promoMsg.success ? "text-teal-700" : "text-rose-600"}`}>
                    {promoMsg.text}
                  </p>
                )}
              </div>
            )}

          </div>

          {/* 3. Drawer Footer (Price Breakdown & CTA) */}
          {items.length > 0 && !checkoutSuccess && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-3">
              
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Clinical Package Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-teal-700 font-medium">
                    <span>Clinical Promo ({discountCode})</span>
                    <span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Medical Consultation &amp; GST</span>
                  <span className="text-teal-700 font-semibold">Included</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-base text-[#008081]">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* EMI Option Available Hint */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                <span>0% Interest EMI available starting at ₹{(total / 6).toFixed(0)}/mo.</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isCheckingOut ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm &amp; Book Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400">
                100% US-FDA Approved Protocols • Supervised by Senior MD Dermatologists
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
