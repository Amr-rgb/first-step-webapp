"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { X, Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DatePicker from "@/components/general/DatePicker";
import { adminService } from "@/services/promocodeService";
import { adminService as dashboardAdminService } from "@/services/dashboardApi";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

interface CreatePromocodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  promocodeId?: string | null;
  isViewMode?: boolean;
  onSwitchToEdit?: () => void;
}

const COLORS = [
  "#B12F53", // Rose
  "#D9534F", // Peach
  "#83CBAA", // Sage
  "#2B3990", // Blue
];

const promocodeSchema = z
  .object({
    title: z.string().min(1, "Coupon name is required"),
    description: z.string().min(1, "Description is required"),
    percentage: z.number().min(0).max(100),
    start_date: z.date({ required_error: "Start date is required" }),
    end_date: z.date({ required_error: "End date is required" }),
    max_number_of_usage: z.number().min(1),
    amount: z.number().min(0),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "End date must be after start date",
    path: ["end_date"],
  });

type FormData = z.infer<typeof promocodeSchema>;

interface Center {
  id: number;
  nursery_name: string;
  logo: string;
  branches: Array<{
    id: number;
    name: string;
    nursery_name: string;
  }>;
}

const defaultValues: Partial<FormData> = {
  title: "",
  description: "",
  percentage: 15,
  start_date: undefined,
  end_date: undefined,
  max_number_of_usage: 402,
  amount: 402,
};

export default function CreatePromocodeModal({
  isOpen,
  onClose,
  promocodeId,
  isViewMode = false,
  onSwitchToEdit,
}: CreatePromocodeModalProps) {
  const t = useTranslations("discountCodes.createModal");
  const locale = useLocale();
  const queryClient = useQueryClient();

  const { data: centersData, isLoading: centersLoading } = useQuery({
    queryKey: ["centers"],
    queryFn: dashboardAdminService.getCenters,
    enabled: isOpen,
  });

  const { data: promocodeData, isLoading: promocodeLoading } = useQuery({
    queryKey: ["promocode", promocodeId],
    queryFn: () =>
      promocodeId
        ? adminService.getPromocode(promocodeId)
        : Promise.resolve(null),
    enabled: !!promocodeId && isOpen,
  });

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCenters, setSelectedCenters] = useState<number[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [allowChildrenOnly, setAllowChildrenOnly] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(
    COLORS[Math.floor(Math.random() * COLORS.length)]
  );
  const [selectAllCenters, setSelectAllCenters] = useState(false);
  const [selectAllBranches, setSelectAllBranches] = useState(false);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [isFormReady, setIsFormReady] = useState(!promocodeId);
  const [activeCenterId, setActiveCenterId] = useState<number | null>(null);

  const centers: Center[] = centersData || [];

  const effectiveActiveCenterId = activeCenterId ?? centers[0]?.id;

  const filteredBranches = useMemo(() => {
    if (!effectiveActiveCenterId) return [];
    const activeCenter = centers.find((c) => c.id === effectiveActiveCenterId);
    return activeCenter ? activeCenter.branches : [];
  }, [centers, effectiveActiveCenterId]);

  const form = useForm<FormData>({
    resolver: zodResolver(promocodeSchema),
    defaultValues,
  });

  const createMutation = useMutation({
    mutationFn: adminService.createPromocode,
    onSuccess: () => {
      toast.success(t("success"));
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || t("error"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminService.updatePromocode(promocodeId!, data),
    onSuccess: () => {
      toast.success(t("successUpdate") || "Promocode updated successfully");
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || t("error"));
    },
  });

  const statusMutation = useMutation({
    mutationFn: (newStatus: "active" | "inactive") =>
      adminService.updateStatus(promocodeId!, { status: newStatus }),
    onSuccess: (_, newStatus) => {
      setStatus(newStatus);
      toast.success(t("statusUpdated") || "Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
    },
    onError: (error: any) => {
      toast.error(error.message || t("error"));
    },
  });

  const resetForm = () => {
    setStep(1);
    form.reset(defaultValues as FormData);
    setSelectedCenters([]);
    setSelectedBranches([]);
    setAllowChildrenOnly(false);
    setSelectedColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setStatus("active");
    setActiveCenterId(null);
  };

  useEffect(() => {
    if (isOpen) {
      if (promocodeId && promocodeData) {
        // Edit Mode: Populate from backend data
        const data = promocodeData.data || promocodeData;
        setStep(1);
        form.reset({
          title: data.title,
          description: data.description || "",
          percentage: Number(data.percentage),
          start_date: new Date(data.start_date),
          end_date: new Date(data.end_date),
          max_number_of_usage: Number(data.max_number_of_usage),
          amount: Number(data.amount),
        });
        setAllowChildrenOnly(data.kind_of_child === "new-child");
        setSelectedColor(data.color || COLORS[0]);

        const centerIds =
          data.center_ids?.map(Number) ||
          data.centers?.map((c: any) => c.id) ||
          [];
        const branchIds =
          data.branch_ids?.map(Number) ||
          data.branches?.map((b: any) => b.id) ||
          [];

        setSelectedCenters(centerIds);
        setSelectedBranches(branchIds);
        if (centerIds.length > 0) {
          setActiveCenterId(centerIds[0]);
        }
        setStatus(data.status === "active" ? "active" : "inactive");
        setIsFormReady(true);
      } else if (!promocodeId) {
        // Create Mode: Reset form (includes random color)
        resetForm();
        setIsFormReady(true);
      }
    }
  }, [isOpen, promocodeData, promocodeId, form]);

  const onSubmit = (data: FormData) => {
    const payload = {
      title: data.title,
      description: data.description,
      percentage: data.percentage,
      start_date: format(data.start_date, "yyyy-MM-dd"),
      end_date: format(data.end_date, "yyyy-MM-dd"),
      max_number_of_usage: data.max_number_of_usage,
      kind_of_child: allowChildrenOnly ? "new-child" : "all",
      status: status, // Use current status state
      color: selectedColor,
      amount: data.amount,
      center_ids: selectedCenters,
      branch_ids: selectedBranches,
    };

    if (promocodeId) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleCenterToggle = (centerId: number) => {
    setSelectedCenters((prev) =>
      prev.includes(centerId)
        ? prev.filter((id) => id !== centerId)
        : [...prev, centerId]
    );
    setActiveCenterId(centerId);
  };

  const handleBranchToggle = (branchId: number) => {
    setSelectedBranches((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  };

  const handleSelectAllCenters = (checked: boolean) => {
    setSelectAllCenters(checked);
    if (checked) {
      setSelectedCenters(centers.map((c) => c.id));
    } else {
      setSelectedCenters([]);
    }
  };

  const handleSelectAllBranches = (checked: boolean) => {
    setSelectAllBranches(checked);
    const visibleBranchIds = filteredBranches.map((b) => b.id);

    if (checked) {
      // Add visible branches to selection without removing others
      setSelectedBranches((prev) => {
        const newSet = new Set(prev);
        visibleBranchIds.forEach((id) => newSet.add(id));
        return Array.from(newSet);
      });
    } else {
      // Remove visible branches from selection
      const visibleIdsSet = new Set(visibleBranchIds);
      setSelectedBranches((prev) =>
        prev.filter((id) => !visibleIdsSet.has(id))
      );
    }
  };

  useEffect(() => {
    if (filteredBranches.length > 0) {
      setSelectAllBranches(
        filteredBranches.every((b) => selectedBranches.includes(b.id))
      );
    } else {
      setSelectAllBranches(false);
    }
  }, [selectedBranches, filteredBranches]);

  const incrementValue = (
    field: "percentage" | "amount" | "max_number_of_usage"
  ) => {
    const currentValue = form.getValues(field);
    form.setValue(field, currentValue + 1);
  };

  const decrementValue = (
    field: "percentage" | "amount" | "max_number_of_usage"
  ) => {
    const currentValue = form.getValues(field);
    form.setValue(field, Math.max(0, currentValue - 1));
  };

  const handleStep1Continue = async () => {
    const isValid = await form.trigger([
      "title",
      "start_date",
      "end_date",
      "percentage",
      "amount",
      "max_number_of_usage",
    ]);
    if (isValid) {
      setStep(2);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">
            {promocodeId
              ? isViewMode
                ? t("viewTitle") || "View Coupon Details"
                : t("editTitle") || "Edit Coupon Details"
              : step === 1
              ? t("step1Title")
              : t("step2Title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        {promocodeId && !isFormReady ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="p-6">
                {step === 1 ? (
                  // Step 1: Coupon Details
                  <div className="space-y-6">
                    {/* Status Toggle - Only in Edit Mode */}
                    {promocodeId && (
                      <div className="flex items-center justify-between mb-6">
                        <Label className="text-base font-medium">
                          {t("couponStatus") || "Coupon Status"}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Switch
                          checked={status === "active"}
                          onCheckedChange={(checked) =>
                            statusMutation.mutate(
                              checked ? "active" : "inactive"
                            )
                          }
                          disabled={statusMutation.isPending || isViewMode}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>
                    )}

                    {/* Coupon Name */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("couponName")}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t("couponNamePlaceholder")}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Coupon Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("couponDescription")}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t("couponDescriptionPlaceholder")}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Start Date */}
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("startDate")}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value}
                              onChange={field.onChange}
                              disabled={(date: any) =>
                                isViewMode || date < new Date("1900-01-01")
                              }
                              inputDisabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* End Date */}
                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("endDate")}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value}
                              onChange={field.onChange}
                              disabled={(date: any) =>
                                isViewMode || date < new Date("1900-01-01")
                              }
                              inputDisabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Percentage and Amount */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="percentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("percentage")}{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2 border rounded-lg p-3">
                                <button
                                  type="button"
                                  onClick={() => decrementValue("percentage")}
                                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                  disabled={isViewMode}
                                >
                                  <Minus className="w-5 h-5 text-gray-600" />
                                </button>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value))
                                  }
                                  className="flex-1 text-center border-0 focus-visible:ring-0 p-0"
                                  disabled={isViewMode}
                                />
                                <button
                                  type="button"
                                  onClick={() => incrementValue("percentage")}
                                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                  disabled={isViewMode}
                                >
                                  <Plus className="w-5 h-5 text-primary" />
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("amount")}{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2 border rounded-lg p-3">
                                <button
                                  type="button"
                                  onClick={() => decrementValue("amount")}
                                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                  disabled={isViewMode}
                                >
                                  <Minus className="w-5 h-5 text-gray-600" />
                                </button>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value))
                                  }
                                  className="flex-1 text-center border-0 focus-visible:ring-0 p-0"
                                  disabled={isViewMode}
                                />
                                <button
                                  type="button"
                                  onClick={() => incrementValue("amount")}
                                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                  disabled={isViewMode}
                                >
                                  <Plus className="w-5 h-5 text-primary" />
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Max Usage */}
                    <FormField
                      control={form.control}
                      name="max_number_of_usage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("maxUsage")}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2 border rounded-lg p-3">
                              <button
                                type="button"
                                onClick={() =>
                                  decrementValue("max_number_of_usage")
                                }
                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                disabled={isViewMode}
                              >
                                <Minus className="w-5 h-5 text-gray-600" />
                              </button>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                className="flex-1 text-center border-0 focus-visible:ring-0 p-0"
                                disabled={isViewMode}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  incrementValue("max_number_of_usage")
                                }
                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                disabled={isViewMode}
                              >
                                <Plus className="w-5 h-5 text-primary" />
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Color Selection */}
                    <div className="space-y-3">
                      <Label>
                        {t("couponDesign")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-4">
                        {COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() =>
                              !isViewMode && setSelectedColor(color)
                            }
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform ${
                              !isViewMode ? "hover:scale-105" : "cursor-default"
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            {selectedColor === color && (
                              <Check
                                className="w-6 h-6 text-white"
                                strokeWidth={3}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Children Only Checkbox */}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="childrenOnly"
                        checked={allowChildrenOnly}
                        onCheckedChange={(checked) =>
                          setAllowChildrenOnly(checked as boolean)
                        }
                        disabled={isViewMode}
                      />
                      <Label htmlFor="childrenOnly" className="cursor-pointer">
                        {t("childrenOnly")}
                      </Label>
                    </div>
                  </div>
                ) : (
                  // Step 2: Select Centers and Branches
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Centers List */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-right">
                          {t("centersAndNurseries")}
                        </h3>
                        <div className="space-y-3 border rounded-lg p-4 max-h-96 overflow-y-auto">
                          <div className="flex items-center gap-2 pb-3 border-b">
                            <Checkbox
                              id="all-centers"
                              checked={selectAllCenters}
                              onCheckedChange={handleSelectAllCenters}
                              disabled={isViewMode}
                            />
                            <Label
                              htmlFor="all-centers"
                              className="cursor-pointer"
                            >
                              {t("allCentersAndBranches")}
                            </Label>
                          </div>
                          {centersLoading ? (
                            <div className="text-center py-4 text-gray-500">
                              {t("loading") || "Loading..."}
                            </div>
                          ) : centers.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                              {t("noCenters") || "No centers available"}
                            </div>
                          ) : (
                            centers.map((center) => {
                              const isSelected = selectedCenters.includes(
                                center.id
                              );
                              const isActive =
                                center.id === effectiveActiveCenterId;
                              const rowClass = isActive
                                ? "bg-blue-50 border-blue-200"
                                : "hover:bg-gray-50 border-transparent";

                              return (
                                <div
                                  key={center.id}
                                  className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${rowClass}`}
                                  onClick={() => setActiveCenterId(center.id)}
                                >
                                  <Checkbox
                                    id={`center-${center.id}`}
                                    checked={isSelected}
                                    onCheckedChange={() =>
                                      handleCenterToggle(center.id)
                                    }
                                    disabled={isViewMode}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <Label
                                    htmlFor={`center-${center.id}`}
                                    className="cursor-pointer flex items-center gap-2 w-full pointer-events-none"
                                  >
                                    {center.logo ? (
                                      <img
                                        src={center.logo}
                                        alt={center.nursery_name}
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-green-400 rounded-full" />
                                    )}
                                    {center.nursery_name}
                                  </Label>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Branches List */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-right">
                          {t("mainCenterBranches")}
                        </h3>
                        <div className="space-y-3 border rounded-lg p-4 max-h-96 overflow-y-auto">
                          <div className="flex items-center gap-2 pb-3 border-b">
                            <Checkbox
                              id="all-branches"
                              checked={selectAllBranches}
                              onCheckedChange={handleSelectAllBranches}
                              disabled={isViewMode}
                            />
                            <Label
                              htmlFor="all-branches"
                              className="cursor-pointer"
                            >
                              {t("allBranches")}
                            </Label>
                          </div>
                          {centersLoading ? (
                            <div className="text-center py-4 text-gray-500">
                              {t("loading") || "Loading..."}
                            </div>
                          ) : filteredBranches.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                              {selectedCenters.length === 0 &&
                              selectedBranches.length === 0
                                ? t("selectCenterFirst") ||
                                  "Select a center to view branches"
                                : t("noBranches") || "No branches available"}
                            </div>
                          ) : (
                            filteredBranches.map((branch) => (
                              <div
                                key={branch.id}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`branch-${branch.id}`}
                                  checked={selectedBranches.includes(branch.id)}
                                  onCheckedChange={() =>
                                    handleBranchToggle(branch.id)
                                  }
                                  disabled={isViewMode}
                                />
                                <Label
                                  htmlFor={`branch-${branch.id}`}
                                  className="cursor-pointer"
                                >
                                  {branch.nursery_name}
                                </Label>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-4">
                {step === 1 ? (
                  <>
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                    >
                      {isViewMode ? t("close") || "Close" : t("cancel")}
                    </Button>
                    <Button
                      size="sm"
                      type="button"
                      onClick={handleStep1Continue}
                      className="flex-1 bg-primary"
                    >
                      {t("continue")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                    >
                      {t("back")}
                    </Button>
                    {isViewMode ? (
                      <Button
                        size="sm"
                        type="button"
                        onClick={onSwitchToEdit}
                        className="flex-1 bg-primary"
                      >
                        {t("edit") || "Edit"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        type="submit"
                        className="flex-1 bg-primary"
                        disabled={
                          createMutation.isPending ||
                          updateMutation.isPending ||
                          (selectedCenters.length === 0 &&
                            selectedBranches.length === 0)
                        }
                      >
                        {createMutation.isPending || updateMutation.isPending
                          ? promocodeId
                            ? t("updating") || "Updating..."
                            : t("creating")
                          : promocodeId
                          ? t("updateCoupon") || "Update Coupon"
                          : t("createCoupon")}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
