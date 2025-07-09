"use client";

import React from "react";
import { Center, useCentersColumns } from "@/components/tables/data/centers";
import { DataTable } from "@/components/tables/DataTable";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/dashboardApi";

interface CentersProps {
  selected: Center[];
  setSelected: React.Dispatch<React.SetStateAction<Center[]>>;
  selectedBranchMap: Record<number, number>;
  setSelectedBranchMap: React.Dispatch<
    React.SetStateAction<Record<number, number>>
  >;
}

const Centers: React.FC<CentersProps> = ({
  selected,
  setSelected,
  selectedBranchMap,
  setSelectedBranchMap,
}) => {
  const columns = useCentersColumns(selectedBranchMap, setSelectedBranchMap);

  const { data: centersData, isLoading } = useQuery({
    queryKey: ["notifications-centers"],
    queryFn: adminService.getCenters,
  });

  // Transform the data to match our Center type
  const transformedData: Center[] = React.useMemo(() => {
    if (!centersData) return [];

    return centersData.map((center: any) => ({
      id: center.user_id,
      centerName: center.nursery_name,
      phone: center.phone,
      email: center.user?.email,
      branches:
        center.branches?.map((branch: any) => ({
          id: branch.user_id,
          name: branch.name,
          phone: branch.phone,
          email: branch.email_admin_branch,
        })) || [],
    }));
  }, [centersData]);

  return (
    <div>
      <div className="lg:p-4 space-y-1">
        <p className="heading-4 text-primary text-center">Centers</p>

        <DataTable
          setSelected={setSelected}
          columns={columns}
          data={transformedData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Centers;
