import type { Metadata } from "next";

export type Locale = "en" | "ar";

type LocalizedMeta = {
  title: string;
  description: string;
};

type DashboardMetaMap = Record<
  string,
  { en: LocalizedMeta; ar: LocalizedMeta }
>;

// Normalize a pathname by removing dynamic segments and collapsing extra slashes
function normalizeDashboardPath(pathname: string): string {
  let path = pathname
    .replace(/\/[a-z]{2}\//, "/") // strip locale if present at the start
    .replace(/^\/+|\/+$/g, ""); // trim leading/trailing slashes

  // Keep only up to the first dynamic param-free segment structure for mapping
  // e.g. dashboard/admin/children/123 -> dashboard/admin/children
  // Also keep static segments that follow dynamic ones (e.g., children/[id]/edit -> children/edit)
  const parts = path.split("/");
  const cleaned: string[] = [];
  for (const part of parts) {
    if (part.length === 0) continue;
    if (part.startsWith("[")) continue;
    if (/^\d+$/.test(part)) continue; // numeric ids
    cleaned.push(part);
  }

  return cleaned.join("/");
}

export const dashboardMetadata: DashboardMetaMap = {
  // Root dashboards
  "dashboard/admin": {
    en: {
      title: "Admin Dashboard",
      description: "Overview and insights for administrators.",
    },
    ar: {
      title: "لوحة تحكم المسؤول",
      description: "نظرة عامة ورؤى للمسؤولين.",
    },
  },
  "dashboard/center": {
    en: {
      title: "Center Dashboard",
      description: "Manage center operations, bookings, and teams.",
    },
    ar: {
      title: "لوحة تحكم المركز",
      description: "إدارة عمليات المركز والحجوزات والفِرق.",
    },
  },
  "dashboard/parent": {
    en: {
      title: "Parent Dashboard",
      description: "Track your children, bookings, and reports.",
    },
    ar: {
      title: "لوحة تحكم ولي الأمر",
      description: "متابعة الأطفال والحجوزات والتقارير.",
    },
  },

  // Admin
  "dashboard/admin/bookings": {
    en: {
      title: "Admin • Bookings",
      description: "Browse and manage platform bookings.",
    },
    ar: {
      title: "المسؤول • الحجوزات",
      description: "استعراض وإدارة حجوزات المنصة.",
    },
  },
  "dashboard/admin/centers": {
    en: {
      title: "Admin • Centers",
      description: "Manage centers and their details.",
    },
    ar: { title: "المسؤول • المراكز", description: "إدارة المراكز وتفاصيلها." },
  },
  "dashboard/admin/centers-subscriptions": {
    en: {
      title: "Admin • Center Subscriptions",
      description: "View and manage center subscriptions.",
    },
    ar: {
      title: "المسؤول • اشتراكات المراكز",
      description: "عرض وإدارة اشتراكات المراكز.",
    },
  },
  "dashboard/admin/children": {
    en: {
      title: "Admin • Children",
      description: "Review children records across centers.",
    },
    ar: {
      title: "المسؤول • الأطفال",
      description: "عرض سجلات الأطفال عبر المراكز.",
    },
  },
  "dashboard/admin/parents": {
    en: {
      title: "Admin • Parents",
      description: "Manage parents and their accounts.",
    },
    ar: {
      title: "المسؤول • أولياء الأمور",
      description: "إدارة أولياء الأمور وحساباتهم.",
    },
  },
  "dashboard/admin/branches": {
    en: {
      title: "Admin • Branches",
      description: "Explore and manage branches of centers.",
    },
    ar: {
      title: "المسؤول • الفروع",
      description: "استعراض وإدارة فروع المراكز.",
    },
  },
  "dashboard/admin/advertisement": {
    en: {
      title: "Admin • Advertisements",
      description: "Manage platform and center ads.",
    },
    ar: {
      title: "المسؤول • الإعلانات",
      description: "إدارة إعلانات المنصة والمراكز.",
    },
  },
  "dashboard/admin/advertisement/add": {
    en: {
      title: "Admin • Add Advertisement",
      description: "Create a new advertisement.",
    },
    ar: { title: "المسؤول • إضافة إعلان", description: "إنشاء إعلان جديد." },
  },
  "dashboard/admin/advertisement/center": {
    en: {
      title: "Admin • Center Advertisements",
      description: "Browse ads by center.",
    },
    ar: {
      title: "المسؤول • إعلانات المراكز",
      description: "استعراض الإعلانات حسب المركز.",
    },
  },
  "dashboard/admin/advertisement/edit": {
    en: {
      title: "Admin • Edit Advertisement",
      description: "Edit advertisement details.",
    },
    ar: {
      title: "المسؤول • تعديل إعلان",
      description: "تعديل تفاصيل الإعلان.",
    },
  },
  "dashboard/admin/blog": {
    en: {
      title: "Admin • Blogs",
      description: "Moderate and manage blog content.",
    },
    ar: {
      title: "المسؤول • المدونة",
      description: "إدارة ومراجعة محتوى المدونة.",
    },
  },
  "dashboard/admin/blog/add": {
    en: { title: "Admin • Add Blog", description: "Publish a new blog post." },
    ar: { title: "المسؤول • إضافة تدوينة", description: "نشر تدوينة جديدة." },
  },
  "dashboard/admin/blog/center": {
    en: {
      title: "Admin • Center Blogs",
      description: "Browse blogs by center.",
    },
    ar: {
      title: "المسؤول • مدونات المراكز",
      description: "استعراض المدونات حسب المركز.",
    },
  },
  "dashboard/admin/blog/edit": {
    en: {
      title: "Admin • Edit Blog",
      description: "Edit blog content and details.",
    },
    ar: {
      title: "المسؤول • تعديل تدوينة",
      description: "تعديل محتوى وتفاصيل التدوينة.",
    },
  },
  "dashboard/admin/chat": {
    en: {
      title: "Admin • Chat",
      description: "Converse with users and centers.",
    },
    ar: {
      title: "المسؤول • المحادثات",
      description: "التواصل مع المستخدمين والمراكز.",
    },
  },
  "dashboard/admin/notifications": {
    en: {
      title: "Admin • Notifications",
      description: "Send and review notifications.",
    },
    ar: {
      title: "المسؤول • الإشعارات",
      description: "إرسال ومراجعة الإشعارات.",
    },
  },

  // Center
  "dashboard/center/bookings": {
    en: {
      title: "Center • Bookings",
      description: "Manage bookings and schedules.",
    },
    ar: { title: "المركز • الحجوزات", description: "إدارة الحجوزات والجداول." },
  },
  "dashboard/center/branches": {
    en: {
      title: "Center • Branches",
      description: "Create and manage center branches.",
    },
    ar: { title: "المركز • الفروع", description: "إنشاء وإدارة فروع المركز." },
  },
  "dashboard/center/branches/add": {
    en: {
      title: "Center • Add Branch",
      description: "Create a new branch for your center.",
    },
    ar: { title: "المركز • إضافة فرع", description: "إنشاء فرع جديد للمركز." },
  },
  "dashboard/center/branches/edit": {
    en: {
      title: "Center • Edit Branch",
      description: "Edit branch information.",
    },
    ar: { title: "المركز • تعديل الفرع", description: "تعديل معلومات الفرع." },
  },
  "dashboard/center/chat": {
    en: {
      title: "Center • Chat",
      description: "Chat with parents and admins.",
    },
    ar: {
      title: "المركز • المحادثات",
      description: "التواصل مع أولياء الأمور والمسؤولين.",
    },
  },
  "dashboard/center/notifications": {
    en: {
      title: "Center • Notifications",
      description: "Manage notifications to parents.",
    },
    ar: {
      title: "المركز • الإشعارات",
      description: "إدارة الإشعارات الموجهة للأهالي.",
    },
  },
  "dashboard/center/account": {
    en: {
      title: "Center • Account",
      description: "Manage account settings and profile.",
    },
    ar: {
      title: "المركز • الحساب",
      description: "إدارة إعدادات الحساب والملف الشخصي.",
    },
  },
  "dashboard/center/center-data": {
    en: {
      title: "Center • Center Data",
      description: "Edit and preview center profile.",
    },
    ar: {
      title: "المركز • محرر الملف",
      description: "تعديل ومعاينة ملف المركز.",
    },
  },
  "dashboard/center/team": {
    en: {
      title: "Center • Team",
      description: "Manage staff members and roles.",
    },
    ar: {
      title: "المركز • الفريق",
      description: "إدارة أعضاء الفريق والأدوار.",
    },
  },
  "dashboard/center/team/add": {
    en: {
      title: "Center • Add Team Member",
      description: "Invite or add a new team member.",
    },
    ar: {
      title: "المركز • إضافة عضو فريق",
      description: "دعوة أو إضافة عضو جديد للفريق.",
    },
  },
  "dashboard/center/children-files": {
    en: {
      title: "Center • Children Files",
      description: "Upload and manage children documents.",
    },
    ar: {
      title: "المركز • ملفات الأطفال",
      description: "رفع وإدارة مستندات الأطفال.",
    },
  },
  "dashboard/center/daily-reports": {
    en: {
      title: "Center • Daily Reports",
      description: "Create and review daily reports.",
    },
    ar: {
      title: "المركز • التقارير اليومية",
      description: "إنشاء ومراجعة التقارير اليومية.",
    },
  },
  "dashboard/center/daily-reports/send": {
    en: {
      title: "Center • Send Report",
      description: "Send a new daily report.",
    },
    ar: {
      title: "المركز • إرسال تقرير",
      description: "إرسال تقرير يومي جديد.",
    },
  },
  "dashboard/center/ad-or-blog-request": {
    en: {
      title: "Center • Ad/Blog Requests",
      description: "Submit or manage ad/blog requests.",
    },
    ar: {
      title: "المركز • طلبات الإعلان/المدونة",
      description: "إرسال أو إدارة طلبات الإعلان والمدونة.",
    },
  },
  "dashboard/center/ad-or-blog-request/ad-request": {
    en: {
      title: "Center • Ad Request",
      description: "Submit an advertisement request.",
    },
    ar: { title: "المركز • طلب إعلان", description: "إرسال طلب إعلان." },
  },
  "dashboard/center/ad-or-blog-request/blog-request": {
    en: {
      title: "Center • Blog Request",
      description: "Submit a blog post request.",
    },
    ar: { title: "المركز • طلب تدوينة", description: "إرسال طلب تدوينة." },
  },
  "dashboard/center/ad-or-blog-request/edit-blog": {
    en: {
      title: "Center • Edit Blog",
      description: "Edit submitted blog post.",
    },
    ar: {
      title: "المركز • تعديل تدوينة",
      description: "تعديل التدوينة المرسلة.",
    },
  },
  "dashboard/center/billing": {
    en: {
      title: "Center • Billing",
      description: "Invoices, payments, and subscriptions.",
    },
    ar: {
      title: "المركز • الفوترة",
      description: "الفواتير والمدفوعات والاشتراكات.",
    },
  },

  // Parent
  "dashboard/parent/bookings": {
    en: {
      title: "Parent • Bookings",
      description: "Manage and track your bookings.",
    },
    ar: { title: "ولي الأمر • الحجوزات", description: "إدارة وتتبع حجوزاتك." },
  },
  "dashboard/parent/chat": {
    en: {
      title: "Parent • Chat",
      description: "Chat with centers and admins.",
    },
    ar: {
      title: "ولي الأمر • المحادثات",
      description: "التواصل مع المراكز والمسؤولين.",
    },
  },
  "dashboard/parent/children": {
    en: {
      title: "Parent • Children",
      description: "View and edit your children's profiles.",
    },
    ar: {
      title: "ولي الأمر • الأطفال",
      description: "عرض وتعديل ملفات أطفالك.",
    },
  },
  "dashboard/parent/children/add": {
    en: {
      title: "Parent • Add Child",
      description: "Create a new child profile.",
    },
    ar: { title: "ولي الأمر • إضافة طفل", description: "إنشاء ملف طفل جديد." },
  },
  "dashboard/parent/children/edit": {
    en: {
      title: "Parent • Edit Child",
      description: "Edit your child's profile.",
    },
    ar: { title: "ولي الأمر • تعديل طفل", description: "تعديل ملف الطفل." },
  },
  "dashboard/parent/daily-reports": {
    en: {
      title: "Parent • Daily Reports",
      description: "View daily reports from centers.",
    },
    ar: {
      title: "ولي الأمر • التقارير اليومية",
      description: "عرض التقارير اليومية من المراكز.",
    },
  },
  "dashboard/parent/account": {
    en: {
      title: "Parent • Account",
      description: "Manage your account settings.",
    },
    ar: { title: "ولي الأمر • الحساب", description: "إدارة إعدادات حسابك." },
  },
};

const defaultMeta: { en: LocalizedMeta; ar: LocalizedMeta } = {
  en: { title: "Dashboard", description: "Manage your activity and settings." },
  ar: { title: "لوحة التحكم", description: "إدارة نشاطاتك وإعداداتك." },
};

export function getDashboardMetadata(
  locale: Locale,
  pathname: string
): LocalizedMeta {
  const key = normalizeDashboardPath(pathname);
  const meta = dashboardMetadata[key] ?? defaultMeta;
  return meta[locale] ?? defaultMeta["en"];
}

export function makePageMetadata(locale: Locale, pathname: string): Metadata {
  const m = getDashboardMetadata(locale, pathname);
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
    },
    alternates: {
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
  };
}

export function isDashboardPath(pathname: string): boolean {
  return normalizeDashboardPath(pathname).startsWith("dashboard");
}
