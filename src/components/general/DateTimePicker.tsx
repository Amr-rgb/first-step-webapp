"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { format, parse, isValid } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateTimePickerProps {
  dateValue: Date | undefined;
  timeValue: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  disabled?: (date: Date) => boolean;
  inputDisabled?: boolean;
  standalone?: boolean;
  allowFuture?: boolean;
  fromYear?: number;
  toYear?: number;
  locale?: "ar" | "en";
  showTime?: boolean;
}

const center = 96;

const DateTimePicker = ({
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  disabled,
  inputDisabled,
  standalone = false,
  allowFuture = true,
  fromYear,
  toYear,
  locale = "en",
  showTime = true,
}: DateTimePickerProps) => {
  const [open, setOpen] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [inputValue, setInputValue] = useState(
    dateValue ? format(dateValue, "yyyy-MM-dd") : "",
  );

  // Time state
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [selectionMode, setSelectionMode] = useState<"hours" | "minutes">(
    "hours",
  );
  const [isDragging, setIsDragging] = useState(false);

  // Initialize state from timeValue
  useEffect(() => {
    if (timeValue) {
      const [h, m] = timeValue.split(":");
      let hour = parseInt(h);
      const minute = parseInt(m);

      const isPm = hour >= 12;
      if (hour > 12) hour -= 12;
      if (hour === 0) hour = 12;

      setSelectedHour(hour);
      setSelectedMinute(minute);
      setPeriod(isPm ? "PM" : "AM");
    } else {
      // Default to 9:00 AM if no time
      setSelectedHour(9);
      setSelectedMinute(0);
      setPeriod("AM");
    }
  }, [timeValue, setSelectedHour, setSelectedMinute, setPeriod]);

  // Handle manual input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      // Try parsing full datetime
      const fullFormats = [
        "yyyy-MM-dd HH:mm",
        "yyyy-MM-dd h:mm a",
        "dd/MM/yyyy HH:mm",
        "dd/MM/yyyy h:mm a",
      ];
      let parsed: Date | undefined;

      for (const f of fullFormats) {
        const d = parse(newValue, f, new Date());
        if (isValid(d)) {
          parsed = d;
          break;
        }
      }

      if (parsed) {
        onDateChange(parsed);
        const hour24 = parsed.getHours();
        const mins = parsed.getMinutes();
        onTimeChange(
          `${hour24.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`,
        );
      } else {
        // Fallback to just date parsing
        const dateFormats = [
          "yyyy-MM-dd",
          "dd/MM/yyyy",
          "MM/dd/yyyy",
          "dd-MM-yyyy",
        ];
        let parsedDate: Date | undefined;

        for (const formatStr of dateFormats) {
          const date = parse(newValue.split(" ")[0], formatStr, new Date());
          if (isValid(date)) {
            parsedDate = date;
            break;
          }
        }

        if (parsedDate) {
          onDateChange(parsedDate);
        } else if (newValue === "") {
          onDateChange(undefined);
        }
      }
    },
    [onDateChange, onTimeChange],
  );

  const updateTime = useCallback(
    (h: number, m: number, p: "AM" | "PM") => {
      let hour24 = h;
      if (p === "PM" && hour24 !== 12) hour24 += 12;
      if (p === "AM" && hour24 === 12) hour24 = 0;

      const formattedTime = `${hour24.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      onTimeChange(formattedTime);
    },
    [onTimeChange],
  );

  const handleCalendarSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        onDateChange(undefined);
        return;
      }
      onDateChange(date);
      setInputValue(format(date, "yyyy-MM-dd"));
      if (showTime) {
        setShowTimePicker(true);
        setSelectionMode("hours");
      } else {
        setOpen(false);
      }
    },
    [onDateChange, showTime],
  );

  const getClockPosition = (
    value: number,
    radius: number,
    isMinutes: boolean,
  ) => {
    const angle = isMinutes ? value * 6 - 90 : value * 30 - 90;
    const radian = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian),
    };
  };

  const handleDrag = useCallback(
    (clientX: number, clientY: number, isFinal: boolean = false) => {
      const rect = document
        .getElementById("clock-face")
        ?.getBoundingClientRect();
      if (!rect) return;

      const x = clientX - rect.left - center;
      const y = clientY - rect.top - center;

      let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
      if (angle < 0) angle += 360;

      if (selectionMode === "hours") {
        let hour = Math.round(angle / 30);
        if (hour === 0) hour = 12;
        if (hour > 12) hour = 12;
        setSelectedHour(hour);
        if (isFinal) {
          setSelectionMode("minutes");
          updateTime(hour, selectedMinute, period);
        }
      } else {
        let minute = Math.round(angle / 6);
        if (minute === 60) minute = 0;
        setSelectedMinute(minute);
        if (isFinal) {
          updateTime(selectedHour, minute, period);
          setOpen(false);
        }
      }
    },
    [selectionMode, selectedHour, selectedMinute, period, updateTime],
  );

  const currentYear = new Date().getFullYear();
  const defaultToYear = allowFuture ? currentYear + 20 : currentYear;

  // Render input with icon
  const inputContent = (
    <div className="relative">
      <Input
        value={
          dateValue
            ? showTime && timeValue
              ? `${format(dateValue, "yyyy-MM-dd")} ${timeValue}`
              : format(dateValue, "yyyy-MM-dd")
            : inputValue || ""
        }
        onChange={handleInputChange}
        placeholder={showTime ? "YYYY-MM-DD HH:MM" : "YYYY-MM-DD"}
        disabled={inputDisabled}
        className={cn(
          "ltr:pr-10 rtl:pl-10",
          inputDisabled && "cursor-not-allowed opacity-50",
          !dateValue && "text-mid-gray",
        )}
      />
      <div className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 flex gap-2 pointer-events-none text-gray-400">
        <CalendarIcon className="h-4 w-4" />
      </div>
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>{inputContent}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {!showTimePicker ? (
          <div>
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={handleCalendarSelect}
              disabled={
                disabled ||
                (allowFuture
                  ? undefined
                  : (date) =>
                      date > new Date() || date < new Date("1900-01-01"))
              }
              captionLayout="dropdown"
              fromYear={fromYear || 1900}
              toYear={toYear || defaultToYear}
              className="rounded-md border-none p-3"
            />
          </div>
        ) : (
          <div className="p-3 w-[280px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setShowTimePicker(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title={locale === "ar" ? "رجوع" : "Back"}
              >
                {locale === "ar" ? (
                  <ArrowRight className="h-5 w-5 text-gray-500" />
                ) : (
                  <ArrowLeft className="h-5 w-5 text-gray-500" />
                )}
              </button>
              <h3 className="text-base font-bold text-primary">
                {selectionMode === "hours"
                  ? locale === "ar"
                    ? "اختر الساعة"
                    : "Select Hour"
                  : locale === "ar"
                    ? "اختر الدقائق"
                    : "Select Minutes"}
              </h3>
              <div className="w-7 h-7" /> {/* Spacer */}
            </div>

            {/* AM/PM Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg w-fit mx-auto mb-4">
              <button
                type="button"
                onClick={() => {
                  setPeriod("AM");
                  updateTime(selectedHour, selectedMinute, "AM");
                }}
                className={cn(
                  "px-6 py-1.5 rounded-md text-sm font-bold transition-all",
                  period === "AM"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => {
                  setPeriod("PM");
                  updateTime(selectedHour, selectedMinute, "PM");
                }}
                className={cn(
                  "px-6 py-1.5 rounded-md text-sm font-bold transition-all",
                  period === "PM"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                PM
              </button>
            </div>

            {/* Analog Clock Face */}
            <div
              id="clock-face"
              className="relative w-48 h-48 mx-auto mb-6 cursor-crosshair touch-none"
              onMouseDown={() => setIsDragging(true)}
              onMouseMove={(e) =>
                isDragging && handleDrag(e.clientX, e.clientY)
              }
              onMouseUp={(e) => {
                if (isDragging) {
                  handleDrag(e.clientX, e.clientY, true);
                  setIsDragging(false);
                }
              }}
              onMouseLeave={() => setIsDragging(false)}
              onTouchStart={() => setIsDragging(true)}
              onTouchMove={(e) =>
                isDragging &&
                handleDrag(e.touches[0].clientX, e.touches[0].clientY)
              }
              onTouchEnd={(e) => {
                if (isDragging) {
                  handleDrag(
                    e.changedTouches[0].clientX,
                    e.changedTouches[0].clientY,
                    true,
                  );
                  setIsDragging(false);
                }
              }}
            >
              {/* Clock Background */}
              <div className="absolute inset-0 rounded-full bg-gray-50 border border-gray-100 shadow-inner" />

              <svg
                width="192"
                height="192"
                className="absolute inset-0 pointer-events-none z-10"
              >
                {/* Center Dot */}
                <circle cx={center} cy={center} r="3" fill="#4d5edb" />

                {/* Hand Line */}
                <line
                  x1={center}
                  y1={center}
                  x2={
                    getClockPosition(
                      selectionMode === "hours" ? selectedHour : selectedMinute,
                      60,
                      selectionMode === "minutes",
                    ).x
                  }
                  y2={
                    getClockPosition(
                      selectionMode === "hours" ? selectedHour : selectedMinute,
                      60,
                      selectionMode === "minutes",
                    ).y
                  }
                  stroke="#4d5edb"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              {/* Numbers */}
              {(selectionMode === "hours"
                ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
              ).map((val) => {
                const pos = getClockPosition(
                  val,
                  70,
                  selectionMode === "minutes",
                );
                const isSelected =
                  selectionMode === "hours"
                    ? selectedHour === val
                    : selectedMinute === val;

                return (
                  <button
                    key={`${selectionMode}-${val}`}
                    type="button"
                    onClick={() => {
                      if (selectionMode === "hours") {
                        setSelectedHour(val);
                        setSelectionMode("minutes");
                        updateTime(val, selectedMinute, period);
                      } else {
                        setSelectedMinute(val);
                        updateTime(selectedHour, val, period);
                        setOpen(false);
                      }
                    }}
                    className={cn(
                      "absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-sm font-bold transition-all z-20 pointer-events-auto",
                      isSelected
                        ? "bg-primary text-white scale-110 shadow-md"
                        : "text-gray-600 hover:bg-gray-200",
                    )}
                    style={{
                      left: pos.x,
                      top: pos.y,
                    }}
                  >
                    {val === 0 && selectionMode === "minutes" ? "00" : val}
                  </button>
                );
              })}
            </div>

            {/* Selected Time Display & Done */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectionMode("hours")}
                  className={cn(
                    "text-3xl font-bold p-1 rounded transition-colors",
                    selectionMode === "hours"
                      ? "bg-primary/10 text-primary"
                      : "text-gray-900 hover:bg-gray-50",
                  )}
                >
                  {selectedHour.toString().padStart(2, "0")}
                </button>
                <span className="text-3xl font-bold text-gray-300 animate-pulse">
                  :
                </span>
                <button
                  type="button"
                  onClick={() => setSelectionMode("minutes")}
                  className={cn(
                    "text-3xl font-bold p-1 rounded transition-colors",
                    selectionMode === "minutes"
                      ? "bg-primary/10 text-primary"
                      : "text-gray-900 hover:bg-gray-50",
                  )}
                >
                  {selectedMinute.toString().padStart(2, "0")}
                </button>
                <span className="ml-1.5 text-lg font-medium text-gray-400">
                  {period}
                </span>
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
