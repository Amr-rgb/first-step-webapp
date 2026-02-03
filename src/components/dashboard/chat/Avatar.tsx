"use client";

import React, { useState } from "react";
import Image from "next/image";

interface AvatarProps {
  name: string;
  type: "admin" | "center" | "parent";
  avatar?: string;
  logo?: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  type,
  avatar,
  logo,
  size = "md",
  isOnline = false,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);

  // Size configurations
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10 md:w-12 md:h-12",
    lg: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-xs md:text-sm",
    lg: "text-lg",
  };

  const onlineIndicatorSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3 md:w-4 md:h-4",
    lg: "w-5 h-5",
  };

  // Get the first letter of the name for fallback
  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  // Get background color based on type
  const getBackgroundColor = () => {
    switch (type) {
      case "admin":
        return "bg-gradient-to-br from-red-500 to-red-600";
      case "center":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "parent":
        return "bg-gradient-to-br from-green-500 to-green-600";
      default:
        return "bg-gradient-to-br from-gray-500 to-gray-600";
    }
  };

  // Get the image source based on type and available assets
  const getImageSource = () => {
    if (type === "admin") {
      return "/assets/logos/logo.svg"; // FirstStep logo for admin
    }
    if (type === "center" && (logo || avatar)) {
      return logo || avatar; // Center logo
    }
    if (type === "parent" && avatar) {
      return avatar; // Parent avatar
    }
    return null;
  };

  const imageSource = getImageSource();
  const shouldShowImage = imageSource && !imageError;

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full ${getBackgroundColor()} text-white flex items-center justify-center ${textSizes[size]} font-bold shadow-lg overflow-hidden ${className}`}>
        {shouldShowImage ? (
          <Image
            src={imageSource}
            alt={type === "admin" ? "FirstStep Logo" : `${name} ${type === "center" ? "Logo" : "Avatar"}`}
            width={size === "sm" ? 32 : size === "md" ? 48 : 64}
            height={size === "sm" ? 32 : size === "md" ? 48 : 64}
            className={`w-full h-full object-${type === "admin" ? "contain p-1" : "cover"}`}
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{getInitial(name)}</span>
        )}
      </div>
      
      {/* Online indicator */}
      {isOnline && (
        <div className={`absolute -bottom-1 -right-1 ${onlineIndicatorSizes[size]} bg-green-500 border-2 border-white rounded-full`}></div>
      )}
    </div>
  );
};

export default Avatar;