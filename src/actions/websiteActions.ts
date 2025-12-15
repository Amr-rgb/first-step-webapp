"use server";

import { websiteService } from "@/services/api";
import { ContactFormData } from "@/lib/schemas";

export async function checkEmailAction(email: string) {
  return await websiteService.checkEmail(email);
}

export async function subscribeToNewsletterAction(email: string) {
  return await websiteService.subscribeToNewsletter(email);
}

export async function contactUsAction(data: ContactFormData) {
  return await websiteService.contactUs(data);
}
