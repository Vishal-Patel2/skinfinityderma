import { getDoctors as getLegacyDoctors } from "@/lib/api";
import { Doctor } from "@/types/doctor.types";

export const DoctorsService = {
  /**
   * Fetch all doctor profiles
   */
  async getAll(): Promise<Doctor[]> {
    const doctors = await getLegacyDoctors();
    return doctors || [];
  },

  /**
   * Find doctor by slug / id
   */
  async getById(id: string): Promise<Doctor | null> {
    const all = await this.getAll();
    return all.find((d) => d.id === id || d.id === `dr-${id}`) || null;
  },
};
