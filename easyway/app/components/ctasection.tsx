"use client";

import { Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section
      className="py-14 sm:py-20 lg:py-[110px] px-4 sm:px-8 lg:px-[52px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center"
      style={{ background: "var(--ew-bg)" }}
    >
      {/* Left */}
      <div>
        <h2
          className="font-['Playfair_Display',serif] text-[clamp(2rem,5vw,3.2rem)] font-black leading-[1.1] tracking-[-0.03em] mb-5"
          style={{ color: "var(--ew-forest)" }}
        >
          Ready to Get
          <br />
          <em className="italic" style={{ color: "var(--ew-sky)" }}>
            Started?
          </em>
        </h2>
        <p
          className="font-['DM_Sans',sans-serif] text-[0.95rem] leading-[1.78] font-light max-w-[380px]"
          style={{ color: "rgba(51,63,54,0.55)" }}
        >
          Get an instant quote in minutes — no phone calls, no waiting. Pick
          your service and we will handle the rest from start to finish.
        </p>
      </div>

      {/* Right — card */}
      <div
        className="rounded-lg p-6 sm:p-8 lg:p-10 flex flex-col gap-3.5"
        style={{
          background: "rgba(51,63,54,0.04)",
          border: "1px solid rgba(51,63,54,0.08)",
        }}
      >
        <p
          className="font-['DM_Sans',sans-serif] text-[0.7rem] tracking-[0.18em] uppercase mb-1.5"
          style={{ color: "rgba(51,63,54,0.35)" }}
        >
          Choose where to start
        </p>

        {/* Primary CTA */}
        <Link
          href="/moving"
          className="flex items-center justify-between no-underline font-['DM_Sans',sans-serif] text-[0.82rem] font-medium tracking-[0.08em] uppercase px-6 py-[18px] rounded-[4px] transition-[background,transform] duration-300 hover:translate-x-1"
          style={{ color: "#ffffff", background: "var(--ew-forest)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--ew-sky)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--ew-forest)";
          }}
        >
          <span className="flex items-center gap-3">
            <Calculator size={16} />
            Calculate Moving Cost
          </span>
          <ArrowRight size={16} />
        </Link>

        {/* Secondary CTA */}
        <Link
          href="/cleaning"
          className="flex items-center justify-between no-underline font-['DM_Sans',sans-serif] text-[0.82rem] font-medium tracking-[0.08em] uppercase px-6 py-[18px] rounded-[4px] transition-[border-color,background] duration-300"
          style={{
            color: "var(--ew-forest)",
            background: "transparent",
            border: "1.5px solid rgba(51,63,54,0.15)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--ew-leaf)";
            el.style.background = "rgba(75,118,22,0.05)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(51,63,54,0.15)";
            el.style.background = "transparent";
          }}
        >
          Book a Cleaning
          <ArrowRight size={16} />
        </Link>

        {/* Tertiary CTA */}
        <Link
          href="/services"
          className="flex items-center justify-between no-underline font-['DM_Sans',sans-serif] text-[0.82rem] font-medium tracking-[0.08em] uppercase px-6 py-[18px] rounded-[4px] transition-[border-color] duration-300"
          style={{
            color: "var(--ew-forest)",
            background: "transparent",
            border: "1.5px solid rgba(51,63,54,0.15)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(51,63,54,0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(51,63,54,0.15)";
          }}
        >
          Browse All Services
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}