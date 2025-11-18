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
};
