import { BranchFormData } from "@/lib/schemas";

export const transformFetchedBranchToFormData = (
  fetchedBranch: any
): BranchFormData => {
  return {
    name: fetchedBranch.name || "",
    email: fetchedBranch.email || "",
    password: "",
    confirmPassword: "",
    nursery_name: fetchedBranch.nursery_name || "",
    phone: fetchedBranch.phone || "",
    neighborhood: fetchedBranch.neighborhood || "",
    nursery_type: fetchedBranch.nursery_type || [],
    types: Array.isArray(fetchedBranch.types)
      ? fetchedBranch.types.map((t: any) =>
          typeof t === "object" ? t.id.toString() : t.toString()
        )
      : [],
    city: fetchedBranch.city_id || "",
    location: fetchedBranch.location || "",
    services: fetchedBranch.services || [],
    additional_service: fetchedBranch.additional_service || "",
    accepted_ages: fetchedBranch.accepted_ages || [],
    work_days_from: fetchedBranch.work_days_from || "",
    work_days_to: fetchedBranch.work_days_to || "",
    work_hours_from: fetchedBranch.work_hours_from || "",
    work_hours_to: fetchedBranch.work_hours_to || "",
    emergency_contact: fetchedBranch.emergency_contact ? "yes" : "no",
    communication_methods: fetchedBranch.communication_methods || [],
    meals_and_periods: {
      provides_food: fetchedBranch.provides_food ? "yes" : "no",
      first_meals: fetchedBranch.first_meals || [],
      second_meals: fetchedBranch.second_meals || [],
      time_of_first_period: fetchedBranch.time_of_first_period || "",
      time_of_second_period: fetchedBranch.time_of_second_period || "",
    },
    license_path: fetchedBranch.license_path || undefined,
    commercial_record_path: fetchedBranch.commercial_record_path || undefined,
    logo: fetchedBranch.logo || undefined,
    comments: fetchedBranch.comments || "",
  };
};

export const transformFormDataToApiPayload = (
  values: Partial<BranchFormData>
): Record<string, any> => {
  const result: Record<string, any> = {};

  // File uploads
  if (values.logo) result.logo = values.logo;
  if (values.license_path) result.license_path = values.license_path;
  if (values.commercial_record_path)
    result.commercial_record_path = values.commercial_record_path;

  // Basic info
  if (values.nursery_name) result.nursery_name = values.nursery_name;
  if (values.name) result.name = values.name;
  if (values.email) result.email = values.email;
  if (values.password) result.password = values.password;
  if (values.phone) result.phone = values.phone;
  if (values.comments) result.comments = values.comments;

  // Arrays and strings (include if present in values)
  if ("nursery_type" in values) result.nursery_type = values.nursery_type || [];
  if ("types" in values) result.types = values.types || [];
  if ("additional_service" in values)
    result.additional_service = values.additional_service || "";
  if ("services" in values) result.services = values.services || [];
  if ("communication_methods" in values)
    result.communication_methods = values.communication_methods || [];

  // Work schedule
  if ("work_days_from" in values)
    result.work_days_from = values.work_days_from || "";
  if ("work_days_to" in values) result.work_days_to = values.work_days_to || "";
  if ("work_hours_from" in values)
    result.work_hours_from = values.work_hours_from || "";
  if ("work_hours_to" in values)
    result.work_hours_to = values.work_hours_to || "";

  // Meals and periods
  if ("meals_and_periods" in values && values.meals_and_periods) {
    const meals = values.meals_and_periods;
    result.time_of_first_period = meals.time_of_first_period || "";
    result.time_of_second_period = meals.time_of_second_period || "";
    result.first_meals = meals.first_meals || [];
    result.second_meals = meals.second_meals || [];
    result.provides_food = meals.provides_food === "yes";
  }

  // Emergency contact
  if ("emergency_contact" in values) {
    result.emergency_contact = values.emergency_contact === "yes";
  }

  // Accepted ages and special needs
  if ("accepted_ages" in values) {
    result.accepted_ages = values.accepted_ages || [];
    result.special_needs = values.accepted_ages?.includes("disabled") || false;
  }

  // Location
  if (values.location) result.location = values.location;
  if (values.city) result.city = values.city;
  if (values.neighborhood) result.neighborhood = values.neighborhood;

  return result;
};

export const getDirtyValues = (dirty: any, values: any): any => {
  if (!dirty) return {};

  return Object.entries(dirty).reduce((acc, [key, value]) => {
    if (typeof value === "object" && !Array.isArray(value)) {
      // Include the whole object for meals_and_periods if any field is dirty
      if (key === "meals_and_periods") {
        acc[key] = values[key];
      } else {
        const nestedDirty = getDirtyValues(value, values[key]);
        if (Object.keys(nestedDirty).length > 0) {
          acc[key] = nestedDirty;
        }
      }
    } else if (value === true) {
      acc[key] = values[key];
    }
    return acc;
  }, {} as any);
};
