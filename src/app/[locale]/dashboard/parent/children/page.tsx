import Children from "@/components/dashboard/children/Children";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function ChildrenPage() {
  const t = useTranslations("dashboard.parent.children");

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-end">
        <h1 className="sr-only heading-4 font-medium text-primary">
          {t("title")}
        </h1>

        <Button asChild size={"sm"} variant={"default"}>
          <Link href={"children/add"}>{t("add")}</Link>
        </Button>
      </div>

      <Children mode="parent" />
    </div>
  );
}
