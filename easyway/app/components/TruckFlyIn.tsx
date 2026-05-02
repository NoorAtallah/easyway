"use client";

import * as React from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export default function TruckFlyIn() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const truckControls = useAnimation();
  const textControls  = useAnimation();
  const statsControls = useAnimation();
  const dustControls  = useAnimation();

  React.useEffect(() => {
    if (!isInView) return;

    async function runSequence() {
      await truckControls.start({
        x: 0,
        transition: { duration: 1.6, ease: [0.25, 1, 0.5, 1] },
      });
      await truckControls.start({
        x: [0, 8, 0],
        transition: { duration: 0.35, ease: "easeInOut" },
      });
    }

    runSequence();

    dustControls.start({
      opacity: [0, 0.9, 0],
      transition: { duration: 0.9, delay: 1.2, ease: "easeOut" },
    });

    textControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.8, ease: "easeOut" },
    });

    statsControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 1.4, ease: "easeOut" },
    });
  }, [isInView]);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-20 md:py-0"
      style={{ background: "var(--ew-bg)" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, rgba(27,110,180,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Road line */}
      <div
        className="hidden md:block absolute bottom-[28%] left-0 right-0 h-[2px]"
        style={{
          background: "linear-gradient(to right, transparent, rgba(51,63,54,0.12) 20%, rgba(51,63,54,0.12) 80%, transparent)",
        }}
      />

      {/* Dashed line */}
      <div
        className="hidden md:block absolute left-0 right-0 h-[2px] bottom-[calc(28%+12px)]"
        style={{
          background: "repeating-linear-gradient(to right, rgba(75,118,22,0.2) 0px, rgba(75,118,22,0.2) 40px, transparent 40px, transparent 80px)",
        }}
      />

      {/* Heading */}
      <motion.div
        animate={textControls}
        initial={{ opacity: 0, y: 24 }}
        className="relative z-20 text-center px-4"
      >
        <p
          className="font-['DM_Sans',sans-serif] text-[0.72rem] font-medium tracking-[0.25em] uppercase mb-3 md:mb-4"
          style={{ color: "var(--ew-leaf)" }}
        >
          Moving Services
        </p>
        <h2
          className="font-['Playfair_Display',serif] text-[clamp(2rem,7vw,5.5rem)] font-black leading-[1.05] tracking-[-0.03em] max-w-[700px]"
          style={{ color: "var(--ew-forest)" }}
        >
          Your life, moved
          <br />
          <em className="italic" style={{ color: "var(--ew-sky)" }}>
            with care
          </em>
        </h2>
        <p
          className="font-['DM_Sans',sans-serif] text-sm md:text-base font-light leading-[1.75] max-w-[340px] md:max-w-[420px] mx-auto mt-4 md:mt-5"
          style={{ color: "rgba(51,63,54,0.55)" }}
        >
          From a single room to an entire home — we handle every piece,
          every mile, every detail.
        </p>
      </motion.div>

      {/* Truck */}
      <div className="absolute bottom-0 left-0 w-full flex items-end z-10 pointer-events-none">
        <motion.div
          animate={truckControls}
          initial={{ x: "-110vw" }}
          className="flex items-end relative"
        >
          <img
            src="/6.png"
            alt="Moving truck"
            className="w-[clamp(140px,40vw,400px)] h-auto object-contain"
            style={{ filter: "drop-shadow(0 12px 32px rgba(51,63,54,0.15))" }}
          />

          {/* Dust puff */}
          <motion.div
            animate={dustControls}
            initial={{ opacity: 0 }}
            className="absolute -left-[30px] bottom-2 w-[100px] h-6 rounded-[50%]"
            style={{
              background: "linear-gradient(to left, rgba(75,118,22,0.18), transparent)",
              filter: "blur(8px)",
            }}
          />
        </motion.div>
      </div>

      {/* Stats pill */}
      <motion.div
        animate={statsControls}
        initial={{ opacity: 0, y: 16 }}
        className="absolute bottom-4 md:bottom-[8%] left-1/2 -translate-x-1/2 z-[15] w-[90vw] md:w-auto"
      >
        <div
          className="flex items-center justify-center gap-4 md:gap-8 rounded-[60px] px-5 md:px-9 py-3 md:py-[14px]"
          style={{
            background: "rgba(51,63,54,0.05)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(51,63,54,0.12)",
          }}
        >
          {[
            { num: "500+", label: "Moves completed" },
            { num: "48 states", label: "Coverage" },
            { num: "4.9★", label: "Customer rating" },
          ].map((stat, i) => (
            <React.Fragment key={i}>
              <div className="text-center">
                <div
                  className="font-['Playfair_Display',serif] text-[0.95rem] md:text-[1.15rem] font-bold"
                  style={{ color: "var(--ew-forest)" }}
                >
                  {stat.num}
                </div>
                <div
                  className="font-['DM_Sans',sans-serif] text-[0.6rem] md:text-[0.68rem] tracking-[0.08em] uppercase"
                  style={{ color: "rgba(51,63,54,0.45)" }}
                >
                  {stat.label}
                </div>
              </div>
              {i < 2 && (
                <div
                  className="w-px h-[24px] md:h-[30px]"
                  style={{ background: "rgba(51,63,54,0.15)" }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
}