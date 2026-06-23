import { NextResponse } from 'next/server';
import { challenges } from '@/data/challenges';
import type { Challenge } from '@/types';

const TIER_COLOR: Record<string, string> = {
  beginner: '#4edea3',
  intermediate: '#ffd59c',
  experienced: '#ffb4ab',
};

function escape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderChallenge(ch: Challenge, index: number): string {
  return `
  <div class="challenge${index > 0 ? ' page-break' : ''}">
    <div class="challenge-header">
      <span class="tier-badge" style="background:${TIER_COLOR[ch.tier]}22;color:${TIER_COLOR[ch.tier]};border:1px solid ${TIER_COLOR[ch.tier]}55">
        ${ch.tier.toUpperCase()} · ${ch.category}
      </span>
      <span class="pts">${ch.points} pts · ${ch.timeLimit} min · <code>${ch.id}</code></span>
    </div>
    <h2>${escape(ch.title)}</h2>
    <pre><code>${escape(ch.solution)}</code></pre>
  </div>`;
}

function generateHTML(): string {
  const tiers = ['beginner', 'intermediate', 'experienced'] as const;
  const grouped = tiers.map(tier => ({
    tier,
    list: challenges.filter(c => c.tier === tier),
  }));

  let challengeIndex = 0;
  const body = grouped.map(({ tier, list }) => `
  <div class="tier-section">
    <div class="tier-heading" style="color:${TIER_COLOR[tier]}">
      ${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier — ${list.length} challenges
    </div>
    ${list.map(ch => renderChallenge(ch, challengeIndex++)).join('')}
  </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Sitecore XM Cloud Assessment — Solutions Reference</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #fff;
      color: #1a1a2e;
      padding: 48px;
      max-width: 960px;
      margin: 0 auto;
      font-size: 14px;
      line-height: 1.6;
    }

    /* ── Cover ── */
    .cover {
      text-align: center;
      padding: 80px 0 60px;
      border-bottom: 2px solid #e8eef8;
      margin-bottom: 48px;
    }
    .cover-tag {
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #859399;
      margin-bottom: 16px;
    }
    .cover h1 {
      font-size: 2.4rem;
      font-weight: 800;
      color: #0b1326;
      letter-spacing: -0.02em;
      margin-bottom: 10px;
    }
    .cover h1 span { color: #7C5CFC; }
    .cover-sub {
      font-size: 1rem;
      color: #5a6a7a;
      margin-bottom: 28px;
    }
    .cover-meta {
      display: inline-flex;
      gap: 24px;
      background: #f5f7ff;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 0.85rem;
      color: #4a5568;
    }
    .cover-meta strong { color: #0b1326; }

    /* ── TOC ── */
    .toc { margin-bottom: 48px; }
    .toc h3 { font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: #859399; margin-bottom: 12px; }
    .toc-row { display: flex; justify-content: space-between; align-items: baseline; padding: 4px 0; border-bottom: 1px dotted #e0e0e0; font-size: 0.85rem; }
    .toc-row:last-child { border-bottom: none; }
    .toc-row .pts { color: #859399; font-family: monospace; font-size: 0.8rem; }

    /* ── Tier section ── */
    .tier-heading {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 6px 10px;
      border-radius: 4px;
      margin-bottom: 24px;
      background: #f8fafc;
    }

    /* ── Challenge card ── */
    .challenge { margin-bottom: 40px; }
    .challenge-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .tier-badge {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .pts { font-size: 0.78rem; color: #859399; }
    .pts code { background: #f0f0f0; padding: 1px 4px; border-radius: 3px; font-size: 0.75rem; }
    h2 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0b1326;
      margin-bottom: 10px;
    }
    pre {
      background: #0b1326;
      color: #dae2fd;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      white-space: pre;
      word-break: normal;
    }
    pre code {
      font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
      font-size: 0.78rem;
      line-height: 1.6;
    }

    /* ── Print ── */
    @media print {
      body { padding: 24px; }
      .page-break { page-break-before: always; }
      pre { white-space: pre-wrap; word-break: break-word; }
    }
    @page { margin: 20mm; }
  </style>
</head>
<body>

  <!-- Cover -->
  <div class="cover">
    <div class="cover-tag">Internal Reference — Recruiter Use Only</div>
    <h1>Sitecore XM Cloud<br><span>Developer Assessment</span></h1>
    <div class="cover-sub">Challenge Solutions Reference · ${challenges.length} challenges</div>
    <div class="cover-meta">
      <span><strong>${challenges.filter(c => c.tier === 'beginner').length}</strong> Beginner</span>
      <span><strong>${challenges.filter(c => c.tier === 'intermediate').length}</strong> Intermediate</span>
      <span><strong>${challenges.filter(c => c.tier === 'experienced').length}</strong> Experienced</span>
      <span>Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
    </div>
  </div>

  <!-- TOC -->
  <div class="toc">
    <h3>All Challenges</h3>
    ${challenges.map(ch => `
    <div class="toc-row">
      <span>${ch.title}</span>
      <span class="pts">${ch.tier} · ${ch.points} pts</span>
    </div>`).join('')}
  </div>

  <!-- Solutions -->
  ${body}

  <p style="margin-top:48px;color:#aaa;font-size:0.75rem;text-align:center">
    Sitecore XM Cloud Assessment Portal — Confidential
  </p>

</body>
</html>`;
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const token = new URL(req.url).searchParams.get('token');
  const password = process.env.RECRUITER_PASSWORD;

  if (authHeader !== `Bearer ${password}` && token !== password) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return new Response(generateHTML(), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'inline; filename="sitecore-assessment-solutions.html"',
    },
  });
}
