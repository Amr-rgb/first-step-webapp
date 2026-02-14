"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsAuthenticated } from "@/store/authStore";
import { dashboardIcons } from "@/components/general/icons";
import { useQuery } from "@tanstack/react-query";
import { getBranchesForCenterAction } from "@/actions/nurseryActions";
import { useMemo } from "react";

interface EstablishmentHeaderProps {
  name: string;
  tagline: string;
  logo: string;
  rating?: number;
  centerId: string | number;
}

const EstablishmentHeader = ({
  name,
  tagline,
  logo,
  rating = 4.5,
  centerId,
}: EstablishmentHeaderProps) => {
  const t = useTranslations("nurseryDetails.header");
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  const { data: branchesResponse } = useQuery({
    queryKey: ["branches-for-center", centerId],
    queryFn: () => getBranchesForCenterAction(centerId.toString()),
    enabled: !!centerId,
  });

  const branchesNames = useMemo(() => {
    return (branchesResponse?.data || [])
      .map((b: any) => b.nursery_name || b.name)
      .filter(Boolean)
      .join("، ");
  }, [branchesResponse]);

  const handleChatClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard/parent/chat");
    } else {
      router.push("/sign-in");
    }
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: name,
          text: tagline,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You might want to show a toast here
    }
  };

  return (
    <div className="container mx-auto px-4 py-15 bg-white overflow-hidden">
      <div className="relative flex flex-col md:flex-row items-center gap-8">
        {/* Logo Section */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
            {logo ? (
              <Image
                src={logo}
                alt={name}
                fill
                className="object-contain p-4"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 italic text-gray-400">
                Logo
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-y-8 md:flex-row items-center md:items-start justify-center md:justify-between">
          {/* Center Section: Title and Tagline */}
          <div className="text-center md:ltr:text-left md:rtl:text-right">
            <h1 className="text-3xl md:text-3xl font-bold text-primary mb-4 leading-tight">
              {name}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <dashboardIcons.branch className="w-5 h-5 text-primary" />
              <p className="text-lg md:text-xl text-mid-gray max-w-2xl font-medium leading-relaxed">
                {t("branches")}: {branchesNames || tagline}
              </p>
            </div>
          </div>

          {/* Rating and Social Buttons Section */}
          <div className="flex md:flex-col justify-between items-center md:items-end gap-6 min-w-[120px]">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-500">
                {rating.toFixed(1)}
              </span>
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            </div>

            {/* Action Buttons */}
            <div className="md:absolute bottom-0 flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 text-mid-gray border-light-gray!"
                onClick={handleChatClick}
              >
                <dashboardIcons.multiChat />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 text-mid-gray border-light-gray!"
                onClick={handleShareClick}
              >
                <dashboardIcons.multiShare />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentHeader;
