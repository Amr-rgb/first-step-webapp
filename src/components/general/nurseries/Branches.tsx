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
    </>
  );
};

export default Branches;
