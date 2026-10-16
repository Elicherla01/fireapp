import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(val: number, options?: { decimals?: number; showSymbol?: boolean }): string {
  const { decimals = 0, showSymbol = true } = options || {};
  const prefix = showSymbol ? '₹' : '';
  if (isNaN(val)) return `${prefix}0`;

  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  const formattedNumber = abs.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

  return `${sign}${prefix}${formattedNumber}`;
}

export function formatInCrores(val: number): string {
  if (isNaN(val)) return '₹0 Cr';
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (abs >= 10000000) {
    const cr = abs / 10000000;
    return `${sign}₹${cr.toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    const lk = abs / 100000;
    return `${sign}₹${lk.toFixed(2)} Lakh`;
  }
  return `${sign}₹${abs.toLocaleString('en-IN')}`;
}

export function formatCompactINR(val: number): string {
  if (isNaN(val)) return '₹0';
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(1)}Cr`;
  }
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(1)}L`;
  }
  if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(0)}k`;
  }
  return `${sign}₹${abs.toFixed(0)}`;
}
