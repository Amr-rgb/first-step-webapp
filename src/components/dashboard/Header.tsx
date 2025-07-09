"use client";

import React, { useMemo, useState } from "react";
import { Bell, Settings, Search, Maximize2, Minimize2 } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const t = useTranslations("dashboard.header");
  const commonT = useTranslations("common");

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
        <div className="hidden sm:block relative w-full max-w-52 mx-4">
          <Input
            type="search"
            className="rounded-full py-1.5 px-2.5 pr-11 placeholder:text-mid-gray"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-light-gray" />
        </div>

        <Bell className="size-6 text-mid-gray cursor-pointer" />
        <Settings className="size-6 text-mid-gray cursor-pointer" />

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
