"use client";

import { useMemo, useState } from "react";
import { getColumns } from "@/components/tables/data/admin-bookings";
import { DataTable } from "@/components/tables/DataTable";
import { useAdminEnrollments } from "@/hooks/useAdminEnrollments";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

const Bookings = () => {
  const t = useTranslations("dashboard.admin.bookings");
  const { enrollments, isLoading, error } = useAdminEnrollments();
  const [selectedChildMap, setSelectedChildMap] = useState<
    Record<string, string>
  >({});

  const bookings = useMemo(() => {
    return (
      [...(enrollments || [])]
        .reverse()
        .filter((b) => b.children && b.children.length > 0) || []
    );
  }, [enrollments]);

  const columns = useMemo(() => {
    return getColumns(selectedChildMap, setSelectedChildMap);
  }, [selectedChildMap]);

  if (isLoading) {
    return (
      <div className="space-y-4 lg:p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-3 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        {t("errorLoading") || "Error loading bookings data."}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mt-6 lg:p-4 space-y-6">
        <h1 className="text-2xl font-bold text-primary text-center">
          {t("title")}
        </h1>

        {bookings.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <DataTable
              columns={columns}
              data={bookings}
              getRowId={(row) => row.id.toString()}
              pagination
            />
          </div>
        ) : (
          <div className="py-20">
            <EmptyState
              icon="📅"
              size="lg"
              translationKey="dashboard.emptyStates.bookings"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
