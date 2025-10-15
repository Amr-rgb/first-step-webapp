"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ParentAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ParentAccountsModal: React.FC<ParentAccountsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const t = useTranslations("parentAccounts");
  const locale = useLocale();
  const [currentStep, setCurrentStep] = useState(0);

  const handleCreateAccount = () => {
    // Move to next step
    setCurrentStep(1);
  };

  const isRTL = locale === "ar";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "max-w-md max-h-[90vh] overflow-y-auto rounded-[40px]",
          isRTL ? "text-right" : "text-left"
        )}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* First Step Content */}
        {currentStep === 0 && (
          <div className="flex flex-col items-center space-y-6 py-8">
            {/* Add Users Icon */}
            <Image
              src="/assets/illustrations/add-users.png"
              alt="Add Users"
              width={120}
              height={120}
              className="w-[100px] h-[150px]"
            />

            {/* Title */}
            <h2 className="text-xl font-bold text-center text-primary-blue">
              {t("createParentAccounts")}
            </h2>

            {/* Create Account Button */}
            <Button
              onClick={handleCreateAccount}
              className="blue-gradient text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {t("createParentAccount")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ParentAccountsModal;
