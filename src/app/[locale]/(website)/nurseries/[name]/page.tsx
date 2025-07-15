import Advertisment from "@/components/general/Advertisment";
import Branches from "@/components/general/nurseries/Branches";
import Header from "@/components/general/nurseries/Header";
import Programs from "@/components/general/nurseries/sections/Programs";
import { slugToReadableName } from "@/lib/utils";
import { AdSlide } from "@/types";
import { getTranslations } from "next-intl/server";

export default async function NurseryPage({
  params,
}: {
  params: Promise<{ name: string; locale: string }>;
}) {
  const { name, locale } = await params;
  const t = await getTranslations("nurseryDetails");
  const readableName = slugToReadableName(name);

  const slides: AdSlide[] = [
    {
      id: 1,
      title: "Nursery 1",
      image:
        "https://images.unsplash.com/photo-1578349035260-9f3d4042f1f7?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      created_at: "",
      published_at: "",
    },
    {
      id: 2,
      title: "Nursery 2",
      image:
        "https://images.unsplash.com/photo-1586694680938-9682c9e1f736?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      created_at: "",
      published_at: "",
    },
    {
      id: 3,
      title: "Nursery 3",
      image:
        "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      created_at: "",
      published_at: "",
    },
  ];

  const isWorldOfLearning =
    readableName === "World of Learning" ||
    name.toLowerCase().includes("world-of-learning") ||
    name.toLowerCase().includes("world-of-learning-junior");

  const isWorldOfLearningJunior = name
    .toLowerCase()
    .includes("world-of-learning-junior");

  return (
    <div>
      <Header
        name={readableName}
        slogan={isWorldOfLearning ? t("slogan") : undefined}
      />
      <Branches locale={locale} nurseryName={name} />

      {/* World of Learning custom sections */}
      {isWorldOfLearning && (
        <>
          {isWorldOfLearningJunior && (
            <Programs nurseryName={name} locale={locale} />
          )}

          {/* Contact/Owner Info Section */}
          <section className="my-10 container mx-auto px-4 xl:px-8">
            <div
              dir={locale === "ar" ? "rtl" : "ltr"}
              style={{ fontFamily: "Tahoma, Arial, sans-serif" }}
            >
              <h2 className="mb-6 heading-3 text-secondary-burgundy text-center">
                {t("contact.title")}
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6 text-center space-y-2">
                <p className="font-bold text-lg">{t("contact.ownerName")}</p>
                <p>{t("contact.ownerRole")}</p>
                <p>{t("contact.nurseryName")}</p>
                <p>{t("contact.mobile")}</p>
                <p>{t("contact.phone")}</p>
                <p>{t("contact.address")}</p>
              </div>
            </div>
          </section>
        </>
      )}
      {/* <Advertisment slides={slides} /> */}
    </div>
  );
}
