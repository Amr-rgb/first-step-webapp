"use client";

import {
  Report,
  useParentReportsColumns,
} from "@/components/tables/data/parent-reports";
import { DataTable } from "@/components/tables/DataTable";
import { parentService } from "@/services/dashboardApi";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  useQuery,
  UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface DailyReportResponse {
  id: number;
  activities: string;
  meals: string;
  nap_time: string;
  behavior: string;
  notes: string;
  created_at: string;
  child: {
    id: number;
    name: string;
    gender: string;
    birthday: string;
    parent_name: string;
    mother_name: string;
    user: {
      id: number;
      name: string;
      email: string;
      address: string;
      phone: string;
    };
  };
  center: {
    id: number;
    name: string;
    location: string;
    phone: string;
    branch: {
      id: number;
      name: string;
    };
  };
  pdf_url: string;
}

const useDailyReports = () => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.parent.reports");

  const options: UseQueryOptions<Report[], Error> = {
    queryKey: ["dailyReports"],
    queryFn: async () => {
      const response = await parentService.getDailyReports();
      console.log("API Response:", response); // Debug log

      // Check if response has data property
      const reports = response.data || response;

      return reports.map((report: DailyReportResponse) => ({
        id: report.id,
        childName: report.child.name,
        nurseryName: report.center.name,
        reportDate: new Date(report.created_at).toLocaleDateString("ar-SA"),
        pdf_url: report.pdf_url,
      }));
    },
    enabled: isAuthenticated(),
    retry: false,
  };

  const deleteMutation = useMutation({
    mutationFn: async (reportId: number) => {
      // TODO: Implement delete endpoint in parentService
      await parentService.deleteDailyReport(reportId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyReports"] });
      toast.success(t("deleteSuccess"));
    },
    onError: (error) => {
      console.error("Error deleting report:", error);
      toast.error(t("deleteError"));
    },
  });

  return {
    ...useQuery<Report[], Error>(options),
    deleteReport: deleteMutation.mutate,
  };
};

export default function DailyReports() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const t = useTranslations("dashboard.parent.reports");
  const {
    data: reports = [],
    isLoading,
    error,
    deleteReport,
  } = useDailyReports();
  const columns = useParentReportsColumns({ onDelete: deleteReport });

  // Handle errors
  if (error) {
    console.error("Error fetching reports:", error);
    if ("status" in error && error.status === 403) {
      toast.error(t("permissionError"));
    } else {
      toast.error(error.message || t("error"));
    }
  }

  // Check authentication
  if (!isAuthenticated()) {
    console.log("User not authenticated, redirecting to sign-in");
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="lg:p-4 space-y-1">
      <p className="heading-4 text-primary text-center">{t("title")}</p>

      <DataTable columns={columns} data={reports} isLoading={isLoading} />
    </div>
  );
}
