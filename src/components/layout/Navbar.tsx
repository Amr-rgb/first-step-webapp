"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import NavbarButton from "./NavbarButton";
import { useAuthToken } from "@/store/authStore";

const Navbar = ({ children }: { children?: React.ReactNode }) => {
  const token = useAuthToken();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const t = useTranslations("navbar");

  const keys = [
    "home",
    "services",
    "nurseries",
    // "centers",
    "blog",
    "story",
    "contact",
  ];
  const links = keys.map((key, index) => {
    return {
      id: index,
      title: t(`links.${key}.title`),
      path: t(`links.${key}.path`),
    };
  });

  const hoverEffect =
    "hover:text-primary hover:font-bold hover:text-xl hover:text-secondary-orange duration-300 ";

  return (
    <div className="relative container mx-auto px-4 py-2.5">
      {!token && (
        <div className="z-[9999] fixed top-64 -left-[90px] -rotate-90 flex items-center gap-x-4">
          <Button
            asChild
            size={"sm"}
            variant="defaultNoGradient"
            className="bg-secondary-mint-green rounded-[8px]"
          >
            <Link href={"/sign-up/parent"}>{t("buttons.join-parent")}</Link>
          </Button>
          <Button
            asChild
            size={"sm"}
            variant="defaultNoGradient"
            className="bg-secondary-burgundy rounded-[8px]"
          >
            <Link href={"/sign-up/center"}>{t("buttons.join-center")}</Link>
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center gap-x-8">
        {/* Left */}
        <div className="flex-1">
          <Link className="inline-block w-fit" href={"/"}>
            <Image
              src="/assets/logos/complete_logo.svg"
              alt="logo"
              width={236}
              height={59.9}
            />
          </Link>
        </div>

        {/* Mobile menu overlay */}
        <div
          className={`z-[9999] fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleMenu}
          aria-hidden="true"
        />

        {/* Slide-out menu */}
        <div
          className={`z-[9999] fixed top-0 bottom-0 right-0 w-4/5 max-w-xs bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Menu header */}
          <div className="flex justify-between items-center p-4 border-b">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu items */}
          <ul className="pt-2 pb-4">
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.path}
                  className={`block px-6 py-4 text-base hover:bg-emerald-50 transition-colors ${
                    isActive(link.path)
                      ? "font-bold text-emerald-600"
                      : "text-gray-700"
                  }`}
                  onClick={toggleMenu}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Call to action button */}
          <div className="block sm:hidden mt-5 justify-self-center">
            {children ? children : <NavbarButton />}
          </div>
        </div>

        {/* Centered navigation */}
        <div className="hidden xl:block shrink-0 py-7 px-14 rounded-full bg-gradient-to-t from-white from-[28%] to-[#E2F3EB]">
          <ul className="flex justify-between items-center gap-x-9">
            {links.map((link) => (
              <li
                key={link.id}
                className="relative inline-block font-medium text-center h-7"
              >
                <Link
                  href={link.path}
                  className={`text-base text-gray ${hoverEffect} ${
                    isActive(link.path)
                      ? "text-xl font-extrabold text-primary"
                      : ""
                  }`}
                >
                  {link.title}
                </Link>

                <span className="relative h-0 inset-0 pointer-events-none flex items-center justify-center text-xl font-extrabold opacity-0">
                  {link.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right */}
        {
          <div className="flex-1 text-right flex items-center justify-end">
            {/* Menu Icon */}
            <Button
              className="xl:hidden p-2 rounded-full bg-gradient-to-t from-white from-30 to-emerald-50 text-gray-700"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
              onClick={toggleMenu}
            >
              <Menu size={24} />
            </Button>

            <div className="ml-8 hidden sm:block">
              {children ? children : <NavbarButton />}
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default Navbar;
