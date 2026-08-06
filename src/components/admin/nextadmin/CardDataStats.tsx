import React, { ReactNode } from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
  subtitle?: string;
  badgeText?: string;
}

export const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  children,
  subtitle,
  badgeText,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
      {/* CARD HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-inner group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
          {children}
        </div>

        {badgeText && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-700 border border-slate-200 shadow-xs">
            {badgeText}
          </span>
        )}
      </div>

      {/* CARD MAIN CONTENT */}
      <div className="mt-5">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="mt-1.5 flex items-baseline justify-between gap-2">
          <h4 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-sans">
            {total}
          </h4>
          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-600 border border-emerald-200 shadow-xs">
            {rate}
          </span>
        </div>

        {subtitle && (
          <p className="mt-2 text-xs font-semibold text-slate-500 truncate">
            {subtitle}
          </p>
        )}
      </div>

      {/* AMBIENT GLOW */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/5 blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-all" />
    </div>
  );
};
