import { NextResponse } from 'next/server';
import { getServiceClient, isSupabaseConfigured } from '@/lib/supabase';
import type { CheatEvent } from '@/types';
import { SEVERITY_POINTS } from '@/lib/cheatConstants';
import { mockGetCandidateById } from '@/lib/mockDb';

async function getReport(id: string) {
  if (!isSupabaseConfigured()) {
    const data = mockGetCandidateById(id);
    if (!data) return null;
    const cheatScore = data.cheat_events.reduce(
      (sum, e) => sum + SEVERITY_POINTS[e.severity as keyof typeof SEVERITY_POINTS], 0
    );
    return { ...data, cheatScore };
  }

  const supabase = getServiceClient();
  const [candidateRes, submissionsRes, cheatRes] = await Promise.all([
    supabase.from('candidates').select('*').eq('id', id).single(),
    supabase.from('submissions').select('*').eq('candidate_id', id).order('submitted_at', { ascending: true }),
    supabase.from('cheat_events').select('*').eq('candidate_id', id).order('occurred_at', { ascending: true }),
  ]);

  if (candidateRes.error || !candidateRes.data) return null;

  const cheatEvents: CheatEvent[] = cheatRes.data ?? [];
  const cheatScore = cheatEvents.reduce(
    (sum, e) => sum + SEVERITY_POINTS[e.severity as keyof typeof SEVERITY_POINTS], 0
  );

  return {
    ...candidateRes.data,
    submissions: submissionsRes.data ?? [],
    cheat_events: cheatEvents,
    cheatScore,
  };
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authHeader = req.headers.get('authorization');
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const password = process.env.RECRUITER_PASSWORD;

  if (authHeader !== `Bearer ${password}` && token !== password) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const report = await getReport(id);
  if (!report) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });

  if (url.searchParams.get('format') === 'pdf') {
    return new Response(generateReportHTML(report), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="report-${(report as { name: string }).name.replace(/\s+/g, '-')}.html"`,
      },
    });
  }

  return NextResponse.json(report);
}

function generateReportHTML(report: Record<string, unknown>): string {
  const name = report.name as string;
  const email = report.email as string;
  const years = report.years_experience as number;
  const level = report.level as string;
  const totalScore = report.total_score as number;
  const maxScore = report.max_score as number;
  const cheatScore = report.cheatScore as number;
  const subs = (report.submissions as Array<Record<string, unknown>>) ?? [];
  const events = (report.cheat_events as Array<Record<string, unknown>>) ?? [];
  const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Assessment Report — ${name}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #fff; color: #111; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 1.8rem; margin-bottom: 4px; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 32px; }
    .stats { display: flex; gap: 24px; margin-bottom: 32px; flex-wrap: wrap; }
    .stat { background: #f5f5f5; border-radius: 6px; padding: 16px 20px; min-width: 120px; }
    .stat-val { font-size: 1.4rem; font-weight: 700; color: #7C5CFC; }
    .stat-label { font-size: 0.8rem; color: #888; margin-top: 2px; }
    h2 { font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 6px; margin: 24px 0 12px; }
    .sub { background: #f9f9f9; border: 1px solid #eee; border-radius: 4px; margin-bottom: 8px; padding: 12px 16px; }
    .sub-title { font-weight: 600; }
    .sub-score { color: #7C5CFC; font-family: monospace; font-size: 0.9rem; }
    .event { font-size: 0.8rem; border-bottom: 1px solid #eee; padding: 6px 0; display: flex; gap: 12px; }
    .sev-low{color:#4DA6FF}.sev-medium{color:#F5A623}.sev-high{color:#F0476B}.sev-critical{color:#FF2255;font-weight:700}
    pre { background: #f4f4f4; padding: 12px; border-radius: 4px; font-size: 0.75rem; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
  </style>
</head>
<body>
  <h1>${name}</h1>
  <p class="meta">${email} · ${years} years · ${level.charAt(0).toUpperCase() + level.slice(1)} tier</p>
  <div class="stats">
    <div class="stat"><div class="stat-val">${totalScore}/${maxScore}</div><div class="stat-label">Total Score</div></div>
    <div class="stat"><div class="stat-val">${pct}%</div><div class="stat-label">Percentage</div></div>
    <div class="stat"><div class="stat-val">${subs.length}/6</div><div class="stat-label">Challenges</div></div>
    <div class="stat"><div class="stat-val">${cheatScore}</div><div class="stat-label">Cheat Risk</div></div>
  </div>
  <h2>Submissions</h2>
  ${subs.map(s => `
    <div class="sub">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span class="sub-title">${s.challenge_id}</span>
        <span class="sub-score">${s.score}/${s.max_score} · Attempt #${s.attempt_number}</span>
      </div>
      <pre>${String(s.code).slice(0, 1500)}${String(s.code).length > 1500 ? '\n...(truncated)' : ''}</pre>
    </div>`).join('')}
  <h2>Anti-Cheat Events (${events.length})</h2>
  ${events.length === 0
    ? '<p style="color:#22D48F">No suspicious activity detected.</p>'
    : events.map(e => `<div class="event"><span class="sev-${e.severity}">[${String(e.severity).toUpperCase()}]</span><span>${e.event_type}</span><span style="color:#888">${e.detail ?? ''}</span><span style="margin-left:auto;color:#aaa">${new Date(String(e.occurred_at)).toLocaleString()}</span></div>`).join('')}
  <p style="margin-top:40px;color:#aaa;font-size:0.8rem">Generated by Sitecore XM Cloud Assessment Portal</p>
</body>
</html>`;
}
