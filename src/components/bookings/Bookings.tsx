"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BookingCard from "./BookingCard";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { formatToArabicDate, getDaysDifference } from "@/utils/dateUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { parentService } from "@/services/dashboardApi";
import { Enrollment } from "@/services/dashboardApi";

const Bookings: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const {
    data: bookingsData,
    isLoading,
    error,
  } = useQuery<Enrollment[]>({
    queryKey: ["parentEnrollments"],
    queryFn: async () => {
      const response = await parentService.getParentEnrollments();
      return response.data;
    },
  });

  const bookings =
    bookingsData?.map((booking) => ({
      id: String(booking.id),
      status: booking.status,
      startDate: booking.enrollment_date,
      // FIXME: endDate is the same as startDate from the API
      endDate: booking.enrollment_date,
      // FIXME: The API returns parent_name, not child_name
      children: booking.parent_name,
      nursery: booking.center_name,
      branch: booking.branch_name,
      program: booking.enrollment_type,
    })) || [];

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.children.toLowerCase().includes(searchLower) ||
      booking.nursery.toLowerCase().includes(searchLower) ||
      booking.branch.toLowerCase().includes(searchLower) ||
      booking.program.toLowerCase().includes(searchLower) ||
      booking.status.toLowerCase().includes(searchLower)
    );
  });

  const handleViewDetails = (bookingId: string) => {
    router.push(`/dashboard/parent/bookings/${bookingId}`);
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      // In a real app, this would be an API call
      console.log("Confirming booking:", bookingId);
      // For now, just show an alert and refetch
      alert(`تم تأكيد الحجز: ${bookingId}`);
      queryClient.invalidateQueries({ queryKey: ["parentEnrollments"] });
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("حدث خطأ أثناء تأكيد الحجز. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      if (window.confirm("هل أنت متأكد من رغبتك في إلغاء الحجز؟")) {
        // In a real app, this would be an API call to cancel
        console.log("Canceling booking:", bookingId);
        // For now, just show an alert and refetch
        alert(`تم إلغاء الحجز: ${bookingId}`);
        queryClient.invalidateQueries({ queryKey: ["parentEnrollments"] });
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("حدث خطأ أثناء إلغاء الحجز. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="flex flex-row min-h-screen bg-secondary-light" dir="rtl">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-secondary-1 h-15 flex flex-row items-center justify-between px-6 py-4">
          <h1 className="text-accent-primary font-tajawal font-bold text-2xl leading-7">
            الحجوزات
          </h1>
          <div className="relative w-96">
            <input
              type="text"
              placeholder="ابحث عن حجز..."
              className="w-full bg-secondary-1 border border-accent-neutral rounded-lg py-3 pr-10 pl-4 font-tajawal text-base leading-5 text-right focus:outline-none focus:ring-2 focus:ring-primary-light"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto p-6">
          <ErrorBoundary>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 p-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="w-full max-w-md space-y-2">
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-6 bg-red-50 rounded-lg">
                <p className="text-red-600 font-tajawal text-lg">
                  {error.message}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-primary-light text-white rounded-lg font-tajawal font-medium hover:bg-primary-dark transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  status={
                    booking.status as
                      | "paid"
                      | "pending"
                      | "rejected"
                      | "awaiting"
                  }
                  startDate={formatToArabicDate(booking.startDate)}
                  endDate={formatToArabicDate(booking.endDate)}
                  days={getDaysDifference(booking.startDate, booking.endDate)}
                  children={booking.children}
                  nursery={booking.nursery}
                  branch={booking.branch}
                  program={booking.program}
                  onViewDetails={() => handleViewDetails(booking.id)}
                  onConfirm={
                    booking.status === "pending"
                      ? () => handleConfirmBooking(booking.id)
                      : undefined
                  }
                  onCancel={
                    booking.status !== "rejected"
                      ? () => handleCancelBooking(booking.id)
                      : undefined
                  }
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-accent-neutral font-tajawal text-lg">
                  {searchQuery ? "لا توجد نتائج للبحث" : "لا توجد حجوزات متاحة"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-accent-primary hover:underline"
                  >
                    مسح البحث
                  </button>
                )}
              </div>
            )}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
