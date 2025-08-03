import { useTranslations } from "next-intl";
import Link from "next/link";

interface Program {
  title: string;
  image: string;
  price: string;
  features: string[];
  buttonText: string;
}

interface ProgramsProps {
  programs?: Program[];
  nurseryName?: string;
  locale?: string;
  isPreview?: boolean;
}

const Programs = ({ programs, nurseryName, locale, isPreview = false }: ProgramsProps) => {
  const t = useTranslations("nurseryDetails.programs");
  let displayPrograms = programs;
  if (
    nurseryName &&
    nurseryName.toLowerCase().includes("world-of-learning-junior")
  ) {
    displayPrograms = [
      {
        title: t("junior.monthly.title"),
        image: "/assets/illustrations/monthly.png",
        price: t("junior.monthly.price"),
        features: [
          t("junior.monthly.features.0"),
          t("junior.monthly.features.1"),
          t("junior.monthly.features.2"),
          t("junior.monthly.features.3"),
          t("junior.monthly.features.4"),
        ],
        buttonText: t("junior.monthly.buttonText"),
      },
      {
        title: t("junior.daily.title"),
        image: "/assets/illustrations/daily.png",
        price: t("junior.daily.price"),
        features: [
          t("junior.daily.features.0"),
          t("junior.daily.features.1"),
          t("junior.daily.features.2"),
          t("junior.daily.features.3"),
          t("junior.daily.features.4"),
        ],
        buttonText: t("junior.daily.buttonText"),
      },
      {
        title: t("junior.hourly.title"),
        image: "/assets/illustrations/hourly.png",
        price: t("junior.hourly.price"),
        features: [
          t("junior.hourly.features.0"),
          t("junior.hourly.features.1"),
          t("junior.hourly.features.2"),
          t("junior.hourly.features.3"),
          t("junior.hourly.features.4"),
        ],
        buttonText: t("junior.hourly.buttonText"),
      },
    ];
  }
  if (!displayPrograms) return null;
  return (
    <section className="mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#22336C] mb-10">
        {t("title")}
      </h2>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {displayPrograms.map((program, idx) => (
          <div
            key={idx}
            className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center min-w-[220px] max-w-xs mx-auto"
          >
            <img
              src={program.image}
              alt={program.title}
              className="mb-4 w-20 h-20 object-contain"
            />
            <h3 className="text-xl font-bold text-[#22336C] mb-2">
              {program.title}
            </h3>
            <div className="text-3xl font-bold text-[#22336C] mb-2">
              {program.price}
            </div>
            <ul className="text-[#22336C] text-right mb-4 space-y-1 font-medium leading-relaxed">
              {program.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            {isPreview ? (
              <button className="mt-auto bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-lg px-6 py-2 font-bold transition hover:opacity-90 block text-center w-full">
                {program.buttonText}
              </button>
            ) : (
              <Link
                href={`/${locale}/nurseries/${nurseryName}/reservation?program=${encodeURIComponent(program.title)}`}
                passHref
                legacyBehavior
              >
                <a className="mt-auto bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-lg px-6 py-2 font-bold transition hover:opacity-90 block text-center">
                  {program.buttonText}
                </a>
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Programs;
