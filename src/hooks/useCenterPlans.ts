import { useQuery } from "@tanstack/react-query";
import { centerService } from "@/services/dashboardApi";
import { useTranslations } from "next-intl";

export interface CenterPlan {
  id: number;
  name: string; // translated title (e.g., quarterly/semiAnnual/annual)
  period: string; // translated period text
  price: string; // formatted price without decimals
  duration_months: number;
  auth_user_status: string | null;
  created_at: string;
  published_at: string;
}

export const useCenterPlans = () => {
  const t = useTranslations("HomePage.Subscription");

  const { data, isLoading, error } = useQuery({
    queryKey: ["center-plans"],
    queryFn: async () => {
      const response = await centerService.getPlans();
      const apiPlans = response.data as Array<{
        id: number;
        name: string;
        duration_months: number;
        price: string;
        auth_user_status: string | null;
        created_at: string;
        published_at: string;
      }>;

      const sortedPlans = [...apiPlans].sort(
        (a, b) => a.duration_months - b.duration_months
      );

      return sortedPlans.map((plan) => {
        let planType = "quarterly";
        if (plan.duration_months === 6) planType = "semiAnnual";
        if (plan.duration_months === 12) planType = "annual";

        const formattedPrice = parseFloat(plan.price).toLocaleString("en-US", {
          maximumFractionDigits: 0,
        });

        return {
          id: plan.id,
          name: t(`plans.${planType}.title`),
          period: t(`plans.${planType}.period`),
          price: formattedPrice,
          duration_months: plan.duration_months,
          auth_user_status: plan.auth_user_status,
          created_at: plan.created_at,
          published_at: plan.published_at,
        } as CenterPlan;
      });
    },
    retry: 2,
  });

  return {
    plans: data || [],
    loading: isLoading,
    error,
  };
};
