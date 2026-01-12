/**
 * Format number with comma as thousands separator
 * @param value - Number or string to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with comma separator (e.g., "1,400" or "1,400.42")
 */
export const formatNumber = (
  value: number | string | null | undefined,
  decimals: number = 0
): string => {
  if (value === null || value === undefined) return "0";

  // Convert to number if string
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Check if valid number
  if (isNaN(numValue)) return "0";

  // Format with comma as thousands separator
  return numValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format number with comma separator and currency symbol
 * @param value - Number or string to format
 * @param currency - Currency symbol (default: "₽")
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "1,400.42 ₽")
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  currency: string = "₽",
  decimals: number = 2
): string => {
  const formatted = formatNumber(value, decimals);
  return `${formatted} ${currency}`;
};
