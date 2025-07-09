"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
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
import BlogEditor from "../blog/BlogEditor";
import { centerService } from "@/services/dashboardApi";
import { toast } from "sonner";

const BlogRequestForm = () => {
  const locale = useLocale();
  const t = useTranslations("dashboard.center.ad-or-blog-request.blog.form");
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const blogRequestSchema = createBlogRequestSchema(locale as "ar" | "en");

  const methods = useForm<BlogRequestFormData>({
    resolver: zodResolver(blogRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      mainImage: undefined,
      cardImage: undefined,
    },
    mode: "onChange",
  });

  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogRequestFormData) => {
      return centerService.requestBlog({
        title: data.title,
        description: data.description,
        content: data.content,
        cover: data.mainImage?.[0] as File,
        blog_image: data.cardImage?.[0] as File,
      });
    },
    onSuccess: () => {
      toast(t("success.title"), {
        description: t("success.description"),
      });

      // Reset form and previews
      methods.reset();
      setPreview1(null);
      setPreview2(null);

      // Invalidate the blogs query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["blogs"] });

      // Navigate back
      router.back();
    },
    onError: (error) => {
      toast(t("error.title"), {
        description: t("error.description"),
      });
      console.error("Error submitting blog request:", error);
    },
  });

  const onSubmit = (data: BlogRequestFormData) => {
    createBlogMutation.mutate(data);
  };

  const formData = methods.watch();
  const isFormValid = methods.formState.isValid;
  const isSubmitting = createBlogMutation.isPending;

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
                <span className="text-red-500">*</span>
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
                      "w-full aspect-[1440/610] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer transition-colors",
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
                <span className="text-red-500">*</span>
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
                      "w-full aspect-[264/160] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer transition-colors",
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
                <BlogEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="sm:col-span-4 flex gap-2 justify-end">
          <Button size={"sm"} type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("sending") : t("submit")}
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className="!border-light-gray text-mid-gray"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default BlogRequestForm;
