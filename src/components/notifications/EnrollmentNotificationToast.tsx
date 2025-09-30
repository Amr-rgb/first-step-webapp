"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Check,
  X,
  Clock,
  Calendar,
  DollarSign,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { centerService } from "@/services/dashboardApi";

interface EnrollmentData {
  id: number;
  user_id: number;
  center_id: number;
  center_branch_id: number;
  branch_price_id: number;
  reservation_number: string;
  status: string;
  enrollment_date: string;
  enrollment_type: string;
  parent_phone: string;
  price_amount: number;
  starting_date?: string;
  ending_date?: string;
  starting_time?: string;
  ending_time?: string;
  month?: string;
  day_string?: string;
}

interface EnrollmentNotificationToastProps {
  title: string;
  description: string;
  enrollment: EnrollmentData;
  onDismiss?: () => void;
}

export function EnrollmentNotificationToast({
  title,
  description,
  enrollment,
  onDismiss,
}: EnrollmentNotificationToastProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"pending" | "accepted" | "rejected">(
    "pending"
  );

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await centerService.respondEnrollment(enrollment.id, "accepted");
      setStatus("accepted");
      console.log("✅ Enrollment accepted:", enrollment.id);

      // Auto-dismiss after 2 seconds
      setTimeout(() => {
        onDismiss?.();
      }, 2000);
    } catch (error) {
      console.error("❌ Failed to accept enrollment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await centerService.respondEnrollment(enrollment.id, "rejected");
      setStatus("rejected");
      console.log("❌ Enrollment rejected:", enrollment.id);

      // Auto-dismiss after 2 seconds
      setTimeout(() => {
        onDismiss?.();
      }, 2000);
    } catch (error) {
      console.error("❌ Failed to reject enrollment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 bg-white rounded-lg shadow-lg border-l-4 min-w-96 max-w-md",
        status === "accepted"
          ? "border-l-green-500"
          : status === "rejected"
          ? "border-l-red-500"
          : "border-l-blue-500"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex-shrink-0 p-2 rounded-full",
            status === "accepted"
              ? "bg-green-100 text-green-600"
              : status === "rejected"
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-600"
          )}
        >
          <UserPlus className="size-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Enrollment Details */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="size-3 text-gray-400" />
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {formatDate(enrollment.enrollment_date)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Phone className="size-3 text-gray-400" />
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{enrollment.parent_phone}</span>
          </div>

          <div className="flex items-center gap-1">
            <DollarSign className="size-3 text-gray-400" />
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">${enrollment.price_amount}</span>
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="size-3 text-gray-400" />
            <span className="text-gray-600">Type:</span>
            <span className="font-medium capitalize">
              {enrollment.enrollment_type}
            </span>
          </div>

          {enrollment.starting_time && enrollment.ending_time && (
            <div className="col-span-2 flex items-center gap-1">
              <Clock className="size-3 text-gray-400" />
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">
                {formatTime(enrollment.starting_time)} -{" "}
                {formatTime(enrollment.ending_time)}
              </span>
            </div>
          )}

          {enrollment.day_string && (
            <div className="col-span-2 flex items-center gap-1">
              <Calendar className="size-3 text-gray-400" />
              <span className="text-gray-600">Day:</span>
              <span className="font-medium">{enrollment.day_string}</span>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 pt-1 border-t">
          <span>Reservation: {enrollment.reservation_number}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {status === "pending" && (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleAccept}
            disabled={isProcessing}
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="size-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                <Check className="size-4 mr-1" />
                Accept
              </>
            )}
          </Button>

          <Button
            onClick={handleReject}
            disabled={isProcessing}
            size="sm"
            variant="destructive"
            className="flex-1"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="size-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                <X className="size-4 mr-1" />
                Reject
              </>
            )}
          </Button>
        </div>
      )}

      {/* Status Messages */}
      {status === "accepted" && (
        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
          <Check className="size-4" />
          Enrollment Accepted Successfully!
        </div>
      )}

      {status === "rejected" && (
        <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
          <X className="size-4" />
          Enrollment Rejected
        </div>
      )}
    </div>
  );
}
