"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Bookings } from "@/components/dashboard/parent-bookings/Bookings";

export default function ParentBookingsPage() {
  const searchParams = useSearchParams();
  const enrollmentId = searchParams.get("enrollmentId");

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

  return (
    <div className="flex flex-col gap-5">
      <Bookings />
    </div>
  );
}
