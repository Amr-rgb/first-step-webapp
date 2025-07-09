"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService, parentService } from "@/services/dashboardApi";
import ChildCard from "./ChildCard";
import ChildrenSkeleton from "./ChildrenSkeleton";
import { Child } from "@/types";
import { useTranslations } from "next-intl";

interface AdminChild {
  id: number;
  child_name: string;
  birthday_date: string;
  gender: string;
  user: {
    name: string;
  };
  disease_details: Array<{
    disease_name: string;
    medicament: string;
    emergency: string;
  }>;
  allergies: Array<{
    id: number;
    name: string;
    allergy_causes: string[];
    allergy_emergency: string;
  }>;
  authorized_people: Array<{
    id: number;
    name: string;
    cin: string;
  }>;
}

type Mode = "admin" | "parent";

const Children = ({
  noEdit,
  baseUrl,
  absoluteBaseUrl,
  childrenData,
  mode = "admin",
}: {
  noEdit?: boolean;
  baseUrl?: string;
  absoluteBaseUrl?: string;
  childrenData?: { userName: string; children: AdminChild[] };
  mode?: Mode;
}) => {
  const t = useTranslations("dashboard.parent.children");
  // Admin: use childrenData or fetch admin children
  // Parent: fetch parent children
  const isAdmin = mode === "admin";

  const adminQuery = useQuery<AdminChild[]>({
    queryKey: ["children"],
    queryFn: adminService.getChildren,
    enabled: isAdmin && !childrenData,
  });

  const parentQuery = useQuery<Child[]>({
    queryKey: ["parent-children"],
    queryFn: parentService.getParentChildren,
    enabled: !isAdmin,
  });

  let childrenToRender: any[] | undefined = undefined;
  let userName: string | undefined = undefined;
  let isLoading = false;

  if (isAdmin) {
    if (childrenData) {
      childrenToRender = childrenData.children;
      userName = childrenData.userName;
    } else {
      childrenToRender = adminQuery.data;
      isLoading = adminQuery.isLoading;
    }
  } else {
    childrenToRender = parentQuery.data;
    isLoading = parentQuery.isLoading;
  }

  console.log({
    isAdmin,
    childrenToRender,
    adminData: adminQuery.data,
    parentData: parentQuery.data,
    isLoading,
  });

  if (adminQuery.error || parentQuery.error) {
    return (
      <div>
        {t("error", {
          error:
            (adminQuery.error || parentQuery.error)?.message?.toString() ||
            t("unknownError"),
        })}
      </div>
    );
  }

  if (
    childrenToRender &&
    Array.isArray(childrenToRender) &&
    childrenToRender.length === 0
  ) {
    return <div>{t("noChildren")}</div>;
  }

  if (!childrenToRender && isLoading) {
    return <ChildrenSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      {childrenToRender?.map((child) =>
        isAdmin ? (
          <ChildCard
            key={child.id}
            id={child.id}
            name={child.child_name}
            birthday={child.birthday_date}
            gender={child.gender}
            userName={userName || child.user.name}
            disease_details={child.disease_details}
            allergies={child.allergies}
            authorized_people={child.authorized_people}
            noEdit={noEdit}
            baseUrl={baseUrl}
            absoluteBaseUrl={absoluteBaseUrl}
            t={t}
          />
        ) : (
          <ChildCard
            key={child.id}
            id={child.id}
            name={child.child_name}
            birthday={child.birthday_date || ""}
            gender={child.gender}
            userName={child.parent_name || ""}
            disease_details={[]}
            allergies={
              child.allergies?.map((a: any) => ({
                id: a.id,
                name: a.name,
                allergy_causes: Array.isArray(a.allergy_causes)
                  ? a.allergy_causes
                  : a.allergy_causes
                  ? [a.allergy_causes]
                  : [],
                allergy_emergency: a.allergy_emergency,
              })) || []
            }
            authorized_people={
              child.authorized_people?.map((p: any) => ({
                id: p.id,
                name: p.name,
                cin: p.cin,
              })) || []
            }
            noEdit={noEdit}
            baseUrl={baseUrl}
            absoluteBaseUrl={absoluteBaseUrl}
            t={t}
          />
        )
      )}
    </div>
  );
};

export default Children;
