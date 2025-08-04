import { RESERVATION_STATUS_IDS } from "@/lib/options";

// ===== Common Types =====
export type ReservationStatus = (typeof RESERVATION_STATUS_IDS)[number];

// ===== Child Related Types =====
export interface AuthorizedPerson {
  name: string;
  cin: string; // ID Number / CIN
}

export interface ChildAllergyDetail {
  name: string;
  allergy_causes: string[];
  allergy_emergency: string;
}

export interface ChronicDisease {
  name?: string;
  medication?: string;
  procedures?: string;
}

export interface Allergy {
  allergyTypes?: string;
  allergyFoods?: string;
  allergyProcedures?: string;
}

export interface Child {
  id: number;
  user_id: number;
  child_name: string;
  birthday_date: string | null;
  gender: "girl" | "boy" | string;
  disease: number;
  allergy: number;
  parent_name: string;
  mother_name: string;
  recommendations: string | null;
  created_at: string;
  updated_at: string;
  center_id: number | null;
  description_3_words: string | null;
  things_child_likes: string | null;
  notes: string | null;
  kinship: string | null;
  center_branch_id: number | null;
  disease_details: string | null;
  enrollments: Array<{
    id: number;
    center_id: number;
    user_id: number;
    center_branch_id: number;
    reservation_number: string;
    parent_phone: string;
    price_amount: string;
    enrollment_type: string;
    hours_per_day: string | null;
    response_speed: string;
    enrollment_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    pivot: {
      child_id: number;
      enrollment_id: number;
    };
  }>;
  authorized_people: Array<{
    id: number;
    child_id: number;
    name: string;
    cin: string;
    created_at: string;
    updated_at: string;
  }>;
  allergies: Array<{
    id: number;
    child_id: number;
    name: string;
    allergy_causes: string;
    allergy_emergency: string;
    created_at: string;
    updated_at: string;
  }>;
}

// ===== Parent Related Types =====
export interface ParentData {
  name: string;
  phone: string;
  email: string;
  relation: string;
}

export interface ParentRegisterPayload {
  name: string;
  email: string;
  national_number: string;
  phone: string;
  password?: string;
  address: string | null;
  children: Child[];
}

export interface ParentRegisterFormDataInput {
  name: string;
  phone: string;
  email: string;
  relation: string;
  national_number: string;
  address: string;
  password: string;
  confirmPassword?: string;
  childName: string;
  birthDate: string;
  fatherName: string;
  motherName: string;
  kinship: string;
  gender: "male" | "female" | string;
  chronicDiseases?: {
    hasDiseases: "yes" | "no";
    diseases?: Array<{ name: string; medication: string; procedures: string }>;
  };
  allergies?: {
    hasAllergies: "yes" | "no";
    allergies?: Array<{
      allergyTypes: string;
      allergyFoods: string;
      allergyProcedures: string;
    }>;
  };
  childDescription?: string;
  favoriteThings?: string;
  recommendations?: string;
  authorizedPersons?: Array<{ name: string; idNumber: string }>;
  comments?: string;
}

// ===== Center Related Types =====
export interface Meal {
  meal_name?: string;
  juice?: string;
  components?: string;
}

export interface Pricing {
  enrollment_type: string;
  response_speed: string;
  price_amount: number;
}

export interface CenterRegisterPayload {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  nursery_type: string[];
  additional_service?: string;
  work_days_from: string;
  work_days_to: string;
  work_hours_from: string;
  work_hours_to: string;
  time_of_first_period?: string;
  time_of_second_period?: string;
  first_meals?: Meal[];
  second_meals?: Meal[];
  emergency_contact: boolean;
  special_needs: boolean;
  nursery_name: string;
  location: string;
  city: string;
  neighborhood: string;
  services: string[];
  communication_methods: string[];
  provides_food: boolean;
  accepted_ages: string[];
  pricing: Pricing[];
  logo: File;
  license_path: File;
  commercial_record_path: File;
}

// ===== Child Info Form Types =====
export interface ChildData {
  childName: string;
  birthDate: string;
  fatherName: string;
  motherName: string;
  gender: string;
}

export interface DiseasesData {
  diseases: ChronicDisease[];
}

export interface AllergiesData {
  allergies: Allergy[];
}

export interface RecommedationsData {
  childDescription: string;
  favoriteThings: string;
  recommendations: string;
}

export interface AuthorizedData {
  authorizedPersons: AuthorizedPerson[];
  comments: string;
}

export interface ChildInfoData {
  parentData: ParentData;
  childData: ChildData;
  diseasesData: DiseasesData;
  allergiesData: AllergiesData;
  recommedationsData: RecommedationsData;
  authorizedData: AuthorizedData;
}

// ===== Content Types =====
export interface Blog {
  id: string;
  title: string | { [key: string]: string };
  description: string | { [key: string]: string };
  image: string;
  file?: string; // For the main blog image
  content?: { [key: string]: string };
  author?: string;
  reading_time: string;
  created_at: string;
  published_at: string;
  status?: "pending" | "approved" | "rejected";
}

export interface AdSlide {
  id: number;
  title: string;
  image: string;
  created_at: string;
  published_at: string;
}

export interface CommonQuestion {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  published_at: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  created_at: string;
  published_at: string;
}

export interface Value {
  key: string;
  title: string;
  description: string;
  image: string;
}

// -----------------------------
// Chat Feature Types
// -----------------------------

// User roles in the system
export type Role = "parent" | "center" | "admin";

// User object for chat participants
export interface User {
  id: string;
  name: string;
  role: Role;
  logoUrl?: string; // For center/admin, optional for parent
}

// Single chat message
export interface Message {
  id: string;
  chatId: string;
  sender: User;
  content: string;
  timestamp: string; // ISO string
  read: boolean; // Tracks if the message has been read
}

// Chat object (group chat between parent, center, admin)
export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
}

// -----------------------------
// (Add other types below as needed)
// -----------------------------
