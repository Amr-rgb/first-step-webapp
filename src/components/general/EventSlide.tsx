"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

const EventSlide = () => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div
      className={`relative w-full bg-transparent overflow-hidden flex ${
        isRTL ? "flex-row-reverse" : "flex-row"
      } h-[21vh] sm:h-[45vh] md:h-[50vh] lg:h-[59vh] xl:h-[59vh]`}
    >
      {isRTL ? (
        // Arabic version: Logo left, Content right
        <>
          {/* Left container (logo background) */}
          <div
            className="w-full h-full bg-cover bg-center sm:w-1/3 sm:h-full"
            style={{ backgroundImage: "url('/assets/events/logo-event.png')" }}
          ></div>

          {/* Right container (background event) */}
          <div
            className="w-full h-full bg-cover bg-center flex flex-col justify-between text-white sm:w-2/3 sm:h-full p-4 sm:p-5 md:p-6 lg:p-8"
            style={{
              backgroundImage: "url('/assets/events/backgroud-event.png')",
            }}
          >
            {/* Top - Title */}
            <div className="flex justify-start">
              <img
                src="/assets/events/title-background.png"
                alt="Saudi National Day Title"
                className="w-1/3 sm:w-[45%] md:w-2/5 lg:w-1/3 h-auto"
              />
            </div>

            {/* Middle - Text */}
            <div className="text-right flex flex-col gap-0.5 sm:gap-2 mb-2 sm:mb-0">
              <p className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold m-0">
                احتفالًا باليوم الوطني السعودي
              </p>
              <p className="text-xs sm:text-lg md:text-xl lg:text-2xl font-semibold m-0">
                <span
                  className="font-black text-white mr-1"
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "1.5em",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  95
                </span>{" "}
                يوم اشتراك مجاني
              </p>
            </div>

            {/* Bottom - Button */}
            <div className="flex justify-start mb-2 pb-2 sm:mb-0 sm:pb-0">
              <Link
                href="/sign-up/center"
                className="bg-white text-green-900 border-none font-bold cursor-pointer no-underline inline-block transition-colors duration-300 hover:bg-gray-200 px-4 py-2 text-sm rounded-md shadow-sm sm:px-5 sm:py-2.5 sm:text-base sm:rounded-lg sm:shadow-md md:px-6 md:py-3 md:text-base md:rounded-lg md:shadow-md lg:px-6 lg:py-3 lg:text-base lg:rounded-lg lg:shadow-md"
              >
                احجز الآن
              </Link>
            </div>
          </div>
        </>
      ) : (
        // English version: Content left, Logo right (swapped)
        <>
          {/* Left container (background event) - Content */}
          <div
            className="w-full h-full bg-cover bg-center flex flex-col justify-between text-white sm:w-2/3 sm:h-full p-4 sm:p-5 md:p-6 lg:p-8"
            style={{
              backgroundImage: "url('/assets/events/backgroud-event.png')",
            }}
          >
            {/* Top - Title */}
            <div className="flex justify-start">
              <img
                src="/assets/events/title-background.png"
                alt="Saudi National Day Title"
                className="w-1/3 sm:w-[45%] md:w-2/5 lg:w-1/3 h-auto"
              />
            </div>

            {/* Middle - Text */}
            <div className="text-left flex flex-col gap-0.5 sm:gap-2 mb-2 sm:mb-0">
              <p className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold m-0">
                Celebrating Saudi National Day
              </p>
              <p className="text-xs sm:text-lg md:text-xl lg:text-2xl font-semibold m-0">
                <span
                  className="font-black text-white mr-1"
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "1.5em",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  95
                </span>{" "}
                days free subscription
              </p>
            </div>

            {/* Bottom - Button */}
            <div className="flex justify-start mb-2 pb-2 sm:mb-0 sm:pb-0">
              <Link
                href="/sign-up/center"
                className="bg-white text-green-900 border-none font-bold cursor-pointer no-underline inline-block transition-colors duration-300 hover:bg-gray-200 px-4 py-2 text-sm rounded-md shadow-sm sm:px-5 sm:py-2.5 sm:text-base sm:rounded-lg sm:shadow-md md:px-6 md:py-3 md:text-base md:rounded-lg md:shadow-md lg:px-6 lg:py-3 lg:text-base lg:rounded-lg lg:shadow-md"
              >
                Book Now
              </Link>
            </div>
          </div>

          {/* Right container (logo background) */}
          <div
            className="w-full h-full bg-cover bg-center sm:w-1/3 sm:h-full"
            style={{ backgroundImage: "url('/assets/events/logo-event.png')" }}
          ></div>
        </>
      )}
    </div>
  );
};

export default EventSlide;
