import Link from "next/link";
import { SectionHeader } from "../../../establishments/_components";
import { useTranslations } from "next-intl";

// Placeholder component
const SuccessStoriesSection = () => {
    const t = useTranslations("nurseryDetails.sections"); // Adjust translation key as needed

    return (
        <section>
            <SectionHeader title={t("successStories", { default: "Success Stories" })} />
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-500 py-12">
                <p className="mb-4">Success stories content will come here.</p>
                <div className="bg-gray-50 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Carousel or Grid Placeholder</span>
                </div>
            </div>
        </section>
    );
};

export default SuccessStoriesSection;
