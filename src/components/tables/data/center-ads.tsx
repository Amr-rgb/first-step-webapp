"use client";

import { Link } from "@/i18n/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Advertisement = {
  id: string;
  center: string;
  phone: string;
  email: string;
  acceptedAds: number;
  pendingAds: number;
  rejectedAds: number;
};

const AdsRenderer = ({ value }: { value: number }) => {
  return <div className="text-center">{value}</div>;
};

export const useCenterAdsColumns = () => {
  const t = useTranslations("dashboard.tables.centerAds");
  const columns: ColumnDef<Advertisement>[] = [
    {
      accessorKey: "id",
      header: () => (
        <div className="text-[.7rem] font-normal text-center">----</div>
      ),
      cell: ({ row }) => {
        return <div className="text-center">{row.index + 1}</div>;
      },
    },
    {
      accessorKey: "center",
      header: t("center"),
      cell: ({ row }) => {
        return (
          <div>
            <Link
              className="hover:text-secondary-mint-green"
              href={`advertisement/center/${row.getValue("id")}`}
            >
              {row.getValue("center")}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: t("phone"),
    },
    {
      accessorKey: "email",
      header: t("email"),
    },
    {
      accessorKey: "acceptedAds",
      header: t("acceptedAds"),
      cell: ({ row }) => AdsRenderer({ value: row.getValue("acceptedAds") }),
    },
    {
      accessorKey: "pendingAds",
      header: t("pendingAds"),
      cell: ({ row }) => AdsRenderer({ value: row.getValue("pendingAds") }),
    },
    {
      accessorKey: "rejectedAds",
      header: t("rejectedAds"),
      cell: ({ row }) => AdsRenderer({ value: row.getValue("rejectedAds") }),
    },
  ];
  return columns;
};
