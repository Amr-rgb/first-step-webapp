"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import ProfileEditor from "@/components/dashboard/profile-editor/ProfileEditor";
import ProfilePreview from "@/components/dashboard/profile-editor/ProfilePreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Edit, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/store/authStore";
import {
  getPortfolio,
  savePortfolio,
  savePricing,
} from "@/services/dashboardApi";

export interface ProfileSection {
  id: string;
  name: string;
  type:
    | "hero"
    | "about"
    | "services"
    | "programs"
    | "team"
    | "activities"
    | "contact"
    | "philosophy"
    | "stats"
    | "branches";
  enabled: boolean;
  data: any;
}

export default function ProfileEditorPage() {
  const t = useTranslations("dashboard.profileEditor");
  const user = useAuthUser();
  const centerId = user?.id; // Assuming user.id is the center id
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);

  const [profileSections, setProfileSections] = useState<ProfileSection[]>([
    {
      id: "hero",
      name: "Hero Section",
      type: "hero",
      enabled: false,
      data: {
        title: "",
        subtitle: "",
        description: "",
        image: "",
        ctaText: "",
        ctaLink: "",
      },
    },
    {
      id: "branches",
      name: "Branches",
      type: "branches",
      enabled: false,
      data: {
        title: "Our Branches",
        branches: [],
      },
    },
    {
      id: "philosophy",
      name: "Philosophy, Methodology & Goal",
      type: "philosophy",
      enabled: false,
      data: {
        philosophyTitle: "Our Philosophy",
        philosophy: "",
        methodologyTitle: "Our Methodology",
        methodology: "",
        goalTitle: "Our Goal",
        goal: "",
      },
    },
    {
      id: "programs",
      name: "Programs (برامجنا)",
      type: "programs",
      enabled: false,
      data: {
        title: "برامجنا",
        programs: [],
      },
    },
    {
      id: "services",
      name: "Services",
      type: "services",
      enabled: false,
      data: {
        title: "Our Services",
        services: [],
      },
    },
    {
      id: "stats",
      name: "Nursery Stats",
      type: "stats",
      enabled: false,
      data: {
        area: "2000",
        classrooms: "10",
        teamMembers: "25",
      },
    },
    {
      id: "activities",
      name: "Activities",
      type: "activities",
      enabled: false,
      data: {
        title: "Activities",
        subtitle: "",
        images: [],
      },
    },
    {
      id: "team",
      name: "Our Team",
      type: "team",
      enabled: false,
      data: {
        title: "Meet Our Team",
        members: [],
      },
    },
    {
      id: "contact",
      name: "Contact Information",
      type: "contact",
      enabled: false,
      data: {
        address: "",
        phone: "",
        email: "",
        workingHours: "",
        socialMedia: {},
      },
    },
  ]);

  // Check if profile is empty (no sections enabled)
  const isProfileEmpty = profileSections.every((section) => !section.enabled);

  // Show reminder for empty profile
  useEffect(() => {
    if (isProfileEmpty) {
      setShowReminder(true);
    } else {
      setShowReminder(false);
    }
  }, [isProfileEmpty]);

  useEffect(() => {
    if (typeof centerId !== "number") {
      setProfileSections(getDefaultProfileSections());
      return;
    }
    async function fetchPortfolio() {
      try {
        const result = await getPortfolio(centerId as number);
        console.log("🔍 FETCHED PORTFOLIO DATA:", result);
        if (result.portofilo) {
          const mappedSections = mapBackendToProfileSections(result.portofilo);
          setProfileSections(mappedSections);
          // Store original data for change detection
          setOriginalData(result.portofilo);
          console.log("📋 MAPPED PROFILE SECTIONS:", mappedSections);
        } else {
          setProfileSections(getDefaultProfileSections());
          setOriginalData(null);
        }
      } catch (e) {
        console.error("❌ Error fetching portfolio:", e);
        setProfileSections(getDefaultProfileSections());
        setOriginalData(null);
      }
    }
    fetchPortfolio();
  }, [centerId]);

  const handleSectionUpdate = (sectionId: string, data: any) => {
    setProfileSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, data: { ...section.data, ...data } }
          : section
      )
    );
    setIsDirty(true);
  };

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    setProfileSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, enabled } : section
      )
    );
    setIsDirty(true);
  };

  const handleSectionDelete = (sectionId: string) => {
    setProfileSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              enabled: false,
              data: getDefaultSectionData(section.type),
            }
          : section
      )
    );
    setIsDirty(true);
  };

  const getDefaultSectionData = (type: string) => {
    const defaults: Record<string, any> = {
      hero: {
        title: "",
        subtitle: "",
        description: "",
        image: "",
        ctaText: "",
        ctaLink: "",
      },
      about: {
        title: "",
        description: "",
        images: [],
        mission: "",
        vision: "",
      },
      services: { title: "Our Services", services: [] },
      programs: { title: "Our Programs", programs: [] },
      team: { title: "Meet Our Team", members: [] },
      activities: { title: "Activities", subtitle: "", images: [] },
      philosophy: {
        philosophyTitle: "Our Philosophy",
        philosophy: "",
        methodologyTitle: "Our Methodology",
        methodology: "",
        goalTitle: "Our Goal",
        goal: "",
      },
      branches: { title: "Our Branches", branches: [] },
      stats: { area: "", classrooms: "", teamMembers: "" },
      contact: {
        address: "",
        phone: "",
        email: "",
        workingHours: "",
        socialMedia: {},
      },
    };
    return defaults[type] || {};
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (typeof centerId !== "number") throw new Error("No center id");

      // Map profile sections to backend format
      const portfolioData = mapProfileSectionsToBackend(
        profileSections,
        centerId
      );
      console.log("📤 SENDING PORTFOLIO DATA:", portfolioData);

      // Prepare data with files for API submission
      const portfolioDataWithFiles =
        preparePortfolioDataWithFiles(portfolioData);
      console.log("📁 PORTFOLIO DATA WITH FILES PREPARED");

      // Check if any sections have been updated by comparing with original data
      const hasPortfolioUpdates = (() => {
        if (!originalData) {
          // If no original data, check if any sections are enabled with data
          return profileSections.some(
            (section) =>
              section.enabled &&
              section.data &&
              Object.keys(section.data).length > 0
          );
        }

        // Compare current data with original data
        const currentData = mapProfileSectionsToBackend(
          profileSections,
          centerId
        );
        return JSON.stringify(currentData) !== JSON.stringify(originalData);
      })();

      // TODO: Add pricing data check when pricing functionality is implemented
      const hasPricingUpdates = false; // This will be updated when pricing is connected
      const pricingData = {}; // This will be populated when pricing functionality is implemented

      const requests = [];

      // Send portfolio update if there are changes
      if (hasPortfolioUpdates) {
        requests.push(
          savePortfolio(centerId, portfolioDataWithFiles)
            .then(() => console.log("✅ Portfolio updated successfully"))
            .catch((error) => {
              console.error("❌ Portfolio update failed:", error);
              console.error("🔍 FULL ERROR RESPONSE:", error.response);
              console.error(
                "🔍 VALIDATION ERRORS:",
                error.response?.data?.errors
              );
              console.error("📝 ERROR MESSAGE:", error.response?.data?.message);
              console.error("📝 ERROR DATA:", error.response?.data);
              throw new Error("Portfolio update failed");
            })
        );
      }

      // Send pricing update if there are changes
      if (hasPricingUpdates) {
        requests.push(
          savePricing(centerId, pricingData)
            .then(() => console.log("Pricing updated successfully"))
            .catch((error) => {
              console.error("Pricing update failed:", error);
              throw new Error("Pricing update failed");
            })
        );
      }

      // Wait for all requests to complete
      if (requests.length > 0) {
        await Promise.all(requests);
        // Update original data after successful save
        setOriginalData(portfolioData);
        setIsDirty(false);
        toast.success(t("saveSuccess"));
      } else {
        toast.info("No changes to save");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(t("saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  // Mapping functions (implement as needed)
  function getDefaultProfileSections(): ProfileSection[] {
    return [
      {
        id: "hero",
        name: "Hero Section",
        type: "hero",
        enabled: false,
        data: {
          title: "",
          subtitle: "",
          description: "",
          image: "",
          ctaText: "",
          ctaLink: "",
        },
      },
      {
        id: "branches",
        name: "Branches",
        type: "branches",
        enabled: false,
        data: {
          title: "Our Branches",
          branches: [],
        },
      },
      {
        id: "philosophy",
        name: "Philosophy, Methodology & Goal",
        type: "philosophy",
        enabled: false,
        data: {
          philosophyTitle: "Our Philosophy",
          philosophy: "",
          methodologyTitle: "Our Methodology",
          methodology: "",
          goalTitle: "Our Goal",
          goal: "",
        },
      },
      {
        id: "programs",
        name: "Programs (برامجنا)",
        type: "programs",
        enabled: false,
        data: {
          title: "برامجنا",
          programs: [],
        },
      },
      {
        id: "services",
        name: "Services",
        type: "services",
        enabled: false,
        data: {
          title: "Our Services",
          services: [],
        },
      },
      {
        id: "stats",
        name: "Nursery Stats",
        type: "stats",
        enabled: false,
        data: {
          area: "2000",
          classrooms: "10",
          teamMembers: "25",
        },
      },
      {
        id: "activities",
        name: "Activities",
        type: "activities",
        enabled: false,
        data: {
          title: "Activities",
          subtitle: "",
          images: [],
        },
      },
      {
        id: "team",
        name: "Our Team",
        type: "team",
        enabled: false,
        data: {
          title: "Meet Our Team",
          members: [],
        },
      },
      {
        id: "contact",
        name: "Contact Information",
        type: "contact",
        enabled: false,
        data: {
          address: "",
          phone: "",
          email: "",
          workingHours: "",
          socialMedia: {},
        },
      },
    ];
  }

  function mapBackendToProfileSections(portofilo: any): ProfileSection[] {
    // Always return all sections, using backend data if present, or defaults if not
    return [
      {
        id: "hero",
        name: "Hero Section",
        type: "hero",
        enabled: !!portofilo?.hero_section,
        data: {
          title: portofilo?.hero_section?.title_of_hero || "",
          subtitle: portofilo?.hero_section?.subtitle_of_hero || "",
          description: portofilo?.hero_section?.description || "",
          image: portofilo?.hero_section?.background_image || "",
          ctaText: "",
          ctaLink: "",
        },
      },
      {
        id: "branches",
        name: "Branches",
        type: "branches",
        enabled:
          Array.isArray(portofilo?.branches) && portofilo.branches.length > 0,
        data: {
          title: "Our Branches",
          branches: portofilo?.branches || [],
        },
      },
      {
        id: "philosophy",
        name: "Philosophy, Methodology & Goal",
        type: "philosophy",
        enabled: !!portofilo?.Philosophy_Methodology_Goal,
        data: {
          philosophyTitle:
            portofilo?.Philosophy_Methodology_Goal?.philosophy?.title ||
            "Our Philosophy",
          philosophy:
            portofilo?.Philosophy_Methodology_Goal?.philosophy?.content || "",
          methodologyTitle:
            portofilo?.Philosophy_Methodology_Goal?.methodology?.title ||
            "Our Methodology",
          methodology:
            portofilo?.Philosophy_Methodology_Goal?.methodology?.content || "",
          goalTitle:
            portofilo?.Philosophy_Methodology_Goal?.goals?.title || "Our Goal",
          goal: portofilo?.Philosophy_Methodology_Goal?.goals?.content || "",
        },
      },
      {
        id: "services",
        name: "Services",
        type: "services",
        enabled:
          Array.isArray(portofilo?.services) && portofilo.services.length > 0,
        data: {
          title: portofilo?.service_section_title || "Our Services",
          services: portofilo?.services || [],
        },
      },
      {
        id: "stats",
        name: "Nursery Stats",
        type: "stats",
        enabled: !!portofilo?.nursery_state,
        data: {
          area: portofilo?.nursery_state?.area || "",
          classrooms: portofilo?.nursery_state?.class_rooms || "",
          teamMembers: portofilo?.nursery_state?.team_members || "",
        },
      },
      {
        id: "activities",
        name: "Activities",
        type: "activities",
        enabled:
          Array.isArray(portofilo?.images_activities) &&
          portofilo.images_activities.length > 0,
        data: {
          title: portofilo?.activity_section_title || "Activities",
          subtitle: portofilo?.activity_section_subtitle || "",
          images: portofilo?.images_activities || [],
        },
      },
      {
        id: "team",
        name: "Our Team",
        type: "team",
        enabled: Array.isArray(portofilo?.teams) && portofilo.teams.length > 0,
        data: {
          title: "Meet Our Team",
          members: portofilo?.teams || [],
        },
      },
      {
        id: "contact",
        name: "Contact Information",
        type: "contact",
        enabled: !!portofilo?.contact_info,
        data: {
          address: portofilo?.contact_info?.address || "",
          phone: portofilo?.contact_info?.phone_number || "",
          email: portofilo?.contact_info?.email_address || "",
          workingHours: portofilo?.contact_info?.working_hours || "",
          socialMedia: {
            facebook: portofilo?.contact_info?.facebook || "",
            instagram: portofilo?.contact_info?.instagram || "",
            whatsapp: portofilo?.contact_info?.whatsapp || "",
          },
        },
      },
    ];
  }
  function mapProfileSectionsToBackend(sections: any[], centerId: number) {
    // Helper to get section by type
    const get = (type: any) => sections.find((s) => s.type === type);

    console.log("🔄 MAPPING SECTIONS TO BACKEND:", sections);

    const result = {
      hero_section: {
        title_of_hero: get("hero")?.data.title || "",
        subtitle_of_hero: get("hero")?.data.subtitle || "",
        description: get("hero")?.data.description || "",
        background_image: get("hero")?.data.image instanceof File ? get("hero")?.data.image : null,
      },
      branches: get("branches")?.data.branches || [],
      Philosophy_Methodology_Goal: {
        philosophy: {
          title: get("philosophy")?.data.philosophyTitle || "",
          content: get("philosophy")?.data.philosophy || "",
        },
        methodology: {
          title: get("philosophy")?.data.methodologyTitle || "",
          content: get("philosophy")?.data.methodology || "",
        },
        goals: {
          title: get("philosophy")?.data.goalTitle || "",
          content: get("philosophy")?.data.goal || "",
        },
      },
      service_section_title: get("services")?.data.title || "",
      services: get("services")?.data.services?.map((service: any) => ({
        title: service.title || "",
        description: service.description || "",
        image_service: service.image instanceof File ? service.image : null,
      })) || [],
      nursery_state: {
        area: get("stats")?.data.area || "",
        class_rooms: get("stats")?.data.classrooms || "",
        team_members: get("stats")?.data.teamMembers || "",
      },
      activity_section_title: get("activities")?.data.title || "",
      activity_section_subtitle: get("activities")?.data.subtitle || "",
      images_activities: get("activities")?.data.images?.filter((image: any) => image instanceof File) || [],
      ads_images: [], // Will be populated when ads functionality is added
      teams: get("team")?.data.members?.map((member: any) => ({
        name: member.name || "",
        mission: member.role || "",
        image: member.image instanceof File ? member.image : null,
      })) || [],
      contact_info: {
        address: get("contact")?.data.address || "",
        working_hours: get("contact")?.data.workingHours || "",
        phone_number: get("contact")?.data.phone || "",
        email_address: get("contact")?.data.email || "",
        facebook: get("contact")?.data.socialMedia?.facebook || "",
        instagram: get("contact")?.data.socialMedia?.instagram || "",
        whatsapp: get("contact")?.data.socialMedia?.whatsapp || "",
        twitter: get("contact")?.data.socialMedia?.twitter || "",
      },
      center_id: centerId,
    };

    console.log("🔄 MAPPED RESULT:", result);
    return result;
  }

    // Function to prepare portfolio data with files for API submission
  function preparePortfolioDataWithFiles(data: any) {
    const formData = new FormData();
 
    // Add center_id
    formData.append("center_id", data.center_id.toString());
 
    // Hero section
    if (data.hero_section) {
      formData.append("hero_section[title_of_hero]", data.hero_section.title_of_hero || "");
      formData.append("hero_section[subtitle_of_hero]", data.hero_section.subtitle_of_hero || "");
      formData.append("hero_section[description]", data.hero_section.description || "");
      
      // Add background image file if it exists
      if (data.hero_section.background_image instanceof File) {
        formData.append("hero_section[background_image]", data.hero_section.background_image);
      }
    }
 
    // Branches
    if (data.branches && Array.isArray(data.branches)) {
      data.branches.forEach((branch: any, index: number) => {
        formData.append(`branches[${index}][branch_name]`, branch.branch_name || "");
      });
    }
 
    // Philosophy, Methodology, Goals
    if (data.Philosophy_Methodology_Goal) {
      const pmg = data.Philosophy_Methodology_Goal;
      if (pmg.philosophy) {
        formData.append("Philosophy_Methodology_Goal[philosophy][title]", pmg.philosophy.title || "");
        formData.append("Philosophy_Methodology_Goal[philosophy][content]", pmg.philosophy.content || "");
      }
      if (pmg.methodology) {
        formData.append("Philosophy_Methodology_Goal[methodology][title]", pmg.methodology.title || "");
        formData.append("Philosophy_Methodology_Goal[methodology][content]", pmg.methodology.content || "");
      }
      if (pmg.goals) {
        formData.append("Philosophy_Methodology_Goal[goals][title]", pmg.goals.title || "");
        formData.append("Philosophy_Methodology_Goal[goals][content]", pmg.goals.content || "");
      }
    }
 
    // Services
    formData.append("service_section_title", data.service_section_title || "");
    if (data.services && Array.isArray(data.services)) {
      data.services.forEach((service: any, index: number) => {
        formData.append(`services[${index}][title]`, service.title || "");
        formData.append(`services[${index}][description]`, service.description || "");
        
        // Add service image file if it exists
        if (service.image_service instanceof File) {
          formData.append(`services[${index}][image_service]`, service.image_service);
        }
      });
    }
 
    // Nursery state
    if (data.nursery_state) {
      formData.append("nursery_state[area]", data.nursery_state.area || "");
      formData.append("nursery_state[class_rooms]", data.nursery_state.class_rooms || "");
      formData.append("nursery_state[team_members]", data.nursery_state.team_members || "");
    }
 
    // Activity section
    formData.append("activity_section_title", data.activity_section_title || "");
    formData.append("activity_section_subtitle", data.activity_section_subtitle || "");
 
    // Add activity image files only (no URLs)
    if (data.images_activities && Array.isArray(data.images_activities)) {
      data.images_activities.forEach((image: any, index: number) => {
        if (image instanceof File) {
          formData.append(`images_activities[${index}]`, image);
        }
      });
    }
 
    // Add ads image files only (no URLs)
    if (data.ads_images && Array.isArray(data.ads_images)) {
      data.ads_images.forEach((image: any, index: number) => {
        if (image instanceof File) {
          formData.append(`ads_images[${index}]`, image);
        }
      });
    }
 
    // Teams
    if (data.teams && Array.isArray(data.teams)) {
      data.teams.forEach((team: any, index: number) => {
        formData.append(`teams[${index}][name]`, team.name || "");
        formData.append(`teams[${index}][mission]`, team.mission || "");
        
        // Add team image file if it exists
        if (team.image instanceof File) {
          formData.append(`teams[${index}][image]`, team.image);
        }
      });
    }
 
    // Contact info
    if (data.contact_info) {
      formData.append("contact_info[address]", data.contact_info.address || "");
      formData.append("contact_info[working_hours]", data.contact_info.working_hours || "");
      formData.append("contact_info[phone_number]", data.contact_info.phone_number || "");
      formData.append("contact_info[email_address]", data.contact_info.email_address || "");
      formData.append("contact_info[facebook]", data.contact_info.facebook || "");
      formData.append("contact_info[instagram]", data.contact_info.instagram || "");
      formData.append("contact_info[whatsapp]", data.contact_info.whatsapp || "");
      formData.append("contact_info[twitter]", data.contact_info.twitter || "");
    }
 
    console.log("📁 PREPARED FORMDATA WITH FILES");
    console.log("📋 FORMDATA CONTENTS:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
 
    return formData;
  }

  const enabledSections = profileSections.filter((section) => section.enabled);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            <p className="text-gray-600 mt-1">{t("subtitle")}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={!isPreviewMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsPreviewMode(false)}
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-md transition-all",
                  !isPreviewMode
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Edit className="w-4 h-4 mr-1" />
                {t("editMode")}
              </Button>
              <Button
                variant={isPreviewMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsPreviewMode(true)}
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-md transition-all",
                  isPreviewMode
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Eye className="w-4 h-4 mr-1" />
                {t("previewMode")}
              </Button>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="px-4 py-2"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? t("saving") : t("save")}
            </Button>
          </div>
        </div>
      </div>

      {/* Reminder Card for Empty Profile */}
      {showReminder && !isPreviewMode && (
        <div className="px-6 py-4">
          <Card className="border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800">
                  {t("reminder.title")}
                </h3>
                <p className="text-amber-700 text-sm mt-1">
                  {t("reminder.description")}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="relative flex-1">
        {isPreviewMode ? (
          <ProfilePreview sections={profileSections} isEmpty={isProfileEmpty} />
        ) : (
          <ProfileEditor
            sections={profileSections}
            onSectionUpdate={handleSectionUpdate}
            onSectionToggle={handleSectionToggle}
            onSectionDelete={handleSectionDelete}
          />
        )}
      </div>
    </div>
  );
}
