"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";

interface ServiceTypeToggleProps {
  selectedType: "parent" | "center";
  onToggle: (type: "parent" | "center") => void;
}

const ServiceTypeToggle = ({
  selectedType,
  onToggle,
}: ServiceTypeToggleProps) => {
  const locale = useLocale();

  const TOGGLE_OPTIONS = [
    {
      label: locale === "ar" ? "ولي أمر" : "Parent",
      type: "parent",
      image: "/assets/illustrations/parent.png",
      width: 140,
    },
    {
      label: locale === "ar" ? "حضَانة أو مركز" : "Nursery or Center",
      type: "center",
      image: "/assets/illustrations/center.png",
      width: 78,
    },
  ];

  const CARD_CLASSES =
    "w-[140px] h-[200px] lg:w-[180px] lg:h-[240px] border-2 rounded-2xl p-4 flex flex-col items-center justify-center transition-all duration-300";

  return (
    <div className="flex justify-center gap-8 pt-12">
      {TOGGLE_OPTIONS.map((item, index) => {
        const isSelected = selectedType === item.type;
        return (
          <motion.div
            key={item.type}
            onClick={() => onToggle(item.type as "parent" | "center")}
            className={`${CARD_CLASSES} ${
              isSelected
                ? "border-secondary-mint-green shadow-md"
                : "border-gray-300"
            } cursor-pointer`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            transition={{ delay: 0.1 * index }}
          >
            <Image
              src={item.image}
              alt={item.label}
              width={item.width}
              height={120}
              className="h-20 w-auto md:h-24 lg:h-[120px] mb-3"
            />

            <span className="text-base lg:text-lg font-medium text-gray-700">
              {item.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ServiceTypeToggle;
