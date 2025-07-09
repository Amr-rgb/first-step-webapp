"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  createAdminBlogRequestSchema,
  AdminBlogRequestFormData,
} from "@/lib/schemas";
import BlogEditor from "./BlogEditor";

interface AdminBlogFormProps {
  initialValues?: Partial<AdminBlogRequestFormData>;
  onSubmit?: (data: AdminBlogRequestFormData, dirtyFields: any) => void;
  loading?: boolean;
  readOnly?: boolean;
  onCancel?: () => void;
}

const AdminBlogForm = ({
  initialValues,
  onSubmit,
  loading,
  readOnly,
  onCancel,
}: AdminBlogFormProps) => {
  const t = useTranslations("dashboard.admin.blog.form");
  const [previewMain, setPreviewMain] = useState<string | null>(null);
  const [previewCard, setPreviewCard] = useState<string | null>(null);

  const methods = useForm<AdminBlogRequestFormData>({
    resolver: zodResolver(createAdminBlogRequestSchema()),
    defaultValues: initialValues || {
      title: { ar: "", en: "" },
      description: { ar: "", en: "" },
      content: { ar: "", en: "" },
      mainImage: undefined,
      cardImage: undefined,
    },
    mode: "onChange",
  });

  const { isDirty } = methods.formState;

  // Set previews if initialValues contain images (for edit/view)
  useEffect(() => {
    if (
      initialValues?.mainImage &&
      typeof initialValues.mainImage === "string"
    ) {
      setPreviewMain(initialValues.mainImage);
    }
    if (
      initialValues?.cardImage &&
      typeof initialValues.cardImage === "string"
    ) {
      setPreviewCard(initialValues.cardImage);
    }
  }, [initialValues]);

  return (
    <FormProvider {...methods}>
      <form
        className="grid sm:grid-cols-4 items-start gap-4"
        onSubmit={
          onSubmit
            ? methods.handleSubmit((data) =>
                onSubmit(data, methods.formState.dirtyFields)
              )
            : (e) => e.preventDefault()
        }
      >
        {/* Main Image */}
        <FormField
          control={methods.control}
          name="mainImage"
          render={({ field }) => (
            <FormItem className="sm:col-span-3">
              <Label>
                {t("coverImage")} <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="main-image-upload"
                    disabled={readOnly}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreviewMain(URL.createObjectURL(file));
                        field.onChange(e.target.files);
                      }
                    }}
                  />
                  <label
                    htmlFor="main-image-upload"
                    className="w-full aspect-[1440/610] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                  >
                    {previewMain ? (
                      <img
                        src={previewMain}
                        alt={t("preview")}
                        className="rounded-md object-cover h-full w-full"
                      />
                    ) : (
                      <span className="text-gray-500">
                        {t("chooseCoverImage")}
                      </span>
                    )}
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Card Image */}
        <FormField
          control={methods.control}
          name="cardImage"
          render={({ field }) => (
            <FormItem>
              <Label>
                {t("cardImage")} <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="card-image-upload"
                    disabled={readOnly}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreviewCard(URL.createObjectURL(file));
                        field.onChange(e.target.files);
                      }
                    }}
                  />
                  <label
                    htmlFor="card-image-upload"
                    className="w-full aspect-[264/160] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                  >
                    {previewCard ? (
                      <img
                        src={previewCard}
                        alt={t("preview")}
                        className="rounded-md object-cover h-full w-full"
                      />
                    ) : (
                      <span className="text-gray-500">
                        {t("chooseCardImage")}
                      </span>
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
            <FormItem className="sm:col-span-2">
              <Label>
                {t("titleAr")} <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("titleArPlaceholder")}
                  disabled={readOnly}
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
            <FormItem className="sm:col-span-2">
              <Label>
                {t("titleEn")} <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("titleEnPlaceholder")}
                  disabled={readOnly}
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
            <FormItem className="sm:col-span-2">
              <Label>
                {t("descriptionAr")} <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("descriptionArPlaceholder")}
                  disabled={readOnly}
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
            <FormItem className="sm:col-span-2">
              <Label>
                {t("descriptionEn")} <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("descriptionEnPlaceholder")}
                  disabled={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Content AR */}
        <FormField
          control={methods.control}
          name="content.ar"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <Label>
                {t("contentAr")} <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <BlogEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("contentArPlaceholder")}
                  readOnly={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Content EN */}
        <FormField
          control={methods.control}
          name="content.en"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <Label>
                {t("contentEn")} <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <BlogEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("contentEnPlaceholder")}
                  readOnly={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!readOnly && (
          <div className="sm:col-span-4 flex justify-end mt-4 gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? t("saving") : t("save")}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                {t("cancel")}
              </Button>
            )}
          </div>
        )}
        {readOnly && onCancel && (
          <div className="sm:col-span-4 flex justify-end mt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("cancel")}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default AdminBlogForm;
