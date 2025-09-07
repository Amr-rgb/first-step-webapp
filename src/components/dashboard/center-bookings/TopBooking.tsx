"use client";

import { useTranslations } from "next-intl";
import { Booking, getColumns } from "@/components/tables/data/top-bookings";
import { DataTable } from "@/components/tables/DataTable";
import { useCenterStats } from "@/hooks/useCenterStats";
import { useHasRole } from "@/store/authStore";

const TopBookings = () => {
  const t = useTranslations("dashboard.tables.top-bookings");
  const isCenter = useHasRole("center");
  const { stats } = useCenterStats(isCenter ? "center" : "branch");
  const columns = getColumns({ nurseryName: false, branch: true });

  const source: Array<{
    nursery_name: string;
    enrollment_count: number;
    total_revenue?: string | number;
  }> =
    (stats?.branches_ordering_depending_on_the_number_of_enrollments as any) ||
    [];

  const bookingsData: Booking[] = source.map(
    (
      item: {
        nursery_name: string;
        enrollment_count: number;
        total_revenue?: string | number;
      },
      index: number
    ) => ({
      id: index + 1,
      branch: item.nursery_name,
      count: String(item.enrollment_count ?? 0),
      income: Number(item.total_revenue ?? 0),
    })
  );

  return (
    <div>
      <div className="mt-6 lg:p-4 space-y-1">
        <p className="font-bold text-primary text-center">{t("title")}</p>

        <DataTable pagination={false} columns={columns} data={bookingsData} />
      </div>
    </div>
  );
};

export default TopBookings;
