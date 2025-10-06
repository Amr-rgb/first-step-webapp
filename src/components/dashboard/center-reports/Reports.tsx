"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  Report,
  useCenterReportsColumns,
} from "@/components/tables/data/center-reports";
import { DataTable } from "@/components/tables/DataTable";
import { centerService } from "@/services/dashboardApi";
import EmptyState from "@/components/common/EmptyState";

interface DailyReport {
  id: number;
  created_at: string;
  pdf_url: string;
  child: {
    id: number;
    name: string;
    user: {
      id: number;
      name: string;
      phone: string;
    };
  };
}

interface SelectedChild {
  reportId: string;
  reportDate: string;
  reportDownloadLink: string;
}

const Reports = () => {
  const [selectedChildMap, setSelectedChildMap] = useState<
    Record<number, SelectedChild>
  >({});
  const t = useTranslations("dashboard.tables.center-reports");

  const { data: reportsData, isLoading } = useQuery<{
    data: DailyReport[];
  }>({
    queryKey: ["daily-reports"],
    queryFn: centerService.getDailyReports,
  });

  // Create a map of child IDs to their latest report IDs and dates
  const reportIdMap = React.useMemo(() => {
    if (!reportsData?.data) return {};

    const map: Record<
      string,
      { reportId: number; reportDate: string; reportDownloadLink: string }
    > = {};
    reportsData.data.forEach((report) => {
      const childId = report.child.id.toString();
      const reportDate = report.created_at.split(" ")[0];
      const reportDownloadLink = report.pdf_url;

      if (
        !map[childId] ||
        new Date(reportDate) > new Date(map[childId].reportDate)
      ) {
        map[childId] = {
          reportId: report.id,
          reportDate,
          reportDownloadLink,
        };
      }
    });
    return map;
  }, [reportsData]);

  const columns = useCenterReportsColumns(
    selectedChildMap,
    setSelectedChildMap,
    reportIdMap
  );

  // Transform the data to match the required format
  const transformedData: Report[] = React.useMemo(() => {
    if (!reportsData?.data) return [];

    // Group reports by parent
    const parentMap = new Map<number, Report>();

    reportsData.data.forEach((report) => {
      const parentId = report.child.user.id;
      const parentName = report.child.user.name;
      const parentPhone = report.child.user.phone;
      const childId = report.child.id.toString();
      const childName = report.child.name;
      const reportDate = report.created_at.split(" ")[0];

      if (!parentMap.has(parentId)) {
        parentMap.set(parentId, {
          id: parentId,
          parentName,
          phone: parentPhone,
          childs: [],
          reportDate,
        });
      }

      const parentReport = parentMap.get(parentId)!;

      // Add child if not already present
      if (!parentReport.childs.some((child) => child.id === childId)) {
        parentReport.childs.push({
          id: childId,
          name: childName,
        });
      }

      // Update report date if this report is more recent
      if (new Date(reportDate) > new Date(parentReport.reportDate)) {
        parentReport.reportDate = reportDate;
      }
    });

    return Array.from(parentMap.values());
  }, [reportsData]);

  // Show empty state if no reports
  if (!isLoading && transformedData.length === 0) {
    return (
      <EmptyState
        icon="📊"
        size="lg"
        translationKey="dashboard.emptyStates.reports"
      />
    );
  }

  return (
    <div>
      <div className="mt-6 lg:p-4 space-y-1">
        <p className="heading-4 font-medium text-primary text-center">
          {t("title")}
        </p>

        <DataTable
          columns={columns}
          data={transformedData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Reports;
