'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatInCrores, formatINR } from '@/lib/utils';
import { calculateCoastFireCorpus } from '@/lib/fire-math';
import { CheckCircle2, Palmtree, Coffee, ShieldAlert, Sparkles, Flame } from 'lucide-react';

interface FireTiersPanelProps {
  annualExpense: number;
  monthlyExpense: number;
  activeMultiplier: number;
  currentCorpus: number;
  currentAge: number;
  expectedReturn: number;
  expectedInflation: number;
}

export function FireTiersPanel({
  annualExpense,
  monthlyExpense,
  activeMultiplier,
  currentCorpus,
  currentAge,
  expectedReturn,
  expectedInflation,
}: FireTiersPanelProps) {
  // 1. Lean FIRE (22x) - covers essentials only (cut ~25% discretionary)
  const leanMonthly = Math.round(monthlyExpense * 0.75);
  const leanAnnual = leanMonthly * 12;
  const leanCorpus = leanAnnual * 22;

  // 2. Standard FIRE (user multiplier, e.g. 30x)
  const standardCorpus = annualExpense * activeMultiplier;

  // 3. Fat FIRE (40x with 30% lifestyle buffer)
  const fatMonthly = Math.round(monthlyExpense * 1.35);
  const fatAnnual = fatMonthly * 12;
  const fatCorpus = fatAnnual * 40;

  // 4. Coast FIRE for Age 58
  const targetRetireAge = Math.max(currentAge + 5, 58);
  const yearsToRetire = targetRetireAge - currentAge;
  const coastCorpus = calculateCoastFireCorpus(
    standardCorpus,
    yearsToRetire,
    expectedReturn,
    expectedInflation
  );
  const coastAchieved = currentCorpus >= coastCorpus;

  // 5. Barista FIRE (Active semi-retirement consulting covering 40% of living expenses)
  const baristaActiveIncome = Math.round(monthlyExpense * 0.4);
  const baristaPortfolioNeeded = (monthlyExpense - baristaActiveIncome) * 12 * activeMultiplier;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Flame className="h-4 w-4 text-primary" />
            The 5 FIRE Archetypes for Your Living Standard
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Different milestones provide varying levels of psychological safety and lifestyle flexibility.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tier 1: Lean FIRE */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm relative overflow-hidden transition-all hover:border-amber-400/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="text-xs font-bold text-foreground">Lean FIRE (22×)</span>
            </div>
            <Badge variant="warning" className="font-mono text-[10px]">
              4.5% SWR
            </Badge>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground">
              {formatInCrores(leanCorpus)}
            </div>
            <div className="text-xs font-mono text-muted-foreground mt-0.5">
              {formatINR(leanCorpus)}
            </div>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-border/60 text-[11px] text-muted-foreground space-y-1">
            <p>
              Provides <span className="text-foreground font-semibold font-mono">{formatINR(leanMonthly)}/mo</span>.
            </p>
            <p className="text-amber-300/80">
              Barebones survival mode. Covers rent, groceries &amp; medical. Zero luxury.
            </p>
          </div>
        </div>

        {/* Tier 2: Standard FIRE (Active Choice) */}
        <div className="rounded-2xl border-2 border-primary/50 bg-primary/5 p-4 backdrop-blur-sm relative overflow-hidden shadow-lg shadow-primary/5">
          <div className="absolute top-0 right-0 h-8 w-8 bg-primary/20 rounded-bl-xl flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="text-xs font-bold text-primary">Standard FIRE ({activeMultiplier}×)</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-primary">
              {formatInCrores(standardCorpus)}
            </div>
            <div className="text-xs font-mono text-primary/80 mt-0.5">
              {formatINR(standardCorpus)}
            </div>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-primary/20 text-[11px] text-muted-foreground space-y-1">
            <p>
              Provides <span className="text-foreground font-semibold font-mono">{formatINR(monthlyExpense)}/mo</span>.
            </p>
            <p className="text-primary font-medium">
              100% replicates your current lifestyle without cutting a single expense.
            </p>
          </div>
        </div>

        {/* Tier 3: Fat FIRE */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm relative overflow-hidden transition-all hover:border-emerald-400/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-foreground">Fat FIRE (40×)</span>
            </div>
            <Badge variant="success" className="font-mono text-[10px]">
              2.5% SWR
            </Badge>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground">
              {formatInCrores(fatCorpus)}
            </div>
            <div className="text-xs font-mono text-muted-foreground mt-0.5">
              {formatINR(fatCorpus)}
            </div>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-border/60 text-[11px] text-muted-foreground space-y-1">
            <p>
              Provides <span className="text-foreground font-semibold font-mono">{formatINR(fatMonthly)}/mo</span>.
            </p>
            <p className="text-emerald-300/80">
              Generous luxury, frequent overseas vacations, first-class medical safety nets.
            </p>
          </div>
        </div>

        {/* Tier 4: Coast FIRE */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm relative overflow-hidden transition-all hover:border-cyan-400/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palmtree className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold text-foreground">Coast FIRE (by Age {targetRetireAge})</span>
            </div>
            <Badge variant={coastAchieved ? 'success' : 'outline'} className="text-[10px]">
              {coastAchieved ? 'Achieved Today! 🎉' : `${yearsToRetire} yrs runway`}
            </Badge>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground">
              {formatInCrores(coastCorpus)}
            </div>
            <div className="text-xs font-mono text-muted-foreground mt-0.5">
              Current: {formatInCrores(currentCorpus)} ({Math.min(100, Math.round((currentCorpus / coastCorpus) * 100))}%)
            </div>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-border/60 text-[11px] text-muted-foreground space-y-1">
            <p className="text-cyan-300/90 font-medium">
              Invest this much today, then stop investing forever. Pure compound growth hits your target at {targetRetireAge}.
            </p>
          </div>
        </div>

        {/* Tier 5: Barista / Passion FIRE */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm relative overflow-hidden transition-all hover:border-purple-400/40 md:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-bold text-foreground">Barista / Semi-Retirement FIRE</span>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              Hybrid Freedom
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-black text-foreground">
                {formatInCrores(baristaPortfolioNeeded)}
              </div>
              <div className="text-xs font-mono text-muted-foreground mt-0.5">
                Savings required: {formatINR(baristaPortfolioNeeded)}
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground space-y-1 sm:border-l sm:border-border/60 sm:pl-4">
              <p>
                Assume you earn <span className="text-purple-300 font-semibold font-mono">{formatINR(baristaActiveIncome)}/mo</span> from freelance, mentoring, or low-stress consulting.
              </p>
              <p className="text-slate-300">
                Reduces required corpus from <span className="text-primary font-semibold">{formatInCrores(standardCorpus)}</span> down to <span className="text-emerald-400 font-semibold">{formatInCrores(baristaPortfolioNeeded)}</span> — saving you 5 to 8 years of corporate grind!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
