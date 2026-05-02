"use client";

import { MapPin, Zap, BadgePercent, ShieldCheck, SlidersHorizontal, ClipboardList } from "lucide-react";

const REASONS = [
  {
    icon: <Zap size={22} />,
    title: "Instant Confirmation",
    desc: "See live availability and pricing, then lock in your booking in seconds — no waiting, no back-and-forth.",
  },
  {
    icon: <MapPin size={22} />,
    title: "Nationwide Coverage",
    desc: "From coast to coast, our vetted teams are ready to serve you wherever you are across the United States.",
  },
  {
    icon: <SlidersHorizontal size={22} />,
    title: "Tailored to You",
    desc: "Choose exactly what you need — services, extras, add-ons — built around how you actually live.",
  },
  {
    icon: <BadgePercent size={22} />,
    title: "Online-Only Savings",
    desc: "Book through our website and automatically save 10% on every order, every time. No codes needed.",
  },
  {
    icon: <ClipboardList size={22} />,
    title: "Full Transparency",
    desc: "Review every detail — scope, notes, and preferences — before you confirm. No surprises on the day.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Secure Checkout",
    desc: "Your payment information is fully encrypted and protected. Book with complete confidence.",
  },
];

export default function WhyBookOnline() {
  return (
    <section
      className="py-14 sm:py-20 lg:py-[110px] px-4 sm:px-8 lg:px-[52px]"
      style={{ background: "var(--ew-bg)" }}
    >
      {/* Header */}
      <div className="max-w-[560px] mb-10 sm:mb-14 lg:mb-[72px]">
        <span
          className="font-['DM_Sans',sans-serif] text-[11px] tracking-[0.2em] uppercase font-semibold block mb-3.5"
          style={{ color: "var(--ew-leaf)" }}
        >
          Why Book Online
        </span>
        <h2
          className="font-['Playfair_Display',serif] text-[clamp(1.9rem,5vw,3.4rem)] font-black leading-[1.1] tracking-[-0.03em] m-0"
          style={{ color: "var(--ew-forest)" }}
        >
          Smarter Booking,{" "}
          <em className="italic" style={{ color: "var(--ew-sky)" }}>
            Better Results
          </em>
        </h2>
      </div>

      {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px]"
        style={{ background: "var(--ew-forest)", border: "1px solid var(--ew-forest)", borderRadius: "8px", overflow: "hidden" }}
      >
        {REASONS.map((item) => (
          <div
            key={item.title}
            className="px-6 sm:px-8 lg:px-9 py-8 sm:py-9 lg:py-[42px] transition-colors duration-200 ease-in-out cursor-default"
            style={{ background: "var(--ew-bg)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#f7f8f6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--ew-bg)";
            }}
          >
            {/* Icon */}
            <div
              className="w-[44px] h-[44px] flex items-center justify-center rounded-[6px] mb-5"
              style={{
                color: "var(--ew-forest)",
                background: "rgba(75,118,22,0.08)",
                border: "1.5px solid rgba(75,118,22,0.22)",
              }}
            >
              {item.icon}
            </div>

            {/* Title */}
            <h3
              className="font-['Playfair_Display',serif] text-[1rem] sm:text-[1.1rem] font-bold leading-[1.25] mb-2.5"
              style={{ color: "var(--ew-forest)" }}
            >
              {item.title}
            </h3>

            {/* Desc */}
            <p
              className="font-['DM_Sans',sans-serif] text-[13px] leading-[1.75] font-normal m-0"
              style={{ color: "rgba(51,63,54,0.6)" }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}