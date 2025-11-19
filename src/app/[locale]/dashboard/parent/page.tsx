"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Rocket, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parentService } from "@/services/dashboardApi";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function ParentDashboardHome() {
  usePageMetadata();
  const t = useTranslations("dashboard.parent.homePage");

  // Children count is currently dummy data as per user request due to API error
  const childrenCount = 3;

  const { data: enrollmentsCountData } = useQuery({
    queryKey: ["parent-enrollments-count"],
    queryFn: parentService.getEnrollmentsCount,
  });

  const { data: upcomingEnrollmentsData } = useQuery({
    queryKey: ["parent-upcoming-enrollments"],
    queryFn: parentService.getUpcomingEnrollments,
  });

  const { data: currentEnrollmentsData } = useQuery({
    queryKey: ["parent-current-enrollments"],
    queryFn: parentService.getCurrentEnrollments,
  });

  // Parse data based on the provided structure
  const enrollmentsCount = enrollmentsCountData?.data?.count_of_enrollments ?? 0;

  const upcomingEnrollments = Array.isArray(upcomingEnrollmentsData?.data) ? upcomingEnrollmentsData.data : [];
  const currentEnrollments = Array.isArray(currentEnrollmentsData?.data) ? currentEnrollmentsData.data : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Children Count Card */}
        <Card className="flex flex-col items-center justify-center p-6">
          <Baby className="mb-4 h-12 w-12 text-secondary-mint-green" />
          <div className="text-4xl font-bold text-secondary-mint-green">{childrenCount}</div>
          <div className="mt-2 text-xl font-bold text-primary">{t("childrenCount")}</div>
        </Card>

        {/* Enrollments Count Card */}
        <Card className="flex flex-col items-center justify-center p-6">
          <Rocket className="mb-4 h-12 w-12 text-secondary-burgundy" />
          <div className="text-4xl font-bold text-secondary-burgundy">{enrollmentsCount}</div>
          <div className="mt-2 text-xl font-bold text-primary">{t("enrollmentsCount")}</div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Upcoming Enrollments */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">{t("upcomingEnrollments")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEnrollments.length > 0 ? (
                upcomingEnrollments.map((item: any) => (
                  <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <p className="text-base font-medium text-mid-gray">
                      {t("enrollmentStartsOn", { number: item.reservation_number, date: item.starting_date || item.enrollment_date })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">{t("noUpcomingEnrollments")}</p>
              )}
            </div>
            <div className="mt-6 text-center">
              <Button asChild variant="outline" className="w-full sm:w-auto gap-2 text-primary border-primary hover:bg-primary/5">
                <Link href="/nurseries">
                  {t("bookNow")} <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Enrollments */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">{t("currentEnrollments")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentEnrollments.length > 0 ? (
                currentEnrollments.map((item: any) => (
                  <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <p className="text-base font-medium text-primary-blue">
                      {t("enrollmentEndsOn", { number: item.reservation_number, date: item.ending_date || item.enrollment_date })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">{t("noCurrentEnrollments")}</p>
              )}
            </div>
            <div className="mt-6 text-center">
              <Button asChild variant="outline" className="w-full sm:w-auto gap-2 text-primary border-primary hover:bg-primary/5">
                <Link href="/nurseries">
                  {t("bookNow")} <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
