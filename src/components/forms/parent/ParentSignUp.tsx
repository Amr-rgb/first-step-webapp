"use client";

import { useState, ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import type { JustSignUpParentFormData } from "@/lib/schemas";
import PhoneInput from "../PhoneInput";

export default function ParentSignUp() {
  const t = useTranslations("auth.parent-signup.form");

  const [showPassword, setShowPassword] = useState(false);

  const locale = useLocale();
  const { control } = useFormContext<JustSignUpParentFormData>();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-10 md:gap-y-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("name.label")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t("name.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder={t("phone.placeholder")}
                  locale={locale}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="national_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("national-number.label")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("national-number.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  type="text"
                  placeholder={t("address.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  type="email"
                  placeholder={t("email.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
      </div>
    </div>
  );
}
