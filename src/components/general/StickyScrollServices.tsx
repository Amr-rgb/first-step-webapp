"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

const services = [
  {
    id: 1,
    title: "بروفايل احترافي للمركز",
    description:
      "صفحة تعريفية جذابة تعرض هوية الحضانة أو المركز. البرامج والأنشطة. هذه الصفحة تمكن أولياء الأمور من التعرف على الخدمات",
    image: "/assets/screens/center/center-20.jpg",
  },
  {
    id: 2,
    title: "المهارات الاجتماعية لطفلك",
    description: "كيف تساعد الحضانة في تنمية المهارات الاجتماعية لطفلك؟",
    image: "/assets/screens/center/center-20.jpg",
  },
  {
    id: 3,
    title: "برامج تعليمية مبتكرة",
    description:
      "نقدم برامج تعليمية متطورة تساعد على تنمية قدرات طفلك الذهنية والإبداعية.",
    image: "/assets/screens/center/center-20.jpg",
  },
  {
    id: 4,
    title: "بيئة آمنة ومحفزة",
    description: "نحرص على توفير بيئة آمنة ونظيفة ومحفزة لنمو طفلك وتطوره.",
    image: "/assets/screens/center/center-20.jpg",
  },
];

const IMAGE_WINDOW_HEIGHT = 400;

// Slide/fade variants for slider effect
const sliderVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 80 : -80,
    position: "absolute" as const,
    width: "100%",
  }),
  animate: {
    opacity: 1,
    x: 0,
    position: "relative" as const,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? 80 : -80,
    position: "absolute" as const,
    width: "100%",
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

// Image transition: fade + scale
const imageVariants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: {
    opacity: 1,
    scale: 0.96,
    transition: { duration: 0.7 },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.5 } },
};

// Content transition: fade + vertical slide, with stagger
const contentContainerVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.13, delayChildren: 0.05 },
  },
};
const contentItemVariants = {
  initial: { opacity: 0, y: 32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 60, damping: 18 },
  },
  exit: { opacity: 0, y: -32, transition: { duration: 0.4 } },
};

interface StickyScrollServicesProps {
  locale?: "ar" | "en";
}

const StickyScrollServices = ({ locale = "ar" }: StickyScrollServicesProps) => {
  const [activeCard, setActiveCard] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  // Track scroll progress within the current slide for parallax
  const [slideScrollProgress, setSlideScrollProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleScrollLogic = () => {
      if (!containerRef.current) return;

      const { top, height: containerHeight } =
        containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableHeight = containerHeight - viewportHeight;
      const clampedScrollY = Math.max(0, Math.min(scrollableHeight, -top));
      const stepScrollHeight = viewportHeight;
      const newActiveCard = Math.min(
        services.length - 1,
        Math.floor((clampedScrollY + stepScrollHeight / 2) / stepScrollHeight)
      );
      if (newActiveCard !== activeCard) {
        setDirection(newActiveCard > activeCard ? 1 : -1);
        setActiveCard(newActiveCard);
      }

      // Calculate scroll progress within the current slide (0 to 1)
      const slideStart = newActiveCard * stepScrollHeight;
      const slideEnd = slideStart + stepScrollHeight;
      const progress = Math.min(
        1,
        Math.max(0, (clampedScrollY - slideStart) / (slideEnd - slideStart))
      );
      setSlideScrollProgress(progress);

      // Magnetic scroll logic
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        // Find the nearest slide
        const slideIndex = Math.round(clampedScrollY / stepScrollHeight);
        const targetY =
          containerRef.current!.offsetTop + slideIndex * stepScrollHeight;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }, 100); // 100ms debounce
    };

    window.addEventListener("scroll", handleScrollLogic, { passive: true });
    handleScrollLogic();

    return () => {
      window.removeEventListener("scroll", handleScrollLogic);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCard]);

  useEffect(() => {
    const newStepProgress = (activeCard + 1) / services.length;
    setStepProgress(newStepProgress);
  }, [activeCard]);

  const currentService = services[activeCard];

  // Reverse direction logic: 'ar' is LTR, 'en' is RTL
  const isRTL = locale === "en";
  const textDir = isRTL ? "rtl" : "ltr";

  return (
    <div className="relative w-full" dir={textDir}>
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${services.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen w-full">
          <div className="flex h-full w-full items-stretch bg-[#F9F7FF]">
            {/* Image Section (Left side) */}
            <div
              className="w-1/2 h-full relative overflow-hidden flex flex-col items-center justify-center p-8 bg-cover bg-center"
              style={{
                backgroundImage: `url('/assets/backgrounds/services-bg.jpg')`,
              }}
            >
              <div className="flex-grow flex items-center justify-center relative w-full h-full p-4">
                {/* Windowed vertical scroll effect */}
                <div
                  className="relative w-[90%] mx-auto border-4 border-blue-200 rounded-2xl overflow-hidden shadow-lg bg-white/60"
                  style={{
                    aspectRatio: "16/9",
                    height: `${IMAGE_WINDOW_HEIGHT}px`,
                  }}
                >
                  <motion.div
                    className="w-full"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: `${services.length * IMAGE_WINDOW_HEIGHT}px`,
                    }}
                    animate={{ y: -activeCard * IMAGE_WINDOW_HEIGHT }}
                    transition={{ type: "spring", stiffness: 80, damping: 22 }}
                  >
                    {services.map((service, idx) => (
                      <div
                        key={service.id}
                        className="w-full flex items-center justify-center"
                        style={{ height: `${IMAGE_WINDOW_HEIGHT}px` }}
                      >
                        <img
                          src={service.image}
                          alt={service.title}
                          className="object-cover w-full h-full"
                          draggable={false}
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Vertical Progress Loader */}
            <div className="relative w-[3px] h-full bg-gray-200 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full bg-blue-500"
                animate={{ height: `${stepProgress * 100}%` }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Progress Indicator Dot */}
                <motion.div
                  className="absolute left-1/2 w-3 h-3 rounded-full bg-white border-2 border-blue-500 transform -translate-x-1/2 -translate-y-1/2"
                  animate={{ top: `${stepProgress * 100}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    mass: 0.8,
                    delay: 0.08,
                  }}
                />
              </motion.div>

              {/* Slide Indicators */}
              <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
                {services.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full mx-auto my-2`}
                    initial={{
                      scale: 0.5,
                      opacity: 0.7,
                      backgroundColor: "#e5e7eb",
                    }}
                    animate={{
                      scale:
                        index === activeCard
                          ? 1.7
                          : index < activeCard
                          ? 1
                          : 0.7,
                      opacity: index === activeCard ? 1 : 0.7,
                      backgroundColor:
                        index <= activeCard ? "#3b82f6" : "#e5e7eb",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Content Section (Right side) */}
            <div className="w-[calc(50%-1px)] h-full bg-white relative flex flex-col p-16">
              <div
                className={`${
                  isRTL ? "text-left" : "text-right"
                } flex-grow flex items-center justify-center`}
                dir={isRTL ? "ltr" : "rtl"}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentService.id}
                    variants={contentContainerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <motion.h2
                      className="text-4xl font-bold text-slate-800 mb-6 leading-tight"
                      variants={contentItemVariants}
                    >
                      {currentService.title}
                    </motion.h2>
                    <motion.p
                      className="text-lg text-gray-600 leading-relaxed"
                      variants={contentItemVariants}
                    >
                      {currentService.description}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Logo and Slide Indicator */}
              <div
                className={cn(
                  "absolute bottom-8 -right-4.5 flex items-center space-x-4",
                  isRTL ? "" : "rtl:right-auto rtl:-left-8"
                )}
                dir={isRTL ? "ltr" : "rtl"}
              >
                <div className="text-gray-500 font-semibold text-xl flex-shrink-0">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={activeCard + 1}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="inline-block"
                    >
                      {activeCard + 1}
                    </motion.span>
                  </AnimatePresence>
                  <span className="mx-1">/</span>
                  <motion.span
                    key={"total-" + services.length}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                    className="inline-block"
                  >
                    {services.length}
                  </motion.span>
                </div>
                <div className="w-12 h-auto flex-shrink-0">
                  <img
                    src="/assets/logos/logo.svg"
                    alt="Company Logo"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyScrollServices;
