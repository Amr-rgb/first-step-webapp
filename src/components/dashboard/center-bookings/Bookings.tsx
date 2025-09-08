"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  Booking,
  useCenterBookingsColumns,
  SelectedChild,
} from "@/components/tables/data/center-bookings";
import { DataTable } from "@/components/tables/DataTable";
import { centerService } from "@/services/dashboardApi";
import EmptyState from "@/components/common/EmptyState";

const transformEnrollmentsData = (data: any): Booking[] => {
  return data.data.map((parent: any) => {
    // Filter children that have enrollments
    const childrenWithEnrollments = parent.children.filter(
      (child: any) => child.enrollments.length > 0
    );

    // Get the most recent enrollment date among all children
    const latestEnrollment = childrenWithEnrollments.reduce(
      (latest: any, child: any) => {
        const childLatest = child.enrollments[0];
        if (!childLatest) return latest;
        return !latest ||
          new Date(childLatest.enrollment_date) >
            new Date(latest.enrollment_date)
          ? childLatest
          : latest;
      },
      null
    );

    return {
      id: parent.parent_id,
      parentName: parent.parent_name,
      childs: childrenWithEnrollments.map((child: any) => ({
        id: child.child_id.toString(),
        name: child.child_name,
        enrollmentId: child.enrollments[0]?.enrollment_id.toString() || "",
        status: child.enrollments[0]?.status || "pending",
        branch: child.enrollments[0]?.branch_name || "",
        startDate: child.enrollments[0]?.enrollment_date || "",
        type: child.enrollments[0]?.enrollment_type || "",
        amount: child.enrollments[0]
          ? parseFloat(child.enrollments[0].price_amount)
          : 0,
      })),
      branch: latestEnrollment?.branch_name || "",
      startDate: latestEnrollment?.enrollment_date || "",
      type: latestEnrollment?.enrollment_type || "",
      amount: latestEnrollment ? parseFloat(latestEnrollment.price_amount) : 0,
    };
  });
};

const Bookings = () => {
  const [selectedChildMap, setSelectedChildMap] = useState<
    Record<number, SelectedChild>
  >({});
  const t = useTranslations("dashboard.center-bookings");
  const columns = useCenterBookingsColumns(
    selectedChildMap,
    setSelectedChildMap
  );

  const { data: enrollmentsData, isLoading } = useQuery({
    queryKey: ["enrollments"],
    queryFn: centerService.getEnrollments,
  });

  const bookingsData = enrollmentsData
    ? transformEnrollmentsData(enrollmentsData)
    : [];

  // Show empty state if no bookings
  if (!isLoading && bookingsData.length === 0) {
    return (
      <EmptyState
        title={t("emptyStates.bookings.title")}
        description={t("emptyStates.bookings.description")}
        icon="📅"
        size="lg"
        translationKey="dashboard.emptyStates"
      />
    );
  }

  return (
    <div>
      <div className="mt-6 lg:p-4 space-y-1">
        <p className="heading-4 font-medium text-primary text-center">
          {t("title")}
        </p>

        <DataTable
          columns={columns}
          data={bookingsData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Bookings;
