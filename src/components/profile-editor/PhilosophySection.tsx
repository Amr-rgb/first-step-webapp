"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { PortfolioFormData } from "@/types";
import { useTranslations } from "next-intl";

interface PhilosophySectionProps {
  data: PortfolioFormData;
  onChange: (data: PortfolioFormData) => void;
}

export const PhilosophySection = ({
  data,
  onChange,
}: PhilosophySectionProps) => {
  const t = useTranslations("dashboard.profileEditor.philosophy");

  const handleChange = (
    field: keyof PortfolioFormData["Philosophy_Methodology_Goal"],
    value: string
  ) => {
    onChange({
      ...data,
      Philosophy_Methodology_Goal: {
        ...data.Philosophy_Methodology_Goal,
        [field]: { content: value },
      },
    });
  };

  const sections: {
    key: keyof PortfolioFormData["Philosophy_Methodology_Goal"];
    title: string;
    label: string;
    placeholder: string;
  }[] = [
    {
      key: "philosophy",
      title: t("philosophy"),
      label: t("philosophyContent"),
      placeholder: t("philosophyContentPlaceholder"),
    },
    {
      key: "methodology",
      title: t("methodology"),
      label: t("methodologyContent"),
      placeholder: t("methodologyContentPlaceholder"),
    },
    {
      key: "goals",
      title: t("goals"),
      label: t("goalContent"),
      placeholder: t("goalContentPlaceholder"),
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map(({ key, title, label, placeholder }) => (
        <div key={key} className="space-y-3">
          {/* <h3 className="text-lg font-semibold">{title}</h3> */}
          <div className="flex justify-between items-center">
            <Label htmlFor={key} className="mb-1 block">
              {label}
            </Label>
            <span className="text-xs text-muted-foreground">
              {data.Philosophy_Methodology_Goal[key].content.length}/120
            </span>
          </div>
          <Textarea
            id={key}
            value={data.Philosophy_Methodology_Goal[key].content}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={placeholder}
            rows={4}
            maxLength={120}
          />
        </div>
      ))}
    </div>
  );
};
