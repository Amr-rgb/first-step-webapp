"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CheckboxGroup from "../CheckboxGroup";
import { Clock } from "lucide-react";
import type { CenterStep2AgesAndHoursFormData } from "@/lib/schemas";
import { mapOptions } from "@/lib/utils";
import { AGE_GROUP_IDS, SERVICE_IDS, WEEK_DAYS } from "@/lib/options";
import { usePathname } from "@/i18n/navigation";

export function Step2AgesAndHours({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const t = useTranslations("auth.center-signup.2.form");
  const tOptions = useTranslations("options");
  const { control } = useFormContext<CenterStep2AgesAndHoursFormData>();

  const services = mapOptions(SERVICE_IDS, "centerServices", tOptions);
  const ageGroups = mapOptions(AGE_GROUP_IDS, "centerAges", tOptions);
  const days = mapOptions(WEEK_DAYS, "days", tOptions);

  const pathname = usePathname();
  const isAdd = pathname.includes("add");

  return (
    <div className="space-y-8">
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

      <div className="space-y-4">
        <p className="form-label">{t("ages.label")}</p>
        <CheckboxGroup
          control={control}
          items={ageGroups}
          name="accepted_ages"
          readOnly={disabled}
        />
      </div>

      {/* <FormField
        control={control}
        name="additionalInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("addition.label")}</FormLabel>
            <FormControl>
              <Input placeholder={t("addition.placeholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField
            control={control}
            name="work_days_from"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormLabel>{t("from-day.label")}</FormLabel>
                  <FormControl>
                    <SelectTrigger>
                      {!isAdd ? (
                        <span
                          data-slot="select-value"
                          className="text-foreground"
                        >
                          {days.find((d) => d.id === field.value)?.label ||
                            t("from-day.placeholder")}
                        </span>
                      ) : (
                        <SelectValue placeholder={t("from-day.placeholder")} />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day.id} value={day.id}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={control}
            name="work_days_to"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormLabel>{t("to-day.label")}</FormLabel>
                  <FormControl>
                    <SelectTrigger>
                      {!isAdd ? (
                        <span
                          data-slot="select-value"
                          className="text-foreground"
                        >
                          {days.find((d) => d.id === field.value)?.label ||
                            t("to-day.placeholder")}
                        </span>
                      ) : (
                        <SelectValue placeholder={t("to-day.placeholder")} />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day.id} value={day.id}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={control}
            name="work_hours_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("from-hour.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-light-gray size-5" />
                    <Input
                      {...field}
                      type="time"
                      placeholder={t("from-hour.placeholder")}
                      className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden
      [&::-webkit-inner-spin-button]:hidden
      [&::-ms-clear]:hidden"
                      disabled={disabled}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={control}
            name="work_hours_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("to-hour.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-light-gray size-5" />
                    <Input
                      {...field}
                      type="time"
                      placeholder={t("from-hour.placeholder")}
                      className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden
      [&::-webkit-inner-spin-button]:hidden
      [&::-ms-clear]:hidden"
                      disabled={disabled}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
