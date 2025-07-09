import ChildWrapper from "@/components/forms/dashboard/children/ChildWrapper";

const initialValues = {
  name: "",
  phone: "",
  email: "",
  relation: "",
  password: "",
  confirmPassword: "",
  childName: "",
  birthDate: undefined,
  fatherName: "",
  motherName: "",
  gender: undefined,
  kinship: "",
  chronicDiseases: {
    hasDiseases: "no",
    diseases: [{ name: "", medication: "", procedures: "" }],
  },
  childDescription: "",
  favoriteThings: "",
  recommendations: "",
  allergies: {
    hasAllergies: "no",
    allergies: [{ allergyTypes: "", allergyFoods: "", allergyProcedures: "" }],
  },
  authorizedPersons: [
    {
      name: "",
      idNumber: "",
    },
  ],
  comments: "",
};

export default async function AddChild() {
  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h1 className="heading-4 font-bold text-primary max-w-[39.75rem] mx-auto">
          إضافة طفل
        </h1>
      </div>

      <ChildWrapper initialValues={initialValues} mode="add" />
    </div>
  );
}
