"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Booking } from "@/components/tables/data/center-bookings";
import { useReservationStatus } from "@/components/tables/data/shared/status";

interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
  onAccept?: (enrollmentId: string) => void;
  onReject?: (enrollmentId: string) => void;
}

export const BookingCard = ({
  booking,
  onViewDetails,
  onAccept,
  onReject,
}: BookingCardProps) => {
  const t = useTranslations("dashboard.tables.center-bookings");
  const tBookings = useTranslations("dashboard.center-bookings");
  const { getStatusText, getStatusColorClass } = useReservationStatus();

  const firstChild = booking.childs[0];
  const status = firstChild?.status || "-";
  const colorClasses = getStatusColorClass(status as any);
  const statusText = getStatusText(status as any);
  const isPending = status === "pending";

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      hour: tBookings("programTypes.hourly"),
      day: tBookings("programTypes.daily"),
      week: tBookings("programTypes.weekly"),
      month: tBookings("programTypes.monthly"),
      year: tBookings("programTypes.yearly"),
    };
    return typeMap[type] || type;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
      <div className="space-y-4">
        {/* Details Grid - 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 text-sm">
          {/* Right Column */}
          <div className="text-right space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-mid-gray">{firstChild?.name}</span>
              <span className="font-semibold text-primary">
                {tBookings("fields.childrenLabel")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-mid-gray">{booking.branch}</span>
              <span className="font-semibold text-primary">
                {tBookings("fields.nursery")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-mid-gray">{booking.branch}</span>
              <span className="font-semibold text-primary">
                {tBookings("fields.branch")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-mid-gray">
                {getTypeLabel(booking.type)}
              </span>
              <span className="font-semibold text-primary">
                {tBookings("fields.program")}
              </span>
            </div>
          </div>

          {/* Left Column */}
          <div className="text-right space-y-3">
            <div className="flex justify-between items-center">
              <div className={`text-xs px-3 py-1 rounded-md ${colorClasses}`}>
                {statusText}
              </div>
              <span className="font-semibold text-primary">
                {tBookings("fields.bookingStatus")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-mid-gray">{booking.startDate}</span>
              <span className="font-semibold text-primary">
                {tBookings("fields.startDay")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-mid-gray">{booking.endDate || "-"}</span>
              <span className="font-semibold text-primary">
                {tBookings("fields.endDay")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-mid-gray">9</span>
              <span className="font-semibold text-primary">
                {tBookings("fields.numberOfDays")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* paid, expired, cancelled, rejected: View Details + Send notification */}
          {(status === "paid" ||
            status === "expired" ||
            status === "cancelled" ||
            status === "rejected") && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => onViewDetails(booking)}
              >
                {tBookings("viewDetailsButton")}
              </Button>
              <Button className="flex-1">
                {tBookings("sendNotification")}
              </Button>
            </>
          )}

          {/* existing (من خلال المركز): Confirm or Reject */}
          {status === "existing" && firstChild && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => onReject?.(firstChild.enrollmentId)}
              >
                {tBookings("rejectBooking")}
              </Button>
              <Button
                className="flex-1"
                onClick={() => onAccept?.(firstChild.enrollmentId)}
              >
                {tBookings("confirmBooking")}
              </Button>
            </>
          )}

          {/* accepted (waiting for payment): Send notification or Cancel */}
          {status === "accepted" && firstChild && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => onReject?.(firstChild.enrollmentId)}
              >
                {tBookings("cancelBooking")}
              </Button>
              <Button className="flex-1">
                {tBookings("sendNotification")}
              </Button>
            </>
          )}

          {/* pending (waiting for confirmation): Accept or Reject */}
          {status === "pending" && firstChild && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => onReject?.(firstChild.enrollmentId)}
              >
                {tBookings("rejectBooking")}
              </Button>
              <Button
                className="flex-1"
                onClick={() => onAccept?.(firstChild.enrollmentId)}
              >
                {tBookings("acceptBooking")}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
