import { ContactFormData } from "@/lib/schemas";
import { ApiErrorHandler } from "@/lib/error-handling";
import { formatTime } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  AdSlide,
  Blog,
  CenterRegisterPayload,
  CommonQuestion,
  ParentRegisterPayload,
  Service,
  Value,
  NurseryResponse,
  PortfolioResponse,
} from "@/types";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION,
    "X-Authorization-Secret": process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET,
  },
});

// Optional: Add interceptors (useful later for auth tokens, error handling)
apiClient.interceptors.request.use((config) => {
  // Retrieve token (e.g., from Zustand store or localStorage)
  const token = useAuthStore.getState().token; // Example with Zustand
  console.log("API Request Interceptor:", {
    url: config.url,
    method: config.method,
    hasToken: !!token,
    baseURL: config.baseURL,
    headers: {
      ...config.headers,
      Authorization: token ? "Bearer ***" : "NOT_SET",
      "X-Authorization": config.headers["X-Authorization"] ? "***" : "NOT_SET",
      "X-Authorization-Secret": config.headers["X-Authorization-Secret"]
        ? "***"
        : "NOT_SET",
    },
  });

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Added Authorization header with token");
  } else {
    console.log(
      "No token available for request - this might cause authentication issues"
    );
  }
  return config;
});

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      const networkError = {
        message: "Network error - Please check your internet connection",
        errors: {},
        status: 0,
        url: error.config?.url,
        method: error.config?.method,
      };
      console.error("Network Error:", networkError);
      return Promise.reject(networkError);
    }

    // Handle API errors
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data || {},
      headers: error.response?.headers,
      message: error.message,
    };

    console.error("API Error:", errorDetails);

    // Ensure error response has the expected structure
    const formattedError = {
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
      errors: error.response?.data?.errors || {},
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(formattedError);
  }
);

export const websiteService = {
  getAdSlides: async (locale: string): Promise<AdSlide[]> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sliders`,
        {
          headers: {
            "Content-Type": "application/json",
            lang: locale,
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
          next: {
            revalidate: 86400,
          },
        }
      );

      if (!res.ok) {
        throw {
          message: "Failed to fetch ad slides",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      return data.data as AdSlide[];
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getCommonQuestions: async (locale: string): Promise<CommonQuestion[]> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/common-question`,
        {
          headers: {
            "Content-Type": "application/json",
            lang: locale,
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
          next: {
            revalidate: 86400,
          },
        }
      );

      if (!res.ok) {
        throw {
          message: "Failed to fetch common questions",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      return data.data as CommonQuestion[];
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getOurValues: async (locale: string): Promise<Value[]> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/our-value-keys`,
        {
          headers: {
            "Content-Type": "application/json",
            lang: locale,
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
          next: {
            revalidate: 86400,
          },
        }
      );

      if (!res.ok) {
        throw {
          message: "Failed to fetch values",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      return data.data as Value[];
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getOurServices: async (locale: string): Promise<Service[]> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/services`,
        {
          headers: {
            "Content-Type": "application/json",
            lang: locale,
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
          next: {
            revalidate: 86400,
          },
        }
      );

      if (!res.ok) {
        throw {
          message: "Failed to fetch services",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      return data.data as Service[];
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  contactUs: async (payload: ContactFormData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact-us`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const responseData = await res.json();
        throw {
          message: responseData?.message || "Failed to submit contact form",
          errors: responseData?.errors || {},
          status: res.status,
        };
      }

      return await res.json();
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  subscribeToNewsletter: async (email: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscripe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        const responseData = await res.json();
        throw {
          message: responseData?.message || "Failed to subscribe to newsletter",
          errors: responseData?.errors || {},
          status: res.status,
        };
      }

      return await res.json();
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getPlans: async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/plans-get`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
        }
      );

      if (!res.ok) {
        throw {
          message: "Failed to fetch plans",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      return data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getTermsAndConditions: async (locale: string): Promise<Blog[]> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/terms-and-condition?lang=${locale}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
          next: {
            revalidate: 86400,
          },
        }
      );

      if (!res.ok) {
        throw {
          message: "Failed to fetch terms and conditions",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      return data.terms;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getPrivacy: async (locale: string): Promise<Blog[]> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/privacy?lang=${locale}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
          next: {
            revalidate: 86400,
          },
        }
      );

      if (!res.ok) {
        throw {
          message: "Failed to fetch privacy",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      return data.privacy;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
};

export const blogService = {
  getBlogs: async (locale: string): Promise<Blog[]> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`, {
        headers: {
          "Content-Type": "application/json",
          lang: locale,
          "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
          "X-Authorization-Secret":
            process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
        },
        next: {
          revalidate: 86400,
        },
      });

      if (!res.ok) {
        throw {
          message: "Failed to fetch blogs",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      return data.data as Blog[];
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getLatestBlogs: async (locale: string): Promise<Blog[]> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`, {
        headers: {
          "Content-Type": "application/json",
          lang: locale,
          "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
          "X-Authorization-Secret":
            process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
        },
        next: {
          revalidate: 1,
        },
      });

      if (!res.ok) {
        throw {
          message: "Failed to fetch latest blogs",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      return data.data as Blog[];
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getBlogById: async (blogId: string, locale: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blogId}`,
        {
          headers: {
            "Content-Type": "application/json",
            lang: locale,
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
          next: {
            revalidate: 1,
          },
        }
      );

      if (!res.ok) {
        throw {
          message: "Failed to fetch blog",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      return data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
};

export const nurseryService = {
  getNurseries: async (
    locale: string,
    params?: { key: string; value: string }[]
  ): Promise<NurseryResponse[]> => {
    try {
      const query = params
        ? "?" +
          params
            .map(
              ({ key, value }) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join("&")
        : "";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/center-filter${query}`,
        {
          headers: {
            "Content-Type": "application/json",
            lang: locale,
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
          next: {
            revalidate: 1,
          },
        }
      );

      const data = await res.json();
      if (Array.isArray(data.data)) {
        console.log(
          "nurseries (nursery_name, user_id): ",
          data.data.map((nursery: any) => ({
            nursery_name: nursery.nursery_name,
            user_id: nursery.user_id,
          }))
        );
      }

      if (!res.ok) {
        throw {
          message: "Failed to fetch nurseries",
          errors: {},
          status: res.status,
        };
      }

      return data.data as NurseryResponse[];
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getNurseryPortfolio: async (
    nurseryName: string,
    locale: string
  ): Promise<PortfolioResponse | null> => {
    try {
      // First, get all nurseries to find the center_id for the given nursery name
      const nurseries = await nurseryService.getNurseries(locale);
      const nursery = nurseries.find((n) => {
        const dbName = n.nursery_name.toLowerCase().trim();
        const searchName = nurseryName.toLowerCase().trim();
        return (
          dbName === searchName ||
          dbName.includes(searchName) ||
          searchName.includes(dbName)
        );
      });

      if (!nursery || !nursery.id) {
        return null;
      }

      // Use the nursery.id for the portfolio endpoint
      console.log(`Nursery: ${nursery.nursery_name}, ID: ${nursery.id}`);

      // Fetch the portfolio data using the nursery.id
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-portfilo-center/${nursery.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            lang: locale,
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
        }
      );

      if (!res.ok) {
        throw {
          message: "Failed to fetch portfolio data",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      console.log(`Portfolio Response:`, data);

      // The API returns { "data": { ... } } directly
      return {
        message: "Success",
        data: data.data || data,
      };
    } catch (error) {
      console.error("Error fetching nursery portfolio:", error);
      return null;
    }
  },

  getNurseryPortfolioById: async (
    centerId: number,
    locale: string
  ): Promise<PortfolioResponse | null> => {
    try {
      console.log(`Fetching portfolio for center ID: ${centerId}`);

      // Fetch the portfolio data directly using the center ID
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-portfilo-center/${centerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            lang: locale,
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
        }
      );

      if (!res.ok) {
        console.error(
          `Portfolio API failed for center ID ${centerId}:`,
          res.status,
          res.statusText
        );
        throw {
          message: "Failed to fetch portfolio data",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      console.log(`Portfolio data received for center ID ${centerId}:`, data);

      // The API returns { "portofilo": { ... } } but we expect { "data": { ... } }
      return {
        message: "Success",
        data: data.portofilo || data,
      };
    } catch (error) {
      console.error("Error fetching nursery portfolio:", error);
      return null;
    }
  },

  getNurseryDetails: async (
    centerId: number,
    locale: string
  ): Promise<PortfolioResponse | null> => {
    try {
      console.log(`Fetching nursery details for center ID: ${centerId}`);

      // Fetch the nursery details using the get-center endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-center/${centerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            lang: locale,
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
        }
      );

      if (!res.ok) {
        console.error(
          `Nursery details API failed for center ID ${centerId}:`,
          res.status,
          res.statusText
        );
        throw {
          message: "Failed to fetch nursery details",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      console.log(`Nursery details received for center ID ${centerId}:`, data);

      // Transform the data to match our expected format
      const transformedData = {
        hero_section: {
          title_of_hero: data.data.nursery_name,
          subtitle_of_hero: data.data.additional_service,
          description: `Located in ${data.data.neighborhood}, ${
            data.data.city?.name?.en || data.data.city
          }`,
          background_image: data.data.logo,
        },
        branches:
          data.data.branches?.map((branch: any) => ({
            id: branch.id,
            name: branch.nursery_name,
            nursery_name_branch: branch.nursery_name,
          })) || [],
        Philosophy_Methodology_Goal: {
          philosophy: {
            content:
              data.data.additional_service ||
              "Our philosophy focuses on providing quality care and education.",
          },
          methodology: {
            content:
              "We use modern educational methods tailored to each child's needs.",
          },
          goals: {
            content:
              "Our goal is to help children develop their full potential in a safe and nurturing environment.",
          },
        },
        services:
          data.data.services?.map((service: string) => ({
            title: service,
            description: `We provide ${service} services to support your child's development.`,
            image_service: null,
          })) || [],
        service_section_title: "Our Services",
        nursery_state: {
          area: "Varies by branch",
          class_rooms: `${data.data.branches?.length || 0} branches`,
          team_members: `${data.data.branches?.reduce(
            (total: number, branch: any) => total + (branch.teams?.length || 0),
            0
          )} team members`,
        },
        images_activities: [],
        activity_section_title: "Our Activities",
        activity_section_subtitle:
          "Engaging activities for your child's development",
        teams:
          data.data.branches?.flatMap(
            (branch: any) =>
              branch.teams?.map((team: any) => ({
                name: team.name,
                mission: team.profession,
                image: team.image,
              })) || []
          ) || [],
        contact_info: {
          address: data.data.address,
          working_hours: `${data.data.work_days_from} - ${data.data.work_days_to}, ${data.data.work_hours_from} - ${data.data.work_hours_to}`,
          phone_number: data.data.phone,
          email_address: data.data.email,
          facebook: undefined,
          instagram: undefined,
          twitter: undefined,
          whatsapp: undefined,
        },
        ads_images: data.data.ads?.map((ad: any) => ad.image) || [],
      };

      return {
        message: "Success",
        data: transformedData,
      };
    } catch (error) {
      console.error("Error fetching nursery details:", error);
      return null;
    }
  },

  getLatestNurseries: async (locale: string): Promise<NurseryResponse[]> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/latest-search`,
        {
          headers: {
            "Content-Type": "application/json",
            lang: locale,
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
          next: {
            revalidate: 86400,
          },
        }
      );

      if (!res.ok) {
        throw {
          message: "Failed to fetch latest nurseries",
          errors: {},
          status: res.status,
        };
      }

      const data = await res.json();
      return data.data as NurseryResponse[];
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
};

export const authService = {
  registerParent: async (payload: ParentRegisterPayload) => {
    try {
      const response = await apiClient.post("/register-parent", {
        ...payload,
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  registerCenter: async (payload: CenterRegisterPayload) => {
    try {
      const formData = new FormData();

      // Append text fields
      formData.append("name", payload.name);
      formData.append("email", payload.email);
      formData.append("password", payload.password);
      formData.append("address", payload.address);
      formData.append("phone", payload.phone);

      payload.additional_service &&
        formData.append("additional_service", payload.additional_service);
      formData.append("work_days_from", payload.work_days_from);
      formData.append("work_days_to", payload.work_days_to);
      formData.append("work_hours_from", formatTime(payload.work_hours_from));
      formData.append("work_hours_to", formatTime(payload.work_hours_to));
      payload.time_of_first_period &&
        formData.append(
          "time_of_first_period",
          formatTime(payload.time_of_first_period)
        );
      payload.time_of_second_period &&
        formData.append(
          "time_of_second_period",
          formatTime(payload.time_of_second_period)
        );

      formData.append(
        "emergency_contact",
        payload.emergency_contact ? "1" : "0"
      );
      formData.append("special_needs", payload.special_needs ? "1" : "0");

      formData.append("nursery_name", payload.nursery_name);
      formData.append("location", payload.location);
      formData.append("city_id", payload.city);
      formData.append("neighborhood", payload.neighborhood);

      formData.append("provides_food", payload.provides_food ? "1" : "0");

      // Append arrays
      payload.nursery_type.forEach((item) => {
        formData.append("nursery_type[]", item);
      });

      payload.communication_methods.forEach((item) => {
        formData.append("communication_methods[]", item);
      });

      payload.services.forEach((item) => {
        formData.append("services[]", item);
      });

      payload.accepted_ages.forEach((item) => {
        formData.append("accepted_ages[]", item);
      });

      payload.first_meals?.forEach((meal, index) => {
        meal.meal_name &&
          formData.append(`first_meals[${index}][meal_name]`, meal.meal_name);
        meal.juice &&
          formData.append(`first_meals[${index}][juice]`, meal.juice);
        meal.components &&
          formData.append(`first_meals[${index}][components]`, meal.components);
      });

      payload.second_meals?.forEach((meal, index) => {
        meal.meal_name &&
          formData.append(`second_meals[${index}][meal_name]`, meal.meal_name);
        meal.juice &&
          formData.append(`second_meals[${index}][juice]`, meal.juice);
        meal.components &&
          formData.append(
            `second_meals[${index}][components]`,
            meal.components
          );
      });

      payload.pricing.forEach((price, index) => {
        formData.append(
          `pricing[${index}][enrollment_type]`,
          price.enrollment_type
        );
        formData.append(
          `pricing[${index}][response_speed]`,
          price.response_speed
        );
        formData.append(
          `pricing[${index}][price_amount]`,
          price.price_amount.toString()
        );
      });

      // ✅ Append files
      payload.logo && formData.append("logo", payload.logo);
      payload.license_path &&
        formData.append("license_path", payload.license_path);
      payload.commercial_record_path &&
        formData.append(
          "commercial_record_path",
          payload.commercial_record_path
        );

      const response = await apiClient.post("/register-center", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/login", {
        email,
        password,
      });

      if (!response.data.token) {
        throw {
          message: "Login failed: No authentication token received",
          errors: {},
          status: 401,
        };
      }

      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post("/forget-password", {
        email,
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  checkOTP: async (email: string, otp: string) => {
    try {
      const response = await apiClient.post("/check-otp", {
        email,
        otp,
      });

      const result = response.data;

      if (!result.status) {
        throw {
          message: result.error || "Invalid OTP code",
          errors: {
            otp: [result.error || "Please check your OTP code and try again"],
          },
          status: 400,
        };
      }

      return result;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  resetPassword: async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/rest-password", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  googleSignIn: async (token: string) => {
    try {
      const response = await apiClient.post("/auth/google", {
        token,
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getCities: async () => {
    try {
      const response = await apiClient.get("/cities");
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
};

export const paymentService = {
  centerSubscribe: async (planId: number) => {
    try {
      console.log(
        "Payment service - Making request to /payment/subscribe with plan_id:",
        planId
      );
      console.log(
        "Payment service - API Base URL:",
        process.env.NEXT_PUBLIC_API_BASE_URL
      );
      console.log("Payment service - Request headers:", {
        "Content-Type": "application/json",
        "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION
          ? "***"
          : "NOT_SET",
        "X-Authorization-Secret": process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET
          ? "***"
          : "NOT_SET",
      });

      const response = await apiClient.post("/payment/subscribe", {
        plan_id: planId,
      });

      console.log("Payment service - Response received:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
      });

      return response.data;
    } catch (error) {
      console.error("Payment service - Error occurred:", error);
      throw ApiErrorHandler.handle(error);
    }
  },

  parentSubscribe: async (enrollmentId: number) => {
    try {
      console.log(
        "Payment service - Making request to /payment/subscribe with enrollment_id:",
        enrollmentId
      );

      const response = await apiClient.post("/payment/subscribe", {
        enrollment_id: enrollmentId,
      });

      console.log(
        "Payment service - Parent subscription response:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("Payment service - Parent subscription error:", error);
      throw ApiErrorHandler.handle(error);
    }
  },
};
