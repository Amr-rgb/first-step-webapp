"use client";

import { ImagesUploader } from "@/components/forms/ImagesUploader";
import { Label } from "@/components/ui/label";
import { PortfolioFormData } from "@/types";
import { useTranslations } from "next-intl";

interface AdsSectionProps {
  data: PortfolioFormData;
  onChange: (data: PortfolioFormData) => void;
}

export const AdsSection = ({ data, onChange }: AdsSectionProps) => {
  const t = useTranslations("profileEditor.ads");

  return (
    <div className="border border-border rounded-lg p-4 sm:p-6 bg-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">{t("title")}</h3>
          {data.ads_images?.length > 0 && (
            <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
              {data.ads_images.length}{" "}
              {data.ads_images.length === 1 ? "ad" : "ads"}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">{t("addImage")}</Label>
          <ImagesUploader
            value={data.ads_images || []}
            onChange={(files) =>
              onChange({
                ...data,
                ads_images: files,
              })
            }
            accept="image/*"
            maxSizeMB={5}
          />
        </div>

        {(!data.ads_images || data.ads_images.length === 0) && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-muted-foreground space-y-2">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v12h12V6H6zm3 3h6v2H9V9zm0 4h6v2H9v-2z"
                  />
                </svg>
              </div>
              <p className="text-sm">{t("noImages")}</p>
              <p className="text-xs text-muted-foreground/75">
                Upload promotional images or advertisements for your nursery
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
