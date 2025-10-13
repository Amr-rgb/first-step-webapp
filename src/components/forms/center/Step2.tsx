"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader } from "../FileUploader";
import { Textarea } from "@/components/ui/textarea";
import type { CenterStep2FormData } from "@/lib/schemas";

export function Step2Documents({ disabled = false }: { disabled?: boolean }) {
  const t = useTranslations("auth.center-signup.2.form");
  const { control } = useFormContext<CenterStep2FormData>();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="commercial_record_path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("commercial-registration")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onChange={field.onChange}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt,.zip"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="license_path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("business-license")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onChange={field.onChange}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt,.zip"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("notes")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("notes-placeholder")}
                className="min-h-[100px]"
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <p className="text-center text-sm lg:text-base text-info">
        {t("description")}
      </p>
    </div>
  );
}
