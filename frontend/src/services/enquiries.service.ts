import { postAppointment, postEnquiry, getSlots } from "@/lib/api";
import { AppointmentPayload, EnquiryPayload, SlotsResponse } from "@/types/api.types";

export const EnquiriesService = {
  /**
   * Submit new clinical appointment request
   */
  async submitAppointment(payload: AppointmentPayload) {
    return await postAppointment(payload);
  },

  /**
   * Submit general contact / franchise / lead inquiry
   */
  async submitEnquiry(payload: EnquiryPayload) {
    return await postEnquiry(payload);
  },

  /**
   * Fetch available doctor / clinic slots for given date
   */
  async getAvailableSlots(clinicId: number | string, date: string): Promise<SlotsResponse | null> {
    return await getSlots(clinicId, date);
  },
};
