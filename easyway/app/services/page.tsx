"use client";

import {
  Truck,
  Leaf,
  Sparkles,
  Waves,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldCheck,
  MoveRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "moving",
    num: "01",
    icon: <Truck size={22} />,
    name: "Moving Services",
    tagline: "From your front door to theirs.",
    desc: "We handle local and long-distance moves with care. Select items room by room, get an instant distance-based quote, and let our crew do the heavy lifting — literally.",
    img: "./1.jpeg",
    href: "/moving",
    features: [
      "Instant ZIP-to-ZIP pricing",
      "Room-by-room item selector",
      "Furniture disassembly & reassembly",
      "Packing materials included",
      "Licensed & insured crew",
      "Same-day availability",
    ],
    plans: [
      { name: "Local Move", price: "From $299", note: "Under 50 miles" },
      { name: "Long Distance", price: "Custom quote", note: "50+ miles" },
      { name: "Full Pack & Move", price: "From $549", note: "We pack everything" },
    ],
  },
  {
    id: "landscaping",
    num: "02",
    icon: <Leaf size={22} />,
    name: "Landscaping",
    tagline: "Outdoor spaces that reflect your home.",
    desc: "From seasonal planting to full yard redesigns, our landscaping crews bring expertise and an eye for design. We also offer recurring maintenance plans so your yard always looks its best.",
    img: "./2.jpeg",
    href: "/landscaping",
    features: [
      "Custom yard design consultations",
      "Seasonal planting & mulching",
      "Lawn mowing & edging",
      "Irrigation system setup",
      "Tree trimming & removal",
      "Weekly & bi-weekly plans",
    ],
    plans: [
      { name: "One-Time Cleanup", price: "From $149", note: "Full yard tidy-up" },
      { name: "Monthly Plan", price: "From $199/mo", note: "Recurring maintenance" },
      { name: "Full Redesign", price: "Custom quote", note: "Design + installation" },
    ],
  },
  {
    id: "cleaning",
    num: "03",
    icon: <Sparkles size={22} />,
    name: "Cleaning Services",
    tagline: "Spotless. Every single time.",
    desc: "Deep cleans, recurring plans, and move-in/out packages. Our cleaning teams use eco-friendly products and follow a 50-point checklist so nothing ever gets missed.",
    img: "./3.jpeg",
    href: "/cleaning",
    features: [
      "50-point cleaning checklist",
      "Eco-friendly products only",
      "Move-in / move-out packages",
      "Same crew every visit",
      "Background-checked cleaners",
      "Satisfaction guarantee",
    ],
    plans: [
      { name: "Standard Clean", price: "From $99", note: "Up to 3 bedrooms" },
      { name: "Deep Clean", price: "From $199", note: "Full top-to-bottom" },
      { name: "Weekly Plan", price: "From $79/visit", note: "Recurring discount" },
    ],
  },
  {
    id: "plumbing",
    num: "04",
    icon: <Wrench size={22} />,
    name: "Plumbing",
    tagline: "Fixed fast. Done right.",
    desc: "Leaks, clogs, installations, and emergencies — our licensed plumbers respond quickly and get it right the first time. No guesswork, no upsells, just honest work.",
    img: "./5.jpeg",
    href: "/plumbing",
    features: [
      "Emergency same-day response",
      "Leak detection & repair",
      "Drain cleaning & unclogging",
      "Fixture installation & replacement",
      "Water heater service & install",
      "Licensed & insured plumbers",
    ],
    plans: [
      { name: "Service Call", price: "From $89", note: "Diagnosis + first hour" },
      { name: "Drain Cleaning", price: "From $129", note: "Full line clearing" },
      { name: "Emergency Visit", price: "From $179", note: "Same-day response" },
    ],
  },
  {
    id: "pool",
    num: "05",
    icon: <Waves size={22} />,
    name: "Pool Maintenance",
    tagline: "Crystal clear, year-round.",
    desc: "Stop guessing at chemicals and chasing algae. Our pool technicians visit on your schedule, test and balance the water, clean filters, and keep everything running safely.",
    img: "./4.jpeg",
    href: "/pool",
    features: [
      "Chemical testing & balancing",
      "Filter cleaning & backwash",
      "Skimming & vacuuming",
      "Equipment inspection",
      "Algae treatment included",
      "Digital service reports",
    ],
    plans: [
      { name: "Monthly Visit", price: "From $89/mo", note: "Single service call" },
      { name: "Bi-Weekly Plan", price: "From $149/mo", note: "Most popular" },
      { name: "Weekly Plan", price: "From $249/mo", note: "Full season care" },
    ],
  },
];

const TRUST = [
  { icon: <ShieldCheck size={20} />, label: "Licensed & Insured", sub: "Every crew, every job." },
  { icon: <Clock size={20} />, label: "On-Time Guarantee", sub: "Or we discount the visit." },
  { icon: <DollarSign size={20} />, label: "Transparent Pricing", sub: "No hidden fees, ever." },
  { icon: <CheckCircle2 size={20} />, label: "Satisfaction Promise", sub: "We fix it or refund it." },
];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function ServiceSection({
  service,
  flipped,
}: {
  service: (typeof SERVICES)[0];
  flipped: boolean;
}) {
  return (
    <div
      id={service.id}
      className="grid lg:grid-cols-2 gap-px scroll-mt-20"
      style={{ background: "rgba(51,63,54,0.1)" }}
    >
      {/* Image — flips sides on alternating rows */}
      <div className={`relative overflow-hidden h-[320px] lg:h-[580px] ${flipped ? "lg:order-2" : ""}`}>
        <img
          src={service.img}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Floating number */}
        <span className="absolute bottom-4 right-5 font-['Playfair_Display',serif] text-[6rem] font-black leading-none text-white/[0.08] select-none">
          {service.num}
        </span>

        {/* Icon badge */}
        <div
          className="absolute top-5 left-5 w-11 h-11 flex items-center justify-center rounded-[4px]"
          style={{
            color: "var(--ew-sky)",
            background: "rgba(0,0,0,0.45)",
            border: "1.5px solid rgba(27,110,180,0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          {service.icon}
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex flex-col justify-center px-6 py-12 lg:px-14 lg:py-16 ${flipped ? "lg:order-1" : ""}`}
        style={{ background: "var(--ew-bg)" }}
      >
        <p
          className="font-['DM_Sans',sans-serif] text-[0.7rem] tracking-[0.2em] uppercase mb-4"
          style={{ color: "var(--ew-sky)" }}
        >
          {service.num} — {service.name}
        </p>

        <h2
          className="font-['Playfair_Display',serif] text-[clamp(1.7rem,3.5vw,2.5rem)] font-black leading-[1.1] tracking-[-0.025em] mb-2"
          style={{ color: "var(--ew-forest)" }}
        >
          {service.tagline.split(" ").slice(0, -1).join(" ")}{" "}
          <em className="italic" style={{ color: "var(--ew-leaf)" }}>
            {service.tagline.split(" ").slice(-1)}
          </em>
        </h2>

        <p
          className="font-['DM_Sans',sans-serif] text-[0.88rem] leading-[1.85] font-light mb-8"
          style={{ color: "rgba(51,63,54,0.65)" }}
        >
          {service.desc}
        </p>

        {/* Feature list */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-8 list-none p-0 m-0">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5">
              <CheckCircle2
                size={14}
                className="flex-shrink-0"
                style={{ color: "var(--ew-sky)" }}
              />
              <span
                className="font-['DM_Sans',sans-serif] text-[0.8rem] font-light"
                style={{ color: "rgba(51,63,54,0.75)" }}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* Pricing pills */}
        <div className="flex flex-col gap-2 mb-8">
          {service.plans.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between px-4 py-3 rounded-[3px]"
              style={{ background: "rgba(51,63,54,0.04)", border: "1px solid rgba(51,63,54,0.1)" }}
            >
              <div>
                <span
                  className="font-['DM_Sans',sans-serif] text-[0.82rem] font-medium"
                  style={{ color: "var(--ew-forest)" }}
                >
                  {p.name}
                </span>
                <span
                  className="font-['DM_Sans',sans-serif] text-[0.72rem] ml-2 font-light"
                  style={{ color: "rgba(51,63,54,0.45)" }}
                >
                  {p.note}
                </span>
              </div>
              <span
                className="font-['Playfair_Display',serif] text-[0.95rem] font-bold"
                style={{ color: "var(--ew-forest)" }}
              >
                {p.price}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div>
          <Link
            href={service.href}
            className="inline-flex items-center gap-2.5 font-['DM_Sans',sans-serif] text-[0.75rem] font-medium tracking-[0.14em] uppercase no-underline px-7 py-[13px] rounded-[3px] transition-[background,color] duration-300"
            style={{
              color: "#ffffff",
              background: "var(--ew-forest)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--ew-sky)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--ew-forest)";
            }}
          >
            Get a Quote <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <main style={{ background: "var(--ew-bg)" }}>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden py-24 lg:py-[130px] px-4 sm:px-8 lg:px-[52px]">
        <span className="pointer-events-none select-none absolute -top-4 right-0 font-['Playfair_Display',serif] text-[clamp(8rem,20vw,18rem)] font-black leading-none" style={{ color: "rgba(51,63,54,0.04)" }}>
          05
        </span>

        <div className="relative z-10 max-w-[780px]">
          <p className="font-['DM_Sans',sans-serif] text-[0.72rem] tracking-[0.2em] uppercase mb-5" style={{ color: "var(--ew-sky)" }}>
            What We Offer
          </p>
          <h1 className="font-['Playfair_Display',serif] text-[clamp(2.6rem,7vw,5rem)] font-black leading-[1.05] tracking-[-0.03em] mb-8" style={{ color: "var(--ew-forest)" }}>
            Five services.{" "}
            <br />
            <em className="italic" style={{ color: "var(--ew-leaf)" }}>One trusted team.</em>
          </h1>
          <p className="font-['DM_Sans',sans-serif] text-[1rem] leading-[1.85] font-light max-w-[520px]" style={{ color: "rgba(51,63,54,0.65)" }}>
            Moving, landscaping, cleaning, plumbing, or pool care — every job is backed by vetted crews, transparent pricing, and a satisfaction guarantee. Wherever you are in the United States.
          </p>
        </div>

        {/* Quick-jump nav */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-10">
          {SERVICES.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="inline-flex items-center gap-2 font-['DM_Sans',sans-serif] text-[0.72rem] tracking-[0.12em] uppercase no-underline px-5 py-2.5 rounded-[3px] transition-all duration-200"
              style={{
                color: "var(--ew-forest)",
                border: "1.5px solid rgba(51,63,54,0.2)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--ew-forest)";
                el.style.color = "#fff";
                el.style.borderColor = "var(--ew-forest)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.color = "var(--ew-forest)";
                el.style.borderColor = "rgba(51,63,54,0.2)";
              }}
            >
              <span style={{ color: "var(--ew-sky)" }}>{s.num}</span>
              {s.name}
            </a>
          ))}
        </div>

        <div className="mt-14 h-px w-full" style={{ background: "rgba(51,63,54,0.12)" }} />
      </section>

      {/* ─── SERVICE SECTIONS ─── */}
      <div className="flex flex-col gap-px" style={{ background: "rgba(51,63,54,0.1)" }}>
        {SERVICES.map((s, i) => (
          <ServiceSection key={s.id} service={s} flipped={i % 2 !== 0} />
        ))}
      </div>

      {/* ─── TRUST STRIP ─── */}
      <section style={{ borderTop: "1px solid rgba(51,63,54,0.12)" }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "rgba(51,63,54,0.12)" }}>
          {TRUST.map((t) => (
            <div
              key={t.label}
              className="flex flex-col items-center text-center gap-3 px-6 py-10"
              style={{ background: "var(--ew-bg)" }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center rounded-full"
                style={{ color: "var(--ew-sky)", background: "rgba(27,110,180,0.08)", border: "1.5px solid rgba(27,110,180,0.2)" }}
              >
                {t.icon}
              </div>
              <div>
                <p className="font-['Playfair_Display',serif] text-[1rem] font-bold" style={{ color: "var(--ew-forest)" }}>
                  {t.label}
                </p>
                <p className="font-['DM_Sans',sans-serif] text-[0.75rem] font-light mt-0.5" style={{ color: "rgba(51,63,54,0.5)" }}>
                  {t.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section
        className="relative overflow-hidden py-16 lg:py-[90px] px-4 sm:px-8 lg:px-[52px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8"
        style={{ background: "var(--ew-forest)" }}
      >
        <span className="pointer-events-none select-none absolute -bottom-4 right-0 font-['Playfair_Display',serif] text-[clamp(5rem,16vw,13rem)] font-black leading-none text-white/[0.04]">
          EasyWay
        </span>

        <div className="relative z-10 max-w-[480px]">
          <h2 className="font-['Playfair_Display',serif] text-[clamp(1.8rem,4vw,2.8rem)] font-black leading-[1.1] tracking-[-0.025em] text-white mb-3">
            Not sure where to{" "}
            <em className="italic" style={{ color: "var(--ew-sky)" }}>start?</em>
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-[0.88rem] leading-[1.8] font-light text-white/60">
            Answer three quick questions and we'll point you to the right service and give you an instant estimate.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2.5 font-['DM_Sans',sans-serif] text-[0.75rem] font-medium tracking-[0.14em] uppercase no-underline px-8 py-[13px] rounded-[3px] transition-[background,color] duration-300"
            style={{ background: "var(--ew-sky)", color: "#ffffff", border: "1.5px solid var(--ew-sky)" }}
          >
            Take the Quiz <MoveRight size={14} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 font-['DM_Sans',sans-serif] text-[0.75rem] font-medium tracking-[0.14em] uppercase no-underline px-8 py-[13px] rounded-[3px] transition-[background,color] duration-300"
            style={{ color: "rgba(255,255,255,0.75)", border: "1.5px solid rgba(255,255,255,0.25)" }}
          >
            Talk to Us
          </Link>
        </div>
      </section>

    </main>
  );
}