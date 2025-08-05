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

const servicesData = [
  {
    id: 1,
    title: "بروفايل احترافي للمركز",
    description:
      "صفحة تعريفية جذابة تعرض هوية الحضانة أو المركز من البرامج والأنشطة. هذه الصفحة تمكن أولياء الأمور من التعرف على الخدمات",
    image: "/assets/screens/center/center-20.jpg",
  },
  {
    id: 2,
    title: "خدماتنا المتميزة",
    description:
      "نقدم مجموعة واسعة من الخدمات التعليمية والترفيهية المصممة خصيصاً لتنمية قدرات الأطفال وإعدادهم للمستقبل بأفضل الطرق التعليمية الحديثة",
    image: "/assets/screens/center/center-20.jpg",
  },
  {
    id: 3,
    title: "فريق العمل المحترف",
    description:
      "يضم فريقنا نخبة من المعلمين والمختصين في التربية والتعليم، المدربين على أحدث الأساليب التعليمية لضمان تقديم أفضل رعاية وتعليم لأطفالكم",
    image: "/assets/screens/center/center-20.jpg",
  },
  {
    id: 4,
    title: "بيئة تعليمية آمنة",
    description:
      "نوفر بيئة تعليمية آمنة ومحفزة للإبداع والتعلم، مع توفير كافة وسائل الأمان والسلامة، ومساحات مصممة خصيصاً لتناسب احتياجات الأطفال في مختلف المراحل العمرية",
    image: "/assets/screens/center/center-20.jpg",
  },
  {
    id: 5,
    title: "بيئة تعليمية آمنة",
    description:
      "نوفر بيئة تعليمية آمنة ومحفزة للإبداع والتعلم، مع توفير كافة وسائل الأمان والسلامة، ومساحات مصممة خصيصاً لتناسب احتياجات الأطفال في مختلف المراحل العمرية",
    image: "/assets/screens/center/center-20.jpg",
  },
];

const Services = ({ services = servicesData }: { services?: Service[] }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isMouseActive, setIsMouseActive] = useState(false);
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hasNavBeenShown, setHasNavBeenShown] = useState(false);

  // Reference for the main scroll container
  const mainRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the main content container
  const { scrollYProgress: contentScrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  });

  // Track scroll for navigation animation
  const { scrollYProgress: navAnimationProgress } = useScroll({
    target: mainRef,
    offset: ["start end", "end start"],
  });

  // Calculate navigation animation values
  const navOpacity = useTransform(navAnimationProgress, (latest) => {
    // Start animation when first section center hits viewport bottom
    // End animation when last section center hits viewport top
    const startPoint = 0.1; // Adjust this value to fine-tune when animation starts
    const endPoint = 0.9; // Adjust this value to fine-tune when animation ends

    if (latest < startPoint) return 0;
    if (latest > endPoint) return 0;

    // Smooth transition instead of instant
    return 1;
  });

  const navX = useTransform(navAnimationProgress, (latest) => {
    const startPoint = 0.1;
    const endPoint = 0.9;

    if (latest < startPoint) return -50; // Start from left (LTR) or right (RTL)
    if (latest > endPoint) return -50;

    // Smooth transition instead of instant
    return 0;
  });

  // Track when navigation should be visible for animation
  const [isNavVisible, setIsNavVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navOpacity.on("change", (latest) => {
      const shouldBeVisible = latest > 0;
      setIsNavVisible(shouldBeVisible);

      // Mark navigation as shown when it first becomes visible
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

      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }

      mouseTimeoutRef.current = setTimeout(() => {
        setIsMouseActive(false);
      }, 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
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

  const handleNavigation = (index: number) => {
    setActiveSection(index);
    document.getElementById(`section-${index}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = services.map((_, index) =>
        document.getElementById(`section-${index}`)
      );
      const currentSection = sections.findIndex((section) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          return (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          );
        }
        return false;
      });

      if (currentSection !== -1) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [services]);

  const navRef = useRef<HTMLDivElement>(null);
  const totalNavHeight = navRef.current?.scrollHeight || 0;
  const navContainerHeight = navRef.current?.clientHeight || 0;
  const scrollableHeight = Math.max(0, totalNavHeight - navContainerHeight);

  // Map the content scroll progress to the nav's scroll
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
    <div className="bg-[#f9f4eb] min-h-screen">
      <div ref={mainRef} className="relative container mx-auto px-4">
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
              className="relative bg-black rounded-full px-1 py-2 h-[400px] overflow-hidden"
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

        {services.map((service, index) => {
          const sectionRef = useRef<HTMLElement>(null);
          const { scrollYProgress } = useScroll({
            target: sectionRef,
            offset: ["start end", "end start"],
          });
          const maxParallax = 40;
          const smoothFactor = 0.6;

          const scrollY = useTransform(
            scrollYProgress,
            [0, 0.5, 1],
            [maxParallax, 0, -maxParallax]
          );

          const imageX = useMotionValue(0);
          const imageY = useMotionValue(0);

          useEffect(() => {
            function updatePosition() {
              const isActive = isMouseActive && activeSectionIndex === index;

              if (isActive) {
                const targetX = (mousePosition.x - 0.5) * 2 * maxParallax;
                const targetY = (mousePosition.y - 0.5) * 2 * maxParallax;
                imageX.set(
                  imageX.get() + (targetX - imageX.get()) * smoothFactor
                );
                imageY.set(
                  imageY.get() + (targetY - imageY.get()) * smoothFactor
                );
              } else {
                imageX.set(imageX.get() * 0.7);
                imageY.set(imageY.get() * 0.7);
              }
              requestAnimationFrame(updatePosition);
            }

            const animationId = requestAnimationFrame(updatePosition);
            return () => cancelAnimationFrame(animationId);
          }, [isMouseActive, mousePosition, activeSectionIndex, index]);

          const finalY = useTransform(() => scrollY.get() + imageY.get());

          return (
            <motion.section
              ref={sectionRef}
              key={index}
              id={`section-${index}`}
              className="group min-h-[700px] ltr:ml-20 rtl:mr-20 flex items-center border-b-2 border-gray-200 last:border-b-0"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:group-even:flex-row-reverse lg:group-odd:flex-row items-center justify-between gap-12 lg:gap-30 max-w-6xl mx-auto">
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
                    className="flex-1 flex justify-center"
                    style={{
                      x: imageX,
                      y: finalY,
                    }}
                  >
                    <div className="rounded-xl overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title || ""}
                        width={331}
                        height={587}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
