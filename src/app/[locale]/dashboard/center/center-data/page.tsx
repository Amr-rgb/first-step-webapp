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
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
import { useAuthUser } from "@/store/authStore";
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
  const user = useAuthUser();
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
    saveData,
    saveError,
  } = usePortfolio();

  const searchParams = useSearchParams();
  const isDebug = searchParams.get("debug") === "true";
  const [showDebug, setShowDebug] = useState(false);

  // Show debug dialog when response arrives
  useEffect(() => {
    if (isDebug && (saveData || saveError)) {
      setShowDebug(true);
    }
  }, [saveData, saveError, isDebug]);

  const [originalData, setOriginalData] = useState<
    PortfolioFormData | undefined
  >(portfolioData);
  const [currentData, setCurrentData] = useState<PortfolioFormData | undefined>(
    portfolioData
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Check permissions and redirect if unauthorized
  useEffect(() => {
    if (user && !canViewCenterData) {
      toastError(t("permissionError"));
      router.push("/dashboard/center");
    }
  }, [canViewCenterData, user, router, t]);

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

  // Map each root key to its logical section
  const SECTION_KEYS: Record<string, string[]> = {
    hero: [
      "title_of_hero",
      "subtitle_of_hero",
      "description",
      "background_image",
    ],
    branches: ["branches"],
    philosophy: ["Philosophy_Methodology_Goal"],
    services: ["services", "service_section_title"],
    nurseryState: ["nursery_state"],
    activities: [
      "images_activities",
      "activity_section_title",
      "activity_section_subtitle",
    ],
    contact: ["contact_info"],
    teams: ["teams"],
    ads: ["ads_images"],
  };

  // Deep diff logic to detect changes and handle removals as null
  const getDeepData = (
    original: any,
    current: any,
    includeAll: boolean = false
  ): any => {
    // If references are same and we don't need all data, no change
    if (!includeAll && original === current) return undefined;

    // Handle Files
    if (current instanceof File || original instanceof File) {
      if (current === original) return includeAll ? current : undefined;
      return current === undefined ? null : current;
    }

    // Handle primitives and nulls
    if (
      typeof current !== "object" ||
      current === null ||
      typeof original !== "object" ||
      original === null
    ) {
      if (current === original) return includeAll ? current : undefined;
      return current === undefined ? null : current;
    }

    // Handle arrays
    if (Array.isArray(current) || Array.isArray(original)) {
      const resultArr: any[] = [];
      let hasArrChanges = false;
      const maxLen = Math.max(original?.length || 0, current?.length || 0);

      for (let i = 0; i < maxLen; i++) {
        const itemResult = getDeepData(original?.[i], current?.[i], includeAll);
        if (itemResult !== undefined || includeAll) {
          const val =
            itemResult === undefined && includeAll ? current?.[i] : itemResult;
          resultArr[i] = val === undefined ? null : val;
          if (itemResult !== undefined) hasArrChanges = true;
        }
      }
      return hasArrChanges || includeAll ? resultArr : undefined;
    }

    // Handle objects
    const resultObj: any = {};
    let hasObjChanges = false;
    const allKeys = new Set([
      ...Object.keys(current || {}),
      ...Object.keys(original || {}),
    ]);

    allKeys.forEach((key) => {
      const valResult = getDeepData(
        original ? original[key] : undefined,
        current ? current[key] : undefined,
        includeAll
      );
      if (valResult !== undefined || includeAll) {
        resultObj[key] =
          valResult === undefined && includeAll ? current[key] : valResult;
        if (valResult !== undefined) hasObjChanges = true;
      }
    });

    return hasObjChanges || includeAll ? resultObj : undefined;
  };

  const getDirtyData = () => {
    if (!currentData || !originalData) return {};
    return getDeepData(originalData, currentData, false) || {};
  };

  // Helper to get a full section with nulls for removals
  const getFullSectionWithNulls = (sectionKeys: string[]) => {
    if (!currentData || !originalData) return {};

    const sectionPayload: any = {};

    sectionKeys.forEach((key) => {
      const originalVal = (originalData as any)[key];
      const currentVal = (currentData as any)[key];

      if (originalVal === undefined) {
        sectionPayload[key] = currentVal;
        return;
      }

      sectionPayload[key] = getDeepData(originalVal, currentVal, true);
    });

    return sectionPayload;
  };

  const handleSavePortfolio = () => {
    if (!hasChanges || !currentData) return;

    // Get dirty root keys
    const dirtyDataRoot = getDirtyData();
    const changedRootKeys = Object.keys(dirtyDataRoot);

    // Find sections that have changes
    const dirtySections = Object.entries(SECTION_KEYS)
      .filter(([_, keys]) => keys.some((key) => changedRootKeys.includes(key)))
      .map(([sectionId]) => sectionId);

    // Build payload: Send the WHOLE section for any changed field
    let payload: any = {};

    dirtySections.forEach((sectionId) => {
      const sectionKeys = SECTION_KEYS[sectionId];
      const sectionWithNulls = getFullSectionWithNulls(sectionKeys);
      payload = { ...payload, ...sectionWithNulls };
    });

    // Also include any other dirty root keys that didn't map to a section
    changedRootKeys.forEach((key) => {
      if (!Object.values(SECTION_KEYS).flat().includes(key)) {
        const val = getDeepData(
          (originalData as any)[key],
          (currentData as any)[key],
          true
        );
        (payload as any)[key] = val;
      }
    });

    // Handle Deletions via separate arrays: delete_images_activities, delete_services, delete_teams
    const listConfig = [
      { key: "services", deleteKey: "delete_services" },
      { key: "teams", deleteKey: "delete_teams" },
      { key: "images_activities", deleteKey: "delete_images_activities" },
    ];

    listConfig.forEach(({ key, deleteKey }) => {
      const originalList = (originalData as any)[key] as any[];
      const currentList = (currentData as any)[key] as any[];

      if (!originalList) return;

      const deletedIndices: number[] = [];

      originalList.forEach((origItem, index) => {
        // Deep compare to see if origItem still exists in currentList
        // Simple string comparison is enough for image URLs
        const exists = currentList.some((currItem) =>
          typeof origItem === "string"
            ? currItem === origItem
            : JSON.stringify(currItem) === JSON.stringify(origItem)
        );

        if (!exists) {
          deletedIndices.push(index);
        }
      });

      if (deletedIndices.length > 0) {
        payload[deleteKey] = deletedIndices;
      }

      // Compact the main array in payload (remove nulls) so it's a clean list
      if (payload[key] && Array.isArray(payload[key])) {
        payload[key] = payload[key].filter(
          (item: any) => item !== null && item !== undefined
        );
      }
    });

    console.log("💾 Saving portfolio with deletion arrays:", payload);
    savePortfolio(payload);

    // Update original data after save to reset the "changed" state
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
    { id: "plans", title: t("sections.plans"), component: PlansSection },

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
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl m-b:8rem">
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

      {/* Debug UI */}
      {isDebug && (
        <Dialog open={showDebug} onOpenChange={setShowDebug}>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <DialogTitle>
                  {t("debug.title") || "Network Response Debug"}
                </DialogTitle>
                {saveError ? (
                  <Badge variant="destructive">Error</Badge>
                ) : (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    Success
                  </Badge>
                )}
              </div>
              <DialogDescription>
                {t("debug.description") ||
                  "Detailed response from the center data update API."}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="overflow-scroll flex-1 mt-4 rounded-md border bg-muted p-4">
              <pre className="text-xs font-mono overflow-auto whitespace-pre p-2">
                {JSON.stringify(saveError || saveData, null, 2)}
              </pre>
            </ScrollArea>

            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowDebug(false)} variant="outline">
                {t("common.close") || "Close"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProfileEditor;
