import type { RunResult, TestResult } from '@/types';
import { getChallengeById } from '@/data/challenges';

export function runTests(challengeId: string, code: string): RunResult {
  const start = Date.now();
  const challenge = getChallengeById(challengeId);

  if (!challenge) {
    return {
      challengeId,
      totalScore: 0,
      maxScore: 0,
      percentage: 0,
      results: [],
      executionTimeMs: Date.now() - start,
    };
  }

  const results: TestResult[] = challenge.tests.map(test => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const fn = new Function('code', test.validator);
      const passed = Boolean(fn(code));
      return {
        testId: test.id,
        name: test.name,
        passed,
        pointsEarned: passed ? test.points : 0,
        pointsPossible: test.points,
        errorMessage: passed ? undefined : test.errorMessage,
      };
    } catch {
      return {
        testId: test.id,
        name: test.name,
        passed: false,
        pointsEarned: 0,
        pointsPossible: test.points,
        errorMessage: test.errorMessage,
      };
    }
  });

  const totalScore = results.reduce((sum, r) => sum + r.pointsEarned, 0);
  const maxScore = results.reduce((sum, r) => sum + r.pointsPossible, 0);

  return {
    challengeId,
    totalScore,
    maxScore,
    percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0,
    results,
    executionTimeMs: Date.now() - start,
  };
}
