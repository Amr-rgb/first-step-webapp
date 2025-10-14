import { TeamMember } from "@/app/[locale]/dashboard/center/team/page";
import { TeamCard } from "./TeamCard";
import EmptyState from "@/components/common/EmptyState";
import { useTranslations } from "next-intl";

const Team = ({ members }: { members: TeamMember[] }) => {
  const t = useTranslations("dashboard.emptyStates");

  if (members.length === 0) {
    return (
      <EmptyState
        icon="👥"
        size="lg"
        primaryAction={{
          label: "Add Team Member",
          onClick: () => {
            // This will be handled by the parent component
            window.location.href = "/dashboard/center/team/add";
          },
        }}
        translationKey="dashboard.emptyStates.team"
      />
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-x-4 gap-y-5.5">
      {members.map((member, index) => (
        <TeamCard key={index} {...member} />
      ))}
    </div>
  );
};

export default Team;
