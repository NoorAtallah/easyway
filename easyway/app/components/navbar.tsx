"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

const SERVICES = [
  { name: "Moving", href: "/moving" },
  { name: "Landscaping", href: "/landscaping" },
  { name: "Cleaning", href: "/cleaning" },
  { name: "Pool Maintenance", href: "/pool" },
  { name: "Plumbing", href: "/plumbing" },
];

const NAV_LINKS = ["Home", "About", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const linkHref = (item: string) => (item === "Home" ? "/" : `/${item.toLowerCase()}`);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        border-b border-[#e8ecef]
        transition-all duration-500
        px-[52px]
        ${scrolled ? "py-2 shadow-sm" : "py-[14px]"}
      `}
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="no-underline flex items-center">
          <img src="/5.png" alt="EasyWay" className="h-9 w-auto object-contain" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((item) => (
            <Link
              key={item}
              href={linkHref(item)}
              className="
                font-['DM_Sans',sans-serif] text-[0.76rem] font-medium
                tracking-[0.14em] uppercase no-underline
                transition-colors duration-300 hover:text-[#1B6EB4]
              "
              style={{ color: "#333F36" }}
            >
              {item}
            </Link>
          ))}

          {/* Services dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="
                flex items-center gap-[5px]
                font-['DM_Sans',sans-serif] text-[0.76rem] font-medium
                tracking-[0.14em] uppercase
                bg-transparent border-none cursor-pointer p-0
                transition-colors duration-300 hover:text-[#1B6EB4]
              "
              style={{ color: dropdownOpen ? "#1B6EB4" : "#333F36" }}
            >
              Services
              <ChevronDown
                size={13}
                className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>

            {dropdownOpen && (
              <div
                className="
                  absolute top-[calc(100%+18px)] left-1/2 -translate-x-1/2
                  bg-white
                  border border-[#e8ecef] rounded-[6px]
                  p-2 min-w-[200px]
                  shadow-[0_8px_24px_rgba(0,0,0,0.1)]
                "
              >
                {SERVICES.map((s) => (
                  <Link
                    key={s.name}
                    href={s.href}
                    onClick={() => setDropdownOpen(false)}
                    className="
                      block font-['DM_Sans',sans-serif] text-[0.78rem] font-normal
                      tracking-[0.08em] no-underline
                      px-4 py-[10px] rounded-[4px]
                      transition-[background,color] duration-200
                      hover:bg-[#f4f6f8] hover:text-[#1B6EB4]
                    "
                    style={{ color: "#333F36" }}
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Call Now CTA */}
        <a
          href="tel:7734485995"
          className="
            hidden md:flex items-center gap-2
            font-['DM_Sans',sans-serif] text-[0.76rem] font-medium
            tracking-[0.1em] uppercase no-underline
            px-[22px] py-[10px] rounded-[3px]
            transition-[background,border-color,color] duration-300
            hover:bg-transparent hover:text-[#1B6EB4] hover:border-[#1B6EB4]
          "
          style={{
            color: "#ffffff",
            backgroundColor: "#1B6EB4",
            border: "1.5px solid #1B6EB4",
          }}
        >
          <Phone size={13} />
          (773) 448-5995
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden bg-transparent border-none cursor-pointer"
          style={{ color: "#333F36" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="
            md:hidden mt-4 flex flex-col gap-1 p-4 rounded-lg
            bg-white border border-[#e8ecef]
            shadow-[0_8px_24px_rgba(0,0,0,0.08)]
          "
        >
          <button
            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            className="
              flex items-center justify-between w-full
              font-['DM_Sans',sans-serif] text-[0.85rem] font-medium
              tracking-[0.12em] uppercase
              bg-transparent border-none cursor-pointer
              px-3 py-3 rounded-[4px]
            "
            style={{ color: "#333F36" }}
          >
            Services
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : "rotate-0"}`}
              style={{ color: "#1B6EB4" }}
            />
          </button>

          {mobileServicesOpen && (
            <div className="grid grid-cols-2 gap-[2px] px-2 pb-2 pt-1">
              {SERVICES.map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-['DM_Sans',sans-serif] text-[0.78rem] no-underline px-[10px] py-2 rounded-[3px] hover:text-[#1B6EB4]"
                  style={{ color: "#333F36" }}
                >
                  {s.name}
                </Link>
              ))}
            </div>
          )}

          {NAV_LINKS.map((item) => (
            <Link
              key={item}
              href={linkHref(item)}
              onClick={() => setMenuOpen(false)}
              className="
                font-['DM_Sans',sans-serif] text-[0.85rem] font-medium
                tracking-[0.12em] uppercase no-underline
                px-3 py-3 hover:text-[#1B6EB4]
              "
              style={{ color: "#333F36" }}
            >
              {item}
            </Link>
          ))}

          <a
            href="tel:7734485995"
            onClick={() => setMenuOpen(false)}
            className="
              flex items-center justify-center gap-2 mt-2
              font-['DM_Sans',sans-serif] text-[0.82rem] font-medium
              tracking-[0.1em] uppercase no-underline
              px-5 py-[13px] rounded-[3px]
            "
            style={{ color: "#ffffff", backgroundColor: "#1B6EB4" }}
          >
            <Phone size={13} />
            (773) 448-5995
          </a>
        </div>
      )}
    </nav>
  );
}