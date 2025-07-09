"use client";

import { useMemo, useState } from "react";
import { getColumns } from "@/components/tables/data/admin-bookings";
import { DataTable } from "@/components/tables/DataTable";
import { useAdminEnrollments } from "@/hooks/useAdminEnrollments";
import { useTranslations } from "next-intl";

import { Parent } from "@/hooks/useAdminEnrollments";
import { ReservationStatus } from "@/types";

const transformEnrollmentsToBookings = (data: Parent[] = []) => {
  const bookings = [];

  for (const parent of data) {
    // Group enrollments by parent
    const parentEnrollments: Record<string, any> = {};

    // First, collect all enrollments for this parent
    for (const child of parent.children) {
      for (const enrollment of child.enrollments) {
        const key = `${parent.parent_id}-${enrollment.branch_name}-${enrollment.enrollment_date}`;

        if (!parentEnrollments[key]) {
          // Create a new booking entry for this parent-branch-date combination
          parentEnrollments[key] = {
            id: enrollment.enrollment_id,
            parentName: parent.parent_name,
            center: enrollment.branch_name,
            childs: [],
            branch: enrollment.branch_name,
            startDate: enrollment.enrollment_date,
            endDate: "", // You might need to adjust this based on your data model
            amount: 0, // Will sum up amounts
            enrollment_id: enrollment.enrollment_id,
            enrollment_date: enrollment.enrollment_date,
            status: enrollment.status,
          };
        }

        // Add child to the children array
        parentEnrollments[key].childs.push({
          id: child.child_id.toString(),
          name: child.child_name,
          reservationStatus: enrollment.status as ReservationStatus,
        });

        // Sum up the amounts
        parentEnrollments[key].amount +=
          parseFloat(enrollment.price_amount) || 0;
      }
    }

    // Add all bookings for this parent to the result
    bookings.push(...Object.values(parentEnrollments));
  }

  return bookings;
};

const Bookings = () => {
  const t = useTranslations("dashboard.admin.bookings");
  const { enrollments, isLoading, error } = useAdminEnrollments();
  const [selectedChildMap, setSelectedChildMap] = useState<
    Record<number, string>
  >({});

  // Transform enrollments data to match the Booking type
  const bookingsData = useMemo(() => {
    return transformEnrollmentsToBookings(enrollments);
  }, [enrollments]);

  const columns = getColumns(selectedChildMap, setSelectedChildMap);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-4 text-primary text-lg font-medium">
          {t("loading")}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">{t("errorLoading")}</div>
    );
  }

  return (
    <div>
      <div className="mt-6 lg:p-4 space-y-1">
        <p className="heading-4 font-medium text-primary text-center">
          {t("title")}
        </p>
        {bookingsData.length > 0 ? (
          <DataTable columns={columns} data={bookingsData} />
        ) : (
          <div className="text-center py-10 text-gray-500">
            {t("noBookings")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
