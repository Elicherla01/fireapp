import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'span'> & {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'destructive' | 'secondary' | 'cyan' | 'gold';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors',
        variant === 'default' && 'bg-primary/15 text-primary border border-primary/30',
        variant === 'outline' && 'border border-border/80 text-muted-foreground bg-muted/30',
        variant === 'success' && 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        variant === 'warning' && 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
        variant === 'destructive' && 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground border border-border/50',
        variant === 'cyan' && 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
        variant === 'gold' && 'bg-amber-400/15 text-amber-300 border border-amber-400/30',
        className,
      )}
      {...props}
    />
  );
}
