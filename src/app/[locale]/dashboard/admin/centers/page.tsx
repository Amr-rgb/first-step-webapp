import Centers from "@/components/dashboard/centers/Centers";
import { useTranslations } from "next-intl";

export default function CentersPage() {
  const t = useTranslations("dashboard.admin.center");

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-center">
        <h1 className="heading-4 font-bold text-primary">{t("title")}</h1>
      </div>

      <Centers />
    </div>
  );
}
