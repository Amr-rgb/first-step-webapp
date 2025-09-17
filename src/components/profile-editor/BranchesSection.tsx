"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { PortfolioFormData } from "@/types";
import { useTranslations } from "next-intl";

interface BranchesSectionProps {
  data: PortfolioFormData;
  onChange: (data: PortfolioFormData) => void;
}

export const BranchesSection = ({ data, onChange }: BranchesSectionProps) => {
  const t = useTranslations("profileEditor.branches");
  const [newBranchName, setNewBranchName] = useState("");

  const addBranch = () => {
    if (newBranchName.trim()) {
      onChange({
        ...data,
        branches: [...data.branches, { branch_name: newBranchName.trim() }],
      });
      setNewBranchName("");
    }
  };

  const removeBranch = (index: number) => {
    onChange({
      ...data,
      branches: data.branches.filter((_, i) => i !== index),
    });
  };

  const updateBranch = (index: number, branch_name: string) => {
    const updatedBranches = [...data.branches];
    updatedBranches[index] = { branch_name };
    onChange({
      ...data,
      branches: updatedBranches,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-4 py-3 sm:px-6">
        <CardTitle className="text-lg font-semibold">
          {t("branchesTitle")}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-5">
        {/* Add branch input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            placeholder={t("branchNamePlaceholder")}
            onKeyDown={(e) => e.key === "Enter" && addBranch()}
            className="flex-1"
          />
          <Button
            onClick={addBranch}
            size="icon"
            className="rounded-full w-9 h-9 sm:self-start"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Branch list */}
        {data.branches.length > 0 ? (
          <div className="space-y-3">
            {data.branches.map((branch, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center"
              >
                <Input
                  value={branch.branch_name}
                  onChange={(e) => updateBranch(index, e.target.value)}
                  placeholder={t("branchNamePlaceholder")}
                  className="flex-1"
                />
                <Button
                  onClick={() => removeBranch(index)}
                  variant="outline"
                  size="icon"
                  className="rounded-full w-9 h-9 !border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-6">
            {t("noBranches")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
