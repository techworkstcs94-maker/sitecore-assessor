'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Submission } from '@/types';
import { getChallengeById } from '@/data/challenges';
import Spinner from '@/components/ui/Spinner';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then(m => m.default),
  { ssr: false, loading: () => <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div> }
);

interface CodeReviewProps {
  submission: Submission;
  showSolution: boolean;
}

export default function CodeReview({ submission, showSolution }: CodeReviewProps) {
  const challenge = getChallengeById(submission.challenge_id);
  if (!challenge) return null;

  const pct = submission.max_score > 0 ? Math.round((submission.score / submission.max_score) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <span>Score: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-code)' }}>{submission.score}/{submission.max_score} ({pct}%)</strong></span>
        <span>Tests: <strong style={{ color: 'var(--text-primary)' }}>{submission.passed_tests}/{submission.total_tests} passed</strong></span>
        <span>Attempt: <strong style={{ color: 'var(--text-primary)' }}>#{submission.attempt_number}</strong></span>
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.06em' }}>SUBMISSION</div>
        <MonacoEditor
          height={280}
          language="typescript"
          value={submission.code}
          options={{
            readOnly: true, minimap: { enabled: false }, fontSize: 12,
            fontFamily: 'JetBrains Mono, monospace', scrollBeyondLastLine: false, wordWrap: 'on',
          }}
          theme="vs-dark"
        />
      </div>
      {showSolution && (
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginBottom: '4px', letterSpacing: '0.06em' }}>MODEL SOLUTION</div>
          <MonacoEditor
            height={280}
            language="typescript"
            value={challenge.solution}
            options={{
              readOnly: true, minimap: { enabled: false }, fontSize: 12,
              fontFamily: 'JetBrains Mono, monospace', scrollBeyondLastLine: false, wordWrap: 'on',
            }}
            theme="vs-dark"
          />
        </div>
      )}
    </div>
  );
}
