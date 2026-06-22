import React from 'react';
import type { Tier, CheatSeverity } from '@/types';
import { tierLabel } from '@/lib/utils';

interface TierBadgeProps {
  tier: Tier;
  size?: 'sm' | 'md';
}

const TIER_CONFIG: Record<Tier, { color: string; icon: string }> = {
  beginner:     { color: 'var(--diff-beginner)',     icon: 'school' },
  intermediate: { color: 'var(--diff-intermediate)', icon: 'workspace_premium' },
  experienced:  { color: 'var(--diff-experienced)',  icon: 'military_tech' },
};

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const { color, icon } = TIER_CONFIG[tier];
  const isSmall = size === 'sm';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      background: `${color}18`,
      border: `1px solid ${color}50`,
      borderRadius: '6px',
      padding: isSmall ? '2px 8px' : '4px 12px',
      fontSize: isSmall ? '0.7rem' : '0.8rem',
      color,
      fontFamily: 'var(--font-code)',
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: isSmall ? '0.85rem' : '1rem' }}>
        {icon}
      </span>
      {tierLabel(tier)}
    </span>
  );
}

interface SeverityBadgeProps {
  severity: CheatSeverity;
}

const SEVERITY_STYLES: Record<CheatSeverity, { bg: string; color: string; border: string }> = {
  low:      { bg: 'rgba(164,230,255,0.1)',   color: 'var(--info)',    border: 'rgba(164,230,255,0.3)' },
  medium:   { bg: 'var(--warning-muted)',    color: 'var(--warning)', border: 'rgba(255,213,156,0.3)' },
  high:     { bg: 'var(--danger-muted)',     color: 'var(--danger)',  border: 'rgba(255,180,171,0.3)' },
  critical: { bg: 'rgba(147,0,10,0.2)',      color: '#ff4466',        border: 'rgba(255,68,102,0.4)' },
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const { bg, color, border } = SEVERITY_STYLES[severity];
  return (
    <span style={{
      background: bg,
      color,
      border: `1px solid ${border}`,
      borderRadius: '6px',
      padding: '2px 10px',
      fontSize: '0.7rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontFamily: 'var(--font-code)',
    }}>
      {severity}
    </span>
  );
}

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span style={{
      background: 'var(--accent-muted)',
      border: '1px solid rgba(164,230,255,0.15)',
      color: 'var(--accent)',
      borderRadius: '4px',
      padding: '1px 7px',
      fontSize: '0.7rem',
      fontWeight: 700,
      fontFamily: 'var(--font-code)',
      letterSpacing: '0.03em',
    }}>
      {category}
    </span>
  );
}

interface CheatRiskBadgeProps {
  risk: 'clean' | 'suspicious' | 'flagged';
}

const RISK_STYLES = {
  clean:      { bg: 'rgba(78,222,163,0.1)',   color: 'var(--success)', border: 'rgba(78,222,163,0.3)', icon: 'verified_user' },
  suspicious: { bg: 'var(--warning-muted)',   color: 'var(--warning)', border: 'rgba(255,213,156,0.3)', icon: 'warning' },
  flagged:    { bg: 'var(--danger-muted)',     color: 'var(--danger)',  border: 'rgba(255,180,171,0.3)', icon: 'gpp_bad' },
};

export function CheatRiskBadge({ risk }: CheatRiskBadgeProps) {
  const s = RISK_STYLES[risk];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: '6px',
      padding: '3px 12px',
      fontSize: '0.75rem',
      fontWeight: 700,
      fontFamily: 'var(--font-code)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>{s.icon}</span>
      {risk}
    </span>
  );
}
