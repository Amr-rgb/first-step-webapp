"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useBranches } from "@/hooks/useBranches";
import { centerService } from "@/services/dashboardApi";
import { BranchPricingData, PricingFormData, Branch } from "@/types";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/multi-select";

interface PlansSectionProps {
  data?: any;
  onChange?: (data: any) => void;
}

export const PlansSection = ({ data, onChange }: PlansSectionProps) => {
  const t = useTranslations("dashboard.profileEditor.plans");
  const queryClient = useQueryClient();
  const { data: branches, isLoading: branchesLoading } = useBranches();

  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingFormData | null>(null);

  const [formData, setFormData] = useState<PricingFormData>({
    enrollment_type: "",
    title: "",
    start_age: 0,
    end_age: 0,
    count: 0,
    price_amount: 0,
  });

  // React Query for branch pricing data
  const { data: branchPricing = [], isLoading: isPricingLoading } = useQuery<
    PricingFormData[]
  >({
    queryKey: ["branchPricing", selectedBranchId],
    queryFn: async () => {
      if (!selectedBranchId) return [];
      const response = await centerService.getBranchPricing(
        selectedBranchId.toString()
      );
      return response.data || [];
    },
    enabled: !!selectedBranchId,
    staleTime: 2 * 60 * 1000,
  });

  // Save pricing mutation
  const savePricingMutation = useMutation({
    mutationFn: async (payload: BranchPricingData[]) => {
      return await centerService.savePricing(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["branchPricing"],
      });
      setIsDialogOpen(false);
      toast.success(t("planSaved"));
    },
    onError: () => toast.error(t("planSaveError")),
  });

  // Select first branch automatically
  useEffect(() => {
    if (branches && branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id);
    }
  }, [branches, selectedBranchId]);

  const resetForm = () =>
    setFormData({
      enrollment_type: "",
      title: "",
      start_age: 0,
      end_age: 0,
      count: 0,
      price_amount: 0,
    });

  const handleAddPlan = () => {
    setEditingPlan(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: PricingFormData) => {
    setEditingPlan(plan);
    setFormData(plan);
    setIsDialogOpen(true);
  };

  const handleSavePlan = () => {
    if (selectedBranchIds.length === 0 && !editingPlan) {
      toast.error(t("selectBranchesError"));
      return;
    }

    const branchesToUpdate = (
      editingPlan ? [selectedBranchId] : selectedBranchIds
    ).map((branchId) => {
      const updatedPricing = editingPlan
        ? branchPricing.map((p: PricingFormData) =>
            p.id === editingPlan.id ? formData : p
          )
        : [formData];

      return {
        branch_id: Number(branchId),
        prices: updatedPricing,
      };
    });

    savePricingMutation.mutate(branchesToUpdate);
  };

  const handleDeletePlan = (planId: number) => {
    if (!selectedBranchId) return;

    const updatedPricing = branchPricing.filter((p) => p.id !== planId);
    const payload: BranchPricingData[] = [
      { branch_id: selectedBranchId, prices: updatedPricing },
    ];

    // savePricingMutation.mutate(payload);
  };

  if (branchesLoading) {
    return <div className="text-center py-4">{t("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-none border-0">
        <CardContent className="space-y-6 p-0">
          {/* Branch Selector */}
          <div>
            <Label>{t("selectBranch")}</Label>
            <Select
              value={selectedBranchId?.toString()}
              onValueChange={(value) => setSelectedBranchId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectBranchPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {branches?.map((branch: Branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Plans List */}
          {selectedBranchId && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">{t("plans")}</h3>
                <Button
                  onClick={handleAddPlan}
                  size="icon"
                  className="rounded-full w-9 h-9 sm:self-start"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {isPricingLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground text-sm">
                    {t("loading")}
                  </p>
                </div>
              ) : branchPricing.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {t("noPlansYet")}
                </p>
              ) : (
                <div className="space-y-3">
                  {branchPricing.map((plan) => (
                    <Card key={plan.id} className="p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{plan.title}</h4>
                          {/* <p className="text-sm text-muted-foreground">
                            {t("ageRange", {
                              start: plan.start_age,
                              end: plan.end_age,
                            })}
                          </p>
                          <p className="text-sm">
                            {t("priceAmount", { amount: plan.price_amount })}
                          </p> */}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditPlan(plan)}
                            variant="outline"
                            size="icon"
                            className="rounded-full w-9 h-9"
                          >
                            <Edit className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={() => handleDeletePlan(plan.id!)}
                            variant="destructive"
                            size="icon"
                            className="rounded-full w-9 h-9"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit Plan */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? t("editPlan") : t("addPlan")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Branches (only when adding new) */}
            {!editingPlan && (
              <div>
                <Label>{t("branches")}</Label>
                <MultiSelect
                  options={
                    branches?.map((branch: Branch) => ({
                      label: branch.name,
                      value: branch.id.toString(),
                    })) || []
                  }
                  selected={selectedBranchIds}
                  onChange={setSelectedBranchIds}
                  placeholder={t("selectBranchesPlaceholder")}
                />
              </div>
            )}

            {/* Title */}
            <div>
              <Label>{t("planTitle")}</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder={t("planTitlePlaceholder")}
              />
            </div>

            {/* Age Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("startAge")}</Label>
                <Input
                  type="number"
                  value={formData.start_age}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      start_age: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>{t("endAge")}</Label>
                <Input
                  type="number"
                  value={formData.end_age}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      end_age: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Enrollment Type */}
            <div>
              <Label>{t("enrollmentType")}</Label>
              <Select
                value={formData.enrollment_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, enrollment_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectEnrollmentType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">{t("year")}</SelectItem>
                  <SelectItem value="month">{t("month")}</SelectItem>
                  <SelectItem value="week">{t("week")}</SelectItem>
                  <SelectItem value="day">{t("day")}</SelectItem>
                  <SelectItem value="hour">{t("hour")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Count & Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("count")}</Label>
                <Input
                  type="number"
                  value={formData.count}
                  onChange={(e) =>
                    setFormData({ ...formData, count: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>{t("price")}</Label>
                <Input
                  type="number"
                  value={formData.price_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_amount: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={savePricingMutation.isPending}
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleSavePlan}
                disabled={savePricingMutation.isPending}
                className="gap-2"
              >
                {savePricingMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t("saving")}
                  </>
                ) : (
                  t("save")
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
