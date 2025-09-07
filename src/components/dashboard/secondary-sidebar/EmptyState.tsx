import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import EmptyStateBase from "@/components/common/EmptyState";

type EmptyStateProps = {
  onAdd?: () => void;
};

const EmptyState = ({ onAdd }: EmptyStateProps) => {
  const t = useTranslations("dashboard.secondary-sidebar");

  return (
    <EmptyStateBase
      image="/assets/illustrations/empty.png"
      size="sm"
      className="mt-4"
      primaryAction={
        onAdd
          ? {
              label: t("empty.add-now"),
              onClick: onAdd,
              variant: "outline",
            }
          : undefined
      }
    />
  );
};

export default EmptyState;
