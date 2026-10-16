export interface ExpenseItem {
  id: string;
  name: string;
  category: 'Essentials' | 'Security' | 'Discretionary';
  amount: number;
}

export interface PersonaPreset {
  id: string;
  name: string;
  role: string;
  age: number;
  targetAge: number;
  monthlyExpense: number;
  currentCorpus: number;
  monthlySavings: number;
  yearlyStepUp: number;
  expectedReturn: number;
  multiplier: number;
  description: string;
}

export const DEFAULT_EXPENSES: ExpenseItem[] = [
  { id: 'rent', name: 'Housing (Rent / Home EMI / Maintenance)', category: 'Essentials', amount: 45000 },
  { id: 'groceries', name: 'Groceries, Daily Supplies & Cook', category: 'Essentials', amount: 25000 },
  { id: 'utilities', name: 'Utilities (Electricity, Wi-Fi, Phone, Gas)', category: 'Essentials', amount: 8000 },
  { id: 'education', name: 'Children Education & Extra-curricular', category: 'Essentials', amount: 20000 },
  { id: 'healthcare', name: 'Healthcare, Health & Super Top-up Insurance', category: 'Security', amount: 10000 },
  { id: 'transport', name: 'Transport, Fuel & Vehicle Maintenance', category: 'Essentials', amount: 12000 },
  { id: 'lifestyle', name: 'Dining Out, Movies, Shopping & Weekend', category: 'Discretionary', amount: 15000 },
  { id: 'vacation', name: 'Annual Travel & Vacations (Amortized/Mo)', category: 'Discretionary', amount: 15000 },
  { id: 'buffer', name: 'Family & Emergency Contingency Buffer', category: 'Security', amount: 10000 },
];

export const PERSONA_PRESETS: PersonaPreset[] = [
  {
    id: 'young-sde',
    name: 'Young Engineer',
    role: 'SDE-2 / Cloud Engineer',
    age: 26,
    targetAge: 38,
    monthlyExpense: 60000,
    currentCorpus: 2500000, // ₹25L
    monthlySavings: 100000, // ₹1L/mo
    yearlyStepUp: 12, // 12% salary step-up
    expectedReturn: 13, // 13% CAGR (high equity)
    multiplier: 30,
    description: 'Aggressive accumulation phase with high savings rate and step-up SIPs.',
  },
  {
    id: 'tech-lead',
    name: 'Tech Lead / Staff',
    role: 'Engineering Lead / Architect',
    age: 35,
    targetAge: 45,
    monthlyExpense: 150000,
    currentCorpus: 15000000, // ₹1.5 Cr
    monthlySavings: 200000, // ₹2L/mo
    yearlyStepUp: 8,
    expectedReturn: 12,
    multiplier: 30,
    description: 'Balancing home, family expenses with strong equity SIPs and bonus allocations.',
  },
  {
    id: 'principal-director',
    name: 'Director / Principal',
    role: 'Senior Director / VP Eng',
    age: 44,
    targetAge: 50,
    monthlyExpense: 250000,
    currentCorpus: 45000000, // ₹4.5 Cr
    monthlySavings: 350000, // ₹3.5L/mo
    yearlyStepUp: 5,
    expectedReturn: 11,
    multiplier: 33,
    description: 'Approaching Financial Independence with focus on wealth preservation and options cashflow.',
  },
  {
    id: 'coast-fire',
    name: 'Coast FIRE Aspirant',
    role: 'Consultant / Indie Builder',
    age: 32,
    targetAge: 45,
    monthlyExpense: 90000,
    currentCorpus: 8000000, // ₹80L
    monthlySavings: 50000, // ₹50k/mo
    yearlyStepUp: 5,
    expectedReturn: 12,
    multiplier: 30,
    description: 'Wants to reach Coast milestone early, then transition to passion projects or consulting.',
  },
];

export interface YearlySimulationPoint {
  year: number;
  age: number;
  corpus: number;
  investedCapital: number;
  totalGains: number;
  monthlySip: number;
  fireTargetNominal: number;
  fireTargetReal: number;
  isFireReached: boolean;
}

export function simulateRunway(params: {
  currentCorpus: number;
  monthlySavings: number;
  expectedReturn: number; // e.g. 12%
  expectedInflation: number; // e.g. 6%
  yearlyStepUp: number; // e.g. 10%
  annualExpenseToday: number;
  multiplier: number;
  currentAge: number;
  maxYears?: number;
}): {
  points: YearlySimulationPoint[];
  yearsToFire: number | null;
  fireAge: number | null;
  fireCorpusAtAchieve: number;
  targetCorpusNominalAtAchieve: number;
} {
  const {
    currentCorpus,
    monthlySavings,
    expectedReturn,
    expectedInflation,
    yearlyStepUp,
    annualExpenseToday,
    multiplier,
    currentAge,
    maxYears = 35,
  } = params;

  const points: YearlySimulationPoint[] = [];
  let corpus = currentCorpus;
  let investedCapital = currentCorpus;
  let currentSip = monthlySavings;
  const monthlyNominalReturn = expectedReturn / 100 / 12;
  const stepUpMultiplier = 1 + yearlyStepUp / 100;
  const inflationMultiplier = 1 + expectedInflation / 100;

  const baseFireTarget = annualExpenseToday * multiplier;
  let fireTargetNominal = baseFireTarget;
  let yearsToFire: number | null = null;
  let fireAge: number | null = null;
  let fireCorpusAtAchieve = 0;
  let targetCorpusNominalAtAchieve = 0;

  // Initial Year 0
  points.push({
    year: 0,
    age: currentAge,
    corpus: Math.round(corpus),
    investedCapital: Math.round(investedCapital),
    totalGains: Math.max(0, Math.round(corpus - investedCapital)),
    monthlySip: Math.round(currentSip),
    fireTargetNominal: Math.round(fireTargetNominal),
    fireTargetReal: Math.round(baseFireTarget),
    isFireReached: corpus >= fireTargetNominal,
  });

  if (corpus >= fireTargetNominal && yearsToFire === null) {
    yearsToFire = 0;
    fireAge = currentAge;
    fireCorpusAtAchieve = corpus;
    targetCorpusNominalAtAchieve = fireTargetNominal;
  }

  for (let yr = 1; yr <= maxYears; yr++) {
    // 12 monthly steps within year
    for (let m = 1; m <= 12; m++) {
      corpus = corpus * (1 + monthlyNominalReturn) + currentSip;
      investedCapital += currentSip;

      // Check crossover month-by-month
      const intraYearInflationFactor = Math.pow(inflationMultiplier, yr - 1 + m / 12);
      const currentNominalTarget = baseFireTarget * intraYearInflationFactor;

      if (corpus >= currentNominalTarget && yearsToFire === null) {
        yearsToFire = Number(((yr - 1) + m / 12).toFixed(1));
        fireAge = Math.round((currentAge + yearsToFire) * 10) / 10;
        fireCorpusAtAchieve = Math.round(corpus);
        targetCorpusNominalAtAchieve = Math.round(currentNominalTarget);
      }
    }

    // Step up SIP for next year
    currentSip *= stepUpMultiplier;

    // Inflation compounded on target
    fireTargetNominal = baseFireTarget * Math.pow(inflationMultiplier, yr);

    points.push({
      year: yr,
      age: currentAge + yr,
      corpus: Math.round(corpus),
      investedCapital: Math.round(investedCapital),
      totalGains: Math.max(0, Math.round(corpus - investedCapital)),
      monthlySip: Math.round(currentSip),
      fireTargetNominal: Math.round(fireTargetNominal),
      fireTargetReal: Math.round(baseFireTarget),
      isFireReached: corpus >= fireTargetNominal,
    });
  }

  return {
    points,
    yearsToFire,
    fireAge,
    fireCorpusAtAchieve,
    targetCorpusNominalAtAchieve,
  };
}

export function calculateCoastFireCorpus(
  targetCorpusAtRetirement: number,
  yearsToGrow: number,
  expectedReturn: number,
  expectedInflation: number
): number {
  if (yearsToGrow <= 0) return targetCorpusAtRetirement;
  const realReturnRate = (expectedReturn - expectedInflation) / 100;
  if (realReturnRate <= 0) return targetCorpusAtRetirement;
  return Math.round(targetCorpusAtRetirement / Math.pow(1 + realReturnRate, yearsToGrow));
}
