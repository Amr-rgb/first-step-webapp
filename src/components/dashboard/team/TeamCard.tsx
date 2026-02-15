import { Link } from "@/i18n/navigation";
import { TeamMember } from "@/app/[locale]/dashboard/nursery/team/page";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface TeamCardProps extends TeamMember { }

export const TeamCard = ({
  id,
  image_url,
  profession,
  name,
}: TeamCardProps) => {
  return (
    <div className="p-2 rounded-3xl border border-light-gray flex flex-col items-center gap-y-2">
      <div
        className="w-full min-w-[11.25rem] h-[12.5rem] rounded-2xl bg-cover bg-left-top"
        style={{
          backgroundImage: `url(${image_url})`,
        }}
      />

      <p className="font-bold text-primary">{profession}</p>
      <p className="text-sm text-mid-gray">{name}</p>

      <div className="flex items-center gap-1">
        <Button asChild variant="ghost" size="icon">
          <Link href={`team/${id}`}>
            <Edit className="size-4 text-mid-gray" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon">
          <Link href={`team/${id}`}>
            <Trash2 className="size-4 text-mid-gray" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
