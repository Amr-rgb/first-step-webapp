import Image from "next/image";
import { Heart, MapPin, Clock, Phone, Star } from "lucide-react";
import StarRatingView from "../StarRating";
import { Button } from "@/components/ui/button";
import { CenterRegisterPayload } from "@/types";
import Link from "next/link";
import { createSlug, mapOptions } from "@/lib/utils";
import {
  SERVICE_IDS,
  AGE_GROUP_IDS,
  COMMUNICATION_METHODS_IDS,
  ADDITIONAL_FEATURES_IDS,
} from "@/lib/options";
import { useTranslations } from "next-intl";

const NurseryCard = ({ nursery, locale }: { nursery: any; locale: string }) => {
  const slug = createSlug(nursery.nursery_name, "ar");
  const t = useTranslations("options");

  // Create mapped options for translations
  const serviceOptions = mapOptions(SERVICE_IDS, "centerServices", t);
  const communicationOptions = mapOptions(
    COMMUNICATION_METHODS_IDS,
    "centerCommunicationMethods",
    t
  );
  const ageOptions = mapOptions(AGE_GROUP_IDS, "centerAges", t);
  const additionalFeaturesOptions = mapOptions(
    ADDITIONAL_FEATURES_IDS,
    "additionalFeatures",
    t
  );

  // Helper function to get translation by ID
  const getTranslationById = (
    id: string,
    options: { id: string; label: string }[]
  ) => {
    return options.find((option) => option.id === id)?.label || id;
  };

  // Get branches for display
  const branchNames =
    nursery.branches
      ?.map((branch: any) =>
        branch.name === "Main Branch" ? "الفرع الرئيسي" : branch.name
      )
      .join("، ") || "الفرع الرئيسي";

  // Get main branch for location
  const mainBranch = nursery.branches?.[0] || nursery;

  // Calculate average rating (placeholder - would come from reviews)
  const rating = 4.2;

  // Get services for display (including additional service)
  const allServices = [
    ...nursery.services.map((service: string) =>
      getTranslationById(service, serviceOptions)
    ),
    ...nursery.communication_methods.map((method: string) =>
      getTranslationById(method, communicationOptions)
    ),
    nursery.emergency_contact
      ? getTranslationById("emergency-contact", additionalFeaturesOptions)
      : null,
    nursery.special_needs
      ? getTranslationById("special-needs", additionalFeaturesOptions)
      : null,
    nursery.provides_food
      ? getTranslationById("food-service", additionalFeaturesOptions)
      : null,
    nursery.additional_service && nursery.additional_service !== "N/A"
      ? nursery.additional_service
      : null,
  ].filter(Boolean);

  // Get accepted ages for separate display
  const acceptedAges = nursery.accepted_ages
    .map((age: string) => getTranslationById(age, ageOptions))
    .join("، ");

  return (
    <Link href={`/nurseries/${slug}`} className="block">
      <div className="bg-white rounded-5xl overflow-hidden shadow-[0_2px_80px_0_rgba(34,34,34,0.08)]">
        <div className="p-6">
          {/* Logo section */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-white to-secondary-mint-green/24 rounded-lg flex items-center justify-center">
              <div className="w-20 h-20 bg-white border border-secondary-mint-green rounded-lg flex items-center justify-center overflow-hidden">
                {nursery.logo ? (
                  <Image
                    src={
                      typeof nursery.logo === "string" &&
                      !nursery.logo.startsWith("/") &&
                      !nursery.logo.startsWith("http")
                        ? `/${nursery.logo}`
                        : nursery.logo
                    }
                    alt={`${nursery.nursery_name} logo`}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-white to-secondary-mint-green/24 rounded flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">
                      {nursery.nursery_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="heading-4 font-bold text-center text-primary mb-4">
            {nursery.nursery_name}
          </h2>

          {/* Branches */}
          <p className="text-center text-gray text-sm mb-4">{branchNames}</p>

          {/* Location */}
          <div className="flex items-center justify-center gap-1 mb-4">
            <MapPin size={16} className="text-info" />
            <span className="text-sm text-gray text-center">
              {typeof mainBranch.city === "object" && mainBranch.city !== null
                ? mainBranch.city.name[locale]
                : mainBranch.city}{" "}
              {typeof mainBranch.neighborhood === "object" &&
              mainBranch.neighborhood !== null
                ? mainBranch.neighborhood[locale]
                : mainBranch.neighborhood}
            </span>
          </div>

          {/* Accepted Ages */}
          <div className="flex items-center justify-center gap-1 mb-4">
            <svg
              width={17}
              height={16}
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.5 8h.007M10.5 8h.007m-3.34 2.667c.333.2.8.333 1.333.333s1-.133 1.333-.333M13.167 4.2a6 6 0 0 1 1.2 2.6 1.333 1.333 0 0 1 0 2.4 6 6 0 0 1-11.734 0 1.333 1.333 0 0 1 0-2.4A6 6 0 0 1 8.5 2c1.333 0 2.333.733 2.333 1.667 0 .933-.6 1.666-1.333 1.666-.533 0-1-.266-1-.666"
                stroke="#83CBAA"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-gray">{acceptedAges}</span>
          </div>

          {/* Rating */}
          {/* <div className="flex justify-center items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div> */}

          {/* Services grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {allServices.slice(0, 18).map((service, i) => (
              <div
                key={i}
                className="flex items-center gap-1 p-2 bg-gray-50 rounded-lg"
              >
                <svg
                  width={17}
                  height={16}
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m7.833 11.334 1.334 1.333a1.415 1.415 0 0 0 2-2M9.833 9.334 11.5 11a1.414 1.414 0 1 0 2-2l-2.587-2.586a2 2 0 0 0-2.826 0L7.5 7a1.414 1.414 0 0 1-2-2l1.873-1.873a3.86 3.86 0 0 1 4.707-.58l.313.187c.284.171.622.23.947.166l1.16-.233m0-.667.667 7.334h-1.334M2.5 2l-.667 7.334 4.334 4.333a1.414 1.414 0 0 0 2-2m-5.667-9h5.333"
                    stroke="#83CBAA"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-gray-900 ">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NurseryCard;
