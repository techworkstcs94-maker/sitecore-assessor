import type { CheatSeverity } from '@/types';

export const SEVERITY_POINTS: Record<CheatSeverity, number> = {
  low: 1,
  medium: 3,
  high: 8,
  critical: 20,
};
