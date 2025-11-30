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
        {(!readOnly || hasDiseases === "yes") && (
          <div className="w-full flex flex-col gap-y-4">
            <h2 className="heading-4 font-medium text-primary">
              الأمراض المزمنة
            </h2>
            {!readOnly && (
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
            )}
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
            {hasDiseases === "yes" && !readOnly && (
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
        )}
        {/* --- Allergies Section --- */}
        {(!readOnly || hasAllergies === "yes") && (
          <div className="w-full flex flex-col gap-y-4">
            <h2 className="heading-4 font-medium text-primary">الحساسية</h2>
            {!readOnly && (
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
            )}
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
            {hasAllergies === "yes" && !readOnly && (
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
        )}

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

// Helper function to check if a value exists and is not empty
const hasValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return true;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return Boolean(value);
};

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
  const { watch, getValues } = useFormContext<AddChildFormData>();
  const kinship = watch("kinship");
  const childNationalNumber = watch("childNationalNumber");
  const childImage = watch("childImage");
  const qrCode = (getValues() as any)?.qrCode || null;

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

        {/* Kinship Field - Only show if has value in readOnly mode, or always show in edit/add mode */}
        {(!readOnly || hasValue(kinship)) && (
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
        )}

        {/* Child National Number - Only show if has value in readOnly mode, or always show in edit/add mode */}
        {(!readOnly || hasValue(childNationalNumber)) && (
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
        )}

        {/* Three Cards Section: Gender, QR Code, Child Photo */}
        <div className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {/* Gender Selection Card */}
            <div className="flex flex-col">
              <p className="form-label-sm mb-4 text-center">جنس الطفل</p>
              <FormField
                control={control}
                name="gender"
                render={({ field }) => (
                  <>
                    <div className="flex justify-center gap-4">
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
                    </div>
                    <FormMessage />
                  </>
                )}
              />
            </div>

            {/* QR Code Card */}
            {(!readOnly || hasValue(qrCode)) && (
              <div className="flex flex-col">
                <Label className="mb-4 text-center">
                  <span className="text-base">QR code</span>
                </Label>
                <div className="relative flex-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors duration-200 min-h-[200px] flex items-center justify-center bg-gray-50">
                    {qrCode && typeof qrCode === "string" ? (
                      <div className="space-y-2">
                        <div className="relative inline-block">
                          <img
                            src={
                              qrCode.startsWith("http") ||
                              qrCode.startsWith("//")
                                ? qrCode
                                : `${
                                    process.env.NEXT_PUBLIC_API_BASE_URL
                                  }/${qrCode.replace(/^\//, "")}`
                            }
                            alt="QR Code"
                            className="w-40 h-40 object-contain mx-auto border-2 border-orange-300 rounded-lg shadow-lg bg-white p-2"
                            onError={(e) => {
                              // Hide image on error
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
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
                              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Child Image Card */}
            {(!readOnly || hasValue(childImage)) && (
              <FormField
                control={control}
                name="childImage"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Label className="mb-4 text-center">
                      <span className="text-base">صورة الطفل</span>
                    </Label>
                    <FormControl>
                      <div className="relative flex-1">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors duration-200 min-h-[200px] flex items-center justify-center bg-gray-50">
                          {field.value ? (
                            <div className="space-y-2">
                              <div className="relative inline-block">
                                <img
                                  src={
                                    field.value instanceof File
                                      ? URL.createObjectURL(field.value)
                                      : field.value.startsWith("http")
                                      ? field.value
                                      : `${
                                          process.env.NEXT_PUBLIC_API_BASE_URL
                                        }/${field.value.replace(/^\//, "")}`
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
                              {!readOnly && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    document
                                      .getElementById("child-image-upload")
                                      ?.click()
                                  }
                                  className="text-primary hover:text-primary-dark text-xs font-medium transition-colors"
                                >
                                  تغيير الصورة
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
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
                              {!readOnly && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    document
                                      .getElementById("child-image-upload")
                                      ?.click()
                                  }
                                  className="bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors text-xs font-medium"
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
                                ![
                                  "image/png",
                                  "image/jpeg",
                                  "image/jpg",
                                ].includes(file.type)
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
            )}
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
  const { watch } = useFormContext<AddChildFormData>();
  const childDescription = watch("childDescription");
  const favoriteThings = watch("favoriteThings");
  const recommendations = watch("recommendations");

  // In readOnly mode, only show section if at least one field has value
  if (
    readOnly &&
    !hasValue(childDescription) &&
    !hasValue(favoriteThings) &&
    !hasValue(recommendations)
  ) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-y-4">
      <h2 className="heading-4 font-medium text-primary">
        توصيات تتعلق بالطفل
      </h2>

      <div className="grid grid-cols-1 lg:p-4 xl:grid-cols-2 gap-y-4 gap-x-10">
        {(!readOnly || hasValue(childDescription)) && (
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
        )}

        {(!readOnly || hasValue(favoriteThings)) && (
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
        )}

        {(!readOnly || hasValue(recommendations)) && (
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
        )}
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
  const { watch } = useFormContext<AddChildFormData>();
  const comments = watch("comments");

  // Filter authorized persons to only show those with data in readOnly mode
  const validAuthorizedPersons = readOnly
    ? authorizedPersons.filter(
        (person) => hasValue(person.name) || hasValue(person.idNumber)
      )
    : authorizedPersons;

  // In readOnly mode, only show section if there are valid authorized persons or comments
  if (readOnly && validAuthorizedPersons.length === 0 && !hasValue(comments)) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-y-4">
      <h2 className="heading-4 font-medium text-primary">الأشخاص المفوضة</h2>
      {validAuthorizedPersons.length > 0 && (
        <div className="space-y-6 lg:p-6 lg:pb-0">
          {validAuthorizedPersons.map((_, index) => (
            <div key={index} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name={`authorizedPersons.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <Label>
                        <span className="text-base">
                          {t("authorize.label")}
                        </span>
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
      )}

      {(!readOnly || hasValue(comments)) && (
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
      )}
    </div>
  );
};
