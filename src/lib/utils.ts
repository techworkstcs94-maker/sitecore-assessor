import type { Tier } from '@/types';

export function yearsToTier(years: number): Tier {
  if (years <= 4) return 'beginner';
  if (years <= 8) return 'intermediate';
  return 'experienced';
}

export function tierLabel(tier: Tier): string {
  return { beginner: 'Beginner', intermediate: 'Intermediate', experienced: 'Experienced' }[tier];
}

export function tierColor(tier: Tier): string {
  return {
    beginner: 'var(--diff-beginner)',
    intermediate: 'var(--diff-intermediate)',
    experienced: 'var(--diff-experienced)',
  }[tier];
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function scorePercent(score: number, max: number): number {
  return max > 0 ? Math.round((score / max) * 100) : 0;
}

export function cheatScoreColor(score: number): string {
  if (score === 0) return 'var(--success)';
  if (score < 20) return 'var(--warning)';
  return 'var(--danger)';
}

export function cheatRiskLabel(score: number): 'clean' | 'suspicious' | 'flagged' {
  if (score === 0) return 'clean';
  if (score < 20) return 'suspicious';
  return 'flagged';
}

export function cx(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
