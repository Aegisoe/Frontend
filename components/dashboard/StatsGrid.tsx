"use client";

import { motion } from "framer-motion";

interface StatItem {
  label: string;
  value: string | number;
  note?: string;
  noteType?: "up" | "warn" | "normal";
  icon: string;
  iconBg: string;
  valueStyle?: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.05 }}
          className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[17px] py-[15px] transition-[border-color] duration-150 hover:border-[var(--border2)]"
        >
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium text-[var(--text2)]">
              {stat.label}
            </span>
            <div className={`flex h-[26px] w-[26px] items-center justify-center rounded-[6px] text-xs ${stat.iconBg}`}>
              {stat.icon}
            </div>
          </div>
          <div className={`font-mono text-[27px] font-bold leading-none ${stat.valueStyle ?? "text-[var(--text)]"}`}>
            {stat.value}
          </div>
          {stat.note && (
            <div className={`mt-1 font-mono text-[11px] ${
              stat.noteType === "up" ? "text-[var(--green)]" :
              stat.noteType === "warn" ? "text-[var(--red)]" :
              "text-[var(--text3)]"
            }`}>
              {stat.note}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
