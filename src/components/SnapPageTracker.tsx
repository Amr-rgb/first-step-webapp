"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/snapchatPixel";

export default function SnapPageTracker() {
  useEffect(() => {
    trackPageView({
      item_category: "Home",
    });
  }, []);

  return null;
}
