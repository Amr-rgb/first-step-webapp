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
import { getPortfolio, savePortfolio } from "@/services/dashboardApi";

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
        if (result.portofilo) {
          setProfileSections(mapBackendToProfileSections(result.portofilo));
        } else {
          setProfileSections(getDefaultProfileSections());
        }
      } catch (e) {
        setProfileSections(getDefaultProfileSections());
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
      await savePortfolio(
        centerId,
        mapProfileSectionsToBackend(profileSections, centerId)
      );
      setIsDirty(false);
      toast.success(t("saveSuccess"));
    } catch (error) {
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
  function mapProfileSectionsToBackend(sections, centerId) {
    // Helper to get section by type
    const get = (type) => sections.find((s) => s.type === type);

    return {
      hero_section: {
        title_of_hero: get("hero")?.data.title || "",
        subtitle_of_hero: get("hero")?.data.subtitle || "",
        description: get("hero")?.data.description || "",
        background_image: get("hero")?.data.image || "",
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
      services: get("services")?.data.services || [],
      nursery_state: {
        area: get("stats")?.data.area || "",
        class_rooms: get("stats")?.data.classrooms || "",
        team_members: get("stats")?.data.teamMembers || "",
      },
      activity_section_title: get("activities")?.data.title || "",
      activity_section_subtitle: get("activities")?.data.subtitle || "",
      images_activities: get("activities")?.data.images || [],
      ads_images: [], // Add logic if you have ads images in your UI
      teams: get("team")?.data.members || [],
      contact_info: {
        address: get("contact")?.data.address || "",
        working_hours: get("contact")?.data.workingHours || "",
        phone_number: get("contact")?.data.phone || "",
        email_address: get("contact")?.data.email || "",
        facebook: get("contact")?.data.socialMedia?.facebook || "",
        instagram: get("contact")?.data.socialMedia?.instagram || "",
        whatsapp: get("contact")?.data.socialMedia?.whatsapp || "",
      },
      center_id: centerId,
    };
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
      <div className="flex-1">
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
