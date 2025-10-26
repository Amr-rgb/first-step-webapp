"use client";

import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup } from "@/components/general/RadioGroup";
import CheckboxGroup from "../CheckboxGroup";
import { Clock, Minus, Plus } from "lucide-react";
import type { CenterStep3FormData } from "@/lib/schemas";
import { mapOptions } from "@/lib/utils";
import { COMMUNICATION_METHODS_IDS } from "@/lib/options";

export function Step3Communication({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const t = useTranslations("auth.center-signup.3.form");
  const tOptions = useTranslations("options");
  const { control, watch } = useFormContext<CenterStep3FormData>();
  const hasMeals = watch("meals_and_periods.provides_food");

  const firstMealsArray = useFieldArray({
    control,
    name: "meals_and_periods.first_meals",
  });

  const secondMealsArray = useFieldArray({
    control,
    name: "meals_and_periods.second_meals",
  });

  const addFirstMeal = () => {
    firstMealsArray.append({
      meal_name: "",
      juice: "",
      components: "",
    });
  };

  const addSecondMeal = () => {
    secondMealsArray.append({
      meal_name: "",
      juice: "",
      components: "",
    });
  };

  const removeLastFirstMeal = () => {
    if (firstMealsArray.fields.length > 0) {
      firstMealsArray.remove(firstMealsArray.fields.length - 1);
    }
  };

  const removeLastSecondMeal = () => {
    if (secondMealsArray.fields.length > 0) {
      secondMealsArray.remove(secondMealsArray.fields.length - 1);
    }
  };

  const communicationMethods = mapOptions(
    COMMUNICATION_METHODS_IDS,
    "centerCommunicationMethods",
    tOptions
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="form-label">{t("emergency-contact.label")}</p>
        <FormField
          control={control}
          name="emergency_contact"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  disabled={disabled}
                  className="gap-14.5"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    {
                      value: "yes",
                      label: t("emergency-contact.options.yes"),
                    },
                    {
                      value: "no",
                      label: t("emergency-contact.options.no"),
                    },
                  ]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <p className="form-label">{t("communication-methods.label")}</p>
        <CheckboxGroup
          control={control}
          items={communicationMethods}
          name="communication_methods"
          readOnly={disabled}
        />
      </div>

      <div className="space-y-4">
        <p className="form-label">{t("food-service.label")}</p>

        <FormField
          control={control}
          name="meals_and_periods.provides_food"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  disabled={disabled}
                  className="gap-14.5"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    {
                      value: "yes",
                      label: t("food-service.options.yes"),
                    },
                    {
                      value: "no",
                      label: t("food-service.options.no"),
                    },
                  ]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Meal sections */}
      {hasMeals === "yes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-10 md:gap-y-10">
          {[1, 2].map((meal, index) => (
            <div key={index} className="space-y-2 text-center">
              <p className="font-medium text-xl text-mid-gray">
                {index === 0 ? t("periods.first-period") : t("periods.second-period")}
              </p>

              <FormField
                control={control}
                name={
                  index === 0
                    ? `meals_and_periods.time_of_first_period`
                    : `meals_and_periods.time_of_second_period`
                }
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-light-gray size-5" />
                        <Input
                          {...field}
                          type="time"
                          placeholder=""
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

              {(index === 0 ? firstMealsArray : secondMealsArray).fields.map(
                (field, idx) => (
                  <div key={field.id} className="grid grid-cols-1 gap-4">
                    <FormField
                      control={control}
                      name={
                        index === 0
                          ? `meals_and_periods.first_meals.${idx}.meal_name`
                          : `meals_and_periods.second_meals.${idx}.meal_name`
                      }
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormControl>
                            <Input
                              placeholder={t("food-details.name")}
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
                      name={
                        index === 0
                          ? `meals_and_periods.first_meals.${idx}.components`
                          : `meals_and_periods.second_meals.${idx}.components`
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={t("food-details.ingredients")}
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
                      name={
                        index === 0
                          ? `meals_and_periods.first_meals.${idx}.juice`
                          : `meals_and_periods.second_meals.${idx}.juice`
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={t("food-details.drink")}
                              {...field}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )
              )}

              <div className="flex justify-center items-center gap-2">
                {hasMeals === "yes" && (
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={
                      index === 0 ? () => addFirstMeal() : () => addSecondMeal()
                    }
                    className="font-bold"
                    disabled={disabled}
                  >
                    <Plus className="size-6" />
                    {t("food-details.add")}
                  </Button>
                )}

                {index === 0 && firstMealsArray.fields.length > 1 ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeLastFirstMeal()}
                    className="font-bold aspect-square"
                    disabled={disabled}
                  >
                    <Minus className="size-6" />
                  </Button>
                ) : (
                  index === 1 &&
                  secondMealsArray.fields.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeLastSecondMeal()}
                      className="font-bold aspect-square"
                      disabled={disabled}
                    >
                      <Minus className="size-6" />
                    </Button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
