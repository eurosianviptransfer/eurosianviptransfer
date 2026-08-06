import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: React.ReactNode;
  subtitle?: string;
  badgeText?: string;
}

export const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
  subtitle,
  badgeText,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/95 to-slate-950/90 p-5 shadow-xl backdrop-blur-xl hover:border-amber-500/50 transition-all duration-300 group hover:-translate-y-1">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700/70 text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/40 transition-all shadow-md">
          {children}
        </div>

        <span
          className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-xl shadow-sm ${
            levelUp
              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
              : levelDown
              ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
              : "bg-slate-800 text-slate-200"
          }`}
        >
          {rate}
          {levelUp && <TrendingUp className="h-3.5 w-3.5 stroke-[2.5]" />}
          {levelDown && <TrendingDown className="h-3.5 w-3.5 stroke-[2.5]" />}
        </span>
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

