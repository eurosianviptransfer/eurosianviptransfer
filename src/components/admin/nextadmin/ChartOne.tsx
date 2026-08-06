"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "left",
    labels: {
      colors: "#94a3b8",
    },
  },
  colors: ["#f59e0b", "#10b981"],
  chart: {
    fontFamily: "Inter, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#624100",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 320,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "smooth",
  },
  grid: {
    borderColor: "#1e293b",
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#f59e0b", "#10b981"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    hover: {
      size: 6,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Oca",
      "Şub",
      "Mar",
      "Nis",
      "May",
      "Haz",
      "Tem",
      "Ağu",
      "Eyl",
      "Ekim",
      "Kas",
      "Ara",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: "#64748b",
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    labels: {
      style: {
        colors: "#64748b",
        fontSize: "12px",
      },
      formatter: (value) => `€${value}`,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "vertical",
      shadeIntensity: 0.5,
      gradientToColors: ["#f59e0b20", "#10b98120"],
      inverseColors: false,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  tooltip: {
    theme: "dark",
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

export const ChartOne: React.FC = () => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: "VIP Transfer Geliri (€)",
        data: [12000, 18000, 24000, 31000, 42000, 58000, 74000, 89000, 65000, 48000, 35000, 29000],
      },
      {
        name: "Tamamlanan Transfer Adedi",
        data: [85, 110, 145, 190, 260, 340, 420, 510, 380, 290, 210, 175],
      },
    ],
  });

  return (
    <div className="col-span-12 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Transfer & Gelir Performansı</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Aylık VIP Transfer cirosu ve toplam yolcu taşıma verileri</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400">
          <button className="rounded-lg bg-slate-800 px-3 py-1 text-white shadow-sm">Yıllık</button>
          <button className="rounded-lg px-3 py-1 hover:text-white transition-all">Aylık</button>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-3">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={320}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};
