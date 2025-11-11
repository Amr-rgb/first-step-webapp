"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CommonQuestion } from "@/types";

const FAQs = ({ commonQuestions }: { commonQuestions: CommonQuestion[] }) => {
  const locale = useLocale();
  const t = useTranslations("faqs");

  return (
    <section
      className="w-full bg-cover md:bg-contain bg-repeat-x bg-center"
      style={{
        backgroundImage: "url(/assets/backgrounds/faqs-bg.svg)",
      }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="relative grow max-w-xs md:max-w-max pointer-events-none select-none">
          {locale === "en" ? (
            <h2 className="z-10 absolute top-[12%] xl:top-[13%] right-[18%] rotate-[12deg] !text-base md:!text-xl xl:!text-4xl !font-extrabold text-primary text-center">
              <span>{t("title.line1")}</span>
              <span className="block">{t("title.line2")}</span>
            </h2>
          ) : (
            <h2 className="z-10 absolute top-[14%] right-[40%] -rotate-[16.2deg] !text-lg sm:!text-xl xl:!text-[2.5rem] !font-extrabold text-primary text-nowrap">
              {t("title")}
            </h2>
          )}
          <Image
            className={locale === "en" ? "rotate-x-180 rotate-z-180" : ""}
            src="/assets/illustrations/faqs-child.png"
            alt="child"
            width={640}
            height={1016.52}
          />
        </div>

        <FAQAccordion commonQuestions={commonQuestions} />
      </div>
    </section>
  );
};

const FAQAccordion = ({
  commonQuestions,
}: {
  commonQuestions: CommonQuestion[];
}) => {
  const hasMoreThanFive = commonQuestions.length > 5;
  const firstItemId =
    commonQuestions.length > 0 ? `item-${commonQuestions[0].id}` : undefined;

  return (
    <>
      <div
        className={`grow w-full max-w-[600px] mx-auto rounded-lg ${
          hasMoreThanFive
            ? "max-h-[600px] overflow-y-auto custom-scrollbar pr-2"
            : ""
        }`}
      >
        <Accordion
          type="multiple"
          defaultValue={firstItemId ? [firstItemId] : undefined}
          className="w-full flex flex-col gap-y-2 md:gap-y-4 text-mid-gray"
        >
          {commonQuestions.map((item) => (
            <AccordionItem
              className="bg-white rounded-2xl stroke-1 stroke-light-gray"
              key={item.id}
              value={`item-${item.id}`}
            >
              <AccordionTrigger className="text-left font-medium md:!text-lg lg:!text-xl p-4 lg:p-6">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 lg:px-6">
                <div
                  className="prose max-w-none text-gray-700 leading-7"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Custom Scrollbar Styles */}
      {hasMoreThanFive && (
        <style jsx global>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #4d5edb #f7f8fa;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            background: #f7f8fa;
            border-radius: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4d5edb;
            border-radius: 6px;
            min-height: 40px;
            transition: background 0.2s;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #22336c;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f7f8fa;
            border-radius: 6px;
          }
        `}</style>
      )}
    </>
  );
};

export default FAQs;
