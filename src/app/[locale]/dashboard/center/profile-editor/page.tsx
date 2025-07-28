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

export interface ProfileSection {
  id: string;
  name: string;
  type: 'hero' | 'about' | 'services' | 'programs' | 'team' | 'activities' | 'contact' | 'philosophy' | 'stats';
  enabled: boolean;
  data: any;
}

export default function ProfileEditorPage() {
  const t = useTranslations("dashboard.profileEditor");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  const [profileSections, setProfileSections] = useState<ProfileSection[]>([
    {
      id: 'hero',
      name: 'Hero Section',
      type: 'hero',
      enabled: false,
      data: {
        title: '',
        subtitle: '',
        description: '',
        image: '',
        ctaText: '',
        ctaLink: ''
      }
    },
    {
      id: 'about',
      name: 'About Us',
      type: 'about',
      enabled: false,
      data: {
        title: '',
        description: '',
        images: [],
        mission: '',
        vision: ''
      }
    },
    {
      id: 'services',
      name: 'Services',
      type: 'services',
      enabled: false,
      data: {
        title: 'Our Services',
        services: []
      }
    },
    {
      id: 'programs',
      name: 'Programs',
      type: 'programs',
      enabled: false,
      data: {
        title: 'Our Programs',
        programs: []
      }
    },
    {
      id: 'team',
      name: 'Our Team',
      type: 'team',
      enabled: false,
      data: {
        title: 'Meet Our Team',
        members: []
      }
    },
    {
      id: 'activities',
      name: 'Activities',
      type: 'activities',
      enabled: false,
      data: {
        title: 'Activities',
        subtitle: '',
        images: []
      }
    },
    {
      id: 'contact',
      name: 'Contact Information',
      type: 'contact',
      enabled: false,
      data: {
        address: '',
        phone: '',
        email: '',
        workingHours: '',
        socialMedia: {}
      }
    }
  ]);

  // Check if profile is empty (no sections enabled)
  const isProfileEmpty = profileSections.every(section => !section.enabled);

  // Show reminder for empty profile
  useEffect(() => {
    if (isProfileEmpty) {
      setShowReminder(true);
    } else {
      setShowReminder(false);
    }
  }, [isProfileEmpty]);

  const handleSectionUpdate = (sectionId: string, data: any) => {
    setProfileSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, data: { ...section.data, ...data } }
          : section
      )
    );
    setIsDirty(true);
  };

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    setProfileSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, enabled }
          : section
      )
    );
    setIsDirty(true);
  };

  const handleSectionDelete = (sectionId: string) => {
    setProfileSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, enabled: false, data: getDefaultSectionData(section.type) }
          : section
      )
    );
    setIsDirty(true);
  };

  const getDefaultSectionData = (type: string) => {
    const defaults: Record<string, any> = {
      hero: { title: '', subtitle: '', description: '', image: '', ctaText: '', ctaLink: '' },
      about: { title: '', description: '', images: [], mission: '', vision: '' },
      services: { title: 'Our Services', services: [] },
      programs: { title: 'Our Programs', programs: [] },
      team: { title: 'Meet Our Team', members: [] },
      activities: { title: 'Activities', subtitle: '', images: [] },
      contact: { address: '', phone: '', email: '', workingHours: '', socialMedia: {} }
    };
    return defaults[type] || {};
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would make the actual API call to save the profile
      // await api.post('/center/profile', { sections: profileSections });
      
      setIsDirty(false);
      toast.success(t("saveSuccess"));
    } catch (error) {
      toast.error(t("saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const enabledSections = profileSections.filter(section => section.enabled);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("title")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("subtitle")}
            </p>
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
          <ProfilePreview 
            sections={enabledSections}
            isEmpty={isProfileEmpty}
          />
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
