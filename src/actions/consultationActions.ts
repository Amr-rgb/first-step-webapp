"use server";

import { websiteConsultationService } from "@/services/consultationService";

export interface CenterConsultationPayload {
  mission_of_consultant_request?: string;
  email?: string;
  phone?: string;
  center_specification?: string;
  center_name?: string;
  description?: string;
  name_of_consultan_request?: string;
  subject_of_consultan?: string;
}

export interface ParentConsultationPayload {
  name?: string;
  email?: string;
  phone?: string;
  kind_of_user?: string;
  subject_of_consultation?: string;
  description?: string;
}

export async function sendCenterConsultationAction(
  payload: CenterConsultationPayload,
  fileFormData?: FormData
) {
  try {
    const fullPayload: any = { ...payload };

    if (fileFormData) {
      const file = fileFormData.get("file") as File | null;
      if (file) {
        fullPayload.file = file;
      }
    }

    const response = await websiteConsultationService.sendCenterConsultation(
      fullPayload
    );
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error sending center consultation:", error);
    return {
      success: false,
      error: error.message || "Failed to send consultation",
    };
  }
}

export async function sendParentConsultationAction(
  payload: ParentConsultationPayload,
  fileFormData?: FormData
) {
  try {
    const fullPayload: any = { ...payload };

    if (fileFormData) {
      const file = fileFormData.get("file") as File | null;
      if (file) {
        fullPayload.file = file;
      }
    }

    const response = await websiteConsultationService.sendParentConsultation(
      fullPayload
    );
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error sending parent consultation:", error);
    return {
      success: false,
      error: error.message || "Failed to send consultation",
    };
  }
}
