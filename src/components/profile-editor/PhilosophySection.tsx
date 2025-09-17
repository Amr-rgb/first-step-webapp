"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const t = useTranslations("profileEditor.philosophy");

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
        <Card key={key}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor={key} className="mb-1 block">
              {label}
            </Label>
            <Textarea
              id={key}
              value={data.Philosophy_Methodology_Goal[key].content}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              rows={4}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
