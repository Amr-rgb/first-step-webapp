"use server";
import { websiteService } from "@/services/api";
import ValuesGridClient from "./ValuesGridClient";

const valuesConstants = [
  {
    iconSrc: "/assets/illustrations/mother.svg",
    bg: "#B12F53",
    color: "#fff",
  },
  {
    iconSrc: "/assets/illustrations/mother.svg",
    bg: "#2B3990",
    color: "#fff",
  },
  {
    iconSrc: "/assets/illustrations/mother-nurse.svg",
    bg: "#D9534F",
    color: "#fff",
  },
  {
    iconSrc: "/assets/illustrations/mother-nurse.svg",
    bg: "#73B094",
    color: "#fff",
  },
];

const Values = async ({
  locale,
  error,
}: {
  locale: "ar" | "en";
  error?: any;
}) => {
  let values: any[] = [];

  if (!error) {
    try {
      values = await websiteService.getOurValues(locale);
    } catch (err) {
      console.error("Error fetching values:", err);
      error = err;
    }
  }

  return (
    <section dir="rtl" className="container mx-auto px-4 text-center space-y-9">
      <h2 className="text-primary space-y-9">
        <span>{locale === "ar" ? "قيم" : "Values"}</span>
        <span className="block">First Step</span>
      </h2>
      <ValuesGridClient
        values={values}
        valuesConstants={valuesConstants}
        error={error}
        locale={locale}
      />
    </section>
  );
};

export default Values;
