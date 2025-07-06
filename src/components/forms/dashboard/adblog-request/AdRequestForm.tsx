"use client";

import { usePathname } from "@/i18n/navigation";
import DatePicker from "@/components/general/DatePicker";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdRequestFormData, createAdRequestSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { ImageIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService, centerService } from "@/services/dashboardApi";
import { toast } from "sonner";

const AdRequestForm = ({
  initialData,
  mode,
  children,
}: {
  initialData?: AdRequestFormData;
  mode?: "add" | "show";
  children: (
    data: AdRequestFormData,
    isValid: boolean,
    isSubmitting: boolean,
    dirtyFields: string[]
  ) => React.ReactNode;
}) => {
  const locale = useLocale();
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin/");

  const t = useTranslations("dashboard.center.ad-or-blog-request.ad.form");
  const [preview, setPreview] = useState<string | null>(
    (typeof initialData?.image === "string" && initialData?.image) || null
  );
  const queryClient = useQueryClient();
  const adRequestSchema = createAdRequestSchema(locale as "ar" | "en");

  const methods = useForm<AdRequestFormData>({
    resolver: zodResolver(adRequestSchema),
    defaultValues: {
      title: {
        ar: initialData?.title?.ar ?? "",
        en: initialData?.title?.en ?? "",
      },
      description: {
        ar: initialData?.description?.ar ?? "",
        en: initialData?.description?.en ?? "",
      },
      image: initialData?.image || undefined,
      start_date: initialData?.start_date || undefined,
      end_date: initialData?.end_date || undefined,
    },
    mode: "onChange",
  });

  // Format dates to YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const createAdMutation = useMutation({
    mutationFn: async (data: AdRequestFormData) => {
      const createAd = isAdmin
        ? adminService.createAdvertisement
        : centerService.requestAd;

      return createAd({
        titleAr: data.title.ar,
        titleEn: data.title.en,
        descriptionAr: data.description.ar,
        descriptionEn: data.description.en,
        image: data.image?.[0] as File,
        publish_date: formatDate(data.start_date),
        end_date: formatDate(data.end_date),
      });
    },
    onSuccess: () => {
      toast(t("success.title"), {
        description: t("success.description"),
      });
      methods.reset();
      setPreview(null);
      // Invalidate the ads query to refetch the list
      isAdmin
        ? queryClient.invalidateQueries({
            queryKey: ["adminAdvertisements"],
          })
        : queryClient.invalidateQueries({
            queryKey: ["ads"],
          });
    },
    onError: (error) => {
      toast(t("error.title"), {
        description: t("error.description"),
      });
      console.error("Error submitting ad request:", error);
    },
  });

  const onSubmit = (data: AdRequestFormData) => {
    createAdMutation.mutate(data);
  };

  const formData = methods.watch();
  const isValid = methods.formState.isValid;
  const isSubmitting = createAdMutation.isPending;

  return (
    <FormProvider {...methods}>
      <form
        className="grid sm:grid-cols-2 items-start gap-4"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormField
          control={methods.control}
          name="image"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <Label className={`${mode === "show" ? "hidden" : ""}`}>
                <span className="text-base">{t("image.label")}</span>
                <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <div>
                  <input
                    disabled={mode === "show"}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                        field.onChange(e.target.files);
                      }
                    }}
                  />
                  <label
                    htmlFor="image-upload"
                    className={clsx(
                      "w-full aspect-[720/340] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer transition-colors",
                      preview && "p-2"
                    )}
                  >
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Preview"
                        width={720}
                        height={340}
                        className="rounded-md object-cover h-full w-full"
                      />
                    ) : (
                      <div className="text-center text-gray-500 flex flex-col items-center gap-2">
                        <ImageIcon className="w-6 h-6" />
                        <p className="text-sm">{t("image.placeholder")}</p>
                      </div>
                    )}
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title AR */}
        <FormField
          control={methods.control}
          name="title.ar"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">{t("title.label")} (عربي)</span>
                <span
                  className={`text-red-500 ${mode === "show" ? "hidden" : ""}`}
                >
                  *
                </span>
              </Label>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t("title.placeholder")}
                  {...field}
                  disabled={mode === "show"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title EN */}
        <FormField
          control={methods.control}
          name="title.en"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">{t("title.label")} (EN)</span>
                <span
                  className={`text-red-500 ${mode === "show" ? "hidden" : ""}`}
                >
                  *
                </span>
              </Label>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t("title.placeholder")}
                  {...field}
                  disabled={mode === "show"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description AR */}
        <FormField
          control={methods.control}
          name="description.ar"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">
                  {t("description.label")} (عربي)
                </span>
                <span
                  className={`text-red-500 ${mode === "show" ? "hidden" : ""}`}
                >
                  *
                </span>
              </Label>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t("description.placeholder")}
                  {...field}
                  disabled={mode === "show"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description EN */}
        <FormField
          control={methods.control}
          name="description.en"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">{t("description.label")} (EN)</span>
                <span
                  className={`text-red-500 ${mode === "show" ? "hidden" : ""}`}
                >
                  *
                </span>
              </Label>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t("description.placeholder")}
                  {...field}
                  disabled={mode === "show"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={methods.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">{t("start_date.label")}</span>{" "}
                <span
                  className={`text-red-500 ${mode === "show" ? "hidden" : ""}`}
                >
                  *
                </span>
              </Label>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={{
                    before: new Date(
                      new Date().setDate(new Date().getDate() + 1)
                    ),
                  }}
                  inputDisabled={mode === "show"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date */}
        <FormField
          control={methods.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <Label>
                <span className="text-base">{t("end_date.label")}</span>{" "}
                <span
                  className={`text-red-500 ${mode === "show" ? "hidden" : ""}`}
                >
                  *
                </span>
              </Label>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={{
                    before: new Date(
                      new Date().setDate(new Date().getDate() + 1)
                    ),
                  }}
                  inputDisabled={mode === "show"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="sm:col-span-2 flex gap-2 justify-end">
          {children(
            methods.getValues(),
            methods.formState.isValid,
            isSubmitting,
            Object.keys(methods.formState.dirtyFields)
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default AdRequestForm;
