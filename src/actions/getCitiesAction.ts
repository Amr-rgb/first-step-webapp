"use server";

import { authService } from "@/services/api";

export interface City {
    id: number;
    name: {
        ar: string;
        en: string;
    };
}

export async function getCitiesAction(): Promise<City[]> {
    try {
        const response = await authService.getCities();
        return response.data || response || [];
    } catch (error) {
        console.error("Error fetching cities:", error);
        return [];
    }
}
