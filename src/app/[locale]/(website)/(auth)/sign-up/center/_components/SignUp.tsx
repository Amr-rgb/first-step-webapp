import { useEffect, useState } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { dashboardIcons } from "@/components/general/icons";
import Image from "next/image";
import Link from "next/link";

import { createCenterSchema, CenterFormData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function SignUp({
  submitHandler,
  isLoading,
  formRef,
}: {
  submitHandler: (data: CenterFormData) => void;
  isLoading: boolean;
  formRef: React.RefObject<UseFormReturn<CenterFormData> | null>;
}) {
  const t = useTranslations("auth.center-signup");
  const locale = useLocale();
  const isAr = locale === "ar";

  const centerSchema = createCenterSchema(locale as "ar" | "en");

  const methods = useForm<CenterFormData>({
    resolver: zodResolver(centerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      nursery_name: "",
      description: "",
      logo: undefined,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

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

  const onSubmit = (data: CenterFormData) => {
    submitHandler(data);
  };

  useEffect(() => {
    if (formRef) {
      formRef.current = methods;
    }
  }, [methods, formRef]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-10 text-3xl font-bold text-primary text-center">
        {isAr ? "تسجيل مركز جديد" : "Register New Center"}
      </h1>

      <FormProvider {...methods}>
        <form className="w-full" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 mb-8 min-h-[400px]">
            <div className="grid grid-cols-1 gap-8">
              {/* Logo Upload - Full Width Row */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-2">
                <div className="relative w-[122px] h-[122px] shrink-0 group">
                  <div className="w-full h-full rounded-full overflow-hidden shadow-md bg-[#EEF2FF] flex items-center justify-center relative">
                    {logoPreview ? (
                      <Image src={logoPreview} alt="Logo Preview" fill className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-[#2B3990]">
                        <dashboardIcons.userAvatar className="w-[56px] h-[56px]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <dashboardIcons.camera className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Camera Icon Overlay - Floating Outside */}
                  <div className={`absolute bottom-1 ${isAr ? 'left-1' : 'right-1'} bg-[#2B3990] text-white p-[8px] rounded-full shadow-sm z-10 pointer-events-none flex items-center justify-center w-[36px] h-[36px] translate-y-1 ${isAr ? '-translate-x-1' : 'translate-x-1'}`}>
                    <dashboardIcons.camera className="w-5 h-5" />
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
                  {!!methods.formState.errors.logo && (
                    <p className="text-red-500 text-xs mt-1">{methods.formState.errors.logo.message as string}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="block mb-3">{isAr ? "اسم المركز" : "Center Name"} <span className="text-red-500">*</span></Label>
                  <Input {...methods.register("nursery_name")} placeholder={isAr ? "مثال: مركز الأمل" : "e.g. Hope Center"} className="h-12" />
                  {!!methods.formState.errors.nursery_name && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.nursery_name.message}</p>}
                </div>

                <div>
                  <Label className="block mb-3">{isAr ? "عن المركز" : "About Center"} <span className="text-red-500">*</span></Label>
                  <Textarea {...methods.register("description")} className="h-12 min-h-[48px] resize-none pt-3 no-scrollbar" placeholder={isAr ? "وصف مختصر..." : "Brief description..."} />
                  {!!methods.formState.errors.description && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.description.message}</p>}
                </div >

                <div>
                  <Label className="block mb-3">{isAr ? "رقم الهاتف" : "Phone Number"} <span className="text-red-500">*</span></Label>
                  <Input {...methods.register("phone")} placeholder="05xxxxxxxx" className="h-12" />
                  {!!methods.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.phone.message}</p>}
                </div>

                <div>
                  <Label className="block mb-3">{isAr ? "البريد الإلكتروني" : "Email"} <span className="text-red-500">*</span></Label>
                  <Input {...methods.register("email")} type="email" placeholder="example@domain.com" className="h-12" />
                  {!!methods.formState.errors.email && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.email.message}</p>}
                </div>

                <div>
                  <Label className="block mb-3">{isAr ? "كلمة المرور" : "Password"} <span className="text-red-500">*</span></Label>
                  <Input {...methods.register("password")} type="password" className="h-12" />
                  {!!methods.formState.errors.password && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.password.message}</p>}
                </div>

                <div>
                  <Label className="block mb-3">{isAr ? "تأكيد كلمة المرور" : "Confirm Password"} <span className="text-red-500">*</span></Label>
                  <Input {...methods.register("confirmPassword")} type="password" className="h-12" />
                  {!!methods.formState.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-6 gap-4">
            <Button
              type="submit"
              className="w-full md:w-auto min-w-[200px] h-12 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {isAr ? "جاري التسجيل..." : "Registering..."}
                </div>
              ) : (
                isAr ? "تسجيل" : "Register"
              )}
            </Button>

            <Link
              href={`/${locale}/sign-in`}
              className="text-primary hover:underline text-sm font-medium"
            >
              {isAr ? "لديك حساب بالفعل؟ تسجيل الدخول" : "Already have an account? Sign In"}
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
