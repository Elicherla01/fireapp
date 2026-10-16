'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatInCrores, formatINR } from '@/lib/utils';
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  Info,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface CompoundingAssumptionsProps {
  expectedReturn: number;
  expectedInflation: number;
  monthlySavings: number;
  yearlyStepUp: number;
  currentCorpus: number;
  annualExpense: number;
  multiplier: number;
  currentAge: number;
  yearsToFire: number | null;
  fireAge: number | null;
}

export function CompoundingAssumptions({
  expectedReturn,
  expectedInflation,
  monthlySavings,
  yearlyStepUp,
  currentCorpus,
  annualExpense,
  multiplier,
  currentAge,
  yearsToFire,
  fireAge,
}: CompoundingAssumptionsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'formulas' | 'assumptions' | 'hockeystick'>('formulas');

  const baseFireTarget = annualExpense * multiplier;
  const monthlyRate = expectedReturn / 12;
  const realReturnRate = expectedReturn - expectedInflation;

  // Calculate live examples
  const sipYr1 = monthlySavings;
  const sipYr5 = Math.round(monthlySavings * Math.pow(1 + yearlyStepUp / 100, 4));
  const sipYr10 = Math.round(monthlySavings * Math.pow(1 + yearlyStepUp / 100, 9));
  const sipYr15 = Math.round(monthlySavings * Math.pow(1 + yearlyStepUp / 100, 14));

  const targetYr5 = Math.round(baseFireTarget * Math.pow(1 + expectedInflation / 100, 5));
  const targetYr10 = Math.round(baseFireTarget * Math.pow(1 + expectedInflation / 100, 10));
  const targetYr15 = Math.round(baseFireTarget * Math.pow(1 + expectedInflation / 100, 15));

  return (
    <div className="rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-md overflow-hidden transition-all shadow-lg shadow-primary/5">
      {/* Clickable Header Banner */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-gradient-to-r from-card via-[#0e172a] to-card hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-foreground">
                Mathematical Calculations &amp; Assumptions
              </h4>
              <Badge variant="cyan" className="text-[10px] hidden sm:inline-flex">
                Monthly Discrete Model
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Formulas, inflation indexing, step-up algorithms, and crossover mechanics used in the chart
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-primary hidden sm:inline">
            {isOpen ? 'Collapse Details' : 'Show Equations'}
          </span>
          <div className="h-8 w-8 rounded-lg bg-secondary/80 flex items-center justify-center text-muted-foreground">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </button>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-border/80 space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
            {[
              { id: 'formulas', label: '1. Exact Formulas & Live Values' },
              { id: 'assumptions', label: '2. Core Modeling Assumptions' },
              { id: 'hockeystick', label: '3. Why The Curve Accelerates ("Hockey Stick")' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: EXACT MATHEMATICAL FORMULAS */}
          {activeTab === 'formulas' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Equation 1: Monthly Compounding */}
                <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      A. Monthly Portfolio Iteration Formula
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      r_m = {monthlyRate.toFixed(2)}%/mo
                    </Badge>
                  </div>

                  <div className="p-3 rounded-lg bg-card border border-border/60 font-mono text-xs text-primary font-semibold overflow-x-auto">
                    Corpus_t = Corpus_(t-1) × (1 + r_m) + SIP_y
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    At every month <code className="text-primary">t</code> (from 1 to 420 months), existing wealth grows by the monthly return <code className="text-primary">r_m = ({expectedReturn}% / 12) = {monthlyRate.toFixed(3)}%</code>, and your current monthly SIP is added at month end.
                  </p>

                  <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground space-y-1">
                    <div><strong>Starting Net Worth:</strong> {formatInCrores(currentCorpus)} ({formatINR(currentCorpus)})</div>
                    <div><strong>Month 1 Compounding:</strong> Grows by {formatINR(Math.round(currentCorpus * (monthlyRate / 100)))} + {formatINR(monthlySavings)} SIP</div>
                  </div>
                </div>

                {/* Equation 2: Annual SIP Step-Up */}
                <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      B. Annual SIP Step-Up Formula
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      +{yearlyStepUp}% / yr
                    </Badge>
                  </div>

                  <div className="p-3 rounded-lg bg-card border border-border/60 font-mono text-xs text-cyan-300 font-semibold overflow-x-auto">
                    SIP_(y+1) = SIP_y × (1 + StepUp / 100)
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Every 12 months, your monthly contribution increments by <code className="text-cyan-300">+{yearlyStepUp}%</code> to mirror corporate appraisals, salary hikes, and bonuses.
                  </p>

                  <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground grid grid-cols-2 gap-2">
                    <div>Yr 1: <strong className="text-foreground font-mono">{formatINR(sipYr1)}/mo</strong></div>
                    <div>Yr 5: <strong className="text-foreground font-mono">{formatINR(sipYr5)}/mo</strong></div>
                    <div>Yr 10: <strong className="text-foreground font-mono">{formatINR(sipYr10)}/mo</strong></div>
                    <div>Yr 15: <strong className="text-foreground font-mono">{formatINR(sipYr15)}/mo</strong></div>
                  </div>
                </div>

                {/* Equation 3: Inflation-Adjusted Target Line */}
                <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      C. Inflation-Adjusted Target Line (Dashed)
                    </span>
                    <Badge variant="warning" className="text-[10px] font-mono">
                      +{expectedInflation}% / yr
                    </Badge>
                  </div>

                  <div className="p-3 rounded-lg bg-card border border-border/60 font-mono text-xs text-amber-300 font-semibold overflow-x-auto">
                    Target_nominal(t) = BaseTarget × (1 + Inflation)^((t)/12)
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The target line is not flat. Since your baseline living expenses expand at <code className="text-amber-300">{expectedInflation}%/year</code>, the required nominal corpus increases over time.
                  </p>

                  <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground grid grid-cols-2 gap-2">
                    <div>Today: <strong className="text-foreground font-mono">{formatInCrores(baseFireTarget)}</strong></div>
                    <div>In 5 Yrs: <strong className="text-foreground font-mono">{formatInCrores(targetYr5)}</strong></div>
                    <div>In 10 Yrs: <strong className="text-foreground font-mono">{formatInCrores(targetYr10)}</strong></div>
                    <div>In 15 Yrs: <strong className="text-foreground font-mono">{formatInCrores(targetYr15)}</strong></div>
                  </div>
                </div>

                {/* Equation 4: Crossover Detection */}
                <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      D. Crossover Condition (FIRE Day)
                    </span>
                    <Badge variant="success" className="text-[10px] font-mono">
                      Milestone Event
                    </Badge>
                  </div>

                  <div className="p-3 rounded-lg bg-card border border-border/60 font-mono text-xs text-emerald-300 font-semibold overflow-x-auto">
                    Corpus_t ≥ Target_nominal(t)
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The milestone dot triggers at the exact month <code className="text-emerald-300">t*</code> where your accumulated portfolio intersects and overtakes the inflation-adjusted target line.
                  </p>

                  <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground space-y-1">
                    <div>
                      <strong>Crossover Time:</strong>{' '}
                      <span className="text-emerald-400 font-bold font-mono">
                        {yearsToFire !== null ? `${yearsToFire} Years (${Math.round(yearsToFire * 12)} months)` : 'Exceeds 35 Years'}
                      </span>
                    </div>
                    <div>
                      <strong>Retirement Age:</strong>{' '}
                      <span className="text-primary font-bold font-mono">
                        {fireAge !== null ? `Age ${fireAge} (from Age ${currentAge})` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CORE MODELING ASSUMPTIONS */}
          {activeTab === 'assumptions' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="p-3.5 rounded-xl border border-border/70 bg-background/50 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">Monthly Discrete Steps</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Calculations run month-by-month (12 steps per year), matching the real-world schedule of monthly salaries, SIP debits, and interest credits.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-border/70 bg-background/50 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-foreground">Net CAGR Reinvestment</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Expected return ({expectedReturn}%) is assumed to be net of taxes, with 100% of dividends and capital gains fully reinvested back into compounding assets.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-border/70 bg-background/50 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold text-foreground">Real Net Spread</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Real compounding spread over inflation is{' '}
                    <strong className="text-emerald-400 font-mono">
                      {(expectedReturn - expectedInflation).toFixed(1)}% p.a.
                    </strong>{' '}
                    ({expectedReturn}% return minus {expectedInflation}% inflation).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-border/70 bg-background/50 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-bold text-foreground">Zero Leakage</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Assumes no capital withdrawals are made during the accumulation phase until the FIRE crossover milestone is reached.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-border/70 bg-background/50 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-bold text-foreground">Annual Step-Up Frequency</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    SIP increases by +{yearlyStepUp}% exactly at months 13, 25, 37, 49... mirroring annual appraisal cycles.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-border/70 bg-background/50 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-slate-300" />
                    <span className="text-xs font-bold text-foreground">Multiplier Horizon</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    At {multiplier}× annual burn, your Safe Withdrawal Rate (SWR) is{' '}
                    <strong className="text-primary font-mono">{(100 / multiplier).toFixed(2)}%</strong>, calibrated to sustain 30+ retirement years.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WHY THE HOCKEY STICK ACCELERATION */}
          {activeTab === 'hockeystick' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                <h5 className="text-xs font-bold text-primary flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Why does the curve explode upward in later years?
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground leading-relaxed">
                  <div>
                    <strong className="text-foreground block mb-1">1. Capital Yield Dwarfs Salary Savings</strong>
                    In the first 5 years, most growth comes from your active monthly salary SIP. But by Year 15–20, your accumulated corpus generates more in pure annual compound interest than your entire annual salary savings.
                  </div>
                  <div>
                    <strong className="text-foreground block mb-1">2. Nominal vs Real Rupee View</strong>
                    The default chart is in <strong>Nominal (₹ Future)</strong> terms. To view true purchasing power without the inflation expansion, click the <strong>&quot;Real (Today&apos;s ₹)&quot;</strong> button at the top-right of the chart.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
