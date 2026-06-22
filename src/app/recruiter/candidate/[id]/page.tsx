'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Candidate, Submission, CheatEvent } from '@/types';
import ScoreCard from '@/components/recruiter/ScoreCard';
import CheatTimeline from '@/components/recruiter/CheatTimeline';
import CodeReview from '@/components/recruiter/CodeReview';
import { getChallengeById } from '@/data/challenges';
import Spinner from '@/components/ui/Spinner';
import { SEVERITY_POINTS } from '@/lib/cheatConstants';

interface CandidateDetail extends Candidate {
  submissions: Submission[];
  cheat_events: CheatEvent[];
}

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSubmissions, setOpenSubmissions] = useState<Record<string, boolean>>({});
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = sessionStorage.getItem('recruiter_token');
    if (!token) { router.push('/recruiter'); return; }

    async function load() {
      try {
        const res = await fetch(`/api/recruiter/report/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { router.push('/recruiter/dashboard'); return; }
        const data = await res.json();
        setCandidate(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size={36} />
    </div>
  );

  if (!candidate) return null;

  const cheatScore = (candidate.cheat_events ?? []).reduce((sum, e) => sum + SEVERITY_POINTS[e.severity], 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: '64px',
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        padding: '0 32px',
      }}>
        <div style={{
          maxWidth: '1200px', width: '100%', margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <button
            onClick={() => router.push('/recruiter/dashboard')}
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--text-secondary)',
              padding: '6px 14px', cursor: 'pointer',
              fontSize: '0.85rem', fontFamily: 'var(--font-ui)',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
          >
            ← Dashboard
          </button>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            / Candidate Detail
          </span>
          <button
            onClick={() => window.open(`/api/recruiter/report/${id}?format=pdf&token=${sessionStorage.getItem('recruiter_token')}`, '_blank')}
            style={{
              marginLeft: 'auto',
              background: 'var(--accent-muted)',
              border: '1px solid rgba(164,230,255,0.3)',
              borderRadius: '8px', color: 'var(--accent)',
              padding: '6px 16px', cursor: 'pointer',
              fontSize: '0.85rem', fontFamily: 'var(--font-ui)', fontWeight: 600,
              transition: 'background 0.15s',
            }}
          >
            ↓ Download Report
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <ScoreCard candidate={candidate} submissions={candidate.submissions ?? []} cheatScore={cheatScore} />

          {/* Submissions accordion */}
          <section style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Challenge Submissions
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                {(candidate.submissions ?? []).length} submission{(candidate.submissions ?? []).length !== 1 ? 's' : ''} recorded
              </p>
            </div>

            <div>
              {(candidate.submissions ?? []).map(sub => {
                const challenge = getChallengeById(sub.challenge_id);
                const pct = sub.max_score > 0 ? Math.round((sub.score / sub.max_score) * 100) : 0;
                const open = openSubmissions[sub.id];
                const scoreColor = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';

                return (
                  <div key={sub.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <button
                      onClick={() => setOpenSubmissions(prev => ({ ...prev, [sub.id]: !open }))}
                      style={{
                        width: '100%', background: open ? 'var(--bg-overlay)' : 'none',
                        border: 'none', padding: '16px 24px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (!open) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-raised)'; }}
                      onMouseLeave={e => { if (!open) (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{
                          width: 28, height: 28,
                          background: `${scoreColor}1A`,
                          border: `1px solid ${scoreColor}40`,
                          borderRadius: '6px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: 700, color: scoreColor,
                          fontFamily: 'var(--font-code)',
                        }}>{pct}%</span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{challenge?.title ?? sub.challenge_id}</div>
                          <div className="label-caps" style={{ color: 'var(--text-muted)', marginTop: '1px' }}>{challenge?.category}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{
                          fontFamily: 'var(--font-code)', fontSize: '0.875rem',
                          color: scoreColor, fontWeight: 600,
                        }}>
                          {sub.score}/{sub.max_score} pts
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-code)' }}>
                          Attempt #{sub.attempt_number}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', transition: 'transform 0.15s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          ▾
                        </span>
                      </div>
                    </button>

                    {open && (
                      <div style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', background: 'var(--bg-highest)' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <button
                            onClick={() => setShowSolution(prev => ({ ...prev, [sub.id]: !prev[sub.id] }))}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              background: 'none',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              color: 'var(--text-secondary)',
                              padding: '5px 12px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontFamily: 'var(--font-ui)',
                            }}
                          >
                            {showSolution[sub.id] ? 'Hide' : 'View'} Model Solution
                          </button>
                        </div>
                        <CodeReview submission={sub} showSolution={showSolution[sub.id] ?? false} />
                      </div>
                    )}
                  </div>
                );
              })}

              {(!candidate.submissions || candidate.submissions.length === 0) && (
                <div style={{
                  padding: '48px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>inbox</span>
                  <p style={{ fontSize: '0.9rem' }}>No submissions yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Anti-cheat timeline */}
          <section style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Anti-Cheat Timeline
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                  {candidate.cheat_events?.length ?? 0} events detected
                </p>
              </div>
              <div style={{
                background: cheatScore > 20 ? 'var(--danger-muted)' : cheatScore > 5 ? 'var(--warning-muted)' : 'var(--success-muted)',
                border: `1px solid ${cheatScore > 20 ? 'rgba(255,180,171,0.3)' : cheatScore > 5 ? 'rgba(255,213,156,0.3)' : 'rgba(78,222,163,0.3)'}`,
                borderRadius: '8px', padding: '6px 14px',
                fontSize: '0.85rem', fontWeight: 600,
                color: cheatScore > 20 ? 'var(--danger)' : cheatScore > 5 ? 'var(--warning)' : 'var(--success)',
              }}>
                {cheatScore > 20 ? '⚠' : cheatScore > 5 ? '!' : '✓'} {cheatScore} risk pts
              </div>
            </div>
            <div style={{ padding: '16px 24px' }}>
              <CheatTimeline events={candidate.cheat_events ?? []} />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
