"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Star, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsAuthenticated } from "@/store/authStore";

interface NurseryHeaderProps {
  name: string;
  tagline: string;
  logo: string;
  rating?: number;
}

const NurseryHeader = ({
  name,
  tagline,
  logo,
  rating = 4.5,
}: NurseryHeaderProps) => {
  const t = useTranslations("nurseryDetails.header");
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

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
    <div className="w-full py-8 px-4 md:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Logo Section */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0">
          <div className="w-full h-full rounded-full border-4 border-gray-50 shadow-sm overflow-hidden bg-white relative">
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

        {/* Center Section: Title and Tagline */}
        <div className="flex-1 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2D3A82] mb-4 leading-tight">
            {name}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {tagline}
          </p>
        </div>

        {/* Rating and Social Buttons Section */}
        <div className="flex flex-col items-center md:items-start gap-6 min-w-[120px]">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-500">
              {rating.toFixed(1)}
            </span>
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 text-mid-gray border-light-gray!"
              onClick={handleShareClick}
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 text-mid-gray border-light-gray!"
              onClick={handleChatClick}
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseryHeader;
