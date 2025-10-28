import { Permission } from "./types";

export const permissions: Permission[] = [
  // Dashboard permissions
  {
    resource: "dashboard",
    action: "view",
    allowedRoles: ["admin", "center", "branch_admin", "parent"],
  },

  // Branches permissions
  {
    resource: "branches",
    action: "view",
    allowedRoles: ["admin", "center"],
  },
  {
    resource: "branches",
    action: "create",
    allowedRoles: ["center"],
  },
  {
    resource: "branches",
    action: "edit",
    allowedRoles: ["center"],
  },
  {
    resource: "branches",
    action: "delete",
    allowedRoles: ["center"],
  },

  // Children permissions
  {
    resource: "children",
    action: "view",
    allowedRoles: ["admin", "center", "branch_admin", "parent"],
    centerSpecific: true,
  },
  {
    resource: "children",
    action: "create",
    allowedRoles: ["parent"],
  },
  {
    resource: "children",
    action: "edit",
    allowedRoles: ["parent"],
  },
  {
    resource: "children",
    action: "delete",
    allowedRoles: ["parent"],
  },

  // Bookings permissions
  {
    resource: "bookings",
    action: "view",
    allowedRoles: ["admin", "center", "branch_admin", "parent"],
    centerSpecific: true,
  },
  {
    resource: "bookings",
    action: "manage",
    allowedRoles: ["admin", "center", "branch_admin"],
    centerSpecific: true,
  },

  // Reports permissions
  {
    resource: "reports",
    action: "view",
    allowedRoles: ["admin", "center", "branch_admin"],
    centerSpecific: true,
  },

  // Notifications permissions
  {
    resource: "notifications",
    action: "view",
    allowedRoles: ["admin", "center", "branch_admin", "parent"],
  },
  {
    resource: "notifications",
    action: "manage",
    allowedRoles: ["admin", "center", "branch_admin"],
  },

  // Team permissions
  {
    resource: "team",
    action: "view",
    allowedRoles: ["admin", "center", "branch_admin"],
    centerSpecific: true,
  },
  {
    resource: "team",
    action: "create",
    allowedRoles: ["center", "branch_admin"],
    branchSpecific: true,
  },
  {
    resource: "team",
    action: "edit",
    allowedRoles: ["center", "branch_admin"],
    branchSpecific: true,
  },
  {
    resource: "team",
    action: "delete",
    allowedRoles: ["center", "branch_admin"],
    branchSpecific: true,
  },

  // Advertisements permissions
  {
    resource: "advertisements",
    action: "view",
    allowedRoles: ["admin", "center"],
  },
  {
    resource: "advertisements",
    action: "create",
    allowedRoles: ["admin", "center"],
  },
  {
    resource: "advertisements",
    action: "edit",
    allowedRoles: ["admin", "center"],
  },
  {
    resource: "advertisements",
    action: "delete",
    allowedRoles: ["admin", "center"],
  },

  // Center Data permissions
  {
    resource: "center-data",
    action: "view",
    allowedRoles: ["admin", "center"],
  },
  {
    resource: "center-data",
    action: "edit",
    allowedRoles: ["center"],
  },

  // Blogs permissions
  {
    resource: "blogs",
    action: "view",
    allowedRoles: ["admin", "center"],
  },
  {
    resource: "blogs",
    action: "create",
    allowedRoles: ["admin", "center"],
  },
  {
    resource: "blogs",
    action: "edit",
    allowedRoles: ["admin", "center"],
  },
  {
    resource: "blogs",
    action: "delete",
    allowedRoles: ["admin", "center"],
  },
];
