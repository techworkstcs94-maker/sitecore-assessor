import React from 'react';
import type { Candidate, Submission } from '@/types';
import { TierBadge, CheatRiskBadge } from '@/components/ui/Badge';
import { scorePercent, cheatRiskLabel } from '@/lib/utils';

interface ScoreCardProps {
  candidate: Candidate;
  submissions: Submission[];
  cheatScore: number;
}

export default function ScoreCard({ candidate, submissions, cheatScore }: ScoreCardProps) {
  const totalScore = submissions.reduce((s, sub) => s + sub.score, 0);
  const maxScore = submissions.reduce((s, sub) => s + sub.max_score, 0);
  const pct = scorePercent(totalScore, maxScore);
  const risk = cheatRiskLabel(cheatScore);

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{candidate.name}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '8px' }}>{candidate.email} · {candidate.years_experience} years exp.</p>
        <TierBadge tier={candidate.level} />
      </div>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Score', val: `${totalScore}/${maxScore}`, mono: true },
          { label: 'Percentage', val: `${pct}%`, mono: true, color: pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)' },
          { label: 'Challenges', val: `${submissions.length}/6` },
        ].map(({ label, val, mono, color }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: mono ? 'var(--font-code)' : 'var(--font-ui)', color: color ?? 'var(--text-primary)' }}>{val}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '6px' }}>
            <CheatRiskBadge risk={risk} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cheat Risk ({cheatScore}pts)</div>
        </div>
      </div>
    </div>
  );
}
