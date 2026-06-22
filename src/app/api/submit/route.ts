import { NextResponse } from 'next/server';
import { getServiceClient, isSupabaseConfigured } from '@/lib/supabase';
import { runTests } from '@/lib/testRunner';
import {
  mockInsertSubmission,
  mockGetLastAttemptNumber,
  mockGetSubmissionsByCandidate,
  mockUpdateCandidateScore,
} from '@/lib/mockDb';

export async function POST(req: Request) {
  try {
    const { candidate_id, challenge_id, code } = await req.json();

    if (!candidate_id || !challenge_id || code === undefined) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const result = runTests(challenge_id, code);

    if (!isSupabaseConfigured()) {
      // ── mock mode ──────────────────────────────────────────────────────────
      const attempt_number = mockGetLastAttemptNumber(candidate_id, challenge_id) + 1;
      const submission = mockInsertSubmission({
        candidate_id, challenge_id, code,
        score: result.totalScore,
        max_score: result.maxScore,
        passed_tests: result.results.filter(r => r.passed).length,
        total_tests: result.results.length,
        attempt_number,
      });

      const allSubs = mockGetSubmissionsByCandidate(candidate_id);
      const seen = new Set<string>();
      let totalScore = 0, maxScore = 0;
      allSubs.forEach(s => {
        if (!seen.has(s.challenge_id)) {
          seen.add(s.challenge_id);
          totalScore += s.score;
          maxScore += s.max_score;
        }
      });
      mockUpdateCandidateScore(candidate_id, totalScore, maxScore);

      return NextResponse.json({ submission, result });
    }

    // ── real Supabase ──────────────────────────────────────────────────────
    const supabase = getServiceClient();

    const { data: existing } = await supabase
      .from('submissions')
      .select('attempt_number')
      .eq('candidate_id', candidate_id)
      .eq('challenge_id', challenge_id)
      .order('attempt_number', { ascending: false })
      .limit(1)
      .single();

    const attempt_number = (existing?.attempt_number ?? 0) + 1;

    const { data: submission, error } = await supabase
      .from('submissions')
      .insert({
        candidate_id, challenge_id, code,
        score: result.totalScore,
        max_score: result.maxScore,
        passed_tests: result.results.filter(r => r.passed).length,
        total_tests: result.results.length,
        attempt_number,
      })
      .select()
      .single();

    if (error) throw error;

    const { data: allSubs } = await supabase
      .from('submissions')
      .select('score, max_score, challenge_id')
      .eq('candidate_id', candidate_id);

    const seen = new Set<string>();
    let totalScore = 0, maxScore = 0;
    (allSubs ?? []).forEach(s => {
      if (!seen.has(s.challenge_id)) {
        seen.add(s.challenge_id);
        totalScore += s.score;
        maxScore += s.max_score;
      }
    });

    await supabase
      .from('candidates')
      .update({ total_score: totalScore, max_score: maxScore })
      .eq('id', candidate_id);

    return NextResponse.json({ submission, result });
  } catch (err) {
    console.error('POST /api/submit', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
