import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  return (
    <section
      className="py-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #FFFFFF 0%, #D5F3E5 22%, #D5F5E6 38%, #C4E7D7 52%, #D5F5E6 66%, #D5F3E5 83%, #FFFFFF 100%)",
      }}
    >
      <div className="py-52 container mx-auto px-4 relative">
        <div className="z-50 relative flex flex-col gap-y-6 max-w-[50rem]">
          <h1 className="heading-2 text-primary">
            تمنحك منصة First Step أدوات متكاملة لإدارة مركزك بكفاءة واحترافية
          </h1>

          <div className="flex items-center gap-x-2.5">
            <Button variant="default" size="sm">
              سجل مركزك مجانًا
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="!border-light-gray text-mid-gray"
            >
              اكتشف خدماتنا
            </Button>
          </div>
        </div>

        <Image
          className={cn(
            "z-10 absolute",
            "ltr:-right-14 ltr:rotate-y-180 -top-24",
            "rtl:-left-14"
          )}
          src="/assets/hero/hero-pattern.svg"
          width={774.57}
          height={687.41}
          alt="background pattern"
        />

        <div className="z-40 absolute inset-0">
          <Image
            className={cn(
              "z-50 absolute",
              "bottom-0 ltr:-right-0 ltr:rotate-y-180",
              "rtl:-left-0"
            )}
            src="/assets/hero/desktop-center.png"
            width={600}
            height={400}
            alt=""
          />
          <Image
            className={cn(
              "z-50 absolute",
              "bottom-0 ltr:right-80 ltr:rotate-y-180",
              "rtl:left-80"
            )}
            src="/assets/hero/mobile-center.png"
            width={600}
            height={400}
            alt=""
          />
          <Image
            className={cn(
              "z-50 absolute",
              "bottom-0 ltr:right-24 ltr:rotate-y-180",
              "rtl:left-24"
            )}
            src="/assets/hero/woman.png"
            width={600}
            height={400}
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
