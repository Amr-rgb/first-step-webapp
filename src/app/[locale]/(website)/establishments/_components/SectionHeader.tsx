"use client";

interface SectionHeaderProps {
  title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="w-1 h-8 bg-primary rounded-full" />
      <h2 className="heading-4 font-bold text-primary">{title}</h2>
    </div>
  );
};

export default SectionHeader;
