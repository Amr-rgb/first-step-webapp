import { Permission } from "./types";

export const permissions: Permission[] = [
  // Dashboard permissions
  {
    resource: "dashboard",
    action: "view",
    allowedRoles: ["admin", "center", "branch_admin", "parent", "nursery"],
  },

  // Branches permissions
  {
    resource: "branches",
    action: "view",
    allowedRoles: ["admin", "center", "nursery"],
  },
  {
    resource: "branches",
    action: "create",
    allowedRoles: ["center", "nursery"],
  },
  {
    resource: "branches",
    action: "edit",
    allowedRoles: ["center", "nursery"],
  },
  {
    resource: "branches",
    action: "delete",
    allowedRoles: ["center", "nursery"],
  },

  // Children permissions
  {
    resource: "children",
    action: "view",
    allowedRoles: ["admin", "center", "branch_admin", "parent", "nursery"],
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
    allowedRoles: ["admin", "center", "branch_admin", "parent", "nursery"],
    centerSpecific: true,
  },
  {
    resource: "bookings",
    action: "manage",
    allowedRoles: ["admin", "center", "branch_admin", "nursery"],
    centerSpecific: true,
  },

  // Reports permissions
  {
    resource: "reports",
    action: "view",
    allowedRoles: ["admin", "center", "branch_admin", "nursery"],
    centerSpecific: true,
  },

  // Notifications permissions
  {
    resource: "notifications",
    action: "view",
    allowedRoles: ["admin", "center", "branch_admin", "parent", "nursery"],
  },
  {
    resource: "notifications",
    action: "manage",
    allowedRoles: ["admin", "center", "branch_admin", "nursery"],
  },

  // Team permissions
  {
    resource: "team",
    action: "view",
    allowedRoles: ["admin", "center", "branch_admin", "nursery"],
    centerSpecific: true,
  },
  {
    resource: "team",
    action: "create",
    allowedRoles: ["center", "branch_admin", "nursery"],
    branchSpecific: true,
  },
  {
    resource: "team",
    action: "edit",
    allowedRoles: ["center", "branch_admin", "nursery"],
    branchSpecific: true,
  },
  {
    resource: "team",
    action: "delete",
    allowedRoles: ["center", "branch_admin", "nursery"],
    branchSpecific: true,
  },

  // Advertisements permissions
  {
    resource: "advertisements",
    action: "view",
    allowedRoles: ["admin", "center", "nursery"],
  },
  {
    resource: "advertisements",
    action: "create",
    allowedRoles: ["admin", "center", "nursery"],
  },
  {
    resource: "advertisements",
    action: "edit",
    allowedRoles: ["admin", "center", "nursery"],
  },
  {
    resource: "advertisements",
    action: "delete",
    allowedRoles: ["admin", "center", "nursery"],
  },

  // Center Data permissions
  {
    resource: "center-data",
    action: "view",
    allowedRoles: ["admin", "center", "nursery"],
  },
  {
    resource: "center-data",
    action: "edit",
    allowedRoles: ["center", "nursery"],
  },

  // Blogs permissions
  {
    resource: "blogs",
    action: "view",
    allowedRoles: ["admin", "center", "nursery"],
  },
  {
    resource: "blogs",
    action: "create",
    allowedRoles: ["admin", "center", "nursery"],
  },
  {
    resource: "blogs",
    action: "edit",
    allowedRoles: ["admin", "center", "nursery"],
  },
  {
    resource: "blogs",
    action: "delete",
    allowedRoles: ["admin", "center", "nursery"],
  },
];
