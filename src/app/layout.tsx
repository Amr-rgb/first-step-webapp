import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "../styles/globals.css";
import LocaleProvider from "@/components/LocaleProvider";

const tajawal = Tajawal({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "First Step - Smart Childcare Platform | Find Trusted Nurseries in Saudi Arabia",
  description:
    "Connect with trusted nurseries and childcare centers in Saudi Arabia. Smart childcare solutions for every family. Browse centers, compare plans, and book easily.",
  keywords: [
    "childcare",
    "nursery",
    "Saudi Arabia",
    "daycare",
    "childcare center",
    "kindergarten",
    "preschool",
    "baby care",
    "child development",
    "family services",
    "early childhood education",
    "parenting",
    "childcare booking",
    "nursery finder",
    "childcare platform",
  ],
  authors: [{ name: "First Step Team" }],
  creator: "First Step",
  publisher: "First Step",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://firststep.com"),
  alternates: {
    canonical: "https://firststep.com",
    languages: {
      en: "https://firststep.com/en",
      ar: "https://firststep.com/ar",
    },
  },
  openGraph: {
    title: "First Step - Smart Childcare Platform",
    description:
      "Connect with trusted nurseries and childcare centers in Saudi Arabia. Smart childcare solutions for every family.",
    url: "https://firststep.com",
    siteName: "First Step",
    images: [
      {
        url: "/assets/logos/complete_logo.svg",
        width: 1200,
        height: 630,
        alt: "First Step - Smart Childcare Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "First Step - Smart Childcare Platform",
    description:
      "Connect with trusted nurseries and childcare centers in Saudi Arabia.",
    images: ["/assets/logos/complete_logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${tajawal.className} min-h-screen flex flex-col antialiased`}
        suppressHydrationWarning
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
