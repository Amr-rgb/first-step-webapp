import type { Preview } from "@storybook/nextjs";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";

import "../src/styles/globals.css";
import enMessages from "../src/messages/en.json";
import arMessages from "../src/messages/ar.json";

const localeMessages = {
  en: enMessages,
  ar: arMessages,
} as const;

const preview: Preview = {
  globalTypes: {
    locale: {
      name: "Locale",
      description: "Application locale",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "ar", title: "Arabic" },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const locale =
        context.globals.locale === "ar" ? "ar" : "en";
      const direction = locale === "ar" ? "rtl" : "ltr";
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      });

      return (
        <NextIntlClientProvider
          locale={locale}
          messages={localeMessages[locale]}
        >
          <QueryClientProvider client={queryClient}>
            <div
              dir={direction}
              className="min-h-screen bg-background text-foreground p-6"
            >
              <Story />
            </div>
          </QueryClientProvider>
        </NextIntlClientProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
