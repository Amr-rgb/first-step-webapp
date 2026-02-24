"use client";

import Image from "next/image";
import { SectionHeader } from "../../../_components";

interface Service {
    title: string;
    description: string;
    price: string;
    image_service: string;
}

interface ServicesSectionProps {
    title: string;
    services: Service[];
    locale: string;
}

const ServicesSection = ({
    title,
    services,
    locale,
}: ServicesSectionProps) => {
    if (!services || services.length === 0) return null;

    return (
        <section id="services" className="py-0 scroll-mt-20">
            <SectionHeader title={title} />
            <div className="bg-white-out p-4 rounded-2xl flex flex-wrap items-center justify-center gap-x-4 gap-y-6">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl px-4 py-2 flex flex-col gap-2 min-w-[180px] grow"
                    >
                        <div className="relative w-12 h-12 md:w-15 md:h-15">
                            <Image
                                src={service.image_service.startsWith('http') 
                                    ? service.image_service 
                                    : `https://development.firststep-app.com/storage/${service.image_service}`
                                }
                                alt={service.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h4 className="heading-4 font-bold text-primary leading-tight">
                            {service.title}
                        </h4>
                        {service.description && (
                            <p className="text-xs text-gray-500 line-clamp-2">
                                {service.description}
                            </p>
                        )}
                        {service.price && (
                            <p className="text-sm font-semibold text-secondary-mint-green">
                                {service.price} {locale === "ar" ? "ر.س" : "SAR"}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ServicesSection;
