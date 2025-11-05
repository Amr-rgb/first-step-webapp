"use client";
import { Service } from "@/types";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValue,
  useScroll,
} from "framer-motion";
import Image from "next/image";

// ServiceSection component to avoid Rules of Hooks violations
interface ServiceSectionProps {
  service: Service;
  index: number;
  isMouseActive: boolean;
  mousePosition: { x: number; y: number };
  activeSectionIndex: number | null;
}

const ServiceSection = ({
  service,
  index,
  isMouseActive,
  mousePosition,
  activeSectionIndex,
}: ServiceSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const maxParallax = 20; // Reduced for more subtle movement
  const maxRotate = 8; // Reduced for more professional subtle rotation
  const smoothFactor = 0.4; // Reduced for smoother, more controlled movement

  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  // Check if device is mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Skip animation effects on mobile
    if (isMobile) return;

    function updatePosition() {
      const isActive = isMouseActive && activeSectionIndex === index;

      if (isActive) {
        const targetX = (mousePosition.x - 0.5) * 2 * maxParallax;
        const targetY = (mousePosition.y - 0.5) * 2 * maxParallax;
        const targetRotateX = (mousePosition.y - 0.5) * 2 * maxRotate;
        const targetRotateY = (mousePosition.x - 0.5) * 2 * maxRotate;
        const targetScale = 1 + Math.abs(mousePosition.x - 0.5) * 0.02; // Subtle scale effect

        imageX.set(imageX.get() + (targetX - imageX.get()) * smoothFactor);
        imageY.set(imageY.get() + (targetY - imageY.get()) * smoothFactor);
        rotateX.set(
          rotateX.get() + (targetRotateX - rotateX.get()) * smoothFactor
        );
        rotateY.set(
          rotateY.get() + (targetRotateY - rotateY.get()) * smoothFactor
        );
        scale.set(scale.get() + (targetScale - scale.get()) * smoothFactor);
      } else {
        imageX.set(imageX.get() * 0.85);
        imageY.set(imageY.get() * 0.85);
        rotateX.set(rotateX.get() * 0.85);
        rotateY.set(rotateY.get() * 0.85);
        scale.set(scale.get() + (1 - scale.get()) * 0.1);
      }
      requestAnimationFrame(updatePosition);
    }

    const animationId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationId);
  }, [
    isMouseActive,
    mousePosition,
    activeSectionIndex,
    index,
    imageX,
    imageY,
    rotateX,
    rotateY,
    scale,
    maxParallax,
    maxRotate,
    smoothFactor,
    isMobile,
  ]);

  return (
    <motion.section
      ref={sectionRef}
      id={`section-${index}`}
      className="group min-h-[500px] ltr:md:ml-20 rtl:md:mr-20 flex items-center border-b-2 border-gray-200 last:border-b-0"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:group-even:flex-row-reverse lg:group-odd:flex-row items-center justify-between gap-8 lg:gap-16 max-w-6xl mx-auto">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <motion.h2
              className="heading-4 font-bold text-gray-800 mb-6 leading-tight"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {service.title}
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {service.description}
            </motion.p>
          </motion.div>
          <motion.div
            className="flex-1 flex justify-center origin-center"
            style={
              isMobile
                ? {}
                : {
                    x: imageX,
                    y: imageY,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    scale: scale,
                    perspective: "800px",
                    transformStyle: "preserve-3d",
                  }
            }
            whileHover={
              isMobile
                ? {}
                : {
                    transition: { duration: 0.3, ease: "easeOut" },
                  }
            }
          >
            <div className="rounded-xl overflow-hidden">
              <Image
                src={service.image}
                alt={service.title || ""}
                width={600}
                height={440}
                className="transition-all duration-300"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

const Services = ({ services }: { services: Service[] }) => {
  // Safety check for services array
  if (!services || services.length === 0) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">No services available</p>
      </div>
    );
  }

  const [activeSection, setActiveSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isMouseActive, setIsMouseActive] = useState(false);
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hasNavBeenShown, setHasNavBeenShown] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: contentScrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: navAnimationProgress } = useScroll({
    target: mainRef,
    offset: ["start end", "end start"],
  });

  const navOpacity = useTransform(navAnimationProgress, (latest) => {
    const startPoint = 0.1;
    const endPoint = 0.9;
    if (latest < startPoint) return 0;
    if (latest > endPoint) return 0;
    return 1;
  });

  const [isNavVisible, setIsNavVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navOpacity.on("change", (latest) => {
      const shouldBeVisible = latest > 0;
      setIsNavVisible(shouldBeVisible);
      if (shouldBeVisible && !hasNavBeenShown) {
        setHasNavBeenShown(true);
      }
    });
    return unsubscribe;
  }, [navOpacity, hasNavBeenShown]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
      setIsMouseActive(true);
      if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
      mouseTimeoutRef.current = setTimeout(() => setIsMouseActive(false), 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
    };
  }, []);

  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const sections = Array.from(
        document.querySelectorAll('section[id^="section-"]')
      );
      let activeIndex = null;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionMiddle = rect.top + rect.height / 2;
        if (sectionMiddle > 0 && sectionMiddle < viewportHeight) {
          activeIndex = index;
        }
      });
      setActiveSectionIndex(activeIndex);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (activeSectionIndex !== null && activeSectionIndex !== activeSection) {
      setActiveSection(activeSectionIndex);
    }
  }, [activeSectionIndex]);

  const handleNavigation = (index: number) => {
    setActiveSection(index);
    document
      .getElementById(`section-${index}`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const navRef = useRef<HTMLDivElement>(null);
  const totalNavHeight = navRef.current?.scrollHeight || 0;
  const navContainerHeight = navRef.current?.clientHeight || 0;
  const scrollableHeight = Math.max(0, totalNavHeight - navContainerHeight);

  const navScrollY = useTransform(
    contentScrollYProgress,
    [0, 1],
    [0, -scrollableHeight]
  );
  const lineProgress = useTransform(contentScrollYProgress, (latest) => {
    const totalLines = services.length === 0 ? 1 : (services.length - 1) * 6;
    return latest * totalLines;
  });

  return (
    <div className="bg-white min-h-screen">
      <div ref={mainRef} className="relative container mx-auto px-4">
        {/* Desktop Navigation */}
        <AnimatePresence>
          <motion.div
            className="fixed rtl:right-8 ltr:left-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{
              opacity: isNavVisible ? 1 : 0,
              x: isNavVisible ? 0 : -50,
            }}
            transition={{
              opacity: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              x: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            }}
          >
            <div
              ref={navRef}
              className="relative bg-black rounded-full px-1 py-2 max-h-[400px] overflow-hidden"
            >
              <motion.div
                className="flex flex-col items-center space-y-1"
                style={{
                  y: navScrollY,
                }}
              >
                {services.map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <motion.div
                      className={`relative w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        activeSection === index ? "text-white" : "text-gray-500"
                      }`}
                      onClick={() => handleNavigation(index)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.span
                        className="text-xs font-bold relative z-10"
                        animate={{
                          color:
                            activeSection === index ? "#ffffff" : "#6b7280",
                          scale: activeSection === index ? 1.08 : 1,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </motion.span>
                      <AnimatePresence>
                        {activeSection === index && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                              boxShadow:
                                "0 0 16px 4px rgba(99,102,241,0.25), 0 0 0 2px #6366f1",
                              background: "rgba(99,102,241,0.10)",
                            }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                    {index < services.length - 1 && (
                      <div className="flex flex-col items-center my-1.5">
                        {[...Array(6)].map((_, lineIndex) => {
                          const currentLineIndex = index * 6 + lineIndex;
                          const width = useTransform(lineProgress, (latest) => {
                            const distance = Math.abs(
                              latest - currentLineIndex
                            );
                            const minWidth = 10;
                            const maxWidth = 25;
                            return `${Math.round(
                              maxWidth -
                                Math.min(distance, 1) * (maxWidth - minWidth)
                            )}px`;
                          });
                          const opacity = useTransform(
                            lineProgress,
                            (latest) => {
                              const distance = Math.abs(
                                latest - currentLineIndex
                              );
                              return 1 - Math.min(distance * 0.15, 0.7);
                            }
                          );
                          const background = useTransform(
                            lineProgress,
                            (latest) => {
                              const distance = Math.abs(
                                latest - currentLineIndex
                              );
                              return distance < 0.5 ? "#9ca3af" : "#d1d5db";
                            }
                          );

                          return (
                            <motion.div
                              key={lineIndex}
                              className="h-0.5 rounded-full not-last:mb-2"
                              style={{
                                width,
                                opacity,
                                background,
                              }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          <motion.div
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 md:hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: isNavVisible ? 1 : 0,
              y: isNavVisible ? 0 : 50,
            }}
            transition={{
              opacity: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              y: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            }}
          >
            <div className="relative bg-black rounded-full px-3 py-2">
              <div className="flex items-center space-x-2">
                {services.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`relative w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      activeSection === index ? "text-white" : "text-gray-500"
                    }`}
                    onClick={() => handleNavigation(index)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span
                      className="text-xs font-bold relative z-10"
                      animate={{
                        color: activeSection === index ? "#ffffff" : "#6b7280",
                        scale: activeSection === index ? 1.08 : 1,
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </motion.span>
                    <AnimatePresence>
                      {activeSection === index && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            boxShadow:
                              "0 0 16px 4px rgba(99,102,241,0.25), 0 0 0 2px #6366f1",
                            background: "rgba(99,102,241,0.10)",
                          }}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {services.map((service, index) => (
          <ServiceSection
            key={`${service.id}-${index}`}
            service={service}
            index={index}
            isMouseActive={isMouseActive}
            mousePosition={mousePosition}
            activeSectionIndex={activeSectionIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;
