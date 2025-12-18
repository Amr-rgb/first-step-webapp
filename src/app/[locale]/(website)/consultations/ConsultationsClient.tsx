"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Share2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput from "@/components/forms/PhoneInput";
import { FileUploader } from "@/components/forms/FileUploader";
import {
  sendCenterConsultationAction,
  sendParentConsultationAction,
} from "@/actions/consultationActions";

type TabType = "parent" | "center";

interface ConsultationsClientProps {
  initialTab: TabType;
  locale: string;
}

// Parent consultation form schema
const parentConsultationSchema = z.object({
  name: z.string().min(1, "required"),
  phone: z.string().min(1, "required"),
  email: z.string().email("invalidEmail"),
  kind_of_user: z.string().min(1, "required"),
  subject_of_consultation: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
  file: z.any().optional(),
});

// Center consultation form schema
const centerConsultationSchema = z.object({
  center_name: z.string().min(1, "required"),
  center_specification: z.string().min(1, "required"),
  name_of_consultan_request: z.string().min(1, "required"),
  mission_of_consultant_request: z.string().min(1, "required"),
  phone: z.string().min(1, "required"),
  email: z.string().email("invalidEmail"),
  subject_of_consultan: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
  file: z.any().optional(),
});

type ParentFormData = z.infer<typeof parentConsultationSchema>;
type CenterFormData = z.infer<typeof centerConsultationSchema>;

export default function ConsultationsClient({
  initialTab,
  locale,
}: ConsultationsClientProps) {
  const t = useTranslations("consultations");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isPending, startTransition] = useTransition();

  // Parent form
  const parentForm = useForm<ParentFormData>({
    resolver: zodResolver(parentConsultationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      kind_of_user: "",
      subject_of_consultation: "",
      description: "",
      file: null,
    },
  });

  // Center form
  const centerForm = useForm<CenterFormData>({
    resolver: zodResolver(centerConsultationSchema),
    defaultValues: {
      center_name: "",
      center_specification: "",
      name_of_consultan_request: "",
      mission_of_consultant_request: "",
      phone: "",
      email: "",
      subject_of_consultan: "",
      description: "",
      file: null,
    },
  });

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());

    if (newTab === "center") {
      params.set("type", "center");
    } else {
      params.delete("type");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: t("share.title"),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t("share.copied"));
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const onParentSubmit = (data: ParentFormData) => {
    startTransition(async () => {
      try {
        let fileFormData: FormData | undefined;
        if (data.file instanceof File) {
          fileFormData = new FormData();
          fileFormData.append("file", data.file);
        }

        const payload = {
          name: data.name,
          phone: `+966${data.phone}`,
          email: data.email,
          kind_of_user: data.kind_of_user,
          subject_of_consultation: data.subject_of_consultation,
          description: data.description,
        };

        const result = await sendParentConsultationAction(
          payload,
          fileFormData
        );

        if (result.success) {
          toast.success(t("form.success"));
          parentForm.reset();
        } else {
          toast.error(result.error || t("form.error"));
        }
      } catch (error) {
        toast.error(t("form.error"));
      }
    });
  };

  const onCenterSubmit = (data: CenterFormData) => {
    startTransition(async () => {
      try {
        let fileFormData: FormData | undefined;
        if (data.file instanceof File) {
          fileFormData = new FormData();
          fileFormData.append("file", data.file);
        }

        const payload = {
          center_name: data.center_name,
          center_specification: data.center_specification,
          name_of_consultan_request: data.name_of_consultan_request,
          mission_of_consultant_request: data.mission_of_consultant_request,
          phone: `+966${data.phone}`,
          email: data.email,
          subject_of_consultan: data.subject_of_consultan,
          description: data.description,
        };

        const result = await sendCenterConsultationAction(
          payload,
          fileFormData
        );

        if (result.success) {
          toast.success(t("form.success"));
          centerForm.reset();
        } else {
          toast.error(result.error || t("form.error"));
        }
      } catch (error) {
        toast.error(t("form.error"));
      }
    });
  };

  const handleCancel = () => {
    if (activeTab === "parent") {
      parentForm.reset();
    } else {
      centerForm.reset();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Tabs and Share Button Row */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mb-8">
          {/* Custom Tabs */}
          <div className="flex items-center border border-primary rounded-xl overflow-hidden bg-white w-full md:w-auto">
            <button
              type="button"
              onClick={() => handleTabChange("center")}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-2 transition-all duration-300 font-medium min-w-[200px]",
                activeTab === "center"
                  ? "blue-gradient text-white"
                  : "text-primary hover:bg-gray-50"
              )}
            >
              <span>{t("tabs.centers")}</span>
              <div className="relative w-8 h-8">
                <Image
                  src="/assets/illustrations/center.png"
                  alt="icon"
                  fill
                  className="object-contain"
                />
              </div>
            </button>
            <div className="w-px h-full bg-primary" />
            <button
              type="button"
              onClick={() => handleTabChange("parent")}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-2 transition-all duration-300 font-medium min-w-[200px]",
                activeTab === "parent"
                  ? "blue-gradient text-white"
                  : "text-primary hover:bg-gray-50 bg-white"
              )}
            >
              <span>{t("tabs.parents")}</span>
              <div className="relative w-8 h-8">
                <Image
                  src="/assets/illustrations/parent.png"
                  alt="icon"
                  fill
                  className="object-contain"
                />
              </div>
            </button>
          </div>

          {/* Share Button */}
          <Button
            variant="outline"
            onClick={handleShare}
            size="sm"
            className="w-full md:w-auto"
          >
            <span>{t("share.button")}</span>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Info Section */}
        <div className="bg-linear-to-b from-white/15 via-secondary-mint-green/12 to-secondary-mint-green/24 rounded-2xl p-6 md:p-8 mb-8">
          <p className="text-lg md:text-xl font-medium text-gray-800 mb-6">
            {activeTab === "parent" ? t("parent.intro") : t("center.intro")}
          </p>
          {/* <ul className="space-y-2 text-gray-700">
            {activeTab === "parent" ? (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{t("parent.bullet1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{t("parent.bullet2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{t("parent.bullet3")}</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{t("center.bullet1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{t("center.bullet2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{t("center.bullet3")}</span>
                </li>
              </>
            )}
          </ul> */}
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-blue mb-2">
            {activeTab === "parent"
              ? t("parent.formTitle")
              : t("center.formTitle")}
          </h2>
          <p className="text-gray-500 mb-8">{t("form.subtitle")}</p>

          {activeTab === "parent" ? (
            <form
              key="parent-form"
              onSubmit={parentForm.handleSubmit(onParentSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.name")}
                  </label>
                  <Input
                    {...parentForm.register("name")}
                    placeholder={t("form.namePlaceholder")}
                    className={cn(
                      parentForm.formState.errors.name && "border-destructive"
                    )}
                  />
                  {parentForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {t(
                        `form.errors.${parentForm.formState.errors.name.message}`
                      )}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.phone")}
                  </label>
                  <Controller
                    name="phone"
                    control={parentForm.control}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        placeholder={t("form.phonePlaceholder")}
                        className={cn(
                          parentForm.formState.errors.phone &&
                            "border-destructive"
                        )}
                      />
                    )}
                  />
                  {parentForm.formState.errors.phone && (
                    <p className="text-sm text-destructive">
                      {t(
                        `form.errors.${parentForm.formState.errors.phone.message}`
                      )}
                    </p>
                  )}
                </div>

                {/* Kind of User */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.kindOfUser")}
                  </label>
                  <Controller
                    name="kind_of_user"
                    control={parentForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={cn(
                            parentForm.formState.errors.kind_of_user &&
                              "border-destructive"
                          )}
                        >
                          <SelectValue
                            placeholder={t("form.kindOfUserPlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">
                            {t("form.kindOptions.parent")}
                          </SelectItem>
                          <SelectItem value="teacher">
                            {t("form.kindOptions.teacher")}
                          </SelectItem>
                          <SelectItem value="other">
                            {t("form.kindOptions.other")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {parentForm.formState.errors.kind_of_user && (
                    <p className="text-sm text-destructive">
                      {t(
                        `form.errors.${parentForm.formState.errors.kind_of_user.message}`
                      )}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.email")}
                  </label>
                  <Input
                    {...parentForm.register("email")}
                    type="email"
                    placeholder={t("form.emailPlaceholder")}
                    className={cn(
                      parentForm.formState.errors.email && "border-destructive"
                    )}
                  />
                  {parentForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {t(
                        `form.errors.${parentForm.formState.errors.email.message}`
                      )}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.subject")}
                  </label>
                  <Controller
                    name="subject_of_consultation"
                    control={parentForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={cn(
                            parentForm.formState.errors
                              .subject_of_consultation && "border-destructive"
                          )}
                        >
                          <SelectValue
                            placeholder={t("form.subjectPlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="educational">
                            {t("form.subjectOptions.educational")}
                          </SelectItem>
                          <SelectItem value="psychological">
                            {t("form.subjectOptions.psychological")}
                          </SelectItem>
                          <SelectItem value="behavioral">
                            {t("form.subjectOptions.behavioral")}
                          </SelectItem>
                          <SelectItem value="other">
                            {t("form.subjectOptions.other")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {parentForm.formState.errors.subject_of_consultation && (
                    <p className="text-sm text-destructive">
                      {t(
                        `form.errors.${parentForm.formState.errors.subject_of_consultation.message}`
                      )}
                    </p>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.file")}
                  </label>
                  <Controller
                    name="file"
                    control={parentForm.control}
                    render={({ field }) => (
                      <FileUploader
                        value={field.value}
                        onChange={field.onChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("form.description")}
                </label>
                <Textarea
                  {...parentForm.register("description")}
                  placeholder={t("form.descriptionPlaceholder")}
                  rows={10}
                  className={cn(
                    parentForm.formState.errors.description &&
                      "h-36 border-destructive"
                  )}
                />
                {parentForm.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {t(
                      `form.errors.${parentForm.formState.errors.description.message}`
                    )}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="w-full sm:w-auto min-w-[150px]"
                >
                  {t("form.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto min-w-[150px] blue-gradient"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {t("form.submitting")}
                    </>
                  ) : (
                    t("form.submit")
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <form
              key="center-form"
              onSubmit={centerForm.handleSubmit(onCenterSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Center Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.centerName")}
                  </label>
                  <Input
                    {...centerForm.register("center_name")}
                    placeholder={t("form.centerNamePlaceholder")}
                    className={cn(
                      centerForm.formState.errors.center_name &&
                        "border-destructive"
                    )}
                  />
                  {centerForm.formState.errors.center_name && (
                    <p className="text-sm text-destructive">
                      {t(
                        `form.errors.${centerForm.formState.errors.center_name.message}`
                      )}
                    </p>
                  )}
                </div>

                {/* Center Specification */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.centerSpec")}
                  </label>
                  <Controller
                    name="center_specification"
                    control={centerForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={cn(
                            centerForm.formState.errors.center_specification &&
                              "border-destructive"
                          )}
                        >
                          <SelectValue
                            placeholder={t("form.centerSpecPlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nursery">
                            {t("form.centerSpecOptions.nursery")}
                          </SelectItem>
                          <SelectItem value="educational">
                            {t("form.centerSpecOptions.educational")}
                          </SelectItem>
                          <SelectItem value="rehabilitation">
                            {t("form.centerSpecOptions.rehabilitation")}
                          </SelectItem>
                          <SelectItem value="other">
                            {t("form.centerSpecOptions.other")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {centerForm.formState.errors.center_specification && (
                    <p className="text-sm text-destructive">
                      {t(
                        `form.errors.${centerForm.formState.errors.center_specification.message}`
                      )}
                    </p>
                  )}
                </div>

                {/* Name of Consultant Request */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.requesterName")}
                  </label>
                  <Input
                    {...centerForm.register("name_of_consultan_request")}
                    placeholder={t("form.requesterNamePlaceholder")}
                    className={cn(
                      centerForm.formState.errors.name_of_consultan_request &&
                        "border-destructive"
                    )}
                  />
                  {centerForm.formState.errors.name_of_consultan_request && (
                    <p className="text-sm text-destructive">
                      {t(
                        `form.errors.${centerForm.formState.errors.name_of_consultan_request.message}`
                      )}
                    </p>
                  )}
                </div>

                {/* Mission of Consultant Request (Role) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.requesterMission")}
                  </label>
                  <Input
                    {...centerForm.register("mission_of_consultant_request")}
                    placeholder={t("form.requesterMissionPlaceholder")}
                    className={cn(
                      centerForm.formState.errors
                        .mission_of_consultant_request && "border-destructive"
                    )}
                  />
                  {centerForm.formState.errors
                    .mission_of_consultant_request && (
                    <p className="text-sm text-destructive">
                      {t(
                        `form.errors.${centerForm.formState.errors.mission_of_consultant_request.message}`
                      )}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.phone")}
                  </label>
                  <Controller
                    name="phone"
                    control={centerForm.control}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        placeholder={t("form.phonePlaceholder")}
                        className={cn(
                          centerForm.formState.errors.phone &&
                            "border-destructive"
                        )}
                      />
                    )}
                  />
                  {centerForm.formState.errors.phone && (
                    <p className="text-sm text-destructive">
                      {t(
                        `form.errors.${centerForm.formState.errors.phone.message}`
                      )}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.email")}
                  </label>
                  <Input
                    {...centerForm.register("email")}
                    type="email"
                    placeholder={t("form.emailPlaceholder")}
                    className={cn(
                      centerForm.formState.errors.email && "border-destructive"
                    )}
                  />
                  {centerForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {t(
                        `form.errors.${centerForm.formState.errors.email.message}`
                      )}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.subject")}
                  </label>
                  <Controller
                    name="subject_of_consultan"
                    control={centerForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={cn(
                            centerForm.formState.errors.subject_of_consultan &&
                              "border-destructive"
                          )}
                        >
                          <SelectValue
                            placeholder={t("form.subjectPlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="educational">
                            {t("form.subjectOptions.educational")}
                          </SelectItem>
                          <SelectItem value="administrative">
                            {t("form.subjectOptions.administrative")}
                          </SelectItem>
                          <SelectItem value="technical">
                            {t("form.subjectOptions.technical")}
                          </SelectItem>
                          <SelectItem value="other">
                            {t("form.subjectOptions.other")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {centerForm.formState.errors.subject_of_consultan && (
                    <p className="text-sm text-destructive">
                      {t(
                        `form.errors.${centerForm.formState.errors.subject_of_consultan.message}`
                      )}
                    </p>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("form.file")}
                  </label>
                  <Controller
                    name="file"
                    control={centerForm.control}
                    render={({ field }) => (
                      <FileUploader
                        value={field.value}
                        onChange={field.onChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("form.description")}
                </label>
                <Textarea
                  {...centerForm.register("description")}
                  placeholder={t("form.descriptionPlaceholder")}
                  rows={10}
                  className={cn(
                    centerForm.formState.errors.description &&
                      "h-36 border-destructive"
                  )}
                />
                {centerForm.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {t(
                      `form.errors.${centerForm.formState.errors.description.message}`
                    )}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="w-full sm:w-auto min-w-[150px]"
                >
                  {t("form.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto min-w-[150px] blue-gradient"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {t("form.submitting")}
                    </>
                  ) : (
                    t("form.submit")
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
