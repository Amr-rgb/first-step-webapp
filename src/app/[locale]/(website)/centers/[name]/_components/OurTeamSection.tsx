import { SectionHeader } from "../../../establishments/_components";
import { useTranslations } from "next-intl";

// Placeholder component
const OurTeamSection = () => {
    const t = useTranslations("nurseryDetails.sections");

    return (
        <section>
            <SectionHeader title={t("ourTeam", { default: "Our Team" })} />
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-500 py-12">
                <p className="mb-4">Team members presentation will come here.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-50 aspect-square rounded-full flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Member {i}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurTeamSection;
