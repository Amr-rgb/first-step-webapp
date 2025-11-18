"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

interface CreatePromocodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const promocodeSchema = z
  .object({
    title: z.string().min(1, "Coupon name is required"),
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

// Mock data - replace with actual API data
const mockCenters = [
  {
    id: 1,
    name: "حضانة عالم التعلم",
    branches: [
      { id: 10, name: "فرع الرياض" },
      { id: 11, name: "فرع جدة" },
      { id: 12, name: "فرع المدينة" },
    ],
  },
  {
    id: 2,
    name: "حضانة عالم التعلم",
    branches: [
      { id: 20, name: "فرع مكة" },
      { id: 21, name: "فرع الطائف" },
    ],
  },
];

export default function CreatePromocodeModal({
  isOpen,
  onClose,
}: CreatePromocodeModalProps) {
  const t = useTranslations("discountCodes.createModal");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const queryClient = useQueryClient();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCenters, setSelectedCenters] = useState<number[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [allowChildrenOnly, setAllowChildrenOnly] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(promocodeSchema),
    defaultValues: {
      title: "",
      percentage: 15,
      start_date: undefined,
      end_date: undefined,
      max_number_of_usage: 402,
      amount: 402,
    },
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

  const resetForm = () => {
    setStep(1);
    form.reset();
    setSelectedCenters([]);
    setSelectedBranches([]);
    setAllowChildrenOnly(false);
  };

  const onSubmit = (data: FormData) => {
    const payload = {
      title: data.title,
      percentage: data.percentage,
      start_date: format(data.start_date, "yyyy-MM-dd"),
      end_date: format(data.end_date, "yyyy-MM-dd"),
      max_number_of_usage: data.max_number_of_usage,
      kind_of_child: allowChildrenOnly ? "children" : "all",
      status: "active",
      color: "blue",
      amount: data.amount,
      center_ids: selectedCenters,
      branch_ids: selectedBranches,
    };

    createMutation.mutate(payload);
  };

  const handleCenterToggle = (centerId: number) => {
    setSelectedCenters((prev) =>
      prev.includes(centerId)
        ? prev.filter((id) => id !== centerId)
        : [...prev, centerId]
    );
  };

  const handleBranchToggle = (branchId: number) => {
    setSelectedBranches((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  };

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
            {step === 1 ? t("step1Title") : t("step2Title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6">
              {step === 1 ? (
                // Step 1: Coupon Details
                <div className="space-y-6">
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
                              date < new Date("1900-01-01")
                            }
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
                          {t("endDate")} <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            disabled={(date: any) =>
                              date < new Date("1900-01-01")
                            }
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
                                className="p-1 hover:bg-gray-100 rounded"
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
                              />
                              <button
                                type="button"
                                onClick={() => incrementValue("percentage")}
                                className="p-1 hover:bg-gray-100 rounded"
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
                                className="p-1 hover:bg-gray-100 rounded"
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
                              />
                              <button
                                type="button"
                                onClick={() => incrementValue("amount")}
                                className="p-1 hover:bg-gray-100 rounded"
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
                              className="p-1 hover:bg-gray-100 rounded"
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
                            />
                            <button
                              type="button"
                              onClick={() =>
                                incrementValue("max_number_of_usage")
                              }
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="w-5 h-5 text-primary" />
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Children Only Checkbox */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="childrenOnly"
                      checked={allowChildrenOnly}
                      onCheckedChange={(checked) =>
                        setAllowChildrenOnly(checked as boolean)
                      }
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
                          <Checkbox id="all-centers" />
                          <Label
                            htmlFor="all-centers"
                            className="cursor-pointer"
                          >
                            {t("allCentersAndBranches")}
                          </Label>
                        </div>
                        {mockCenters.map((center) => (
                          <div
                            key={center.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={`center-${center.id}`}
                              checked={selectedCenters.includes(center.id)}
                              onCheckedChange={() =>
                                handleCenterToggle(center.id)
                              }
                            />
                            <Label
                              htmlFor={`center-${center.id}`}
                              className="cursor-pointer flex items-center gap-2"
                            >
                              <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-green-400 rounded-full" />
                              {center.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Branches List */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-right">
                        {t("mainCenterBranches")}
                      </h3>
                      <div className="space-y-3 border rounded-lg p-4 max-h-96 overflow-y-auto">
                        <div className="flex items-center gap-2 pb-3 border-b">
                          <Checkbox id="all-branches" />
                          <Label
                            htmlFor="all-branches"
                            className="cursor-pointer"
                          >
                            {t("allBranches")}
                          </Label>
                        </div>
                        {mockCenters.flatMap((center) =>
                          center.branches.map((branch) => (
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
                              />
                              <Label
                                htmlFor={`branch-${branch.id}`}
                                className="cursor-pointer"
                              >
                                {branch.name}
                              </Label>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Return Button */}
                  <div className="text-center">
                    <Input
                      placeholder={t("returnPlaceholder")}
                      className="text-center"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-4">
              {step === 1 ? (
                <>
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={createMutation.isPending}
                  >
                    {t("cancel")}
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
                    disabled={createMutation.isPending}
                  >
                    {t("back")}
                  </Button>
                  <Button
                    size="sm"
                    type="submit"
                    className="flex-1 bg-primary"
                    disabled={
                      createMutation.isPending ||
                      (selectedCenters.length === 0 &&
                        selectedBranches.length === 0)
                    }
                  >
                    {createMutation.isPending
                      ? t("creating")
                      : t("createCoupon")}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
