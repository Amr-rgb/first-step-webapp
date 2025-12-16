"use server";

import { parentService } from "@/services/api";

export async function getChildrenAction() {
  return await parentService.getChildren();
}
