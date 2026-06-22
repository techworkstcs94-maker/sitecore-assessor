'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TierPreview from './TierPreview';
import { yearsToTier } from '@/lib/utils';
import type { Tier } from '@/types';

export default function RegistrationForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [years, setYears] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const yearsNum = parseInt(years, 10);
  const tier: Tier | null = yearsNum >= 1 ? yearsToTier(yearsNum) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !yearsNum || yearsNum < 1) {
      setError('Please fill in all fields with valid values.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), years_experience: yearsNum }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      router.push(`/session/${data.session_token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-highest)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-ui)',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontFamily: 'var(--font-code)',
    fontSize: '11px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontWeight: 700,
    color: 'var(--text-muted)',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={labelStyle}>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Jane Smith"
          style={inputStyle}
          autoComplete="name"
          required
        />
      </div>
      <div>
        <label style={labelStyle}>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="jane@example.com"
          style={inputStyle}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label style={labelStyle}>Years of Experience</label>
        <input
          type="number"
          min="1"
          max="40"
          value={years}
          onChange={e => setYears(e.target.value)}
          placeholder="e.g. 5"
          style={inputStyle}
          required
        />
        <TierPreview tier={tier} years={yearsNum} />
      </div>

      {error && (
        <div style={{
          background: 'var(--danger-muted)',
          border: '1px solid rgba(255,180,171,0.3)',
          borderRadius: '6px',
          padding: '10px 14px',
          color: 'var(--danger)',
          fontSize: '0.85rem',
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px 24px',
          background: 'var(--accent)',
          color: 'var(--on-accent)',
          border: 'none',
          borderRadius: '8px',
          fontFamily: 'var(--font-ui)',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'opacity 0.15s, transform 0.1s',
        }}
        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = loading ? '0.7' : '1'; }}
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" opacity="0.75" />
            </svg>
            Starting Assessment…
          </>
        ) : (
          <>Begin Assessment →</>

        )}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        By starting you agree that this session is monitored for academic integrity.
      </p>
    </form>
  );
}
