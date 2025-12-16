"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminService } from "@/services/promocodeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Paperclip, X } from "lucide-react";
import Image from "next/image";

interface ExternalOfferFormProps {
  isOpen: boolean;
  onClose: () => void;
  offer?: any; // To be typed properly
  isViewMode?: boolean;
}

const offerSchema = z.object({
  center_name: z.string().min(1, "اسم جهة العرض مطلوب"),
  address: z.string().min(1, "العنوان مطلوب"),
  descriptions: z.string().min(1, "شرح العرض مطلوب"),
  money_details: z.string().min(1, "تفاصيل الأموال مطلوبة"),
  time_details: z.string().min(1, "تفاصيل الوقت مطلوبة"),
  additional_details: z.string().optional(),
  url: z.string().url("رابط غير صحيح").min(1, "الموقع مطلوب"),
  photos: z.any().optional(), // File[] handled manually mostly
});

type FormData = z.infer<typeof offerSchema>;

export default function ExternalOfferForm({
  isOpen,
  onClose,
  offer,
  isViewMode = false,
}: ExternalOfferFormProps) {
  const t = useTranslations("externalOffers");
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      center_name: "",
      address: "",
      descriptions: "",
      money_details: "",
      time_details: "",
      additional_details: "",
      url: "",
    },
  });

  useEffect(() => {
    if (offer) {
      form.reset({
        center_name: offer.center_name,
        address: offer.address,
        descriptions: offer.descriptions,
        money_details: offer.money_details,
        time_details: offer.time_details,
        additional_details: offer.additional_details,
        url: offer.url || "",
      });

      // Handle existing photos
      if (offer.photos && Array.isArray(offer.photos)) {
        const existingUrls = offer.photos.map((p: any) =>
          typeof p === "string" ? p : p.url
        );
        setPreviewUrls(existingUrls);
      }
    } else {
      form.reset({
        center_name: "",
        address: "",
        descriptions: "",
        money_details: "",
        time_details: "",
        additional_details: "",
        url: "",
      });
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  }, [offer, form, isOpen]);

  const createMutation = useMutation({
    mutationFn: (data: any) => adminService.createExternalOffer(data),
    onSuccess: () => {
      toast.success(t("toast.createSuccess"));
      queryClient.invalidateQueries({ queryKey: ["external-offers"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminService.updateExternalOffer(offer.id, data),
    onSuccess: () => {
      toast.success(t("toast.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["external-offers"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ");
    },
  });

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      photos: selectedFiles,
    };

    if (offer?.id) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages = previewUrls.length + files.length;

      if (totalImages > 10) {
        toast.error(t("toast.imageLimit"));
        return;
      }

      setSelectedFiles((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    const existingCount = offer?.photos?.length || 0;

    // Check if the removed index is a new file
    if (index >= existingCount) {
      // It's a new file
      const newFileIndex = index - existingCount;
      setSelectedFiles((prev) => prev.filter((_, i) => i !== newFileIndex));
    } else {
      // It's an existing file - just remove from visual preview for now
    }

    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="lg:max-w-2xl sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-primary">
            {t("form.title")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="center_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.fields.centerName.label")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.fields.centerName.placeholder")}
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.fields.address.label")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.fields.address.placeholder")}
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.fields.descriptions.label")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.fields.descriptions.placeholder")}
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="money_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.fields.moneyDetails.label")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.fields.moneyDetails.placeholder")}
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.fields.timeDetails.label")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.fields.timeDetails.placeholder")}
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additional_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.fields.additionalDetails.label")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "form.fields.additionalDetails.placeholder"
                      )}
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.fields.url.label")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.fields.url.placeholder")}
                      dir="ltr"
                      className="text-right placeholder:text-right"
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>
                {t("form.fields.photos.label")}{" "}
                <span className="text-red-500">*</span>{" "}
                {t("form.fields.photos.limit")}
              </FormLabel>
              <div className="border rounded-md p-3 flex items-center gap-2">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileChange}
                  disabled={isViewMode || previewUrls.length >= 10}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer p-2 rounded-full hover:bg-gray-100 ${
                    isViewMode || previewUrls.length >= 10
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </label>
                <div className="flex-1 flex gap-2 overflow-x-auto">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 flex-shrink-0 group"
                    >
                      <Image
                        src={url}
                        alt="Preview"
                        fill
                        className="object-cover rounded-md"
                      />
                      {!isViewMode && (
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                size="sm"
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                {t("buttons.cancel")}
              </Button>
              {!isViewMode && (
                <Button
                  size="sm"
                  type="submit"
                  className="flex-1"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? t("buttons.saving")
                    : t("buttons.submit")}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
