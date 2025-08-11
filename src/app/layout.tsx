import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "../styles/globals.css";
import LocaleProvider from "@/components/LocaleProvider";

const tajawal = Tajawal({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "First Step",
  description: "Smart childcare for every family.",
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
