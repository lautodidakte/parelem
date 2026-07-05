"use client";

import React, { useId } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Accent = "primary" | "green" | "red" | "gold";

const ACCENT: Record<Accent, string> = {
  primary: "#328080",
  green: "#16A34A",
  red: "#EF4444",
  gold: "#E0A800",
};

// Sparkline en SVG inline : aucune dépendance, rendu déterministe, très léger.
const Sparkline: React.FC<{ data: number[]; color: string; gid: string }> = ({
  data,
  color,
  gid,
}) => {
  const w = 100;
  const h = 32;
  const pad = 3;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const pts = data.map((v, i) => {
    const x = data.length === 1 ? 0 : (i / (data.length - 1)) * w;
    const y = h - pad - ((v - min) / span) * (h - 2 * pad);
    return [x, y] as const;
  });

  const line = pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area =
    `M ${pts[0][0].toFixed(2)},${h} L ` +
    pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" L ") +
    ` L ${w},${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="w-full h-10 mt-3"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  data?: number[];
  icon?: React.ReactNode;
  accent?: Accent;
}

// Carte KPI avec sparkline (pattern inspiré de 21st.dev / Tremor), construite
// nativement — aucune dépendance ajoutée.
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  delta,
  trend = "neutral",
  data = [],
  icon,
  accent = "primary",
}) => {
  const gid = useId().replace(/:/g, "");
  const color = ACCENT[accent];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs font-semibold">{label}</p>
        {icon && <span style={{ color }}>{icon}</span>}
      </div>

      <p className="text-2xl font-bold text-gray-900 font-heading tabular-nums mt-2 tracking-tight">
        {value}
      </p>

      {delta && (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold mt-1 w-fit ${
            trend === "up"
              ? "text-green-600"
              : trend === "down"
                ? "text-red-500"
                : "text-gray-400"
          }`}
        >
          {trend === "up" && <ArrowUpRight size={12} />}
          {trend === "down" && <ArrowDownRight size={12} />}
          {delta}
        </span>
      )}

      {data.length > 1 && <Sparkline data={data} color={color} gid={gid} />}
    </div>
  );
};
