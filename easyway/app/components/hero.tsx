"use client";

import { ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: 0,
    tag: "Moving Services",
    title: "Move Smarter,",
    titleItalic: "Live Better",
    desc: "Room-by-room planning, instant quotes, and a crew that cares.",
    cta: "Plan Your Move",
    href: "/moving",
    img: "/1.jpeg",
    position: "tl",
  },
  {
    id: 1,
    tag: "Landscaping",
    title: "Your Yard,",
    titleItalic: "Reimagined",
    desc: "From lawn care to full garden design — lasting beauty outdoors.",
    cta: "Get a Free Quote",
    href: "/landscaping",
    img: "/2.jpeg",
    position: "tr",
  },
  {
    id: 2,
    tag: "Cleaning Services",
    title: "Spotless Homes,",
    titleItalic: "Every Time",
    desc: "Deep cleans and recurring schedules tailored to how you live.",
    cta: "Book a Clean",
    href: "/cleaning",
    img: "/3.jpeg",
    position: "bl",
  },
  {
    id: 3,
    tag: "Pool Maintenance",
    title: "Crystal Clear,",
    titleItalic: "All Season",
    desc: "Weekly care and balancing that keeps your pool flawless year-round.",
    cta: "Start a Plan",
    href: "/pool",
    img: "/4.jpeg",
    position: "br",
  },
];

const contentPos: Record<string, string> = {
  tl: "top-4 left-4 sm:top-6 sm:left-6 lg:top-9 lg:left-9",
  tr: "top-4 right-4 sm:top-6 sm:right-6 lg:top-9 lg:right-9 text-right items-end",
  bl: "bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-9 lg:left-9",
  br: "bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-9 lg:right-9 text-right items-end",
};

const overlayDir: Record<string, string> = {
  tl: "bg-[linear-gradient(135deg,rgba(51,63,54,0.78)_0%,rgba(51,63,54,0.08)_100%)]",
  tr: "bg-[linear-gradient(225deg,rgba(51,63,54,0.78)_0%,rgba(51,63,54,0.08)_100%)]",
  bl: "bg-[linear-gradient(45deg,rgba(51,63,54,0.78)_0%,rgba(51,63,54,0.08)_100%)]",
  br: "bg-[linear-gradient(315deg,rgba(51,63,54,0.78)_0%,rgba(51,63,54,0.08)_100%)]",
};

const transformOriginClass: Record<string, string> = {
  tl: "origin-bottom-right",
  tr: "origin-bottom-left",
  bl: "origin-top-right",
  br: "origin-top-left",
};

export default function HeroGrid() {
  return (
    <section
      className="
        relative w-full
        grid grid-cols-1 grid-rows-4
        sm:grid-cols-2 sm:grid-rows-2
        gap-[2px] sm:gap-[3px]
        h-auto sm:h-[calc(100svh-70px)]
        overflow-hidden
        font-['DM_Sans',sans-serif]
        mt-17
      "
      style={{ background: "var(--ew-bg)" }}
    >
      {SLIDES.map((slide) => (
        <a
          key={slide.id}
          href={slide.href}
          className={`
            group relative overflow-hidden cursor-pointer no-underline z-[1]
            block
            h-[40svh] sm:h-auto
            transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
            sm:hover:scale-[1.04] hover:z-10
            ${transformOriginClass[slide.position]}
          `}
        >
          {/* Background image */}
          <div
            className="
              absolute inset-0 bg-cover bg-center
              transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
              group-hover:scale-[1.06]
            "
            style={{ backgroundImage: `url('${slide.img}')` }}
          />

          {/* Overlay */}
          <div className={`absolute inset-0 ${overlayDir[slide.position]}`} />

          {/* Content */}
          <div
            className={`
              absolute flex flex-col gap-1 sm:gap-1.5 lg:gap-2
              max-w-[200px] sm:max-w-[240px] lg:max-w-[300px]
              ${contentPos[slide.position]}
            `}
          >
            {/* Number */}
            <span
              className="font-['Playfair_Display',Georgia,serif] text-[0.55rem] sm:text-[0.6rem] tracking-[0.1em] mb-0.5"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {String(slide.id + 1).padStart(2, "0")}
            </span>

            {/* Tag */}
            <span
              className="text-[0.55rem] sm:text-[0.6rem] lg:text-[0.63rem] tracking-[0.18em] uppercase font-medium"
              style={{ color: "rgba(143,196,82,0.95)" }}
            >
              {slide.tag}
            </span>

            {/* Title */}
            <h2
              className="
                font-['Playfair_Display',Georgia,serif]
                text-[clamp(0.85rem,2.5vw,1.75rem)]
                font-extrabold leading-[1.2] tracking-[-0.02em] m-0
              "
              style={{ color: "#ffffff" }}
            >
              {slide.title}
              <br />
              <em className="not-italic italic" style={{ color: "var(--ew-sky)" }}>
                {slide.titleItalic}
              </em>
            </h2>

            {/* Description */}
            <p
              className="
                text-[0.72rem] sm:text-[0.78rem] lg:text-[0.82rem]
                leading-relaxed m-0
                max-h-0 overflow-hidden opacity-0
                transition-[max-height,opacity] duration-[600ms,550ms] ease-in-out delay-[0ms,80ms]
                group-hover:max-h-[80px] group-hover:opacity-100
                sm:max-h-0 sm:opacity-0
                sm:group-hover:max-h-[80px] sm:group-hover:opacity-100
              "
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {slide.desc}
            </p>

            {/* CTA */}
            <span
              className="
                inline-flex items-center gap-1.5 mt-1
                px-[10px] py-[6px] sm:px-[14px] sm:py-[8px] lg:px-[18px] lg:py-[10px]
                rounded-[3px]
                text-[0.58rem] sm:text-[0.65rem] lg:text-[0.68rem]
                font-medium tracking-[0.12em] uppercase
                bg-transparent w-fit
                opacity-0 translate-y-2
                transition-[opacity,transform] duration-500 ease-in-out delay-150
                group-hover:opacity-100 group-hover:translate-y-0
              "
              style={{
                border: "1px solid rgba(27,110,180,0.65)",
                color: "#ffffff",
              }}
            >
              {slide.cta}
              <ArrowRight size={10} className="sm:w-3 sm:h-3" />
            </span>
          </div>
        </a>
      ))}

      {/* Divider lines — desktop only */}
      <div
        className="hidden sm:block absolute top-1/2 left-0 right-0 h-[2px] sm:h-[3px] -translate-y-1/2 pointer-events-none z-20"
        style={{ background: "rgba(255,255,255,0.1)" }}
      />
      <div
        className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-[2px] sm:w-[3px] -translate-x-1/2 pointer-events-none z-20"
        style={{ background: "rgba(255,255,255,0.1)" }}
      />
    </section>
  );
}