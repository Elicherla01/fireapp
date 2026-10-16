'use client';

import React, { useState, useId } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { formatINR, formatInCrores } from '@/lib/utils';
import {
  DEFAULT_EXPENSES,
  PERSONA_PRESETS,
  ExpenseItem,
  PersonaPreset,
  simulateRunway,
} from '@/lib/fire-math';
import { ProjectionChart } from './projection-chart';
import { FireTiersPanel } from './fire-tiers-panel';
import { CashflowDistribution } from './cashflow-distribution';
import { CompoundingAssumptions } from './compounding-assumptions';
import {
  Flame,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  PieChart,
  Target,
  Clock,
  Wallet,
  Info,
  RotateCcw,
  CheckCircle2,
  Share2,
  Copy,
  Plus,
  Trash2,
  Sliders,
  Award,
  ChevronRight,
} from 'lucide-react';

function StepMark({ n }: { n: number }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-md bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground shadow-xs">
      Step {n}
    </span>
  );
}

export function FireCalculatorMain() {
  // State for expenses
  const [expenses, setExpenses] = useState<ExpenseItem[]>(DEFAULT_EXPENSES);
  const [customTotalMonthly, setCustomTotalMonthly] = useState<number | null>(null);
  const [activeMode, setActiveMode] = useState<'itemized' | 'quick'>('itemized');

  // New custom expense item form
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [newExpName, setNewExpName] = useState('');
  const [newExpCategory, setNewExpCategory] = useState<'Essentials' | 'Security' | 'Discretionary'>('Essentials');
  const [newExpAmount, setNewExpAmount] = useState<number>(10000);

  // Core parameters
  const [multiplier, setMultiplier] = useState<number>(30); // Default 30x (recommended for India)
  const [currentCorpus, setCurrentCorpus] = useState<number>(12000000); // Default ₹1.2 Cr
  const [currentAge, setCurrentAge] = useState<number>(40); // Default current age: 40
  const [expectedReturn, setExpectedReturn] = useState<number>(12); // 12% portfolio CAGR
  const [expectedInflation, setExpectedInflation] = useState<number>(6.0); // 6% Indian inflation
  const [monthlySavings, setMonthlySavings] = useState<number>(125000); // ₹1.25 Lakh/month SIP
  const [yearlyStepUp, setYearlyStepUp] = useState<number>(8); // 8% annual SIP increase

  // Active persona identifier
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Form input unique IDs
  const customMonthlyInputId = useId();
  const currentCorpusInputId = useId();
  const currentAgeInputId = useId();
  const monthlySavingsInputId = useId();
  const expectedReturnInputId = useId();
  const expectedInflationInputId = useId();
  const yearlyStepUpInputId = useId();

  // Calculate totals
  const itemizedMonthlyTotal = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const monthlyExpense = activeMode === 'itemized' ? itemizedMonthlyTotal : (customTotalMonthly ?? itemizedMonthlyTotal);
  const annualExpense = monthlyExpense * 12;

  // The FIRE Numbers
  const fireNumber = annualExpense * multiplier;
  const swrPercent = multiplier > 0 ? (100 / multiplier).toFixed(2) : '0';

  // Progress metrics
  const progressPercent = fireNumber > 0 ? Math.min(100, Math.round((currentCorpus / fireNumber) * 100)) : 0;
  const shortfall = Math.max(0, fireNumber - currentCorpus);

  // Category breakdown
  const essentialsTotal = expenses.filter((e) => e.category === 'Essentials').reduce((acc, c) => acc + c.amount, 0);
  const securityTotal = expenses.filter((e) => e.category === 'Security').reduce((acc, c) => acc + c.amount, 0);
  const discretionaryTotal = expenses.filter((e) => e.category === 'Discretionary').reduce((acc, c) => acc + c.amount, 0);
  const totalCategorySum = Math.max(1, essentialsTotal + securityTotal + discretionaryTotal);

  // Simulation Trajectory
  const simulation = simulateRunway({
    currentCorpus,
    monthlySavings,
    expectedReturn,
    expectedInflation,
    yearlyStepUp,
    annualExpenseToday: annualExpense,
    multiplier,
    currentAge,
    maxYears: 35,
  });

  // Handle Persona Selection
  const handleApplyPersona = (p: PersonaPreset) => {
    setActivePersonaId(p.id);
    setActiveMode('quick');
    setCustomTotalMonthly(p.monthlyExpense);
    setCurrentCorpus(p.currentCorpus);
    setCurrentAge(p.age);
    setMonthlySavings(p.monthlySavings);
    setYearlyStepUp(p.yearlyStepUp);
    setExpectedReturn(p.expectedReturn);
    setMultiplier(p.multiplier);
  };

  const handleExpenseChange = (id: string, value: string) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setExpenses((prev) => prev.map((item) => (item.id === id ? { ...item, amount: num } : item)));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCustomExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpName.trim()) return;
    const newItem: ExpenseItem = {
      id: `custom-${Date.now()}`,
      name: newExpName.trim(),
      category: newExpCategory,
      amount: newExpAmount,
    };
    setExpenses((prev) => [...prev, newItem]);
    setNewExpName('');
    setNewExpAmount(10000);
    setShowAddCustom(false);
  };

  const handleResetToDefaults = () => {
    setExpenses(DEFAULT_EXPENSES);
    setCustomTotalMonthly(null);
    setActiveMode('itemized');
    setMultiplier(30);
    setCurrentCorpus(12000000);
    setCurrentAge(40);
    setExpectedReturn(12);
    setExpectedInflation(6.0);
    setMonthlySavings(125000);
    setYearlyStepUp(8);
    setActivePersonaId(null);
  };

  const handleCopySummary = () => {
    const summary = `🔥 FIRE Works Summary (by Ravindra Elicherla)
Monthly Living Burn: ${formatINR(monthlyExpense)}/mo (${formatInCrores(annualExpense)}/yr)
FIRE Multiplier: ${multiplier}× (Safe Withdrawal Rate: ${swrPercent}%)
🎯 Target FIRE Corpus: ${formatInCrores(fireNumber)} (${formatINR(fireNumber)})
Current Portfolio: ${formatInCrores(currentCorpus)} (${progressPercent}% Achieved)
Monthly SIP: ${formatINR(monthlySavings)}/mo (${yearlyStepUp}% annual step-up)
Expected CAGR: ${expectedReturn}% | Inflation: ${expectedInflation}%
🚀 Years to FIRE: ${simulation.yearsToFire !== null ? `${simulation.yearsToFire} Years (At Age ${simulation.fireAge})` : 'Adjust savings'}
Check out FIRE Works!`;

    navigator.clipboard.writeText(summary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Hero Banner & Headline Metric */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-card via-[#0c1629] to-card p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-20 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Flame className="h-4 w-4 fill-primary text-primary" />
              <span>Target Financial Independence Number</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Calculate Your Freedom Number &amp; Runway
            </h2>
            
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Based on <span className="text-foreground font-semibold font-mono">{formatINR(monthlyExpense)}/mo</span> expenses
              ({formatInCrores(annualExpense)}/yr) at a <span className="text-primary font-bold">{multiplier}×</span> annual multiplier ({swrPercent}% SWR).
            </p>

            {/* Step Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-muted-foreground mr-1 text-[11px] uppercase tracking-wider font-semibold">Workflow:</span>
              {[
                { step: '1', title: 'Expenses' },
                { step: '2', title: 'Multiplier' },
                { step: '3', title: 'Runway Engine' },
                { step: '4', title: 'Compounding Chart' },
              ].map((item) => (
                <span
                  key={item.step}
                  className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary flex items-center gap-1"
                >
                  <span className="font-bold">Step {item.step}</span> · {item.title}
                </span>
              ))}
            </div>
          </div>

          {/* Big Target Metric Box */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 bg-background/80 backdrop-blur-xl border border-border/90 rounded-2xl p-6 shadow-xl">
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Target Corpus ({multiplier}×)</span>
                <Badge variant="cyan" className="text-[10px] py-0">
                  {swrPercent}% SWR
                </Badge>
              </div>
              <div className="text-3xl sm:text-5xl font-black tracking-tight text-primary drop-shadow-sm font-mono">
                {formatInCrores(fireNumber)}
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                {formatINR(fireNumber)}
              </div>
            </div>

            <div className="h-16 w-px bg-border/80 hidden sm:block" />

            <div className="space-y-1 border-t sm:border-t-0 border-border/60 pt-3 sm:pt-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Time to Freedom
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {simulation.yearsToFire === 0
                  ? 'Reached! 🎉'
                  : simulation.yearsToFire !== null
                  ? `${simulation.yearsToFire} Yrs`
                  : '35+ Yrs'}
              </div>
              <div className="text-xs text-muted-foreground">
                {simulation.fireAge !== null ? `Retire at Age ${simulation.fireAge} (from Age ${currentAge})` : 'Increase monthly SIP'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persona Presets Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-primary" />
            Quick Setup: Choose an Engineer Persona
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Click any profile to pre-fill realistic tech career figures
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PERSONA_PRESETS.map((p) => {
            const isSelected = activePersonaId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPersona(p)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/60'
                    : 'border-border/80 bg-card/60 hover:bg-card hover:border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-xs">{p.name}</span>
                  <span className="text-[10px] text-primary font-mono">{p.age} yrs</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{p.role}</div>
                <div className="mt-2 text-xs font-mono text-emerald-400 font-semibold">
                  SIP {formatINR(p.monthlySavings)}/mo
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Inputs & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols): Step 1 Expenses & Step 2 Multiplier */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Expenses Card */}
          <Card className="glass-panel border-border/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <StepMark n={1} />
                  <Wallet className="h-4 w-4 text-primary" />
                  Monthly Living Expenses
                </CardTitle>
                <CardDescription>
                  Determine your annual retirement burn rate from realistic living costs
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={activeMode === 'itemized' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveMode('itemized')}
                  className="text-xs h-7 px-2.5"
                >
                  Itemized
                </Button>
                <Button
                  variant={activeMode === 'quick' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setActiveMode('quick');
                    if (customTotalMonthly === null) setCustomTotalMonthly(itemizedMonthlyTotal);
                  }}
                  className="text-xs h-7 px-2.5"
                >
                  Quick Total
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetToDefaults}
                  className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                  title="Reset to defaults"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Category Breakdown Bar (Itemized mode) */}
              {activeMode === 'itemized' && (
                <div className="space-y-1.5 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Category Proportions</span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1 text-primary">
                        <span className="h-2 w-2 rounded-full bg-primary" /> Essentials ({Math.round((essentialsTotal / totalCategorySum) * 100)}%)
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <span className="h-2 w-2 rounded-full bg-amber-400" /> Discretionary ({Math.round((discretionaryTotal / totalCategorySum) * 100)}%)
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> Security ({Math.round((securityTotal / totalCategorySum) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary flex overflow-hidden">
                    <div
                      style={{ width: `${(essentialsTotal / totalCategorySum) * 100}%` }}
                      className="bg-primary transition-all duration-300"
                    />
                    <div
                      style={{ width: `${(discretionaryTotal / totalCategorySum) * 100}%` }}
                      className="bg-amber-400 transition-all duration-300"
                    />
                    <div
                      style={{ width: `${(securityTotal / totalCategorySum) * 100}%` }}
                      className="bg-emerald-400 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Mode 1: Quick Total */}
              {activeMode === 'quick' ? (
                <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/80">
                  <Label htmlFor={customMonthlyInputId} className="text-xs font-semibold text-foreground">
                    Estimated Lump-sum Monthly Expenses (₹)
                  </Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={customMonthlyInputId}
                      type="number"
                      value={customTotalMonthly ?? itemizedMonthlyTotal}
                      onChange={(e) => setCustomTotalMonthly(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="pl-9 text-base font-semibold font-mono"
                      step={5000}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter one combined estimate if you don&apos;t want to itemize category-by-category.
                  </p>
                </div>
              ) : (
                /* Mode 2: Itemized Expenses */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {expenses.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-border/80 bg-background/50 p-2.5 hover:border-border transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Label htmlFor={`exp-${item.id}`} className="text-xs font-medium truncate max-w-[180px]" title={item.name}>
                            {item.name}
                          </Label>
                          <div className="flex items-center gap-1">
                            <Badge
                              variant={
                                item.category === 'Essentials'
                                  ? 'default'
                                  : item.category === 'Discretionary'
                                  ? 'warning'
                                  : 'success'
                              }
                              className="text-[9px] py-0 px-1.5 h-4"
                            >
                              {item.category}
                            </Badge>
                            {expenses.length > 3 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteExpense(item.id)}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-400 p-0.5 transition-opacity"
                                title="Remove item"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="relative">
                          <IndianRupee className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            id={`exp-${item.id}`}
                            type="number"
                            value={item.amount || ''}
                            onChange={(e) => handleExpenseChange(item.id, e.target.value)}
                            className="h-8 pl-7 font-mono text-xs"
                            step={1000}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Item Modal / Toggle */}
                  {!showAddCustom ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddCustom(true)}
                      className="w-full text-xs border-dashed text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Custom Expense Category
                    </Button>
                  ) : (
                    <form onSubmit={handleAddCustomExpense} className="p-3 rounded-xl bg-card border border-primary/30 space-y-2">
                      <div className="text-xs font-semibold text-foreground">Add Custom Expense</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Input
                          placeholder="e.g. Pet Care, Parents Support"
                          value={newExpName}
                          onChange={(e) => setNewExpName(e.target.value)}
                          className="h-8 text-xs"
                          required
                        />
                        <select
                          value={newExpCategory}
                          onChange={(e) => setNewExpCategory(e.target.value as any)}
                          className="h-8 rounded-lg border border-border bg-input px-2 text-xs text-foreground"
                        >
                          <option value="Essentials">Essentials</option>
                          <option value="Discretionary">Discretionary</option>
                          <option value="Security">Security</option>
                        </select>
                        <Input
                          type="number"
                          value={newExpAmount}
                          onChange={(e) => setNewExpAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                          className="h-8 text-xs font-mono"
                          step={1000}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAddCustom(false)}
                          className="h-7 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" size="sm" className="h-7 text-xs">
                          Add Category
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Expense Summary Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-secondary/60 border border-border/80">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold text-lg">
                    Σ
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Total Monthly Expenses
                    </div>
                    <div className="text-xl font-bold text-foreground font-mono">
                      {formatINR(monthlyExpense)}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-border/80 pt-2 sm:pt-0 sm:pl-5 w-full sm:w-auto">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Annual Living Burn (×12)
                  </div>
                  <div className="text-xl font-bold text-emerald-400 font-mono">
                    {formatINR(annualExpense)} <span className="text-xs font-normal text-muted-foreground">({formatInCrores(annualExpense)})</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STEP 2: Multiplier & SWR Configuration */}
          <Card className="glass-panel border-border/80">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <StepMark n={2} />
                  <Target className="h-4 w-4 text-primary" />
                  FIRE Multiplier ({multiplier}× Annual Expenses)
                </CardTitle>
                <Badge variant={multiplier >= 30 ? 'success' : 'warning'} className="font-mono text-xs self-start sm:self-auto">
                  {swrPercent}% Safe Withdrawal Rate
                </Badge>
              </div>
              <CardDescription>
                How many years of annual expenses needed in your portfolio to withstand market cycles &amp; inflation
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Preset Multipliers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { value: 25, label: '25× (4% SWR)', desc: 'Trinity Study (US Standard)' },
                  { value: 30, label: '30× (3.33% SWR)', desc: 'Recommended for India', highlight: true },
                  { value: 33, label: '33× (3.0% SWR)', desc: 'Conservative / Long Horizon' },
                  { value: 40, label: '40× (2.5% SWR)', desc: 'Fat FIRE / High Generosity' },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setMultiplier(preset.value)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      multiplier === preset.value
                        ? 'border-primary bg-primary/15 text-foreground ring-1 ring-primary'
                        : 'border-border/80 bg-background/50 hover:bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <span className="text-xs font-bold text-foreground flex items-center justify-between w-full">
                      {preset.label}
                      {preset.highlight && <span className="text-[10px] text-amber-400 font-normal">★ Best</span>}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                      {preset.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* Fine-Tuning Slider */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Adjust Multiplier: 20× to 50×</span>
                  <span className="font-bold font-mono text-primary text-sm">{multiplier}×</span>
                </div>
                <Slider
                  value={[multiplier]}
                  min={20}
                  max={50}
                  step={1}
                  onValueChange={(val) => setMultiplier(val[0])}
                />
              </div>

              {/* Explainer Box */}
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-3.5 text-xs text-muted-foreground flex gap-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Why 30× or 33× in India?</strong> The classic US &quot;Trinity Study&quot; used 25× (4% rule) based on 2%–3% historical inflation in dollar assets. In India, consumer inflation historically averages 5.5%–7%. A 30× multiplier (3.33% SWR) or 33× (3.0% SWR) ensures your real corpus never gets eroded over 30+ year horizons.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 Cols): Step 3 Portfolio & Runway Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass-panel border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <StepMark n={3} />
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Portfolio Engine &amp; Runway
              </CardTitle>
              <CardDescription>
                Simulate how monthly SIPs and annual salary step-ups accelerate your FIRE timeline
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Current Net Worth */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <Label htmlFor={currentCorpusInputId} className="text-xs text-muted-foreground">
                    Current Portfolio / Net Worth (₹)
                  </Label>
                  <span className="font-mono font-bold text-foreground">
                    {formatInCrores(currentCorpus)}
                  </span>
                </div>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={currentCorpusInputId}
                    type="number"
                    value={currentCorpus}
                    onChange={(e) => setCurrentCorpus(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="pl-9 font-mono text-sm"
                    step={500000}
                  />
                </div>
              </div>

              {/* Current Age Option */}
              <div className="space-y-2.5 p-3.5 rounded-xl bg-background/60 border border-border/80">
                <div className="flex items-center justify-between text-xs">
                  <Label htmlFor={currentAgeInputId} className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Your Current Age</span>
                  </Label>
                  <span className="font-mono font-bold text-primary text-sm px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                    {currentAge} Years Old
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 shrink-0">
                    <Input
                      id={currentAgeInputId}
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(Math.max(18, Math.min(80, parseInt(e.target.value, 10) || 40)))}
                      className="font-mono text-sm h-9 text-center font-bold"
                      min={18}
                      max={80}
                      step={1}
                    />
                  </div>
                  <div className="flex-1">
                    <Slider
                      value={[currentAge]}
                      min={20}
                      max={70}
                      step={1}
                      onValueChange={(val) => setCurrentAge(val[0])}
                    />
                  </div>
                </div>

                {/* Quick Age Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-muted-foreground mr-1 uppercase font-semibold">Presets:</span>
                  {[25, 30, 35, 40, 45, 50, 55, 60].map((agePreset) => (
                    <button
                      key={agePreset}
                      type="button"
                      onClick={() => setCurrentAge(agePreset)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-all ${
                        currentAge === agePreset
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                          : 'bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/60'
                      }`}
                    >
                      {agePreset}y{agePreset === 40 ? ' ★' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">{progressPercent}% Achieved</span>
                  <span className="text-muted-foreground">
                    Shortfall: <span className="text-rose-400 font-mono font-medium">{formatInCrores(shortfall)}</span>
                  </span>
                </div>
                <div className="h-3.5 w-full rounded-full bg-secondary overflow-hidden p-0.5 border border-border/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(100, progressPercent)}%` }}
                  />
                </div>
              </div>

              {/* Monthly SIP & CAGR Parameters */}
              <div className="pt-2 border-t border-border/80 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={monthlySavingsInputId} className="text-[11px] text-muted-foreground">
                      Monthly SIP / Savings (₹)
                    </Label>
                    <Input
                      id={monthlySavingsInputId}
                      type="number"
                      value={monthlySavings}
                      onChange={(e) => setMonthlySavings(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="h-8 font-mono text-xs mt-1"
                      step={10000}
                    />
                  </div>
                  <div>
                    <Label htmlFor={yearlyStepUpInputId} className="text-[11px] text-muted-foreground">
                      Annual Step-up (%)
                    </Label>
                    <Input
                      id={yearlyStepUpInputId}
                      type="number"
                      value={yearlyStepUp}
                      onChange={(e) => setYearlyStepUp(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="h-8 font-mono text-xs mt-1"
                      step={1}
                      min={0}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={expectedReturnInputId} className="text-[11px] text-muted-foreground">
                      Expected Return (CAGR %)
                    </Label>
                    <Input
                      id={expectedReturnInputId}
                      type="number"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(parseFloat(e.target.value) || 0)}
                      className="h-8 font-mono text-xs mt-1"
                      step={0.5}
                    />
                  </div>
                  <div>
                    <Label htmlFor={expectedInflationInputId} className="text-[11px] text-muted-foreground">
                      Expected Inflation (%)
                    </Label>
                    <Input
                      id={expectedInflationInputId}
                      type="number"
                      value={expectedInflation}
                      onChange={(e) => setExpectedInflation(parseFloat(e.target.value) || 0)}
                      className="h-8 font-mono text-xs mt-1"
                      step={0.5}
                    />
                  </div>
                </div>

                {/* Big Estimated Time Box */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">Estimated Time to FIRE</div>
                      <div className="text-[10px] text-muted-foreground">
                        Real Return: {(expectedReturn - expectedInflation).toFixed(1)}% | Step-up: +{yearlyStepUp}%/yr
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                      {simulation.yearsToFire === 0
                        ? 'Achieved Today!'
                        : simulation.yearsToFire !== null
                        ? `${simulation.yearsToFire} Years`
                        : '35+ Years'}
                    </div>
                    {simulation.fireAge !== null && (
                      <div className="text-[11px] font-semibold text-primary">
                        At Age {simulation.fireAge}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Share / Export Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
              className="w-full text-xs h-9 font-medium"
            >
              {copiedNotification ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-1.5" />
                  Copied Summary to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1.5 text-primary" />
                  Copy FIRE Roadmap Summary
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* STEP 4: Interactive Compounding & Runway Chart */}
      <Card className="glass-panel border-border/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <StepMark n={4} />
            <TrendingUp className="h-4 w-4 text-primary" />
            30-Year Compounding Projection &amp; Crossover Milestone
          </CardTitle>
          <CardDescription>
            Interactive timeline charting your accumulated wealth vs inflation-adjusted FIRE targets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProjectionChart
            points={simulation.points}
            yearsToFire={simulation.yearsToFire}
            fireAge={simulation.fireAge}
            fireCorpusAtAchieve={simulation.fireCorpusAtAchieve}
            expectedInflation={expectedInflation}
          />

          {/* Mathematical Calculations & Compounding Assumptions */}
          <CompoundingAssumptions
            expectedReturn={expectedReturn}
            expectedInflation={expectedInflation}
            monthlySavings={monthlySavings}
            yearlyStepUp={yearlyStepUp}
            currentCorpus={currentCorpus}
            annualExpense={annualExpense}
            multiplier={multiplier}
            currentAge={currentAge}
            yearsToFire={simulation.yearsToFire}
            fireAge={simulation.fireAge}
          />
        </CardContent>
      </Card>

      {/* STEP 5: FIRE Archetypes & Variations (Lean, Standard, Fat, Coast, Barista) */}
      <FireTiersPanel
        annualExpense={annualExpense}
        monthlyExpense={monthlyExpense}
        activeMultiplier={multiplier}
        currentCorpus={currentCorpus}
        currentAge={currentAge}
        expectedReturn={expectedReturn}
        expectedInflation={expectedInflation}
      />

      {/* STEP 6: The Engineer's Advantage & Post-FIRE Cashflow Distribution */}
      <CashflowDistribution
        targetCorpus={fireNumber}
        monthlyExpense={monthlyExpense}
        swrPercent={parseFloat(swrPercent)}
      />
    </div>
  );
}
