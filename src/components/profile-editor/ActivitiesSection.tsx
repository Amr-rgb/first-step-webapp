"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagesUploader } from "@/components/forms/ImagesUploader";
import { PortfolioFormData } from "@/types";
import { useTranslations } from "next-intl";

interface ActivitiesSectionProps {
  data: PortfolioFormData;
  onChange: (data: PortfolioFormData) => void;
}

export const ActivitiesSection = ({
  data,
  onChange,
}: ActivitiesSectionProps) => {
  const t = useTranslations("dashboard.profileEditor.activities");

  const handleTitleChange = (value: string) => {
    onChange({
      ...data,
      activity_section_title: value,
    });
  };

  const handleSubtitleChange = (value: string) => {
    onChange({
      ...data,
      activity_section_subtitle: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Title and Subtitle */}
      <div className="grid grid-cols-1">
        {/* <div className="space-y-2">
          <Label
            htmlFor="activity_section_title"
            className="text-sm font-medium"
          >
            {t("sectionTitle")}
          </Label>
          <Input
            id="activity_section_title"
            value={data.activity_section_title || ""}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder={t("sectionTitlePlaceholder")}
            className="h-10"
          />
        </div> */}

        <div className="space-y-2">
          <Label
            htmlFor="activity_section_subtitle"
            className="text-sm font-medium"
          >
            {t("sectionSubtitle")}
          </Label>
          <Input
            id="activity_section_subtitle"
            value={data.activity_section_subtitle || ""}
            onChange={(e) => handleSubtitleChange(e.target.value)}
            placeholder={t("sectionSubtitlePlaceholder")}
            className="h-10"
          />
        </div>
      </div>

      {/* Images Upload Section */}
      <div className="border border-border rounded-lg p-4 sm:p-6 bg-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold">
              {t("activityImages")}
            </h3>
            {data.images_activities?.length > 0 && (
              <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {data.images_activities.length}{" "}
                {data.images_activities.length === 1 ? "image" : "images"}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">{t("addImage")}</Label>
            <ImagesUploader
              value={data.images_activities || []}
              onChange={(files) =>
                onChange({
                  ...data,
                  images_activities: files,
                })
              }
              accept="image/*"
              maxSizeMB={5}
            />
          </div>

          {(!data.images_activities || data.images_activities.length === 0) && (
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm">{t("noImages")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
