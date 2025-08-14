import { useQuery } from "@tanstack/react-query";
import { websiteService } from "@/services/api";
import { useTranslations } from "next-intl";
import { ta } from "date-fns/locale";

export interface Plan {
  id: number;
  name: string;
  price: string;
  period: string;
  planId: number;
  features: string[];
  buttonText: string;
  popular?: boolean;
  duration_months: number;
}

export const usePlans = () => {
  const t = useTranslations("HomePage.Subscription");

  const { data, isLoading, error } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const data = await websiteService.getPlans();

      // Sort plans by duration_months in ascending order
      const sortedPlans = [...data].sort(
        (a, b) => a.duration_months - b.duration_months
      );

      // Map the API response to our Plan interface
      return sortedPlans.map((plan) => {
        // Determine the plan type based on duration
        let planType = "quarterly";
        if (plan.duration_months === 6) planType = "semiAnnual";
        if (plan.duration_months === 12) planType = "annual";

        // Format price with thousands separators and remove decimal places
        const formattedPrice = parseFloat(plan.price).toLocaleString("en-US", {
          maximumFractionDigits: 0,
        });

        return {
          id: plan.id,
          name: t(`plans.${planType}.title`),
          price: formattedPrice,
          period: t(`plans.${planType}.period`),
          planId: plan.id,
          duration_months: plan.duration_months,
          features: [
            t("plans.features.allFeatures"),
            t("plans.features.support"),
            t("plans.features.updates"),
            ...(planType === "annual"
              ? [t("plans.features.discount", { discount: "30%" })]
              : planType === "semiAnnual"
              ? [t("plans.features.discount", { discount: "15%" })]
              : []),
          ],
          buttonText: t("plans.select"),
          popular: planType === "semiAnnual", // Mark semi-annual as popular
        };
      });
    },
    retry: 2,
  });

  return {
    plans: data || [],
    loading: isLoading,
    error: error
      ? t("errors.fetchPlans") ||
        "Failed to load subscription plans. Please try again later."
      : null,
  };
};
