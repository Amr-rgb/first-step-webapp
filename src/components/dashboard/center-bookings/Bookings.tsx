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

    // Get the most recent enrollment date among all enrollments for all children
    const latestEnrollment = childrenWithEnrollments.reduce(
      (latest: any, child: any) => {
        for (const enrollment of child.enrollments) {
          if (
            !latest ||
            new Date(enrollment.enrollment_date) >
              new Date(latest.enrollment_date)
          ) {
            latest = enrollment;
          }
        }
        return latest;
      },
      null
    );

    return {
      id: parent.parent_id,
      parentName: parent.parent_name,
      // Flatten all enrollments for each child into selectable rows
      childs: childrenWithEnrollments.flatMap((child: any) =>
        child.enrollments.map((enrollment: any) => ({
          id: child.child_id.toString(),
          // Include additional info to distinguish multiple enrollments for the same child
          name: `${child.child_name}`,
          enrollmentId: enrollment?.enrollment_id?.toString() || "",
          status: enrollment?.status || "-",
          branch: enrollment?.branch_name || "",
          startDate: enrollment?.enrollment_date || "",
          type: enrollment?.enrollment_type || "",
          amount: enrollment?.price_amount
            ? parseFloat(enrollment.price_amount)
            : 0,
        }))
      ),
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

  const baseData = enrollmentsData
    ? transformEnrollmentsData(enrollmentsData)
    : [];

  // Expand rows: after each parent row, if selected child has multiple enrollments, insert detail rows
  const bookingsData: Booking[] = [];
  for (const parent of baseData) {
    bookingsData.push(parent);
    const selected = selectedChildMap[parent.id];
    if (!selected) continue;
    // all enrollments belonging to the selected child's id
    const selectedChildEntries = parent.childs.filter(
      (c) =>
        c.id ===
        parent.childs.find((x) => x.enrollmentId === selected.enrollmentId)?.id
    );
    if (selectedChildEntries.length > 1) {
      // mark parent row as expanded so its info cells can be hidden by the table
      (bookingsData[bookingsData.length - 1] as Booking).isExpandedParent =
        true;
      for (const en of selectedChildEntries) {
        bookingsData.push({
          ...parent,
          parentName: parent.parentName, // show child name in child column via columns logic
          childs: parent.childs,
          branch: en.branch,
          startDate: en.startDate,
          type: en.type,
          amount: en.amount,
          isDetail: true,
          detailChildName: selectedChildEntries[0]?.name ?? "",
          detailEnrollmentId: en.enrollmentId,
          detailStatus: en.status,
        } as Booking);
      }
    }
  }

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
