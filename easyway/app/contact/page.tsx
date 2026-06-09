"use client";

import { Phone, MapPin, Clock, ArrowRight, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

const CONTACT_ITEMS = [
  {
    icon: <Phone size={20} />,
    label: "Call or Text",
    value: "(773) 448-5995",
    sub: "We pick up. Real people, no robots.",
    href: "tel:7734485995",
    cta: "Call Now",
  },
  {
    icon: <MessageCircle size={20} />,
    label: "Send a Text",
    value: "SMS Welcome",
    sub: "Prefer to text? So do we.",
    href: "sms:7734485995",
    cta: "Text Us",
  },
  {
    icon: <Mail size={20} />,
    label: "Email Us",
    value: "hello@easyway.com",
    sub: "We reply within a few hours.",
    href: "mailto:hello@easyway.com",
    cta: "Send Email",
  },
];

const HOURS = [
  { day: "Monday – Friday", time: "7:00 AM – 7:00 PM" },
  { day: "Saturday", time: "8:00 AM – 5:00 PM" },
  { day: "Sunday", time: "Closed" },
];

export default function ContactPage() {
  return (
    <main style={{ background: "var(--ew-bg)" }}>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden py-24 lg:py-[130px] px-4 sm:px-8 lg:px-[52px]">
        <span className="pointer-events-none select-none absolute -top-4 right-0 font-['Playfair_Display',serif] text-[clamp(8rem,20vw,18rem)] font-black leading-none" style={{ color: "rgba(51,63,54,0.04)" }}>
          Hi
        </span>

        <div className="relative z-10 max-w-[680px]">
          <p className="font-['DM_Sans',sans-serif] text-[0.72rem] tracking-[0.2em] uppercase mb-5" style={{ color: "var(--ew-sky)" }}>
            Get in Touch
          </p>
          <h1 className="font-['Playfair_Display',serif] text-[clamp(2.6rem,7vw,5rem)] font-black leading-[1.05] tracking-[-0.03em] mb-8" style={{ color: "var(--ew-forest)" }}>
            Let's talk about{" "}
            <br />
            <em className="italic" style={{ color: "var(--ew-leaf)" }}>your home.</em>
          </h1>
          <p className="font-['DM_Sans',sans-serif] text-[1rem] leading-[1.85] font-light max-w-[480px]" style={{ color: "rgba(51,63,54,0.65)" }}>
            No contact forms. No ticketing systems. Just reach out directly and someone from our team will get back to you fast.
          </p>
        </div>

        <div className="mt-14 h-px w-full" style={{ background: "rgba(51,63,54,0.12)" }} />
      </section>

      {/* ─── CONTACT CARDS + MAP ─── */}
      <section className="grid lg:grid-cols-2 gap-px px-0" style={{ background: "rgba(51,63,54,0.1)" }}>

        {/* Left — contact options */}
        <div className="flex flex-col gap-px" style={{ background: "rgba(51,63,54,0.1)" }}>

          {/* Contact cards */}
          {CONTACT_ITEMS.map((item) => (
            <div
              key={item.label}
              className="group flex items-center justify-between gap-6 px-8 py-8 lg:px-12 transition-colors duration-300 hover:bg-[var(--ew-forest)]"
              style={{ background: "var(--ew-bg)" }}
            >
              <div className="flex items-center gap-5">
                <div
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-[4px] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    color: "var(--ew-sky)",
                    background: "rgba(27,110,180,0.08)",
                    border: "1.5px solid rgba(27,110,180,0.25)",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-['DM_Sans',sans-serif] text-[0.7rem] tracking-[0.15em] uppercase mb-0.5 transition-colors duration-300 group-hover:text-white/50" style={{ color: "rgba(51,63,54,0.45)" }}>
                    {item.label}
                  </p>
                  <p className="font-['Playfair_Display',serif] text-[1.1rem] font-bold transition-colors duration-300 group-hover:text-white" style={{ color: "var(--ew-forest)" }}>
                    {item.value}
                  </p>
                  <p className="font-['DM_Sans',sans-serif] text-[0.75rem] font-light mt-0.5 transition-colors duration-300 group-hover:text-white/55" style={{ color: "rgba(51,63,54,0.5)" }}>
                    {item.sub}
                  </p>
                </div>
              </div>

              <a
                href={item.href}
                className="flex-shrink-0 inline-flex items-center gap-2 font-['DM_Sans',sans-serif] text-[0.7rem] tracking-[0.14em] uppercase no-underline px-5 py-2.5 rounded-[3px] transition-all duration-300 group-hover:border-white/30 group-hover:text-white"
                style={{ color: "var(--ew-forest)", border: "1.5px solid rgba(51,63,54,0.2)" }}
              >
                {item.cta} <ArrowRight size={12} />
              </a>
            </div>
          ))}

          {/* Hours */}
          <div className="px-8 py-8 lg:px-12" style={{ background: "var(--ew-bg)" }}>
            <div className="flex items-center gap-3 mb-5">
              <Clock size={16} style={{ color: "var(--ew-sky)" }} />
              <p className="font-['DM_Sans',sans-serif] text-[0.7rem] tracking-[0.18em] uppercase" style={{ color: "rgba(51,63,54,0.45)" }}>
                Hours of Operation
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {HOURS.map((h) => (
                <div key={h.day} className="flex items-center justify-between">
                  <span className="font-['DM_Sans',sans-serif] text-[0.85rem] font-light" style={{ color: "rgba(51,63,54,0.7)" }}>
                    {h.day}
                  </span>
                  <span
                    className="font-['DM_Sans',sans-serif] text-[0.85rem] font-medium"
                    style={{ color: h.time === "Closed" ? "rgba(51,63,54,0.3)" : "var(--ew-forest)" }}
                  >
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — map */}
        <div className="relative h-[360px] lg:h-auto min-h-[420px]" style={{ background: "var(--ew-bg)" }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2974.4!2d-87.6565!3d41.8093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e318b2a4a0a0f%3A0x1a2b3c4d5e6f7a8b!2sChicago%2C%20IL!5e0!3m2!1sen!2sus!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(30%) contrast(1.05)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full"
          />

          {/* Map overlay card */}
          <div className="absolute bottom-5 left-5 right-5 lg:left-6 lg:right-6 lg:bottom-6">
            <a
              href="https://maps.app.goo.gl/f7Z5eWMk2Rwfmz1Z7"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 no-underline px-5 py-4 rounded-[3px] transition-colors duration-300 hover:bg-[var(--ew-forest)]"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(51,63,54,0.12)",
              }}
            >
              <div
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-[4px]"
                style={{ color: "var(--ew-sky)", background: "rgba(27,110,180,0.1)", border: "1.5px solid rgba(27,110,180,0.2)" }}
              >
                <MapPin size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Playfair_Display',serif] text-[0.95rem] font-bold truncate transition-colors duration-300 group-hover:text-white" style={{ color: "var(--ew-forest)" }}>
                  Find Us on Google Maps
                </p>
                <p className="font-['DM_Sans',sans-serif] text-[0.72rem] font-light truncate transition-colors duration-300 group-hover:text-white/60" style={{ color: "rgba(51,63,54,0.5)" }}>
                  Tap to get directions
                </p>
              </div>
              <ArrowRight size={14} className="flex-shrink-0 transition-colors duration-300 group-hover:text-white/60" style={{ color: "rgba(51,63,54,0.3)" }} />
            </a>
          </div>
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

        <div className="relative z-10 max-w-[460px]">
          <h2 className="font-['Playfair_Display',serif] text-[clamp(1.8rem,4vw,2.8rem)] font-black leading-[1.1] tracking-[-0.025em] text-white mb-3">
            Rather get an{" "}
            <em className="italic" style={{ color: "var(--ew-sky)" }}>instant quote?</em>
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-[0.88rem] leading-[1.8] font-light text-white/60">
            Skip the conversation and get your price in under two minutes.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/services"
            className="inline-flex items-center gap-2.5 font-['DM_Sans',sans-serif] text-[0.75rem] font-medium tracking-[0.14em] uppercase no-underline px-8 py-[13px] rounded-[3px] transition-[background] duration-300"
            style={{ background: "var(--ew-sky)", color: "#ffffff", border: "1.5px solid var(--ew-sky)" }}
          >
            Get a Quote <ArrowRight size={14} />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2.5 font-['DM_Sans',sans-serif] text-[0.75rem] font-medium tracking-[0.14em] uppercase no-underline px-8 py-[13px] rounded-[3px]"
            style={{ color: "rgba(255,255,255,0.75)", border: "1.5px solid rgba(255,255,255,0.25)" }}
          >
            About Us
          </Link>
        </div>
      </section>

    </main>
  );
}