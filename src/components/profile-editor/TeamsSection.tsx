"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Plus, Trash2 } from "lucide-react";
import { PortfolioFormData } from "@/types";
import { useTranslations } from "next-intl";

interface TeamsSectionProps {
  data: PortfolioFormData;
  onChange: (data: PortfolioFormData) => void;
}

export const TeamsSection = ({ data, onChange }: TeamsSectionProps) => {
  const t = useTranslations("dashboard.profileEditor.teams");

  const addTeamMember = () => {
    onChange({
      ...data,
      teams: [...data.teams, { name: "", mission: "", image: "" }],
    });
  };

  const updateTeamMember = (
    index: number,
    field: string,
    value: string | File
  ) => {
    const updatedTeams = [...data.teams];
    updatedTeams[index] = { ...updatedTeams[index], [field]: value };

    onChange({
      ...data,
      teams: updatedTeams,
    });
  };

  const removeTeamMember = (index: number) => {
    onChange({
      ...data,
      teams: data.teams.filter((_, i) => i !== index),
    });
  };

  return (
    <Card className="shadow-none border-0">
      <CardHeader className="p-0">
        <div className="flex justify-end items-center">
          <Button
            onClick={addTeamMember}
            size="icon"
            className="rounded-full w-9 h-9 sm:self-start"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-0 pt-4">
        {data.teams.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            {t("noTeamMembers")}
          </p>
        ) : (
          data.teams.map((member, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">
                    {t("teamMember")} {index + 1}
                  </h4>

                  <Button
                    onClick={() => removeTeamMember(index)}
                    variant="outline"
                    size="icon"
                    className="rounded-full w-9 h-9 !border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                <div>
                  <Label>{t("memberName")}</Label>
                  <Input
                    value={member.name}
                    onChange={(e) =>
                      updateTeamMember(index, "name", e.target.value)
                    }
                    placeholder={t("memberNamePlaceholder")}
                  />
                </div>

                <div>
                  <Label>{t("memberMission")}</Label>
                  <Textarea
                    value={member.mission}
                    onChange={(e) =>
                      updateTeamMember(index, "mission", e.target.value)
                    }
                    placeholder={t("memberMissionPlaceholder")}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>{t("memberImage")}</Label>
                  <ImageUploader
                    value={
                      typeof member.image === "string"
                        ? member.image
                        : member.image || null
                    }
                    onChange={(file) =>
                      updateTeamMember(index, "image", file || "")
                    }
                    accept="image/*"
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};
