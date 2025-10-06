"use client";

import { Booking, getColumns } from "@/components/tables/data/top-bookings";
import { DataTable } from "@/components/tables/DataTable";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/common/EmptyState";

const TopBookings = () => {
  const { stats } = useAdminStats();
  const topCenters = stats?.top_centers || [];

  const t = useTranslations("dashboard.tables.top-bookings");

  const bookingsData = topCenters.map((center: any, index: number) => ({
    id: index + 1,
    center: center.nursery_name,
    count: Number(center.enrollments_count),
    income: 0, // We don't have income data in the API response
  }));

  const columns = getColumns({ nurseryName: true });

  return (
    <div>
      <div className="mt-6 lg:p-4 space-y-1">
        <p className="font-bold text-primary text-center">{t("title")}</p>
        {bookingsData.length > 0 ? (
          <DataTable data={bookingsData} columns={columns} />
        ) : (
          <EmptyState
            icon="🏆"
            size="lg"
            translationKey="dashboard.emptyStates.bookings"
          />
        )}
      </div>
    </div>
  );
};

export default TopBookings;
