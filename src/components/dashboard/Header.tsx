"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Bell,
  Settings,
  Search,
  Maximize2,
  Minimize2,
  X,
  CreditCard,
  User,
  Shield,
  FileText,
  HelpCircle,
  Mail,
  LogOut,
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useDashboardSearch } from "@/hooks/use-dashboard-search";
import SearchResults from "./SearchResults";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";
import { useAuthStore } from "@/store/authStore";

type BreadcrumbItem = {
  title: string;
  url: string;
};

type RouteConfig = {
  path: string;
  titleKey: string;
  children?: RouteConfig[];
};

type HeaderProps = {
  onToggleFullscreen: () => void;
  sidebarOpen: boolean;
  secondarySidebarOpen: boolean;
};

export default function Header({
  onToggleFullscreen,
  sidebarOpen,
  secondarySidebarOpen,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("dashboard.header");
  const commonT = useTranslations("common");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const authStore = useAuthStore();

  // Dashboard search functionality
  const {
    query,
    results,
    isSearching,
    isOpen,
    recentSearches,
    handleSearchChange,
    handleSearchSubmit,
    handleClose,
    handleOpen,
  } = useDashboardSearch();

  // Menu items configuration
  const menuItems = {
    notifications: {
      icon: Bell,
      label: "الإشعارات",
      type: "toggle" as const,
      value: notificationsEnabled,
      onChange: setNotificationsEnabled,
    },
    separator1: { type: "separator" as const },
    // paymentLog: {
    //   icon: CreditCard,
    //   label: "سجل الدفع",
    //   type: "link" as const,
    //   href: "/dashboard/payment-log",
    // },
    // accountData: {
    //   icon: User,
    //   label: "تعديل بيانات الحساب",
    //   type: "link" as const,
    //   href: "/dashboard/account",
    // },
    // separator2: { type: "separator" as const },
    privacyPolicy: {
      icon: Shield,
      label: "سياسة الخصوصية",
      type: "link" as const,
      href: "/privacy-policy",
    },
    termsConditions: {
      icon: FileText,
      label: "الشروط والأحكام",
      type: "link" as const,
      href: "/terms-conditions",
    },
    faqs: {
      icon: HelpCircle,
      label: "الاسئلة الشائعة",
      type: "link" as const,
      href: "/faqs",
    },
    contactUs: {
      icon: Mail,
      label: "تواصل معنا",
      type: "link" as const,
      href: "/contact",
    },
    separator3: { type: "separator" as const },
    logout: {
      icon: LogOut,
      label: "تسجيل الخروج",
      type: "action" as const,
      variant: "destructive" as const,
      onClick: () => {
        authStore.clearAuth();
        router.push("/sign-in");
      },
    },
  };

  const handleCloseAndBlur = () => {
    handleClose();
    setTimeout(() => setSearchFocused(false), 150);
  };

  // Keyboard shortcuts for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) {
          handleOpen();
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 100);
        } else {
          handleClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleOpen, handleClose]);

  // Define all possible routes with their translations
  const routes: RouteConfig[] = [
    {
      path: "center",
      titleKey: "center",
      children: [
        { path: "", titleKey: "home" },
        { path: "branches", titleKey: "branches" },
        { path: "branches/add", titleKey: "addBranch" },
        { path: "branches/[branchId]", titleKey: "branchDetails" },
        { path: "children-files", titleKey: "childrenFiles" },
        { path: "children-files/[childId]", titleKey: "childDetails" },
        { path: "bookings", titleKey: "bookings" },
        { path: "daily-reports", titleKey: "dailyReports" },
        { path: "daily-reports/[reportId]", titleKey: "reportDetails" },
        { path: "daily-reports/send", titleKey: "sendReport" },
        { path: "site-edit", titleKey: "siteEdit" },
        { path: "ad-or-blog-request", titleKey: "adOrBlogRequest" },
        { path: "ad-or-blog-request/ad-request", titleKey: "adRequest" },
        { path: "ad-or-blog-request/blog-request", titleKey: "blogRequest" },
        { path: "notifications", titleKey: "notifications" },
        { path: "team", titleKey: "team" },
        { path: "team/add", titleKey: "addTeamMember" },
        { path: "team/[memberId]", titleKey: "teamMemberDetails" },
      ],
    },
    {
      path: "parent",
      titleKey: "parent",
      children: [
        { path: "", titleKey: "home" },
        { path: "bookings", titleKey: "bookings" },
        { path: "children", titleKey: "myChildren" },
        { path: "children/add", titleKey: "addChild" },
        { path: "children/[childId]", titleKey: "childDetails" },
        { path: "daily-reports", titleKey: "dailyReports" },
        { path: "daily-reports/[reportId]", titleKey: "reportDetails" },
      ],
    },
    {
      path: "admin",
      titleKey: "admin",
      children: [
        { path: "", titleKey: "dashboard" },
        { path: "advertisement", titleKey: "advertisements" },
        { path: "advertisement/add", titleKey: "addAdvertisement" },
        { path: "advertisement/[adId]", titleKey: "advertisementDetails" },
        { path: "advertisement/center", titleKey: "advertisementCenter" },
        { path: "blog", titleKey: "blogs" },
        { path: "blog/add", titleKey: "addBlog" },
        { path: "blog/[blogId]", titleKey: "blogDetails" },
        { path: "blog/center", titleKey: "blogCenter" },
        { path: "bookings", titleKey: "allBookings" },
        { path: "branches", titleKey: "allBranches" },
        { path: "branches/[branchId]", titleKey: "branchDetails" },
        { path: "centers", titleKey: "centers" },
        { path: "centers/[centerId]", titleKey: "centerDetails" },
        { path: "children", titleKey: "allChildren" },
        { path: "children/[childId]", titleKey: "childDetails" },
        { path: "notifications", titleKey: "notifications" },
        { path: "parents", titleKey: "parents" },
        { path: "parents/[parentId]", titleKey: "parentDetails" },
      ],
    },
  ];

  // Generate breadcrumbs based on current path
  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    const result: BreadcrumbItem[] = [];
    const segments = pathname.split("/").filter(Boolean);

    // Skip the locale segment if present
    const localeIndex = segments.findIndex(
      (s) => s === "ar" || s === "en" || s === "ku"
    );
    const pathSegments =
      localeIndex >= 0 ? segments.slice(localeIndex + 1) : segments;

    // If we're at the root dashboard, return empty array
    if (pathSegments.length <= 1) {
      return [];
    }

    // Find the matching route
    let currentRoutes = routes;
    let currentPath = "";

    for (let i = 1; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const isLast = i === pathSegments.length - 1;
      currentPath += `/${segment}`;

      // Find matching route
      const route = currentRoutes.find((r) => {
        // Handle dynamic segments
        if (r.path.startsWith("[") && r.path.endsWith("]")) {
          return true;
        }
        return r.path === segment;
      });

      if (route) {
        let title: string;

        // Try to get translation from the specific route first, then fallback to common
        try {
          title = t(`routes.${route.titleKey}`);
        } catch (e) {
          try {
            title = commonT(route.titleKey);
          } catch (e) {
            title = route.titleKey;
          }
        }

        // For dynamic segments, use the actual segment value in the title
        if (route.path.startsWith("[") && route.path.endsWith("]")) {
          title = `${title} #${segment}`;
        }

        result.push({
          title,
          url: `/${pathSegments[0]}${currentPath}`,
        });

        // Navigate to children routes if they exist
        if (route.children) {
          currentRoutes = route.children;
        } else if (!isLast) {
          // If no more children but we still have segments, add remaining segments
          const remainingPath = pathSegments.slice(i + 1).join("/");
          result.push({
            title: remainingPath,
            url: `/${pathSegments[0]}${currentPath}/${remainingPath}`,
          });
          break;
        }
      } else if (!isLast) {
        // If no matching route found but it's not the last segment, add it as is
        result.push({
          title: segment,
          url: `/${pathSegments[0]}${currentPath}`,
        });
      }
    }

    return result;
  }, [pathname, t, commonT]);

  return (
    <header className="flex items-center justify-between px-6 py-4.5">
      {/* Left: Sidebar toggle & Breadcrumbs */}
      <div className="w-fit flex items-center gap-x-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="fixed md:relative md:inset-0 left-4 top-4 rtl:left-auto rtl:right-4 flex justify-center items-center bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white/90 transition-colors rounded-lg size-8 cursor-pointer" />
        </div>

        {/* Breadcrumbs */}
        <Breadcrumb className="flex justify-center">
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="line-clamp-1" title={item.title}>
                      {item.title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.url}
                        className="line-clamp-1"
                        title={item.title}
                      >
                        {item.title}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right: Fullscreen button and other controls */}
      <div className="flex-1 flex items-center justify-end gap-6">
        {/* Center Section - Search */}
        <div
          className={clsx(
            "hidden sm:block relative w-full transition-all duration-200",
            searchFocused ? "max-w-2xl mx-auto" : "max-w-52 mx-4"
          )}
        >
          <div className="relative">
            <Input
              ref={searchInputRef}
              type="search"
              className="z-50 relative rounded-full py-1.5 px-2.5 pr-11 placeholder:text-mid-gray"
              placeholder={t("search")}
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                handleOpen();
                setSearchFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  handleClose();
                  searchInputRef.current?.blur();
                }
              }}
            />
            {query ? (
              <button
                onClick={() => {
                  handleSearchChange("");
                  searchInputRef.current?.focus();
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 size-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="size-4" />
              </button>
            ) : (
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-light-gray" />
            )}

            {/* Search Results */}
            <SearchResults
              isOpen={isOpen}
              query={query}
              results={results}
              recentSearches={recentSearches}
              isSearching={isSearching}
              onClose={handleCloseAndBlur}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
            />
          </div>
        </div>

        <Bell className="size-6 text-mid-gray cursor-pointer" />

        {/* Settings Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center hover:bg-gray-100 rounded-lg p-1 transition-colors">
              <Settings className="size-6 text-mid-gray cursor-pointer" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {Object.entries(menuItems).map(([key, item]) => {
              if (item.type === "separator") {
                return <DropdownMenuSeparator key={key} />;
              }

              if (item.type === "toggle") {
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <Switch
                      checked={item.value}
                      onCheckedChange={item.onChange}
                      className="data-[state=checked]:bg-secondary-mint-green"
                    />
                  </div>
                );
              }

              if (item.type === "link") {
                return (
                  <DropdownMenuItem key={key} asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              }

              if (item.type === "action") {
                return (
                  <DropdownMenuItem
                    key={key}
                    variant={item.variant}
                    onClick={item.onClick}
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                );
              }

              return null;
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Fullscreen toggle (only on xl screens, far right) */}
        <button
          onClick={onToggleFullscreen}
          className="hidden xl:flex justify-center items-center bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white/90 transition-colors rounded-lg size-8 cursor-pointer"
          aria-label="Toggle fullscreen mode"
        >
          {sidebarOpen || secondarySidebarOpen ? (
            <Maximize2 className="size-4" />
          ) : (
            <Minimize2 className="size-4" />
          )}
        </button>
      </div>
    </header>
  );
}
