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
      className="p-[52px] flex items-center justify-between flex-wrap gap-6 border-t"
      style={{
        backgroundColor: "#1a2e35",
        borderColor: "rgba(255,246,246,0.06)",
      }}
    >
      {/* Logo */}
      <div className="font-['Playfair_Display',serif] text-[1.3rem] font-black text-[#FFF6F6]">
        Easy<span className="text-[#8CC7C4]">Way</span>
      </div>

      {/* Links */}
      <div className="flex gap-7 flex-wrap">
        {LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="font-['DM_Sans',sans-serif] text-[0.72rem] tracking-[0.1em] uppercase no-underline transition-colors duration-300 hover:text-[#8CC7C4]"
            style={{ color: "rgba(255,246,246,0.35)" }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Copyright */}
      <div
        className="font-['DM_Sans',sans-serif] text-[0.7rem] tracking-[0.06em]"
        style={{ color: "rgba(255,246,246,0.25)" }}
      >
        &copy; {new Date().getFullYear()} EasyWay Inc. All rights reserved.
      </div>
    </footer>
  );
}