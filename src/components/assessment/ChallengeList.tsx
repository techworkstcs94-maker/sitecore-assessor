'use client';

import React from 'react';
import type { Challenge, Submission } from '@/types';

interface ChallengeListProps {
  challenges: Challenge[];
  currentId: string | null;
  submissions: Record<string, Submission>;
  onSelect: (id: string) => void;
}

export default function ChallengeList({ challenges, currentId, submissions, onSelect }: ChallengeListProps) {
  return (
    <div style={{ padding: '8px 0' }}>
      {challenges.map((c, idx) => {
        const sub = submissions[c.id];
        const isActive = c.id === currentId;
        const isSolved = !!sub;
        const pct = sub ? Math.round((sub.score / sub.max_score) * 100) : null;
        const scoreColor = pct === null ? null : pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';

        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              width: '100%',
              background: isActive ? 'var(--bg-overlay)' : 'transparent',
              border: 'none',
              borderLeft: `3px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
              padding: '12px 14px',
              textAlign: 'left',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              transition: 'background 0.15s, border-color 0.15s',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
            onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-raised)'; }}
            onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            {/* Row 1: index + title + score */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{
                width: 20, height: 20, flexShrink: 0,
                background: isSolved ? `${scoreColor}20` : 'var(--bg-highest)',
                border: `1px solid ${isSolved ? scoreColor + '50' : 'var(--border)'}`,
                borderRadius: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700,
                fontFamily: 'var(--font-code)',
                color: isSolved ? scoreColor! : 'var(--text-muted)',
                marginTop: '1px',
              }}>
                {isSolved
                  ? <span className="material-symbols-outlined" style={{ fontSize: '0.8rem' }}>check</span>
                  : (idx + 1)
                }
              </span>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 400,
                lineHeight: 1.4,
                flex: 1,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}>
                {c.title}
              </span>
              {isSolved ? (
                <span style={{
                  color: scoreColor!,
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-code)',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  {pct}%
                </span>
              ) : (
                <span style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-code)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  {c.points}pts
                </span>
              )}
            </div>

            {/* Row 2: category + time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '28px' }}>
              <span style={{
                background: 'var(--accent-muted)',
                border: '1px solid rgba(164,230,255,0.15)',
                color: 'var(--accent)',
                borderRadius: '3px',
                padding: '1px 6px',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-code)',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}>{c.category}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontFamily: 'var(--font-code)' }}>
                {c.timeLimit}m
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
