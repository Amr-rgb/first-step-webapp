"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface LocaleProviderProps {
  children: React.ReactNode;
}

export default function LocaleProvider({ children }: LocaleProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Extract locale from pathname
    const localeMatch = pathname?.match(/^\/(\w+)/);
    const potentialLocale = localeMatch ? localeMatch[1] : null;
    const validLocales = ["ar", "en"] as const;
    const locale: string = validLocales.includes(potentialLocale as any) ? potentialLocale! : "ar";

    // Update HTML attributes
    const htmlElement = document.documentElement;
    htmlElement.lang = locale;
    htmlElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [pathname]);

  return <>{children}</>;
}
