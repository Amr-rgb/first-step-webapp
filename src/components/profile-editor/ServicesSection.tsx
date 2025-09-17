"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Plus, Trash2 } from "lucide-react";
import { PortfolioFormData } from "@/types";
import { useTranslations } from "next-intl";

interface ServicesSectionProps {
  data: PortfolioFormData;
  onChange: (data: PortfolioFormData) => void;
}

export const ServicesSection = ({ data, onChange }: ServicesSectionProps) => {
  const t = useTranslations("profileEditor.services");

  const handleSectionTitleChange = (value: string) => {
    onChange({
      ...data,
      service_section_title: value,
    });
  };

  const addService = () => {
    onChange({
      ...data,
      services: [
        ...data.services,
        { title: "", description: "", image_service: "" },
      ],
    });
  };

  const updateService = (
    index: number,
    field: string,
    value: string | File
  ) => {
    const updatedServices = [...data.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };

    onChange({
      ...data,
      services: updatedServices,
    });
  };

  const removeService = (index: number) => {
    onChange({
      ...data,
      services: data.services.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="service_section_title">{t("sectionTitle")}</Label>
        <Input
          id="service_section_title"
          value={data.service_section_title}
          onChange={(e) => handleSectionTitleChange(e.target.value)}
          placeholder={t("sectionTitlePlaceholder")}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{t("services")}</CardTitle>
            <Button onClick={addService} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {t("addService")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.services.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              {t("noServices")}
            </p>
          ) : (
            data.services.map((service, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">
                      {t("service")} {index + 1}
                    </h4>
                    <Button
                      onClick={() => removeService(index)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>{t("serviceTitle")}</Label>
                    <Input
                      value={service.title}
                      onChange={(e) =>
                        updateService(index, "title", e.target.value)
                      }
                      placeholder={t("serviceTitlePlaceholder")}
                    />
                  </div>

                  <div>
                    <Label>{t("serviceDescription")}</Label>
                    <Textarea
                      value={service.description}
                      onChange={(e) =>
                        updateService(index, "description", e.target.value)
                      }
                      placeholder={t("serviceDescriptionPlaceholder")}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>{t("serviceImage")}</Label>
                    <ImageUploader
                      value={
                        typeof service.image_service === "string"
                          ? service.image_service
                          : service.image_service || null
                      }
                      onChange={(file) =>
                        updateService(index, "image_service", file || "")
                      }
                      accept="image/*"
                    />
                  </div>
                </div>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
