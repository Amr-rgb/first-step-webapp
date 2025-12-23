"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/general/DatePicker";

interface AcceptEnrollmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: {
    startingDate?: string;
    startingTime?: string;
    dayString?: string;
  }) => void;
  isLoading?: boolean;
  enrollmentType?: string;
}

export const AcceptEnrollmentModal = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  enrollmentType = "",
}: AcceptEnrollmentModalProps) => {
  const t = useTranslations("dashboard.center-bookings");
  const [startingDate, setStartingDate] = useState<Date | undefined>(undefined);
  const [startingTime, setStartingTime] = useState("");
  const [dayString, setDayString] = useState<Date | undefined>(undefined);

  const isHourly = enrollmentType === "hour";

  const handleConfirm = () => {
    if (isHourly) {
      if (startingTime && dayString) {
        onConfirm({ 
          startingTime, 
          dayString: dayString.toISOString().split("T")[0] 
        });
      }
    } else {
      if (startingDate) {
        onConfirm({ 
          startingDate: startingDate.toISOString().split("T")[0] 
        });
      }
    }
  };

  const handleClose = () => {
    setStartingDate(undefined);
    setStartingTime("");
    setDayString(undefined);
    onOpenChange(false);
  };

  const isValid = isHourly ? startingTime && dayString : startingDate;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-primary">
            {t("confirmBooking")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isHourly ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="day_string">التاريخ</Label>
                <DatePicker
                  value={dayString}
                  onChange={setDayString}
                  standalone
                  allowFuture={true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="starting_time">وقت البدء</Label>
                <Input
                  id="starting_time"
                  type="time"
                  value={startingTime}
                  onChange={(e) => setStartingTime(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="starting_date">{t("fields.startDay")}</Label>
              <DatePicker
                value={startingDate}
                onChange={setStartingDate}
                standalone
                allowFuture={true}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={isLoading || !isValid}
            >
              {isLoading ? "جاري التأكيد..." : t("confirmBooking")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
