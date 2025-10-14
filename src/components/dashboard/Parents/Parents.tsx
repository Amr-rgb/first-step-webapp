"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/dashboardApi";
import ParentCard from "./ParentCard";
import EmptyState from "@/components/common/EmptyState";
import { useTranslations } from "next-intl";

interface Child {
  id: number;
  child_name: string;
}

interface Parent {
  id: number;
  name: string;
  email: string;
  phone: string;
  national_number: string;
  children_count: number;
  children: Child[];
}

interface ParentsResponse {
  parents: Parent[];
}

const Parents = () => {
  const t = useTranslations("dashboard.emptyStates");
  const { data, isLoading } = useQuery<ParentsResponse>({
    queryKey: ["parents"],
    queryFn: adminService.getParents,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show empty state if no parents
  if (!data?.parents || data.parents.length === 0) {
    return (
      <EmptyState
        icon="👨‍👩‍👧‍👦"
        size="lg"
        translationKey="dashboard.emptyStates.parents"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.parents.map((parent) => (
        <ParentCard
          key={parent.id}
          id={parent.id}
          name={parent.name}
          email={parent.email}
          phone={parent.phone}
          national_number={parent.national_number}
          childrenCount={parent.children_count}
          children={parent.children}
        />
      ))}
    </div>
  );
};

export default Parents;
