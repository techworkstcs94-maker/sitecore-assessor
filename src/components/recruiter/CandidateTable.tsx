'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Candidate } from '@/types';
import { TierBadge, CheatRiskBadge } from '@/components/ui/Badge';
import { scorePercent, formatDate, cheatRiskLabel } from '@/lib/utils';

interface CandidateRow extends Candidate {
  cheatScore: number;
}

interface CandidateTableProps {
  candidates: CandidateRow[];
  onDelete: (id: string) => Promise<void>;
}

type SortKey = 'name' | 'level' | 'score' | 'pct' | 'cheatScore' | 'created_at';

export default function CandidateTable({ candidates, onDelete }: CandidateTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterTier, setFilterTier] = useState<string>('all');

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  function exportCSV() {
    const headers = ['Name', 'Email', 'Level', 'Score', 'MaxScore', '%', 'CheatScore', 'Created'];
    const rows = candidates.map(c => [
      c.name, c.email, c.level, c.total_score, c.max_score,
      scorePercent(c.total_score, c.max_score), c.cheatScore, c.created_at,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'candidates.csv';
    a.click();
  }

  const filtered = useMemo(() =>
    candidates
      .filter(c => filterTier === 'all' || c.level === filterTier)
      .sort((a, b) => {
        let av: number | string = 0;
        let bv: number | string = 0;
        if (sortKey === 'name') { av = a.name; bv = b.name; }
        else if (sortKey === 'level') { av = a.level; bv = b.level; }
        else if (sortKey === 'score') { av = a.total_score; bv = b.total_score; }
        else if (sortKey === 'pct') { av = scorePercent(a.total_score, a.max_score); bv = scorePercent(b.total_score, b.max_score); }
        else if (sortKey === 'cheatScore') { av = a.cheatScore; bv = b.cheatScore; }
        else if (sortKey === 'created_at') { av = a.created_at; bv = b.created_at; }
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      }),
    [candidates, filterTier, sortKey, sortDir]
  );

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <th
      onClick={() => toggleSort(k)}
      style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
    >
      {label} {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : ''}
    </th>
  );

  const thStyle: React.CSSProperties = { padding: '10px 14px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em' };
  const tdStyle: React.CSSProperties = { padding: '12px 14px', fontSize: '0.875rem', color: 'var(--text-secondary)', verticalAlign: 'middle' };

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
        <select
          value={filterTier}
          onChange={e => setFilterTier(e.target.value)}
          style={{ background: 'var(--bg-raised)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px 12px', fontSize: '0.875rem', fontFamily: 'var(--font-ui)' }}
        >
          <option value="all">All Tiers</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="experienced">Experienced</option>
        </select>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{filtered.length} candidates</span>
        <button onClick={exportCSV} style={{ marginLeft: 'auto', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-secondary)', padding: '6px 14px', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'var(--font-ui)' }}>
          Export CSV
        </button>
      </div>
      <div style={{ overflowX: 'auto', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <SortBtn k="name" label="NAME" />
              <th style={thStyle}>EMAIL</th>
              <SortBtn k="level" label="LEVEL" />
              <SortBtn k="score" label="SCORE" />
              <th style={thStyle}>MAX</th>
              <SortBtn k="pct" label="%" />
              <SortBtn k="cheatScore" label="CHEAT RISK" />
              <SortBtn k="created_at" label="SUBMITTED" />
              <th style={thStyle}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => {
              const pct = scorePercent(c.total_score, c.max_score);
              const risk = cheatRiskLabel(c.cheatScore);
              return (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-raised)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                  onClick={() => router.push(`/recruiter/candidate/${c.id}`)}
                >
                  <td style={{ ...tdStyle, color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</td>
                  <td style={tdStyle}>{c.email}</td>
                  <td style={tdStyle}><TierBadge tier={c.level} size="sm" /></td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-code)' }}>{c.total_score}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-code)', color: 'var(--text-muted)' }}>{c.max_score}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-code)', color: pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{pct}%</td>
                  <td style={tdStyle}><CheatRiskBadge risk={risk} /></td>
                  <td style={{ ...tdStyle, fontSize: '0.8rem' }}>{formatDate(c.created_at)}</td>
                  <td style={{ ...tdStyle, display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      onClick={e => { e.stopPropagation(); router.push(`/recruiter/candidate/${c.id}`); }}
                      style={{ background: 'var(--accent-muted)', border: 'none', color: 'var(--accent)', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-ui)' }}
                    >
                      Review
                    </button>
                    <button
                      disabled={deletingId === c.id}
                      onClick={async e => {
                        e.stopPropagation();
                        if (!confirm(`Delete ${c.name}? They will be able to re-register.`)) return;
                        setDeletingId(c.id);
                        await onDelete(c.id);
                        setDeletingId(null);
                      }}
                      style={{ background: 'var(--danger-muted)', border: '1px solid rgba(255,180,171,0.3)', color: 'var(--danger)', borderRadius: '4px', padding: '4px 10px', cursor: deletingId === c.id ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-ui)', opacity: deletingId === c.id ? 0.6 : 1 }}
                    >
                      {deletingId === c.id ? '…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No candidates found.</div>
        )}
      </div>
    </div>
  );
}
