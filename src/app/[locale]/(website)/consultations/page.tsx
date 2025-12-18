import { Metadata } from "next";
import React from "react";
import ConsultationsClient from "./ConsultationsClient";

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await paramsPromise;
  return {
    title:
      params.locale === "ar"
        ? "First Step استشارات | استشارات تربوية ونفسية متخصصة"
        : "First Step Consultations | Specialized Educational & Psychological Consultations",
    description:
      params.locale === "ar"
        ? "نقدم استشارات تربوية ونفسية متخصصة لأولياء الأمور والمراكز التعليمية لدعم نمو الأطفال وتطوير بيئة تعليمية آمنة وفعالة."
        : "We provide specialized educational and psychological consultations for parents and educational centers to support children's growth and develop a safe and effective learning environment.",
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    type?: string;
  }>;
}

export default async function ConsultationsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { type } = await searchParams;
  const activeTab = type === "center" ? "center" : "parent";

  return <ConsultationsClient initialTab={activeTab} locale={locale} />;
}

export const dynamic = "force-dynamic";
