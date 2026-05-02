"use client";

import { useState, useTransition } from "react";
import {
  ArrowRight, MapPin, Building2, Home, Maximize2, User, Mail, Phone,
  CheckCircle, ShieldCheck, Star, Clock,
} from "lucide-react";
import { submitLandscapingQuote } from "./actions";
import type { JobSize } from "@/types/landscaping";

function Field({
  icon, label, name, value, onChange, placeholder = "", type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[11px] tracking-[0.12em] uppercase font-bold"
        style={{ color: "rgba(51,63,54,0.6)" }}
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex" style={{ color: "#9aa5b4" }}>
          {icon}
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full py-[11px] pr-3 pl-9 rounded text-sm font-['DM_Sans',sans-serif] outline-none box-border transition-colors duration-150"
          style={{
            background: "#fafbfc",
            border: "1.5px solid rgba(51,63,54,0.15)",
            color: "var(--ew-forest)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ew-sky)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(51,63,54,0.15)")}
        />
      </div>
    </div>
  );
}

export default function LandscapingForm({ jobSizes }: { jobSizes: JobSize[] }) {
  const [form, setForm] = useState({
    zipCode: "", city: "", address: "",
    jobSizeId: "",
    firstName: "", lastName: "",
    email: "", phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [jobSizeOpen, setJobSizeOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedJobSize = jobSizes.find((s) => s.id === form.jobSizeId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await submitLandscapingQuote(form);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <main
      className="min-h-screen font-['DM_Sans',sans-serif] pt-[72px]"
      style={{ background: "var(--ew-bg)" }}
    >
      {/* Hero banner */}
      <div
        className="px-4 sm:px-8 lg:px-[52px] pt-14 pb-12"
        style={{
          background: "var(--ew-forest)",
          borderBottom: "3px solid var(--ew-sky)",
        }}
      >
        <p
          className="text-[11px] tracking-[0.2em] uppercase font-semibold mb-3.5"
          style={{ color: "var(--ew-leaf)" }}
        >
          Landscaping Services
        </p>
        <h1
          className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[1.1] tracking-[-0.03em] m-0"
          style={{ color: "#ffffff" }}
        >
          Your Yard,{" "}
          <em className="italic" style={{ color: "var(--ew-sky)" }}>
            Reimagined.
          </em>
        </h1>
        <p
          className="mt-4 text-[15px] max-w-[480px] leading-[1.7]"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          From lawn care to full garden design — lasting beauty outdoors.
          Fill in your details and we'll respond with sizing and pricing within the hour.
        </p>
      </div>

      {/* Trust bar */}
      <div
        className="px-4 sm:px-8 lg:px-[52px] py-2.5 flex gap-5 sm:gap-7 flex-wrap"
        style={{ background: "rgba(51,63,54,0.92)" }}
      >
        {["Licensed & insured", "4.9 stars · 1,800+ reviews", "BBB accredited", "Free on-site estimates"].map((t) => (
          <div key={t} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--ew-leaf)" }} />
            {t}
          </div>
        ))}
      </div>

      {/* Form area */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-10 pb-20">
        <div
          className="rounded-[6px] overflow-hidden"
          style={{ background: "var(--ew-bg)", border: "1px solid rgba(51,63,54,0.12)" }}
        >
          {/* Form header */}
          <div
            className="px-7 py-4 flex items-center justify-between"
            style={{ background: "var(--ew-forest)" }}
          >
            <h2 className="text-base font-bold text-white m-0">Get your free quote</h2>
            <span
              className="text-[11px] font-extrabold px-2.5 py-[3px] rounded-[3px] tracking-[0.07em]"
              style={{ background: "var(--ew-leaf)", color: "#ffffff" }}
            >
              FREE
            </span>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 px-7 py-16 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(75,118,22,0.1)" }}
              >
                <CheckCircle size={28} strokeWidth={1.8} style={{ color: "var(--ew-leaf)" }} />
              </div>
              <h2
                className="font-['Playfair_Display',Georgia,serif] text-[1.7rem] font-bold m-0"
                style={{ color: "var(--ew-forest)" }}
              >
                Request received!
              </h2>
              <p className="text-sm max-w-[380px] leading-[1.7]" style={{ color: "rgba(51,63,54,0.6)" }}>
                We'll review your job details and send a quote with small, medium,
                and large options to{" "}
                <strong style={{ color: "var(--ew-forest)" }}>{form.email}</strong>.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ zipCode: "", city: "", address: "", jobSizeId: "", firstName: "", lastName: "", email: "", phone: "" });
                }}
                className="px-6 py-2.5 rounded text-[13px] cursor-pointer font-['DM_Sans',sans-serif] transition-colors duration-200"
                style={{
                  border: "1.5px solid rgba(51,63,54,0.15)",
                  background: "var(--ew-bg)",
                  color: "rgba(51,63,54,0.7)",
                }}
              >
                Submit another
              </button>
            </div>
          ) : (
            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-4">

                <Field icon={<MapPin size={15} />} label="Job zip code"
                  name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="e.g. 60601" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field icon={<Building2 size={15} />} label="City"
                    name="city" value={form.city} onChange={handleChange} placeholder="Chicago" />
                  <Field icon={<Home size={15} />} label="Address"
                    name="address" value={form.address} onChange={handleChange} placeholder="123 Main St" />
                </div>

                {/* Job size dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[11px] tracking-[0.12em] uppercase font-bold"
                    style={{ color: "rgba(51,63,54,0.6)" }}
                  >
                    Job size
                  </label>
                  <div className="relative">
                    <Maximize2
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-[1]"
                      style={{ color: "#9aa5b4" }}
                    />
                    <div
                      onClick={() => setJobSizeOpen(!jobSizeOpen)}
                      className={`px-9 py-[11px] cursor-pointer select-none transition-colors duration-150 flex items-center text-sm ${jobSizeOpen ? "rounded-t" : "rounded"}`}
                      style={{
                        background: "#fafbfc",
                        border: `1.5px solid ${jobSizeOpen ? "var(--ew-sky)" : "rgba(51,63,54,0.15)"}`,
                        color: selectedJobSize ? "var(--ew-forest)" : "#9aa5b4",
                      }}
                    >
                      {selectedJobSize
                        ? `${selectedJobSize.label} — ${selectedJobSize.description}`
                        : "Select size"}
                    </div>
                    <svg
                      width="12" height="12" viewBox="0 0 12 12"
                      className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${jobSizeOpen ? "rotate-180" : "rotate-0"}`}
                      fill="none" stroke="#9aa5b4" strokeWidth="1.5"
                    >
                      <path d="M2 4l4 4 4-4" />
                    </svg>
                    {jobSizeOpen && (
                      <div
                        className="absolute top-full left-0 right-0 rounded-b z-50 overflow-hidden"
                        style={{
                          background: "var(--ew-bg)",
                          border: "1.5px solid var(--ew-sky)",
                          borderTop: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                      >
                        {jobSizes.map(({ id, label, description }) => (
                          <div
                            key={id}
                            onClick={() => { setForm({ ...form, jobSizeId: id }); setJobSizeOpen(false); }}
                            className="px-4 py-3 flex items-baseline gap-2.5 text-sm cursor-pointer transition-colors duration-100"
                            style={{
                              color: form.jobSizeId === id ? "var(--ew-forest)" : "rgba(51,63,54,0.8)",
                              fontWeight: form.jobSizeId === id ? 600 : 400,
                              background: form.jobSizeId === id ? "rgba(75,118,22,0.08)" : "transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (form.jobSizeId !== id)
                                (e.currentTarget as HTMLElement).style.background = "rgba(27,110,180,0.05)";
                            }}
                            onMouseLeave={(e) => {
                              if (form.jobSizeId !== id)
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                          >
                            {label}
                            <span className="text-xs font-normal" style={{ color: "#9aa5b4" }}>
                              {description}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs m-0 leading-[1.5]" style={{ color: "#9aa5b4" }}>
                    Not sure? We'll provide options for small, medium, and large.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field icon={<User size={15} />} label="First name"
                    name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" />
                  <Field icon={<User size={15} />} label="Last name"
                    name="lastName" value={form.lastName} onChange={handleChange} placeholder="Smith" />
                </div>

                <Field icon={<Mail size={15} />} label="Email" name="email" type="email"
                  value={form.email} onChange={handleChange} placeholder="you@example.com" />

                <Field icon={<Phone size={15} />} label="Phone number" name="phone" type="tel"
                  value={form.phone} onChange={handleChange} placeholder="(773) 000-0000" />

                <hr className="border-none h-px my-1" style={{ background: "rgba(51,63,54,0.08)" }} />

                {error && (
                  <div className="rounded px-4 py-3 text-sm" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 py-[15px] px-8 rounded text-[15px] font-extrabold tracking-[0.03em] font-['DM_Sans',sans-serif] cursor-pointer w-full border-none transition-opacity duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "var(--ew-forest)", color: "#ffffff" }}
                  onMouseEnter={(e) => {
                    if (!isPending) (e.currentTarget as HTMLElement).style.background = "var(--ew-sky)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--ew-forest)";
                  }}
                >
                  {isPending ? "Sending..." : <>Get My Free Quote <ArrowRight size={15} /></>}
                </button>

                <p className="text-xs text-center leading-[1.5]" style={{ color: "#9aa5b4" }}>
                  No commitment required. We'll respond within 60 minutes during business hours.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          {[
            { icon: <ShieldCheck size={18} strokeWidth={1.8} />, title: "Licensed & insured", sub: "Full coverage on every job we take" },
            { icon: <Clock size={18} strokeWidth={1.8} />, title: "Same-week availability", sub: "Fast scheduling, flexible timing" },
            { icon: <Star size={18} strokeWidth={1.8} />, title: "4.9-star rated", sub: "Over 1,800 verified customer reviews" },
          ].map(({ icon, title, sub }) => (
            <div
              key={title}
              className="rounded-[6px] p-4 text-center"
              style={{ background: "var(--ew-bg)", border: "1px solid rgba(51,63,54,0.12)" }}
            >
              <div
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center mx-auto mb-2.5"
                style={{ background: "rgba(75,118,22,0.1)", color: "var(--ew-forest)" }}
              >
                {icon}
              </div>
              <p className="text-[13px] font-bold mb-1" style={{ color: "var(--ew-forest)" }}>{title}</p>
              <p className="text-xs leading-[1.5]" style={{ color: "rgba(51,63,54,0.55)" }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}