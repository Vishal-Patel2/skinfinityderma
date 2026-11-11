import { getBanners, getTrustBadges, getHomepageData } from "@/lib/api";
import { ApiBanner, HomepageData } from "@/types/api.types";

export const BannersService = {
  /**
   * Fetch homepage banners
   */
  async getBanners(location?: string): Promise<ApiBanner[]> {
    const banners = await getBanners(location);
    return banners || [];
  },

  /**
   * Fetch trust badges
   */
  async getTrustBadges() {
    return await getTrustBadges();
  },

  /**
   * Fetch complete homepage CMS sections
   */
  async getHomepageData(): Promise<HomepageData | null> {
    return await getHomepageData();
  },
};
