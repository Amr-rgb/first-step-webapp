import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";
import {
  AuthorizedPerson,
  Child,
  ChildAllergyDetail,
  ParentRegisterFormDataInput,
  ParentRegisterPayload,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// form error messages en and ar
const ERRORMESSAGES = {
  "general-answer-required": {
    ar: "يرجى الإجابة على هذا السؤال",
    en: "Please answer this question",
  },
  "general-field-required": {
    ar: "هذا الحقل مطلوب",
    en: "This field is required",
  },
  "invalid-email": {
    ar: "يرجى إدخال بريد إلكتروني صحيح",
    en: "Please enter a valid email address",
  },
  "invalid-url": {
    ar: "يرجى إدخال رابط صحيح",
    en: "Please enter a valid URL",
  },
  "invalid-phone": {
    ar: "يرجى إدخال رقم هاتف صحيح",
    en: "Please enter a valid phone number",
  },
  "invalid-subject": {
    ar: "يرجى اختيار موضوع",
    en: "Please select a subject",
  },
  "message-min": {
    ar: "الرسالة يجب أن تكون على الأقل {min} أحرف",
    en: "Message must be at least {min} characters",
  },
  "password-min": {
    ar: "يجب أن تحتوي كلمة المرور على {min} أحرف على الأقل",
    en: "Password must be at least {min} characters",
  },
  "password-match": {
    ar: "كلمات المرور غير متطابقة",
    en: "Passwords do not match",
  },
  "invalid-otp": {
    ar: "يرجى إدخال الكود بشكل صحيح",
    en: "Please enter the code correctly",
  },
  "invalid-date": {
    ar: "يرجى إدخال تاريخ صحيح",
    en: "Please enter a valid date",
  },
  "invalid-time": {
    ar: "يرجى إدخال وقت صحيح",
    en: "Please enter a valid time",
  },
  "disease-one-required": {
    ar: "يجب إدخال مرض واحد على الأقل",
    en: "At least one disease must be entered",
  },
  "allergy-one-required": {
    ar: "يجب إدخال نوع حساسية واحد على الأقل",
    en: "At least one allergy type must be entered",
  },
  "authorized-one-required": {
    ar: "يجب إضافة شخص مفوض واحد على الأقل",
    en: "At least one authorized person must be added",
  },
  "services-one-required": {
    ar: "يجب اختيار خدمة واحدة على الأقل",
    en: "At least one service must be selected",
  },
  "age-groups-one-required": {
    ar: "يجب اختيار فئة عمرية واحدة على الأقل",
    en: "At least one age group must be selected",
  },
  "communication-methods-one-required": {
    ar: "يجب اختيار طريقة تواصل واحدة على الأقل",
    en: "At least one communication method must be selected",
  },
  "file-size": {
    ar: "يجب أن يكون حجم الملف أقل من 3 ميغابايت",
    en: "File size must be less than 3MB",
  },
  "pdf-type": {
    ar: "يُسمح فقط بملفات PDF",
    en: "Only PDF files are accepted",
  },
  "image-type": {
    ar: "يُسمح فقط بملفات JPG, JPEG, PNG",
    en: "Only JPG, JPEG, PNG files are accepted",
  },
  "at-least-one-recipient-required": {
    ar: "يجب إضافة ومركز أو ولي أمر واحد على الأقل",
    en: "At least one center or parent must be added",
  },
};

// get error message helpre function
export const getErrorMessage = (
  errorKey: keyof typeof ERRORMESSAGES,
  locale: "ar" | "en",
  replacements?: Record<string, string | number>
) => {
  let message = ERRORMESSAGES[errorKey][locale];

  if (replacements) {
    Object.entries(replacements).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, String(value));
    });
  }

  return message;
};

// get meal title
const getArabicOrdinal = (index: number) => {
  const arabicOrdinals = ["الأولى", "الثانية"];
  return arabicOrdinals[index] || `${index + 1}`;
};

const getEnglishOrdinal = (index: number) => {
  const englishOrdinals = ["first", "second"];
  return englishOrdinals[index] || `${index + 1}`;
};

export const getMealTitle = (index: number, lang: string) => {
  if (lang === "ar") {
    return `الفترة ${getArabicOrdinal(index)}`;
  }
  return `${getEnglishOrdinal(index)} Period`;
};

// Create a slug from a name
export function createSlug(name: string, locale: string = "en"): string {
  const options = {
    replacement: "-",
    lower: true,
    strict: true,
    locale: locale,
  };

  return slugify(name, options);
}

// Check if a string contains Arabic characters
function containsArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}

// Utility function to try to reverse a slug back to a readable name
// Note: This won't perfectly restore the original, but makes it more readable
export function slugToReadableName(slug: string): string {
  // Simple replacement of hyphens with spaces
  const spacedText = slug.replace(/-/g, " ");

  // For Arabic, we don't capitalize as Arabic doesn't have the concept of uppercase/lowercase
  if (containsArabic(spacedText)) {
    return decodeURIComponent(spacedText);
  }

  // For Latin and other scripts that use capitalization
  return decodeURIComponent(
    spacedText
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

// Transform parent Signup FormData to Expected Payload
export function transformParentDataToExpectedPayload(
  formData: ParentRegisterFormDataInput
): ParentRegisterPayload {
  const childData = transformChildData(formData);

  return {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    address: formData.address,
    national_number: formData.national_number,
    phone: formData.phone,
    children: [childData],
  };
}

function transformChildData(formData: ParentRegisterFormDataInput): Child {
  // Helper to serialize disease details as JSON string or null
  const diseaseDetailsArr = transformDiseases(formData.chronicDiseases);
  const disease_details =
    diseaseDetailsArr.length > 0 ? JSON.stringify(diseaseDetailsArr) : null;

  // Helper to map authorized people to required structure
  const authorized_people = (formData.authorizedPersons || []).map(
    (person) => ({
      id: 0,
      child_id: 0,
      name: person.name,
      cin: person.idNumber,
      created_at: "",
      updated_at: "",
    })
  );

  // Helper to map allergies to required structure
  const allergiesArr = transformAllergies(formData.allergies);
  const allergies = allergiesArr.map((allergy) => ({
    id: 0,
    child_id: 0,
    name: allergy.name,
    allergy_causes: (allergy.allergy_causes || []).join(", "),
    allergy_emergency: allergy.allergy_emergency,
    created_at: "",
    updated_at: "",
  }));

  return {
    id: 0,
    user_id: 0,
    child_name: formData.childName,
    birthday_date: formatBirthdayDate(formData.birthDate),
    gender: mapGender(formData.gender),
    disease: formData.chronicDiseases?.hasDiseases === "yes" ? 1 : 0,
    disease_details: disease_details,
    allergy: formData.allergies?.hasAllergies === "yes" ? 1 : 0,
    parent_name: formData.fatherName,
    mother_name: formData.motherName,
    recommendations: formData.recommendations ?? null,
    created_at: "",
    updated_at: "",
    center_id: null,
    description_3_words: formData.childDescription ?? null,
    things_child_likes: formData.favoriteThings ?? null,
    notes: formData.comments ?? null,
    kinship: formData.kinship ?? null,
    center_branch_id: null,
    enrollments: [],
    authorized_people: authorized_people,
    allergies: allergies,
  };
}

function formatBirthdayDate(date: string | undefined): string | null {
  if (!date) return null;
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch (e) {
    console.error("Could not parse birthDate:", date, e);
    return null;
  }
}

function mapGender(gender: string): "girl" | "boy" | string {
  switch (gender) {
    case "female":
      return "girl";
    case "male":
      return "boy";
    default:
      return gender;
  }
}

function transformDiseases(chronicDiseases?: {
  hasDiseases: "yes" | "no";
  diseases?: Array<{ name: string; medication: string; procedures: string }>;
}): Array<{ disease_name: string; medicament: string; emergency: string }> {
  if (
    !chronicDiseases?.hasDiseases ||
    chronicDiseases.hasDiseases !== "yes" ||
    !chronicDiseases.diseases
  ) {
    return [];
  }

  return chronicDiseases.diseases.map((disease) => ({
    disease_name: disease.name,
    medicament: disease.medication,
    emergency: disease.procedures,
  }));
}

function getFirstAllergyType(allergies?: {
  hasAllergies: "yes" | "no";
  allergies?: Array<{
    allergyTypes: string;
    allergyFoods: string;
    allergyProcedures: string;
  }>;
}): string | null {
  if (
    !allergies?.hasAllergies ||
    allergies.hasAllergies !== "yes" ||
    !allergies.allergies?.length
  ) {
    return null;
  }
  return allergies.allergies[0].allergyTypes;
}

function transformAllergies(allergies?: {
  hasAllergies: "yes" | "no";
  allergies?: Array<{
    allergyTypes: string;
    allergyFoods: string;
    allergyProcedures: string;
  }>;
}): ChildAllergyDetail[] {
  if (
    !allergies?.hasAllergies ||
    allergies.hasAllergies !== "yes" ||
    !allergies.allergies
  ) {
    return [];
  }

  return allergies.allergies.map((allergy) => ({
    name: allergy.allergyTypes,
    allergy_causes: allergy.allergyFoods ? [allergy.allergyFoods] : [],
    allergy_emergency: allergy.allergyProcedures,
  }));
}

function transformAuthorizedPersons(
  persons?: Array<{ name: string; idNumber: string }>
): AuthorizedPerson[] {
  if (!persons) return [];

  return persons.map((person) => ({
    name: person.name,
    cin: person.idNumber,
  }));
}

// to 24-hour format
export function formatTime(timeString: string) {
  if (!timeString) return "";

  // If it's already in HH:mm:ss, return it
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) return timeString;

  // If it's in HH:mm, add :00
  if (/^\d{2}:\d{2}$/.test(timeString)) return `${timeString}:00`;

  return ""; // fallback if format is unexpected
}

// Helper to get image dimensions
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.src = URL.createObjectURL(file);
  });
}

export function mapOptions<T extends readonly string[]>(
  ids: T,
  translationPrefix: string,
  t: (key: string) => string
): { id: T[number]; label: string }[] {
  return ids.map((id) => ({
    id,
    label: t(`${translationPrefix}.${id}`),
  }));
}
