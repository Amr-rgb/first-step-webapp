"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { parentService } from "@/services/dashboardApi";
import { motion } from "framer-motion";

interface ReservationFormProps {
  nurseryName: string;
  selectedProgram: string;
  locale: "ar" | "en";
}

interface FormData {
  program: string;
  fromTime: string;
  toTime: string;
  numberOfHours: string;
  bookingDate: string;
  selectedChildren: string[];
}

const programs = {
  ar: [
    { id: "monthly", name: "شهري", price: "50 ر.س" },
    { id: "weekly", name: "أسبوعي", price: "50 ر.س" },
    { id: "daily", name: "يومي", price: "50 ر.س" },
    { id: "hourly", name: "بالساعة", price: "50 ر.س" },
  ],
  en: [
    { id: "monthly", name: "Monthly", price: "50 SAR" },
    { id: "weekly", name: "Weekly", price: "50 SAR" },
    { id: "daily", name: "Daily", price: "50 SAR" },
    { id: "hourly", name: "Hourly", price: "50 SAR" },
  ],
};

const timeOptions = [
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "24:00",
];

const mockChildren = [
  { id: "1", name: "أحمد", nameEn: "Ahmed", gender: "boy" },
  { id: "2", name: "فاطمة", nameEn: "Fatima", gender: "girl" },
  { id: "3", name: "محمد", nameEn: "Mohammed", gender: "boy" },
  { id: "4", name: "عائشة", nameEn: "Aisha", gender: "girl" },
];

const ReservationForm = ({
  nurseryName,
  selectedProgram,
  locale,
}: ReservationFormProps) => {
  const t = useTranslations();
  const [program, setProgram] = useState(selectedProgram || "hourly");
  const [fromTime, setFromTime] = useState("03:00");
  const [toTime, setToTime] = useState("07:00");
  const [bookingDate, setBookingDate] = useState("");
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    data: realChildren,
    isLoading: isChildrenLoading,
    error: childrenError,
  } = useQuery<Array<any>>({
    queryKey: ["parent-children"] as const,
    queryFn: parentService.getParentChildren,
  });

  const handleChildSelect = (id: string) => {
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  };

  const dir = locale === "ar" ? "rtl" : "ltr";
  const isRTL = locale === "ar";

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 60 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#22336C] mb-4">
          {locale === "ar"
            ? "تم إرسال طلب الحجز بنجاح!"
            : "Reservation Request Sent Successfully!"}
        </h2>
        <p className="text-gray-600 mb-6">
          {locale === "ar"
            ? "سنتواصل معك قريباً لتأكيد تفاصيل الحجز."
            : "We will contact you soon to confirm the reservation details."}
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="bg-[#4D5EDB] hover:bg-[#3646a5] text-white rounded-lg px-6 py-2 font-bold transition"
        >
          {locale === "ar" ? "إرسال طلب آخر" : "Submit Another Request"}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      dir={dir}
      className="space-y-8"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 60 }}
    >
      {/* Program Type Selection */}
      <motion.div
        className="flex flex-row items-center gap-4 max-w-2xl mx-auto mb-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 60 }}
      >
        {programs[locale].map((p) => {
          const selected = program === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className={`flex-1 flex flex-col items-center py-3 px-4 rounded-xl border-2 transition font-bold text-base mb-2
                ${
                  selected
                    ? "bg-[#4D5EDB] text-white border-[#4D5EDB] shadow border-dashed outline-dashed outline-2 outline-[#4D5EDB]"
                    : "bg-[#F7F8FA] text-gray-700 border-gray-300 border-solid focus:outline-none"
                }
              `}
              onClick={() => setProgram(p.id)}
              tabIndex={0}
            >
              <span
                className={`text-lg font-extrabold mb-1 ${
                  selected ? "text-white" : "text-[#4D5EDB]"
                }`}
              >
                {p.price}
              </span>
              <span className="w-full h-px bg-[#DADADA] mb-1" />
              <span
                className={`text-base font-bold ${
                  selected ? "text-white" : "text-[#22336C]"
                }`}
              >
                {p.name}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Time Selection */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4, type: 'spring', stiffness: 60 }}
      >
        <label className="block font-bold mb-2 text-[#22336C] text-center">
          {locale === "ar" ? "عدد الساعات" : "Number of Hours"}
        </label>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex flex-col items-center">
            <span className="mb-1 text-sm text-gray-600">
              {locale === "ar" ? "من" : "From"}
            </span>
            <select
              className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 focus:ring-2 focus:ring-[#4D5EDB]"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
            >
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <span className="font-bold text-lg">-</span>
          <div className="flex flex-col items-center">
            <span className="mb-1 text-sm text-gray-600">
              {locale === "ar" ? "إلى" : "To"}
            </span>
            <select
              className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 focus:ring-2 focus:ring-[#4D5EDB]"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
            >
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Date Picker */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, type: 'spring', stiffness: 60 }}
      >
        <label className="block font-bold mb-2 text-[#22336C] text-center">
          {locale === "ar" ? "تاريخ الحجز" : "Booking Date"}
        </label>
        <div className="relative max-w-xs mx-auto">
          <input
            type="date"
            className="w-full bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 focus:ring-2 focus:ring-[#4D5EDB] pr-10"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
            style={isRTL ? { textAlign: "right" } : {}}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#4D5EDB"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
        </div>
      </motion.div>

      {/* Child Selection (Rectangles, Grayscale by Default, Color on Select) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4, type: 'spring', stiffness: 60 }}
      >
        <label className="block font-bold mb-2 text-[#22336C] text-center">
          {locale === "ar" ? "اختر طفل أو أكثر" : "Select One or More Children"}
        </label>
        <div
          className="flex gap-4 justify-start overflow-x-auto pb-2 custom-scrollbar"
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          {(realChildren && realChildren.length > 0
            ? realChildren
            : mockChildren
          ).map((child, idx) => {
            return (
              <motion.button
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.08,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 60,
                }}
                type="button"
                key={child.id}
                onClick={() => handleChildSelect(child.id.toString())}
                className={`flex flex-col items-center p-2 rounded-lg border-2 transition min-w-[110px] w-24 h-32 md:min-w-[120px] md:w-28 md:h-36 justify-start
                  ${
                    selectedChildren.includes(child.id.toString())
                      ? "border-[#4D5EDB] shadow"
                      : "border-gray-300"
                  } focus:outline-none bg-white hover:shadow-lg`}
                style={{ flex: "0 0 auto", marginRight: 12 }}
              >
                <div
                  className={`w-16 h-16 flex items-center justify-center ${
                    selectedChildren.includes(child.id.toString())
                      ? "mb-0 mt-0"
                      : "mb-2 mt-2"
                  } transition-all duration-200`}
                  style={{
                    marginTop: selectedChildren.includes(child.id.toString())
                      ? 0
                      : undefined,
                  }}
                >
                  <Image
                    src={
                      child.gender === "boy"
                        ? "/assets/illustrations/boy.png"
                        : "/assets/illustrations/girl.png"
                    }
                    alt={child.child_name || child.nameEn}
                    width={64}
                    height={64}
                    style={{
                      objectFit: "contain",
                      filter: selectedChildren.includes(child.id.toString())
                        ? "none"
                        : "grayscale(100%) brightness(0.8)",
                      transform: selectedChildren.includes(child.id.toString())
                        ? "scale(1.1)"
                        : "scale(1)",
                      transition: "all 0.2s",
                    }}
                  />
                </div>
                <span
                  className={`font-bold text-sm text-center mt-2 ${
                    selectedChildren.includes(child.id.toString())
                      ? "text-[#22336C]"
                      : "text-gray-600"
                  }`}
                >
                  {child.child_name ||
                    child.name ||
                    (locale === "ar" ? child.name : child.nameEn)}
                </span>
                {selectedChildren.includes(child.id.toString()) && (
                  <span className="mt-1 text-[#4D5EDB] text-xs font-bold">
                    ✓
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Booking Summary Section */}
      <motion.div
        className="max-w-md mx-auto bg-white rounded-xl shadow p-6 mb-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4, type: 'spring', stiffness: 60 }}
      >
        <h3 className="font-bold text-lg text-[#22336C] mb-4 text-center">
          {locale === "ar" ? "تفاصيل الحجز" : "Booking Summary"}
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>{locale === "ar" ? "البرنامج" : "Program"}</span>
            <span>{programs[locale].find((p) => p.id === program)?.name}</span>
          </div>
          <div className="flex justify-between">
            <span>{locale === "ar" ? "الوقت" : "Time"}</span>
            <span>
              {fromTime} - {toTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span>
              {locale === "ar" ? "عدد الأطفال" : "Number of children"}
            </span>
            <span>{selectedChildren.length}</span>
          </div>
          <div className="flex justify-between">
            <span>{locale === "ar" ? "التاريخ" : "Date"}</span>
            <span>{bookingDate ? bookingDate : "--"}</span>
          </div>
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between items-center">
          <span className="font-bold text-[#22336C] text-base">
            {locale === "ar" ? "السعر الإجمالي" : "Total"}
          </span>
          <span className="font-extrabold text-2xl text-[#4D5EDB]">
            450 {locale === "ar" ? "ر.س" : "SAR"}
          </span>
        </div>
      </motion.div>

      {/* Notice Paragraph */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, type: 'spring', stiffness: 60 }}
        className="text-xs text-gray-400 text-center max-w-lg mx-auto"
      >
        {locale === "ar"
          ? "تأكيد الحجز يعني الموافقة على الشروط والأحكام وسياسة الخصوصية الخاصة بنا."
          : "Confirming the booking means you accept the terms and conditions and our privacy policy."}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting || !bookingDate || selectedChildren.length === 0}
        className="w-full bg-[#4D5EDB] hover:bg-[#3646a5] text-white rounded-lg px-6 py-3 font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4, type: 'spring', stiffness: 60 }}
      >
        {isSubmitting
          ? locale === "ar"
            ? "جاري الإرسال..."
            : "Submitting..."
          : locale === "ar"
          ? "قم بتأكيد الحجز الآن"
          : "Confirm Booking Now"}
      </motion.button>
      {/* Custom Scrollbar Styles - must be inside the component */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4d5edb #f7f8fa;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          background: #f7f8fa;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4d5edb;
          border-radius: 6px;
          min-width: 40px;
          transition: background 0.2s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #22336c;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f7f8fa;
          border-radius: 6px;
        }
      `}</style>
    </motion.form>
  );
};

export default ReservationForm;
