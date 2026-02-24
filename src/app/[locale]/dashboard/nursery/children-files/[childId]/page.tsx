"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import ChildShow from "@/components/forms/dashboard/children/ChildShow";
import { centerService } from "@/services/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

const ChildShowSkeleton = () => {
  return (
    <div className="w-full space-y-6">
      {/* Parent Section */}
      <div className="w-full flex flex-col gap-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:p-4 xl:grid-cols-2 gap-y-4 gap-x-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Child Section */}
      <div className="w-full flex flex-col gap-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:p-4 xl:grid-cols-2 gap-y-4 gap-x-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Diseases Section */}
      <div className="w-full flex flex-col gap-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-1 lg:p-4 xl:grid-cols-2 gap-y-4 gap-x-10">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Allergies Section */}
      <div className="w-full flex flex-col gap-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-1 lg:p-4 xl:grid-cols-2 gap-y-4 gap-x-10">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="w-full flex flex-col gap-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:p-4 xl:grid-cols-2 gap-y-4 gap-x-10">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Authorization Section */}
      <div className="w-full flex flex-col gap-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-1 lg:p-4 xl:grid-cols-2 gap-y-4 gap-x-10"
            >
              {Array.from({ length: 2 }).map((_, subIndex) => (
                <div key={subIndex} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-5 lg:gap-x-10">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
};

export default function DashboardChildShow({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const meta = usePageMetadata();

  const { childId } = use(params);

  const { data: childData, isLoading } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => centerService.getChild(childId as string),
  });

  // Transform the API data to match the form structure
  const initialValues = {
    // Parent data
    name: childData?.user?.name || "",
    phone: childData?.user?.phone || "",
    email: childData?.user?.email || "",
    address: childData?.user?.address || "",
    centerName: childData?.center_name || "",
    branchName: childData?.branch_name || "",

    // Child data
    childName: childData?.child_name || "",
    birthDate: childData?.birthday_date
      ? new Date(childData.birthday_date)
      : new Date(),
    fatherName: childData?.parent_name || "",
    motherName: childData?.mother_name || "",
    gender: childData?.gender === "boy" ? "male" : "female",
    kinship: childData?.kinship || "",

    // Chronic diseases
    chronicDiseases: {
      hasDiseases: childData?.disease ? "yes" : "no",
      diseases: childData?.disease_details
        ? (typeof childData.disease_details === "string"
            ? JSON.parse(childData.disease_details)
            : childData.disease_details
          ).map((disease: any) => ({
            id: disease.id, // Preserve the ID
            name: disease.disease_name,
            medication: disease.medicament,
            procedures: disease.emergency,
          }))
        : [],
    },

    // Allergies
    allergies: {
      hasAllergies: childData?.allergy ? "yes" : "no",
      allergies:
        childData?.allergies?.map((allergy: any) => ({
          id: allergy.id, // Preserve the ID
          allergyTypes: allergy.name || "",
          allergyFoods: Array.isArray(allergy.allergy_causes)
            ? allergy.allergy_causes.join(", ")
            : allergy.allergy_causes || "",
          allergyProcedures: allergy.allergy_emergency || "",
        })) || [],
    },

    // Recommendations
    childDescription: childData?.description_3_words || "",
    favoriteThings: childData?.things_child_likes || "",
    recommendations: childData?.recommendations || "",

    // Authorized persons
    authorizedPersons:
      childData?.authorized_people?.map((person: any) => ({
        id: person.id, // Preserve the ID
        name: person.name || "",
        idNumber: person.cin || "",
      })) || [],

    // Comments
    comments: childData?.notes || "",
  };

  if (isLoading) {
    return <ChildShowSkeleton />;
  }

  return (
    <div className="container mx-auto p-6">
      <ChildShow initialValues={initialValues} mode="show" />
    </div>
  );
}
