"use client";

import { useRef } from "react";
import { Star, ThumbsUp } from "lucide-react";

type Review = {
  id: string;
  name: string;
  avatar: string;
  service: string;
  rating: number;
  text: string;
  helpful: number;
  date_label: string;
};

const GOOGLE_G = (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
    <path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2c-7.6 0-14.2 4.5-17.7 11.1z" />
    <path fill="#FBBC05" d="M24 46c5.5 0 10.5-1.9 14.4-5l-6.7-5.5C29.5 37.1 26.9 38 24 38c-6 0-11.1-4-12.9-9.5l-7 5.4C7.9 41.6 15.4 46 24 46z" />
    <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.9 2.7-2.6 5-5 6.5l6.7 5.5C41.6 36.8 44.5 30.8 44.5 24c0-1.3-.2-2.7-.5-4z" />
  </svg>
);

const SERVICE_COLORS: Record<string, { bg: string; color: string }> = {
  Moving:      { bg: "rgba(27,110,180,0.1)",  color: "var(--ew-sky)" },
  Landscaping: { bg: "rgba(75,118,22,0.1)",   color: "var(--ew-leaf)" },
  Cleaning:    { bg: "rgba(27,110,180,0.1)",  color: "var(--ew-sky)" },
  Pool:        { bg: "rgba(27,110,180,0.12)", color: "var(--ew-sky)" },
  Plumbing:    { bg: "rgba(75,118,22,0.1)",   color: "var(--ew-leaf)" },
};

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= rating ? "#FBBC05" : "transparent"}
          stroke={i <= rating ? "#FBBC05" : "#dde3ea"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const tag = SERVICE_COLORS[review.service] ?? { bg: "rgba(51,63,54,0.08)", color: "var(--ew-forest)" };
  return (
    <div
className="flex flex-col gap-3 rounded-[10px] p-[24px_22px] w-[85vw] sm:w-[320px] lg:w-[300px] shrink-0 box-border h-[320px]"      style={{
        background: "var(--ew-bg)",
        border: "1px solid rgba(51,63,54,0.12)",
        borderLeft: "3px solid var(--ew-sky)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
            style={{ background: "var(--ew-forest)", color: "var(--ew-bg)" }}
          >
            {review.avatar}
          </div>
          <div>
            <p className="text-[14px] font-semibold m-0" style={{ color: "var(--ew-forest)" }}>
              {review.name}
            </p>
            <p className="text-[11px] text-[#9aa5b4] m-0">{review.date_label}</p>
          </div>
        </div>
        {GOOGLE_G}
      </div>

      {/* Stars + tag */}
      <div className="flex items-center justify-between">
        <StarRow rating={review.rating} />
        <span
          className="text-[11px] tracking-[0.08em] uppercase font-semibold px-[9px] py-[3px] rounded-[4px]"
          style={{ color: tag.color, background: tag.bg }}
        >
          {review.service}
        </span>
      </div>

      {/* Text — clamped with fade */}
      <div className="relative flex-1 overflow-hidden">
        <p className="text-[13px] leading-[1.72] font-normal m-0" style={{ color: "rgba(51,63,54,0.7)" }}>
          "{review.text}"
        </p>
        <div
          className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--ew-bg))" }}
        />
      </div>

      {/* Helpful */}
      <div className="flex items-center gap-1.5 pt-2.5 shrink-0" style={{ borderTop: "1px solid rgba(51,63,54,0.08)" }}>
        <ThumbsUp size={11} color="#9aa5b4" />
        <span className="text-[11px] text-[#9aa5b4]">{review.helpful} found this helpful</span>
      </div>
    </div>
  );
}

export default function ReviewsSectionClient({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollStart.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = scrollStart.current - (e.clientX - startX.current);
  };
  const stopDrag = () => {
    isDragging.current = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
      trackRef.current.style.userSelect = "";
    }
  };

  if (reviews.length === 0) return null;

  return (
    <section
      className="py-14 sm:py-20 lg:py-[110px]"
      style={{ background: "var(--ew-bg)" }}
    >
      {/* Header */}
      <div className="px-4 sm:px-8 lg:px-[52px] flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 sm:gap-8 mb-10 sm:mb-14">
        <div>
          <span
            className="text-[11px] tracking-[0.2em] uppercase font-semibold block mb-3.5"
            style={{ color: "var(--ew-leaf)" }}
          >
            Customer Reviews
          </span>
          <h2
            className="font-['Playfair_Display',serif] text-[clamp(1.9rem,5vw,3.4rem)] font-black leading-[1.1] tracking-[-0.03em] m-0"
            style={{ color: "var(--ew-forest)" }}
          >
            What Our Clients
            <br />
            <em className="italic" style={{ color: "var(--ew-sky)" }}>
              Are Saying
            </em>
          </h2>
        </div>

        {/* Rating box */}
        <div
          className="flex flex-col items-center gap-2 rounded-[10px] p-[20px_28px] min-w-[180px] sm:min-w-[200px] self-start sm:self-auto"
          style={{
            background: "var(--ew-bg)",
            border: "1px solid rgba(51,63,54,0.14)",
          }}
        >
          <div className="flex items-center gap-2">
            {GOOGLE_G}
            <span className="text-[13px] font-semibold" style={{ color: "var(--ew-forest)" }}>
              Google Reviews
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className="font-['Playfair_Display',serif] text-[2.4rem] font-black leading-none"
              style={{ color: "var(--ew-forest)" }}
            >
              4.9
            </span>
            <span className="text-[13px] text-[#9aa5b4] pb-0.5"> / 5</span>
          </div>
          <StarRow rating={5} size={15} />
          <p className="text-[11px] text-[#9aa5b4] m-0 text-center">
            Based on 240+ verified reviews
          </p>
        </div>
      </div>

      {/* Scroll track */}
      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-10 sm:w-[72px] z-[2] pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--ew-bg), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-10 sm:w-[72px] z-[2] pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--ew-bg), transparent)" }}
        />

        <div
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          className="flex gap-3 sm:gap-3.5 overflow-x-scroll overflow-y-hidden px-4 sm:px-[52px] pb-2 cursor-grab [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        >
          {reviews.map((r) => (
            <div key={r.id} className="snap-start">
              <ReviewCard review={r} />
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-[#9aa5b4] tracking-[0.1em] text-center mt-5 uppercase">
        Drag to scroll
      </p>
    </section>
  );
}