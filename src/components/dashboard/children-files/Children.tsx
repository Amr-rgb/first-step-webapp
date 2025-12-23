"use client";

import { useChildrenColumns } from "@/components/tables/data/children";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Child } from "@/components/tables/data/children";
import { useTranslations } from "next-intl";
import { centerService } from "@/services/dashboardApi";
import { useQuery } from "@tanstack/react-query";

const Children = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("dashboard.children");
  const columns = useChildrenColumns();

  const { data: children = [], isLoading } = useQuery({
    queryKey: ["children"],
    queryFn: centerService.getChildrenFiles,
  });

  const flattenedChildren = useMemo((): Child[] => {
    const childrenArray = Array.isArray(children) ? children : children?.data;
    if (!Array.isArray(childrenArray)) return [];

    return childrenArray.map((child: any): Child => {
      const enrollments = Array.isArray(child?.enrollments)
        ? child.enrollments
        : [];

      // If no enrollments, show child with pending status
      if (enrollments.length === 0) {
        return {
          id: child.id,
          child_name: child.child_name,
          birthday_date: child.birthday_date,
          parent_name: child.parent_name || child.user?.name || "",
          branch_name: "",
          enrollments: [{ status: "pending" }],
        };
      }

      // Show only the most recent enrollment (first one in array)
      const latestEnrollment = enrollments[0];
      return {
        id: child.id,
        child_name: child.child_name,
        birthday_date: child.birthday_date,
        parent_name:
          latestEnrollment.parent_name ||
          child.parent_name ||
          child.user?.name ||
          "",
        branch_name: latestEnrollment.branch_name || "",
        enrollments: [{ status: latestEnrollment.status || "pending" }],
      };
    });
  }, [children]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="block relative w-full grow sm:w-auto max-w-[30.3125rem]">
          <Input
            type="text"
            className="rounded-full px-4 pl-16 rtl:pl-4 rtl:pr-16 placeholder:text-mid-gray"
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-8 rtl:left-auto rtl:right-8 top-1/2 -translate-y-1/2 size-6 text-gray" />
        </div>

        <Button size={"sm"} variant={"outline"}>
          {t("invite")}
        </Button>
      </div>

      <div className="mt-6 lg:p-4 space-y-1">
        <p className="heading-4 font-medium text-primary text-center">
          {t("title")}
        </p>

        <DataTable
          columns={columns}
          data={flattenedChildren}
          globalFilterValue={searchQuery}
          setGlobalFilterValue={setSearchQuery}
          isLoading={isLoading}
          getRowId={(row) => String(row.id)}
        />
      </div>
    </div>
  );
};

export default Children;
