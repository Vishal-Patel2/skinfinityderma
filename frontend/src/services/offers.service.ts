import { getOffers, validateCoupon } from "@/lib/api";
import { ApiOffer, CouponResult } from "@/types/api.types";

export const OffersService = {
  /**
   * Fetch active monthly packages & seasonal offers
   */
  async getAll(): Promise<ApiOffer[]> {
    const offers = await getOffers();
    return offers || [];
  },

  /**
   * Validate discount coupon code
   */
  async validate(code: string, subtotal?: number, treatmentSlugs?: string[]): Promise<CouponResult | null> {
    return await validateCoupon({ code, subtotal, treatmentSlugs });
  },
};
