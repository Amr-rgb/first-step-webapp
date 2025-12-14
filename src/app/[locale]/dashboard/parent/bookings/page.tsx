"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Bookings } from "@/components/dashboard/parent-bookings/Bookings";
import { useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePageMetadata } from "@/hooks/usePageMetadata";

export default function ParentBookingsPage() {
  usePageMetadata();

  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const enrollmentId = searchParams.get("enrollmentId");
  const paymentSuccess = searchParams.get("payment");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (enrollmentId) {
      // Wait for the DOM to render
      const timer = setTimeout(() => {
        const element = document.getElementById(`enrollment-${enrollmentId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Add highlight effect
          element.classList.add("ring-2", "ring-blue-500", "ring-offset-2");
          // Remove highlight after 3 seconds
          setTimeout(() => {
            element.classList.remove(
              "ring-2",
              "ring-blue-500",
              "ring-offset-2"
            );
          }, 3000);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [enrollmentId]);

  useEffect(() => {
    if (paymentSuccess === "success") {
      // Show success dialog
      setShowSuccessDialog(true);

      // Scroll to the booking if enrollmentId is present
      if (enrollmentId) {
        setTimeout(() => {
          const element = document.getElementById(`enrollment-${enrollmentId}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            // Add highlight effect
            element.classList.add("ring-2", "ring-green-500", "ring-offset-2");
            // Remove highlight after 5 seconds
            setTimeout(() => {
              element.classList.remove(
                "ring-2",
                "ring-green-500",
                "ring-offset-2"
              );
            }, 5000);
          }
        }, 300);
      }

      // Clean up URL by removing the success parameter
      const newUrl =
        window.location.pathname +
        (enrollmentId ? `?enrollmentId=${enrollmentId}` : "");
      router.replace(newUrl);
    }
  }, [paymentSuccess, enrollmentId, router]);

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <Bookings />
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md rounded-[40px]">
          <DialogHeader>
            <DialogTitle className="sr-only">
              {locale === "ar" ? "تم الدفع بنجاح" : "Payment Successful"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
            <div className="relative mb-6">
              <Image
                src="/assets/illustrations/success.png"
                alt="Success"
                width={120}
                height={120}
                className="mx-auto"
              />
            </div>
            <div className="space-y-3 mb-6">
              <h3 className="text-2xl font-bold text-[#22336C]">
                {locale === "ar"
                  ? "تم تأكيد الحجز بنجاح!"
                  : "Reservation Confirmed Successfully!"}
              </h3>
              <p className="text-gray-600 text-sm">
                {locale === "ar"
                  ? "شكراً لك! تم تأكيد حجزك ودفع المبلغ بنجاح."
                  : "Thank you! Your reservation has been confirmed and payment processed successfully."}
              </p>
            </div>
            <Button
              onClick={handleCloseSuccessDialog}
              className="bg-[#4D5EDB] hover:bg-[#3646a5] text-white min-w-[200px]"
            >
              {locale === "ar" ? "حسناً" : "OK"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
