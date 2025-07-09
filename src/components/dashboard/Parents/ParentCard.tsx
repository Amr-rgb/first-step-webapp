import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface Child {
  id: number;
  child_name: string;
}

interface ParentCardProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  national_number: string;
  childrenCount: number;
  children: Child[];
}

const ParentCard = ({
  id,
  name,
  email,
  phone,
  national_number,
  childrenCount,
  children,
}: ParentCardProps) => {
  const t = useTranslations("dashboard.admin.parents.card");
  return (
    <div className="relative bg-sidebar border-b border-light-gray p-6 flex flex-col lg:flex-row gap-8">
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-2 lg:gap-4">
          <p className="font-bold text-primary text-xl">{name}</p>
          <span className="font-medium text-mid-gray flex gap-1">
            <span>{t("phone")}</span>
            <span>{phone}</span>
          </span>
          <span className="font-medium text-mid-gray flex gap-1">
            <span>{t("email")}</span>
            <span>{email}</span>
          </span>
          <span className="font-medium text-mid-gray flex gap-1">
            <span>{t("nationalId")}</span>
            <span>{national_number}</span>
          </span>
        </div>

        <div className="flex gap-5 lg:gap-x-10">
          <Button asChild size={"sm"}>
            <Link href={`parents/${id}`}>{t("viewParent")}</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <div>
          <p className="mb-1 font-medium text-primary text-xl">{t("childrenCount")}</p>
          <span className="font-medium text-mid-gray">
            {t("childrenCountValue", { count: childrenCount })}
          </span>
        </div>

        <div>
          <p className="mb-1 font-medium text-primary text-xl">{t("childrenNames")}</p>
          <div className="flex flex-col gap-y-1 font-medium text-mid-gray">
            {children.map((child) => (
              <span key={child.id}>{child.child_name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* <Button
        variant={"ghost"}
        size={"icon"}
        className="absolute p-5 top-4 right-4 rtl:right-auto rtl:left-4"
      >
        <Trash2 className="size-5 text-destructive" />
      </Button> */}
    </div>
  );
};

export default ParentCard;
