"use client";

import { Icons } from "../general/icons";
import Image from "next/image";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

const TopBar = () => {
  const icons = [
    {
      title: "X",
      icon: Icons.twitter,
      link: "https://x.com/firststepapp",
    },
    {
      title: "LinkedIn",
      icon: Icons.linkedin,
      link: "https://www.linkedin.com/company/firststepapp",
    },
    {
      title: "Facebook",
      icon: Icons.facebook,
      link: "https://www.facebook.com/firststepapp",
    },
    {
      title: "Snapchat",
      icon: Icons.snapchat,
      link: "https://www.snapchat.com/add/first_stepsa",
    },
    {
      title: "Instagram",
      icon: Icons.instagram,
      link: "https://www.instagram.com/firststepapp.sa",
    },
    {
      title: "TikTok",
      icon: Icons.tiktok,
      link: "https://www.tiktok.com/@firststepapp",
    },
  ];

  return (
    <div className="bg-primary-blue text-white">
      <div className="container mx-auto px-4 flex justify-between items-center py-1.5">
        <div className="flex items-center gap-x-4">
          {icons.map((item) => (
            <a target="_blank" key={item.title} href={item.link}>
              <item.icon className="text-white size-4 hover:opacity-80 duration-300" />
            </a>
          ))}
        </div>

        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default TopBar;

function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("language");
  const language = locale === "en" ? t("en") : t("ar");
  const iconSrc =
    locale === "en" ? "/assets/icons/english.svg" : "/assets/icons/arabic.svg";

  const toggleLanguage = (newLocale: "ar" | "en") => {
    // Use the i18n pathname (without locale) and let the router handle locale switching
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <div className="flex items-center gap-x-1">
            <Image src={iconSrc} alt="arabic" width={20} height={20} />
            <div className="caption-12-medium font-bold">{language}</div>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleLanguage("ar")}>
          <div className="flex items-center gap-x-1">
            <Image
              src="/assets/icons/arabic.svg"
              alt="arabic"
              width={20}
              height={20}
            />
            <div className="caption-12-medium font-bold">{t("ar")}</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleLanguage("en")}>
          <div className="flex items-center gap-x-1">
            <Image
              src="/assets/icons/english.svg"
              alt="english"
              width={20}
              height={20}
            />
            <div className="caption-12-medium font-bold">{t("en")}</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
