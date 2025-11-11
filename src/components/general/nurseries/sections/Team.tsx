"use client";

import { useTranslations } from "next-intl";

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  isSkeleton?: boolean;
}

interface TeamProps {
  members: TeamMember[];
}

const Team = ({ members }: TeamProps) => {
  const t = useTranslations("nurseryDetails");

  // Don't render if no members
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#47B881] mb-8">
        {t("team.title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {members.map((member, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {member.isSkeleton ? (
              <div className="rounded-3xl aspect-[16/17] mb-4 bg-gray-200 animate-pulse" />
            ) : member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="rounded-3xl object-cover aspect-[16/17] mb-4 shadow-lg"
              />
            ) : (
              <div className="rounded-3xl aspect-[16/17] mb-4 bg-gray-200 flex items-center justify-center shadow-lg">
                <svg
                  className="w-32 h-32 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
            <div className="text-[#22336C] font-bold text-xl mb-1">
              {member.name}
            </div>
            <div className="text-gray-500 text-lg text-center">
              {member.role}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
