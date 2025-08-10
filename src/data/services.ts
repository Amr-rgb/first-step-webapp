import { Service } from "@/types";

// Extend the Service interface to include both languages
interface LocalizedService {
  id: number;
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  image: string;
}

export const parentServicesData: LocalizedService[] = [
  {
    id: 1,
    title: {
      ar: "بحث ذكي ومقارنة سهلة",
      en: "Smart Search and Easy Comparison",
    },
    description: {
      ar: "اكتشف الحضانات والمراكز الأنسب لطفلك. تتيح لك منصة First Step البحث حسب الموقع، السن والبرامج، مع الاطلاع على تقييمات حقيقية من أهالٍ آخرين. قارن بين الخيارات المتاحة وسجل طفلك مباشرة بكل يسر.",
      en: "Discover the most suitable nurseries and centers for your child. The First Step platform allows you to search by location, age, and programs, with access to genuine reviews from other parents. Compare available options and enroll your child directly with ease.",
    },
    image: "/assets/screens/center/center-1.png",
  },
  {
    id: 2,
    title: {
      ar: "متابعة تطور طفلك عن قرب",
      en: "Close Monitoring of Your Child's Development",
    },
    description: {
      ar: "استلام تقارير دورية ومنظمة حول تقدم الطفل، تفاعله اليومي، والأنشطة التي يشارك بها. هذه التقارير تسهل التعاون البناء مع المعلمين لدعم نمو طفلك بفعالية.",
      en: "Receive regular and organized reports on your child's progress, daily interactions, and activities they participate in. These reports facilitate constructive cooperation with teachers to support your child's growth effectively.",
    },
    image: "/assets/screens/parent/parent-2.png",
  },
  {
    id: 3,
    title: {
      ar: "تواصل مباشر وموثوق",
      en: "Direct and Reliable Communication",
    },
    description: {
      ar: "تواصل بسهولة مع إدارة الحضانة عبر نظام دردشة مدمج وآمن لطرح الاستفسارات ومتابعة المستجدات المتعلقة بطفلك.",
      en: "Easily communicate with nursery management via a secure, built-in chat system to ask questions and stay updated on matters related to your child.",
    },
    image: "/assets/screens/parent/parent-3.png",
  },
  {
    id: 4,
    title: {
      ar: "مصادر معرفية للأسرة",
      en: "Knowledge Resources for the Family",
    },
    description: {
      ar: "استفد من مدونتنا التي تقدم مقالات ونصائح عملية حول التربية الحديثة وتنمية مهارات الأطفال، لمساعدتك في توفير بيئة داعمة لنمو طفلك.",
      en: "Benefit from our blog, which offers practical articles and tips on modern parenting and developing children's skills, to help you provide a supportive environment for your child's growth.",
    },
    image: "/assets/screens/parent/parent-4.png",
  },
];

export const centerServicesData: LocalizedService[] = [
  {
    id: 1,
    title: {
      ar: "بروفايل احترافي للمركز",
      en: "Professional Center Profile",
    },
    description: {
      ar: "صفحة تعريفية جذابة تعرض هوية الحضانة أو المركز، البرامج والأنشطة. هذه الصفحة تمكن أولياء الأمور من التعرف على خدمات المركز والتسجيل مباشرة، لتعزيز الحضور الرقمي.",
      en: "An attractive introductory page showcasing the nursery or center's identity, programs, and activities. This page enables parents to learn about the center's services and enroll directly, enhancing its digital presence.",
    },
    image: "/assets/screens/center/center-1.png",
  },
  // {
  //   id: 2,
  //   title: {
  //     ar: "لوحة تحكم كاملة",
  //     en: "Complete Dashboard",
  //   },
  //   description: {
  //     ar: "إدارة كافة العمليات من مكان واحد. متابعة أداء المركز المالي، أعداد المسجلين، وإدارة فريق العمل بفعالية. الحصول على رؤى دقيقة من خلال إحصائيات وتقارير مفصلة لاتخاذ قرارات مدروسة.",
  //     en: "Manage all operations from a single location. Monitor the center's financial performance, number of registrants, and effectively manage your team. Gain accurate insights through detailed statistics and reports for informed decision-making.",
  //   },
  //   image: "/assets/screens/center/center-2.png",
  // },
  {
    id: 3,
    title: {
      ar: "إدارة حجوزات سلسة",
      en: "Seamless Booking Management",
    },
    description: {
      ar: "استقبال طلبات التسجيل الجديدة وإدارتها (قبول/رفض) بكفاءة عبر النظام. متابعة حالة الطلبات وتنظيم جدول الحجوزات بما يتناسب مع الطاقة الاستيعابية للحضانة أو المركز.",
      en: "Efficiently receive and manage new registration requests (accept/reject) through the system. Track the status of requests and organize the booking schedule to match the nursery or center's capacity.",
    },
    image: "/assets/screens/center/center-2.png",
  },
  {
    id: 4,
    title: {
      ar: "إرسال تقارير يومية",
      en: "Send Daily Reports",
    },
    description: {
      ar: "مشاركة التحديثات اليومية حول أنشطة الأطفال وتقدمهم بسهولة عبر المنصة. تقارير منظمة وشفافة تبني جسور الثقة مع أولياء الأمور.",
      en: "Easily share daily updates on children's activities and progress via the platform. Organized and transparent reports build trust with parents.",
    },
    image: "/assets/screens/center/center-3.png",
  },
  {
    id: 5,
    title: {
      ar: "دردشة فورية مدمجة",
      en: "Integrated Instant Chat",
    },
    description: {
      ar: "تواصل بشكل فوري وآمن مع أولياء الأمور مباشرةً عبر المنصة، دون الحاجة لاستخدام تطبيقات خارجية. حافظ على خصوصية المحادثات وسرعة الاستجابة.",
      en: "Communicate instantly and securely with parents directly through the platform, without the need for external applications. Maintain the privacy of conversations and ensure a prompt response.",
    },
    image: "/assets/screens/center/center-4.png",
  },
  {
    id: 6,
    title: {
      ar: "تنظيم المهام وإرسال الإشعارات الفورية",
      en: "Task Organization and Instant Notifications",
    },
    description: {
      ar: "استخدام التقويم الرقمي لتخطيط وإدارة المناسبات والمهام اليومية لفريق العمل. إرسال إشعارات وتنبيهات فورية لأولياء الأمور لضمان سير العمل بسلاسة.",
      en: "Use the digital calendar to plan and manage daily events and tasks for your team. Send instant notifications and alerts to parents to ensure smooth workflow.",
    },
    image: "/assets/screens/center/center-5.png",
  },
  {
    id: 7,
    title: {
      ar: "دعم فني واستشاري",
      en: "Technical and Consulting Support",
    },
    description: {
      ar: "نلتزم بدعم شركائنا. فريق الدعم الفني جاهز لمعالجة أي استفسارات تقنية. بالإضافة إلى ذلك، نقدم استشارات تربوية وإدارية متخصصة (ضمن باقات محددة أو كخدمة إضافية) للمساعدة على تطوير المناهج، تحسين العمليات، ورفع كفاءة المركز.",
      en: "We are dedicated to providing our partners with comprehensive support. Our technical support team is ready to address any technical inquiries. Additionally, we offer specialized educational and administrative consultations (within specific packages or as an additional service) to help develop curricula, improve operations, and enhance the center's efficiency.",
    },
    image: "/assets/screens/center/center-6.png",
  },
  {
    id: 8,
    title: {
      ar: "حلول إعلانية فعالة",
      en: "Effective Advertising Solutions",
    },
    description: {
      ar: "تعزيز ظهور المركز عبر نشر إعلانات أو تدوينات تعريفية داخل المنصة للوصول المباشر لأولياء الأمور. كما نوفر مساحة إعلانية حصرية في واجهة الموقع الرئيسية (Hero Section) لزيادة الانتشار ومعدلات التسجيل، مع تقارير أداء شفافة (مشاهدات ونقرات).",
      en: "Enhance the center's visibility by publishing advertisements or introductory blog posts within the platform for direct access to parents. We also provide exclusive advertising space in the main website interface (Hero Section) to increase reach and registration rates, with transparent performance reports (views and clicks).",
    },
    image: "/assets/screens/center/center-7.png",
  },
];

// Helper functions to convert to Service format
export const getParentServices = (locale: string): Service[] => {
  return parentServicesData.map((service) => ({
    id: service.id,
    title: service.title[locale as "ar" | "en"],
    description: service.description[locale as "ar" | "en"],
    image: service.image,
  }));
};

export const getCenterServices = (locale: string): Service[] => {
  return centerServicesData.map((service) => ({
    id: service.id,
    title: service.title[locale as "ar" | "en"],
    description: service.description[locale as "ar" | "en"],
    image: service.image,
  }));
};
