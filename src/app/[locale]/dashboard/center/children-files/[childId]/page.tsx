"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import ChildShow from "@/components/forms/dashboard/children/ChildShow";
import { parentService } from "@/services/dashboardApi";
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
    queryFn: () => parentService.getChild(childId as string),
  });

  // Transform the API data to match the form structure
  const initialValues = {
    // Parent Information (direct mapping to match ParentPart component)
    name: childData?.parent_name || "",
    email: childData?.user?.email || "",
    phone: childData?.user?.phone || "",
    kinship: childData?.kinship || "",

    // Child Information
    childName: childData?.child_name || "",
    birthDate: childData?.birthday_date || "",
    gender: childData?.gender || "",
    centerName: childData?.center_name || "",
    branchName: childData?.branch_name || "",
    parentName: childData?.parent_name || "",
    motherName: childData?.mother_name || "",
    recommendations: childData?.recommendations || "",
    notes: childData?.notes || "",
    thingsChildLikes: childData?.things_child_likes || "",
    description3Words: childData?.description_3_words || "",

    // Authorized People
    authorizedPeople:
      childData?.authorized_people?.map((person: any) => ({
        name: person.name || "",
        cin: person.cin || "",
      })) || [],

    // Chronic Diseases
    chronicDiseases: {
      hasDiseases: childData?.disease ? "yes" : "no",
      diseases:
        childData?.disease_details?.map((disease: any) => ({
          name: disease.disease_name || "",
          medication: disease.medicament || "",
          procedures: disease.emergency || "",
        })) || [],
    },

    // Allergies
    allergies: {
      hasAllergies: childData?.allergy ? "yes" : "no",
      allergies:
        childData?.allergies?.map((allergy: any) => ({
          allergyTypes: allergy.name || "",
          allergyFoods: allergy.allergy_causes?.join(", ") || "",
          allergyProcedures: allergy.allergy_emergency || "",
        })) || [],
    },
  };

  // Debug logging
  console.log("Raw API Response:", childData);
  console.log("User object from API:", childData?.user);
  console.log("Transformed initialValues:", initialValues);
  console.log("Parent fields:", {
    name: initialValues.name,
    email: initialValues.email,
    phone: initialValues.phone,
    kinship: initialValues.kinship,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Child Information</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-semibold">{initialValues.childName}</p>
          </div>
          <div>
            <p className="text-gray-600">Birth Date</p>
            <p className="font-semibold">{initialValues.birthDate}</p>
          </div>
          <div>
            <p className="text-gray-600">Gender</p>
            <p className="font-semibold">{initialValues.gender}</p>
          </div>
          <div>
            <p className="text-gray-600">Center</p>
            <p className="font-semibold">{initialValues.centerName}</p>
          </div>
          <div>
            <p className="text-gray-600">Branch</p>
            <p className="font-semibold">{initialValues.branchName}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Parent Information</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-semibold">{initialValues.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">{initialValues.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone</p>
            <p className="font-semibold">{initialValues.phone}</p>
          </div>
          <div>
            <p className="text-gray-600">Kinship</p>
            <p className="font-semibold">{initialValues.kinship}</p>
          </div>
        </div>
      </div>

      <ChildShow initialValues={initialValues} mode="show" />
    </div>
  );
}
