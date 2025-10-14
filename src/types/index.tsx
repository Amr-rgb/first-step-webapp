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
  disease_details: Array<{
    disease_name: string;
    medicament: string;
    emergency: string;
  }> | null;
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
  // Step 1 fields
  name: string;
  email: string;
  password: string;
  phone: string;
  nursery_name: string;
  location: string;
  neighborhood: string;
  city: string;
  nursery_type: string[];
  logo: File;

  // Step 2 fields
  commercial_record_path: File;
  license_path: File;
}

// Extended interface for nursery API response that includes user_id
export interface NurseryResponse
  extends Omit<
    CenterRegisterPayload,
    "logo" | "license_path" | "commercial_record_path"
  > {
  id: number;
  user_id: number;
  center_id?: number;
  logo?: string;
  license_path?: string;
  commercial_record_path?: string;
  accepted_ages?: string[];
  branches?: Array<{
    id: number;
    name: string;
    nursery_name_branch: string;
  }>;
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
  // created_at: string;
  // published_at: string;
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

// -----------------------------
// Portfolio Types for Nursery Details
// -----------------------------

export interface HeroSection {
  title_of_hero: string;
  subtitle_of_hero: string;
  description: string;
  background_image: string;
}

export interface Branch {
  id: number;
  name: string;
  nursery_name_branch: string;
}

export interface PhilosophyMethodologyGoal {
  philosophy?: {
    content: string;
  };
  methodology?: {
    content: string;
  };
  goals?: {
    content: string;
  };
}

export interface PortfolioService {
  title: string;
  description: string;
  image_service?: string;
}

export interface NurseryState {
  area?: string;
  class_rooms?: string;
  team_members?: string;
}

export interface TeamMember {
  name: string;
  mission: string;
  image?: string;
}

export interface ContactInfo {
  address?: string;
  working_hours?: string;
  phone_number?: string;
  email_address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
}

export interface PortfolioData {
  hero_section?: HeroSection;
  branches?: {
    branch_name: string;
  }[];
  Philosophy_Methodology_Goal?: PhilosophyMethodologyGoal;
  services?: PortfolioService[];
  service_section_title?: string;
  nursery_state?: NurseryState;
  images_activities?: string[];
  activity_section_title?: string;
  activity_section_subtitle?: string;
  teams?: TeamMember[];
  contact_info?: ContactInfo;
  ads_images?: string[];
}

export interface PortfolioResponse {
  message: string;
  data: PortfolioData;
}

// Profile Editor Types
export interface PortfolioFormData {
  title_of_hero: string;
  subtitle_of_hero: string;
  description: string;
  background_image: File | string;
  branches: {
    branch_name: string;
  }[];
  Philosophy_Methodology_Goal: {
    philosophy: {
      content: string;
    };
    methodology: {
      content: string;
    };
    goals: {
      content: string;
    };
  };
  service_section_title: string;
  services: {
    title: string;
    description: string;
    image_service: File | string;
  }[];
  nursery_state: {
    area: string;
    class_rooms: string;
    team_members: string;
  };
  activity_section_title: string;
  activity_section_subtitle: string;
  images_activities: (File | string)[];
  contact_info: {
    address: string;
    working_hours: string;
    phone_number: string;
    email_address: string;
    facebook: string;
    instagram: string;
    whatsapp: string;
  };
  ads_images: (File | string)[];
  teams: {
    name: string;
    mission: string;
    image: File | string;
  }[];
}

export interface PricingFormData {
  id?: number;
  enrollment_type: string;
  title: string;
  start_age: number;
  end_age: number;
  count: number;
  price_amount: number;
}

export interface BranchPricingData {
  branch_id: number;
  prices: PricingFormData[];
}

// ===== Notification Types =====
export interface BaseNotification {
  id: string;
  type: string; // e.g., "App\\Notifications\\UniversalNotification"
  notifiable_type: string; // e.g., "App\\Models\\User"
  notifiable_id: number;
  read_at: string | null;
  created_at: string;
  updated_at: string | null;
}

// Universal notification (from Laravel broadcast)
export interface UniversalNotificationData extends BaseNotification {
  report_id?: number | null;
  title: string;
  description: string;
  date: string;
  time: string;
  notification_type: "info" | "daily_report" | "enrollment" | string;
  enrollment_id?: number | null;
  report?: any | null;
  enrollment?: any | null;
}

// Legacy admin notifications (with title, description, date, time)
export interface AdminNotification extends BaseNotification {
  type: "App\\Notifications\\AdminNotification";
  title: string;
  description: string;
  date: string;
  time: string;
}

// Legacy daily report notifications (with message and report_id)
export interface DailyReportNotification extends BaseNotification {
  type: "App\\Notifications\\DailyReportNotification";
  message: string;
  report_id: number;
}

// Union type for all notification types
export type Notification =
  | UniversalNotificationData
  | AdminNotification
  | DailyReportNotification;

// Type alias for backward compatibility
export type UniversalNotification = Notification;

// The API returns a simple array of notifications
export type NotificationsResponse = Notification[];

// ===== Profile Editor Types =====
export interface ProfileSection {
  id: string;
  type: string;
  name: string;
  enabled: boolean;
  data: Record<string, any>;
}
