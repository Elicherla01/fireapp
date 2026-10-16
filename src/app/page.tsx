'use client';

import React from 'react';
import { FireCalculatorMain } from '@/components/fire/fire-calculator-main';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Flame,
  ShieldCheck,
  Sparkles,
  Share2,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Cpu,
  TrendingUp,
} from 'lucide-react';

export default function FireAppPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Identity */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-cyan-400 to-emerald-400 text-slate-950 font-black shadow-lg shadow-primary/20">
                <Flame className="h-5 w-5 fill-slate-950 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-foreground">
                    FIRE Works
                  </h1>
                  <Badge variant="cyan" className="text-[10px] hidden sm:inline-flex">
                    v1.0 · Public Edition
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground hidden sm:block">
                  Financial Independence &amp; Early Retirement Simulator by Ravindra Elicherla
                </p>
              </div>
            </div>

            {/* Header Right Nav */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Badge variant="outline" className="text-xs font-mono hidden md:inline-flex">
                <span className="h-2 w-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                Vercel Ready
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }
                }}
                className="text-xs h-8"
              >
                <HelpCircle className="h-3.5 w-3.5 mr-1 text-primary" />
                FAQ
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        {/* Main Interactive Calculator Engine */}
        <FireCalculatorMain />

        {/* Deep Dive & Methodology FAQ Section */}
        <section className="space-y-6 pt-6 border-t border-border/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>Methodology &amp; Mathematical Foundations</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              Frequently Asked Questions on FIRE in India
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Key considerations when planning early retirement in high-growth, high-inflation emerging markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">Q:</span> Why is the US 4% Rule (25×) inadequate for India?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The famous 1998 Trinity Study established 4% SWR (25× annual expenses) based on historical US inflation of ~2.5% to 3.5%. In India, domestic CPI inflation historically averages 5.5% to 7.0%, while lifestyle inflation can touch 8%–10%. Retiring at 25× leaves you vulnerable to capital depletion over 30+ year horizons. A <strong>30× (3.33% SWR)</strong> or <strong>33× (3.0% SWR)</strong> portfolio is substantially safer.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">Q:</span> What is Coast FIRE vs Standard FIRE?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Coast FIRE</strong> is the tipping point where your current invested net worth will compound to your ultimate retirement goal by age 58–60 through market returns alone, even if you never invest another rupee. Once you reach Coast FIRE, you can quit high-stress corporate roles and take lower-paying passion jobs that just cover your monthly groceries and rent.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">Q:</span> How does annual SIP step-up affect retirement age?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Because tech professionals experience regular appraisals, bonuses, and title promotions, maintaining a flat SIP is artificial. Stepping up your SIP by just <strong>8% to 10% each year</strong> cuts your accumulation timeline by <strong>4 to 7 years</strong> compared to a fixed monthly investment.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">Q:</span> How do Options generate retirement cashflow?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Traditional financial advice forces retirees to sell shares during bear markets (sequence of returns risk). By setting aside 10%–15% of your portfolio as margin for non-directional, delta-neutral option strategies (like weekly OTM Strangles), you harvest time decay (Theta) to produce 1%–2% monthly cashflow without selling a single equity holding.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/80 bg-card/40 py-10 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                <Flame className="h-4 w-4 fill-primary text-primary" />
              </div>
              <div>
                <div className="font-bold text-foreground text-sm">FIRE Works</div>
                <div className="text-[11px] text-muted-foreground">
                  Architected by Ravindra Elicherla · 25+ Years Enterprise IT &amp; Systematic Trading
                </div>
              </div>
            </div>

            <div className="text-center md:text-right text-[11px]">
              <p className="text-foreground font-medium">
                &quot;Financial independence isn&apos;t about retiring to do nothing — it&apos;s about having the agency to do what matters.&quot;
              </p>
              <p className="text-muted-foreground mt-0.5">
                Ready for one-click deployment on <span className="text-primary font-medium">Vercel</span>.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <span>© {new Date().getFullYear()} FIRE Works · Open Source Educational Calculator</span>
            <span className="flex items-center gap-1">
              Built with precision and care for the global tech community
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
