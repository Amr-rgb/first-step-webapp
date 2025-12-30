import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/dashboardApi";
import { useHasRole } from "@/store/authStore";

export type AdminChild = {
  id: number;
  name: string;
  gender: string;
  birthday_date: string;
};

export type AdminBooking = {
  id: number;
  center: string;
  branch: string;
  parent_name: string;
  start_date: string;
  end_date: string | null;
  price_amount: string;
  status: string;
  children: AdminChild[];
};

export const useAdminEnrollments = () => {
  const isAdmin = useHasRole("admin");

  const {
    data: enrollments,
    isLoading,
    error,
  } = useQuery<AdminBooking[]>({
    queryKey: ["adminEnrollments"],
    queryFn: adminService.getAdminEnrollments,
    enabled: isAdmin,
  });

  return {
    enrollments,
    isLoading,
    error,
  };
};
