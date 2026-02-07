"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Plus, X, Upload, Trash2, User, Camera } from "lucide-react";
import Image from "next/image";

import { createCenterSchema, CenterFormData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StepIndicator from "@/components/forms/StepIndicator";
import FormNavigation from "@/components/forms/FormNavigation";
import { Icons } from "@/components/general/icons";

export function SignUp({
  submitHandler,
  isLoading,
  formRef,
  currentStepRef,
}: {
  submitHandler: (data: CenterFormData) => void;
  isLoading: boolean;
  formRef: React.RefObject<UseFormReturn<CenterFormData> | null>;
  currentStepRef?: React.RefObject<{
    currentStep: number;
    setCurrentStep: (step: number) => void;
  } | null>;
}) {
  const t = useTranslations("auth.center-signup");
  // const tCommon = useTranslations("common");
  const locale = useLocale();
  const isAr = locale === "ar";

  const steps = [
    { number: 1, label: isAr ? "المعلومات الأساسية" : "Basic Information", icon: Icons.one },
    { number: 2, label: isAr ? "التفاصيل والخدمات" : "Details & Services", icon: Icons.two },
    { number: 3, label: isAr ? "الباقات والخطط" : "Plans", icon: Icons.three },
  ];

  const centerSchema = createCenterSchema(locale as "ar" | "en");

  const methods = useForm<CenterFormData>({
    resolver: zodResolver(centerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      nursery_name: "",
      description: "",
      logo: undefined,
      experience_years: "",
      children_served_count: "",
      specialists_count: "",
      custom_services: [{ name: "", description: "" }],
      plans: [{ title: "", description: "", price: "", features: [] }],
    },
    mode: "onChange",
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control: methods.control,
    name: "custom_services",
  });

  const {
    fields: planFields,
    append: appendPlan,
    remove: removePlan,
  } = useFieldArray({
    control: methods.control,
    name: "plans",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const totalSteps = 3;

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      methods.setValue("logo", file, { shouldValidate: true });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const getFieldsToValidate = (step: number): (keyof CenterFormData)[] => {
    switch (step) {
      case 1:
        return ["name", "email", "phone", "password", "nursery_name", "description", "logo"];
      case 2:
        return ["experience_years", "children_served_count", "specialists_count", "custom_services"];
      case 3:
        return ["plans"];
      default:
        return [];
    }
  };

  const goToNextStep = async () => {
    const fields = getFieldsToValidate(currentStep);
    const isValid = await methods.trigger(fields);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const onSubmit = (data: CenterFormData) => {
    submitHandler(data);
  };

  useEffect(() => {
    if (formRef) {
      formRef.current = methods;
    }
  }, [methods, formRef]);

  // Attach the step control ref
  useEffect(() => {
    if (currentStepRef) {
      currentStepRef.current = {
        currentStep,
        setCurrentStep,
      };
    }
  }, [currentStep, currentStepRef]);

  // Helper component for managing features in a plan
  const FeaturesInput = ({ planIndex }: { planIndex: number }) => {
    const [featureInput, setFeatureInput] = useState("");

    // We access the features array for this specific plan
    const features = methods.watch(`plans.${planIndex}.features`) || [];

    const addFeature = () => {
      if (featureInput.trim()) {
        const newFeatures = [...features, featureInput.trim()];
        methods.setValue(`plans.${planIndex}.features`, newFeatures, { shouldValidate: true });
        setFeatureInput("");
      }
    };

    const removeFeature = (fIndex: number) => {
      const newFeatures = features.filter((_, i) => i !== fIndex);
      methods.setValue(`plans.${planIndex}.features`, newFeatures, { shouldValidate: true });
    };

    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            placeholder={isAr ? "أضف ميزة (مثال: جلسات فردية)" : "Add feature (e.g. Individual sessions)"}
            className="bg-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addFeature();
              }
            }}
          />
          <Button type="button" size="sm" onClick={addFeature} variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <span>{feature}</span>
              <button type="button" onClick={() => removeFeature(idx)} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        {methods.formState.errors.plans?.[planIndex]?.features && (
          <p className="text-red-500 text-[10px]">{methods.formState.errors.plans[planIndex]?.features?.message}</p>
        )}
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 gap-8">
              {/* Logo Upload - Full Width Row */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-2">
                <div className="relative w-[122px] h-[122px] shrink-0 group">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md bg-[#EEF2FF] flex items-center justify-center relative">
                    {logoPreview ? (
                      <Image src={logoPreview} alt="Logo Preview" fill className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-[#2B3990]">
                        <User className="w-[56px] h-[56px]" strokeWidth={1.5} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Camera Icon Overlay - Floating Outside */}
                  <div className={`absolute bottom-1 ${isAr ? 'left-1' : 'right-1'} bg-[#2B3990] text-white p-[8px] rounded-full shadow-sm z-10 pointer-events-none flex items-center justify-center w-[36px] h-[36px] translate-y-1 ${isAr ? '-translate-x-1' : 'translate-x-1'}`}>
                    <Camera className="w-5 h-5" />
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 rounded-full"
                    onChange={handleLogoChange}
                  />
                </div>

                <div className="text-center md:text-start space-y-1">
                  <h3 className="text-xl font-bold text-gray-800">{isAr ? "شعار المركز" : "Center Logo"}</h3>
                  <p
                    className="text-gray-500 mx-auto md:mx-0"
                    style={{
                      width: '245px',
                      fontSize: '12px',
                      lineHeight: '28.94px',
                      fontFamily: 'Tajawal',
                      fontWeight: 400
                    }}
                  >
                    {isAr ? "قم بتحميل صورة احترافية. الحجم الموصى به 400x400 بكسل" : "Upload a professional image. Recommended size 400x400 px"}
                  </p>
                  {methods.formState.errors.logo && (
                    <p className="text-red-500 text-xs mt-1">{methods.formState.errors.logo.message as string}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <Label className="block mb-3">{isAr ? "اسم المركز" : "Center Name"} <span className="text-red-500">*</span></Label>
                    <Input {...methods.register("nursery_name")} placeholder={isAr ? "مثال: مركز الأمل" : "e.g. Hope Center"} className="h-12" />
                    {methods.formState.errors.nursery_name && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.nursery_name.message}</p>}
                  </div>

                  <div>
                    <Label className="block mb-3">{isAr ? "رقم الهاتف" : "Phone Number"} <span className="text-red-500">*</span></Label>
                    <Input {...methods.register("phone")} placeholder="05xxxxxxxx" className="h-12" />
                    {methods.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.phone.message}</p>}
                  </div>

                  <div>
                    <Label className="block mb-3">{isAr ? "كلمة المرور" : "Password"} <span className="text-red-500">*</span></Label>
                    <Input {...methods.register("password")} type="password" className="h-12" />
                    {methods.formState.errors.password && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.password.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="block mb-3">{isAr ? "اسم المالك" : "Owner Name"} <span className="text-red-500">*</span></Label>
                    <Input {...methods.register("name")} placeholder={isAr ? "مثال: أحمد أمين" : "e.g. Ahmed Amin"} className="h-12" />
                    {methods.formState.errors.name && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.name.message}</p>}
                  </div>
                  <div>
                    <Label className="block mb-3">{isAr ? "البريد الإلكتروني" : "Email"} <span className="text-red-500">*</span></Label>
                    <Input {...methods.register("email")} type="email" placeholder="example@domain.com" className="h-12" />
                    {methods.formState.errors.email && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.email.message}</p>}
                  </div>

                  {/* Description - Full width or separate? Keeping in column for now or move to bottom if requested */}
                  <div>
                    <Label className="block mb-3">{isAr ? "نبذة عن المركز" : "Description"} <span className="text-red-500">*</span></Label>
                    <Textarea {...methods.register("description")} className="h-[52px] min-h-[52px] resize-none pt-3" placeholder={isAr ? "وصف مختصر..." : "Brief description..."} />
                    {methods.formState.errors.description && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.description.message}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Stats */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">{isAr ? "الإحصائيات" : "Statistics"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="block mb-3">{isAr ? "سنوات الخبرة" : "Years of Experience"}</Label>
                  <Input {...methods.register("experience_years")} type="number" />
                  {methods.formState.errors.experience_years && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.experience_years.message}</p>}
                </div>
                <div>
                  <Label className="block mb-3">{isAr ? "عدد الأطفال" : "Children Served"}</Label>
                  <Input {...methods.register("children_served_count")} type="number" />
                  {methods.formState.errors.children_served_count && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.children_served_count.message}</p>}
                </div>
                <div>
                  <Label className="block mb-3">{isAr ? "عدد الأخصائيين" : "Specialists Count"}</Label>
                  <Input {...methods.register("specialists_count")} type="number" />
                  {methods.formState.errors.specialists_count && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.specialists_count.message}</p>}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            {/* Services */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-700">{isAr ? "الخدمات المقدمة" : "Services"}</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => appendService({ name: "", description: "" })} className="gap-2">
                  <Plus className="w-4 h-4" /> {isAr ? "إضافة خدمة" : "Add Service"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceFields.map((field, index) => (
                  <div key={field.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 relative group hover:border-primary/50 transition-colors">
                    {serviceFields.length > 1 && (
                      <button type="button" onClick={() => removeService(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="space-y-3">
                      <div>
                        <Input {...methods.register(`custom_services.${index}.name`)} placeholder={isAr ? "اسم الخدمة" : "Service Name"} className="bg-white" />
                        {methods.formState.errors.custom_services?.[index]?.name && (
                          <p className="text-red-500 text-[10px] mt-1">{methods.formState.errors.custom_services[index]?.name?.message}</p>
                        )}
                      </div>
                      <div>
                        <Textarea {...methods.register(`custom_services.${index}.description`)} placeholder={isAr ? "وصف الخدمة" : "Description"} className="bg-white h-20 resize-none" />
                        {methods.formState.errors.custom_services?.[index]?.description && (
                          <p className="text-red-500 text-[10px] mt-1">{methods.formState.errors.custom_services[index]?.description?.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {methods.formState.errors.custom_services && (
                <p className="text-red-500 text-sm mt-2">{methods.formState.errors.custom_services.message}</p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg text-gray-700">{isAr ? "باقات الأسعار" : "Pricing Plans"}</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendPlan({ title: "", description: "", price: "", features: [] })} className="gap-2">
                <Plus className="w-4 h-4" /> {isAr ? "إضافة باقة" : "Add Plan"}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {planFields.map((field, index) => (
                <div key={field.id} className="p-6 rounded-xl border border-gray-200 bg-gray-50/50 relative group hover:border-primary/50 transition-colors">
                  {planFields.length > 1 && (
                    <button type="button" onClick={() => removePlan(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs mb-3 block text-gray-500">{isAr ? "اسم الباقة" : "Plan Title"}</Label>
                      <Input {...methods.register(`plans.${index}.title`)} className="bg-white font-semibold" />
                      {methods.formState.errors.plans?.[index]?.title && (
                        <p className="text-red-500 text-[10px] mt-1">{methods.formState.errors.plans[index]?.title?.message}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs mb-3 block text-gray-500">{isAr ? "السعر" : "Price"}</Label>
                      <Input {...methods.register(`plans.${index}.price`)} type="number" className="bg-white" />
                      {methods.formState.errors.plans?.[index]?.price && (
                        <p className="text-red-500 text-[10px] mt-1">{methods.formState.errors.plans[index]?.price?.message}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs mb-3 block text-gray-500">{isAr ? "الوصف" : "Description"}</Label>
                      <Input {...methods.register(`plans.${index}.description`)} className="bg-white" />
                      {methods.formState.errors.plans?.[index]?.description && (
                        <p className="text-red-500 text-[10px] mt-1">{methods.formState.errors.plans[index]?.description?.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs mb-3 block text-gray-500">{isAr ? "المميزات" : "Features"}</Label>
                    <FeaturesInput planIndex={index} />
                  </div>
                </div>
              ))}
            </div>
            {methods.formState.errors.plans && (
              <p className="text-red-500 text-sm mt-2">{methods.formState.errors.plans.message}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-10 text-3xl font-bold text-primary text-center">
        {isAr ? "تسجيل مركز جديد" : "Register New Center"}
      </h1>

      <div className="w-full mb-10">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      <FormProvider {...methods}>
        <form className="w-full" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 mb-8 min-h-[400px]">
            {renderStep()}
          </div>

          <FormNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={goToPreviousStep}
            onNext={goToNextStep}
            isLoading={isLoading}
          />
        </form>
      </FormProvider>
    </div>
  );
}
