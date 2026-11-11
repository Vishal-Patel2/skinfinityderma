import { apiFetch } from "./api.service";
import { RichTreatment } from "@/types/treatment.types";
import { getTreatments as getLegacyTreatments, getTreatment as getLegacyTreatment, getCategories as getLegacyCategories } from "@/lib/api";

export interface TreatmentQueryParams {
  category?: string;
  featured?: boolean;
  limit?: number;
}

export const TreatmentsService = {
  /**
   * Fetch all treatments or filter by category
   */
  async getAll(params: TreatmentQueryParams = {}): Promise<RichTreatment[]> {
    const treatments = await getLegacyTreatments(params);
    return treatments || [];
  },

  /**
   * Fetch a single treatment with related treatments
   */
  async getBySlug(slug: string): Promise<{ treatment: RichTreatment; related: RichTreatment[] } | null> {
    return await getLegacyTreatment(slug);
  },

  /**
   * Fetch all treatment categories
   */
  async getCategories() {
    return await getLegacyCategories();
  },
};
