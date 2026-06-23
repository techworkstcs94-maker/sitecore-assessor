'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@/store/sessionStore';
import { TierBadge } from '@/components/ui/Badge';
import { scorePercent } from '@/lib/utils';
import { getChallengesByTier } from '@/data/challenges';
import Spinner from '@/components/ui/Spinner';

export default function CompletePage() {
  const store = useSessionStore();
  const params = useParams();
  const token = params?.token as string;
  const [loadError, setLoadError] = useState(false);

  // Block back navigation to session page
  useEffect(() => {
    window.history.pushState({ completeLock: true }, '');
    const onPopState = () => {
      window.history.pushState({ completeLock: true }, '');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Reload session data from API if store was wiped by a page refresh
  useEffect(() => {
    if (store.candidate || !token) return;
    fetch(`/api/session/${token}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        store.setCandidate(data);
        const challenges = getChallengesByTier(data.level);
        store.setChallenges(challenges);
        if (data.submissions) {
          (data.submissions as unknown[]).forEach(s => {
            const sub = s as Parameters<typeof store.setSubmission>[1];
            store.setSubmission(sub.challenge_id, sub);
          });
        }
      })
      .catch(() => setLoadError(true));
  }, [token]);

  const candidate = store.candidate;

  if (!candidate && !loadError) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <p>Session not found.</p>
          <Link href="/" style={{ color: 'var(--accent)', fontSize: '0.875rem' }}>← Return home</Link>
        </div>
      </div>
    );
  }

  const totalScore = Object.values(store.submissions).reduce((s, sub) => s + sub.score, 0);
  const maxScore   = Object.values(store.submissions).reduce((s, sub) => s + sub.max_score, 0);
  const pct        = scorePercent(totalScore, maxScore);
  const completed  = Object.keys(store.submissions).length;
  const total      = store.challenges.length;

  const performanceLabel = pct >= 80 ? 'Outstanding' : pct >= 60 ? 'Good' : pct >= 40 ? 'Fair' : 'Needs Work';
  const performanceColor = pct >= 80 ? 'var(--success)' : pct >= 60 ? 'var(--accent)' : pct >= 40 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <header style={{
        height: '64px',
        background: 'var(--bg-raised)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        padding: '0 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32, background: 'var(--accent)',
            borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.8rem', color: 'var(--on-accent)',
          }}>SC</div>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent)' }}>Sitecore Assessor</span>
        </div>
      </header>

      {/* Main content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div style={{ maxWidth: '580px', width: '100%' }}>

          {/* Big checkmark hero */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: 80, height: 80,
              background: 'var(--success-muted)',
              border: `2px solid ${performanceColor}`,
              borderRadius: '50%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: `0 0 32px rgba(78,222,163,0.2)`,
              fontSize: '2.5rem',
            }}>
              {pct >= 60 ? '✓' : '✓'}
            </div>

            <div className="label-caps" style={{ color: performanceColor, marginBottom: '8px' }}>
              Assessment Complete — {performanceLabel}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-ui)', fontWeight: 800,
              fontSize: '2rem', letterSpacing: '-0.02em',
              color: 'var(--text-primary)', marginBottom: '10px',
            }}>
              Well done, {candidate.name.split(' ')[0]}!
            </h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto' }}>
              Your responses have been submitted. The recruiter will review your results and reach out soon.
            </p>
          </div>

          {/* Score card */}
          <div className="glass-panel" style={{ borderRadius: '12px', padding: '32px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <TierBadge tier={candidate.level} />
              <span style={{
                fontFamily: 'var(--font-code)', fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}>
                {candidate.email}
              </span>
            </div>

            {/* Score ring + stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'center' }}>
              {/* SVG score circle */}
              <div style={{ position: 'relative', width: 100, height: 100 }}>
                <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-highest)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke={performanceColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out', filter: `drop-shadow(0 0 6px ${performanceColor}60)` }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.3rem', color: performanceColor }}>{pct}%</span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Score', val: `${totalScore}/${maxScore}`, color: 'var(--text-primary)' },
                  { label: 'Completed', val: `${completed}/${total}`, color: 'var(--text-primary)' },
                  { label: 'Percentage', val: `${pct}%`, color: performanceColor },
                  { label: 'Performance', val: performanceLabel, color: performanceColor },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{
                    background: 'var(--bg-overlay)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color }}>{val}</div>
                    <div className="label-caps" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '16px',
          }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Next Steps
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.6 }}>
              The recruiter will review your submission and contact you at{' '}
              <strong style={{ color: 'var(--accent)' }}>{candidate.email}</strong>. You may close this window.
            </p>
          </div>

          <Link href="/" style={{
            display: 'block',
            textAlign: 'center',
            padding: '10px 24px',
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            transition: 'border-color 0.15s, color 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'; }}
          >
            ← Return to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
