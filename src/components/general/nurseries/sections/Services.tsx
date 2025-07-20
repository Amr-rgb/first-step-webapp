interface Service {
  title: string;
  description: string;
  image: string;
}

interface ServicesProps {
  services: Service[];
}

const Services = ({ services }: ServicesProps) => (
  <section className="mt-10 mb-10 px-2 md:px-8">
    <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-8 md:mb-10">
      خدمات الحضانة
    </h2>
    <div className="flex flex-col gap-10 md:gap-14">
      {services.map((service, idx) => (
        <div
          key={idx}
          className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-white rounded-xl shadow p-4 md:p-8`}
        >
          {/* Alternate image/text sides */}
          {idx % 2 === 1 ? (
            <>
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-md h-44 md:h-56 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="object-cover w-full h-full opacity-80"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-[#22336C] mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-700 text-base md:text-lg mb-2">
                  {service.description}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 order-2 md:order-1">
                <h3 className="text-xl md:text-2xl font-bold text-[#22336C] mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-700 text-base md:text-lg mb-2">
                  {service.description}
                </p>
              </div>
              <div className="flex-1 order-1 md:order-2 flex justify-center">
                <div className="w-full max-w-md h-44 md:h-56 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="object-cover w-full h-full opacity-80"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default Services;
