export interface WorldOfLearningContactInfo {
  title: string;
  ownerName: string;
  ownerRole: string;
  nurseryName: string;
  mobile: string;
  phone: string;
  address: string;
}

export interface WorldOfLearningProgram {
  title: string;
  price: string;
  features: string[];
  buttonText: string;
}

export interface WorldOfLearningPrograms {
  title: string;
  junior: {
    monthly: WorldOfLearningProgram;
    daily: WorldOfLearningProgram;
    hourly: WorldOfLearningProgram;
  };
}

export interface WorldOfLearningService {
  title: string;
  desc: string;
}

export interface WorldOfLearningServices {
  creativeChild: WorldOfLearningService;
  playground: WorldOfLearningService;
  unit: WorldOfLearningService;
  montessori: WorldOfLearningService;
}

export interface WorldOfLearningActivities {
  title: string;
  description: string;
  activity1: string;
  activity2: string;
  activity3: string;
  activity4: string;
  activity5: string;
}

export interface WorldOfLearningPhilosophy {
  title: string;
  text: string;
  junior: string;
}

export interface WorldOfLearningMethodology {
  title: string;
  text: string;
  junior: string;
}

export interface WorldOfLearningGoal {
  title: string;
  text: string;
  junior: string;
}

export interface WorldOfLearningPortfolioData {
  slogan: string;
  contactInfo: WorldOfLearningContactInfo;
  header: {
    sloganFallback: string;
    description: string;
    cta: string;
  };
  programs: WorldOfLearningPrograms;
  services: WorldOfLearningServices;
  activities: WorldOfLearningActivities;
  philosophy: WorldOfLearningPhilosophy;
  methodology: WorldOfLearningMethodology;
  goal: WorldOfLearningGoal;
}

export const worldOfLearningPortfolioData: WorldOfLearningPortfolioData = {
  slogan: "Here I take my first steps",
  contactInfo: {
    title: "Contact Information",
    ownerName: "Howaida Nabil Gazzaz",
    ownerRole: "School Owner",
    nurseryName: "World of Learning Nursery for Children",
    mobile: "Mobile: +966543407777",
    phone: "Phone: +966122886631",
    address:
      "Saudi Arabia - Jeddah 23423 - Al Khalidiyah District – Bahour Al Shoara Street",
  },
  header: {
    sloganFallback: "Here will be the nursery's slogan or any phrase",
    description:
      "We provide parents with detailed daily reports on their children's performance in the nursery, including interaction level and activities participated in.",
    cta: "Book for your child now",
  },
  programs: {
    title: "Our Programs",
    junior: {
      monthly: {
        title: "Monthly Program",
        price: "1,980",
        features: [
          "Monthly subscription includes all educational and recreational activities and programs.",
          "Daily healthy meals.",
          "Regular follow-up reports on the child's performance.",
          "Supervision by specialized and experienced teachers.",
          "Ability to communicate with management and teachers at any time.",
        ],
        buttonText: "Book Now",
      },
      daily: {
        title: "Daily Program",
        price: "115",
        features: [
          "Flexible daily subscription as needed.",
          "Benefit from all activities in a single day.",
          "Healthy meal.",
          "Daily report on the child.",
          "Supervision by specialized teachers.",
        ],
        buttonText: "Book Now",
      },
      hourly: {
        title: "Hourly Flexible Program",
        price: "110",
        features: [
          "Hourly subscription as desired by the parent.",
          "Benefit from available activities during the hour.",
          "Supervision by specialized teachers.",
          "Flexibility in attendance and departure.",
          "Brief report on the child.",
        ],
        buttonText: "Book Now",
      },
    },
  },
  services: {
    creativeChild: {
      title: "Creative Child",
      desc: "Artistic work helps the child enhance fine motor skills, social communication, self-confidence, and freedom of self-expression, giving them the opportunity for creativity and exploration.",
    },
    playground: {
      title: "Outdoor/Indoor Playground",
      desc: "A fun time for children to run, play, and respect others' turns under their teacher's supervision.",
    },
    unit: {
      title: "The Unit",
      desc: "A beautiful class where the child learns about the world from a simple perspective.",
    },
    montessori: {
      title: "Montessori & Skills Development",
      desc: "Learning through play, considering the child's natural psychological development, using simple educational methods to stimulate and develop the child's senses, helping them develop concentration, independence, hand strength, and self-confidence.",
    },
  },
  activities: {
    title: "Nursery Activities",
    description:
      "Sports - Education - Entertainment - Cinema - Scientific Experiments - Nursery - After School Hosting",
    activity1: "Activity 1",
    activity2: "Activity 2",
    activity3: "Activity 3",
    activity4: "Activity 4",
    activity5: "Activity 5",
  },
  philosophy: {
    title: "Our Philosophy",
    text: "We provide parents with detailed daily reports on their children's performance in the nursery, including interaction level, activities participated in, and notes on various skills. These reports enhance communication between families and teachers, helping to better support and track the child's growth.",
    junior:
      "We believe every child is unique and deserves a safe, stimulating educational environment to grow and develop.",
  },
  methodology: {
    title: "Our Methodology",
    text: "We use the latest internationally recognized educational and pedagogical methods, focusing on learning through play and hands-on experience.",
    junior:
      "Our curriculum combines academic learning with the development of life and social skills.",
  },
  goal: {
    title: "Our Goal",
    text: "We strive to provide a safe and stimulating environment that enables children to discover their abilities and develop their skills.",
    junior:
      "Our goal is to be the parents' first partner in their children's growth journey.",
  },
};
