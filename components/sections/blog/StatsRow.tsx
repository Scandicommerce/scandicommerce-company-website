"use client";

import type { StatsRowBlock } from "@/lib/blogBuilder";

interface StatsRowProps {
  block: StatsRowBlock;
}

export default function StatsRow({ block }: StatsRowProps) {
  const stats = (block.stats ?? []).filter(
    (s) => s && (s.value != null || s.label != null)
  );
  if (stats.length === 0) return null;

  return (
    <section className="my-8 md:my-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-gray-50 border border-black rounded-b overflow-hidden"
          >
            <div className="h-[3px] bg-gradient-to-r from-cyan-400 to-purple-500" />
            <div className="p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#1F1D1D]">
                {stat.value ?? "—"}
              </div>
              <div className="mt-2 text-xs md:text-sm font-medium uppercase tracking-wide text-[#1F1D1D]">
                {stat.label ?? ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
