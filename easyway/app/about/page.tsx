"use client";

import { ArrowRight, Users, Globe, Star, ShieldCheck, ClipboardList, CalendarCheck, Wrench, ThumbsUp } from "lucide-react";
import Link from "next/link";

const STATS = [
  { value: "12K+", label: "Happy Clients" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "50+", label: "Cities Served" },
  { value: "8 yrs", label: "In Business" },
];

const VALUES = [
  {
    num: "01",
    icon: <ShieldCheck size={18} />,
    title: "Trust & Reliability",
    body: "Every technician is background-checked, licensed, and insured. We show up on time, every time — no surprises on the invoice.",
  },
  {
    num: "02",
    icon: <Star size={18} />,
    title: "Craftsmanship",
    body: "We treat your home like our own. From a deep clean to a full landscaping overhaul, we never cut corners.",
  },
  {
    num: "03",
    icon: <Globe size={18} />,
    title: "Local Roots",
    body: "We hire from the communities we serve. Our teams are your neighbors — people who care about the neighborhoods they work in.",
  },
  {
    num: "04",
    icon: <Users size={18} />,
    title: "People First",
    body: "Whether it's our clients or our crew, everyone deserves to be treated with respect, fairness, and transparency.",
  },
];

const STEPS = [
  {
    num: "01",
    icon: <ClipboardList size={20} />,
    title: "Pick Your Service",
    body: "Choose from moving, landscaping, cleaning, or pool maintenance. Select your options and we'll build your quote on the spot — no phone calls, no waiting.",
  },
  {
    num: "02",
    icon: <CalendarCheck size={20} />,
    title: "Book a Time",
    body: "Pick a date and window that works for you. We'll confirm within the hour and send reminders so nothing slips through the cracks.",
  },
  {
    num: "03",
    icon: <Wrench size={20} />,
    title: "We Show Up",
    body: "A vetted, uniformed crew arrives on time with all equipment and materials. You don't lift a finger — just let us in and we handle the rest.",
  },
  {
    num: "04",
    icon: <ThumbsUp size={20} />,
    title: "You Approve",
    body: "We do a walkthrough with you before we leave. If anything isn't right, we fix it on the spot. Your satisfaction is the only sign-off that matters.",
  },
];

function ValueCard({ v }: { v: (typeof VALUES)[0] }) {
  return (
    <div
      className="group relative overflow-hidden p-6 lg:p-8 flex flex-col gap-4 transition-colors duration-300 hover:bg-[var(--ew-forest)]"
      style={{ borderBottom: "3px solid var(--ew-sky)", background: "var(--ew-bg)" }}
    >
      <span className="absolute top-3 right-4 font-['Playfair_Display',serif] text-[4rem] font-black leading-none text-black/[0.04] group-hover:text-white/[0.06] transition-colors duration-300">
        {v.num}
      </span>

      <div
        className="w-[46px] h-[46px] flex items-center justify-center rounded-[4px] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3"
        style={{
          color: "var(--ew-sky)",
          background: "rgba(27,110,180,0.08)",
          border: "1.5px solid rgba(27,110,180,0.3)",
        }}
      >
        {v.icon}
      </div>

      <h3 className="font-['Playfair_Display',serif] text-[1.2rem] font-bold leading-[1.2] group-hover:text-white transition-colors duration-300"
        style={{ color: "var(--ew-forest)" }}>
        {v.title}
      </h3>

      <p className="font-['DM_Sans',sans-serif] text-[0.82rem] leading-[1.7] font-light group-hover:text-white/75 transition-colors duration-300"
        style={{ color: "rgba(51,63,54,0.6)" }}>
        {v.body}
      </p>
    </div>
  );
}



export default function AboutPage() {
  return (
    <main style={{ background: "var(--ew-bg)" }}>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden py-24 lg:py-[130px] px-4 sm:px-8 lg:px-[52px]">
        {/* Decorative number */}
        <span
          className="pointer-events-none select-none absolute -top-6 right-0 font-['Playfair_Display',serif] text-[clamp(8rem,20vw,18rem)] font-black leading-none"
          style={{ color: "rgba(51,63,54,0.04)" }}
        >
          US
        </span>

        <div className="relative z-10 max-w-[820px]">
          <p
            className="font-['DM_Sans',sans-serif] text-[0.72rem] tracking-[0.2em] uppercase mb-5"
            style={{ color: "var(--ew-sky)" }}
          >
            Our Story
          </p>

          <h1
            className="font-['Playfair_Display',serif] text-[clamp(2.6rem,7vw,5rem)] font-black leading-[1.05] tracking-[-0.03em] mb-8"
            style={{ color: "var(--ew-forest)" }}
          >
            Home services,{" "}
            <em className="italic" style={{ color: "var(--ew-leaf)" }}>
              done right.
            </em>
          </h1>

          <p
            className="font-['DM_Sans',sans-serif] text-[1rem] leading-[1.85] font-light max-w-[540px]"
            style={{ color: "rgba(51,63,54,0.65)" }}
          >
            EasyWay was founded in 2017 by two frustrated homeowners who couldn't find a single service company they could trust. Today we operate across 50+ cities, employing local crews who take real pride in their work — and yours.
          </p>
        </div>

        {/* Horizontal rule */}
        <div className="mt-14 h-px w-full" style={{ background: "rgba(51,63,54,0.12)" }} />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mt-0" style={{ background: "rgba(51,63,54,0.12)" }}>
          {STATS.map((s) => (
            <div key={s.label} className="py-8 px-6 flex flex-col gap-1" style={{ background: "var(--ew-bg)" }}>
              <span
                className="font-['Playfair_Display',serif] text-[2.4rem] font-black leading-none"
                style={{ color: "var(--ew-forest)" }}
              >
                {s.value}
              </span>
              <span
                className="font-['DM_Sans',sans-serif] text-[0.72rem] tracking-[0.15em] uppercase"
                style={{ color: "rgba(51,63,54,0.5)" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MISSION SPLIT ─── */}
      <section className="grid lg:grid-cols-2 gap-px" style={{ background: "rgba(51,63,54,0.12)" }}>
        {/* Image side */}
        <div className="relative overflow-hidden h-[320px] lg:h-[520px]" style={{ background: "var(--ew-bg)" }}>
          <img
            src="./2.jpeg"
            alt="Team at work"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute bottom-6 left-6 right-6 p-5 rounded-[3px]"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <p className="font-['Playfair_Display',serif] italic text-white text-[0.9rem] leading-[1.65]">
              "We don't just send someone to your door. We send someone you can trust with your home."
            </p>
            <p className="font-['DM_Sans',sans-serif] text-[0.7rem] tracking-[0.15em] uppercase text-white/60 mt-2">
              — Daniel Marsh, CEO
            </p>
          </div>
        </div>

        {/* Text side */}
        <div className="flex flex-col justify-center px-8 py-14 lg:px-14 lg:py-16" style={{ background: "var(--ew-bg)" }}>
          <p
            className="font-['DM_Sans',sans-serif] text-[0.72rem] tracking-[0.2em] uppercase mb-5"
            style={{ color: "var(--ew-sky)" }}
          >
            Our Mission
          </p>
          <h2
            className="font-['Playfair_Display',serif] text-[clamp(1.8rem,4vw,2.6rem)] font-black leading-[1.1] tracking-[-0.025em] mb-6"
            style={{ color: "var(--ew-forest)" }}
          >
            A home you're proud of,{" "}
            <em className="italic" style={{ color: "var(--ew-leaf)" }}>without the stress.</em>
          </h2>
          <p
            className="font-['DM_Sans',sans-serif] text-[0.88rem] leading-[1.85] font-light mb-4"
            style={{ color: "rgba(51,63,54,0.65)" }}
          >
            Most home service companies treat you like a ticket number. We built EasyWay around the opposite idea — every client has a name, a home, and a story we're stepping into.
          </p>
          <p
            className="font-['DM_Sans',sans-serif] text-[0.88rem] leading-[1.85] font-light"
            style={{ color: "rgba(51,63,54,0.65)" }}
          >
            From your first quote to your final walkthrough, our goal is simple: leave things better than we found them.
          </p>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="py-14 sm:py-20 lg:py-[110px]">
        <div className="px-4 sm:px-8 lg:px-[52px] mb-10 lg:mb-16 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
          <h2
            className="font-['Playfair_Display',serif] text-[clamp(2rem,6vw,3.6rem)] font-black leading-[1.1] tracking-[-0.03em]"
            style={{ color: "var(--ew-forest)" }}
          >
            What We
            <br />
            <em className="italic" style={{ color: "var(--ew-leaf)" }}>
              Stand For
            </em>
          </h2>
          <p
            className="font-['DM_Sans',sans-serif] text-[0.88rem] leading-[1.75] font-light sm:text-right sm:max-w-[220px]"
            style={{ color: "rgba(51,63,54,0.55)" }}
          >
            Four principles that guide every job we take.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px px-4 sm:px-8 lg:px-[52px]" style={{ background: "rgba(51,63,54,0.12)" }}>
          {VALUES.map((v) => (
            <ValueCard key={v.num} v={v} />
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-14 sm:py-20 lg:py-[110px] px-4 sm:px-8 lg:px-[52px]" style={{ borderTop: "1px solid rgba(51,63,54,0.12)" }}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-12 lg:mb-20">
          <h2
            className="font-['Playfair_Display',serif] text-[clamp(2rem,6vw,3.6rem)] font-black leading-[1.1] tracking-[-0.03em]"
            style={{ color: "var(--ew-forest)" }}
          >
            How It
            <br />
            <em className="italic" style={{ color: "var(--ew-leaf)" }}>
              Works
            </em>
          </h2>
          <p
            className="font-['DM_Sans',sans-serif] text-[0.88rem] leading-[1.75] font-light sm:text-right sm:max-w-[220px]"
            style={{ color: "rgba(51,63,54,0.55)" }}
          >
            From first click to final walkthrough — four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden lg:block absolute top-[30px] left-[calc(52px+30px)] right-[calc(52px+30px)] h-px"
            style={{ background: "rgba(51,63,54,0.12)" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="group flex flex-col gap-5">

                {/* Icon circle */}
                <div className="relative flex items-center gap-4 lg:flex-col lg:items-start lg:gap-0">
                  <div
                    className="relative z-10 w-[60px] h-[60px] flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: "var(--ew-bg)",
                      color: "var(--ew-sky)",
                      border: "2px solid rgba(27,110,180,0.3)",
                    }}
                  >
                    {step.icon}
                    {/* Step number badge */}
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-['DM_Sans',sans-serif] text-[0.58rem] font-bold text-white"
                      style={{ background: "var(--ew-sky)" }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  {/* Mobile connector arrow */}
                  {i < STEPS.length - 1 && (
                    <ArrowRight
                      size={14}
                      className="sm:hidden"
                      style={{ color: "rgba(51,63,54,0.2)" }}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2 lg:pt-6">
                  <span
                    className="font-['Playfair_Display',serif] text-[2rem] font-black leading-none"
                    style={{ color: "rgba(51,63,54,0.07)" }}
                  >
                    {step.num}
                  </span>
                  <h3
                    className="font-['Playfair_Display',serif] text-[1.15rem] font-bold leading-[1.2]"
                    style={{ color: "var(--ew-forest)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="font-['DM_Sans',sans-serif] text-[0.82rem] leading-[1.75] font-light"
                    style={{ color: "rgba(51,63,54,0.6)" }}
                  >
                    {step.body}
                  </p>
                </div>

                {/* Bottom accent */}
                <div
                  className="mt-auto h-[3px] w-10 transition-all duration-300 group-hover:w-full"
                  style={{ background: "var(--ew-sky)" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA row */}
        <div className="flex justify-center mt-12 lg:mt-16">
          <Link
            href="/services"
            className="inline-flex items-center gap-2.5 font-['DM_Sans',sans-serif] text-[0.75rem] font-medium tracking-[0.14em] uppercase no-underline px-8 py-[13px] rounded-[3px] transition-[background,color] duration-300"
            style={{ color: "var(--ew-forest)", border: "1.5px solid var(--ew-forest)" }}
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
            Start Your Quote <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section
        className="relative overflow-hidden py-16 lg:py-[90px] px-4 sm:px-8 lg:px-[52px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8"
        style={{ background: "var(--ew-forest)" }}
      >
        {/* Decorative background text */}
        <span className="pointer-events-none select-none absolute -bottom-4 right-0 font-['Playfair_Display',serif] text-[clamp(5rem,16vw,13rem)] font-black leading-none text-white/[0.04]">
          EasyWay
        </span>

        <div className="relative z-10 max-w-[500px]">
          <h2 className="font-['Playfair_Display',serif] text-[clamp(1.8rem,4vw,2.8rem)] font-black leading-[1.1] tracking-[-0.025em] text-white mb-3">
            Ready to make home life <em className="italic" style={{ color: "var(--ew-sky)" }}>easier?</em>
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-[0.88rem] leading-[1.8] font-light text-white/60">
            Get an instant quote in under two minutes. No account needed.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/services"
            className="inline-flex items-center gap-2.5 font-['DM_Sans',sans-serif] text-[0.75rem] font-medium tracking-[0.14em] uppercase no-underline px-8 py-[13px] rounded-[3px] transition-[background,color] duration-300"
            style={{
              background: "var(--ew-sky)",
              color: "#ffffff",
              border: "1.5px solid var(--ew-sky)",
            }}
          >
            Get a Quote <ArrowRight size={14} />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2.5 font-['DM_Sans',sans-serif] text-[0.75rem] font-medium tracking-[0.14em] uppercase no-underline px-8 py-[13px] rounded-[3px] transition-[background,color] duration-300"
            style={{
              color: "rgba(255,255,255,0.75)",
              border: "1.5px solid rgba(255,255,255,0.25)",
            }}
          >
            View Services
          </Link>
        </div>
      </section>

    </main>
  );
}