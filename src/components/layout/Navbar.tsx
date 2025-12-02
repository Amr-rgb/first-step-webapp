"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import NavbarButton from "./NavbarButton";
import { useAuthToken } from "@/store/authStore";

// Simple browser detection for old browsers
const isOldBrowser = () => {
  if (typeof window === "undefined") return true; // Assume old browser during SSR

  // Check for modern features that old browsers don't have
  return !(
    "IntersectionObserver" in window &&
    "ResizeObserver" in window &&
    CSS.supports("display", "grid") &&
    CSS.supports("backdrop-filter", "blur(10px)")
  );
};

const Navbar = ({ children }: { children?: React.ReactNode }) => {
  const token = useAuthToken();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [needsOldBrowserFallback, setNeedsOldBrowserFallback] = useState(true); // Start with true for SSR
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (path: string) => pathname === path;

  // Check if we need old browser fallback
  useEffect(() => {
    const isOld = isOldBrowser();
    setNeedsOldBrowserFallback(isOld);

    // If it's a modern browser, remove the fallback styles after a short delay
    if (!isOld) {
      const timer = setTimeout(() => {
        setNeedsOldBrowserFallback(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Enhanced toggle function with ref-based control
  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);

    // Use refs to ensure proper DOM manipulation for old browsers
    if (menuRef.current && overlayRef.current) {
      if (newState) {
        // Open menu
        menuRef.current.style.transform = "translateX(0)";
        overlayRef.current.style.opacity = "1";
        overlayRef.current.style.pointerEvents = "auto";

        // Focus management for accessibility
        setTimeout(() => {
          closeButtonRef.current?.focus();
        }, 100);
      } else {
        // Close menu
        menuRef.current.style.transform = "translateX(100%)";
        overlayRef.current.style.opacity = "0";
        overlayRef.current.style.pointerEvents = "none";
      }
    }
  };

  // Force close menu (for old browsers that might not respond to state changes)
  const forceCloseMenu = () => {
    setIsMenuOpen(false);
    if (menuRef.current && overlayRef.current) {
      menuRef.current.style.transform = "translateX(100%)";
      overlayRef.current.style.opacity = "0";
      overlayRef.current.style.pointerEvents = "none";
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        forceCloseMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        forceCloseMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const t = useTranslations("navbar");

  const keys = [
    "home",
    "services",
    "nurseries",
    // "centers",
    "coupon-codes",
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
        <div
          className="z-[9999] fixed top-72 ltr:-right-[120px] ltr:md:-right-[90px] rtl:-left-[120px] rtl:md:-left-[90px] -rotate-90 flex items-center gap-x-4"
          style={
            needsOldBrowserFallback
              ? {
                  // Fallback for old browsers that don't support ltr/rtl classes
                  top: "18rem", // 72 * 0.25rem = 18rem
                  right: "-7.5rem", // -120px = -7.5rem
                  transform: "rotate(-90deg)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  // RTL support for old browsers
                  left: "auto",
                }
              : undefined
          }
        >
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

        {/* Enhanced mobile menu overlay with ref */}
        <div
          ref={overlayRef}
          className={`z-[9999] fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={forceCloseMenu}
          aria-hidden="true"
          style={{
            // Fallback for old browsers
            opacity: isMenuOpen ? 1 : 0,
            pointerEvents: isMenuOpen ? "auto" : "none",
          }}
        />

        {/* Enhanced slide-out menu with ref */}
        <div
          ref={menuRef}
          className={`z-[9999] fixed top-0 bottom-0 right-0 w-4/5 max-w-xs bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            // Fallback for old browsers
            transform: isMenuOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          {/* Menu header with enhanced close button */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              ref={closeButtonRef}
              onClick={forceCloseMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
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
                  className={`block px-6 py-4 text-base transition-colors duration-200 ${
                    isActive(link.path)
                      ? "font-bold text-emerald-600 bg-emerald-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={forceCloseMenu}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Call to action button */}
          <div className="px-4 pb-4">
            {children ? children : <NavbarButton />}
          </div>
        </div>

        {/* Centered navigation */}
        <div className="hidden xl:block shrink-0 py-7 px-14 rounded-full">
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

        {/* Right - Mobile menu trigger */}
        <div className="flex-1 text-right flex items-center justify-end">
          {/* Enhanced Menu Icon */}
          <Button
            className="xl:hidden p-2 rounded-full bg-gradient-to-t from-white from-30 to-emerald-50 text-gray-700"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            onClick={toggleMenu}
          >
            <Menu size={24} />
          </Button>

          <div className="ltr:ml-8 rtl:mr-8 hidden sm:block">
            {children ? children : <NavbarButton />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
