"use server";

import { parentService } from "@/services/api";

export async function getChildrenAction() {
  console.log("[getChildrenAction] Starting to fetch children...");
  try {
    const result = await parentService.getChildren();
    console.log("[getChildrenAction] Success! Children count:", result?.length);
    console.log("[getChildrenAction] Children data:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("[getChildrenAction] Error occurred:", error);
    throw error;
  }
}
