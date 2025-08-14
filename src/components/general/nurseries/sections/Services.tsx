"use client";

import { useTranslations } from "next-intl";

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

  // Don't render if no services
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 mb-10 px-4 md:px-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-12">
        {t("services.title")}
      </h2>
      <div className="flex flex-col gap-16 md:gap-20">
        {services.map((service, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            } items-center gap-8 md:gap-12`}
          >
            {/* Content Section */}
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-[#22336C] leading-tight">
                {service.title}
              </h3>
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Image Section with 3D Effect */}
            <div className="flex-1 flex justify-center">
              <div className="relative group">
                {/* 3D TV Screen Effect */}
                <div className="relative transform transition-all duration-500 group-hover:scale-105">
                  {/* Main TV Frame */}
                  <div className="relative">
                    {/* TV Screen with Skew Effect */}
                    <div
                      className={`w-80 h-60 md:w-96 md:h-72 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 ${
                        idx % 2 === 0
                          ? "skew-y-3 -rotate-2 hover:skew-y-2 hover:-rotate-1"
                          : "skew-y-[-3deg] rotate-2 hover:skew-y-[-2deg] hover:rotate-1"
                      }`}
                      style={{
                        transformStyle: "preserve-3d",
                        perspective: "1000px",
                      }}
                    >
                      {/* Image or Placeholder */}
                      {service.image && service.image.trim() !== "" ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <img
                          src={`https://picsum.photos/400/300?random=${idx}&blur=2`}
                          alt={`${service.title} placeholder`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}

                      {/* TV Screen Reflection Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>
                    </div>

                    {/* Screen Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Floating Elements for Depth */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500/20 rounded-full blur-sm animate-pulse delay-1000"></div>
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute -z-10 inset-0">
                  <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl opacity-20 ${
                      idx % 2 === 0
                        ? "animate-pulse"
                        : "animate-pulse delay-500"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
