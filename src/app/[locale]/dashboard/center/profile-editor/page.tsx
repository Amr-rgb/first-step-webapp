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
import { PortfolioFormData } from "@/types";
import { usePortfolio } from "@/hooks/usePortfolio";

const ProfileEditor = () => {
  const t = useTranslations("profileEditor");
  const [activeSection, setActiveSection] = useState<string>("hero");

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
    { id: "ads", title: t("sections.ads"), component: AdsSection },
    { id: "teams", title: t("sections.teams"), component: TeamsSection },
    { id: "plans", title: t("sections.plans"), component: PlansSection },
  ];

  if (isLoadingData || loadError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl">{t("title")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-center py-16 sm:py-20">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {loadError ? t("loadError") : t("loading")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
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
                    <Component data={currentData} onChange={handleDataChange} />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEditor;
