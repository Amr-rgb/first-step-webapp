import React from "react";
import { websiteService } from "@/services/promocodeService";
import OffersAndCouponsClient from "./OffersAndCouponsClient";

interface PageProps {
  searchParams: {
    view?: string;
  };
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
  searchParams,
}: PageProps) {
  const view = searchParams.view === "external" ? "external" : "coupons";

  // Fetch both datasets (you can optimize this to only fetch what's needed)
  const [coupons, externalOffers] = await Promise.all([
    getCoupons(),
    getExternalOffers(),
  ]);

  return (
    <OffersAndCouponsClient
      initialView={view}
      initialCoupons={coupons}
      initialOffers={externalOffers}
    />
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds
