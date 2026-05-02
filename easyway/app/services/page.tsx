"use client";

import { ArrowRight, Truck, Leaf, Sparkles, Waves, Wrench, CheckCircle } from "lucide-react";
import Link from "next/link";

const SERVICES = [
  {
    id: "moving",
    icon: <Truck size={18} />,
    num: "01",
    name: "Moving Services",
    tagline: "Move Smarter,",
    taglineItalic: "Live Better",
    desc: "From studio apartments to full family homes, our moving crews handle every item with care. Get an instant quote based on your ZIP code distance and room-by-room inventory.",
    features: ["Room-by-room item calculator", "Instant ZIP-based quotes", "Licensed & insured crews", "Vehicle transport available", "Same-day slots", "Full packing service"],
    href: "/moving",
    cta: "Calculate Moving Cost",
    img: "/1.png",
  },
  {
    id: "landscaping",
    icon: <Leaf size={18} />,
    num: "02",
    name: "Landscaping",
    tagline: "Your Yard,",
    taglineItalic: "Reimagined",
    desc: "From seasonal lawn care to complete garden transformations. We work around your schedule and budget — with a free on-site estimate every time.",
    features: ["Lawn mowing & edging", "Full garden design", "Irrigation installation", "Seasonal clean-ups", "Tree & hedge trimming", "Free on-site estimates"],
    href: "/landscaping",
    cta: "Get a Free Quote",
    img: "/2.png",
  },
  {
    id: "cleaning",
    icon: <Sparkles size={18} />,
    num: "03",
    name: "Cleaning Services",
    tagline: "Spotless Homes,",
    taglineItalic: "Every Time",
    desc: "One-off deep cleans or recurring weekly schedules — our teams arrive fully equipped and leave no corner untouched. Move-in and move-out packages available.",
    features: ["Standard & deep cleans", "Weekly, bi-weekly plans", "Move-in/out packages", "Eco-friendly products", "Background-checked staff", "Satisfaction guaranteed"],
    href: "/cleaning",
    cta: "Book a Clean",
    img: "/3.png",
  },
  {
    id: "pool",
    icon: <Waves size={18} />,
    num: "04",
    name: "Pool Maintenance",
    tagline: "Crystal Clear,",
    taglineItalic: "All Season",
    desc: "Keep your pool flawless year-round with our subscription plans. We handle chemical balancing, equipment checks, and seasonal prep automatically.",
    features: ["Weekly chemical balancing", "Filter & pump checks", "Algae prevention", "Seasonal open & close", "Equipment repair refs", "Monthly water reports"],
    href: "/pool",
    cta: "Start a Plan",
    img: "/4.png",
  },
  {
    id: "plumbing",
    icon: <Wrench size={18} />,
    num: "05",
    name: "Plumbing",
    tagline: "Fixed Fast,",
    taglineItalic: "Done Right",
    desc: "Leaks, clogs, installations — our licensed plumbers respond fast and fix it right the first time. Emergency callouts and scheduled maintenance nationwide.",
    features: ["Emergency callouts", "Leak detection & repair", "Drain cleaning", "Fixture installation", "Water heater service", "Licensed & insured"],
    href: "/plumbing",
    cta: "Request a Plumber",
    img: "/7.png",
  },
];

export default function ServicesPage() {
  return (
    <main
      className="min-h-screen font-['DM_Sans',sans-serif] pt-[70px]"
      style={{ background: "var(--ew-bg)" }}
    >
      {/* ── Hero ── */}
      <div
        className="px-4 sm:px-8 lg:px-[52px] pt-16 pb-14"
        style={{ background: "var(--ew-forest)", borderBottom: "3px solid var(--ew-sky)" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <span
              className="text-[0.65rem] tracking-[0.22em] uppercase font-semibold block mb-4"
              style={{ color: "var(--ew-leaf)" }}
            >
              What We Offer
            </span>
            <h1
              className="font-['Playfair_Display',serif] text-[clamp(2.4rem,6vw,5rem)] font-black leading-[1.0] tracking-[-0.03em] m-0"
              style={{ color: "#ffffff" }}
            >
              Five Services.
              <br />
              <em className="italic" style={{ color: "var(--ew-sky)" }}>One Team.</em>
            </h1>
          </div>
          <p
            className="font-['DM_Sans',sans-serif] text-[0.9rem] max-w-[320px] leading-[1.8] lg:text-right"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Moving, landscaping, cleaning, pool care, and plumbing — handled by one trusted team across the US.
          </p>
        </div>

        {/* Service index row */}
        <div
          className="flex flex-wrap gap-x-8 gap-y-3 mt-12 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          {SERVICES.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-2 no-underline transition-opacity duration-200 hover:opacity-100 group"
              style={{ opacity: 0.45 }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = "1"}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = "0.45"}
            >
              <span
                className="font-['Playfair_Display',serif] text-[0.65rem] font-black"
                style={{ color: "var(--ew-sky)" }}
              >
                {s.num}
              </span>
              <span
                className="font-['DM_Sans',sans-serif] text-[0.72rem] tracking-[0.1em] uppercase font-medium"
                style={{ color: "#ffffff" }}
              >
                {s.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Service Sections ── */}
      {SERVICES.map((service, i) => (
        <section
          key={service.id}
          id={service.id}
          className="relative"
          style={{ borderBottom: "1px solid rgba(51,63,54,0.08)" }}
        >
          {/* Large number watermark */}
          <span
            className="absolute top-6 right-6 sm:right-10 font-['Playfair_Display',serif] text-[8rem] sm:text-[11rem] font-black leading-none pointer-events-none select-none z-0"
            style={{ color: "rgba(51,63,54,0.04)" }}
          >
            {service.num}
          </span>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">

            {/* ── Image column — narrower on even, wider on odd ── */}
            <div
              className={`relative overflow-hidden h-[260px] sm:h-[340px] lg:h-auto ${i % 2 === 0 ? "lg:col-span-5" : "lg:col-span-7 lg:order-2"}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.04]"
                style={{ backgroundImage: `url('${service.img}')` }}
              />
              <div className="absolute inset-0 bg-black/40" />

              {/* Overlay content */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
                {/* Icon */}
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-[4px] self-start"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#ffffff",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {service.icon}
                </div>

                {/* Bottom label */}
                <div>
                  <span
                    className="font-['Playfair_Display',serif] text-[0.6rem] font-black tracking-[0.15em] uppercase block mb-1"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {service.num}
                  </span>
                  <h3
                    className="font-['Playfair_Display',serif] text-[1.4rem] sm:text-[1.7rem] font-black leading-[1.15] text-white m-0"
                  >
                    {service.tagline}
                    <br />
                    <em className="italic" style={{ color: "var(--ew-sky)" }}>{service.taglineItalic}</em>
                  </h3>
                </div>
              </div>
            </div>

            {/* ── Content column ── */}
            <div
              className={`flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 lg:py-14 ${i % 2 === 0 ? "lg:col-span-7" : "lg:col-span-5 lg:order-1"}`}
              style={{ background: "var(--ew-bg)" }}
            >
              {/* Eyebrow */}
              <span
                className="text-[0.6rem] tracking-[0.2em] uppercase font-semibold block mb-5"
                style={{ color: "var(--ew-leaf)" }}
              >
                {service.name}
              </span>

              {/* Description */}
              <p
                className="font-['DM_Sans',sans-serif] text-[0.95rem] leading-[1.82] mb-8 max-w-[480px]"
                style={{ color: "rgba(51,63,54,0.65)" }}
              >
                {service.desc}
              </p>

              {/* Features — 2 col grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-10">
                {service.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <CheckCircle
                      size={13}
                      strokeWidth={2.5}
                      style={{ color: "var(--ew-leaf)", flexShrink: 0 }}
                    />
                    <span
                      className="font-['DM_Sans',sans-serif] text-[0.82rem]"
                      style={{ color: "rgba(51,63,54,0.7)" }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA row */}
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 font-['DM_Sans',sans-serif] text-[0.72rem] font-semibold tracking-[0.12em] uppercase no-underline px-6 py-[13px] rounded-[3px] transition-[background] duration-300"
                  style={{ background: "var(--ew-forest)", color: "#ffffff" }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--ew-sky)"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "var(--ew-forest)"}
                >
                  {service.cta} <ArrowRight size={13} />
                </Link>
                <Link
                  href={service.href}
                  className="font-['DM_Sans',sans-serif] text-[0.72rem] tracking-[0.08em] uppercase no-underline transition-opacity duration-200 hover:opacity-100"
                  style={{ color: "var(--ew-sky)", opacity: 0.7 }}
                >
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Bottom CTA ── */}
      <section
        className="px-4 sm:px-8 lg:px-[52px] py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        style={{ background: "var(--ew-forest)" }}
      >
        <div className="lg:col-span-7">
          <span
            className="text-[0.6rem] tracking-[0.2em] uppercase font-semibold block mb-5"
            style={{ color: "var(--ew-leaf)" }}
          >
            Get Started
          </span>
          <h2
            className="font-['Playfair_Display',serif] text-[clamp(2rem,4.5vw,3.8rem)] font-black leading-[1.05] tracking-[-0.03em] m-0"
            style={{ color: "#ffffff" }}
          >
            Not sure where
            <br />
            <em className="italic" style={{ color: "var(--ew-sky)" }}>to start?</em>
          </h2>
          <p
            className="mt-5 text-[0.92rem] max-w-[400px] leading-[1.78]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Tell us what you need and we'll point you in the right direction — no commitment, no pressure.
          </p>
        </div>
        <div className="lg:col-span-5 flex flex-col gap-3">
          <Link
            href="/contact"
            className="flex items-center justify-between font-['DM_Sans',sans-serif] text-[0.75rem] font-semibold tracking-[0.1em] uppercase no-underline px-7 py-[16px] rounded-[3px] transition-[background] duration-300"
            style={{ background: "var(--ew-sky)", color: "#ffffff" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--ew-leaf)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "var(--ew-sky)"}
          >
            Contact Us <ArrowRight size={14} />
          </Link>
          <Link
            href="/moving"
            className="flex items-center justify-between font-['DM_Sans',sans-serif] text-[0.75rem] font-semibold tracking-[0.1em] uppercase no-underline px-7 py-[16px] rounded-[3px] transition-[background,border-color] duration-300"
            style={{
              color: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.07)";
              el.style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.borderColor = "rgba(255,255,255,0.15)";
            }}
          >
            Get an instant quote <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}