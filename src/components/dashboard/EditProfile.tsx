"use client";

import { ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthUser } from "@/store/authStore";
import { Label } from "../ui/label";

import { CitySelector } from "@/components/forms/CitySelector";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodTypeAny } from "zod";
import PhoneInput from "../forms/PhoneInput";
import { useRouter } from "@/i18n/navigation";

interface ProfileField {
  key: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

interface EditProfileProps {
  title: string;
  fields: ProfileField[];
  onSave: (data: any) => Promise<void>;
  initialData?: Record<string, any>;
  schema: ZodTypeAny;
}

export default function EditProfile({
  title,
  fields,
  onSave,
  initialData = {},
  schema,
}: EditProfileProps) {
  const t = useTranslations("dashboard.profile");
  const user = useAuthUser();
  const router = useRouter();

  const defaultValues: Record<string, any> = (() => {
    const data: Record<string, any> = {};
    fields.forEach((field) => {
      data[field.key] =
        initialData[field.key] ||
        (user?.[field.key as keyof typeof user] as any) ||
        "";
    });
    return data;
  })();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<Record<string, any>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Ensure form reflects latest initial data when it loads/changes
  useEffect(() => {
    const refreshedDefaults: Record<string, any> = {};
    fields.forEach((field) => {
      refreshedDefaults[field.key] =
        initialData[field.key] ||
        (user?.[field.key as keyof typeof user] as any) ||
        "";
    });

    if (refreshedDefaults !== defaultValues) {
      reset(refreshedDefaults);
    }
  }, [initialData, fields, reset, user]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await onSave(data);
      toast.success(t("success.saved"));
    } catch (error: any) {
      toast.error(error?.message || t("errors.saveFailed"));
    }
  });

  const handleCancel = () => {
    reset(defaultValues);
    router.back();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-4 text-primary mb-4">{title}</h1>
        </div>

        {/* Main Form Container */}
        <form onSubmit={onSubmit} className="">
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {fields.map((field) => {
              const isCityField =
                field.key === "city" || field.key === "city_id";

              const isPhoneField =
                field.key === "phone" || field.type === "tel";

              return (
                <div key={field.key} className={`space-y-3`}>
                  <Label htmlFor={field.key} className="text-base">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 mr-1">*</span>
                    )}
                  </Label>
                  <div className="relative">
                    {isCityField ? (
                      <Controller
                        name={field.key}
                        control={control}
                        render={({ field: controllerField }) => (
                          <CitySelector
                            value={controllerField.value || ""}
                            onChange={(value) =>
                              controllerField.onChange(value)
                            }
                            placeholder={field.placeholder}
                          />
                        )}
                      />
                    ) : null}

                    {isPhoneField ? (
                      <Controller
                        name={field.key}
                        control={control}
                        render={({ field: controllerField }) => (
                          <PhoneInput
                            {...controllerField}
                            value={controllerField.value?.replace(/^\+966/, "")}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              controllerField.onChange(
                                `+966${e.target.value.replace(/^(\+966)?/, "")}`
                              );
                            }}
                          />
                        )}
                      />
                    ) : null}

                    {!isCityField && !isPhoneField ? (
                      <Input
                        id={field.key}
                        type={field.type || "text"}
                        placeholder={field.placeholder || field.label}
                        {...register(field.key)}
                      />
                    ) : null}
                    {errors[field.key]?.message && (
                      <div className="absolute -bottom-6 ltr:left-0 rtl:right-0 text-sm text-red-500 flex items-center gap-1 mt-1">
                        {String(errors[field.key]?.message)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 pt-8 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              size={"sm"}
              type="button"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              disabled={isSubmitting || Object.keys(dirtyFields).length === 0}
              size={"sm"}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  {t("buttons.saving")}
                </>
              ) : (
                <>{t("buttons.save")}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
