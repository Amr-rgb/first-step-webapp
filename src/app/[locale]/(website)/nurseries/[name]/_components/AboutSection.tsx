"use client";

import SectionHeader from "./SectionHeader";

interface AboutSectionProps {
  title: string;
  subtitle: string;
  description: string;
}

const AboutSection = ({ title, subtitle, description }: AboutSectionProps) => {
  if (!subtitle && !description) return null;

  return (
    <section id="about" className="scroll-mt-20">
      <SectionHeader title={title} />
      <div className="bg-[#F8F9FC] rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-50">
        {subtitle && (
          <h3 className="text-xl md:text-2xl font-bold text-primary mb-6 leading-relaxed">
            {subtitle}
          </h3>
        )}
        {description && (
          <p className="text-gray-400 text-lg md:text-xl leading-[1.8] font-medium">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
