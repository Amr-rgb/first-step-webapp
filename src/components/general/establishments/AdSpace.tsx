"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface AdSpaceProps {
    variant?: "single" | "double" | "triple";
    className?: string;
}

const AdSpace = ({ variant = "double", className }: AdSpaceProps) => {
    const t = useTranslations("adSpace");

    const renderAdBox = (key: string) => (
        <div
            key={key}
            className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-8 flex items-center justify-center hover:border-gray-300 transition-colors cursor-pointer"
        >
            <span className="text-gray-400 text-sm">{t("cta")}</span>
        </div>
    );

    if (variant === "single") {
        return (
            <div className={cn("w-full", className)}>
                {renderAdBox("single")}
            </div>
        );
    }

    if (variant === "triple") {
        return (
            <div className={cn("w-full", className)}>
                {/* Header with accent bar */}
                <div className="flex items-center gap-2 mb-4 justify-end">
                    <span className="text-primary font-bold text-lg">{t("title")}</span>
                    <span className="w-1 h-6 bg-primary rounded-full" />
                </div>

                {/* Grid layout: one large on left, two stacked on right */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Two stacked boxes */}
                    <div className="lg:col-span-2 space-y-4">
                        {renderAdBox("top-left")}
                        {renderAdBox("bottom-left")}
                    </div>
                    {/* Large box on right */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-8 h-full min-h-[200px] flex items-center justify-center hover:border-gray-300 transition-colors cursor-pointer">
                            <span className="text-gray-400 text-sm">{t("cta")}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default: double (two side by side)
    return (
        <div className={cn("w-full", className)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderAdBox("left")}
                {renderAdBox("right")}
            </div>
        </div>
    );
};

export default AdSpace;
