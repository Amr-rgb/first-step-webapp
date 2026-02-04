"use client";

interface SectionHeaderProps {
  title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-1.5 h-8 bg-primary rounded-full" />
      <h2 className="text-2xl md:text-3xl font-bold text-primary">{title}</h2>
    </div>
  );
};

export default SectionHeader;
