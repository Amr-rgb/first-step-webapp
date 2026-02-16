import { useCallback } from "react";
import { Resource, Action } from "@/lib/permissions/types";
import { UserRole as Role } from "@/store/authStore";
import { permissions } from "@/lib/permissions/permissions";
import { useAuthUser } from "@/store/authStore";

interface User {
  id: number;
  name: string;
  email: string;
  address: string | null;
  email_verified_at: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
  national_number: string | null;
  branch_id: number;
}

export const usePermissions = () => {
  const user = useAuthUser();

  const can = useCallback(
    (action: Action, resource: Resource, branchId?: string) => {
      if (!user) return false;

      const permission = permissions.find(
        (p) => p.resource === resource && p.action === action,
      );

      if (!permission) return false;

      // Check if user's role is allowed
      if (!permission.allowedRoles.includes(user.role)) {
        return false;
      }

      // Check branch-specific permissions
      if (permission.branchSpecific && branchId && user.branch_id) {
        if (branchId !== user.branch_id.toString()) {
          return false;
        }
      }

      // For center-specific permissions, we only check if the user has the right role
      // since center users can only access their own center's data
      if (
        permission.centerSpecific &&
        user.role !== "center" &&
        user.role !== "nursery"
      ) {
        return false;
      }

      return true;
    },
    [user],
  );

  return { can };
};
