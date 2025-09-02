"use client";

import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import { getDashboardMetadata, Locale } from "@/lib/metadata";

export function usePageMetadata() {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const meta = getDashboardMetadata(locale, pathname);

  useEffect(() => {
    if (!meta) return;

    // update <title>
    document.title = meta.title;

    // update <meta name="description">
    let desc = document.querySelector("meta[name='description']");
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", meta.description);

    // update OpenGraph tags
    const ensureMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property='${property}']`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    ensureMeta("og:title", meta.title);
    ensureMeta("og:description", meta.description);
  }, [meta]);

  return meta;
}
