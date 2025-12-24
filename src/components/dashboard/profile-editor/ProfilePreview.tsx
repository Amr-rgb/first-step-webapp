"use client";

import { ProfileSection } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Clock,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import Services from "@/components/general/nurseries/sections/Services";
import Programs from "@/components/general/nurseries/sections/Programs";
import Activities from "@/components/general/nurseries/sections/Activities";
import Team from "@/components/general/nurseries/sections/Team";
import Stats from "@/components/general/nurseries/sections/Stats";
import Philosophy from "@/components/general/nurseries/sections/Philosophy";
import Branches from "@/components/general/nurseries/Branches";
import Link from "next/link";
import { Icons } from "@/components/general/icons";
import { useTranslations } from "next-intl";

interface ProfilePreviewProps {
  sections: ProfileSection[];
  isEmpty: boolean;
}

const ProfilePreview = ({ sections, isEmpty }: ProfilePreviewProps) => {
  const t = useTranslations("dashboard.profileEditor");

  // Get locale from the current path
  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1]
      : "en";

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Empty State */}
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
              <div className="w-32 h-32 mx-auto mb-6 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 8h10M7 12h4m1 8l-1-8 1 8z"
                  />
                </svg>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Nursery Profile
              </h1>

              <div className="text-6xl mb-6">🏗️</div>

              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Coming Soon!
              </h2>

              <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Your nursery profile is still under construction. Start by
                adding sections from the editor to showcase your nursery's
                story, services, team, and more to create an amazing first
                impression for parents.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Add Sections
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enable sections to tell your story
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Customize Content
                  </h3>
                  <p className="text-sm text-gray-600">
                    Add your unique information
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Preview & Publish
                  </h3>
                  <p className="text-sm text-gray-600">
                    See how it looks to parents
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  💡 Switch to <strong>Edit Mode</strong> to start building your
                  profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = (section: ProfileSection) => {
    switch (section.type) {
      case "hero":
        return (
          <section
            key={section.id}
            className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: section.data.image
                ? `url(${section.data.image})`
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {section.data.title || "Welcome to Our Nursery"}
              </h1>
              {section.data.subtitle && (
                <h2 className="text-2xl md:text-3xl font-light mb-6">
                  {section.data.subtitle}
                </h2>
              )}
              {section.data.description && (
                <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
                  {section.data.description}
                </p>
              )}
              {section.data.ctaText && (
                <Button
                  size="lg"
                  className="bg-linear-to-r from-[#6A8DFF] to-[#3B5BDB] text-white px-12 py-4 text-lg font-bold rounded-xl shadow-lg hover:opacity-90 transition transform hover:scale-105"
                >
                  {section.data.ctaText}
                </Button>
              )}
            </div>
          </section>
        );

      case "about":
        return (
          <section key={section.id} className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    {section.data.title || "About Our Nursery"}
                  </h2>
                  {section.data.description && (
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      {section.data.description}
                    </p>
                  )}
                </div>

                {(section.data.mission || section.data.vision) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {section.data.mission && (
                      <Card className="p-8 border-2 border-blue-100 bg-blue-50/50">
                        <h3 className="text-2xl font-bold text-blue-900 mb-4">
                          Our Mission
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {section.data.mission}
                        </p>
                      </Card>
                    )}
                    {section.data.vision && (
                      <Card className="p-8 border-2 border-purple-100 bg-purple-50/50">
                        <h3 className="text-2xl font-bold text-purple-900 mb-4">
                          Our Vision
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {section.data.vision}
                        </p>
                      </Card>
                    )}
                  </div>
                )}

                {section.data.images && section.data.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {section.data.images.map((image: any, index: number) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <img
                          src={
                            image.url ||
                            "https://via.placeholder.com/400x300?text=Gallery+Image"
                          }
                          alt={image.caption || `Gallery image ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4">
                            <p className="text-white text-sm">
                              {image.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case "services":
        return section.data.services && section.data.services.length > 0 ? (
          <Services key={section.id} services={section.data.services} />
        ) : null;

      case "plans":
        return section.data.plans && section.data.plans.length > 0 ? (
          <section key={section.id} className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    {locale === "ar" ? "برامجنا" : "Plans"}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.data.plans.map((plan: any, index: number) => (
                    <Card
                      key={index}
                      className="p-6 border-2 border-blue-100 bg-white hover:shadow-lg transition-shadow"
                    >
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          {plan.title ||
                            `${locale === "ar" ? "البرنامج" : "Program"} ${
                              index + 1
                            }`}
                        </h3>

                        <div className="space-y-3 mb-6">
                          {plan.age_group && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">
                                {locale === "ar"
                                  ? "الفئة العمرية:"
                                  : "Age Range:"}
                              </span>{" "}
                              {plan.age_start !== undefined &&
                              plan.age_end !== undefined
                                ? `${plan.age_start}-${plan.age_end} ${
                                    locale === "ar" ? "سنة" : "years"
                                  }`
                                : plan.age_group}
                            </div>
                          )}

                          {plan.enrollment_type && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">
                                {locale === "ar"
                                  ? "نوع التسجيل:"
                                  : "Enrollment:"}
                              </span>{" "}
                              {plan.enrollment_type}
                            </div>
                          )}

                          {plan.count && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">
                                {locale === "ar" ? "المدة:" : "Duration:"}
                              </span>{" "}
                              {plan.count}{" "}
                              {(() => {
                                let unitKey = plan.enrollment_type;
                                if (locale === "ar") {
                                  if (plan.count >= 3 && plan.count <= 10) {
                                    unitKey = `${plan.enrollment_type}s`;
                                  }
                                } else if (plan.count > 1) {
                                  unitKey = `${plan.enrollment_type}s`;
                                }
                                return t(`plans.units.${unitKey}`);
                              })()}
                            </div>
                          )}
                        </div>

                        {plan.price_amount && (
                          <div className="text-2xl font-bold text-blue-600 mb-4">
                            {plan.price_amount}{" "}
                            {locale === "ar" ? "ريال" : "SAR"}
                          </div>
                        )}

                        <Button className="w-full">
                          {locale === "ar" ? "احجز الآن" : "Book Now"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null;

      case "team":
        return section.data.members && section.data.members.length > 0 ? (
          <Team key={section.id} members={section.data.members} />
        ) : null;

      case "activities":
        return (
          <Activities
            key={section.id}
            title={section.data.title || "Our Activities"}
            subtitle={section.data.subtitle || ""}
            activities={(section.data.images || [])
              .map((img: any) => img.url)
              .filter(Boolean)}
            buttonText="Book Now"
            preview={true}
          />
        );

      case "philosophy":
        return (
          <Philosophy
            key={section.id}
            data={{
              philosophy: {
                content: section.data.philosophy || "Our philosophy goes here",
              },
              methodology: {
                content:
                  section.data.methodology || "Our methodology goes here",
              },
              goals: {
                content: section.data.goal || "Our goal goes here",
              },
            }}
          />
        );

      case "branches":
        return (
          <section
            key={section.id}
            className="my-10 container mx-auto px-4 xl:px-8"
          >
            <h2 className="mb-6 heading-3 text-secondary-burgundy text-center">
              {section.data.title || "Our Branches"}
            </h2>
            <div className="relative overflow-x-auto overflow-y-hidden px-4">
              <div className="flex flex-nowrap pb-4 min-h-[120px] justify-center">
                {(section.data.branches || []).map(
                  (branch: any, index: number) => (
                    <div
                      key={branch.name || index}
                      className={`group relative flex flex-col items-center min-w-48 md:min-w-64 w-48 mb-8 text-[#B12F53] fill-[#B12F53]`}
                    >
                      <div className="-z-50 w-full h-1 bg-light-gray absolute translate-y-[670%] top-1/2 group-first:w-1/2 group-last:w-1/2 group-first:right-0 group-last:left-0 rtl:group-last:right-0 rtl:group-first:right-auto rtl:group-first:left-0" />
                      <div className="rounded-full flex items-center justify-center origin-[50%_80%] group-even:rotate-180">
                        <svg
                          className="fill-inherit size-20"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </div>
                      <p className="absolute left-1/2 -translate-x-1/2 group-even:top-[20%] group-odd:top-full text-2xl text-center font-bold text-nowrap whitespace-nowrap">
                        {branch.name || `Branch ${index + 1}`}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        );

      case "stats":
        return (
          <Stats
            key={section.id}
            stats={[
              {
                icon: (
                  <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
                    <path
                      d="M8 56V24L32 8l24 16v32H8Z"
                      stroke="#B12F53"
                      strokeWidth="3"
                    />
                    <path
                      d="M24 56V40h16v16"
                      stroke="#B12F53"
                      strokeWidth="3"
                    />
                  </svg>
                ),
                value: section.data.area || "2000",
                label: "Area (sqm)",
                color: "text-[#B12F53]",
              },
              {
                icon: (
                  <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
                    <path
                      d="M12 16h40v32H12z"
                      stroke="#22336C"
                      strokeWidth="3"
                    />
                    <path
                      d="M24 32h16M24 40h16"
                      stroke="#22336C"
                      strokeWidth="3"
                    />
                    <circle
                      cx="20"
                      cy="24"
                      r="4"
                      stroke="#22336C"
                      strokeWidth="3"
                    />
                  </svg>
                ),
                value: section.data.classrooms || "10",
                label: "Classrooms",
                color: "text-[#22336C]",
              },
              {
                icon: (
                  <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="20"
                      r="8"
                      stroke="#47B881"
                      strokeWidth="3"
                    />
                    <path
                      d="M16 52c0-8.837 7.163-16 16-16s16 7.163 16 16"
                      stroke="#47B881"
                      strokeWidth="3"
                    />
                    <circle
                      cx="16"
                      cy="28"
                      r="5"
                      stroke="#47B881"
                      strokeWidth="2"
                    />
                    <circle
                      cx="48"
                      cy="28"
                      r="5"
                      stroke="#47B881"
                      strokeWidth="2"
                    />
                  </svg>
                ),
                value: section.data.teamMembers || "25",
                label: "Team Members",
                color: "text-[#47B881]",
              },
            ]}
            buttonText="Book Now"
            preview={true}
          />
        );

      case "contact":
        return (
          <section key={section.id} className="mt-20 mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-8">
              Contact Information
            </h2>
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-md p-6 text-center space-y-2 max-w-md w-full mx-4">
                <img
                  src="/assets/illustrations/contact.png"
                  alt="Contact"
                  className="mx-auto mb-4 w-16 h-16 object-contain"
                />
                {section.data.address && (
                  <p className="text-gray-700">{section.data.address}</p>
                )}
                {section.data.phone && (
                  <p className="text-gray-700">{section.data.phone}</p>
                )}
                {section.data.email && (
                  <p className="text-gray-700">{section.data.email}</p>
                )}
                {section.data.workingHours && (
                  <p className="text-gray-700">{section.data.workingHours}</p>
                )}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Preview Header */}
      <div className="bg-linear-to-r from-primary/10 to-purple-50 border-b border-gray-200 px-6 py-4">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            ✨ Live Preview - This is how your nursery profile will appear to
            visitors
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Changes made in edit mode will be reflected here instantly
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative">
        {sections.filter((section) => section.enabled).map(renderSection)}

        {/* Footer */}
        <footer className="bg-gray-50 py-8 border-t border-gray-200">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600">
              Powered by First Step - Nursery Management Platform
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This is a preview of your nursery profile
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProfilePreview;
