import { NextResponse } from 'next/server';
import { getServiceClient, isSupabaseConfigured } from '@/lib/supabase';
import { yearsToTier } from '@/lib/utils';
import {
  mockInsertCandidate,
  mockListCandidatesWithCheatScores,
  mockDeleteCandidate,
} from '@/lib/mockDb';

export async function POST(req: Request) {
  try {
    const { name, email, years_experience } = await req.json();

    if (!name || !email || !years_experience || years_experience < 1) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const level = yearsToTier(years_experience);
    const session_token = crypto.randomUUID();
    const session_started_at = new Date().toISOString();

    if (!isSupabaseConfigured()) {
      // ── mock mode ──────────────────────────────────────────────────────────
      try {
        const candidate = mockInsertCandidate({
          name, email, years_experience, level,
          session_token, session_started_at,
        });
        console.log(`[DEV/MOCK] Session created for ${name} — /session/${session_token}`);
        return NextResponse.json({ session_token: candidate.session_token, level }, { status: 201 });
      } catch (err: unknown) {
        if (err instanceof Error && (err as NodeJS.ErrnoException & { code?: string }).code === '23505') {
          return NextResponse.json({ error: 'An assessment session already exists for this email.' }, { status: 409 });
        }
        throw err;
      }
    }

    // ── real Supabase ──────────────────────────────────────────────────────
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('candidates')
      .insert({ name, email, years_experience, level, session_token, session_started_at })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'An assessment session already exists for this email.' }, { status: 409 });
      }
      throw error;
    }

    console.log(`[Assessment] New session for ${name} <${email}> — /session/${session_token}`);
    return NextResponse.json({ session_token: data.session_token, level }, { status: 201 });
  } catch (err) {
    console.error('POST /api/candidates', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.RECRUITER_PASSWORD}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(mockListCandidatesWithCheatScores());
  }

  const supabase = getServiceClient();
  const { data: candidateData, error } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: cheatData } = await supabase
    .from('cheat_events')
    .select('candidate_id, severity');

  const SEVERITY_POINTS: Record<string, number> = { low: 1, medium: 3, high: 8, critical: 20 };
  const scoreMap: Record<string, number> = {};
  for (const e of (cheatData ?? [])) {
    scoreMap[e.candidate_id] = (scoreMap[e.candidate_id] ?? 0) + (SEVERITY_POINTS[e.severity] ?? 0);
  }

  return NextResponse.json(candidateData.map(c => ({ ...c, cheatScore: scoreMap[c.id] ?? 0 })));
}

export async function DELETE(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.RECRUITER_PASSWORD}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing candidate id' }, { status: 400 });

  if (!isSupabaseConfigured()) {
    const deleted = mockDeleteCandidate(id);
    if (!deleted) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  }

  const supabase = getServiceClient();
  const { error } = await supabase.from('candidates').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
