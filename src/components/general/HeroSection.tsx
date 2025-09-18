"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../ui/carousel";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

// Define allowed button variants
// These should match the Button component's allowed variants
// (default, outline, link, defaultNoGradient, destructive, secondary, ghost)
type ButtonVariant =
  | "default"
  | "outline"
  | "link"
  | "defaultNoGradient"
  | "destructive"
  | "secondary"
  | "ghost";

interface SlideButton {
  link: string;
  label: string;
  variant: ButtonVariant;
  className?: string;
}

interface SlideImages {
  left: string;
  center: string;
  right: string;
}

interface Slide {
  title: string;
  buttons: SlideButton[];
  images: SlideImages;
}

const HeroSection = () => {
  const locale = useLocale();
  const t = useTranslations("HomePage.HeroSection");
  const [current, setCurrent] = useState(1);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Add this line to easily stop the slideshow for design purposes
  const [isDesignMode, setIsDesignMode] = useState(false);

  const centerImages = {
    left: `/assets/hero/desktop-center-${locale}.png`,
    center: "/assets/hero/woman.png",
    right: `/assets/hero/mobile-center-${locale}.png`,
  };

  const parentImages = {
    left: `/assets/hero/mobile-parent-${locale}.png`,
    center: "/assets/hero/family.png",
    right: `/assets/hero/desktop-parent-${locale}.png`,
  };

  // Detect direction (RTL or LTR)
  const isRTL = locale === "ar";

  // Slides with translation keys only
  const slides: Slide[] = [
    {
      title: "slide1.title",
      buttons: [
        {
          label: "slide1.button1",
          variant: "default",
          link: "/sign-up/center",
        },
        {
          label: "slide1.button2",
          variant: "outline",
          className: "!border-light-gray text-mid-gray",
          link: "/services",
        },
      ],
      images: centerImages,
    },
    {
      title: "slide2.title",
      buttons: [
        {
          label: "slide2.button1",
          variant: "default",
          link: "/nurseries",
        },
        {
          label: "slide2.button2",
          variant: "outline",
          className: "!border-light-gray text-mid-gray",
          link: "/sign-up/parent",
        },
      ],
      images: parentImages,
    },
  ];

  // Special event slide for Saudi National Day
  const eventSlide = {
    title: "event.title",
    subtitle: "event.subtitle",
    offer: "event.offer",
    button: {
      label: "event.button",
      variant: "default" as ButtonVariant,
      link: "/sign-up/center",
    },
  };

  // Embla API callback to update current slide index
  const handleSetApi = (api: CarouselApi) => {
    if (!api) return;
    setCarouselApi(api);
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
  };

  // Sync current with carouselApi when it changes
  useEffect(() => {
    if (carouselApi) {
      setCurrent(carouselApi.selectedScrollSnap());
    }
  }, [carouselApi]);

  const goToSlide = (idx: number) => {
    setCurrent((prev) => (prev !== idx ? idx : prev));
    if (carouselApi) carouselApi.scrollTo(idx);
  };

  const goToNext = () => {
    goToSlide((current + 1) % slides.length);
  };

  // Auto-advance timer and progress ring logic
  useEffect(() => {
    // Skip auto-advance if in design mode
    if (isDesignMode) return;

    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
    let timeout = setTimeout(() => {
      let start = Date.now();
      let lastElapsed = 0;
      timerRef.current = setInterval(() => {
        if (isPaused) {
          start += Date.now() - (start + lastElapsed); // freeze timer
          return;
        }
        const elapsed = Date.now() - start;
        lastElapsed = elapsed;
        const prog = Math.min(elapsed / 6000, 1);
        setProgress(prog);
        if (prog >= 1) {
          setProgress(0);
          clearInterval(timerRef.current!);
          setCurrent((prev) => {
            const next = prev < slides.length * 2 - 1 ? prev + 1 : 0;
            if (prev !== next) {
              if (carouselApi) carouselApi.scrollTo(next);
              return next;
            }
            return prev;
          });
        }
      }, 16);
    }, 500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearTimeout(timeout);
    };
  }, [current, slides.length, isPaused, carouselApi, isDesignMode]);

  return (
    <section
      className="py-0 overflow-hidden relative"
      style={{
        background:
          current % 2 === 1
            ? "transparent"
            : "linear-gradient(to bottom, #FFFFFF 0%, #D5F3E5 22%, #D5F5E6 38%, #C4E7D7 52%, #D5F5E6 66%, #D5F3E5 83%, #FFFFFF 100%)",
      }}
    >
      {/* Design Mode Toggle - Remove this when done designing */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsDesignMode(!isDesignMode)}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            isDesignMode
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isDesignMode ? "🎨 Design Mode ON" : "▶️ Auto Mode"}
        </button>
        {isDesignMode && (
          <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded shadow">
            Slideshow paused for design. Click to resume.
          </div>
        )}
      </div>

      <div className="container mx-auto relative">
        {/* Pattern background image - only show hero pattern on regular slides */}
        {current % 2 === 0 && (
          <Image
            className={cn(
              "z-10 absolute select-none pointer-events-none",
              "ltr:-right-14 ltr:rotate-y-180 -top-24",
              "rtl:-left-14"
            )}
            src="/assets/hero/hero-pattern.svg"
            width={774.57}
            height={687.41}
            alt="background pattern"
          />
        )}

        <Carousel
          className="z-20"
          setApi={handleSetApi}
          opts={{
            direction: isRTL ? "rtl" : "ltr",
            duration: 0,
            dragFree: false,
            watchDrag: false,
          }}
        >
          <CarouselContent>
            {slides.map((slide, idx) => (
              <React.Fragment key={idx}>
                {/* Regular slide */}
                <CarouselItem>
                  <AnimatePresence mode="wait" initial={false}>
                    {current === idx * 2 && (
                      <motion.div
                        key={idx * 2}
                        initial={{ opacity: 0, scale: 0.995 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.995 }}
                        transition={{
                          opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                          scale: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                        }}
                        style={{
                          position: "relative",
                          width: "100%",
                          zIndex: 50,
                        }}
                      >
                        <div className="z-20 relative pt-52 pb-80 2xl:py-24 w-full h-full">
                          {/* Content area */}
                          <motion.div
                            className="z-50 relative flex flex-col gap-y-6 rtl:max-w-[50rem] ltr:max-w-[49rem]"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{
                              duration: 0.5,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                          >
                            <motion.h1
                              className="heading-2 text-primary"
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.1,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                            >
                              {t(slide.title)}
                            </motion.h1>
                            <motion.div
                              className="flex items-center gap-x-2.5"
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.18,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                            >
                              {slide.buttons.map((btn, i) => (
                                <Button
                                  key={btn.label}
                                  asChild
                                  variant={btn.variant}
                                  size="sm"
                                  className={cn(btn.className || "")}
                                >
                                  <Link href={btn.link}>{t(btn.label)}</Link>
                                </Button>
                              ))}
                            </motion.div>
                          </motion.div>

                          {/* Absolutely positioned hero images with staggered animation */}
                          <motion.div className="z-40 absolute inset-0 select-none pointer-events-none">
                            <motion.div
                              className={cn(
                                "z-50 absolute",
                                "bottom-0 ltr:-right-0",
                                "rtl:-left-0"
                              )}
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.96 }}
                              transition={{
                                duration: 0.7,
                                delay: 0.25,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                            >
                              <Image
                                src={slide.images.left}
                                width={600}
                                height={400}
                                alt=""
                                draggable={false}
                                className="select-none pointer-events-none"
                              />
                            </motion.div>
                            <motion.div
                              className={cn(
                                "z-50 absolute hidden md:block",
                                "bottom-0 ltr:right-80",
                                "rtl:left-80"
                              )}
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.96 }}
                              transition={{
                                duration: 0.7,
                                delay: 0.38,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                            >
                              <Image
                                src={slide.images.right}
                                width={600}
                                height={400}
                                alt=""
                                draggable={false}
                                className="select-none pointer-events-none"
                              />
                            </motion.div>
                            <motion.div
                              className={cn(
                                "z-50 absolute",
                                "bottom-0 ltr:right-24",
                                "rtl:left-24"
                              )}
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.96 }}
                              transition={{
                                duration: 0.7,
                                delay: 0.5,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                            >
                              <Image
                                src={slide.images.center}
                                width={600}
                                height={400}
                                alt=""
                                draggable={false}
                                className="ltr:rotate-y-180 select-none pointer-events-none"
                              />
                            </motion.div>
                          </motion.div>
                          {/* Next button with progress ring, centered under content */}
                          {/* <div className="flex justify-start mt-8 mx-2 relative">
                            <motion.button
                              onClick={goToNext}
                              aria-label="Next slide"
                              className="relative bg-white/60 border border-gray-200 shadow-lg rounded-full w-14 h-14 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                              type="button"
                              whileHover={{
                                scale: 1.08,
                                boxShadow: "0 6px 24px 0 rgba(37,99,235,0.10)",
                              }}
                              whileTap={{ scale: 0.97 }}
                              onMouseEnter={() => setIsPaused(true)}
                              onMouseLeave={() => setIsPaused(false)}
                            >
                              <motion.div
                                className="flex items-center justify-center"
                                whileHover={{
                                  rotate: isRTL ? 45 : -45,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 320,
                                  damping: 18,
                                }}
                              >
                                <motion.span
                                  initial={{ color: "#2563eb" }}
                                  whileHover={{ color: "#3b82f6" }}
                                  transition={{ duration: 0.22 }}
                                  className="flex"
                                >
                                  <ArrowRight className="w-7 h-7 transition-colors rtl:rotate-y-180" />
                                </motion.span>
                              </motion.div>
                              {/* Progress ring always shown, animates according to timer */}
                          {/* {progress > 0 && progress < 1 && (
                                <svg
                                  className="absolute pointer-events-none"
                                  width={64}
                                  height={64}
                                  style={{
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)",
                                  }}
                                >
                                  <circle
                                    cx={32}
                                    cy={32}
                                    r={28}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth={2.2}
                                    strokeDasharray={2 * Math.PI * 28}
                                    strokeDashoffset={
                                      2 * Math.PI * 28 * (1 - progress)
                                    }
                                    style={{
                                      transition: "stroke-dashoffset 0.1s linear",
                                    }}
                                  />
                                </svg>
                              )}
                            </motion.button>
                          </div> */}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CarouselItem>

                {/* Event slide */}
                <CarouselItem>
                  <AnimatePresence mode="wait" initial={false}>
                    {current === idx * 2 + 1 && (
                      <motion.div
                        key={idx * 2 + 1}
                        initial={{ opacity: 0, scale: 0.995 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.995 }}
                        transition={{
                          opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                          scale: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                        }}
                        style={{
                          position: "relative",
                          width: "100%",
                          zIndex: 50,
                        }}
                      >
                        <div className="z-20 relative pt-8 pb-8 md:pt-16 md:pb-16 w-full h-full">
                          {/* Event slide content */}
                          <div className="flex flex-row h-full">
                            {/* Left section - Background event pattern */}
                            <div className="w-3/5 flex flex-col justify-center items-center p-2 md:p-6 lg:p-8 min-h-[250px] md:min-h-[400px] lg:min-h-[500px] relative">
                              {/* Background event pattern */}
                              <Image
                                src="/assets/events/backgroud-event.png"
                                alt="Background event pattern"
                                fill
                                className="absolute inset-0 z-0 select-none pointer-events-none"
                              />
                              <div
                                className={cn(
                                  "text-white relative z-10",
                                  isRTL ? "text-right" : "text-left"
                                )}
                              >
                                {/* Title background image */}
                                <Image
                                  src="/assets/events/title-background.png"
                                  alt="Title background"
                                  width={120}
                                  height={60}
                                  className={cn(
                                    "mb-3 md:mb-4 md:w-[200px] md:h-[100px] lg:w-[300px] lg:h-[150px]",
                                    isRTL ? "ml-auto" : "mr-auto"
                                  )}
                                />
                                {/* Main headline */}
                                <h1 className="text-lg md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 md:mb-4 lg:mb-6 leading-tight">
                                  {t(eventSlide.title)}
                                </h1>

                                {/* Offer text */}
                                <div className="mb-4 md:mb-6 lg:mb-8">
                                  <p className="text-sm md:text-xl lg:text-2xl xl:text-3xl font-bold">
                                    <span className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black">
                                      95
                                    </span>{" "}
                                    {t(eventSlide.offer)}
                                  </p>
                                </div>

                                {/* Call-to-action button */}
                                <Button
                                  asChild
                                  variant="secondary"
                                  size="sm"
                                  className="bg-white hover:bg-gray-100 text-xs md:text-sm lg:text-base"
                                  style={{ color: "#00343A" }}
                                >
                                  <Link href={eventSlide.button.link}>
                                    {t(eventSlide.button.label)}
                                  </Link>
                                </Button>
                              </div>
                            </div>

                            {/* Right section - Event logo pattern background */}
                            <div className="w-2/5 flex items-center justify-center p-2 md:p-6 lg:p-8 min-h-[250px] md:min-h-[300px] lg:min-h-[400px] relative">
                              {/* Event logo pattern background */}
                              <Image
                                src="/assets/events/logo-event.png"
                                alt="Event logo pattern"
                                fill
                                className="absolute inset-0 z-0 select-none pointer-events-none"
                              />
                            </div>
                          </div>

                          {/* Next button with progress ring */}
                          {/* <div className="flex justify-start mt-8 mx-2 relative">
                            <motion.button
                              onClick={goToNext}
                              aria-label="Next slide"
                              className="relative bg-white/60 border border-gray-200 shadow-lg rounded-full w-14 h-14 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                              type="button"
                              whileHover={{
                                scale: 1.08,
                                boxShadow: "0 6px 24px 0 rgba(37,99,235,0.10)",
                              }}
                              whileTap={{ scale: 0.97 }}
                              onMouseEnter={() => setIsPaused(true)}
                              onMouseLeave={() => setIsPaused(false)}
                            >
                              <motion.div
                                className="flex items-center justify-center"
                                whileHover={{
                                  rotate: isRTL ? 45 : -45,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 320,
                                  damping: 18,
                                }}
                              >
                                <motion.span
                                  initial={{ color: "#2563eb" }}
                                  whileHover={{ color: "#3b82f6" }}
                                  transition={{ duration: 0.22 }}
                                  className="flex"
                                >
                                  <ArrowRight className="w-7 h-7 transition-colors rtl:rotate-y-180" />
                                </motion.span>
                              </motion.div>
                              {/* Progress ring always shown, animates according to timer */}
                          {/* {progress > 0 && progress < 1 && (
                                <svg
                                  className="absolute pointer-events-none"
                                  width={64}
                                  height={64}
                                  style={{
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)",
                                  }}
                                >
                                  <circle
                                    cx={32}
                                    cy={32}
                                    r={28}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth={2.2}
                                    strokeDasharray={2 * Math.PI * 28}
                                    strokeDashoffset={
                                      2 * Math.PI * 28 * (1 - progress)
                                    }
                                    style={{
                                      transition: "stroke-dashoffset 0.1s linear",
                                    }}
                                  />
                                </svg>
                              )}
                            </motion.button>
                          </div> */}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CarouselItem>
              </React.Fragment>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-8">
        {slides.map((_, idx) => (
          <React.Fragment key={idx}>
            {/* Regular slide dot */}
            <motion.button
              onClick={() => goToSlide(idx * 2)}
              aria-label={`Go to slide ${idx + 1}`}
              type="button"
              className={cn(
                "rounded-full mx-1 transition-colors duration-300 cursor-pointer"
              )}
              style={{
                height: 6,
                width: current === idx * 2 ? 36 : 18,
                transition:
                  "width 0.35s cubic-bezier(0.4,0,0.2,1), background-color 0.35s cubic-bezier(0.4,0,0.2,1)",
              }}
              animate={{
                width: current === idx * 2 ? 36 : 18,
                backgroundColor: current === idx * 2 ? "#2563eb" : "#e5e7eb",
              }}
              whileHover={
                current !== idx * 2 ? { backgroundColor: "#f3f4f6" } : {}
              }
            />
            {/* Event slide dot */}
            <motion.button
              onClick={() => goToSlide(idx * 2 + 1)}
              aria-label={`Go to event slide ${idx + 1}`}
              type="button"
              className={cn(
                "rounded-full mx-1 transition-colors duration-300 cursor-pointer"
              )}
              style={{
                height: 6,
                width: current === idx * 2 + 1 ? 36 : 18,
                transition:
                  "width 0.35s cubic-bezier(0.4,0,0.2,1), background-color 0.35s cubic-bezier(0.4,0,0.2,1)",
              }}
              animate={{
                width: current === idx * 2 + 1 ? 36 : 18,
                backgroundColor:
                  current === idx * 2 + 1 ? "#10b981" : "#e5e7eb",
              }}
              whileHover={
                current !== idx * 2 + 1 ? { backgroundColor: "#f3f4f6" } : {}
              }
            />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
