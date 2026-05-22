import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "text-emerald-500";
  if (score >= 6) return "text-amber-500";
  return "text-coral-500";
}

export function getScoreBg(score: number): string {
  if (score >= 8) return "bg-emerald-50 dark:bg-emerald-900/20";
  if (score >= 6) return "bg-amber-50 dark:bg-amber-900/20";
  return "bg-coral-50 dark:bg-coral-900/20";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Uses UTC methods so server and client always agree on the date string.
// Never use toLocaleDateString() — it produces different output on Node vs browser.
export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

// Comma-formats a number without toLocaleString() to avoid server/client locale mismatch.
export function formatCount(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
