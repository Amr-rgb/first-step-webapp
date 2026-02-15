"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

interface ProfileWaitingPageProps {
  nurseryName: string;
  locale?: string;
  userRole?: "admin" | "parent" | "center";
}

const ProfileWaitingPage = ({
  nurseryName,
  locale,
  userRole = "parent",
}: ProfileWaitingPageProps) => {
  const currentLocale = locale || "en";
  const t = useTranslations("nurseryDetails.waitingPage");

  const getContent = () => {
    switch (userRole) {
      case "admin":
        return {
          actionText: t("goToAdminDashboard"),
          actionHref: `/${currentLocale}/dashboard/admin`,
          arabicTitle: t("adminTitle"),
          arabicSubtitle: t("adminSubtitle"),
        };
      case "center":
        return {
          actionText: t("completeProfile"),
          actionHref: `/${currentLocale}/dashboard/center/profile-editor`,
          arabicTitle: t("centerTitle"),
          arabicSubtitle: t("centerSubtitle"),
        };
      default: // parent
        return {
          actionText: t("browseNurseries"),
          actionHref: `/${currentLocale}/nurseries`,
          arabicTitle: t("parentTitle"),
          arabicSubtitle: t("parentSubtitle"),
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      {/* Centered Image */}
      <div className="mb-12 flex justify-center">
        <Image
          src="/assets/general/waitingImage.png"
          alt="Waiting"
          width={400}
          height={400}
          className="w-80 h-80 object-contain"
        />
      </div>

      {/* Arabic Text Section */}
      {currentLocale === "ar" && (
        <div className="text-center max-w-2xl">
          <h1 className="text-3xl font-bold text-black mb-4 font-noto-sans">
            {content.arabicTitle}
          </h1>
          <p className="text-gray-600 text-lg font-noto-sans mb-8">
            {content.arabicSubtitle}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href={content.actionHref}>
              <Button className="px-8 py-3 text-lg w-full" size="lg">
                {content.actionText}
              </Button>
            </Link>

            {/* Additional button for centers */}
            {userRole === "center" && (
              <Link href={`/${currentLocale}/dashboard/center`}>
                <Button
                  variant="outline"
                  className="px-8 py-3 text-lg w-full"
                  size="lg"
                >
                  {t("goToDashboard")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* English Text Section */}
      {currentLocale === "en" && (
        <div className="text-center max-w-2xl">
          <h1 className="text-3xl font-bold text-black mb-4">
            {userRole === "parent"
              ? t("parentTitle")
              : userRole === "center"
                ? t("centerTitle")
                : t("adminTitle")}
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            {userRole === "parent"
              ? t("parentSubtitle")
              : userRole === "center"
                ? t("centerSubtitle")
                : t("adminSubtitle")}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href={content.actionHref}>
              <Button className="px-8 py-3 text-lg w-full" size="lg">
                {content.actionText}
              </Button>
            </Link>

            {/* Additional button for centers */}
            {userRole === "center" && (
              <Link href={`/${currentLocale}/dashboard/center`}>
                <Button
                  variant="outline"
                  className="px-8 py-3 text-lg w-full"
                  size="lg"
                >
                  {t("goToDashboard")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileWaitingPage;
