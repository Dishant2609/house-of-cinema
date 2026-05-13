import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionRowProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accentColor?: "gold" | "crimson" | "purple";
}

export default function SectionRow({ title, subtitle, children, accentColor = "gold" }: SectionRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  const accentClass = {
    gold: "text-[#c4843a]",
    crimson: "text-[#e74c3c]",
    purple: "text-purple-400",
  }[accentColor];

  const borderClass = {
    gold: "border-[#c4843a]",
    crimson: "border-[#e74c3c]",
    purple: "border-purple-400",
  }[accentColor];

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-1 h-6 rounded-full ${borderClass.replace("border-", "bg-")}`} />
              <h2 className={`font-cinzel text-xl md:text-2xl font-bold ${accentClass}`}>{title}</h2>
            </div>
            {subtitle && (
              <p className="font-inter text-sm text-[#4a4558] ml-4">{subtitle}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-[#9a9098] hover:text-[#c4843a] hover:border-[#c4843a]/30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-[#9a9098] hover:text-[#c4843a] hover:border-[#c4843a]/30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-2"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
