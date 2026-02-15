"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { Button } from "@/components/ui/button";
import { centerService } from "@/services/dashboardApi";
import { toastSuccess, toastError } from "@/lib/toast";
import Image from "next/image";
import { Copy, Loader2 } from "lucide-react";

import GateCodeModal from "@/components/modals/GateCodeModal";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/tables/DataTable";
import {
  useAttendanceColumns,
  Attendance,
} from "@/components/tables/data/attendance";
import DatePicker from "@/components/general/DatePicker";
import { useEffect } from "react";
import { format, isSameDay, parse } from "date-fns";

export default function FirstStepGatePage() {
  usePageMetadata();
  const t = useTranslations("dashboard.center.gate");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = useAttendanceColumns();

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const response = await centerService.getAllAttendance();
      // The API response.data is protected by the service to return response.data already
      // Wait, let's check centerService.getAllAttendance in the file
      setAttendance(response.data || []);
    } catch (error) {
      toastError(t("errors.fetchAttendance") || "Failed to fetch attendance");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filteredAttendance = attendance.filter((item) => {
    if (!date) return true;

    // Check item.created_date which is in "30/11/2025" or similar format
    try {
      const itemDate = parse(item.created_date, "dd/MM/yyyy", new Date());
      return isSameDay(itemDate, date);
    } catch (e) {
      console.error("Error parsing date:", item.created_date);
      return false;
    }
  });

  const handleCopyLink = (type: "googleplay" | "appstore") => {
    // For now, just show "Link copied" toast
    // In the future, you can replace these with actual app links
    const links = {
      googleplay: "https://play.google.com/store/apps/details?id=com.firststep",
      appstore: "https://apps.apple.com/app/first-step/id123456789",
    };

    navigator.clipboard.writeText(links[type]);
    toastSuccess(t("success.linkCopied"));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl blue-gradient p-8 flex flex-col justify-between gap-y-6 lg:flex-row">
        <div className="relative z-10">
          {/* Left Side - Content */}
          <div
            className={cn(
              "flex flex-col justify-center items-center lg:items-start gap-y-6",
              "text-center ltr:text-left rtl:text-right"
            )}
          >
            <div>
              <h1 className="heading-3 mb-2 font-bold text-white">
                {t("title")}
              </h1>
              <p className="text-white">{t("subtitle")}</p>
            </div>

            {/* App Store Badges */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-white">
                {t("downloadApp")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleCopyLink("googleplay")}
                  className="transition-transform hover:scale-105"
                >
                  <Image
                    src="/assets/store/googleplay.png"
                    alt="Google Play"
                    width={150}
                    height={45}
                    className="h-10 w-auto"
                  />
                </button>
                <button
                  onClick={() => handleCopyLink("appstore")}
                  className="transition-transform hover:scale-105"
                >
                  <Image
                    src="/assets/store/appstore.png"
                    alt="App Store"
                    width={150}
                    height={45}
                    className="h-10 w-auto"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col justify-end items-center gap-y-2">
          {/* Right Side - Illustration */}
          <div className="hidden items-center justify-center lg:flex z-10 absolute inset-0">
            <div className="relative h-64 w-64">
              <Image
                src="/assets/illustrations/gate.png"
                alt={t("title")}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Code Display */}
          <div className="z-20 flex items-center gap-3">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={cn(
                    "flex size-12 items-center justify-center rounded-lg border-2 border-primary bg-white text-2xl font-bold text-primary shadow-sm opacity-60",
                    (index === 1 || index === 2) && "opacity-80"
                  )}
                >
                  <span className="">*</span>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="z-20 bg-white text-primary hover:text-white"
            variant="defaultNoGradient"
            size="lg"
          >
            {t("buttons.generate")}
          </Button>
        </div>
      </div>

      {/* Attendance Table Section */}
      <div>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="heading-4 font-medium text-primary">
            {t("attendanceTitle")}
          </h2>

          <div className="w-full sm:w-64">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-muted-foreground block">
                {t("table.date")}
              </label>
              {date && (
                <button
                  onClick={() => setDate(undefined)}
                  className="text-xs text-primary hover:underline transition-all"
                >
                  {t("table.showAll")}
                </button>
              )}
            </div>
            <DatePicker value={date} onChange={setDate} standalone={true} />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {t("loading") || "Loading attendance records..."}
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredAttendance}
            noResultsMessage={t("table.noData")}
            pagination
          />
        )}
      </div>

      <GateCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
