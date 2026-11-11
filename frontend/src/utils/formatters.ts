/**
 * Common formatting and string utilities
 */

/**
 * Format a number as Indian Rupee currency (e.g. 1500 -> "₹1,500")
 */
export function formatPrice(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return "₹0";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

/**
 * Truncate long text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || "";
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Clean phone number to digits only for tel: and wa.me links
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}
