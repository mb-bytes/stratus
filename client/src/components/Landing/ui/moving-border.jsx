"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "motion/react";
import { cn } from "../../../libs/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 3000,
  className,
  ...otherProps
}) {
  return (
    <Component
      className={cn(
        "relative overflow-hidden bg-transparent p-[1px] text-xl inline-block",
        containerClassName
      )}
      style={{ borderRadius }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 opacity-[0.8] bg-[radial-gradient(#000_40%,transparent_60%)]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex items-center justify-center border border-neutral-300 bg-white text-sm font-semibold text-black antialiased",
          className
        )}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {children}
      </div>
    </Component>
  );
}

export function MovingBorder({ children, duration = 3000, rx, ry, ...otherProps }) {
  const pathRef = useRef(null);
  const containerRef = useRef(null);
  const progress = useMotionValue(0);
  const [isVisible, setIsVisible] = useState(true);

  // Pause animation when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((time) => {
    if (!isVisible) return;
    try {
      const length = pathRef.current?.getTotalLength();
      if (length) {
        const pxPerMillisecond = length / duration;
        progress.set((time * pxPerMillisecond) % length);
      }
    } catch (_) {}
  });

  const x = useTransform(progress, (val) => {
    try { return pathRef.current?.getPointAtLength(val).x ?? 0; } catch (_) { return 0; }
  });
  const y = useTransform(progress, (val) => {
    try { return pathRef.current?.getPointAtLength(val).y ?? 0; } catch (_) { return 0; }
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <span ref={containerRef}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </span>  );
}
