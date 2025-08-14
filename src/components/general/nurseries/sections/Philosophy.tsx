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
    <section className="mt-20 mb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {data.philosophy && (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center transform hover:scale-105 transition-transform duration-300">
              {/* Philosophy Illustration */}
              <div className="mb-8 flex justify-center">
                <img
                  src="/assets/illustrations/philosophy.png"
                  alt="Philosophy"
                  className="w-40 h-40 object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold text-[#B12F53] mb-6">
                {t("philosophy.title")}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {data.philosophy.content}
              </p>
            </div>
          )}

          {data.methodology && (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center transform hover:scale-105 transition-transform duration-300">
              {/* Methodology Illustration */}
              <div className="mb-8 flex justify-center">
                <img
                  src="/assets/illustrations/methodology.png"
                  alt="Methodology"
                  className="w-40 h-40 object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold text-[#B12F53] mb-6">
                {t("methodology.title")}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {data.methodology.content}
              </p>
            </div>
          )}

          {data.goals && (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center transform hover:scale-105 transition-transform duration-300">
              {/* Goals Illustration */}
              <div className="mb-8 flex justify-center">
                <img
                  src="/assets/illustrations/goal.png"
                  alt="Goals"
                  className="w-40 h-40 object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold text-[#B12F53] mb-6">
                {t("goals.title")}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
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
