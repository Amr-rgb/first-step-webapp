import { Metadata } from "next";
import { Locale, makePageMetadata } from "@/lib/metadata";
import { getLocale } from "next-intl/server";
import BranchShow from "@/components/forms/dashboard/branches/BranchShow";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return makePageMetadata(locale as Locale, "dashboard/center/branches");
}

export default async function DashboardBranchDetails({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;

  return (
    <div>
      <BranchShow branchId={branchId} />
    </div>
  );
}
