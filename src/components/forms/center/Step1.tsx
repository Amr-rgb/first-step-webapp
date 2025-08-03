"use client";

import { ChangeEvent, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PhoneInput from "../PhoneInput";
import CheckboxGroup from "../CheckboxGroup";
import { CitySelector } from "../CitySelector";
import type { BranchStep1FormData, CenterStep1FormData } from "@/lib/schemas";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mapOptions } from "@/lib/utils";
import { CENTER_TYPE_IDS, SERVICE_IDS } from "@/lib/options";

export function Step1BasicInfo({
  isBranch = false,
  disabled = false,
  show = false,
}: {
  isBranch?: boolean;
  disabled?: boolean;
  show?: boolean;
}) {
  const pathname = usePathname();
  const mode: "edit" | "add" | undefined = pathname.includes("edit")
    ? "edit"
    : pathname.includes("add")
    ? "add"
    : undefined;

  const t = useTranslations("auth.center-signup.1.form");
  const tOptions = useTranslations("options");

  const [showPassword, setShowPassword] = useState(false);

  type Step1FormData = BranchStep1FormData | CenterStep1FormData;

  const { control } = useFormContext<Step1FormData>();

  const centerTypes = mapOptions(CENTER_TYPE_IDS, "centerTypes", tOptions);
  const services = mapOptions(SERVICE_IDS, "centerServices", tOptions);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-10 md:gap-y-4">
        <FormField
          control={control}
          name="nursery_name_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("nursery_name_ar.label")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("nursery_name_ar.placeholder")}
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="nursery_name_en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("nursery_name_en.label")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("nursery_name_en.placeholder")}
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(show ? !!control._formValues?.email : true) && (
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("email.label")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("email.placeholder")}
                    {...field}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("phone.label")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <PhoneInput
                  {...field}
                  value={field.value?.replace(/^\+966/, "")}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    field.onChange(
                      `+966${e.target.value.replace(/^(\+966)?/, "")}`
                    );
                  }}
                  readOnly={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isBranch && (
          <>
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("password.label")}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("password.placeholder")}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 stroke-neutral-500 hover:stroke-neutral-600 duration-300"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-6 stroke-inherit" />
                        ) : (
                          <Eye className="size-6 stroke-inherit" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("password-confirm.label")}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("password-confirm.placeholder")}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 stroke-neutral-500 hover:stroke-neutral-600 duration-300"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-6 stroke-inherit" />
                        ) : (
                          <Eye className="size-6 stroke-inherit" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("city.label")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <CitySelector
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder={t("city.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("neighborhood.label")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("neighborhood.placeholder")}
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(mode === "edit" || show ? !!control._formValues?.address : true) && (
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("address.label")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("address.placeholder")}
                    {...field}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("location.label")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("location.placeholder")}
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={control}
          name="branches"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{t("branches.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("branches.placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
      </div>

      <div className="flex flex-col items-center gap-y-4">
        <p className="form-label">{t("type.label")}</p>
        <CheckboxGroup
          className="lg:w-3xl"
          items={centerTypes}
          name="nursery_type"
          control={control}
          readOnly={disabled}
        />
      </div>

      <div className="flex flex-col items-center gap-y-4">
        <p className="form-label">{t("services.label")}</p>

        <CheckboxGroup
          className="lg:w-3xl"
          items={services}
          name="services"
          control={control}
          readOnly={disabled}
        />
      </div>

      {(show ? !!control._formValues?.address : true) && (
        <FormField
          control={control}
          name="additional_service"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-start items-start gap-x-1 flex-col sm:flex-row">
                <span>{t("other.label")}</span>
                <span className="font-normal text-sm md:text-base text-light-gray">
                  {t("other.sublabel")}
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("other.placeholder")}
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
