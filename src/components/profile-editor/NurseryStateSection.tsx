"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioFormData } from "@/types";
import { useTranslations } from "next-intl";

interface NurseryStateSectionProps {
  data: PortfolioFormData;
  onChange: (data: PortfolioFormData) => void;
}

export const NurseryStateSection = ({
  data,
  onChange,
}: NurseryStateSectionProps) => {
  const t = useTranslations("dashboard.profileEditor.nurseryState");

  const handleChange = (
    field: keyof PortfolioFormData["nursery_state"],
    value: string
  ) => {
    onChange({
      ...data,
      nursery_state: {
        ...data.nursery_state,
        [field]: value,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{t("title")}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Area */}
          <div>
            <Label htmlFor="area" className="mb-1 block">
              {t("area")}
            </Label>
            <Input
              id="area"
              type="text"
              value={data.nursery_state.area}
              onChange={(e) => handleChange("area", e.target.value)}
              placeholder={t("areaPlaceholder")}
            />
          </div>

          {/* Class Rooms */}
          <div>
            <Label htmlFor="class_rooms" className="mb-1 block">
              {t("classRooms")}
            </Label>
            <Input
              id="class_rooms"
              type="number"
              min={0}
              value={data.nursery_state.class_rooms}
              onChange={(e) => handleChange("class_rooms", e.target.value)}
              placeholder={t("classRoomsPlaceholder")}
            />
          </div>

          {/* Team Members */}
          <div>
            <Label htmlFor="team_members" className="mb-1 block">
              {t("teamMembers")}
            </Label>
            <Input
              id="team_members"
              type="number"
              min={0}
              value={data.nursery_state.team_members}
              onChange={(e) => handleChange("team_members", e.target.value)}
              placeholder={t("teamMembersPlaceholder")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
