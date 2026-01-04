"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import { BlogRequestFormData, createBlogRequestSchema } from "@/lib/schemas";
import { z } from "zod";
import BlogEditor from "../blog/BlogEditor";
import { centerService } from "@/services/dashboardApi";
import { toastSuccess, toastError } from "@/lib/toast";

interface CenterBlogFormProps {
  initialValues?: {
    title: string;
    description: string;
    content: string;
    mainImageUrl?: string;
    cardImageUrl?: string;
  };
  blogId?: string;
  onCancel?: () => void;
}

const CenterBlogForm = ({
  initialValues,
  blogId,
  onCancel,
}: CenterBlogFormProps) => {
  const locale = useLocale();
  const t = useTranslations("dashboard.center.ad-or-blog-request.blog.form");
  const [preview1, setPreview1] = useState<string | null>(
    initialValues?.mainImageUrl || null
  );
  const [preview2, setPreview2] = useState<string | null>(
    initialValues?.cardImageUrl || null
  );
  const router = useRouter();
  const queryClient = useQueryClient();

  // Create different schemas for create vs edit
  const createSchema = createBlogRequestSchema(locale as "ar" | "en");
  const editSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    content: z.string().min(1, "Content is required"),
    mainImage: z.any().optional(),
    cardImage: z.any().optional(),
  });

  const validationSchema = blogId ? editSchema : createSchema;

  const methods = useForm<BlogRequestFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      content: initialValues?.content || "",
      mainImage: undefined,
      cardImage: undefined,
    },
    mode: "onChange",
  });

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      methods.reset({
        title: initialValues.title,
        description: initialValues.description,
        content: initialValues.content,
        mainImage: undefined,
        cardImage: undefined,
      });
      setPreview1(initialValues.mainImageUrl || null);
      setPreview2(initialValues.cardImageUrl || null);
    }
  }, [initialValues, methods]);

  const mutation = useMutation({
    mutationFn: async (payload: {
      data: BlogRequestFormData;
      dirtyFields?: any;
    }) => {
      const { data, dirtyFields } = payload;

      if (blogId && dirtyFields) {
        // Update existing blog - only send dirty fields
        const updatePayload: any = {};

        if (dirtyFields.title) updatePayload.title = data.title;
        if (dirtyFields.description)
          updatePayload.description = data.description;
        if (dirtyFields.content) updatePayload.content = data.content;
        if (dirtyFields.mainImage)
          updatePayload.cover = data.mainImage?.[0] as File;
        if (dirtyFields.cardImage)
          updatePayload.blog_image = data.cardImage?.[0] as File;

        return centerService.updateBlog(blogId, updatePayload);
      } else {
        // Create new blog
        return centerService.requestBlog({
          title: data.title,
          description: data.description,
          content: data.content,
          cover: data.mainImage?.[0] as File,
          blog_image: data.cardImage?.[0] as File,
        });
      }
    },
    onSuccess: () => {
      toastSuccess(t("success.title"), t("success.description"));

      // Reset form and previews if creating
      if (!blogId) {
        methods.reset();
        setPreview1(null);
        setPreview2(null);
      }

      // Invalidate the blogs query to refetch the list
      queryClient.refetchQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", blogId] });

      // Navigate back
      router.back();
    },
    onError: (error) => {
      toastError(t("error.title"), t("error.description"));
      console.error("Error submitting blog:", error);
    },
  });

  const onSubmit = (data: BlogRequestFormData) => {
    const dirtyFields = methods.formState.dirtyFields;
    mutation.mutate({ data, dirtyFields: blogId ? dirtyFields : undefined });
  };

  const isSubmitting = mutation.isPending;

  return (
    <FormProvider {...methods}>
      <form
        className="grid sm:grid-cols-4 items-start gap-4"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormField
          control={methods.control}
          name="mainImage"
          render={({ field }) => (
            <FormItem className="sm:col-span-3">
              <Label>
                <span className="text-base">{t("mainImage.label")}</span>
                {!preview1 && !blogId && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <FormControl>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload1"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreview1(URL.createObjectURL(file));
                        field.onChange(e.target.files);
                      }
                    }}
                  />
                  <label
                    htmlFor="image-upload1"
                    className={clsx(
                      "w-full aspect-1440/610 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer transition-colors",
                      preview1 && "p-2"
                    )}
                  >
                    {preview1 ? (
                      <Image
                        src={preview1}
                        alt="Preview"
                        width={1440}
                        height={610}
                        className="rounded-md object-cover h-full w-full"
                      />
                    ) : (
                      <div className="text-center text-gray-500 flex flex-col items-center gap-2">
                        <ImageIcon className="w-6 h-6" />
                        <p className="text-sm">{t("mainImage.placeholder")}</p>
                      </div>
                    )}
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="cardImage"
          render={({ field }) => (
            <FormItem className="">
              <Label>
                <span className="text-base">{t("cardImage.label")}</span>
                {!preview2 && !blogId && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <FormControl>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload2"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreview2(URL.createObjectURL(file));
                        field.onChange(e.target.files);
                      }
                    }}
                  />
                  <label
                    htmlFor="image-upload2"
                    className={clsx(
                      "w-full aspect-264/160 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer transition-colors",
                      preview2 && "p-2"
                    )}
                  >
                    {preview2 ? (
                      <Image
                        src={preview2}
                        alt="Preview"
                        width={264}
                        height={160}
                        className="rounded-md object-cover h-full w-full"
                      />
                    ) : (
                      <div className="text-center text-gray-500 flex flex-col items-center gap-2">
                        <ImageIcon className="w-6 h-6" />
                        <p className="text-sm">{t("cardImage.placeholder")}</p>
                      </div>
                    )}
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="title"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <Label>
                <span className="text-base">{t("title.label")}</span>
                <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t("title.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="description"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <Label>
                <span className="text-base">{t("description.label")}</span>
                <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t("description.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="content"
          render={({ field }) => (
            <FormItem className="sm:col-span-4">
              <Label>
                <span className="text-base">{t("content.label")}</span>
                <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <BlogEditor
                  value={field.value}
                  onChange={field.onChange}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="sm:col-span-4 flex gap-2 justify-end">
          <Button size={"sm"} type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("sending") : blogId ? t("update") : t("submit")}
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className="border-light-gray! text-mid-gray"
            type="button"
            onClick={onCancel || (() => router.back())}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CenterBlogForm;
