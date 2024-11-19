export const COUPON_CODES = {
  BFRIDAY: "BFRIDAY",
  XMAS2024: "XMAS2021",
  NY2022: "NY2022",
} as const;

export type CouponCode = keyof typeof COUPON_CODES;
