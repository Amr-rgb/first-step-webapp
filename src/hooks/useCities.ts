import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/api";

export interface City {
  id: number;
  name: {
    en: string;
    ar: string;
  };
}

export const useCities = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const response = await authService.getCities();
      return response.data as City[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't automatically retry on failure
  });

  return {
    cities: data || [],
    isLoading,
    error,
    refetch,
  };
};
