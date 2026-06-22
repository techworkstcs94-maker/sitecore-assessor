import React from 'react';
import type { RunResult } from '@/types';
import Spinner from '@/components/ui/Spinner';

interface ResultsPanelProps {
  result: RunResult | null;
  isRunning: boolean;
}

function ScoreRing({ pct }: { pct: number }) {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x="50" y="46" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="700" fontFamily="var(--font-code)">
        {pct}%
      </text>
      <text x="50" y="62" textAnchor="middle" fill="var(--text-muted)" fontSize="10">
        score
      </text>
    </svg>
  );
}

export default function ResultsPanel({ result, isRunning }: ResultsPanelProps) {
  if (isRunning) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
        <Spinner size={36} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Running tests…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Run tests to see results here.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <ScoreRing pct={result.percentage} />
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-code)', color: 'var(--text-primary)' }}>
            {result.totalScore} / {result.maxScore}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
            {result.results.filter(r => r.passed).length}/{result.results.length} tests passed
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px', fontFamily: 'var(--font-code)' }}>
            {result.executionTimeMs}ms
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {result.results.map(r => (
          <div
            key={r.testId}
            style={{
              background: r.passed ? 'var(--success-muted)' : 'var(--danger-muted)',
              border: `1px solid ${r.passed ? 'var(--success)' : 'var(--danger)'}`,
              borderRadius: '4px',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                color: r.passed ? 'var(--success)' : 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                {r.passed ? '✓' : '✗'} {r.name}
              </span>
              <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                +{r.pointsEarned}/{r.pointsPossible}
              </span>
            </div>
            {!r.passed && r.errorMessage && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                {r.errorMessage}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
