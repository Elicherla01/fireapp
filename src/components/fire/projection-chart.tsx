'use client';

import React, { useState } from 'react';
import { YearlySimulationPoint } from '@/lib/fire-math';
import { formatCompactINR, formatInCrores, formatINR } from '@/lib/utils';
import { TrendingUp, Target, DollarSign, Calendar, Sparkles } from 'lucide-react';

interface ProjectionChartProps {
  points: YearlySimulationPoint[];
  yearsToFire: number | null;
  fireAge: number | null;
  fireCorpusAtAchieve: number;
  expectedInflation: number;
}

export function ProjectionChart({
  points,
  yearsToFire,
  fireAge,
  fireCorpusAtAchieve,
  expectedInflation,
}: ProjectionChartProps) {
  const [viewMode, setViewMode] = useState<'nominal' | 'real'>('nominal');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!points || points.length === 0) return null;

  // Chart dimensions & margins
  const width = 800;
  const height = 360;
  const padding = { top: 30, right: 35, bottom: 45, left: 75 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Max values for scale
  const maxCorpus = Math.max(
    ...points.map((p) => (viewMode === 'nominal' ? p.corpus : p.corpus / Math.pow(1 + expectedInflation / 100, p.year))),
    ...points.map((p) => (viewMode === 'nominal' ? p.fireTargetNominal : p.fireTargetReal)),
    10000000 // minimum ₹1 Cr scale
  );

  const maxYear = points[points.length - 1].year || 30;

  // Coordinate mappers
  const getX = (year: number) => padding.left + (year / maxYear) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - (Math.max(0, val) / maxCorpus) * innerHeight;

  // Generate SVG path for portfolio corpus
  const corpusCoords = points.map((p) => {
    const val = viewMode === 'nominal' ? p.corpus : p.corpus / Math.pow(1 + expectedInflation / 100, p.year);
    return { x: getX(p.year), y: getY(val) };
  });

  const corpusPath = corpusCoords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Fill area under corpus curve
  const zeroY = getY(0);
  const areaPath = `${corpusPath} L ${corpusCoords[corpusCoords.length - 1].x} ${zeroY} L ${corpusCoords[0].x} ${zeroY} Z`;

  // Invested Capital Path
  const capitalCoords = points.map((p) => {
    const val = viewMode === 'nominal' ? p.investedCapital : p.investedCapital / Math.pow(1 + expectedInflation / 100, p.year);
    return { x: getX(p.year), y: getY(val) };
  });
  const capitalPath = capitalCoords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Target Line Path
  const targetCoords = points.map((p) => {
    const val = viewMode === 'nominal' ? p.fireTargetNominal : p.fireTargetReal;
    return { x: getX(p.year), y: getY(val) };
  });
  const targetPath = targetCoords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Grid tick marks
  const yTicksCount = 5;
  const yTicks = Array.from({ length: yTicksCount + 1 }).map((_, i) => (maxCorpus / yTicksCount) * i);

  const xTicksCount = Math.min(7, Math.floor(maxYear / 5));
  const xStep = Math.ceil(maxYear / xTicksCount);
  const xTicks: number[] = [];
  for (let i = 0; i <= maxYear; i += xStep) {
    xTicks.push(i);
  }

  // Active hover point
  const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;
  const activeNominalCorpus = activePoint
    ? viewMode === 'nominal'
      ? activePoint.corpus
      : activePoint.corpus / Math.pow(1 + expectedInflation / 100, activePoint.year)
    : 0;

  // Crossover point calculation
  let crossoverX: number | null = null;
  let crossoverY: number | null = null;
  if (yearsToFire !== null && yearsToFire <= maxYear) {
    crossoverX = getX(yearsToFire);
    const crossoverVal =
      viewMode === 'nominal'
        ? fireCorpusAtAchieve
        : fireCorpusAtAchieve / Math.pow(1 + expectedInflation / 100, yearsToFire);
    crossoverY = getY(crossoverVal);
  }

  return (
    <div className="space-y-4">
      {/* Chart Top Header & View Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            30-Year Wealth Compounding &amp; Crossover Trajectory
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Watch your portfolio cross the inflation-adjusted Financial Independence line
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex rounded-lg border border-border/80 bg-muted/40 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('nominal')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'nominal'
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Nominal (₹ Future)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('real')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'real'
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Real (Today&apos;s ₹)
            </button>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full rounded-2xl border border-border/80 bg-card/60 p-2 sm:p-4 backdrop-blur-md overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Gradient for area under corpus */}
            <linearGradient id="corpusGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06090f" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Grid lines & Y Axis Labels */}
          {yTicks.map((tickVal, i) => {
            const y = getY(tickVal);
            return (
              <g key={`y-${i}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground text-[10px] font-mono"
                >
                  {formatCompactINR(tickVal)}
                </text>
              </g>
            );
          })}

          {/* Vertical Grid lines & X Axis Labels */}
          {xTicks.map((year, i) => {
            const x = getX(year);
            const p = points.find((pt) => pt.year === year);
            return (
              <g key={`x-${i}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="rgba(255,255,255,0.04)"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px] font-mono"
                >
                  Yr {year}
                </text>
                {p && (
                  <text
                    x={x}
                    y={height - padding.bottom + 30}
                    textAnchor="middle"
                    className="fill-muted-foreground/60 text-[9px] font-sans"
                  >
                    Age {p.age}
                  </text>
                )}
              </g>
            );
          })}

          {/* Area fill for Portfolio */}
          <path d={areaPath} fill="url(#corpusGradient)" />

          {/* Invested Capital Line */}
          <path
            d={capitalPath}
            fill="none"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity={0.7}
          />

          {/* Inflation-Adjusted Target Line */}
          <path
            d={targetPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="5 4"
          />

          {/* Accumulated Portfolio Line */}
          <path
            d={corpusPath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            filter="url(#glow)"
          />

          {/* Crossover / FIRE Achieved Dot */}
          {crossoverX !== null && crossoverY !== null && (
            <g>
              <circle
                cx={crossoverX}
                cy={crossoverY}
                r="10"
                fill="#10b981"
                fillOpacity="0.25"
                className="animate-ping"
              />
              <circle
                cx={crossoverX}
                cy={crossoverY}
                r="6"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Badge text on chart */}
              <rect
                x={Math.min(crossoverX - 45, width - padding.right - 90)}
                y={Math.max(crossoverY - 32, padding.top + 2)}
                width="95"
                height="22"
                rx="6"
                fill="#10b981"
              />
              <text
                x={Math.min(crossoverX + 2, width - padding.right - 42)}
                y={Math.max(crossoverY - 17, padding.top + 17)}
                textAnchor="middle"
                className="fill-slate-950 text-[10px] font-bold tracking-tight"
              >
                ★ FIRE: Yr {yearsToFire}
              </text>
            </g>
          )}

          {/* Interactive Hover Guides & Circles */}
          {activePoint && hoverIndex !== null && (
            <g>
              <line
                x1={getX(activePoint.year)}
                y1={padding.top}
                x2={getX(activePoint.year)}
                y2={height - padding.bottom}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                opacity={0.8}
              />
              <circle
                cx={getX(activePoint.year)}
                cy={getY(activeNominalCorpus)}
                r="5"
                fill="#38bdf8"
                stroke="#06090f"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Invisible interactive columns for smooth hover */}
          {points.map((p, idx) => {
            const x = getX(p.year);
            const colWidth = innerWidth / points.length;
            return (
              <rect
                key={`hover-${idx}`}
                x={x - colWidth / 2}
                y={padding.top}
                width={colWidth}
                height={innerHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(idx)}
              />
            );
          })}
        </svg>

        {/* Live Hover Tooltip Panel */}
        {activePoint && (
          <div className="mt-3 p-3 rounded-xl bg-secondary/80 border border-primary/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold font-mono">
                {activePoint.year}
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  Year {activePoint.year} · Age {activePoint.age}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Monthly SIP: {formatINR(activePoint.monthlySip)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono">
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase">Portfolio</span>
                <span className="font-bold text-primary text-sm">
                  {formatInCrores(viewMode === 'nominal' ? activePoint.corpus : activePoint.corpus / Math.pow(1 + expectedInflation / 100, activePoint.year))}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase">Invested Capital</span>
                <span className="font-semibold text-slate-300">
                  {formatInCrores(viewMode === 'nominal' ? activePoint.investedCapital : activePoint.investedCapital / Math.pow(1 + expectedInflation / 100, activePoint.year))}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase">Wealth Multiplier</span>
                <span className="font-semibold text-emerald-400">
                  {(activePoint.corpus / Math.max(1, activePoint.investedCapital)).toFixed(2)}×
                </span>
              </div>
              <div>
                <span className="text-[10px] text-amber-400 block uppercase">Target ({viewMode})</span>
                <span className="font-semibold text-amber-400">
                  {formatInCrores(viewMode === 'nominal' ? activePoint.fireTargetNominal : activePoint.fireTargetReal)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Milestone Callouts */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground px-1">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-6 rounded-full bg-primary" />
            <span className="text-foreground font-medium">Accumulated Portfolio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-6 rounded-full border-t-2 border-dashed border-amber-400" />
            <span className="text-amber-400 font-medium">FIRE Target Line</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-6 rounded-full border-t-2 border-dashed border-slate-500" />
            <span>Invested Principal</span>
          </div>
        </div>

        {yearsToFire !== null ? (
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Financial Freedom at Age {fireAge} ({yearsToFire} years)</span>
          </div>
        ) : (
          <div className="text-amber-400 text-[11px]">
            Target not reached within 35 yrs — increase monthly SIP or step-up %
          </div>
        )}
      </div>
    </div>
  );
}
