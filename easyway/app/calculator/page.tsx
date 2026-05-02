"use client";

import { useState } from "react";
import { ArrowRight, ShoppingCart, X, Plus, Minus } from "lucide-react";

const SECTIONS = [
  {
    name: "Bedroom",
    items: [
      { name: "King bed", cuft: 70, img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
      { name: "Queen bed", cuft: 60, img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80" },
      { name: "Twin bed", cuft: 40, img: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80" },
      { name: "Nightstand", cuft: 10, img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80" },
      { name: "Dresser", cuft: 25, img: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=400&q=80" },
      { name: "Wardrobe", cuft: 35, img: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400&q=80" },
    ],
  },
  {
    name: "Living room",
    items: [
      { name: "Sofa", cuft: 30, img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
      { name: "Armchair", cuft: 15, img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80" },
      { name: "Coffee table", cuft: 20, img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&q=80" },
      { name: 'TV (50")', cuft: 10, img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80" },
      { name: "TV stand", cuft: 20, img: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=400&q=80" },
      { name: "Bookcase", cuft: 25, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    ],
  },
  {
    name: "Kitchen",
    items: [
      { name: "Dining table", cuft: 35, img: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&q=80" },
      { name: "Chair", cuft: 10, img: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80" },
      { name: "Microwave", cuft: 8, img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80" },
      { name: "Refrigerator", cuft: 45, img: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80" },
      { name: "Stove/oven", cuft: 40, img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" },
    ],
  },
  {
    name: "Office",
    items: [
      { name: "Desk", cuft: 25, img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80" },
      { name: "Office chair", cuft: 12, img: "https://images.unsplash.com/photo-1589884629038-b631346a23c0?w=400&q=80" },
      { name: "Filing cabinet", cuft: 15, img: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&q=80" },
      { name: "Bookshelf", cuft: 20, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
      { name: "Monitor", cuft: 5, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80" },
    ],
  },
  {
    name: "Boxes",
    items: [
      { name: "Large box", cuft: 15, img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80" },
      { name: "Medium box", cuft: 10, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
      { name: "Small box", cuft: 5, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
    ],
  },
  {
    name: "Garage",
    items: [
      { name: "Toolbox", cuft: 12, img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&q=80" },
      { name: "Bike", cuft: 20, img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80" },
      { name: "Shelving unit", cuft: 25, img: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400&q=80" },
      { name: "Lawn mower", cuft: 35, img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
      { name: "Grill", cuft: 30, img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80" },
    ],
  },
];

type Counts = Record<string, number>;

function getEstimate(cuft: number) {
  if (cuft === 0) return null;
  if (cuft <= 200) return { truck: "Small (10 ft)", hours: "2–3 hrs", price: "$299–$399" };
  if (cuft <= 500) return { truck: "Medium (16 ft)", hours: "3–5 hrs", price: "$449–$599" };
  if (cuft <= 900) return { truck: "Large (20 ft)", hours: "5–7 hrs", price: "$649–$849" };
  return { truck: "XL (26 ft)", hours: "7–10 hrs", price: "$899–$1,199" };
}

export default function MovingCalculator() {
  const [counts, setCounts] = useState<Counts>({});
  const [activeSection, setActiveSection] = useState("Bedroom");
  const [cartOpen, setCartOpen] = useState(false);

  const inc = (key: string) => setCounts((c) => ({ ...c, [key]: (c[key] || 0) + 1 }));
  const dec = (key: string) => setCounts((c) => ({ ...c, [key]: Math.max(0, (c[key] || 0) - 1) }));

  const totalCuft = SECTIONS.flatMap((s) =>
    s.items.map((item) => (counts[`${s.name}__${item.name}`] || 0) * item.cuft)
  ).reduce((a, b) => a + b, 0);

  const totalItems = Object.values(counts).reduce((a, b) => a + b, 0);
  const estimate = getEstimate(totalCuft);
  const currentSection = SECTIONS.find((s) => s.name === activeSection)!;

  return (
    <main className="min-h-screen bg-[#F7F8F6] font-['DM_Sans',sans-serif] pt-[72px]">

      {/* Top bar */}
      <div className="flex items-start justify-between px-12 pt-8">
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#9CA3A0] font-medium m-0 mb-1.5">
            Moving calculator
          </p>
          <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(1.6rem,3vw,2.2rem)] font-bold text-[#1A1F1E] leading-[1.15] tracking-[-0.02em] m-0">
            What are you <em className="italic text-[#1D9E75]">taking?</em>
          </h1>
        </div>

        <button
          onClick={() => setCartOpen(true)}
          className={`
            flex items-center gap-2 px-[18px] py-2.5 rounded-lg text-[13px] font-medium
            font-['DM_Sans',sans-serif] whitespace-nowrap transition-all duration-200 cursor-pointer
            ${totalItems > 0
              ? "border border-[#1D9E75] bg-[#1D9E75] text-white"
              : "border border-[#E0E5E3] bg-white text-[#6B7775]"
            }
          `}
        >
          <ShoppingCart size={15} />
          {totalItems > 0
            ? `${totalItems} item${totalItems !== 1 ? "s" : ""} · ${totalCuft} cu.ft`
            : "Your move list"}
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex px-12 pt-6 border-b border-[#E8EDEB] overflow-x-auto gap-0">
        {SECTIONS.map((s) => {
          const sectionCount = s.items.reduce(
            (a, item) => a + (counts[`${s.name}__${item.name}`] || 0), 0
          );
          const active = s.name === activeSection;
          return (
            <button
              key={s.name}
              onClick={() => setActiveSection(s.name)}
              className={`
                flex items-center gap-[7px] px-[18px] py-2.5 -mb-px
                bg-transparent border-none border-b-2 whitespace-nowrap
                text-[13px] font-['DM_Sans',sans-serif] cursor-pointer
                transition-[color,border-color] duration-150
                ${active
                  ? "border-b-[#1D9E75] text-[#1A1F1E] font-medium"
                  : "border-b-transparent text-[#8A9693] font-normal"
                }
              `}
            >
              {s.name}
              {sectionCount > 0 && (
                <span className="bg-[#E1F5EE] text-[#0F6E56] text-[11px] font-medium rounded-full px-[7px] py-px">
                  {sectionCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Image cards grid */}
      <div className="px-12 pt-7 pb-24 grid gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}
      >
        {currentSection.items.map((item) => {
          const key = `${activeSection}__${item.name}`;
          const count = counts[key] || 0;

          return (
            <div
              key={item.name}
              className={`
                rounded-xl overflow-hidden bg-white transition-[border-color] duration-200
                ${count > 0
                  ? "border-[1.5px] border-[#1D9E75]"
                  : "border border-[#E8EDEB] hover:border-[#C5D4CF]"
                }
              `}
            >
              {/* Photo */}
              <div
                className="relative h-[145px] bg-cover bg-center"
                style={{ backgroundImage: `url('${item.img}')` }}
              >
                <div className={`absolute inset-0 transition-colors duration-200 ${count > 0 ? "bg-[rgba(29,158,117,0.06)]" : "bg-black/[0.06]"}`} />
                {count > 0 && (
                  <div className="absolute top-2 right-2 bg-[#1D9E75] text-white text-xs font-medium w-[26px] h-[26px] rounded-full flex items-center justify-center">
                    {count}
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="px-3.5 pt-3 pb-3.5">
                <p className="m-0 mb-0.5 text-sm font-medium text-[#1A1F1E]">{item.name}</p>
                <p className="m-0 mb-3 text-xs text-[#9CA3A0]">{item.cuft} cu.ft</p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => dec(key)}
                    className={`
                      w-[30px] h-[30px] rounded-md border border-[#E0E5E3] flex items-center justify-center
                      transition-all duration-150
                      ${count > 0 ? "bg-[#F4F7F5] text-[#4A5753] cursor-pointer" : "bg-transparent text-[#C5D4CF] cursor-default"}
                    `}
                  >
                    <Minus size={12} />
                  </button>

                  <span className={`text-[15px] font-medium min-w-6 text-center transition-colors duration-200 ${count > 0 ? "text-[#1D9E75]" : "text-[#D0D9D6]"}`}>
                    {count}
                  </span>

                  <button
                    onClick={() => inc(key)}
                    className="w-[30px] h-[30px] rounded-md border border-[#9FE1CB] bg-[#E1F5EE] text-[#0F6E56] flex items-center justify-center cursor-pointer transition-colors duration-150 hover:bg-[#9FE1CB]"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart drawer */}
      {cartOpen && (
        <>
          <div
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/25 z-[100]"
          />
          <div className="fixed top-0 right-0 bottom-0 w-[380px] bg-white border-l border-[#E8EDEB] z-[101] flex flex-col px-6 py-7 overflow-y-auto">

            {/* Drawer header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.3rem] font-bold text-[#1A1F1E] m-0">
                Your move list
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="bg-transparent border-none text-[#9CA3A0] cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            {totalItems === 0 ? (
              <p className="text-[#9CA3A0] text-sm leading-relaxed">
                No items added yet. Go back and select what you're moving.
              </p>
            ) : (
              <>
                {/* Item rows */}
                <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
                  {SECTIONS.map((s) =>
                    s.items
                      .filter((item) => (counts[`${s.name}__${item.name}`] || 0) > 0)
                      .map((item) => {
                        const key = `${s.name}__${item.name}`;
                        const count = counts[key];
                        return (
                          <div key={key} className="flex items-center gap-2.5 p-2.5 bg-[#F7F8F6] rounded-lg">
                            <div
                              className="w-[42px] h-[42px] rounded-md shrink-0 bg-cover bg-center"
                              style={{ backgroundImage: `url('${item.img}')` }}
                            />
                            <div className="flex-1">
                              <p className="m-0 text-[13px] text-[#1A1F1E] font-medium">{item.name}</p>
                              <p className="m-0 mt-0.5 text-[11px] text-[#9CA3A0]">
                                {item.cuft} × {count} = {item.cuft * count} cu.ft
                              </p>
                            </div>
                            <div className="flex items-center gap-[5px]">
                              <button onClick={() => dec(key)} className="w-[22px] h-[22px] rounded border border-[#E0E5E3] bg-white text-[#6B7775] cursor-pointer flex items-center justify-center">
                                <Minus size={10} />
                              </button>
                              <span className="text-[13px] font-medium text-[#1D9E75] min-w-[14px] text-center">
                                {count}
                              </span>
                              <button onClick={() => inc(key)} className="w-[22px] h-[22px] rounded border border-[#9FE1CB] bg-[#E1F5EE] text-[#0F6E56] cursor-pointer flex items-center justify-center">
                                <Plus size={10} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>

                {/* Estimate panel */}
                <div className="mt-4 p-4 bg-[#F7F8F6] rounded-xl">
                  {[
                    { label: "Total volume", value: `${totalCuft} cu.ft` },
                    ...(estimate ? [
                      { label: "Truck size", value: estimate.truck },
                      { label: "Est. time", value: estimate.hours },
                    ] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between mb-2">
                      <span className="text-xs text-[#9CA3A0]">{label}</span>
                      <span className="text-[13px] text-[#1A1F1E] font-medium">{value}</span>
                    </div>
                  ))}
                  {estimate && (
                    <div className="flex justify-between pt-2.5 border-t border-[#E8EDEB]">
                      <span className="text-xs text-[#9CA3A0]">Est. price</span>
                      <span className="text-xl font-bold text-[#1D9E75]">{estimate.price}</span>
                    </div>
                  )}
                </div>

                <button className="mt-3 flex items-center justify-center gap-2 w-full px-5 py-[13px] bg-[#1D9E75] hover:bg-[#0F6E56] border-none rounded-lg text-white text-[13px] font-medium font-['DM_Sans',sans-serif] cursor-pointer transition-colors duration-200">
                  Book this move <ArrowRight size={14} />
                </button>

                <p className="mt-2.5 text-[11px] text-[#9CA3A0] text-center leading-relaxed">
                  Estimates are approximate. Final price confirmed on booking.
                </p>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}