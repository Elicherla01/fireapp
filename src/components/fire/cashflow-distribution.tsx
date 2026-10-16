'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { formatInCrores, formatINR } from '@/lib/utils';
import { ShieldCheck, Sparkles, TrendingUp, Layers, Cpu, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';

interface CashflowDistributionProps {
  targetCorpus: number;
  monthlyExpense: number;
  swrPercent: number;
}

export function CashflowDistribution({
  targetCorpus,
  monthlyExpense,
  swrPercent,
}: CashflowDistributionProps) {
  // Asset allocation percentages
  const [equityRatio, setEquityRatio] = useState<number>(65); // 65% Direct Equities / Mutual Funds
  const [debtRatio, setDebtRatio] = useState<number>(25); // 25% Liquid / Arbitrage / Fixed Income runway
  const [optionsYieldCapital, setOptionsYieldCapital] = useState<number>(10); // 10% Capital used for automated theta cashflow

  // Dollar values
  const equityCorpus = (targetCorpus * equityRatio) / 100;
  const debtCorpus = (targetCorpus * debtRatio) / 100;
  const optionsCorpus = (targetCorpus * optionsYieldCapital) / 100;

  // Monthly income generators
  // Equities: ~1.2% dividend yield + capital growth
  const monthlyDividends = Math.round((equityCorpus * 0.012) / 12);
  // Debt/Liquid: ~6.8% post-tax yield
  const monthlyDebtIncome = Math.round((debtCorpus * 0.068) / 12);
  // Options Systematic Cashflow: ~1.2% to 1.8% monthly on dedicated margin capital
  const monthlyOptionsCashflow = Math.round(optionsCorpus * 0.015);

  const totalMonthlyGeneration = monthlyDividends + monthlyDebtIncome + monthlyOptionsCashflow;
  const coverageRatio = monthlyExpense > 0 ? (totalMonthlyGeneration / monthlyExpense) * 100 : 100;

  return (
    <div className="space-y-5">
      {/* Engineer's 3 Pillars Callout */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-[#0e172a] to-card p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              <span>The Engineer&apos;s Mental Model</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Why Engineers Reach FIRE 2× Faster: The 3 Core Pillars
            </h3>
          </div>
          <Badge variant="cyan" className="font-mono text-xs self-start md:self-auto">
            Algorithm-Driven Independence
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-background/50 border border-border/80 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                1
              </div>
              <span className="font-bold text-foreground text-sm">Direct Stock Compounding</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Don&apos;t settle for average index returns during accumulation. Build a high-conviction portfolio of market leaders using systematic momentum filters (Stage-2 uptrend, VCP contraction) for 15%–18% CAGR.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-background/50 border border-border/80 hover:border-emerald-400/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <span className="font-bold text-foreground text-sm">Automated Theta Cashflow</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The fatal flaw of 4% SWR is selling quality shares during market crashes. By running automated OTM Strangles or Covered Calls, you extract 1%–2% monthly cashflow without touching equity principal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-background/50 border border-border/80 hover:border-amber-400/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <span className="font-bold text-foreground text-sm">Quantitative Risk Controls</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Treat your capital like production software: strict unit-test stop losses (max 1%–2% portfolio risk per trade), position sizing limits, and programmatic macro monitors (crude, FII/DII flow).
            </p>
          </div>
        </div>
      </div>

      {/* Post-FIRE Monthly Paycheck Simulator */}
      <Card className="glass-panel border-border/60">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wallet className="h-4 w-4 text-emerald-400" />
                Post-FIRE Cashflow Architecture Simulator
              </CardTitle>
              <CardDescription>
                How your {formatInCrores(targetCorpus)} portfolio pays you {formatINR(monthlyExpense)}/month without depleting principle
              </CardDescription>
            </div>
            <Badge variant={coverageRatio >= 100 ? 'success' : 'warning'} className="text-xs font-mono self-start sm:self-auto">
              {coverageRatio.toFixed(0)}% Expense Coverage
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Asset Allocation Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 rounded-xl bg-muted/30 border border-border/60">
            {/* Equity Bucket */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Equities &amp; Stocks</span>
                <span className="font-bold text-primary font-mono">{equityRatio}% ({formatInCrores(equityCorpus)})</span>
              </div>
              <Slider
                value={[equityRatio]}
                min={30}
                max={85}
                step={5}
                onValueChange={(val) => {
                  const eq = val[0];
                  const remaining = 100 - eq;
                  setEquityRatio(eq);
                  setDebtRatio(Math.round(remaining * 0.7));
                  setOptionsYieldCapital(Math.round(remaining * 0.3));
                }}
              />
              <p className="text-[10px] text-muted-foreground">Long-term wealth inflation compounder</p>
            </div>

            {/* Debt / Living Runway Bucket */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Liquid / Arbitrage Runway</span>
                <span className="font-bold text-emerald-400 font-mono">{debtRatio}% ({formatInCrores(debtCorpus)})</span>
              </div>
              <Slider
                value={[debtRatio]}
                min={10}
                max={50}
                step={5}
                onValueChange={(val) => {
                  const debt = val[0];
                  setDebtRatio(debt);
                  setOptionsYieldCapital(Math.max(5, 100 - equityRatio - debt));
                }}
              />
              <p className="text-[10px] text-muted-foreground">3–4 years of bulletproof living expense buffer</p>
            </div>

            {/* Options Yield Engine */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Options Cashflow Margin</span>
                <span className="font-bold text-amber-400 font-mono">{optionsYieldCapital}% ({formatInCrores(optionsCorpus)})</span>
              </div>
              <Slider
                value={[optionsYieldCapital]}
                min={5}
                max={25}
                step={1}
                onValueChange={(val) => setOptionsYieldCapital(val[0])}
              />
              <p className="text-[10px] text-muted-foreground">Monetizes theta decay for monthly cashflow</p>
            </div>
          </div>

          {/* Generated Monthly Income Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Equity Dividends &amp; Growth
              </span>
              <div className="text-xl font-bold font-mono text-primary">
                {formatINR(monthlyDividends)}/mo
              </div>
              <p className="text-[10px] text-muted-foreground">
                Natural yield without forced liquidation
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Debt / Arbitrage Interest
              </span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {formatINR(monthlyDebtIncome)}/mo
              </div>
              <p className="text-[10px] text-muted-foreground">
                Predictable, safe, tax-efficient fixed yield
              </p>
            </div>

            <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">
                Options Theta Yield Engine
              </span>
              <div className="text-xl font-bold font-mono text-amber-300">
                {formatINR(monthlyOptionsCashflow)}/mo
              </div>
              <p className="text-[10px] text-muted-foreground">
                Algorithmic OTM Strangles cashflow
              </p>
            </div>
          </div>

          {/* Combined Paycheck Output */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                Total Monthly Passive Cashflow Generated
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-foreground mt-0.5">
                {formatINR(totalMonthlyGeneration)}
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  (Needed: {formatINR(monthlyExpense)}/mo)
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-medium text-muted-foreground">
                Net Annual Yield on Portfolio
              </div>
              <div className="text-xl font-bold text-emerald-400 font-mono">
                {((totalMonthlyGeneration * 12) / Math.max(1, targetCorpus) * 100).toFixed(2)}% p.a.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
