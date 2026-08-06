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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md hover:border-slate-700/80 transition-all duration-300 group">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/50 text-amber-400 group-hover:scale-110 group-hover:border-amber-500/40 transition-all">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <h4 className="text-2xl font-black text-white tracking-tight">
            {total}
          </h4>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-1 font-medium">{subtitle}</p>
          )}
        </div>

        <span
          className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
            levelUp
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : levelDown
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              : "bg-slate-800 text-slate-300"
          }`}
        >
          {rate}
          {levelUp && <TrendingUp className="h-3.5 w-3.5 stroke-[2.5]" />}
          {levelDown && <TrendingDown className="h-3.5 w-3.5 stroke-[2.5]" />}
        </span>
      </div>

      {badgeText && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">{badgeText}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
        </div>
      )}
    </div>
  );
};
