"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Car, MapPin } from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  colors: ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"],
  chart: {
    fontFamily: "Inter, sans-serif",
    type: "donut",
  },
  labels: ["Mercedes Vito VIP", "Mercedes Sprinter VIP", "Maybach S-Class", "E-Class Sedan"],
  legend: {
    show: true,
    position: "bottom",
    horizontalAlign: "center",
    labels: {
      colors: "#94a3b8",
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "72%",
        background: "transparent",
        labels: {
          show: true,
          total: {
            show: true,
            showAlways: true,
            label: "Toplam Rezervasyon",
            fontSize: "12px",
            color: "#94a3b8",
            formatter: function (w) {
              return "1,420";
            },
          },
          value: {
            show: true,
            fontSize: "22px",
            fontWeight: 800,
            color: "#ffffff",
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 280,
        },
      },
    },
  ],
};

export const ChartTwo: React.FC = () => {
  const [series] = useState<number[]>([650, 420, 210, 140]);

  return (
    <div className="col-span-12 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md xl:col-span-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Car className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Araç Filo Kullanımı</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Segment bazlı rezervasyon dağılımı</p>
        </div>
      </div>

      <div className="flex items-center justify-center py-4">
        <ReactApexChart options={options} series={series} type="donut" width={340} />
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-amber-400" /> Popüler Rota:
          </span>
          <span className="font-bold text-slate-200">IST Airport ➔ Taksim/Beşiktaş</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-blue-400" /> 2. Rota:
          </span>
          <span className="font-bold text-slate-200">SAW Airport ➔ Bodrum / Muğla</span>
        </div>
      </div>
    </div>
  );
};
