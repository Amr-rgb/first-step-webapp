import { ApiErrorHandler } from "@/lib/error-handling";
import { apiClient } from "./api";

export const websiteConsultationService = {
  sendCenterConsultation: async (payload: {
    mission_of_consultant_request?: string;
    email?: string;
    phone?: string;
    center_specification?: string;
    center_name?: string;
    file?: File;
    description?: string;
    name_of_consultan_request?: string;
    subject_of_consultan?: string;
  }) => {
    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      const response = await apiClient.post("/center-consultations", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  sendParentConsultation: async (payload: {
    name?: string;
    email?: string;
    phone?: string;
    kind_of_user?: string;
    subject_of_consultation?: string;
    file?: File;
    description?: string;
  }) => {
    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      const response = await apiClient.post("/consultants", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
};
