"use client";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
} from "framer-motion";
import { useRef, useEffect } from "react";

interface Value {
  title: string;
  description: string;
}

interface ValueConstant {
  iconSrc: string;
  bg: string;
  color: string;
}

interface ValuesGridClientProps {
  values: Value[];
  valuesConstants: ValueConstant[];
}

const ValuesGridClient = ({
  values,
  valuesConstants,
}: ValuesGridClientProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Helper to get the center between the four cards
  function getCardsCenter() {
    const centers = cardRefs
      .map((ref) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return null;
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      })
      .filter(Boolean) as { x: number; y: number }[];
    if (centers.length === 0) return { x: 0, y: 0 };
    // Average the centers
    const avgX = centers.reduce((sum, c) => sum + c.x, 0) / centers.length;
    const avgY = centers.reduce((sum, c) => sum + c.y, 0) / centers.length;
    // Convert to grid-relative coordinates
    const gridRect = gridRef.current?.getBoundingClientRect();
    if (!gridRect) return { x: 0, y: 0 };
    return {
      x: avgX - gridRect.left,
      y: avgY - gridRect.top,
    };
  }

  useEffect(() => {
    // Center the circle in the center of the four cards by default
    function setCenter(smooth = false) {
      const { x, y } = getCardsCenter();
      if (smooth) {
        animate(mouseX, x, { type: "spring", duration: 0.5 });
        animate(mouseY, y, { type: "spring", duration: 0.5 });
      } else {
        mouseX.set(x);
        mouseY.set(y);
      }
    }
    // Wait for layout
    let animationFrame = requestAnimationFrame(() => setCenter());
    // Use ResizeObserver for robust layout changes
    let resizeObserver: ResizeObserver | null = null;
    if (gridRef.current) {
      resizeObserver = new ResizeObserver(() => setCenter(false));
      resizeObserver.observe(gridRef.current);
      cardRefs.forEach(
        (ref) => ref.current && resizeObserver!.observe(ref.current)
      );
    }
    window.addEventListener("resize", () => setCenter(false));
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", () => setCenter(false));
      if (resizeObserver) resizeObserver.disconnect();
    };
    // eslint-disable-next-line
  }, [mouseX, mouseY]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    animate(mouseX, e.clientX - rect.left, { type: "spring", duration: 0.3 });
    animate(mouseY, e.clientY - rect.top, { type: "spring", duration: 0.3 });
  }

  function handleMouseEnter() {}
  function handleMouseLeave() {
    // Re-center to the center of the four cards, smoothly
    const { x, y } = getCardsCenter();
    animate(mouseX, x, { type: "spring", duration: 0.5 });
    animate(mouseY, y, { type: "spring", duration: 0.5 });
  }

  return (
    <div
      ref={gridRef}
      className="relative grid gap-y-2 sm:gap-y-0 sm:grid-cols-2 sm:w-fit sm:mx-auto"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ minHeight: 400 }}
    >
      {/* The animated circle */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-5xl z-30"
        animate={{ opacity: 1 }}
        transition={{ opacity: { duration: 0.4 } }}
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.18),
              transparent 80%
            )
          `,
        }}
      />
      {values.map((item, index) => (
        <div
          key={index}
          ref={cardRefs[index]}
          className={`w-full sm:max-w-[400px] gap-y-6 py-6 px-8 md:px-14 flex flex-col items-center ${
            index === 0 ? "rounded-tl-5xl rounded-br-5xl" : ""
          }
          ${index === 1 || index === 2 ? "rounded-tr-5xl rounded-bl-5xl" : ""}
          ${index === 3 ? "rounded-tl-5xl rounded-br-5xl" : ""}`}
          style={{
            background: valuesConstants[index].bg,
            color: valuesConstants[index].color,
          }}
        >
          <Image
            src={valuesConstants[index].iconSrc}
            width={120}
            height={120}
            alt={item.title}
          />
          <p className="font-bold">{item.title}</p>
          <p className="sm:max-w-72">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ValuesGridClient;
