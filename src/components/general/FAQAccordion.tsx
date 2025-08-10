"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CommonQuestion } from "@/types";

interface FAQAccordionProps {
  commonQuestions: CommonQuestion[];
  locale: string;
  variant?: "default" | "compact";
  maxItems?: number;
}

const FAQAccordion = ({ 
  commonQuestions, 
  locale, 
  variant = "default", 
  maxItems 
}: FAQAccordionProps) => {
  const questionsToShow = maxItems ? commonQuestions.slice(0, maxItems) : commonQuestions;

  return (
    <div className="w-full">
      <Accordion
        type="multiple"
        className="w-full flex flex-col gap-y-2 md:gap-y-4 text-mid-gray"
      >
        {questionsToShow.map((item) => (
          <AccordionItem
            className={`${
              variant === "compact" 
                ? "bg-white rounded-2xl stroke-1 stroke-light-gray" 
                : "bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow"
            }`}
            key={item.id}
            value={`item-${item.id}`}
          >
            <AccordionTrigger 
              className={`${locale === 'ar' ? 'text-right' : 'text-left'} font-medium md:!text-lg lg:!text-xl p-4 lg:p-6 ${
                variant === "default" ? "hover:text-primary-blue transition-colors" : ""
              }`}
            >
              <span className="flex-1">
                {item.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 lg:px-6 pb-4 lg:pb-6">
              <div 
                className={`prose max-w-none ${locale === 'ar' ? 'text-right' : 'text-left'} text-gray-700 leading-7`}
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQAccordion;
