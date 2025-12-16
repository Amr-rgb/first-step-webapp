"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { HeroSection } from "@/components/profile-editor/HeroSection";
import { BranchesSection } from "@/components/profile-editor/BranchesSection";
import { PhilosophySection } from "@/components/profile-editor/PhilosophySection";
import { ServicesSection } from "@/components/profile-editor/ServicesSection";
import { NurseryStateSection } from "@/components/profile-editor/NurseryStateSection";
import { ActivitiesSection } from "@/components/profile-editor/ActivitiesSection";
import { ContactSection } from "@/components/profile-editor/ContactSection";
import { AdsSection } from "@/components/profile-editor/AdsSection";
import { TeamsSection } from "@/components/profile-editor/TeamsSection";
import { PlansSection } from "@/components/profile-editor/PlansSection";
import { ProfilePreview } from "@/components/profile-editor/ProfilePreview";
import { PortfolioData, PortfolioFormData } from "@/types";
import { usePortfolio } from "@/hooks/usePortfolio";
import { usePermissions } from "@/hooks/usePermissions";
import { Edit, Eye } from "lucide-react";
import { toastError } from "@/lib/toast";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileEditor = () => {
  usePageMetadata();

  const t = useTranslations("dashboard.profileEditor");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const { can } = usePermissions();
  const canViewCenterData = can("view", "center-data");
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  // Use custom portfolio hook
  const {
    data: portfolioData,
    isLoading: isLoadingData,
    error: loadError,
    savePortfolio,
    isSaving,
  } = usePortfolio();

  const [originalData, setOriginalData] = useState<
    PortfolioFormData | undefined
  >(portfolioData);
  const [currentData, setCurrentData] = useState<PortfolioFormData | undefined>(
    portfolioData
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Check permissions and redirect if unauthorized
  useEffect(() => {
    if (!canViewCenterData) {
      toastError(t("permissionError"));
      router.push("/dashboard/center");
    }
  }, [canViewCenterData, router, t]);

  // Update local state when query data changes
  useEffect(() => {
    if (!isLoadingData && portfolioData) {
      setOriginalData(portfolioData);
      setCurrentData(portfolioData);
      setHasChanges(false);
    }
  }, [portfolioData, isLoadingData]);

  // Check if data has changed
  const checkForChanges = (newData: PortfolioFormData) => {
    if (!originalData) return;
    const hasChanged = JSON.stringify(newData) !== JSON.stringify(originalData);
    setHasChanges(hasChanged);
  };

  // Handle data changes
  const handleDataChange = (newData: PortfolioFormData) => {
    setCurrentData(newData);
    checkForChanges(newData);
  };

  // Get only the changed fields
  const getDirtyData = () => {
    if (!currentData || !originalData) return {};

    const dirtyData: Partial<PortfolioFormData> = {};

    Object.keys(currentData).forEach((key) => {
      const typedKey = key as keyof PortfolioFormData;
      if (
        JSON.stringify(currentData[typedKey]) !==
        JSON.stringify(originalData[typedKey])
      ) {
        (dirtyData as any)[typedKey] = currentData[typedKey];
      }
    });

    return dirtyData;
  };

  const handleSavePortfolio = () => {
    if (!hasChanges || !currentData) return;
    const dirtyData = getDirtyData();
    savePortfolio(dirtyData);
    // Update original data after save
    setOriginalData(currentData);
    setHasChanges(false);
  };

  const sections = [
    { id: "hero", title: t("sections.hero"), component: HeroSection },
    {
      id: "branches",
      title: t("sections.branches"),
      component: BranchesSection,
    },
    {
      id: "philosophy",
      title: t("sections.philosophy"),
      component: PhilosophySection,
    },
    {
      id: "services",
      title: t("sections.services"),
      component: ServicesSection,
    },
    {
      id: "nurseryState",
      title: t("sections.nurseryState"),
      component: NurseryStateSection,
    },
    {
      id: "activities",
      title: t("sections.activities"),
      component: ActivitiesSection,
    },
    { id: "contact", title: t("sections.contact"), component: ContactSection },
    // { id: "ads", title: t("sections.ads"), component: AdsSection },
    { id: "teams", title: t("sections.teams"), component: TeamsSection },
    { id: "plans", title: t("sections.plans"), component: PlansSection },
  ];

  if (!canViewCenterData) {
    return null;
  }

  if (isLoadingData || loadError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="pb-4">
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Card className="max-w-4xl mx-auto shadow-none border-0">
        <CardHeader className="p-0 pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
              {t("title")}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "edit" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("edit")}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {t("modes.edit")}
              </Button>
              <Button
                variant={viewMode === "preview" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("preview")}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {t("modes.preview")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 space-y-6">
          {viewMode === "edit" ? (
            <>
              <Accordion
                type="single"
                collapsible
                value={activeSection}
                onValueChange={setActiveSection}
                className="space-y-2"
              >
                {sections.map((section) => {
                  const Component = section.component;
                  return (
                    <AccordionItem
                      key={section.id}
                      value={section.id}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 sm:px-6 py-4 text-base sm:text-lg font-semibold hover:bg-muted/50 [&[data-state=open]]:border-b border-border">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 sm:px-6 py-4 sm:py-6 bg-muted/20">
                        <Component
                          data={currentData!}
                          onChange={handleDataChange}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>

              {/* Save Button - Sticky on mobile for better UX */}
              <div className="sticky bottom-4 sm:static pt-6 border-t bg-background sm:bg-transparent">
                <div className="flex justify-end">
                  <Button
                    onClick={handleSavePortfolio}
                    disabled={isSaving || !hasChanges}
                    size="lg"
                    className="w-full sm:w-auto shadow-lg sm:shadow-md"
                  >
                    {isSaving ? t("saving") : t("savePortfolio")}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {currentData && (
                <ProfilePreview
                  data={currentData as PortfolioData}
                  locale={locale}
                  nurseryName="Preview Nursery"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEditor;
