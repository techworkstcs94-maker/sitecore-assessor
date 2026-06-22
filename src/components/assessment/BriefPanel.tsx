'use client';

import React, { useState } from 'react';
import type { Challenge } from '@/types';
import { CategoryBadge } from '@/components/ui/Badge';

interface BriefPanelProps {
  challenge: Challenge;
}

export default function BriefPanel({ challenge }: BriefPanelProps) {
  const [hintOpen, setHintOpen] = useState(false);

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <CategoryBadge category={challenge.category} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{challenge.timeLimit} min · {challenge.points} pts</span>
        </div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
          {challenge.title}
        </h2>
        <div
          style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: challenge.brief }}
        />
      </div>

      <div>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: '10px' }}>
          TASKS
        </h3>
        <ol style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
          {challenge.tasks.map((task, i) => (
            <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <span dangerouslySetInnerHTML={{ __html: task }} />
            </li>
          ))}
        </ol>
      </div>

      <div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              POINTS BREAKDOWN
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {challenge.tests.map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t.name}</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-code)' }}>{t.points}pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <button
          onClick={() => setHintOpen(h => !h)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '0.8rem',
            display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
          }}
        >
          <span>{hintOpen ? '▾' : '▸'}</span>
          <span>Show Hint</span>
        </button>
        {hintOpen && (
          <div style={{
            marginTop: '10px',
            background: 'var(--warning-muted)',
            border: '1px solid var(--warning)',
            borderRadius: '4px',
            padding: '12px',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
            💡 {challenge.hint}
          </div>
        )}
      </div>
    </div>
  );
}
