"use server";

import { establishmentService, enrollmentService } from "@/services/api";

export async function getNurseriesAction(locale: string) {
  const result: any = await establishmentService.getEstablishments(locale);
  // Unwrap data if wrapped
  if (result && Array.isArray(result.data)) {
    return result.data;
  }
  if (result && Array.isArray(result)) {
    return result;
  }
  return result;
}

export async function getBranchesForCenterAction(centerId: string) {
  return await establishmentService.getBranchesForCenter(centerId);
}

export async function getBranchPricingAction(
  branchId: string,
  centerId?: string,
) {
  return await establishmentService.getBranchPricing(branchId, centerId);
}

export async function getCenterPromocodesAction(centerId: string) {
  const result = await establishmentService.getCenterPromocodes(centerId);
  return result?.data || [];
}

export async function getCenterBlogsAction(centerId: string) {
  const result = await establishmentService.getCenterBlogs(centerId);
  return result?.data || [];
}

export async function getCenterAdsAction(centerId: string) {
  return await establishmentService.getCenterAds(centerId);
}

export async function createExistingEnrollmentAction(payload: {
  center_branch_id: number | string;
  branch_price_id: number | string;
  children: Array<number | string>;
}) {
  return await enrollmentService.createExistingEnrollment(payload);
}

export async function createEnrollmentAction(payload: {
  center_branch_id: number;
  branch_price_id: number;
  parent_phone: string;
  children: number[];
  title?: string;
  day_string?: string;
  starting_time?: string;
  starting_date?: string;
}) {
  console.log(
    "[createEnrollmentAction] Starting enrollment creation with payload:",
    payload,
  );
  try {
    const result = await enrollmentService.createEnrollment(payload);
    console.log(
      "[createEnrollmentAction] Enrollment created successfully:",
      result,
    );
    return result;
  } catch (error) {
    console.error("[createEnrollmentAction] Error creating enrollment:", error);
    throw error;
  }
}
