"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/dashboardApi";
import ChildShow from "@/components/forms/dashboard/children/ChildShow";

export default function ChildDetailsPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => adminService.getChild(childId),
    enabled: !!childId,
  });

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error)
    return <div className="text-red-500">حدث خطأ أثناء جلب البيانات</div>;
  if (!data) return null;

  // Map API response to ChildShow's expected initialValues
  const initialValues = {
    name: data.user?.name || "",
    phone: data.user?.phone || "",
    email: data.user?.email || "",
    kinship: data.kinship || "",
    childName: data.child_name,
    birthDate: new Date(data.birthday_date),
    fatherName: data.parent_name,
    motherName: data.mother_name,
    gender: data.gender === "girl" ? "female" : "male",
    chronicDiseases: {
      hasDiseases: data.disease ? "yes" : "no",
      diseases: data.disease_details || [],
    },
    childDescription: data.description_3_words || "",
    favoriteThings: data.things_child_likes || "",
    recommendations: data.recommendations || "",
    allergies: {
      hasAllergies: data.allergy ? "yes" : "no",
      allergies: (data.allergies || []).map((a: any) => ({
        allergyTypes: a.name,
        allergyFoods: (a.allergy_causes || []).join(", "),
        allergyProcedures: a.allergy_emergency,
      })),
    },
    authorizedPersons: (data.authorized_people || []).map((p: any) => ({
      name: p.name,
      idNumber: p.cin,
    })),
    comments: data.notes || "",
  };

  return (
    <div>
      <ChildShow
        initialValues={initialValues}
        mode="show"
        noEdit
        childId={childId}
      />
    </div>
  );
}
