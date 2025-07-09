import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { centerService, adminService } from "@/services/dashboardApi";
import { ApiError } from "@/lib/error-handling";

export interface CenterCardType {
  id: number;
  name: string;
  address: string;
  logo: string;
  acceptedAges: string[];
  branches: Array<{
    id: number;
    name: string;
    nursery_name_branch: string;
  }>;
  childrenCount: number;
  bookingsCount: number;
  status: string;
}

export interface BranchCardType {
  id: number;
  name: string;
  address: string;
  logo: string;
  childrenCount: number;
  bookingsCount: number;
  acceptedAges: string[];
  services: string[];
  imageUrl?: string;
}

const mapCenterData = (apiData: any, t: any): CenterCardType => {
  return {
    id: apiData.id,
    name: apiData.nursery_name,
    address: `${apiData.city}، ${apiData.neighborhood}`,
    branches: apiData.branches,
    childrenCount: apiData.children_count || 0,
    bookingsCount: apiData.enrollments_count || 0,
    acceptedAges: Array.isArray(apiData.accepted_ages)
      ? [
          ...(apiData.accepted_ages?.map((id: string) =>
            t(`centerAges.${id}`)
          ) || []),
        ]
      : [apiData.accepted_ages],
    logo: apiData.logo,
    status: apiData.status,
  };
};

const mapBranchData = (apiData: any, t: any): BranchCardType => {
  return {
    id: apiData.id,
    name: apiData.name,
    address: `${apiData.city}، ${apiData.neighborhood}`,
    logo: apiData.logo,
    childrenCount: 0,
    bookingsCount: 0,
    acceptedAges: [
      ...(apiData.accepted_ages?.map((id: string) => t(`centerAges.${id}`)) ||
        []),
    ],
    services: [
      ...(apiData.services?.map(
        (id: string) => t(`centerServices.${id}`) || ""
      ) || []),
      ...(apiData.additional_service ? [apiData.additional_service] : []),
    ],
    imageUrl: apiData.image || null,
  };
};

export const useCenters = () => {
  const t = useTranslations("options");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["centers"],
    queryFn: async () => {
      const response = await adminService.getCenters();
      return response.map((center: any) => mapCenterData(center, t));
    },
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export const useBranches = (centerId?: string) => {
  const t = useTranslations("options");
  const pathname = usePathname();
  const isAdminContext = pathname?.includes("/admin/");

  const getBranchesFn = isAdminContext
    ? adminService.getBranches
    : centerService.getBranches;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["branches", isAdminContext ? centerId : undefined],
    queryFn: async () => {
      const response = await getBranchesFn(centerId || "");
      return response.map((branch: any) => mapBranchData(branch, t));
    },
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export const useBranch = (branchId?: string) => {
  const pathname = usePathname();
  const isAdminContext = pathname?.includes("/admin/");

  const getBranchFn = isAdminContext
    ? adminService.getBranch
    : centerService.getBranch;

  return useQuery<any, ApiError>({
    enabled: !!branchId,
    queryKey: ["branch", branchId],
    queryFn: () => getBranchFn(branchId!),
  });
};
