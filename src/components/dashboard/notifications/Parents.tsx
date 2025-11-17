"use client";

import React from "react";
import { Parent, useParentsColumns } from "@/components/tables/data/parents";
import { DataTable } from "@/components/tables/DataTable";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { centerService } from "@/services/dashboardApi";
import { adminService } from "@/services/dashboardApi";
import { ReservationStatus } from "@/types";
import { useReservationStatus } from "@/components/tables/data/shared/status";
import { useHasRole } from "@/store/authStore";

interface ChildFile {
  id: number;
  child_name: string;
  parent_name: string;
  enrollments: Array<{
    id: number;
    user_id: number;
    parent_phone: string;
    parent_name: string;
    status: string;
    branch_id: number;
  }>;
}

const Parents = ({
  selected,
  setSelected,
  selectedChildMap,
  setSelectedChildMap,
}: {
  selected: Parent[];
  setSelected: React.Dispatch<React.SetStateAction<any[]>>;
  selectedChildMap: Record<number, string>;
  setSelectedChildMap: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >;
}) => {
  const t = useTranslations("dashboard.tables.parents");
  const { mapStatus } = useReservationStatus();
  const columns = useParentsColumns(selectedChildMap, setSelectedChildMap);

  const isAdmin = useHasRole("admin");

  const { data: childrenData, isLoading } = useQuery<
    ChildFile[] | { data: ChildFile[] }
  >({
    queryKey: [isAdmin ? "children" : "children-files"],
    queryFn: isAdmin
      ? adminService.getChildren
      : centerService.getChildrenFiles,
  });

  // Transform the data to match the required format
  const transformedData: Parent[] = React.useMemo(() => {
    if (!childrenData) return [];

    // Normalize the data structure
    const childrenArray = Array.isArray(childrenData)
      ? childrenData
      : childrenData.data;

    // Group children by parent
    const parentMap = new Map<number, Parent>();

    childrenArray.forEach((child: ChildFile) => {
      const enrollment = child.enrollments[0];
      if (!enrollment) return;

      const parentId = enrollment.user_id;

      if (!parentMap.has(parentId)) {
        parentMap.set(parentId, {
          id: parentId,
          parentName: enrollment.parent_name,
          phone: enrollment.parent_phone,
          childs: [],
        });
      }

      const parent = parentMap.get(parentId)!;
      parent.childs.push({
        id: child.id.toString(),
        name: child.child_name,
        reservationStatus: mapStatus(enrollment.status) as ReservationStatus,
        branch: enrollment.branch_id.toString(),
      });
    });

    return Array.from(parentMap.values());
  }, [childrenData, mapStatus]);

  return (
    <div>
      <div className="lg:p-4 space-y-1">
        <p className="heading-4 text-primary text-center">{t("title")}</p>

        <DataTable
          setSelected={setSelected}
          columns={columns}
          data={transformedData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Parents;
