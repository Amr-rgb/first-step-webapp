import { apiClient } from "./api";
import { ApiErrorHandler } from "@/lib/error-handling";

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
};
