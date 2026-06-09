"use client";
import Link from "next/link";

const LINKS = [
  { label: "Moving", href: "/moving" },
  { label: "Landscaping", href: "/landscaping" },
  { label: "Cleaning", href: "/cleaning" },
  { label: "Pool Care", href: "/pool" },
];

export default function Footer() {
  return (
    <footer
      className="px-[52px] py-10 flex items-center justify-between flex-wrap gap-6 border-t"
      style={{
        background: "var(--ew-forest)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="no-underline flex items-center gap-3">
        <img src="/12.png" alt="EasyWay" className="h-8 w-auto object-contain" />
      
      </Link>

      {/* Links */}
      <div className="flex gap-7 flex-wrap">
        {LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="font-['DM_Sans',sans-serif] text-[0.72rem] tracking-[0.1em] uppercase no-underline transition-colors duration-300 hover:text-white"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Copyright */}
      <div
        className="font-['DM_Sans',sans-serif] text-[0.7rem] tracking-[0.06em]"
        style={{ color: "rgba(255,255,255,0.25)" }}
      >
        &copy; {new Date().getFullYear()} EasyWay Inc. All rights reserved.
      </div>
    </footer>
  );
}