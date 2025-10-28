import { UserRole as Role } from "@/store/authStore";

export type Resource =
  | "dashboard"
  | "branches"
  | "children"
  | "bookings"
  | "reports"
  | "notifications"
  | "team"
  | "advertisements"
  | "blogs"
  | "center-data";

export type Action = "view" | "create" | "edit" | "delete" | "manage";

export interface Permission {
  resource: Resource;
  action: Action;
  allowedRoles: Role[];
  centerSpecific?: boolean;
  branchSpecific?: boolean;
}
