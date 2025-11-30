"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import ChildWrapper from "@/components/forms/dashboard/children/ChildWrapper";
import { parentService } from "@/services/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

const EditChildSkeleton = () => {
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
    </div>
  );
};

export default function EditChild({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const meta = usePageMetadata();

  const { childId } = use(params);

  const { data: childData, isLoading } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => parentService.getChild(childId),
  });

  if (isLoading) {
    return (
      <div>
        <div className="mb-3.5 flex items-center justify-between">
          <h1 className="heading-4 font-bold text-primary max-w-[39.75rem] mx-auto">
            تعديل بيانات الطفل
          </h1>
        </div>
        <EditChildSkeleton />
      </div>
    );
  }

  // Transform the API data to match the form structure
  const initialValues = {
    // Parent data
    name: childData?.user?.name || "",
    phone: childData?.user?.phone || "",
    email: childData?.user?.email || "",
    address: childData?.user?.address || "",

    // Child data
    childName: childData?.child_name || "",
    birthDate: childData?.birthday_date
      ? new Date(childData.birthday_date)
      : new Date(),
    fatherName: childData?.parent_name || "",
    motherName: childData?.mother_name || "",
    gender: childData?.gender === "boy" ? "male" : "female",
    kinship: childData?.kinship || "",
    childNationalNumber: childData?.national_number || "",
    childImage: childData?.image || null,
    qrCode: childData?.qr_code || null,

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

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h1 className="heading-4 font-bold text-primary max-w-[39.75rem] mx-auto">
          تعديل بيانات الطفل
        </h1>
      </div>

      <ChildWrapper
        initialValues={initialValues}
        mode="edit"
        childId={childId}
      />
    </div>
  );
}
