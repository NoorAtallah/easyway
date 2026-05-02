"use client";

import { Truck, Leaf, Sparkles, Waves, ArrowRight } from "lucide-react";
import Link from "next/link";

const SERVICES = [
  {
    num: "01",
    icon: <Truck size={18} />,
    name: "Moving Services",
    desc: "Pick your items room by room and get an instant quote based on ZIP code distance and volume.",
    href: "/moving",
    img: "./1.png",
  },
  {
    num: "02",
    icon: <Leaf size={18} />,
    name: "Landscaping",
    desc: "Transform your outdoor spaces with expert planting, design, and ongoing yard maintenance.",
    href: "/landscaping",
    img: "./2.png",
  },
  {
    num: "03",
    icon: <Sparkles size={18} />,
    name: "Cleaning Services",
    desc: "Deep cleans, recurring plans, and move-in/out packages tailored to your lifestyle.",
    href: "/cleaning",
    img: "./3.png",
  },
  {
    num: "04",
    icon: <Waves size={18} />,
    name: "Pool Maintenance",
    desc: "Year-round pool care subscriptions keeping your water safe, clean, and crystal clear.",
    href: "/pool",
    img: "./4.png",
  },
];

function ServiceCard({ service }: { service: (typeof SERVICES)[0] }) {
  return (
    <Link
      href={service.href}
      className="group relative overflow-hidden cursor-pointer block no-underline shrink-0
        w-[72vw] sm:w-auto
        h-[340px] lg:h-[460px]"
      style={{ borderBottom: "3px solid var(--ew-sky)" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
        style={{ backgroundImage: `url('${service.img}')` }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 transition-[background] duration-500 group-hover:bg-black/65" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-5 lg:p-[34px_30px]">

        {/* Number */}
        <span className="absolute top-3 right-3 font-['Playfair_Display',serif] text-[3rem] lg:text-[4.5rem] font-black leading-none text-white/[0.07]">
          {service.num}
        </span>

        {/* Icon */}
        <div
          className="w-9 h-9 lg:w-[46px] lg:h-[46px] flex items-center justify-center mb-3 lg:mb-[18px] bg-white/[0.08] rounded-[4px] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
          style={{
            color: "var(--ew-sky)",
            border: "1.5px solid rgba(27,110,180,0.35)",
          }}
        >
          {service.icon}
        </div>

        <h3 className="font-['Playfair_Display',serif] text-[1.15rem] lg:text-[1.55rem] font-bold text-white leading-[1.2] mb-2">
          {service.name}
        </h3>

        {/* Description — always visible on mobile, hover-only on desktop */}
        <p
          className="
            font-['DM_Sans',sans-serif] text-[0.75rem] lg:text-[0.8rem]
            text-white/70 leading-[1.65] font-light m-0
            lg:max-h-0 lg:overflow-hidden lg:opacity-0
            lg:transition-[max-height,opacity] lg:duration-[500ms,400ms] lg:ease-in-out
            lg:group-hover:max-h-[80px] lg:group-hover:opacity-100
          "
        >
          {service.desc}
        </p>

        {/* CTA — always visible on mobile, hover-only on desktop */}
        <div
          className="
            flex items-center gap-2 mt-3
            font-['DM_Sans',sans-serif] text-[0.63rem] tracking-[0.15em] uppercase
            lg:opacity-0 lg:-translate-x-2
            lg:transition-[transform,opacity] lg:duration-300
            lg:group-hover:opacity-100 lg:group-hover:translate-x-0
          "
          style={{ color: "var(--ew-sky)" }}
        >
          Explore <ArrowRight size={11} />
        </div>
      </div>
    </Link>
  );
}

export default function ServicesGrid() {
  return (
    <section
      className="py-14 sm:py-20 lg:py-[110px]"
      style={{ background: "var(--ew-bg)" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-8 lg:px-[52px]">
        <h2
          className="font-['Playfair_Display',serif] text-[clamp(2rem,6vw,3.6rem)] font-black leading-[1.1] tracking-[-0.03em]"
          style={{ color: "var(--ew-forest)" }}
        >
          What We
          <br />
          <em className="italic" style={{ color: "var(--ew-leaf)" }}>
            Offer
          </em>
        </h2>
        <p
          className="font-['DM_Sans',sans-serif] text-[0.88rem] leading-[1.75] font-light sm:text-right sm:max-w-[240px]"
          style={{ color: "rgba(51,63,54,0.55)" }}
        >
          Four services. One trusted team. Wherever you are in the United States.
        </p>
      </div>

      {/* Mobile: horizontal scroll — Desktop: grid */}
      <div
        className="
          flex flex-row overflow-x-auto gap-[2px] snap-x snap-mandatory
          lg:grid lg:grid-cols-4 lg:overflow-visible
          px-4 sm:px-8 lg:px-[52px]
          scrollbar-none
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
        "
      >
        {SERVICES.map((s) => (
          <div key={s.num} className="snap-start">
            <ServiceCard service={s} />
          </div>
        ))}
      </div>

      {/* Scroll indicator dots — mobile only */}
      <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
        {SERVICES.map((s) => (
          <span
            key={s.num}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(51,63,54,0.2)" }}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-8 sm:mt-10 lg:mt-[52px] px-4">
        <Link
          href="/services"
          className="inline-flex items-center gap-2.5 font-['DM_Sans',sans-serif] text-[0.75rem] font-medium tracking-[0.14em] uppercase no-underline px-8 py-[13px] rounded-[3px] transition-[background,color] duration-300"
          style={{
            color: "var(--ew-forest)",
            border: "1.5px solid var(--ew-forest)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "var(--ew-forest)";
            el.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.color = "var(--ew-forest)";
          }}
        >
          View All Services <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}