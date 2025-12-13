import React from "react";
import { websiteService } from "@/services/promocodeService";
import OffersAndCouponsClient from "./OffersAndCouponsClient";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    view?: string;
  }>;
}

async function getCoupons() {
  try {
    const response = await websiteService.getPromocodes();
    if (response.success) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    return [];
  }
}

async function getExternalOffers() {
  try {
    const response = await websiteService.getExternalOffers();
    const data = Array.isArray(response) ? response : response?.data || [];
    return data;
  } catch (error) {
    console.error("Failed to fetch external offers:", error);
    return [];
  }
}

export default async function OffersAndCouponsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { view } = await searchParams;
  const activeView = view === "offers" ? "offers" : "coupons";

  // Fetch both datasets (you can optimize this to only fetch what's needed)
  const [coupons, externalOffers] = await Promise.all([
    getCoupons(),
    getExternalOffers(),
  ]);

  return (
    <OffersAndCouponsClient
      initialView={activeView}
      initialCoupons={coupons}
      initialOffers={externalOffers}
      locale={locale}
    />
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds
