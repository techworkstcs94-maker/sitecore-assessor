import React from 'react';
import type { Tier } from '@/types';
import { tierLabel } from '@/lib/utils';

interface TierPreviewProps {
  tier: Tier | null;
  years: number;
}

const TIER_INFO: Record<Tier, {
  desc: string; challenges: number; points: number; time: string;
  color: string; icon: string;
}> = {
  beginner:     { desc: '1–4 years', challenges: 6, points: 300, time: '110 min', color: 'var(--diff-beginner)',     icon: 'school' },
  intermediate: { desc: '5–8 years', challenges: 6, points: 450, time: '160 min', color: 'var(--diff-intermediate)', icon: 'workspace_premium' },
  experienced:  { desc: '9+ years',  challenges: 6, points: 600, time: '220 min', color: 'var(--diff-experienced)',  icon: 'military_tech' },
};

export default function TierPreview({ tier, years }: TierPreviewProps) {
  if (!tier || years < 1) return null;
  const info = TIER_INFO[tier];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: `1px solid ${info.color}`,
      borderLeft: `3px solid ${info.color}`,
      borderRadius: '8px',
      padding: '14px 16px',
      marginTop: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-code)',
            fontSize: '11px',
            letterSpacing: '0.05em',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: info.color,
          }}>
            {tierLabel(tier)}
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{info.desc}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
        {[
          { label: 'Challenges', val: info.challenges.toString() },
          { label: 'Max Score', val: `${info.points} pts` },
          { label: 'Time Limit', val: info.time },
        ].map(({ label, val }) => (
          <div key={label} style={{
            background: 'var(--bg-overlay)',
            borderRadius: '6px',
            padding: '10px',
            textAlign: 'center',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{val}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-code)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
