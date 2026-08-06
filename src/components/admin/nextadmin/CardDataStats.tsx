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
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 group">
      {/* CARD HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
          {children}
        </div>

      </div>

      {/* Content */}
      <div className="mt-5">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1">
          {title}
        </span>
        <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
          {total}
        </h4>
        {subtitle && (
          <p className="text-xs text-slate-300 mt-1 font-semibold">{subtitle}</p>
        )}
      </div>

      {/* Footer Badge */}
      {badgeText && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold">
          <span className="text-slate-300">{badgeText}</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </div>
      )}

      {/* Ambient Corner Glow */}
      <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl group-hover:bg-amber-500/15 transition-all pointer-events-none" />
    </div>
  );
};

