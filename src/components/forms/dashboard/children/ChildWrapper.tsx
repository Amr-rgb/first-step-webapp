"use client";

import React from "react";
import Child from "./Child";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

const ChildWrapper = ({
  initialValues,
  mode,
  childId,
}: {
  initialValues: any;
  mode: "add" | "edit" | "show";
  childId?: string;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch child data if in show/edit mode and childId is provided
  const { data: fetchedChild, isLoading } = useQuery({
    queryKey: ["child", childId],
    queryFn: async () => {
      if (!childId) return null;
      const { parentService } = await import("@/services/dashboardApi");
      return parentService.getChild(childId);
    },
    enabled: !!childId && mode !== "add",
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const { parentService } = await import("@/services/dashboardApi");
      if (mode === "edit" && childId) {
        return parentService.updateChild(childId, data);
      } else {
        return parentService.addChild(data);
      }
    },
    onSuccess: (response) => {
      // Update caches so pages reflect changes without manual refresh
      if (childId) {
        const updatedChild = response?.child ?? response;
        queryClient.setQueryData(["child", childId], updatedChild);
        queryClient.invalidateQueries({ queryKey: ["child", childId] });

        // Update parent children list cache by replacing the edited child
        queryClient.setQueryData(["parent-children"], (oldData: any) => {
          if (!Array.isArray(oldData)) return oldData;
          return oldData.map((c) =>
            c?.id === updatedChild?.id ? { ...c, ...updatedChild } : c
          );
        });
      } else {
        // add mode: attempt to merge returned children into cache if available
        const createdChildren = response?.children;
        if (Array.isArray(createdChildren) && createdChildren.length > 0) {
          queryClient.setQueryData(["parent-children"], (oldData: any) => {
            const existing = Array.isArray(oldData) ? oldData : [];
            const byId = new Map(existing.map((c: any) => [c.id, c]));
            createdChildren.forEach((nc: any) => {
              if (nc && nc.id != null)
                byId.set(nc.id, { ...(byId.get(nc.id) || {}), ...nc });
            });
            return Array.from(byId.values());
          });
        }
      }
      queryClient.invalidateQueries({
        queryKey: ["parent-children"],
        refetchType: "active",
      });

      showToast({
        title:
          mode === "edit"
            ? "تم تحديث بيانات الطفل بنجاح!"
            : "تم إضافة الطفل بنجاح!",
        description:
          mode === "edit"
            ? "تم تحديث بيانات الطفل بنجاح!"
            : "تمت إضافة الطفل بنجاح!",
        type: "success",
        duration: 1800,
        // className:
        //   "bg-green-50 border-green-400 text-green-900 font-bold text-lg",
      });
      setTimeout(() => {
        router.replace("/dashboard/parent/children");
      }, 1500);
    },
    onError: (error: any) => {
      console.error("API error details:", error?.response?.data);
      if (error?.response?.data?.errors) {
        console.error("API validation errors:", error.response.data.errors);
        alert(JSON.stringify(error.response.data.errors, null, 2)); // Show errors in an alert for easy copy-paste
      }
      if (error?.response?.data?.errors) {
        console.error("API validation errors:", error.response.data.errors);
      }
    },
  });

  const onSubmit = (data: any) => {
    let payload = { ...data };

    // Ensure kinship is always a string (API requires string)
    if (payload.kinship == null) {
      payload.kinship = "";
    } else if (typeof payload.kinship !== "string") {
      payload.kinship = String(payload.kinship);
    }

    // Remove all disease/allergy objects if 'no' is selected
    if (payload.chronicDiseases?.hasDiseases === "no") {
      payload.chronicDiseases.diseases = [];
    }
    if (payload.allergies?.hasAllergies === "no") {
      payload.allergies.allergies = [];
    }

    // Chronic Diseases
    let disease = payload.chronicDiseases.hasDiseases === "yes";
    let disease_details;
    if (!disease) {
      disease_details = [
        { disease_name: "None", medicament: null, emergency: null },
      ];
    } else {
      disease_details = payload.chronicDiseases.diseases
        .filter((d: any) => d.name && d.medication && d.procedures)
        .map((d: any) => ({
          disease_name: d.name,
          medicament: d.medication,
          emergency: d.procedures,
        }));
    }

    // Allergies
    let allergy = payload.allergies.hasAllergies === "yes";
    let allergies = [];
    if (allergy) {
      allergies = payload.allergies.allergies
        .filter(
          (a: any) => a.allergyTypes && a.allergyFoods && a.allergyProcedures
        )
        .map((a: any) => ({
          name: a.allergyTypes,
          allergy_causes: a.allergyFoods.split(/,\s*/),
          allergy_emergency: a.allergyProcedures,
        }));
    } // If allergy is false, allergies stays as []

    // For edit mode, send flat payload matching update API; for add mode, keep original flow
    if (mode === "edit" && childId) {
      mutation.mutate({
        ...payload,
        birthDate:
          payload.birthDate instanceof Date
            ? payload.birthDate.toISOString().split("T")[0]
            : payload.birthDate,
        gender: payload.gender === "male" ? "boy" : "girl",
        chronicDiseases: {
          ...payload.chronicDiseases,
          diseases: disease_details,
          hasDiseases: disease ? "yes" : "no",
        },
        allergies: {
          ...payload.allergies,
          allergies,
          hasAllergies: allergy ? "yes" : "no",
        },
        fatherName: payload.fatherName,
        motherName: payload.motherName,
        recommendations: payload.recommendations ?? "",
        childDescription: payload.childDescription ?? "",
        favoriteThings: payload.favoriteThings ?? "",
        comments: payload.comments ?? "",
        kinship: payload.kinship ?? "",
        authorizedPersons: (payload.authorizedPersons || []).map(
          (person: any) => ({
            name: person.name,
            idNumber: person.idNumber,
            id: person.id,
          })
        ),
      });
    } else {
      // add mode
      const child = {
        child_name: payload.childName,
        birthday_date:
          payload.birthDate instanceof Date
            ? payload.birthDate.toISOString().split("T")[0]
            : payload.birthDate,
        gender: payload.gender === "male" ? "boy" : "girl",
        disease,
        disease_details,
        allergy,
        parent_name: payload.fatherName,
        mother_name: payload.motherName,
        recommendations: payload.recommendations,
        description_3_words: payload.childDescription,
        things_child_likes: payload.favoriteThings,
        notes: payload.comments,
        kinship: payload.kinship || "",
        authorized_persons: (payload.authorizedPersons || []).map(
          (person: any) => ({
            name: person.name,
            cin: person.idNumber,
          })
        ),
        allergies,
      };
      mutation.mutate({ ...payload, children: [child] });
    }
  };

  function mapFetchedChildToInitialValues(childData: any) {
    if (!childData) return initialValues;
    return {
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
      // Chronic diseases
      chronicDiseases: {
        hasDiseases: childData?.disease ? "yes" : "no",
        diseases: childData?.disease_details
          ? (typeof childData.disease_details === "string"
              ? JSON.parse(childData.disease_details)
              : childData.disease_details
            ).map((disease: any) => ({
              id: disease.id,
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
            id: allergy.id,
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
          id: person.id,
          name: person.name || "",
          idNumber: String(person.cin ?? ""),
        })) || [],
      // Comments
      comments: childData?.notes || "",
    };
  }

  // Use mapped fetched child data as initialValues if available
  const effectiveInitialValues =
    mode !== "add" && fetchedChild
      ? mapFetchedChildToInitialValues(fetchedChild)
      : initialValues;

  if (isLoading) return <div>Loading...</div>;

  return (
    <React.Fragment>
      <Child
        initialValues={effectiveInitialValues}
        mode={mode}
        onSubmit={onSubmit}
        childId={childId}
      />
    </React.Fragment>
  );
};

export default ChildWrapper;
