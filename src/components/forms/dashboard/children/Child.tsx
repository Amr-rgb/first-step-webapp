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
  const addChildSchema = createAddChildSchema(locale as "ar" | "en");

  const isReadOnly = mode === "show";

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

  const methods = useForm<AddChildFormData>({
    resolver: zodResolver(addChildSchema),
    defaultValues: {
      ...initialValues,
    },
    mode: "onChange",
  });

  // Debug: Log form errors whenever they change
  React.useEffect(() => {
    if (Object.keys(methods.formState.errors).length > 0) {
      console.log("Form validation errors:", methods.formState.errors);
    }
  }, [methods.formState.errors]);

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
      const normalized = current.map((p) => ({
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
          readOnly={isReadOnly}
        /> */}

        <ChildPart
          control={methods.control}
          locale={locale}
          readOnly={isReadOnly}
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
                    onChange={field.onChange}
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
                  {diseases.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeDisease(index)}
                      className="font-bold aspect-square"
                    >
                      <Minus className="size-6" size={24} />
                    </Button>
                  )}
                  {index === diseases.length - 1 && (
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
                    >
                      <Plus className="size-6" size={24} /> إضافة مرض
                    </Button>
                  )}
                </div>
              </div>
            ))}
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
                    onChange={field.onChange}
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
                  {allergies.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeAllergy(index)}
                      className="font-bold aspect-square"
                    >
                      <Minus className="size-6" size={24} />
                    </Button>
                  )}
                  {index === allergies.length - 1 && (
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
                    >
                      <Plus className="size-6" size={24} /> إضافة حساسية
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </div>

        <Recommendations
          control={methods.control}
          locale={locale}
          readOnly={isReadOnly}
        />

        <AuthorizationPart
          control={methods.control}
          locale={locale}
          authorizedPersons={authorizedPersons}
          readOnly={isReadOnly}
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
                <span className="text-red-500">*</span>
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
                <span className="text-red-500">*</span>
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
