"use client";

import React, { useId } from "react";

interface Point {
  name: string;
  value: number;
}

interface TrendChartProps {
  data: Point[];
  color?: string;
  variant?: "bars" | "area";
  suffix?: string;
}

// Graphiques en SVG inline (barres ou aire) : rendu déterministe, sans
// dépendance ni ResponsiveContainer (peu fiable dans ce contexte).
const W = 320;
const H = 180;
const PADX = 22;
const PADT = 18;
const PADB = 26;

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  color = "#328080",
  variant = "area",
  suffix = "",
}) => {
  const gid = useId().replace(/:/g, "");
  const max = Math.max(...data.map((d) => d.value), 1);
  const plotW = W - PADX * 2;
  const plotH = H - PADT - PADB;
  const baseY = PADT + plotH;
  const x = (i: number) =>
    data.length === 1 ? PADX + plotW / 2 : PADX + (i / (data.length - 1)) * plotW;
  const y = (v: number) => PADT + plotH - (v / max) * plotH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-64" preserveAspectRatio="xMidYMid meet">
      <line x1={PADX} y1={baseY} x2={W - PADX} y2={baseY} stroke="#E5E7EB" strokeWidth="1" />

      {variant === "bars"
        ? data.map((d, i) => {
            const bw = (plotW / data.length) * 0.5;
            const by = y(d.value);
            return (
              <g key={i}>
                <rect x={x(i) - bw / 2} y={by} width={bw} height={baseY - by} rx="4" fill={color} />
                <text x={x(i)} y={by - 5} textAnchor="middle" fontSize="9" fontWeight="700" fill="#374151">
                  {d.value}
                  {suffix}
                </text>
                <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="8" fill="#9CA3AF">
                  {d.name}
                </text>
              </g>
            );
          })
        : (
          <>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path
              d={
                `M ${x(0)},${baseY} ` +
                data.map((d, i) => `L ${x(i)},${y(d.value)}`).join(" ") +
                ` L ${x(data.length - 1)},${baseY} Z`
              }
              fill={`url(#${gid})`}
            />
            <polyline
              points={data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ")}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {data.map((d, i) => (
              <g key={i}>
                <circle cx={x(i)} cy={y(d.value)} r="3" fill="#fff" stroke={color} strokeWidth="2" />
                <text x={x(i)} y={y(d.value) - 8} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#374151">
                  {d.value}
                  {suffix}
                </text>
                <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="8" fill="#9CA3AF">
                  {d.name}
                </text>
              </g>
            ))}
          </>
        )}
    </svg>
  );
};
