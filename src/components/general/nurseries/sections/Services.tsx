"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

interface Service {
  title: string;
  description: string;
  image: string;
}

interface ServicesProps {
  services: Service[];
}

const Services = ({ services }: ServicesProps) => {
  const t = useTranslations("nurseryDetails");
  const [activeIndex, setActiveIndex] = useState(0);

  // Don't render if no services
  if (!services || services.length === 0) {
    return null;
  }


  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % services.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  // Get prev, current, and next indices
  const prevIndex = (activeIndex - 1 + services.length) % services.length;
  const nextIndex = (activeIndex + 1) % services.length;

  return (
    <section className="mt-20 mb-16 px-4 md:px-8 lg:px-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-16">
        {t("services.title")}
      </h2>
      
      <div className="max-w-7xl mx-auto overflow-hidden">
        {/* Two Column Layout: Description + Fan Cards */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start lg:items-center justify-between mb-12">
          
          {/* Left: Service Name + Description */}
          <div className="flex flex-col gap-6 w-full lg:max-w-[400px] order-2 lg:order-1 z-10">
            {/* Service Name */}
            <h3 className="text-2xl md:text-3xl font-bold text-[#B12F53] transition-all duration-700 ease-in-out break-words">
              {services[activeIndex]?.title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-700 text-base md:text-lg leading-relaxed transition-all duration-700 ease-in-out break-words whitespace-normal overflow-wrap-anywhere">
              {services[activeIndex]?.description}
            </p>
          </div>

          {/* Right: Fan Layout Cards */}
          <div className="flex justify-center items-center order-1 lg:order-2 w-full lg:flex-1 min-h-[550px]">
            <div className="relative w-[700px] h-[520px]">
              {/* Container with perspective */}
              <div className="relative w-full h-full overflow-visible" style={{ perspective: "1500px" }}>
                
                {/* Left Card - Previous */}
                <div
                  className="absolute top-1/2 left-[40px] w-[270px] h-[480px] transition-all duration-1000 ease-in-out"
                  style={{
                    transform: "translateY(-50%) rotateY(15deg) rotateZ(-8deg)",
                    transformOrigin: "center center",
                    transformStyle: "preserve-3d",
                    zIndex: 1,
                  }}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl opacity-80">
                    {services[prevIndex]?.image && services[prevIndex].image.trim() !== "" ? (
                      <img
                        src={services[prevIndex].image}
                        alt={services[prevIndex].title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={`https://picsum.photos/320/400?random=${prevIndex}`}
                        alt={`Service ${prevIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
                  </div>
                  {/* Book Spine */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/50 to-transparent rounded-l-3xl"
                    style={{
                      transform: "translateZ(-15px) rotateY(-90deg)",
                      transformOrigin: "left center",
                    }}
                  ></div>
                </div>

                {/* Center Card - Active (Current) */}
                <div
                  className="absolute top-1/2 left-1/2 w-[270px] h-[480px] transition-all duration-1000 ease-in-out"
                  style={{
                    transform: "translate(-50%, -50%) rotateY(-10deg)",
                    transformOrigin: "center center",
                    transformStyle: "preserve-3d",
                    zIndex: 3,
                  }}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                    {services[activeIndex]?.image && services[activeIndex].image.trim() !== "" ? (
                      <img
                        key={activeIndex}
                        src={services[activeIndex].image}
                        alt={services[activeIndex].title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        key={activeIndex}
                        src={`https://picsum.photos/350/450?random=${activeIndex}`}
                        alt={`Service ${activeIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
                  </div>
                  {/* Book Spine */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-black/50 to-transparent rounded-l-3xl"
                    style={{
                      transform: "translateZ(-20px) rotateY(-90deg)",
                      transformOrigin: "left center",
                    }}
                  ></div>
                </div>

                {/* Right Card - Next */}
                <div
                  className="absolute top-1/2 right-[40px] w-[270px] h-[480px] transition-all duration-1000 ease-in-out"
                  style={{
                    transform: "translateY(-50%) rotateY(-15deg) rotateZ(8deg)",
                    transformOrigin: "center center",
                    transformStyle: "preserve-3d",
                    zIndex: 1,
                  }}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl opacity-80">
                    {services[nextIndex]?.image && services[nextIndex].image.trim() !== "" ? (
                      <img
                        src={services[nextIndex].image}
                        alt={services[nextIndex].title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={`https://picsum.photos/320/400?random=${nextIndex}`}
                        alt={`Service ${nextIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
                  </div>
                  {/* Book Spine */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/50 to-transparent rounded-l-3xl"
                    style={{
                      transform: "translateZ(-15px) rotateY(-90deg)",
                      transformOrigin: "left center",
                    }}
                  ></div>
                </div>

              </div>
            </div>
          </div>
        </div>
        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-8 mt-8">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-white border-2 border-[#B12F53] text-[#B12F53] hover:bg-[#B12F53] hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg"
            aria-label="Previous service"
          >
            <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3">
            {services.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === activeIndex 
                    ? "bg-[#B12F53] w-12 h-3" 
                    : "bg-gray-300 hover:bg-gray-400 w-3 h-3"
                }`}
                aria-label={`Go to service ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-white border-2 border-[#B12F53] text-[#B12F53] hover:bg-[#B12F53] hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg"
            aria-label="Next service"
          >
            <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
