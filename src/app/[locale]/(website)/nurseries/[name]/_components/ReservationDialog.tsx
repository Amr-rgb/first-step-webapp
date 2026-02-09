"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ReservationForm from "@/components/general/nurseries/ReservationForm";

interface ReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nurseryName: string;
  selectedBranch?: string;
  selectedPlanId?: number;
  locale: "ar" | "en";
}

const ReservationDialog = ({
  isOpen,
  onClose,
  nurseryName,
  selectedBranch,
  selectedPlanId,
  locale,
}: ReservationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-5xl p-0 pt-10 overflow-hidden rounded-3xl border-none bg-white max-h-[90vh] flex flex-col">
        <DialogTitle className="sr-only">Reservation Form</DialogTitle>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-2">
          <ReservationForm
            nurseryName={nurseryName}
            selectedProgram=""
            locale={locale}
            selectedBranch={selectedBranch}
            selectedPlan=""
            isDialogMode={true}
            onClose={onClose}
            preSelectedPlanId={selectedPlanId}
            showOnlySelectedPlan={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
