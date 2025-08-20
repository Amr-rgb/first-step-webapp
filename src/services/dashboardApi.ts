import { apiClient } from "./api";
import { formatTime } from "@/lib/utils";
import { CenterRegisterPayload } from "@/types";
import { BranchAdminFormData } from "@/lib/schemas";
import { ApiErrorHandler } from "@/lib/error-handling";

const prepareCenterFormData = (
  formData: FormData,
  payload: Omit<CenterRegisterPayload, "password">
) => {
  // Append text fields only if they exist
  if (payload.email) formData.append("email", payload.email);
  if (payload.address) formData.append("address", payload.address);
  if (payload.phone) formData.append("phone", payload.phone);

  if (payload.additional_service) {
    formData.append("additional_service", payload.additional_service);
  }
  if (payload.work_days_from)
    formData.append("work_days_from", payload.work_days_from);
  if (payload.work_days_to)
    formData.append("work_days_to", payload.work_days_to);
  if (payload.work_hours_from)
    formData.append("work_hours_from", formatTime(payload.work_hours_from));
  if (payload.work_hours_to)
    formData.append("work_hours_to", formatTime(payload.work_hours_to));
  if (payload.time_of_first_period) {
    formData.append(
      "time_of_first_period",
      formatTime(payload.time_of_first_period)
    );
  }
  if (payload.time_of_second_period) {
    formData.append(
      "time_of_second_period",
      formatTime(payload.time_of_second_period)
    );
  }

  if (payload.emergency_contact !== undefined) {
    formData.append("emergency_contact", payload.emergency_contact ? "1" : "0");
  }
  if (payload.special_needs !== undefined) {
    formData.append("special_needs", payload.special_needs ? "1" : "0");
  }

  if (payload.name) formData.append("name", payload.nursery_name);
  if (payload.nursery_name)
    formData.append("nursery_name", payload.nursery_name);
  if (payload.location) formData.append("location", payload.location);
  if (payload.city) formData.append("city_id", payload.city);
  if (payload.neighborhood)
    formData.append("neighborhood", payload.neighborhood);

  if (payload.provides_food !== undefined) {
    formData.append("provides_food", payload.provides_food ? "1" : "0");
  }

  // Append arrays only if they exist
  if (payload.nursery_type?.length) {
    payload.nursery_type.forEach((item) => {
      formData.append("nursery_type[]", item);
    });
  }

  if (payload.communication_methods?.length) {
    payload.communication_methods.forEach((item) => {
      formData.append("communication_methods[]", item);
    });
  }

  if (payload.services?.length) {
    payload.services.forEach((item) => {
      formData.append("services[]", item);
    });
  }

  if (payload.accepted_ages?.length) {
    payload.accepted_ages.forEach((item) => {
      formData.append("accepted_ages[]", item);
    });
  }

  if (payload.first_meals?.length) {
    payload.first_meals.forEach((meal, index) => {
      if (meal.meal_name) {
        formData.append(`first_meals[${index}][meal_name]`, meal.meal_name);
      }
      if (meal.juice) {
        formData.append(`first_meals[${index}][juice]`, meal.juice);
      }
      if (meal.components) {
        formData.append(`first_meals[${index}][components]`, meal.components);
      }
    });
  }

  if (payload.second_meals?.length) {
    payload.second_meals.forEach((meal, index) => {
      if (meal.meal_name) {
        formData.append(`second_meals[${index}][meal_name]`, meal.meal_name);
      }
      if (meal.juice) {
        formData.append(`second_meals[${index}][juice]`, meal.juice);
      }
      if (meal.components) {
        formData.append(`second_meals[${index}][components]`, meal.components);
      }
    });
  }

  if (payload.pricing?.length) {
    payload.pricing.forEach((price, index) => {
      if (price.enrollment_type) {
        formData.append(
          `pricing[${index}][enrollment_type]`,
          price.enrollment_type
        );
      }
      if (price.response_speed) {
        formData.append(
          `pricing[${index}][response_speed]`,
          price.response_speed
        );
      }
      if (price.price_amount) {
        formData.append(
          `pricing[${index}][price_amount]`,
          price.price_amount.toString()
        );
      }
    });
  }

  // Append files only if they exist
  if (payload.logo) formData.append("logo", payload.logo);
  if (payload.license_path)
    formData.append("license_path", payload.license_path);
  if (payload.commercial_record_path)
    formData.append("commercial_record_path", payload.commercial_record_path);
};

export const parentService = {
  getParentChildren: async () => {
    try {
      const response = await apiClient.get(`/parent/children/`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getChild: async (id: string) => {
    try {
      // Use the direct endpoint to get a specific child with parent information
      const response = await apiClient.get(`/parent/children/${id}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateChild: async (id: string, payload: any) => {
    try {
      // Format the date to YYYY-MM-DD format
      const formattedDate =
        payload.birthDate instanceof Date
          ? payload.birthDate.toISOString().split("T")[0]
          : payload.birthDate;

      // Prepare authorized persons data
      const authorizedPersons = payload.authorizedPersons.map(
        (person: any) => ({
          name: person.name,
          cin: person.idNumber,
          ...(person.id && { id: person.id }),
        })
      );

      // Prepare allergies data
      const allergies = payload.allergies.allergies.map((allergy: any) => ({
        name: allergy.allergyTypes,
        allergy_causes: Array.isArray(allergy.allergyFoods)
          ? allergy.allergyFoods
          : allergy.allergyFoods.split(", "),
        allergy_emergency: allergy.allergyProcedures,
        ...(allergy.id && { id: allergy.id }),
      }));

      // Prepare disease details data
      const diseaseDetails = payload.chronicDiseases.diseases.map(
        (disease: any) => ({
          disease_name: disease.name,
          medicament: disease.medication,
          emergency: disease.procedures,
          ...(disease.id && { id: disease.id }),
        })
      );

      const response = await apiClient.put(`/parent/children/${id}`, {
        child_name: payload.childName,
        birthday_date: formattedDate,
        gender: payload.gender === "male" ? "boy" : "girl",
        disease: payload.chronicDiseases.hasDiseases === "yes",
        disease_details: diseaseDetails,
        allergy: payload.allergies.hasAllergies === "yes",
        parent_name: payload.fatherName,
        mother_name: payload.motherName,
        recommendations: payload.recommendations || "",
        description_3_words: payload.childDescription || "",
        things_child_likes: payload.favoriteThings || "",
        notes: payload.comments || "",
        kinship: payload.kinship || "",
        authorized_persons: authorizedPersons,
        allergies: allergies,
      });

      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getDailyReports: async () => {
    try {
      const response = await apiClient.get(`/parent/daily-reports`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  deleteDailyReport: async (id: number) => {
    try {
      const response = await apiClient.delete(`/parent/daily-reports/${id}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  addChild: async (payload: any) => {
    try {
      // Format the date to YYYY-MM-DD format
      const formattedDate =
        payload.birthDate instanceof Date
          ? payload.birthDate.toISOString().split("T")[0]
          : payload.birthDate;

      const response = await apiClient.post(`/parent/children`, {
        children: [
          {
            child_name: payload.childName,
            birthday_date: formattedDate,
            gender: payload.gender === "male" ? "boy" : "girl",
            disease: payload.chronicDiseases.hasDiseases === "yes",
            disease_details: payload.chronicDiseases.diseases.map(
              (disease: any) => ({
                disease_name: disease.name,
                medicament: disease.medication,
                emergency: disease.procedures,
              })
            ),
            allergy: payload.allergies.hasAllergies === "yes",
            parent_name: payload.fatherName,
            mother_name: payload.motherName,
            recommendations: payload.recommendations,
            description_3_words: payload.childDescription,
            things_child_likes: payload.favoriteThings,
            notes: payload.comments,
            kinship: payload.kinship,
            authorized_persons: payload.authorizedPersons.map(
              (person: any) => ({
                name: person.name,
                cin: person.idNumber,
              })
            ),
            allergies: payload.allergies.allergies.map((allergy: any) => ({
              name: allergy.allergyTypes,
              allergy_causes: allergy.allergyFoods.split(", "),
              allergy_emergency: allergy.allergyProcedures,
            })),
          },
        ],
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getParentEnrollments: async (): Promise<EnrollmentsResponse> => {
    const authStorage = localStorage.getItem("auth-storage");
    let token = null;
    if (authStorage) {
      try {
        token = JSON.parse(authStorage).state.token;
      } catch (e) {
        console.error("Failed to parse auth-storage:", e);
      }
    }
    const response = await apiClient.get(`/parent/enrollments-get-all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  },

  cancelEnrollment: async (id: number) => {
    try {
      const response = await apiClient.post(`/parent/enrollments/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getUserData: async () => {
    try {
      const response = await apiClient.get(`/parent/get-user`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateProfile: async (payload: {
    email: string;
    phone: string;
    name: string;
    national_number: string;
  }) => {
    try {
      const response = await apiClient.put(
        `/parent/update-profile-parent`,
        payload
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
};

export const centerService = {
  getBranches: async () => {
    try {
      const response = await apiClient.get("branches/");
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getBranch: async (id: string) => {
    try {
      const response = await apiClient.get(`/branches/${id}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateBranch: async (
    id: string,
    payload: Omit<CenterRegisterPayload, "password">
  ) => {
    try {
      const formData = new FormData();
      prepareCenterFormData(formData, payload);

      const response = await apiClient.post(`/branches/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  createBranch: async (payload: Omit<CenterRegisterPayload, "password">) => {
    try {
      const formData = new FormData();
      prepareCenterFormData(formData, payload);

      const response = await apiClient.post("/branches", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  assignBranch: async (centerId: string, payload: BranchAdminFormData) => {
    try {
      const response = await apiClient.post(
        `/branches/${centerId}/assign-admin`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateBranchAdmin: async (userId: string, payload: BranchAdminFormData) => {
    try {
      const response = await apiClient.post(
        `/branches/${userId}/update-admin`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  deleteBranch: async (id: number) => {
    try {
      const response = await apiClient.delete(`/branches/${id}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getEnrollments: async () => {
    try {
      const response = await apiClient.get(`/enrollments`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  respondEnrollment: async (id: number, status: string) => {
    try {
      const response = await apiClient.patch(`/enrollments/${id}`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getChildrenFiles: async () => {
    try {
      const response = await apiClient.get(`/children`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getChild: async (id: string) => {
    try {
      const response = await apiClient.get(`/children/${id}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getBranchTeam: async (id: string) => {
    try {
      const response = await apiClient.get(
        `/branch-team-members?branch_id=${id}`
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getBranchTeamMember: async (id: string) => {
    try {
      const response = await apiClient.get(`/branch-team-members/${id}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  createBranchTeamMember: async (payload: any) => {
    try {
      const response = await apiClient.post(`/branch-team-members`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateBranchTeamMember: async (id: string, payload: any) => {
    try {
      const response = await apiClient.post(
        `/branch-team-members/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  deleteBranchTeamMember: async (id: string) => {
    try {
      const response = await apiClient.delete(`/branch-team-members/${id}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getDailyReports: async () => {
    try {
      const response = await apiClient.get(`/daily-reports`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getDailyReport: async (id: string) => {
    try {
      const response = await apiClient.get(`/get-daily-report/${id}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  sendDailyReport: async (childIds: string[], payload: any) => {
    try {
      const response = await apiClient.post(
        `/children/daily-reports`,
        {
          child_ids: childIds,
          ...payload,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getParents: async () => {
    try {
      const response = await apiClient.get(`/center/parents`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getParent: async (id: string) => {
    try {
      const response = await apiClient.get(`/center/parent/${id}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getAds: async () => {
    try {
      const response = await apiClient.get(`/ads`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  requestAd: async (payload: {
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    image: File;
    publish_date: string;
    end_date: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("title[ar]", payload.titleAr);
      formData.append("title[en]", payload.titleEn);
      formData.append("description[ar]", payload.descriptionAr);
      formData.append("description[en]", payload.descriptionEn);
      formData.append("image", payload.image);
      formData.append("publish_date", payload.publish_date);
      formData.append("end_date", payload.end_date);

      const response = await apiClient.post(`/ads`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getBlogs: async () => {
    try {
      const response = await apiClient.get(`/blog-centers`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getBlog: async (id: string) => {
    try {
      const response = await apiClient.get(`/blog-centers/${id}`);
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  requestBlog: async (payload: {
    cover: File;
    blog_image: File;
    title: string;
    description: string;
    content: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("cover", payload.cover);
      formData.append("blog_image", payload.blog_image);
      formData.append("content", payload.content);

      const response = await apiClient.post(`/blog-centers`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateBlog: async (
    id: string,
    payload: {
      cover: File;
      blog_image: File;
      title: string;
      description: string;
      content: string;
    }
  ) => {
    try {
      const response = await apiClient.post(`/blog-centers/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getCenterStats: async () => {
    try {
      const response = await apiClient.get(`/center/statistics`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getBranchStats: async () => {
    try {
      const response = await apiClient.get(`/branch/statistics`);
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  sendNotification: async (payload: {
    parent_ids: number[];
    title: string;
    date: string;
    time: string;
  }) => {
    try {
      const response = await apiClient.post(`/notify-parents`, payload);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getCenterData: async () => {
    try {
      const response = await apiClient.get(`/get-center`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateProfile: async (payload: {
    email: string;
    address: string;
    location: string;
    nursery_name: string;
    phone: string;
    city_id: number;
    neighborhood: string;
  }) => {
    try {
      const response = await apiClient.put(`/update-profile-center`, {
        ...payload,
        name: payload.nursery_name,
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
};

export const adminService = {
  getCenters: async () => {
    try {
      const response = await apiClient.get("/dashboard/centers");
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getBranches: async (centerId: string) => {
    try {
      const response = await apiClient.get(
        `/dashboard/branches/${centerId}/branches`
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getBranch: async (branchId: string) => {
    try {
      const response = await apiClient.get(`/dashboard/branches/${branchId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getChildren: async () => {
    try {
      const response = await apiClient.get(`/dashboard/childs`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getChild: async (childId: string) => {
    try {
      const response = await apiClient.get(`/dashboard/childs/${childId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getParents: async () => {
    try {
      const response = await apiClient.get(`/dashboard/parents`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getParent: async (parentId: string) => {
    try {
      const response = await apiClient.get(`/dashboard/parents/${parentId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getAdvertisements: async () => {
    try {
      const response = await apiClient.get(`/dashboard/ads-for-admin`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getAdvertisement: async (adId: string) => {
    try {
      const response = await apiClient.get(`dashboard/ads-for-admin/${adId}`);
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  createAdvertisement: async (payload: {
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    image: File;
    publish_date: string;
    end_date: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("title[ar]", payload.titleAr);
      formData.append("title[en]", payload.titleEn);
      formData.append("description[ar]", payload.descriptionAr);
      formData.append("description[en]", payload.descriptionEn);
      formData.append("image", payload.image);
      formData.append("publish_date", payload.publish_date);
      formData.append("end_date", payload.end_date);

      const response = await apiClient.post(
        `/dashboard/ads-for-admin`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateAdvertisement: async (
    adId: string,
    payload: {
      titleAr?: string;
      titleEn?: string;
      descriptionAr?: string;
      descriptionEn?: string;
      image: File;
      publish_date?: string;
      end_date?: string;
    }
  ) => {
    try {
      const formData = new FormData();
      payload.titleAr && formData.append("title[ar]", payload.titleAr);
      payload.titleEn && formData.append("title[en]", payload.titleEn);
      payload.descriptionAr &&
        formData.append("description[ar]", payload.descriptionAr);
      payload.descriptionEn &&
        formData.append("description[en]", payload.descriptionEn);
      payload.image && formData.append("image", payload.image);
      payload.publish_date &&
        formData.append("publish_date", payload.publish_date);
      payload.end_date && formData.append("end_date", payload.end_date);

      const response = await apiClient.post(
        `/dashboard/ads-for-admin/${adId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  deleteAdvertisement: async (adId: string) => {
    try {
      const response = await apiClient.delete(
        `/dashboard/ads-for-admin/${adId}`
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getAllCenterAds: async () => {
    try {
      const response = await apiClient.get(`/dashboard/all-centers-ads`);
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getOneCenterAds: async (centerId: string) => {
    try {
      const response = await apiClient.get(
        `/dashboard/all-for-specific-center/${centerId}`
      );
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getCenterAd: async (adId: string) => {
    try {
      const response = await apiClient.get(`/dashboard/specific-ad/${adId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  approveCenterAd: async (adId: string) => {
    try {
      const response = await apiClient.post(`/ads/${adId}/approve`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  rejectCenterAd: async (adId: string) => {
    try {
      const response = await apiClient.post(`/ads/${adId}/reject`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getBlogs: async () => {
    try {
      const response = await apiClient.get(`/dashboard/Blogs`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getBlog: async (blogId: string) => {
    try {
      const response = await apiClient.get(`/dashboard/Blogs/${blogId}`);
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  createBlog: async (payload: {
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    contentAr: string;
    contentEn: string;
    mainImage: File;
    cardImage: File;
  }) => {
    try {
      const formData = new FormData();
      formData.append("title[ar]", payload.titleAr);
      formData.append("title[en]", payload.titleEn);
      formData.append("description[ar]", payload.descriptionAr);
      formData.append("description[en]", payload.descriptionEn);
      formData.append("content[ar]", payload.contentAr);
      formData.append("content[en]", payload.contentEn);
      formData.append("image", payload.cardImage);
      formData.append("file", payload.mainImage);

      const response = await apiClient.post(`/dashboard/Blogs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateBlog: async (
    blogId: string,
    payload: {
      titleAr?: string;
      titleEn?: string;
      descriptionAr?: string;
      descriptionEn?: string;
      contentAr?: string;
      contentEn?: string;
      mainImage?: File;
      cardImage?: File;
    }
  ) => {
    try {
      const formData = new FormData();
      payload.titleAr && formData.append("title[ar]", payload.titleAr);
      payload.titleEn && formData.append("title[en]", payload.titleEn);
      payload.descriptionAr &&
        formData.append("description[ar]", payload.descriptionAr);
      payload.descriptionEn &&
        formData.append("description[en]", payload.descriptionEn);
      payload.contentAr && formData.append("content[ar]", payload.contentAr);
      payload.contentEn && formData.append("content[en]", payload.contentEn);
      payload.cardImage && formData.append("image", payload.cardImage);
      payload.mainImage && formData.append("file", payload.mainImage);

      const response = await apiClient.post(
        `/dashboard/Blogs/${blogId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  deleteBlog: async (blogId: string) => {
    try {
      const response = await apiClient.delete(`/dashboard/Blogs/${blogId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getAllCenterBlogs: async () => {
    try {
      const response = await apiClient.get(`/dashboard/all-centers-blog`);
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getOneCenterBlogs: async (centerId: string) => {
    try {
      const response = await apiClient.get(
        `/dashboard/all-for-specific-center-blog/${centerId}`
      );
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getCenterBlog: async (blogId: string) => {
    try {
      const response = await apiClient.get(`/dashboard/specific-ad/${blogId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  approveCenterBlog: async (blogId: string) => {
    try {
      const response = await apiClient.put(
        `/dashboard/update-status/${blogId}`,
        {
          status: "approved",
        }
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  rejectCenterBlog: async (blogId: string) => {
    try {
      const response = await apiClient.put(
        `/dashboard/update-status/${blogId}`,
        {
          status: "rejected",
        }
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  sendNotification: async (payload: {
    userIds: number[];
    title: string;
    date: string;
    time_start: string;
  }) => {
    try {
      const response = await apiClient.post(`/dashboard/notifiy-user`, payload);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getAdminStatistics: async () => {
    try {
      const response = await apiClient.get(`/admin/statistics`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getAdminEnrollments: async () => {
    try {
      const response = await apiClient.get(`/dashboard/enrollments/all`);
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  acceptCenter: async (centerId: string) => {
    try {
      const response = await apiClient.put(
        `/dashboard/centers/${centerId}/confirm`
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  rejectCenter: async (centerId: string) => {
    try {
      const response = await apiClient.put(
        `/dashboard/centers/${centerId}/reject`
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
};

export const sidebarService = {
  getCenterBirthdays: async () => {
    try {
      const response = await apiClient.get(`/child-birthdays`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getAdminBirthdays: async () => {
    try {
      const response = await apiClient.get(`/dashboard/birthdays`);
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getParentBirthdays: async () => {
    try {
      const response = await apiClient.get(`/parent/birthdays`);
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getCenterTasks: async () => {
    try {
      const response = await apiClient.get(`/to-do-centers`);
      return response.data.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getCenterTask: async (taskId: string) => {
    try {
      const response = await apiClient.get(`/to-do-centers/${taskId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  createCenterTask: async (payload: {
    title: string;
    date: string;
    done: boolean;
  }) => {
    try {
      const response = await apiClient.post(`/to-do-centers`, payload);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateCenterTask: async (
    taskId: string,
    payload: { title: string; date: string; done: boolean }
  ) => {
    try {
      const response = await apiClient.put(`/to-do-centers/${taskId}`, payload);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  deleteCenterTask: async (taskId: string) => {
    try {
      const response = await apiClient.delete(`/to-do-centers/${taskId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getCenterOccasions: async () => {
    try {
      const response = await apiClient.get(`/occassions`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getCenterOccasion: async (occasionId: string) => {
    try {
      const response = await apiClient.get(`/occassions/${occasionId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  createCenterOccasion: async (payload: { title: string; date: string }) => {
    try {
      const response = await apiClient.post(`/occassions`, payload);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateCenterOccasion: async (
    occasionId: string,
    payload: { title: string; date: string }
  ) => {
    try {
      const response = await apiClient.put(
        `/occassions/${occasionId}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  deleteCenterOccasion: async (occasionId: string) => {
    try {
      const response = await apiClient.delete(`/occassions/${occasionId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  // admins and parents
  getTasks: async () => {
    try {
      const response = await apiClient.get(`/todos`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getTask: async (taskId: string) => {
    try {
      const response = await apiClient.get(`/todos/${taskId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  createTask: async (payload: {
    title: string;
    date: string;
    done: boolean;
  }) => {
    try {
      const response = await apiClient.post(`/todos`, payload);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateTask: async (
    taskId: string,
    payload: { title: string; date: string; done: boolean }
  ) => {
    try {
      const response = await apiClient.post(`/todos/${taskId}`, payload);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  deleteTask: async (taskId: string) => {
    try {
      const response = await apiClient.delete(`/todos/${taskId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getOccasions: async () => {
    try {
      const response = await apiClient.get(`/Occassion-both`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  getOccasion: async (occasionId: string) => {
    try {
      const response = await apiClient.get(`/Occassion-both/${occasionId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  createOccasion: async (payload: { title: string; date: string }) => {
    try {
      const response = await apiClient.post(`/Occassion-both`, payload);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  updateOccasion: async (
    occasionId: string,
    payload: { title: string; date: string }
  ) => {
    try {
      const response = await apiClient.post(
        `/Occassion-both/${occasionId}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  deleteOccasion: async (occasionId: string) => {
    try {
      const response = await apiClient.delete(`/Occassion-both/${occasionId}`);
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },
};

// Portfolio API integration
export const getPortfolio = async (centerId: number) => {
  const response = await apiClient.get(
    `/portfolios/show?center_id=${centerId}`
  );
  return response.data;
};

export const savePortfolio = async (centerId: number, data: any) => {
  // If data is FormData, send it directly
  if (data instanceof FormData) {
    console.log("📤 SENDING FORMDATA TO API");
    const response = await apiClient.post(`/portfolios`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Otherwise, send as JSON
  console.log("📤 SENDING JSON TO API");
  const response = await apiClient.post(`/portfolios`, data);
  return response.data;
};

// TODO: Implement pricing API when endpoint is provided
export const savePricing = async (centerId: number, data: any) => {
  // Placeholder - replace with actual endpoint when provided
  const response = await apiClient.post(`/pricing`, data);
  return response.data;
};

export interface Enrollment {
  id: number;
  branch_id: number;
  branch_name: string;
  center_id: number;
  center_name: string;
  user_id: number;
  parent_phone: string;
  parent_name: string;
  price_amount: string;
  enrollment_type: string;
  response_speed: string;
  enrollment_date: string;
  status: string;
}

export interface EnrollmentsResponse {
  data: Enrollment[];
}
