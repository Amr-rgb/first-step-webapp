"use server";

import { promoCodeService } from "@/services/dashboardApi";

export async function applyPromoCodeAction(payload: {
  branch_price_id: number;
  branch_id: number;
  promo_code: string;
  child_count: number;
}) {
  return await promoCodeService.applyPromoCode(payload);
}
