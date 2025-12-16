"use server";

import { nurseryService, enrollmentService } from "@/services/api";

export async function getNurseriesAction(locale: string) {
  const result: any = await nurseryService.getNurseries(locale);
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
  return await nurseryService.getBranchesForCenter(centerId);
}

export async function getBranchPricingAction(
  branchId: string,
  centerId?: string
) {
  return await nurseryService.getBranchPricing(branchId, centerId);
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
  return await enrollmentService.createEnrollment(payload);
}
