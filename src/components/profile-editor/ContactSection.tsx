"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioFormData } from "@/types";
import { useTranslations } from "next-intl";

interface ContactSectionProps {
  data: PortfolioFormData;
  onChange: (data: PortfolioFormData) => void;
}

export const ContactSection = ({ data, onChange }: ContactSectionProps) => {
  const t = useTranslations("dashboard.profileEditor.contact");

  const handleChange = (
    field: keyof typeof data.contact_info,
    value: string
  ) => {
    onChange({
      ...data,
      contact_info: {
        ...data.contact_info,
        [field]: value,
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-4 py-3 sm:px-6">
        <CardTitle className="text-lg font-semibold">{t("title")}</CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">{t("address")}</Label>
          <Textarea
            id="address"
            value={data.contact_info.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder={t("addressPlaceholder")}
            rows={3}
          />
        </div>

        {/* Working hours + phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="working_hours">{t("workingHours")}</Label>
            <Input
              id="working_hours"
              value={data.contact_info.working_hours}
              onChange={(e) => handleChange("working_hours", e.target.value)}
              placeholder={t("workingHoursPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">{t("phoneNumber")}</Label>
            <Input
              id="phone_number"
              value={data.contact_info.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              placeholder={t("phoneNumberPlaceholder")}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email_address">{t("emailAddress")}</Label>
          <Input
            id="email_address"
            type="email"
            value={data.contact_info.email_address}
            onChange={(e) => handleChange("email_address", e.target.value)}
            placeholder={t("emailAddressPlaceholder")}
          />
        </div>

        {/* Social Media */}
        {/* <div className="space-y-4">
          <h4 className="font-semibold text-base">{t("socialMedia")}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">{t("facebook")}</Label>
              <Input
                id="facebook"
                value={data.contact_info.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
                placeholder={t("facebookPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">{t("instagram")}</Label>
              <Input
                id="instagram"
                value={data.contact_info.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                placeholder={t("instagramPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">{t("whatsapp")}</Label>
              <Input
                id="whatsapp"
                value={data.contact_info.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder={t("whatsappPlaceholder")}
              />
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
};
