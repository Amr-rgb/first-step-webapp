import { useCallback, useEffect, useMemo } from "react";
import { useAuthUser } from "@/store/authStore";
import { useSearchStore, SearchResult } from "@/store/searchStore";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { dashboardIcons } from "@/components/general/icons";

export const useDashboardSearch = () => {
  const user = useAuthUser();
  const pathname = usePathname();
  const t = useTranslations("dashboard.search");
  const sidebarT = useTranslations("dashboard.sidebar");
  const {
    query,
    results,
    isSearching,
    isOpen,
    recentSearches,
    setQuery,
    setResults,
    setIsSearching,
    setIsOpen,
    addRecentSearch,
    clearSearch,
  } = useSearchStore();

  // Define searchable content based on user role
  const searchableContent = useMemo<SearchResult[]>(() => {
    if (!user?.role) return [];

    const baseContent: SearchResult[] = [];

    // Common content for all roles
    baseContent.push({
      id: "profile",
      title: t("profile.title"),
      description: t("profile.description"),
      url: "/dashboard/profile",
      category: t("categories.account"),
      type: "page",
      icon: "user",
    });

    // Role-specific content
    if (user.role === "admin") {
      baseContent.push(
        {
          id: "admin-dashboard",
          title: sidebarT("admin.home"),
          description: t("admin.dashboard.description"),
          url: "/dashboard/admin",
          category: t("categories.dashboard"),
          type: "page",
          icon: "home",
        },
        {
          id: "admin-centers",
          title: sidebarT("admin.centers"),
          description: t("admin.centers.description"),
          url: "/dashboard/admin/centers",
          category: t("categories.management"),
          type: "page",
          icon: "building",
        },
        {
          id: "admin-parents",
          title: sidebarT("admin.parents"),
          description: t("admin.parents.description"),
          url: "/dashboard/admin/parents",
          category: t("categories.management"),
          type: "page",
          icon: "users",
        },
        {
          id: "admin-children",
          title: t("admin.children.title"),
          description: t("admin.children.description"),
          url: "/dashboard/admin/children",
          category: t("categories.management"),
          type: "page",
          icon: "users",
        },
        {
          id: "admin-bookings",
          title: sidebarT("admin.bookings"),
          description: t("admin.bookings.description"),
          url: "/dashboard/admin/bookings",
          category: t("categories.bookings"),
          type: "page",
          icon: "calendar",
        },
        {
          id: "admin-advertisements",
          title: sidebarT("admin.advertisement"),
          description: t("admin.advertisements.description"),
          url: "/dashboard/admin/advertisement",
          category: t("categories.content"),
          type: "page",
          icon: "megaphone",
        },
        {
          id: "admin-blogs",
          title: sidebarT("admin.blog"),
          description: t("admin.blogs.description"),
          url: "/dashboard/admin/blog",
          category: t("categories.content"),
          type: "page",
          icon: "edit",
        },
        {
          id: "admin-notifications",
          title: sidebarT("admin.notifications"),
          description: t("admin.notifications.description"),
          url: "/dashboard/admin/notifications",
          category: t("categories.communication"),
          type: "page",
          icon: "bell",
        },
      );
    }

    // Center Role & Center Branch Admin
    if (
      user.role === "center" ||
      user.role === "nursery" ||
      (user.role === "branch_admin" && user.center_id)
    ) {
      baseContent.push(
        {
          id: "center-dashboard",
          title: sidebarT("center.home"),
          description: t("center.dashboard.description"),
          url: "/dashboard/center",
          category: t("categories.dashboard"),
          type: "page",
          icon: "home",
        },
        {
          id: "center-branches",
          title: sidebarT("center.branches"),
          description: t("center.branches.description"),
          url: "/dashboard/center/branches",
          category: t("categories.management"),
          type: "page",
          icon: "building",
        },
        {
          id: "center-children-files",
          title: sidebarT("center.children-files"),
          description: t("center.childrenFiles.description"),
          url: "/dashboard/center/children-files",
          category: t("categories.management"),
          type: "page",
          icon: "files",
        },
        {
          id: "center-bookings",
          title: sidebarT("center.bookings"),
          description: t("center.bookings.description"),
          url: "/dashboard/center/bookings",
          category: t("categories.bookings"),
          type: "page",
          icon: "calendar",
        },
        {
          id: "center-daily-reports",
          title: sidebarT("center.daily-reports"),
          description: t("center.dailyReports.description"),
          url: "/dashboard/center/daily-reports",
          category: t("categories.reports"),
          type: "page",
          icon: "file-text",
        },
        {
          id: "center-ad-blog-request",
          title: sidebarT("center.ad-or-blog-request"),
          description: t("center.adBlogRequest.description"),
          url: "/dashboard/center/ad-or-blog-request",
          category: t("categories.content"),
          type: "page",
          icon: "megaphone",
        },
        {
          id: "center-team",
          title: sidebarT("center.team"),
          description: t("center.team.description"),
          url: "/dashboard/center/team",
          category: t("categories.management"),
          type: "page",
          icon: "users",
        },
        {
          id: "center-notifications",
          title: sidebarT("center.notifications"),
          description: t("center.notifications.description"),
          url: "/dashboard/center/notifications",
          category: t("categories.communication"),
          type: "page",
          icon: "bell",
        },
      );
    }

    // Nursery Branch Admin (No Center ID)
    if (user.role === "branch_admin" && !user.center_id) {
      baseContent.push(
        {
          id: "nursery-dashboard",
          title: sidebarT("center.home"), // Assuming same translation key provided it works
          description: t("center.dashboard.description"),
          url: "/dashboard/nursery",
          category: t("categories.dashboard"),
          type: "page",
          icon: "home",
        },
        {
          id: "nursery-branches",
          title: sidebarT("center.branches"),
          description: t("center.branches.description"),
          url: "/dashboard/nursery/branches",
          category: t("categories.management"),
          type: "page",
          icon: "building",
        },
        {
          id: "nursery-children-files",
          title: sidebarT("center.children-files"),
          description: t("center.childrenFiles.description"),
          url: "/dashboard/nursery/children-files",
          category: t("categories.management"),
          type: "page",
          icon: "files",
        },
        {
          id: "nursery-bookings",
          title: sidebarT("center.bookings"),
          description: t("center.bookings.description"),
          url: "/dashboard/nursery/bookings",
          category: t("categories.bookings"),
          type: "page",
          icon: "calendar",
        },
        {
          id: "nursery-daily-reports",
          title: sidebarT("center.daily-reports"),
          description: t("center.dailyReports.description"),
          url: "/dashboard/nursery/daily-reports",
          category: t("categories.reports"),
          type: "page",
          icon: "file-text",
        },
        {
          id: "nursery-ad-blog-request",
          title: sidebarT("center.ad-or-blog-request"),
          description: t("center.adBlogRequest.description"),
          url: "/dashboard/nursery/ad-or-blog-request",
          category: t("categories.content"),
          type: "page",
          icon: "megaphone",
        },
        {
          id: "nursery-team",
          title: sidebarT("center.team"),
          description: t("center.team.description"),
          url: "/dashboard/nursery/team",
          category: t("categories.management"),
          type: "page",
          icon: "users",
        },
        {
          id: "nursery-notifications",
          title: sidebarT("center.notifications"),
          description: t("center.notifications.description"),
          url: "/dashboard/nursery/notifications",
          category: t("categories.communication"),
          type: "page",
          icon: "bell",
        },
      );
    }

    if (user.role === "parent") {
      baseContent.push(
        {
          id: "parent-children",
          title: sidebarT("parent.children"),
          description: t("parent.children.description"),
          url: "/dashboard/parent/children",
          category: t("categories.family"),
          type: "page",
          icon: "users",
        },
        {
          id: "parent-bookings",
          title: sidebarT("parent.bookings"),
          description: t("parent.bookings.description"),
          url: "/dashboard/parent/bookings",
          category: t("categories.bookings"),
          type: "page",
          icon: "calendar",
        },
        {
          id: "parent-daily-reports",
          title: sidebarT("parent.reports"),
          description: t("parent.dailyReports.description"),
          url: "/dashboard/parent/daily-reports",
          category: t("categories.reports"),
          type: "page",
          icon: "file-text",
        },
      );
    }

    // Add quick actions
    // baseContent.push(
    //   {
    //     id: "logout",
    //     title: t("actions.logout.title"),
    //     description: t("actions.logout.description"),
    //     url: "/logout",
    //     category: t("categories.actions"),
    //     type: "action",
    //     icon: "log-out",
    //   },
    //   {
    //     id: "home",
    //     title: t("actions.home.title"),
    //     description: t("actions.home.description"),
    //     url: "/",
    //     category: t("categories.actions"),
    //     type: "action",
    //     icon: "home",
    //   }
    // );

    return baseContent;
  }, [user?.role, t, sidebarT]);

  // Search function
  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const filtered = searchableContent.filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower)
        );
      });

      // Sort results by relevance
      const sortedResults = filtered.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const queryLower = searchQuery.toLowerCase();

        // Exact title matches first
        if (aTitle === queryLower) return -1;
        if (bTitle === queryLower) return 1;

        // Title starts with query
        if (aTitle.startsWith(queryLower) && !bTitle.startsWith(queryLower))
          return -1;
        if (bTitle.startsWith(queryLower) && !aTitle.startsWith(queryLower))
          return 1;

        // Pages before actions
        if (a.type === "page" && b.type === "action") return -1;
        if (a.type === "action" && b.type === "page") return 1;

        return 0;
      });

      setResults(sortedResults);
      setIsSearching(false);
    },
    [searchableContent, setResults, setIsSearching],
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (value.trim()) {
        search(value);
      } else {
        setResults([]);
      }
    },
    [setQuery, search, setResults],
  );

  // Handle search submit
  const handleSearchSubmit = useCallback(() => {
    if (query.trim()) {
      addRecentSearch(query);
    }
  }, [query, addRecentSearch]);

  // Close search
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => clearSearch(), 200); // Delay to allow animation
  }, [setIsOpen, clearSearch]);

  // Open search
  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  // Effect to handle search on query change
  useEffect(() => {
    if (query.trim()) {
      search(query);
    } else {
      setResults([]);
    }
  }, [query, search, setResults]);

  return {
    query,
    results,
    isSearching,
    isOpen,
    recentSearches,
    searchableContent,
    handleSearchChange,
    handleSearchSubmit,
    handleClose,
    handleOpen,
    clearSearch,
  };
};
