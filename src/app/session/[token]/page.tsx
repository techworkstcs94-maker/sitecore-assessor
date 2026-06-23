'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/sessionStore';
import { getChallengesByTier, getTotalTimeLimitForTier } from '@/data/challenges';
import { AntiCheatMonitor } from '@/lib/antiCheat';
import { runTests } from '@/lib/testRunner';
import type { CheatEventType, CheatSeverity } from '@/types';

import ChallengeList from '@/components/assessment/ChallengeList';
import CodeEditor from '@/components/assessment/CodeEditor';
import BriefPanel from '@/components/assessment/BriefPanel';
import ResultsPanel from '@/components/assessment/ResultsPanel';
import PreviewPanel from '@/components/assessment/PreviewPanel';
import SessionTimer from '@/components/assessment/SessionTimer';
import ProgressBar from '@/components/assessment/ProgressBar';
import AntiCheatBanner from '@/components/assessment/AntiCheatBanner';
import Modal from '@/components/ui/Modal';
import { TierBadge } from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const store = useSessionStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [flaggedModal, setFlaggedModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const monitorRef = useRef<AntiCheatMonitor | null>(null);
  const sessionFinishedRef = useRef(false);

  const currentChallenge = store.challenges.find(c => c.id === store.currentChallengeId) ?? null;

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(`session-complete-${token}`)) {
      router.replace(`/session/${token}/complete`);
      return;
    }

    async function load() {
      try {
        const res = await fetch(`/api/session/${token}`);
        if (!res.ok) { setError('Session not found. Please check your link.'); return; }
        const data = await res.json();

        store.setCandidate(data);
        const challenges = getChallengesByTier(data.level);
        store.setChallenges(challenges);

        if (data.submissions) {
          (data.submissions as unknown[]).forEach(s => {
            const sub = s as Parameters<typeof store.setSubmission>[1];
            store.setSubmission(sub.challenge_id, sub);
          });
        }
      } catch {
        setError('Failed to load session. Please refresh.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  useEffect(() => {
    if (!store.candidate) return;

    const monitor = new AntiCheatMonitor({
      candidateId: store.candidate.id,
      onEvent: async (type: CheatEventType, severity: CheatSeverity, detail?: string) => {
        store.addCheatEvent({
          id: crypto.randomUUID(),
          candidate_id: store.candidate!.id,
          event_type: type,
          detail: detail ?? null,
          severity,
          occurred_at: new Date().toISOString(),
        });
        await fetch('/api/cheat-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidate_id: store.candidate!.id, event_type: type, detail, severity }),
        }).catch(() => {});
      },
      onWarning: (msg: string) => setWarningMessage(msg),
      onSessionFlag: () => { store.setSessionFlagged(); setFlaggedModal(true); },
    });

    monitor.start();
    monitorRef.current = monitor;
    return () => monitor.stop();
  }, [store.candidate?.id]);

  // ── Navigation lock ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!store.candidate) return;

    // Push a dummy history entry so the first back-press hits it, not leaves the page
    window.history.pushState({ sessionLock: true }, '');

    const onPopState = () => {
      if (sessionFinishedRef.current) return;
      // Re-push to keep them on the page
      window.history.pushState({ sessionLock: true }, '');
      monitorRef.current?.reportEvent('NAVIGATION_ATTEMPT', 'medium', 'Back/forward navigation attempted during assessment');
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (sessionFinishedRef.current) return;
      e.preventDefault();
      e.returnValue = '';
      monitorRef.current?.reportEvent('NAVIGATION_ATTEMPT', 'high', 'Candidate attempted to refresh or close the tab');
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [store.candidate]);

  const handleRunTests = useCallback(() => {
    if (!currentChallenge || store.isRunning || store.sessionFlagged) return;
    store.setIsRunning(true);
    store.setActivePanel('results');
    setTimeout(() => {
      const code = store.code[currentChallenge.id] ?? '';
      const result = runTests(currentChallenge.id, code);
      store.setRunResult(currentChallenge.id, result);
      store.setIsRunning(false);
    }, 300);
  }, [currentChallenge, store]);

  const handleSubmit = useCallback(async () => {
    if (!currentChallenge || !store.candidate || submitting || store.sessionFlagged) return;
    setSubmitting(true);
    try {
      const code = store.code[currentChallenge.id] ?? '';
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: store.candidate.id,
          challenge_id: currentChallenge.id,
          code,
        }),
      });
      const data = await res.json();
      if (data.submission) {
        store.setSubmission(currentChallenge.id, data.submission);
        store.setRunResult(currentChallenge.id, data.result);
        store.setActivePanel('results');
        if (monitorRef.current) {
          monitorRef.current.logMultipleSubmissions(currentChallenge.id, data.submission.attempt_number);
        }
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  }, [currentChallenge, store, submitting]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <Spinner size={40} />
    </div>
  );

  if (error) return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', gap: '12px',
    }}>
      <span className="material-symbols-outlined" style={{ color: 'var(--danger)', fontSize: '3rem' }}>error</span>
      <p style={{ color: 'var(--danger)', fontSize: '1rem', fontWeight: 600 }}>{error}</p>
    </div>
  );

  if (!currentChallenge) return null;

  const totalSeconds = getTotalTimeLimitForTier(store.candidate?.level ?? 'beginner') * 60;
  const completedCount = Object.keys(store.submissions).length;
  const filename = currentChallenge.title.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '') + '.tsx';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <AntiCheatBanner message={warningMessage} onDismiss={() => setWarningMessage(null)} />

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div style={{
        height: '52px',
        background: 'var(--bg-raised)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 30, height: 30,
            background: 'var(--accent)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 800,
            color: 'var(--on-accent)',
          }}>SC</div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
            {store.candidate?.name}
          </span>
          {store.candidate?.level && <TierBadge tier={store.candidate.level} size="sm" />}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {store.sessionFlagged && (
            <div style={{
              background: 'var(--danger-muted)',
              border: '1px solid rgba(255,180,171,0.3)',
              borderRadius: '6px', padding: '4px 10px',
              fontSize: '0.75rem', fontWeight: 700,
              color: 'var(--danger)', fontFamily: 'var(--font-code)',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              ⚠ Session Flagged
            </div>
          )}
          <button
            onClick={() => {
              sessionFinishedRef.current = true;
              monitorRef.current?.finish();
              if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
              localStorage.setItem(`session-complete-${token}`, 'true');
              router.replace(`/session/${token}/complete`);
            }}
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--text-secondary)',
              padding: '5px 14px', cursor: 'pointer',
              fontSize: '0.8rem', fontFamily: 'var(--font-ui)', fontWeight: 600,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
          >
            Finish Assessment
          </button>
        </div>
      </div>

      {/* ── Main 3-col layout ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{
          width: '280px', flexShrink: 0,
          background: 'var(--bg-raised)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '14px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <SessionTimer totalSeconds={totalSeconds} />
            <ProgressBar completed={completedCount} total={store.challenges.length} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <ChallengeList
              challenges={store.challenges}
              currentId={store.currentChallengeId}
              submissions={store.submissions}
              onSelect={store.setCurrentChallenge}
            />
          </div>
        </aside>

        {/* Editor column */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeEditor
              value={store.code[currentChallenge.id] ?? ''}
              onChange={val => store.setCode(currentChallenge.id, val)}
              filename={filename}
              onRunTests={handleRunTests}
            />
          </div>

          {/* Bottom action bar */}
          <div style={{
            height: '52px',
            background: 'var(--bg-raised)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0 16px',
            flexShrink: 0,
          }}>
            {/* Run Tests */}
            <button
              onClick={handleRunTests}
              disabled={store.isRunning || store.sessionFlagged}
              className={store.isRunning ? 'btn-running' : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'var(--accent-muted)',
                border: '1px solid rgba(164,230,255,0.3)',
                borderRadius: '8px',
                color: 'var(--accent)',
                padding: '6px 14px',
                cursor: store.isRunning || store.sessionFlagged ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem', fontWeight: 700,
                fontFamily: 'var(--font-ui)',
                opacity: store.sessionFlagged ? 0.5 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {store.isRunning ? '⟳ Running…' : '▶ Run Tests'}
            </button>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || store.sessionFlagged}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'var(--success)',
                border: 'none', borderRadius: '8px',
                color: 'var(--on-success)',
                padding: '6px 16px',
                cursor: submitting || store.sessionFlagged ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem', fontWeight: 700,
                fontFamily: 'var(--font-ui)',
                opacity: submitting || store.sessionFlagged ? 0.6 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {submitting ? (
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" opacity="0.75" />
                </svg>
              ) : '✓ Submit Solution'}
            </button>

            {/* Submitted indicator */}
            {store.submissions[currentChallenge.id] && (
              <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontFamily: 'var(--font-code)' }}>
                ✓ {store.submissions[currentChallenge.id].score}/{store.submissions[currentChallenge.id].max_score} pts
              </span>
            )}

            <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-code)' }}>
              Ctrl+Enter to run
            </span>
          </div>
        </main>

        {/* Right panel */}
        <aside style={{
          width: '380px', flexShrink: 0,
          background: 'var(--bg-raised)',
          borderLeft: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            {(['brief', 'results', 'preview'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => store.setActivePanel(tab)}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  background: 'none', border: 'none',
                  borderBottom: `2px solid ${store.activePanel === tab ? 'var(--accent)' : 'transparent'}`,
                  color: store.activePanel === tab ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-code)',
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {store.activePanel === 'brief' && <BriefPanel challenge={currentChallenge} />}
            {store.activePanel === 'results' && (
              <ResultsPanel result={store.runResults[currentChallenge.id] ?? null} isRunning={store.isRunning} />
            )}
            {store.activePanel === 'preview' && <PreviewPanel challenge={currentChallenge} />}
          </div>
        </aside>
      </div>

      {/* Session flagged modal */}
      <Modal open={flaggedModal} dismissable={false} title="Session Flagged">
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <div style={{
            background: 'var(--danger-muted)',
            border: '1px solid rgba(255,180,171,0.3)',
            borderRadius: '8px', padding: '16px',
          }}>
            <p style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: '8px' }}>⚠ Session Flagged</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Your session has been flagged due to suspicious activity. The editor has been disabled. Please contact the recruiter to discuss next steps.
            </p>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            All activity in this session has been recorded and will be reviewed.
          </p>
        </div>
      </Modal>
    </div>
  );
}
