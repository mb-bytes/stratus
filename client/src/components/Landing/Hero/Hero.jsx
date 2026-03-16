"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, useSpring, motion } from "motion/react";
import { Button as MovingButton } from "../ui/moving-border";

export const ContainerScroll = ({
  titleComponent,
  children
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.4], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.4], [0, -80]);

  const smoothRotate = useSpring(rotate, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const smoothScale = useSpring(scale, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const smoothTranslate = useSpring(translate, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div
      id="home"
      className="relative flex h-[40rem] items-start justify-center px-4 pt-16 sm:h-[46rem] sm:pt-18 md:h-[64rem] md:px-10 md:pt-20 lg:h-[78rem] lg:px-20"
      ref={containerRef}>
      <div
        className="relative w-full py-2 md:py-16"
        style={{
          perspective: "1000px",
        }}>
        <Header translate={smoothTranslate} titleComponent={titleComponent} />
        <Card rotate={smoothRotate} translate={smoothTranslate} scale={smoothScale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center">
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="mx-auto -mt-8 w-full max-w-[92vw] rounded-[26px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl sm:max-w-[88vw] md:-mt-10 md:max-w-[82vw] md:rounded-[30px] md:p-4 lg:max-w-5xl lg:p-6">
      <div className="aspect-[1919/911] h-full w-full overflow-hidden rounded-[20px] bg-zinc-950 md:rounded-2xl">
        {children}
      </div>
    </motion.div>
  );
};

export const HeroSection = () => {
  return (
    <ContainerScroll
      titleComponent={
        <div className="flex flex-col items-center">
          <h2 className="text-3xl md:text-6xl font-medium text-black-700 mb-2 md:mb-2 tracking-tight">
            Take control of your
          </h2>
          <h1 className="text-5xl sm:text-6xl md:text-[6.2rem] lg:text-[10.5rem] font-medium text-black mb-3 md:mb-3 tracking-tighter leading-[0.9] md:leading-[0.85] px-2 md:px-0">
            Job Applications
          </h1>
          <p className="mt-10 text-base md:text-lg text-neutral-500 max-w-xl leading-relaxed">
            Track every application, interview, and offer in one place —
            so nothing slips through the cracks.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <MovingButton
              as="a"
              href="/signup"
              borderRadius="9999px"
              duration={2500}
              className="px-8 py-3.5 text-sm font-semibold bg-black text-white border-neutral-700"
              borderClassName="h-20 w-20 opacity-90 bg-[radial-gradient(#ffffff_40%,transparent_60%)]"
            >
              Get started free →
            </MovingButton>
            <span className="text-xs text-neutral-400">No credit card required</span>
          </div>
        </div>
      }
    >
      <img
        src="/assets/dashboard.png"
        alt="Stratus dashboard preview showing job application tracking"
        className="h-full w-full rounded-lg object-cover object-top"
      />
    </ContainerScroll>
  );
};
