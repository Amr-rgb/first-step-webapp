"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { centerService } from "@/services/dashboardApi";
import { PortfolioFormData } from "@/types";
import { toastSuccess, toastError } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { useAuthUser } from "@/store/authStore";

// Section Components
import { BasicInfoSection } from "./_components/BasicInfoSection";
import { PlansSection } from "./_components/PlansSection";
import { FacilitiesSection } from "./_components/FacilitiesSection";
import { ActivitiesSection } from "./_components/ActivitiesSection";
import { LicensesSection } from "./_components/LicensesSection";
import { SocialMediaSection } from "./_components/SocialMediaSection";

export default function CenterProfilePage() {
  usePageMetadata();
  const t = useTranslations("dashboard.profileEditor");
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthUser();
  const [activeSection, setActiveSection] = useState<string>("basicInfo");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const [formData, setFormData] = useState<PortfolioFormData>({
    title_of_hero: "",
    subtitle_of_hero: "",
    description: "",
    images_activities: [],
    admin_option_ids: [],
    delete_center_options: [],
    licenses: [],
    delete_license_ids: [],
    contact_info: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      website: "",
    },
  });

  const [logoUrl, setLogoUrl] = useState<string>("");

  // Fetch initial data
  const { data: initialData, isLoading } = useQuery({
    queryKey: ["centerPortfolio"],
    queryFn: () => centerService.getPortfolio(),
  });

  useEffect(() => {
    const p = initialData?.portofilo || initialData?.data;
    if (p) {
      setFormData({
        title_of_hero: p.hero_section?.title_of_hero || p.title_of_hero || "",
        subtitle_of_hero:
          p.hero_section?.subtitle_of_hero || p.subtitle_of_hero || "",
        description: p.hero_section?.description || p.description || "",
        contact_info: {
          facebook: p.contact_info?.facebook || p.facebook || "",
          instagram: p.contact_info?.instagram || p.instagram || "",
          twitter: p.contact_info?.twitter || p.twitter || "",
          linkedin:
            p.contact_info?.linkedin ||
            p.contact_info?.linkedIn ||
            p.linkedin ||
            "",
          website: p.contact_info?.website || p.website || "",
        },
        images_activities: p.images_activities || [],
        admin_option_ids:
          (p.admin_options || p.options)?.map((o: any) => o.id) || [],
        licenses: p.licenses || [],
      });
      // The logo might be in the parent object, inside portfolio, or the user object
      setLogoUrl(p.logo || initialData?.logo || user?.logo || "");
    }
  }, [initialData, user?.logo]);

  const updateFormData = (newData: Partial<PortfolioFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));

    // Clear errors for updated fields
    if (Object.keys(validationErrors).length > 0) {
      const updatedFields = Object.keys(newData);
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        updatedFields.forEach((field) => {
          delete newErrors[field];
        });
        return newErrors;
      });
    }
  };

  const saveMutation = useMutation({
    mutationFn: (data: PortfolioFormData) => centerService.savePortfolio(data),
    onSuccess: () => {
      setValidationErrors({});
      queryClient.invalidateQueries({ queryKey: ["centerPortfolio"] });
      toastSuccess(t("title"), t("saveSuccess"));
      router.refresh();
    },
    onError: (error: any) => {
      if (error.errors && typeof error.errors === "object") {
        setValidationErrors(error.errors);
        toastError(t("title"), error.message || t("saveError"));
      } else {
        toastError(t("title"), error.message || t("saveError"));
      }
    },
  });

  const logoMutation = useMutation({
    mutationFn: (file: File) => centerService.updateLogo(file),
    onSuccess: (response) => {
      toastSuccess(t("title"), t("saveSuccess"));
      if (response.data?.logo) {
        setLogoUrl(response.data.logo);
      }
    },
    onError: (error: any) => {
      toastError(t("title"), error.message || t("saveError"));
    },
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleCancel = () => {
    router.back();
  };

  const sections = [
    {
      id: "basicInfo",
      title: t("sections.basicInfo"),
    },
    {
      id: "plans",
      title: t("sections.plans"),
    },
    {
      id: "facilities",
      title: t("sections.facilities"),
    },
    {
      id: "activities",
      title: t("sections.activities"),
    },
    {
      id: "licenses",
      title: t("sections.licenses"),
    },
    {
      id: "socialMedia",
      title: t("sections.socialMedia"),
    },
  ];

  const renderSection = (id: string) => {
    switch (id) {
      case "basicInfo":
        return (
          <BasicInfoSection
            data={formData}
            onChange={updateFormData}
            errors={validationErrors}
            logoUrl={logoUrl}
            onLogoChange={(file: File) => logoMutation.mutate(file)}
          />
        );
      case "plans":
        return <PlansSection />;
      case "facilities":
        return (
          <FacilitiesSection
            data={formData}
            onChange={updateFormData}
            errors={validationErrors}
          />
        );
      case "activities":
        return (
          <ActivitiesSection
            data={formData}
            onChange={updateFormData}
            errors={validationErrors}
          />
        );
      case "licenses":
        return (
          <LicensesSection
            data={formData}
            onChange={updateFormData}
            errors={validationErrors}
          />
        );
      case "socialMedia":
        return (
          <SocialMediaSection
            data={formData}
            onChange={updateFormData}
            errors={validationErrors}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pb-6 flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-bold text-primary">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-6">
          <Accordion
            type="single"
            collapsible
            value={activeSection}
            onValueChange={setActiveSection}
            className="space-y-4"
          >
            {sections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border rounded-2xl bg-white overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="px-4 lg:px-6 py-3 lg:py-4 hover:no-underline hover:bg-gray-50 transition-colors data-[state=open]:border-b">
                  <span className="text-lg sm:text-xl font-bold text-primary">
                    {section.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="p-4 lg:p-8">
                  {renderSection(section.id)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              size="lg"
              className="w-full flex-1"
              onClick={handleSave}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? t("saving") : t("savePortfolio")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full flex-1"
              onClick={handleCancel}
            >
              {t("cancel")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
