"use client";

import React from "react";

import { useEffect, useState } from "react";
import { FormProvider, useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Plus, X, Upload, Trash2, Camera, User } from "lucide-react";
import Image from "next/image";

import { createNurserySchema, NurseryFormData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StepIndicator from "@/components/forms/StepIndicator";
import FormNavigation from "@/components/forms/FormNavigation";
import { Icons } from "@/components/general/icons";

export function SignUpForm({
    submitHandler,
    isLoading,
    formRef,
    currentStepRef,
}: {
    submitHandler: (data: NurseryFormData) => void;
    isLoading: boolean;
    formRef: React.RefObject<UseFormReturn<NurseryFormData> | null>;
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
        { number: 2, label: isAr ? "ألبوم الصور" : "Photo Album", icon: Icons.two },
        { number: 3, label: isAr ? "خطط الأسعار" : "Pricing Plans", icon: Icons.three },
    ];

    const nurserySchema = createNurserySchema(locale as "ar" | "en");

    const methods = useForm<NurseryFormData>({
        resolver: zodResolver(nurserySchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phone: "",
            nursery_name: "",
            description: "",
            logo: undefined,
            album: [],
            plans: [{ title: "", description: "", price: "" }],
        },
        mode: "onChange",
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
    const [albumPreviews, setAlbumPreviews] = useState<string[]>([]);
    const totalSteps = 3;

    useEffect(() => {
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            albumPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [logoPreview, albumPreviews]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            methods.setValue("logo", file, { shouldValidate: true });
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleAlbumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const currentFiles = methods.getValues("album") || [];
            const newFiles = [...currentFiles, ...files];
            methods.setValue("album", newFiles, { shouldValidate: true });

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setAlbumPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeAlbumImage = (index: number) => {
        const currentFiles = methods.getValues("album") || [];
        const newFiles = currentFiles.filter((_, i) => i !== index);
        methods.setValue("album", newFiles, { shouldValidate: true });

        setAlbumPreviews(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index]); // cleanup
            return newPreviews;
        });
    };

    const getFieldsToValidate = (step: number): (keyof NurseryFormData)[] => {
        switch (step) {
            case 1:
                return ["name", "email", "phone", "password", "nursery_name", "description", "logo"];
            case 2:
                return ["album"];
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

    const onSubmit = (data: NurseryFormData) => {
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
                                    <h3 className="text-xl font-bold text-gray-800">{isAr ? "شعار الحضانة" : "Nursery Logo"}</h3>
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
                                        <Label className="block mb-3">{isAr ? "اسم الحضانة" : "Nursery Name"} <span className="text-red-500">*</span></Label>
                                        <Input {...methods.register("nursery_name")} placeholder={isAr ? "مثال: حضانة النجوم" : "e.g. Stars Nursery"} className="h-12" />
                                        {methods.formState.errors.nursery_name && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.nursery_name.message}</p>}
                                    </div>

                                    <div>
                                        <Label className="block mb-3">{isAr ? "رقم الهاتف" : "Phone Number"} <span className="text-red-500">*</span></Label>
                                        <Input {...methods.register("phone")} placeholder="05xxxxxxxx" className="h-12" />
                                        {methods.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.phone.message}</p>}
                                    </div>

                                    <div>
                                        <Label className="block mb-3">{isAr ? "كلمة المرور" : "Password"} <span className="text-red-500">*</span></Label>
                                        <Input {...methods.register("password")} type="password" placeholder="••••••••" className="h-12" />
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

                                    <div>
                                        <Label className="block mb-3">{isAr ? "نبذة عن الحضانة" : "Description"} <span className="text-red-500">*</span></Label>
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
                        <div className="mb-6">
                            <Label className="mb-2 block text-lg font-semibold text-gray-700">{isAr ? "ألبوم الصور" : "Photo Album"}</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                                {albumPreviews.map((src, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                        <Image src={src} alt="Album" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeAlbumImage(idx)}
                                            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer relative bg-gray-50 gap-2">
                                    <div className="p-3 bg-white rounded-full shadow-sm">
                                        <Plus className="w-6 h-6 text-primary" />
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium">{isAr ? "أضف صور" : "Add Photos"}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleAlbumChange}
                                    />
                                </div>
                            </div>
                            {methods.formState.errors.album && (
                                <p className="text-red-500 text-sm mt-2">{methods.formState.errors.album.message as string}</p>
                            )}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg text-gray-700">{isAr ? "خطط الأسعار" : "Pricing Plans"}</h3>
                            <Button type="button" variant="outline" size="sm" onClick={() => appendPlan({ title: "", description: "", price: "" })} className="gap-2">
                                <Plus className="w-4 h-4" /> {isAr ? "إضافة خطة" : "Add Plan"}
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
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-1">
                                        <div>
                                            <Label className="text-xs mb-3 block text-gray-500">{isAr ? "اسم الخطة" : "Plan Title"}</Label>
                                            <Input {...methods.register(`plans.${index}.title`)} className="bg-white font-semibold" placeholder={isAr ? "مثال: شهري" : "e.g. Monthly"} />
                                            {methods.formState.errors.plans?.[index]?.title && (
                                                <p className="text-red-500 text-[10px] mt-1">{methods.formState.errors.plans[index]?.title?.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label className="text-xs mb-3 block text-gray-500">{isAr ? "السعر" : "Price"}</Label>
                                            <Input {...methods.register(`plans.${index}.price`)} type="number" className="bg-white" placeholder={isAr ? "ر.س" : "SAR"} />
                                            {methods.formState.errors.plans?.[index]?.price && (
                                                <p className="text-red-500 text-[10px] mt-1">{methods.formState.errors.plans[index]?.price?.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label className="text-xs mb-3 block text-gray-500">{isAr ? "المميزات / الوصف" : "Features / Description"}</Label>
                                            <Textarea {...methods.register(`plans.${index}.description`)} className="bg-white h-[48px] min-h-[48px] resize-none pt-2" />
                                            {methods.formState.errors.plans?.[index]?.description && (
                                                <p className="text-red-500 text-[10px] mt-1">{methods.formState.errors.plans[index]?.description?.message}</p>
                                            )}
                                        </div>
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
                {isAr ? "تسجيل حساب حضانة جديد" : "Register New Nursery"}
            </h1>

            <div className="w-full mb-10">
                <StepIndicator steps={steps} currentStep={currentStep} />
            </div>

            <FormProvider {...methods}>
                <form
                    className="w-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
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
