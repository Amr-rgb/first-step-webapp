"use client";

import Image from "next/image";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { dashboardIcons } from "@/components/general/icons";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { useAuthUser } from "@/store/authStore";
import ParentAccountsModal from "@/components/modals/ParentAccountsModal";
import { Skeleton } from "@/components/ui/skeleton";

interface NavbarItem {
  title: string;
  url: string;
  icon: (props: any) => React.JSX.Element;
  isSpecial?: boolean;
}

const getCenterNavbar = (t: any): NavbarItem[] => [
  {
    title: t("center.home"),
    url: "/dashboard/center",
    icon: dashboardIcons.home,
  },
  {
    title: t("center.branches"),
    url: "/dashboard/center/branches",
    icon: dashboardIcons.branches,
  },
  {
    title: t("center.children-files"),
    url: "/dashboard/center/children-files",
    icon: dashboardIcons.files,
  },
  {
    title: t("center.bookings"),
    url: "/dashboard/center/bookings",
    icon: dashboardIcons.bookings,
  },
  {
    title: t("center.daily-reports"),
    url: "/dashboard/center/daily-reports",
    icon: dashboardIcons.reports,
  },
  {
    title: t("center.center-data"),
    url: "/dashboard/center/center-data",
    icon: dashboardIcons.site,
  },
  {
    title: t("center.ad-or-blog-request"),
    url: "/dashboard/center/ad-or-blog-request",
    icon: dashboardIcons.request,
  },
  {
    title: t("center.notifications"),
    url: "/dashboard/center/notifications",
    icon: dashboardIcons.notifications,
  },
  {
    title: t("center.team"),
    url: "/dashboard/center/team",
    icon: dashboardIcons.team,
  },
  {
    title: t("center.chat"),
    url: "/dashboard/center/chat",
    icon: dashboardIcons.chat,
  },
];

const getParentNavbar = (t: any): NavbarItem[] => [
  {
    title: t("parent.home"),
    url: "/dashboard/parent",
    icon: dashboardIcons.home,
  },
  {
    title: t("parent.children"),
    url: "/dashboard/parent/children",
    icon: dashboardIcons.files,
  },
  {
    title: t("parent.bookings"),
    url: "/dashboard/parent/bookings",
    icon: dashboardIcons.bookings,
  },
  {
    title: t("parent.reports"),
    url: "/dashboard/parent/daily-reports",
    icon: dashboardIcons.reports,
  },
  {
    title: t("parent.chat"),
    url: "/dashboard/parent/chat",
    icon: dashboardIcons.chat,
  },
];

const getAdminNavbar = (t: any): NavbarItem[] => [
  {
    title: t("admin.home"),
    url: "/dashboard/admin",
    icon: dashboardIcons.home,
  },
  {
    title: t("admin.centers"),
    url: "/dashboard/admin/centers",
    icon: dashboardIcons.building,
  },
  {
    title: t("admin.discount-codes"),
    url: "/dashboard/admin/discount-codes",
    icon: dashboardIcons.dicount,
  },
  {
    title: t("admin.centers-subscriptions"),
    url: "/dashboard/admin/centers-subscriptions",
    icon: dashboardIcons.visa,
  },
  {
    title: t("admin.parents"),
    url: "/dashboard/admin/parents",
    icon: dashboardIcons.person,
  },
  {
    title: t("admin.bookings"),
    url: "/dashboard/admin/bookings",
    icon: dashboardIcons.bookings,
  },
  {
    title: t("admin.advertisement"),
    url: "/dashboard/admin/advertisement",
    icon: dashboardIcons.request,
  },
  {
    title: t("admin.blog"),
    url: "/dashboard/admin/blog",
    icon: dashboardIcons.blog,
  },
  {
    title: t("admin.notifications"),
    url: "/dashboard/admin/notifications",
    icon: dashboardIcons.notifications,
  },
  {
    title: t("admin.chat"),
    url: "/dashboard/admin/chat",
    icon: dashboardIcons.chat,
  },
];

const DashboardSideBar = () => {
  const pathname = usePathname();
  const { state, setOpen, toggleSidebar } = useSidebar();
  const locale = useLocale();
  const t = useTranslations("dashboard.sidebar");
  const isMobile = useIsMobile();
  const user = useAuthUser();
  const [isParentAccountsModalOpen, setIsParentAccountsModalOpen] =
    useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Auto-expand sidebar when switching from mobile to desktop
  useEffect(() => {
    if (isMobile && state === "collapsed") {
      setOpen(true);
    }
  }, [isMobile, state, setOpen]);

  let navbar = pathname.includes("/dashboard/center")
    ? getCenterNavbar(t)
    : pathname.includes("dashboard/admin")
    ? getAdminNavbar(t)
    : getParentNavbar(t);

  // Filter out specific items for branch_admin (only after hydration)
  if (isHydrated && user?.role === "branch_admin") {
    navbar = navbar.filter(
      (item) =>
        !item.url.includes("/branches") &&
        !item.url.includes("/center-data") &&
        !item.url.includes("/ad-or-blog-request")
    );
  }

  const basePathname = pathname.includes("/dashboard/center")
    ? "/dashboard/center"
    : pathname.includes("dashboard/admin")
    ? "/dashboard/admin"
    : "/dashboard/parent";

  return (
    <Sidebar
      className="h-screen py-10 transition-all duration-300 ease-in-out fixed top-0 left-0 z-40"
      side={locale === "ar" ? "right" : "left"}
      collapsible="icon"
      style={
        {
          "--sidebar-width": "250px",
          "--sidebar-collapsed-width": "80px",
          "--transition-duration": "300ms",
          "--transition-timing": "cubic-bezier(0.4, 0, 0.2, 1)",
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="mb-4 justify-center items-center">
        {user?.role === "parent" || user?.role === "branch_admin" ? (
          <Image
            className="w-20 aspect-square object-center object-cover rounded-full bg-primary-blue/20"
            src={user?.logo || "/assets/logos/logo.svg"}
            width={80}
            height={80}
            alt="Nersery Logo"
          />
        ) : null}

        {user?.role === "admin" ? (
          <Image
            className={"w-20"}
            src={"/assets/logos/logo.svg"}
            alt="logo"
            width={64.09}
            height={80}
          />
        ) : null}

        {user?.role === "center" ? (
          <>
            <div
              className={
                state === "collapsed"
                  ? "hidden"
                  : "flex items-center gap-1 font-bold"
              }
            >
              <span>{locale === "en" ? "Hello," : "،مرحبًا"}</span>
              <span>{user?.name}</span>
              <span>👋</span>
            </div>
            <div className={state === "collapsed" ? "text-2xl" : "hidden"}>
              👋
            </div>
          </>
        ) : null}
      </SidebarHeader>
      <SidebarContent className="transition-all duration-300 ease-in-out">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {!isHydrated ? (
                // Skeleton loader while hydrating
                <>
                  <SidebarMenuItem className="mb-3">
                    <Skeleton className="h-20 w-20 mx-auto rounded-full" />
                  </SidebarMenuItem>

                  {[...Array(6)].map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <div className="flex items-center space-x-2 px-4 py-2">
                        <Skeleton
                          className={cn(
                            "rounded-[.5rem]",
                            state === "collapsed" ? "size-4.5" : "size-8"
                          )}
                        />
                        {state !== "collapsed" && (
                          <Skeleton className="h-4 w-24" />
                        )}
                      </div>
                    </SidebarMenuItem>
                  ))}
                </>
              ) : (
                navbar.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    (pathname.startsWith(item.url + "/") &&
                      item.url !== basePathname);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Button
                          asChild
                          variant={isActive ? "default" : "defaultNoGradient"}
                          className="bg-transparent shadow-none"
                          onClick={isMobile ? () => toggleSidebar() : undefined}
                        >
                          <Link
                            href={item.url}
                            className={cn(
                              "flex justify-start items-center space-x-2 px-4 w-full rounded-lg transition-all duration-200 ease-in-out transform",
                              isActive
                                ? "!bg-primary !text-white !font-bold scale-[0.98] py-6.5"
                                : "bg-transparent !text-mid-gray hover:bg-gray-100/50 hover:scale-[0.99] py-6.5"
                            )}
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "rounded-[.5rem] w-fit",
                                    isActive ? "bg-white" : "",
                                    !isActive && state === "expanded"
                                      ? "blue-gradient"
                                      : "",
                                    state === "collapsed"
                                      ? "bg-transparent"
                                      : "p-2"
                                  )}
                                >
                                  <item.icon
                                    className={cn(
                                      state === "collapsed"
                                        ? "size-4.5"
                                        : "size-4",
                                      state === "collapsed" && !isActive
                                        ? "text-primary"
                                        : state === "collapsed" && isActive
                                        ? "text-white"
                                        : isActive
                                        ? "text-primary"
                                        : "text-white"
                                    )}
                                  />
                                </div>
                              </TooltipTrigger>
                              {state === "collapsed" && (
                                <TooltipContent side="right" align="center">
                                  {item.title}
                                </TooltipContent>
                              )}
                            </Tooltip>
                            {state !== "collapsed" && <span>{item.title}</span>}
                          </Link>
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter
        className={cn(
          "mt-4 justify-end items-center transition-all duration-300 ease-in-out",
          state === "collapsed" ? "my-4 px-2" : ""
        )}
      >
        {/* Parent Accounts Button - Only show for center role */}
        {user?.role === "center" && (
          <div
            className={cn(
              "w-full mb-4",
              state === "collapsed" ? "px-0" : "px-4"
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsParentAccountsModalOpen(true)}
                  className={cn(
                    "w-full transition-all duration-200",
                    state === "collapsed"
                      ? "h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                      : "border-2 border-solid border-primary bg-transparent hover:bg-primary/5 py-4 h-full"
                  )}
                  variant="outline"
                >
                  {state === "collapsed" ? (
                    <div className="flex items-center justify-center w-full">
                      <Image
                        src="/assets/illustrations/add-users.png"
                        alt="Add Users"
                        width={32}
                        height={40}
                        className="w-8 h-10 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Image
                        src="/assets/illustrations/add-users.png"
                        alt="Add Users"
                        width={30}
                        height={38}
                        className="w-10 h-16"
                      />
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium text-primary">
                          {locale === "ar"
                            ? "إنشاء حسابات أولياء الأمور"
                            : "Create Parent Accounts"}
                        </span>
                        <span className="text-xs text-gray-600">
                          {locale === "ar"
                            ? "سجل الأطفال الآن"
                            : "Register children now"}
                        </span>
                      </div>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              {state === "collapsed" && (
                <TooltipContent side="right" align="center">
                  {locale === "ar"
                    ? "إنشاء حسابات أولياء الأمور"
                    : "Create Parent Accounts"}
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        )}

        <Link href="/" className={state === "collapsed" ? "w-full h-full" : ""}>
          <Image
            className={cn(
              "w-8",
              state === "collapsed"
                ? "opacity-100 duration-1000 ease-in"
                : "opacity-0 h-0"
            )}
            src={"/assets/logos/logo.svg"}
            alt="logo"
            width={64.09}
            height={80}
          />
          <Image
            className={cn(
              state === "expanded" ? "opacity-100 duration-500" : "opacity-0"
            )}
            src={"/assets/logos/complete_logo.svg"}
            alt="logo"
            width={157.6}
            height={40}
          />
        </Link>
      </SidebarFooter>

      {/* Parent Accounts Modal */}
      <ParentAccountsModal
        isOpen={isParentAccountsModalOpen}
        onClose={() => setIsParentAccountsModalOpen(false)}
      />
    </Sidebar>
  );
};

export default DashboardSideBar;
