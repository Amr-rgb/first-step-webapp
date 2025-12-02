"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { centerService } from "@/services/dashboardApi";
import { Branch } from "@/types";
import { toastError, toastSuccess } from "@/lib/toast";
import Image from "next/image";

interface GateCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (code: string) => void;
}

const GateCodeModal: React.FC<GateCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const t = useTranslations("dashboard.center.gate.modal");
  const [step, setStep] = useState<"select" | "success">("select");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBranches, setIsFetchingBranches] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchBranches();
      setStep("select");
      setSelectedBranchId("");
      setGeneratedCode("");
    }
  }, [isOpen]);

  const fetchBranches = async () => {
    try {
      setIsFetchingBranches(true);
      const response = await centerService.getBranches();
      // Handle different response structures if necessary
      const branchesData = Array.isArray(response)
        ? response
        : response.data || [];
      setBranches(branchesData);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toastError("Failed to fetch branches");
    } finally {
      setIsFetchingBranches(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedBranchId) return;

    try {
      setIsLoading(true);
      const response = await centerService.generateGateCode(selectedBranchId);

      if (response.success && response.data?.code) {
        setGeneratedCode(response.data.code);
        setStep("success");
        if (onSuccess) {
          onSuccess(response.data.code);
        }
      } else {
        toastError(response.message || "Failed to generate code");
      }
    } catch (error: any) {
      console.error("Error generating code:", error);
      toastError(error.message || "Failed to generate code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toastSuccess(t("copied"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[20px] p-0 overflow-hidden bg-white">
        <div className="relative p-6 flex flex-col items-center justify-center text-center min-h-[400px]">
          {step === "select" ? (
            <div className="w-full max-w-xs space-y-6">
              <div className="flex justify-center mb-4">
                <Image
                  src="/assets/illustrations/gate.png"
                  alt="Gate"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary">
                  {t("title")}
                </h2>
                <p className="text-gray-500 text-sm">{t("successSubtitle")}</p>
              </div>

              <div className="space-y-4 w-full">
                <Select
                  value={selectedBranchId}
                  onValueChange={setSelectedBranchId}
                  disabled={isFetchingBranches}
                >
                  <SelectTrigger className="w-full h-12 text-right dir-rtl">
                    <SelectValue
                      placeholder={
                        isFetchingBranches ? "Loading..." : t("selectBranch")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleGenerate}
                  disabled={!selectedBranchId || isLoading}
                  className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90"
                >
                  {isLoading ? "Generating..." : t("generate")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-xs space-y-8 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center">
                <Image
                  src="/assets/illustrations/gate.png"
                  alt="Gate"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary">
                  {t("successTitle")}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t("successSubtitle")}
                </p>
              </div>

              <div className="flex justify-center gap-3 py-2">
                {generatedCode.split("").map((digit, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-14 flex items-center justify-center border-2 border-primary rounded-xl text-2xl font-bold text-primary bg-white shadow-sm"
                  >
                    {digit}
                  </div>
                ))}
              </div>

              <Button
                onClick={handleCopy}
                className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90"
              >
                {t("copyButton")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GateCodeModal;
