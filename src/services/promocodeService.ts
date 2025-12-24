import { apiClient } from "./api";
import { ApiErrorHandler } from "@/lib/error-handling";

export const websiteService = {
  getPromocodes: async () => {
    try {
      const response = await apiClient.get("/coupons");
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getExternalOffers: async () => {
    try {
      const response = await apiClient.get("/external-show/public");
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
};

export const adminService = {
  getPromocodes: async () => {
    try {
      const response = await apiClient.get("/promocodes");
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getPromocode: async (id: string) => {
    try {
      const response = await apiClient.get(`/promocodes/${id}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  createPromocode: async (payload: {
    title: string;
    description: string;
    percentage: number;
    start_date: string;
    end_date: string;
    max_number_of_usage: number;
    kind_of_child: string;
    status: string;
    color: string;
    amount: number;
    center_ids: number[];
    branch_ids: number[];
  }) => {
    try {
      const response = await apiClient.post("/promocodes", payload);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updatePromocode: async (
    id: string,
    payload: {
      title?: string;
      description?: string;
      percentage?: number;
      start_date?: string;
      end_date?: string;
      max_number_of_usage?: number;
      kind_of_child?: string;
      status?: string;
      color?: string;
      amount?: number;
      center_ids?: number[];
      branch_ids?: number[];
    }
  ) => {
    try {
      const response = await apiClient.post(`/promocodes/${id}`, payload);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateStatus: async (
    id: string,
    payload: {
      status: "active" | "inactive";
    }
  ) => {
    try {
      const response = await apiClient.put(`/promocodes/${id}`, payload);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  checkPromocodeExists: async (title: string) => {
    try {
      // Use apiClient to ensure proper authentication headers are included
      const formData = new FormData();
      formData.append('title', title);
      
      const response = await apiClient.post('/promocodes/check-exists', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error checking promocode existence:', error);
      throw ApiErrorHandler.handle(error);
    }
  },

  createExternalOffer: async (payload: {
    center_name: string;
    address: string;
    descriptions: string;
    money_details: string;
    time_details: string;
    additional_details: string;
    url: string;
    photos: File[];
  }) => {
    try {
      const formData = new FormData();

      // Append text fields
      formData.append("center_name", payload.center_name);
      formData.append("address", payload.address);
      formData.append("descriptions", payload.descriptions);
      formData.append("money_details", payload.money_details);
      formData.append("time_details", payload.time_details);
      formData.append("additional_details", payload.additional_details);
      formData.append("url", payload.url);

      // Append multiple images
      payload.photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo);
      });

      const response = await apiClient.post(
        "/dashboard/external-show",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateExternalOffer: async (
    id: string,
    payload: {
      center_name?: string;
      address?: string;
      descriptions?: string;
      money_details?: string;
      time_details?: string;
      additional_details?: string;
      url?: string;
      photos?: File[];
    }
  ) => {
    try {
      const formData = new FormData();

      // Append text fields only if they are provided
      if (payload.center_name !== undefined) {
        formData.append("center_name", payload.center_name);
      }
      if (payload.address !== undefined) {
        formData.append("address", payload.address);
      }
      if (payload.descriptions !== undefined) {
        formData.append("descriptions", payload.descriptions);
      }
      if (payload.money_details !== undefined) {
        formData.append("money_details", payload.money_details);
      }
      if (payload.time_details !== undefined) {
        formData.append("time_details", payload.time_details);
      }
      if (payload.additional_details !== undefined) {
        formData.append("additional_details", payload.additional_details);
      }
      if (payload.url !== undefined) {
        formData.append("url", payload.url);
      }

      // Append multiple images if provided
      if (payload.photos && payload.photos.length > 0) {
        payload.photos.forEach((photo, index) => {
          formData.append(`photos[${index}]`, photo);
        });
      }

      const response = await apiClient.post(
        `/dashboard/external-show/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  archiveExternalOffer: async (id: string) => {
    try {
      const response = await apiClient.put(
        `/dashboard/external-show/archive/${id}`
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  restoreExternalOffer: async (id: string) => {
    try {
      const response = await apiClient.put(
        `/dashboard/external-show/active/${id}`
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  deleteExternalOffer: async (id: string) => {
    try {
      const response = await apiClient.delete(`/dashboard/external-show/${id}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getExternalOffers: async () => {
    try {
      const response = await apiClient.get(`/dashboard/external-show`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
};
