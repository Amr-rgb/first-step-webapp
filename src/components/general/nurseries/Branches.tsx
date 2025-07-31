"use client";

import { Icons } from "../icons";
import Link from "next/link";
import Services from "./sections/Services";
import { useTranslations } from "next-intl";

interface BranchesProps {
  locale: string;
  nurseryName: string;
}

const Branches = ({ locale, nurseryName }: BranchesProps) => {
  const t = useTranslations("nurseryDetails");
  let services: { title: string; description: string; image: string }[] = [];
  const branches = [
    t("branches.qassim"),
    t("branches.gharnata"),
    t("branches.madina"),
    t("branches.makkah"),
    t("branches.riyadh"),
  ];

  const branchColors = [
    "text-[#B12F53] fill-[#B12F53]",
    "text-[#47B881] fill-[#47B881]",
    "text-[#3B82F6] fill-[#3B82F6]",
    "text-[#D9534F] fill-[#D9534F]",
    "text-[#FFAD0D] fill-[#FFAD0D]",
  ];


  // Remove the static Nursery Services Section
  // Add dynamic Services component for World Of Learning Junior
  if (nurseryName.toLowerCase().includes("world-of-learning-junior")) {
    services = [
      {
        title: t("services.creativeChild.title"),
        description: t("services.creativeChild.desc"),
        image: "/assets/nursey-service/small child.png",
      },
      {
        title: t("services.playground.title"),
        description: t("services.playground.desc"),
        image: "/assets/nursey-service/games.png",
      },
      {
        title: t("services.unit.title"),
        description: t("services.unit.desc"),
        image: "/assets/nursey-service/wehdahh.png",
      },
      {
        title: t("services.montessori.title"),
        description: t("services.montessori.desc"),
        image: "/assets/nursey-service/mentosory.png",
      },
    ];
  }

  const isWorldOfLearningJunior = nurseryName
    .toLowerCase()
    .includes("world-of-learning-junior");

  return (
    <>
      {/* Branches Section */}
      {!isWorldOfLearningJunior && (
        <section className="my-10 container mx-auto px-4 xl:px-8">
          <h2 className="mb-6 heading-3 text-secondary-burgundy text-center">
            {t("branches.title")}
          </h2>

          <div className="relative overflow-x-auto overflow-y-hidden px-4">
            <div className="flex flex-nowrap pb-4 min-h-[120px] justify-center">
              {branches.map((branch, index) => (
                <div
                  key={branch}
                  className={`group relative flex flex-col items-center min-w-48 md:min-w-64 w-48 mb-8 ${branchColors[index]}`}
                >
                  <div className="-z-50 w-full h-1 bg-light-gray absolute translate-y-[670%] top-1/2 group-first:w-1/2 group-last:w-1/2 group-first:right-0 group-last:left-0 rtl:group-last:right-0 rtl:group-first:right-auto rtl:group-first:left-0" />

                  {/* Branch circle with color based on index */}
                  <div
                    className={
                      "rounded-full flex items-center justify-center origin-[50%_80%] group-even:rotate-180"
                    }
                  >
                    <Icons.location className="fill-inherit size-20" />
                  </div>

                  {/* Branch name */}
                  <p className="absolute left-1/2 -translate-x-1/2 group-even:top-[20%] group-odd:top-[100%] text-2xl text-center font-bold text-nowrap whitespace-nowrap">
                    {branch}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Nursery Services Section */}
      {services.length > 0 && <Services services={services} />}

      {/* Nursery Stats Section */}
      {!isWorldOfLearningJunior && (
        <section className="mt-16 mb-10">
          <div className="flex justify-center mb-8">
            <Link
              href={`/${locale}/nurseries/${nurseryName}/reservation`}
              className="bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-md px-8 py-2 font-bold text-sm shadow-md hover:opacity-90 transition"
            >
              {t("branches.cta")}
            </Link>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              {/* Icon: Nursery Area */}
              <svg
                width="64"
                height="64"
                fill="none"
                viewBox="0 0 64 64"
                className="mb-2"
              >
                <path
                  d="M8 56V24L32 8l24 16v32H8Z"
                  stroke="#B12F53"
                  strokeWidth="3"
                />
                <path d="M24 56V40h16v16" stroke="#B12F53" strokeWidth="3" />
              </svg>
              <div className="text-3xl font-bold text-[#B12F53]">2000</div>
              <div className="text-[#B12F53] font-bold mt-1">
                {t("branches.stats.area")}
              </div>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center">
              {/* Icon: Classrooms */}
              <svg
                width="64"
                height="64"
                fill="none"
                viewBox="0 0 64 64"
                className="mb-2"
              >
                <path d="M12 16h40v32H12z" stroke="#22336C" strokeWidth="3" />
                <path d="M24 32h16M24 40h16" stroke="#22336C" strokeWidth="3" />
                <circle
                  cx="20"
                  cy="24"
                  r="4"
                  stroke="#22336C"
                  strokeWidth="3"
                />
              </svg>
              <div className="text-3xl font-bold text-[#22336C]">10</div>
              <div className="text-[#22336C] font-bold mt-1">
                {t("branches.stats.classrooms")}
              </div>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center">
              {/* Icon: Team */}
              <svg
                width="64"
                height="64"
                fill="none"
                viewBox="0 0 64 64"
                className="mb-2"
              >
                <circle
                  cx="32"
                  cy="20"
                  r="8"
                  stroke="#47B881"
                  strokeWidth="3"
                />
                <path
                  d="M16 52c0-8.837 7.163-16 16-16s16 7.163 16 16"
                  stroke="#47B881"
                  strokeWidth="3"
                />
                <circle
                  cx="16"
                  cy="28"
                  r="5"
                  stroke="#47B881"
                  strokeWidth="2"
                />
                <circle
                  cx="48"
                  cy="28"
                  r="5"
                  stroke="#47B881"
                  strokeWidth="2"
                />
              </svg>
              <div className="text-3xl font-bold text-[#47B881]">25</div>
              <div className="text-[#47B881] font-bold mt-1">
                {t("branches.stats.team")}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Nursery Activities Section */}
      <section className="mt-20 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-2">
          {t("activities.title")}
        </h2>
        <div className="text-center text-[#22336C] mb-8 font-medium">
          {t("activities.description")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          <img
            src="/assets/activities/activity1.jpg"
            alt="activity1"
            className="rounded-2xl object-cover w-full h-64"
          />
          <img
            src="/assets/activities/activity2.jpg"
            alt="activity2"
            className="rounded-2xl object-cover w-full h-64"
          />
          <img
            src="/assets/activities/activity3.jpg"
            alt="activity3"
            className="rounded-2xl object-cover w-full h-64"
          />
          <img
            src="/assets/activities/activity4.jpg"
            alt="activity4"
            className="rounded-2xl object-cover w-full h-64"
          />
          <img
            src="/assets/activities/activity5.jpg"
            alt="activity5"
            className="rounded-2xl object-cover w-full h-64"
          />
          <img
            src="/assets/activities/activity6.jpg"
            alt="activity6"
            className="rounded-2xl object-cover w-full h-64"
          />
        </div>
        <div className="flex justify-center">
          <Link
            href={`/${locale}/nurseries/${nurseryName}/reservation`}
            className="bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-md px-8 py-2 font-bold text-sm shadow-md hover:opacity-90 transition"
          >
            {t("branches.cta")}
          </Link>
        </div>
      </section>

      {/* Nursery Team Section */}
      {!isWorldOfLearningJunior && (
        <section className="mt-20 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#47B881] mb-8">
            {t("team.title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {/* Member 1 - Skeleton */}
            <div className="flex flex-col items-center">
              <div className="rounded-2xl w-40 h-44 mb-2 bg-gray-200 animate-pulse" />
              <div className="text-[#22336C] font-bold">
                {t("team.skeletonName")}
              </div>
              <div className="text-gray-500 text-sm">
                {t("team.skeletonRole")}
              </div>
            </div>
            {/* Member 2 - Real Image */}
            <div className="flex flex-col items-center">
              <img
                src="https://picsum.photos/200/250?random=1"
                alt="اسم الشخص"
                className="rounded-2xl object-cover w-40 h-44 mb-2"
              />
              <div className="text-[#22336C] font-bold">اسم الشخص</div>
              <div className="text-gray-500 text-sm">مهتمه في الحضانة</div>
            </div>
            {/* Member 3 - Real Image */}
            <div className="flex flex-col items-center">
              <img
                src="https://picsum.photos/200/250?random=2"
                alt="اسم الشخص"
                className="rounded-2xl object-cover w-40 h-44 mb-2"
              />
              <div className="text-[#22336C] font-bold">اسم الشخص</div>
              <div className="text-gray-500 text-sm">مهتمه في الحضانة</div>
            </div>
            {/* Member 4 - Real Image */}
            <div className="flex flex-col items-center">
              <img
                src="https://picsum.photos/200/250?random=3"
                alt="اسم الشخص"
                className="rounded-2xl object-cover w-40 h-44 mb-2"
              />
              <div className="text-[#22336C] font-bold">اسم الشخص</div>
              <div className="text-gray-500 text-sm">مهتمه في الحضانة</div>
            </div>
            {/* Member 5 - Skeleton */}
            <div className="flex flex-col items-center">
              <div className="rounded-2xl w-40 h-44 mb-2 bg-gray-200 animate-pulse" />
              <div className="text-[#22336C] font-bold">
                {t("team.skeletonName")}
              </div>
              <div className="text-gray-500 text-sm">
                {t("team.skeletonRole")}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Branches;
