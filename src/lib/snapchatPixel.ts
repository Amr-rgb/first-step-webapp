type SnapEventParams = {
  price?: number;
  currency?: string;
  transaction_id?: string;
  item_ids?: string[];
  item_category?: string;
  search_string?: string;
  uuid_c1?: string;
  sign_up_method?: string;
  user_email?: string;
  user_phone_number?: string;
  user_hashed_email?: string;
  user_hashed_phone_number?: string;
  geo_city?: string;
  geo_country?: string;
  [key: string]: any;
};

declare global {
  interface Window {
    snaptr: (
      command: "init" | "track" | "cm",
      input: string,
      params?: SnapEventParams
    ) => void;
  }
}

export const trackSnapEvent = (event: string, params?: SnapEventParams) => {
  if (typeof window !== "undefined" && window.snaptr) {
    window.snaptr("track", event, params);
  }
};

export const trackAdClick = (params: SnapEventParams) => {
  trackSnapEvent("AD_CLICK", params);
};

export const trackPageView = (params: SnapEventParams) => {
  trackSnapEvent("PAGE_VIEW", params);
};

export const trackSignUp = (params: SnapEventParams) => {
  trackSnapEvent("SIGN_UP", params);
};
