import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { centerService } from "@/services/dashboardApi";
import { PortfolioFormData } from "@/types";
import { toastSuccess, toastError } from "@/lib/toast";
import { useTranslations } from "next-intl";

// Transform API data to match our form structure
const transformApiData = (apiData: any): PortfolioFormData => {
  const initialData: PortfolioFormData = {
    title_of_hero: "",
    subtitle_of_hero: "",
    description: "",
    background_image: "",
    branches: [],
    Philosophy_Methodology_Goal: {
      philosophy: { content: "" },
      methodology: { content: "" },
      goals: { content: "" },
    },
    service_section_title: "",
    services: [],
    nursery_state: {
      area: "",
      class_rooms: "",
      team_members: "",
    },
    activity_section_title: "",
    activity_section_subtitle: "",
    images_activities: [],
    contact_info: {
      address: "",
      working_hours: "",
      phone_number: "",
      email_address: "",
      facebook: "",
      instagram: "",
      whatsapp: "",
    },
    ads_images: [],
    teams: [],
  };

  if (!apiData) return initialData;

  return {
    title_of_hero: apiData.hero_section?.title_of_hero || "",
    subtitle_of_hero: apiData.hero_section?.subtitle_of_hero || "",
    description: apiData.hero_section?.description || "",
    background_image: apiData.hero_section?.background_image || "",
    branches: apiData.branches || [],
    Philosophy_Methodology_Goal: {
      philosophy: {
        content: apiData.Philosophy_Methodology_Goal?.philosophy?.content || "",
      },
      methodology: {
        content:
          apiData.Philosophy_Methodology_Goal?.methodology?.content || "",
      },
      goals: {
        content: apiData.Philosophy_Methodology_Goal?.goals?.content || "",
      },
    },
    service_section_title: apiData.service_section_title || "",
    services: apiData.services || [],
    nursery_state: {
      area: apiData.nursery_state?.area || "",
      class_rooms: apiData.nursery_state?.class_rooms?.toString() || "",
      team_members: apiData.nursery_state?.team_members?.toString() || "",
    },
    activity_section_title: apiData.activity_section_title || "",
    activity_section_subtitle: apiData.activity_section_subtitle || "",
    images_activities: apiData.images_activities || [],
    contact_info: {
      address: apiData.contact_info?.address || "",
      working_hours: apiData.contact_info?.working_hours || "",
      phone_number: apiData.contact_info?.phone_number || "",
      email_address: apiData.contact_info?.email_address || "",
      facebook: apiData.contact_info?.facebook || "",
      instagram: apiData.contact_info?.instagram || "",
      whatsapp: apiData.contact_info?.whatsapp || "",
    },
    ads_images: apiData.ads_images || [],
    teams: apiData.teams || [],
  };
};

export const usePortfolio = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.profileEditor");

  // Query for portfolio data
  const portfolioQuery = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const response = await centerService.getPortfolio();
      return transformApiData(response.portofilo);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for saving portfolio
  const savePortfolioMutation = useMutation({
    mutationFn: async (data: Partial<PortfolioFormData>) => {
      return await centerService.savePortfolio(data as PortfolioFormData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      toastSuccess(t("saveSuccess"));
    },
    onError: () => {
      toastError(t("saveError"));
    },
  });

  return {
    // Query data
    data: portfolioQuery.data,
    isLoading: portfolioQuery.isLoading,
    error: portfolioQuery.error,

    // Mutation
    savePortfolio: savePortfolioMutation.mutate,
    isSaving: savePortfolioMutation.isPending,
    saveData: savePortfolioMutation.data,
    saveError: savePortfolioMutation.error,

    // Refetch
    refetch: portfolioQuery.refetch,
  };
};
