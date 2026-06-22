/**
 * In-memory mock database — used automatically when NEXT_PUBLIC_SUPABASE_URL
 * is not a real URL (i.e. local dev without Supabase credentials).
 *
 * Data is stored on globalThis so Turbopack's per-module isolation doesn't
 * wipe the arrays when different API route modules import this file.
 */
import type { Candidate, Submission, CheatEvent } from '@/types';
import { SEVERITY_POINTS } from './cheatConstants';

declare global {
  // eslint-disable-next-line no-var
  var __mockCandidates: Candidate[] | undefined;
  // eslint-disable-next-line no-var
  var __mockSubmissions: Submission[] | undefined;
  // eslint-disable-next-line no-var
  var __mockCheatEvents: CheatEvent[] | undefined;
}

globalThis.__mockCandidates ??= [];
globalThis.__mockSubmissions ??= [];
globalThis.__mockCheatEvents ??= [];

const candidates = globalThis.__mockCandidates;
const submissions = globalThis.__mockSubmissions;
const cheatEvents = globalThis.__mockCheatEvents;

function uuid(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

// ── candidates ───────────────────────────────────────────────────────────────

export function mockInsertCandidate(
  data: Omit<Candidate, 'id' | 'created_at' | 'total_score' | 'max_score' | 'session_ended_at'>
): Candidate {
  if (candidates.find(c => c.email === data.email)) {
    throw Object.assign(new Error('Duplicate email'), { code: '23505' });
  }
  const row: Candidate = {
    ...data,
    id: uuid(),
    total_score: 0,
    max_score: 0,
    session_ended_at: null,
    created_at: now(),
  };
  candidates.push(row);
  return row;
}

export function mockGetCandidateByToken(token: string): (Candidate & { submissions: Submission[] }) | null {
  const c = candidates.find(c => c.session_token === token);
  if (!c) return null;
  return { ...c, submissions: submissions.filter(s => s.candidate_id === c.id) };
}

export function mockGetCandidateById(id: string): (Candidate & { submissions: Submission[]; cheat_events: CheatEvent[] }) | null {
  const c = candidates.find(c => c.id === id);
  if (!c) return null;
  return {
    ...c,
    submissions: submissions.filter(s => s.candidate_id === id),
    cheat_events: cheatEvents.filter(e => e.candidate_id === id),
  };
}

export function mockListCandidates(): Candidate[] {
  return [...candidates].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function mockUpdateCandidateScore(id: string, total_score: number, max_score: number) {
  const c = candidates.find(c => c.id === id);
  if (c) { c.total_score = total_score; c.max_score = max_score; }
}

export function mockDeleteCandidate(id: string): boolean {
  const idx = candidates.findIndex(c => c.id === id);
  if (idx === -1) return false;
  candidates.splice(idx, 1);
  const subIdxs = submissions.reduce<number[]>((acc, s, i) => { if (s.candidate_id === id) acc.push(i); return acc; }, []);
  for (let i = subIdxs.length - 1; i >= 0; i--) submissions.splice(subIdxs[i], 1);
  const evtIdxs = cheatEvents.reduce<number[]>((acc, e, i) => { if (e.candidate_id === id) acc.push(i); return acc; }, []);
  for (let i = evtIdxs.length - 1; i >= 0; i--) cheatEvents.splice(evtIdxs[i], 1);
  return true;
}

// ── submissions ───────────────────────────────────────────────────────────────

export function mockInsertSubmission(
  data: Omit<Submission, 'id' | 'submitted_at'>
): Submission {
  const row: Submission = { ...data, id: uuid(), submitted_at: now() };
  submissions.push(row);
  return row;
}

export function mockGetSubmissionsByCandidate(candidate_id: string): Submission[] {
  return submissions
    .filter(s => s.candidate_id === candidate_id)
    .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at));
}

export function mockGetLastAttemptNumber(candidate_id: string, challenge_id: string): number {
  const subs = submissions.filter(s => s.candidate_id === candidate_id && s.challenge_id === challenge_id);
  return subs.length === 0 ? 0 : Math.max(...subs.map(s => s.attempt_number));
}

// ── cheat_events ──────────────────────────────────────────────────────────────

export function mockInsertCheatEvent(
  data: Omit<CheatEvent, 'id' | 'occurred_at'>
): CheatEvent {
  const row: CheatEvent = { ...data, id: uuid(), occurred_at: now() };
  cheatEvents.push(row);
  return row;
}

export function mockGetCheatScore(candidateId: string): number {
  return cheatEvents
    .filter(e => e.candidate_id === candidateId)
    .reduce((sum, e) => sum + SEVERITY_POINTS[e.severity], 0);
}

export function mockListCandidatesWithCheatScores(): (Candidate & { cheatScore: number })[] {
  return mockListCandidates().map(c => ({ ...c, cheatScore: mockGetCheatScore(c.id) }));
}
