'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Candidate, CheatEvent } from '@/types';
import CandidateTable from '@/components/recruiter/CandidateTable';
import Spinner from '@/components/ui/Spinner';

interface CandidateWithCheat extends Candidate {
  cheatScore: number;
  cheatEvents?: CheatEvent[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<CandidateWithCheat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('recruiter_token');
    if (!token) { router.push('/recruiter'); return; }

    async function load() {
      try {
        const res = await fetch('/api/candidates', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { router.push('/recruiter'); return; }
        const data: (Candidate & { cheatScore?: number })[] = await res.json();
        setCandidates(data.map(c => ({ ...c, cheatScore: c.cheatScore ?? 0 })));
      } catch {
        setError('Failed to load candidates.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleDelete(id: string) {
    const token = sessionStorage.getItem('recruiter_token');
    if (!token) return;
    try {
      await fetch('/api/candidates', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setCandidates(prev => prev.filter(c => c.id !== id));
    } catch {
      setError('Failed to delete candidate.');
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size={36} />
    </div>
  );

  const stats = [
    { val: candidates.length, label: 'Total Candidates', sub: 'All submissions', color: 'var(--accent)' },
    { val: candidates.filter(c => c.level === 'beginner').length,     label: 'Beginner',      sub: '1–4 years', color: 'var(--diff-beginner)' },
    { val: candidates.filter(c => c.level === 'intermediate').length,  label: 'Intermediate',  sub: '5–8 years', color: 'var(--diff-intermediate)' },
    { val: candidates.filter(c => c.level === 'experienced').length,   label: 'Experienced',   sub: '9+ years',  color: 'var(--diff-experienced)' },
  ];

  const avgScore = candidates.length > 0
    ? Math.round(candidates.reduce((s, c) => s + (c.max_score > 0 ? (c.total_score / c.max_score) * 100 : 0), 0) / candidates.length)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: '64px', background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 32px',
      }}>
        <div style={{
          maxWidth: '1440px', width: '100%', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 32, height: 32, flexShrink: 0,
                background: 'var(--accent)', borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.8rem', color: 'var(--on-accent)',
              }}>SC</div>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent)' }}>
                Sitecore Assessor
              </span>
            </div>
            <span style={{
              color: 'var(--accent)', fontWeight: 700, fontSize: '0.875rem',
              borderBottom: '2px solid var(--accent)', paddingBottom: '2px',
            }}>
              Dashboard
            </span>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {candidates.length > 0 && (
              <span style={{
                background: 'rgba(78,222,163,0.1)',
                border: '1px solid rgba(78,222,163,0.25)',
                borderRadius: '6px', padding: '4px 12px',
                fontSize: '0.8rem', color: 'var(--success)',
                fontFamily: 'var(--font-code)',
              }}>
                avg {avgScore}%
              </span>
            )}
            <button
              onClick={() => {
                const token = sessionStorage.getItem('recruiter_token');
                window.open(`/api/recruiter/solutions-pdf?token=${encodeURIComponent(token ?? '')}`, '_blank');
              }}
              style={{
                background: 'var(--accent-muted)', border: '1px solid rgba(164,230,255,0.3)',
                borderRadius: '8px', color: 'var(--accent)',
                padding: '6px 16px', cursor: 'pointer',
                fontSize: '0.85rem', fontFamily: 'var(--font-ui)', fontWeight: 600,
              }}
            >
              ↓ Solutions PDF
            </button>
            <button
              onClick={() => { sessionStorage.removeItem('recruiter_token'); router.push('/recruiter'); }}
              style={{
                background: 'none', border: '1px solid var(--border)',
                borderRadius: '8px', color: 'var(--text-secondary)',
                padding: '6px 16px', cursor: 'pointer',
                fontSize: '0.85rem', fontFamily: 'var(--font-ui)',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>

        {/* Page title */}
        <div style={{ marginBottom: '28px' }}>
          <div className="label-caps" style={{ color: 'var(--success)', marginBottom: '6px' }}>Recruiter Portal</div>
          <h1 style={{
            fontFamily: 'var(--font-ui)', fontWeight: 800,
            fontSize: '1.75rem', letterSpacing: '-0.02em', color: 'var(--text-primary)',
          }}>Assessment Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} registered
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-muted)', border: '1px solid rgba(255,180,171,0.3)',
            borderRadius: '8px', padding: '12px 16px',
            color: 'var(--danger)', marginBottom: '24px', fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {stats.map(({ val, label, sub, color }) => (
            <div key={label} style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderRadius: '12px', padding: '24px',
              transition: 'border-color 0.2s', cursor: 'default',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div className="label-caps" style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>{sub}</div>
              <div style={{
                fontFamily: 'var(--font-ui)', fontSize: '2.25rem', fontWeight: 800,
                letterSpacing: '-0.02em', color, marginBottom: '4px',
              }}>{val}</div>
              <div className="label-caps" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Candidates table */}
        <section style={{
          background: 'var(--bg-raised)',
          border: '1px solid var(--border)',
          borderRadius: '12px', overflow: 'hidden',
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>All Candidates</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                Click a row to view the full candidate report
              </p>
            </div>
          </div>
          <CandidateTable candidates={candidates} onDelete={handleDelete} />
        </section>
      </main>
    </div>
  );
}
