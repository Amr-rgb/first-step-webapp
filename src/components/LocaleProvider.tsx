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
    const locale = localeMatch ? localeMatch[1] : "en";

    // Update HTML attributes
    const htmlElement = document.documentElement;
    htmlElement.lang = locale;
    htmlElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [pathname]);

  return <>{children}</>;
}
