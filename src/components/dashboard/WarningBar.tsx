"use client";

import { useTranslations } from "next-intl";
import { useAuthUser } from "@/store/authStore";
import { addDays, isWithinInterval } from "date-fns";

const WarningBar = () => {
  const t = useTranslations("HomePage.Subscription.dashboard");

  const user = useAuthUser();

  const today = new Date();
  const subscriptionEndDate =
    user?.subscription_status === "free"
      ? new Date(user?.free_trail_end_date)
      : new Date(user?.subscription_end_date as string);

  const AboutToEnd = isWithinInterval(subscriptionEndDate, {
    start: addDays(today, 3),
    end: today,
  });

  if (!AboutToEnd) return null;

  if (AboutToEnd)
    return (
      <div className="bg-destructive text-white px-5 py-2.5 font-medium">
        {t("warning")}
      </div>
    );
};

export default WarningBar;
