"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { PortfolioFormData } from "@/types";
import { useTranslations } from "next-intl";

interface HeroSectionProps {
  data?: PortfolioFormData;
  onChange: (data: PortfolioFormData) => void;
}

export const HeroSection = ({ data, onChange }: HeroSectionProps) => {
  const t = useTranslations("dashboard.profileEditor.hero");

  const handleChange = (field: string, value: string | File) => {
    if (!data) return;
    onChange({
      ...data,
      [field]: value,
    });
  };

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Title + Subtitle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title_of_hero">{t("title")}</Label>
          <Input
            id="title_of_hero"
            value={data.title_of_hero}
            onChange={(e) => handleChange("title_of_hero", e.target.value)}
            placeholder={t("titlePlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle_of_hero">{t("subtitle")}</Label>
          <Input
            id="subtitle_of_hero"
            value={data.subtitle_of_hero}
            onChange={(e) => handleChange("subtitle_of_hero", e.target.value)}
            placeholder={t("subtitlePlaceholder")}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="description">{t("description")}</Label>
          <span className="text-xs text-muted-foreground">
            {data.description.length}/120
          </span>
        </div>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder={t("descriptionPlaceholder")}
          rows={4}
          maxLength={120}
        />
      </div>

      {/* Background Image */}
      <div className="space-y-2">
        <Label>{t("backgroundImage")}</Label>
        <ImageUploader
          value={
            typeof data.background_image === "string"
              ? data.background_image
              : data.background_image || null
          }
          onChange={(file) => handleChange("background_image", file || "")}
          accept="image/*"
        />
      </div>
    </div>
  );
};
