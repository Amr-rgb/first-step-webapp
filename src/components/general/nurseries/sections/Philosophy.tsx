"use client";

import { useTranslations } from "next-intl";

interface PhilosophyData {
  philosophy?: {
    content: string;
  };
  methodology?: {
    content: string;
  };
  goals?: {
    content: string;
  };
}

interface PhilosophyProps {
  data: PhilosophyData;
}

const Philosophy = ({ data }: PhilosophyProps) => {
  const t = useTranslations("nurseryDetails");

  // Don't render if no data
  if (!data || (!data.philosophy && !data.methodology && !data.goals)) {
    return null;
  }

  return (
    <section className="mt-20 mb-10 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {data.philosophy && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              {/* Philosophy Illustration */}
              <div className="mb-6 flex justify-center">
                <img
                  src="/assets/illustrations/philosophy.png"
                  alt="Philosophy"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#B12F53] mb-4">
                {t("philosophy.title")}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {data.philosophy.content}
              </p>
            </div>
          )}

          {data.methodology && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              {/* Methodology Illustration */}
              <div className="mb-6 flex justify-center">
                <img
                  src="/assets/illustrations/methodology.png"
                  alt="Methodology"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#B12F53] mb-4">
                {t("methodology.title")}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {data.methodology.content}
              </p>
            </div>
          )}

          {data.goals && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              {/* Goals Illustration */}
              <div className="mb-6 flex justify-center">
                <img
                  src="/assets/illustrations/goal.png"
                  alt="Goals"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#B12F53] mb-4">
                {t("goals.title")}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {data.goals.content}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
