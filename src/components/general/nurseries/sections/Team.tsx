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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {members.map((member, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {member.isSkeleton ? (
              <div className="rounded-2xl w-40 h-44 mb-2 bg-gray-200 animate-pulse" />
            ) : member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="rounded-2xl object-cover w-40 h-44 mb-2"
              />
            ) : (
              <div className="rounded-2xl w-40 h-44 mb-2 bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
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
            <div className="text-[#22336C] font-bold">{member.name}</div>
            <div className="text-gray-500 text-sm">{member.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
