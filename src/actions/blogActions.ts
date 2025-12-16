"use server";

import { blogService } from "@/services/api";

export async function getLatestBlogsAction(locale: string) {
  return await blogService.getLatestBlogs(locale);
}
