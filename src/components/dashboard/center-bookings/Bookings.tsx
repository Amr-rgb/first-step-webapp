"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Booking,
  useCenterBookingsColumns,
  SelectedChild,
} from "@/components/tables/data/center-bookings";
import { DataTable } from "@/components/tables/DataTable";
import { centerService } from "@/services/dashboardApi";
import EmptyState from "@/components/common/EmptyState";
import { BookingCard } from "./BookingCard";
import { BookingDetailsModal } from "./BookingDetailsModal";
import { AcceptEnrollmentModal } from "./AcceptEnrollmentModal";
import { Button } from "@/components/ui/button";
import { Table, LayoutGrid } from "lucide-react";
import { toastSuccess, toastError } from "@/lib/toast";

const transformEnrollmentsData = (data: any): Booking[] => {
  // Handle both direct array and wrapped response
  const enrollments = Array.isArray(data) ? data : data?.data || [];

  if (!Array.isArray(enrollments) || enrollments.length === 0) {
    return [];
  }

  const result = enrollments
    .filter((enrollment: any) => {
      // Skip enrollments with no children
      return enrollment.children && enrollment.children.length > 0;
    })
    .map((enrollment: any) => {
      return {
        id: enrollment.enrollment_id,
        parentName: enrollment.parent_name || "",
        branchId: enrollment.branch_id,
        branchPriceId: enrollment.branch_price_id,
        childs: enrollment.children.map((child: any) => ({
          id: child.child_id.toString(),
          name: child.child_name,
          enrollmentId: enrollment.enrollment_id.toString(),
          status: enrollment.status || "-",
          branch: enrollment.branch_name || "",
          branchId: enrollment.branch_id,
          startDate:
            enrollment.starting_date || enrollment.enrollment_date || "",
          type: enrollment.enrollment_type || "",
          amount: enrollment.price_amount
            ? parseFloat(enrollment.price_amount)
            : 0,
        })),
        branch: enrollment.branch_name || "",
        startDate: enrollment.starting_date || enrollment.enrollment_date || "",
        endDate: enrollment.ending_date || "",
        type: enrollment.enrollment_type || "",
        amount: enrollment.price_amount
          ? parseFloat(enrollment.price_amount)
          : 0,
      };
    });

  console.log("Transform result (first item):", result[0]);
  return result;
};

type FilterType =
  | "all"
  | "completed"
  | "pending"
  | "confirmed"
  | "from-center"
  | "cancelled"
  | "rejected"
  | "expired";

const Bookings = () => {
  const [selectedChildMap, setSelectedChildMap] = useState<
    Record<number, SelectedChild>
  >({});
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [pendingEnrollmentId, setPendingEnrollmentId] = useState<string | null>(
    null
  );
  const [pendingEnrollmentType, setPendingEnrollmentType] =
    useState<string>("");

  const t = useTranslations("dashboard.center-bookings");
  const tTable = useTranslations("dashboard.tables.center-bookings");
  const queryClient = useQueryClient();
  const columns = useCenterBookingsColumns(
    selectedChildMap,
    setSelectedChildMap
  );

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const enrollmentMutation = useMutation({
    mutationFn: async ({
      enrollmentId,
      status,
      starting_date,
      starting_time,
      day_string,
    }: {
      enrollmentId: string;
      status: string;
      starting_date?: string;
      starting_time?: string;
      day_string?: string;
    }) => {
      return await centerService.respondExistingEnrollment(
        parseInt(enrollmentId),
        status,
        starting_date,
        starting_time,
        day_string
      );
    },
    onSuccess: () => {
      toastSuccess(
        tTable("enrollmentResponseSuccess") || "تم تحديث الحجز بنجاح"
      );
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      setIsAcceptModalOpen(false);
      setPendingEnrollmentId(null);
      setPendingEnrollmentType("");
    },
    onError: () => {
      toastError(tTable("enrollmentResponseError") || "فشل تحديث الحجز");
    },
  });

  const handleAccept = (enrollmentId: string, enrollmentType: string) => {
    setPendingEnrollmentId(enrollmentId);
    setPendingEnrollmentType(enrollmentType);
    setIsAcceptModalOpen(true);
  };

  const handleConfirmAccept = (data: {
    startingDate?: string;
    startingTime?: string;
    dayString?: string;
  }) => {
    if (pendingEnrollmentId) {
      enrollmentMutation.mutate({
        enrollmentId: pendingEnrollmentId,
        status: "paid",
        starting_date: data.startingDate,
        starting_time: data.startingTime,
        day_string: data.dayString,
      });
    }
  };

  const handleReject = (enrollmentId: string) => {
    enrollmentMutation.mutate({ enrollmentId, status: "rejected" });
  };

  const notificationMutation = useMutation({
    mutationFn: async (enrollmentId: number) => {
      return await centerService.sendExpiredNotification(enrollmentId);
    },
    onSuccess: () => {
      toastSuccess(
        tTable("notificationSentSuccess") || "تم إرسال الإشعار بنجاح"
      );
    },
    onError: () => {
      toastError(tTable("notificationSentError") || "فشل إرسال الإشعار");
    },
  });

  const handleSendNotification = (enrollmentId: number) => {
    notificationMutation.mutate(enrollmentId);
  };

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: t("filters.all") },
    { value: "completed", label: t("filters.completed") },
    { value: "pending", label: t("filters.pending") },
    { value: "confirmed", label: t("filters.confirmed") },
    { value: "from-center", label: t("filters.fromCenter") },
    { value: "cancelled", label: t("filters.cancelled") },
    { value: "rejected", label: t("filters.rejected") },
    { value: "expired", label: t("filters.expired") },
  ];

  const { data: enrollmentsData, isLoading } = useQuery({
    queryKey: ["enrollments"],
    queryFn: centerService.getEnrollments,
  });

  const baseData = enrollmentsData
    ? transformEnrollmentsData(enrollmentsData)
    : [];

  console.log("baseData (first item):", baseData[0]);

  // Filter bookings based on active filter
  const filteredBaseData = baseData.filter((booking) => {
    // Skip bookings with no children
    if (!booking.childs || booking.childs.length === 0) return false;

    if (activeFilter === "all") return true;

    const firstChild = booking.childs[0];
    const status = firstChild?.status;

    if (!status) return false;

    switch (activeFilter) {
      case "completed":
        // تم الدفع - paid
        return status === "paid";
      case "pending":
        // في انتظار التأكيد - waiting for confirmation
        return status === "pending";
      case "confirmed":
        // في انتظار الدفع - waiting for payment (accepted)
        return status === "accepted";
      case "from-center":
        // من خلال المركز - from center (existing)
        return status === "existing";
      case "cancelled":
        // ملغي - cancelled
        return status === "cancelled";
      case "rejected":
        // مرفوض - rejected
        return status === "rejected";
      case "expired":
        // منتهي - expired
        return status === "expired";
      default:
        return true;
    }
  });

  console.log("filteredBaseData (first item):", filteredBaseData[0]);

  // Expand rows: after each parent row, if selected child has multiple enrollments, insert detail rows
  const bookingsData: Booking[] = [];
  for (const parent of filteredBaseData) {
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
  if (!isLoading && baseData.length === 0) {
    return (
      <EmptyState
        icon="📅"
        size="lg"
        translationKey="dashboard.emptyStates.bookings"
      />
    );
  }

  return (
    <div>
      <div className="mt-6 space-y-4">
        {/* Header with View Toggle and Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="size-10"
            >
              <Table className="size-5" />
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("cards")}
              className="size-10"
            >
              <LayoutGrid className="size-5" />
            </Button>
          </div>

          <div className="w-full sm:flex-1 sm:max-w-md">
            <input
              type="search"
              placeholder="بحث"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-right"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="w-full overflow-x-auto">
          <div className="flex gap-2 pb-2 w-2.5 max-w-full">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border whitespace-nowrap transition-all flex-shrink-0 ${
                  activeFilter === filter.value
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <DataTable
            columns={columns}
            data={bookingsData}
            isLoading={isLoading}
          />
        )}

        {/* Cards View */}
        {viewMode === "cards" && (
          <div className="space-y-4">
            {filteredBaseData.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={handleViewDetails}
                onAccept={handleAccept}
                onReject={handleReject}
                onSendNotification={handleSendNotification}
                isNotificationLoading={notificationMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      {/* Accept Enrollment Modal */}
      <AcceptEnrollmentModal
        open={isAcceptModalOpen}
        onOpenChange={setIsAcceptModalOpen}
        onConfirm={handleConfirmAccept}
        isLoading={enrollmentMutation.isPending}
        enrollmentType={pendingEnrollmentType}
      />
    </div>
  );
};

export default Bookings;
