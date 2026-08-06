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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl backdrop-blur-md hover:border-amber-500/40 transition-all duration-300 group">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-amber-400 group-hover:scale-110 group-hover:border-amber-500/50 transition-all">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <h4 className="text-2xl font-black text-white tracking-tight">
            {total}
          </h4>
          {subtitle && (
            <p className="text-xs text-slate-300 mt-1 font-semibold">{subtitle}</p>
          )}
        </div>

        <span
          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${
            levelUp
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : levelDown
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              : "bg-slate-800 text-slate-200"
          }`}
        >
          {rate}
          {levelUp && <TrendingUp className="h-3.5 w-3.5 stroke-[2.5]" />}
          {levelDown && <TrendingDown className="h-3.5 w-3.5 stroke-[2.5]" />}
        </span>
      </div>

      {badgeText && (
        <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-medium">
          <span className="text-slate-300">{badgeText}</span>
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
        </div>
      )}
    </div>
  );
};
