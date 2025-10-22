import { toastError } from "@/lib/toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddChildFormData, createAddChildSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { Control, FormProvider, useForm } from "react-hook-form";
import Image from "next/image";
import DatePicker from "@/components/general/DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { Allergy, ChronicDisease } from "@/types";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RadioGroup } from "@/components/general/RadioGroup";
import { Plus, Minus } from "lucide-react";

const Child = ({
  initialValues,
  mode,
  onSubmit,
  childId,
}: {
  initialValues: any;
  mode: "add" | "edit" | "show";
  onSubmit: (data: AddChildFormData) => void;
  childId?: string;
}) => {
  const locale = useLocale();
  const router = useRouter();

  // Create a custom schema that handles image validation based on mode
  const addChildSchema = React.useMemo(() => {
    const baseSchema = createAddChildSchema(locale as "ar" | "en");

    if (mode === "edit") {
      // For edit mode, create a custom image validation
      return baseSchema.extend({
        childImage: z
          .union([
            z.instanceof(File), // New file upload
            z.string().min(1), // Existing image URL
            z.null(), // No image
          ])
          .optional(),
      });
    }

    return baseSchema;
  }, [locale, mode]);

  const readOnly = mode === "show";

  const buttons = (mode: string) => {
    if (mode === "add") {
      return (
        <>
          <Button size={"sm"} type="submit">
            إضافة الطفل
          </Button>
          <Button size={"sm"} variant={"outline"} onClick={() => router.back()}>
            إلغاء
          </Button>
        </>
      );
    } else if (mode === "edit") {
      return (
        <>
          <Button size={"sm"} type="submit">
            تعديل ملف الطفل
          </Button>
          <Button size={"sm"} variant={"outline"} onClick={() => router.back()}>
            إلغاء
          </Button>
        </>
      );
    } else
      return (
        <>
          <Button asChild size={"sm"}>
            <Link href={`${childId}/edit`}>تعديل ملف الطفل</Link>
          </Button>
          {/* <Button
              size={"sm"}
              variant={"outline"}
              className="!border-destructive text-destructive"
            >
              حذف الفرع
            </Button> */}
        </>
      );
  };

  const methods = useForm<any>({
    resolver: zodResolver(addChildSchema),
    defaultValues: {
      ...initialValues,
    },
    mode: "onChange",
  });

  // No need to track form reset state since we only reset in add mode

  // Reset form when initialValues change (only for add mode)
  React.useEffect(() => {
    console.log("=== FORM RESET EFFECT TRIGGERED ===");
    console.log("initialValues:", initialValues);
    console.log("mode:", mode);
    console.log("isDirty:", methods.formState.isDirty);

    if (initialValues && mode === "add") {
      // Always reset in add mode
      console.log("=== ADD MODE FORM RESET ===");
      console.log("Resetting form for add mode:", initialValues);
      methods.reset(initialValues);
    } else if (mode === "edit") {
      // NEVER reset form in edit mode - preserve all user changes
      console.log("=== EDIT MODE - NO FORM RESET ===");
      console.log("Edit mode: Form reset disabled to preserve user changes");
      console.log("Current form values:", methods.getValues());
    }
    console.log("=== END FORM RESET EFFECT ===");
  }, [initialValues, methods, mode]);

  // No need to reset flags since we don't track them anymore

  // Debug: Log form errors whenever they change
  React.useEffect(() => {
    if (Object.keys(methods.formState.errors).length > 0) {
      console.log("Form validation errors:", methods.formState.errors);
    }
  }, [methods.formState.errors]);

  // Debug: Track form values changes
  React.useEffect(() => {
    console.log("=== FORM VALUES CHANGED ===");
    console.log("Form values:", methods.getValues());
    console.log("Allergies:", methods.getValues("allergies"));
    console.log("Chronic diseases:", methods.getValues("chronicDiseases"));
    console.log("isDirty:", methods.formState.isDirty);
    console.log("=== END FORM VALUES CHANGED ===");
  }, [methods.formState.isDirty, methods.formState.isValidating]);

  // COMMENTED OUT: No longer needed since we don't reset form in edit mode
  // All the debugging and user interaction tracking has been removed

  // --- Add useFieldArray for diseases and allergies ---
  const { control, watch } = methods;
  const {
    fields: diseases,
    append: appendDisease,
    remove: removeDisease,
  } = useFieldArray({
    control,
    name: "chronicDiseases.diseases",
  });
  const {
    fields: allergies,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control,
    name: "allergies.allergies",
  });
  // ---
  const hasDiseases = watch("chronicDiseases.hasDiseases");
  const hasAllergies = watch("allergies.hasAllergies");
  const authorizedPersons = methods.watch("authorizedPersons");

  // In edit/show modes, ensure idNumber fields are strings to satisfy validation/UI
  React.useEffect(() => {
    if (mode !== "add") {
      const current = methods.getValues("authorizedPersons") || [];
      const normalized = current.map((p: any) => ({
        ...p,
        idNumber: p?.idNumber != null ? String(p.idNumber) : "",
      }));
      methods.reset({ ...methods.getValues(), authorizedPersons: normalized });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <FormProvider {...methods}>
      <form
        className="w-full space-y-6"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {/* <ParentPart
          control={methods.control}
          locale={locale}
          readOnly={readOnly}
        /> */}

        <ChildPart
          control={methods.control}
          locale={locale}
          readOnly={readOnly}
        />
        {/* --- Chronic Diseases Section --- */}
        <div className="w-full flex flex-col gap-y-4">
          <h2 className="heading-4 font-medium text-primary">
            الأمراض المزمنة
          </h2>
          <FormField
            control={control}
            name="chronicDiseases.hasDiseases"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    className="gap-14.5"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // Automatically add one empty disease when "yes" is selected
                      if (value === "yes" && diseases.length === 0) {
                        appendDisease({
                          name: "",
                          medication: "",
                          procedures: "",
                        });
                      }
                    }}
                    options={[
                      { value: "yes", label: "نعم" },
                      { value: "no", label: "لا" },
                    ]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {hasDiseases === "yes" &&
            diseases.map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:p-6"
              >
                <FormField
                  control={control}
                  name={`chronicDiseases.diseases.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <Label>
                        <span className="text-base">اسم المرض</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <Input
                          placeholder="اسم المرض"
                          {...field}
                          value={field.value?.toString() || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`chronicDiseases.diseases.${index}.medication`}
                  render={({ field }) => (
                    <FormItem>
                      <Label>
                        <span className="text-base">الدواء</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <Input
                          placeholder="الدواء"
                          {...field}
                          value={field.value?.toString() || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`chronicDiseases.diseases.${index}.procedures`}
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <Label>
                        <span className="text-base">إجراءات الطوارئ</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <Input
                          placeholder="إجراءات الطوارئ"
                          {...field}
                          value={field.value?.toString() || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 col-span-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeDisease(index)}
                    className="font-bold aspect-square"
                  >
                    <Minus className="size-6" size={24} />
                  </Button>
                </div>
              </div>
            ))}
          {hasDiseases === "yes" && (
            <div className="flex justify-center lg:p-6">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  appendDisease({
                    name: "",
                    medication: "",
                    procedures: "",
                  })
                }
                className="font-bold"
                disabled={readOnly}
              >
                <Plus className="size-6" size={24} /> إضافة مرض آخر
              </Button>
            </div>
          )}
        </div>
        {/* --- Allergies Section --- */}
        <div className="w-full flex flex-col gap-y-4">
          <h2 className="heading-4 font-medium text-primary">الحساسية</h2>
          <FormField
            control={control}
            name="allergies.hasAllergies"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    className="gap-14.5"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // Automatically add one empty allergy when "yes" is selected
                      if (value === "yes" && allergies.length === 0) {
                        appendAllergy({
                          allergyTypes: "",
                          allergyFoods: "",
                          allergyProcedures: "",
                        });
                      }
                    }}
                    options={[
                      { value: "yes", label: "نعم" },
                      { value: "no", label: "لا" },
                    ]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {hasAllergies === "yes" &&
            allergies.map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:p-6"
              >
                <FormField
                  control={control}
                  name={`allergies.allergies.${index}.allergyTypes`}
                  render={({ field }) => (
                    <FormItem>
                      <Label>
                        <span className="text-base">نوع الحساسية</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <Input placeholder="نوع الحساسية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`allergies.allergies.${index}.allergyFoods`}
                  render={({ field }) => (
                    <FormItem>
                      <Label>
                        <span className="text-base">مسببات الحساسية</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <Input placeholder="مسببات الحساسية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`allergies.allergies.${index}.allergyProcedures`}
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <Label>
                        <span className="text-base">إجراءات الطوارئ</span>
                        <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <Input placeholder="إجراءات الطوارئ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 col-span-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeAllergy(index)}
                    className="font-bold aspect-square"
                  >
                    <Minus className="size-6" size={24} />
                  </Button>
                </div>
              </div>
            ))}
          {hasAllergies === "yes" && (
            <div className="flex justify-center lg:p-6">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  appendAllergy({
                    allergyTypes: "",
                    allergyFoods: "",
                    allergyProcedures: "",
                  })
                }
                className="font-bold"
                disabled={readOnly}
              >
                <Plus className="size-6" size={24} /> إضافة حساسية أخرى
              </Button>
            </div>
          )}
        </div>

        <Recommendations
          control={methods.control}
          locale={locale}
          readOnly={readOnly}
        />

        <AuthorizationPart
          control={methods.control}
          locale={locale}
          authorizedPersons={authorizedPersons}
          readOnly={readOnly}
        />

        <div className="flex justify-center gap-5 lg:gap-x-10">
          {buttons(mode)}
        </div>
      </form>
    </FormProvider>
  );
};

export default Child;

// const ParentPart = ({
//   control,
//   locale,
//   readOnly,
// }: {
//   control: Control<AddChildFormData>;
//   locale: string;
//   readOnly: boolean;
// }) => {
//   const t = useTranslations("auth.parent-signup.form");

//   return (
//     <div className="w-full flex flex-col gap-y-4">
//       <h2 className="heading-4 font-medium text-primary">بيانات ولي الأمر</h2>

//       <div className="grid grid-cols-1 lg:p-4 xl:grid-cols-2 gap-y-4 gap-x-10">
//         <FormField
//           control={control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <Label>
//                 <span className="text-base">{t("name.label")}</span>
//                 <span className="text-red-500">*</span>
//               </Label>
//               <FormControl>
//                 <Input
//                   type="text"
//                   placeholder={t("name.placeholder")}
//                   {...field}
//                   disabled={readOnly}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={control}
//           name="phone"
//           render={({ field }) => (
//             <FormItem>
//               <Label>
//                 <span className="text-base">{t("phone.label")}</span>
//                 <span className="text-red-500">*</span>
//               </Label>
//               <FormControl>
//                 <PhoneInput
//                   {...field}
//                   value={field.value?.replace(/^\+966/, "")}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     field.onChange(
//                       `+966${e.target.value.replace(/^(\+966)?/, "")}`
//                     );
//                   }}
//                   locale={locale}
//                   readOnly={readOnly}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={control}
//           name="relation"
//           render={({ field }) => (
//             <FormItem>
//               <Label>
//                 <span className="text-base">{t("relation.label")}</span>
//                 <span className="text-red-500">*</span>
//               </Label>
//               <FormControl>
//                 <Input
//                   type="text"
//                   placeholder={t("name.placeholder")}
//                   {...field}
//                   disabled={readOnly}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <Label>
//                 <span className="text-base">{t("email.label")}</span>
//                 <span className="text-red-500">*</span>
//               </Label>
//               <FormControl>
//                 <Input
//                   type="email"
//                   placeholder={t("name.placeholder")}
//                   {...field}
//                   disabled={readOnly}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>
//     </div>
//   );
// };

const ChildPart = ({
  control,
  locale,
  readOnly,
}: {
  control: Control<AddChildFormData>;
  locale: string;
  readOnly: boolean;
}) => {
  const t = useTranslations("auth.add-child.1.form");

  return (
    <div className="w-full flex flex-col gap-y-4">
      <h2 className="heading-4 font-medium text-primary">بيانات الطفل</h2>

      <div className="grid grid-cols-1 lg:p-4 xl:grid-cols-2 gap-y-4 gap-x-10">
        <FormField
          control={control}
          name="childName"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">{t("name.label")}</span>
                <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  placeholder={t("name.placeholder")}
                  {...field}
                  disabled={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">{t("date-of-birth.label")}</span>
                <span className="text-red-500">*</span>
              </Label>
              {!readOnly ? (
                <DatePicker value={field.value} onChange={field.onChange} />
              ) : (
                <Input
                  placeholder={t("name.placeholder")}
                  {...field}
                  value={field.value.toLocaleDateString()}
                  disabled={readOnly}
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="fatherName"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">{t("father-name.label")}</span>
                <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  placeholder={t("father-name.placeholder")}
                  {...field}
                  disabled={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="motherName"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">{t("mother-name.label")}</span>
                <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  placeholder={t("mother-name.placeholder")}
                  {...field}
                  disabled={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kinship Field */}
        <FormField
          control={control}
          name="kinship"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">صلة القرابة</span>
              </Label>
              <FormControl>
                <Input
                  placeholder="مثال: الأم، الأب، الأخ، الأخت..."
                  {...field}
                  disabled={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="childNationalNumber"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">الرقم الوطني للطفل</span>
              </Label>
              <FormControl>
                <Input
                  placeholder="الرقم الوطني للطفل"
                  {...field}
                  disabled={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="childImage"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">صورة الطفل</span>
              </Label>
              <FormControl>
                <div className="relative">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
                    {field.value ? (
                      <div className="space-y-4">
                        <div className="relative inline-block">
                          <img
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt="Child preview"
                            className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-white shadow-lg"
                          />
                          {!readOnly && (
                            <button
                              type="button"
                              onClick={() => field.onChange(null)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {field.value instanceof File
                            ? field.value.name
                            : "صورة الطفل"}
                        </p>
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() =>
                              document
                                .getElementById("child-image-upload")
                                ?.click()
                            }
                            className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                          >
                            تغيير الصورة
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            اضغط لرفع صورة الطفل
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG حتى 5MB
                          </p>
                        </div>
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() =>
                              document
                                .getElementById("child-image-upload")
                                ?.click()
                            }
                            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                          >
                            اختيار صورة
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <input
                    id="child-image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validate file size (5MB limit)
                        if (file.size > 5 * 1024 * 1024) {
                          toastError(
                            "خطأ في حجم الملف",
                            "حجم الملف يجب أن يكون أقل من 5MB"
                          );
                          return;
                        }
                        // Validate file type
                        if (
                          !["image/png", "image/jpeg", "image/jpg"].includes(
                            file.type
                          )
                        ) {
                          toastError(
                            "نوع الملف غير مدعوم",
                            "يرجى اختيار صورة PNG أو JPG"
                          );
                          return;
                        }
                        field.onChange(file);
                      }
                    }}
                    className="hidden"
                    disabled={readOnly}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <p className="form-label-sm mb-4 text-left rtl:text-right">
            جنس الطفل
          </p>
          <div className="flex justify-start gap-8">
            <FormField
              control={control}
              name="gender"
              render={({ field }) => (
                <>
                  <div className="group flex flex-col items-center">
                    <label
                      className={`cursor-pointer p-4 px-5.5 border rounded-2xl hover:border-secondary-mint-green duration-300 ${
                        field.value === "male"
                          ? "border-secondary-mint-green"
                          : "border-light-gray"
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only peer"
                        value="male"
                        checked={field.value === "male"}
                        onChange={() => field.onChange("male")}
                        disabled={readOnly}
                      />
                      <div className="group relative transition-all duration-300 peer-checked:saturate-100 group-hover:saturate-100 saturate-0">
                        <Image
                          src="/assets/illustrations/boy.png"
                          alt="Boy"
                          width={91.32}
                          height={120}
                          className="group-hover:scale-110 duration-300"
                        />
                      </div>
                      <p className="text-xl font-medium text-center mt-2 text-mid-gray peer-checked:text-primary hover:text-primary duration-300">
                        {t("gender.male")}
                      </p>
                    </label>
                  </div>

                  <div className="group flex flex-col items-center">
                    <label
                      className={`cursor-pointer p-4 px-6.5 border rounded-2xl hover:border-secondary-burgundy duration-300 ${
                        field.value === "female"
                          ? "border-secondary-burgundy"
                          : "border-light-gray"
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only peer"
                        value="female"
                        checked={field.value === "female"}
                        onChange={() => field.onChange("female")}
                        disabled={readOnly}
                      />
                      <div className="group relative transition-all duration-300 peer-checked:saturate-100 group-hover:saturate-100 saturate-0">
                        <Image
                          src="/assets/illustrations/girl.png"
                          alt="Girl"
                          width={84.74}
                          height={120}
                          className="group-hover:scale-110 duration-300"
                        />
                      </div>
                      <p className="text-xl font-medium text-center mt-2 text-mid-gray peer-checked:text-primary hover:text-primary duration-300">
                        {t("gender.female")}
                      </p>
                    </label>
                  </div>
                  <FormMessage />
                </>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DiseasesPart = ({
  control,
  locale,
  hasDiseases,
  diseases,
  readOnly,
}: {
  control: Control<AddChildFormData>;
  locale: string;
  hasDiseases: "yes" | "no";
  diseases: ChronicDisease[] | undefined;
  readOnly: boolean;
}) => {
  const t = useTranslations("auth.add-child.2.form.diseases");

  return (
    <div className="w-full flex flex-col gap-y-4">
      <h2 className="heading-4 font-medium text-primary">الأمراض المزمنة</h2>

      {hasDiseases === "yes" &&
        diseases!.map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:p-6"
          >
            <FormField
              control={control}
              name={`chronicDiseases.diseases.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <Label>
                    <span className="text-base">{t("disease.label")}</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t("disease.placeholder")}
                      {...field}
                      value={field.value?.toString() || ""}
                      className=""
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`chronicDiseases.diseases.${index}.medication`}
              render={({ field }) => (
                <FormItem>
                  <Label>
                    <span className="text-base">{t("medicine.label")}</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t("medicine.placeholder")}
                      {...field}
                      value={field.value?.toString() || ""}
                      className=""
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`chronicDiseases.diseases.${index}.procedures`}
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <Label>
                    <span className="text-base">{t("procedures.label")}</span>
                    <span className="font-normal text-sm md:text-base text-mid-gray">
                      {t("procedures.sublabel")}
                    </span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t("procedures.placeholder")}
                      {...field}
                      value={field.value?.toString() || ""}
                      className=""
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
    </div>
  );
};

const AllergiesPart = ({
  control,
  locale,
  hasAllergies,
  allergies,
  readOnly,
}: {
  control: Control<AddChildFormData>;
  locale: string;
  hasAllergies: "yes" | "no";
  allergies: Allergy[] | undefined;
  readOnly: boolean;
}) => {
  const t = useTranslations("auth.add-child.2.form.allergies");

  return (
    <div className="w-full flex flex-col gap-y-4">
      <h2 className="heading-4 font-medium text-primary">الحساسية</h2>

      {hasAllergies === "yes" &&
        allergies!.map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:p-6"
          >
            <FormField
              control={control}
              name={`allergies.allergies.${index}.allergyTypes`}
              render={({ field }) => (
                <FormItem>
                  <Label>
                    <span className="text-base">{t("allergy.label")}</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t("allergy.placeholder")}
                      {...field}
                      className=""
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`allergies.allergies.${index}.allergyFoods`}
              render={({ field }) => (
                <FormItem>
                  <Label>
                    <span className="text-base">{t("causes.label")}</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t("causes.placeholder")}
                      {...field}
                      className=""
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`allergies.allergies.${index}.allergyProcedures`}
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <Label>
                    <span className="text-base">{t("procedures.label")}</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t("procedures.placeholder")}
                      {...field}
                      className=""
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
    </div>
  );
};

const Recommendations = ({
  control,
  locale,
  readOnly,
}: {
  control: Control<AddChildFormData>;
  locale: string;
  readOnly: boolean;
}) => {
  const t = useTranslations("auth.add-child.3.form");

  return (
    <div className="w-full flex flex-col gap-y-4">
      <h2 className="heading-4 font-medium text-primary">
        توصيات تتعلق بالطفل
      </h2>

      <div className="grid grid-cols-1 lg:p-4 xl:grid-cols-2 gap-y-4 gap-x-10">
        <FormField
          control={control}
          name="childDescription"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">{t("description.label")}</span>
              </Label>
              <FormControl>
                <Input
                  placeholder={t("description.placeholder")}
                  {...field}
                  disabled={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="favoriteThings"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">{t("likes.label")}</span>
              </Label>
              <FormControl>
                <Input
                  placeholder={t("likes.placeholder")}
                  {...field}
                  disabled={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="recommendations"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <span className="text-base">{t("recommendations.label")}</span>
              <FormControl>
                <Textarea
                  placeholder={t("recommendations.placeholder")}
                  {...field}
                  className="min-h-[150px]"
                  disabled={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

const AuthorizationPart = ({
  control,
  locale,
  authorizedPersons,
  readOnly,
}: {
  control: Control<AddChildFormData>;
  locale: string;
  authorizedPersons: { name: string; idNumber: string }[];
  readOnly: boolean;
}) => {
  const t = useTranslations("auth.add-child.4.form");

  return (
    <div className="w-full flex flex-col gap-y-4">
      <h2 className="heading-4 font-medium text-primary">الأشخاص المفوضة</h2>
      <div className="space-y-6 lg:p-6 lg:pb-0">
        {authorizedPersons.map((_, index) => (
          <div key={index} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name={`authorizedPersons.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      <span className="text-base">{t("authorize.label")}</span>
                      {index > 0 ? ` ${index + 1}` : ""}
                      <span className="text-red-500">*</span>
                    </Label>
                    <FormControl>
                      <Input
                        placeholder={t("authorize.placeholder")}
                        {...field}
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`authorizedPersons.${index}.idNumber`}
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      <span className="text-base">{t("identity.label")}</span>
                      {index > 0 ? ` ${index + 1}` : ""}
                      <span className="text-red-500">*</span>
                    </Label>
                    <FormControl>
                      <Input
                        placeholder={t("identity.placeholder")}
                        {...field}
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="lg:px-6">
        <FormField
          control={control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">{t("comment.label")}</span>
              </Label>
              <FormControl>
                <Textarea
                  placeholder={t("comment.placeholder")}
                  {...field}
                  className="min-h-[100px]"
                  disabled={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
