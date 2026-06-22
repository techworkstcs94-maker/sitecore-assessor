import { create } from 'zustand';
import type { Candidate, Challenge, Submission, CheatEvent, RunResult, SessionState } from '@/types';

interface SessionActions {
  setCandidate: (candidate: Candidate) => void;
  setChallenges: (challenges: Challenge[]) => void;
  setCurrentChallenge: (id: string) => void;
  setCode: (challengeId: string, code: string) => void;
  setRunResult: (challengeId: string, result: RunResult) => void;
  setSubmission: (challengeId: string, submission: Submission) => void;
  setIsRunning: (running: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setSessionFlagged: () => void;
  addCheatEvent: (event: CheatEvent) => void;
  setDrawerOpen: (open: boolean) => void;
  setActivePanel: (panel: SessionState['activePanel']) => void;
  reset: () => void;
}

const initialState: SessionState = {
  candidate: null,
  challenges: [],
  currentChallengeId: null,
  submissions: {},
  code: {},
  runResults: {},
  isRunning: false,
  isSubmitting: false,
  sessionFlagged: false,
  cheatEvents: [],
  drawerOpen: false,
  activePanel: 'brief',
};

export const useSessionStore = create<SessionState & SessionActions>((set) => ({
  ...initialState,

  setCandidate: (candidate) => set({ candidate }),
  setChallenges: (challenges) => {
    const code: Record<string, string> = {};
    challenges.forEach(c => { code[c.id] = c.starterCode; });
    set({ challenges, code, currentChallengeId: challenges[0]?.id ?? null });
  },
  setCurrentChallenge: (id) => set({ currentChallengeId: id, activePanel: 'brief' }),
  setCode: (challengeId, code) =>
    set(state => ({ code: { ...state.code, [challengeId]: code } })),
  setRunResult: (challengeId, result) =>
    set(state => ({ runResults: { ...state.runResults, [challengeId]: result }, activePanel: 'results' })),
  setSubmission: (challengeId, submission) =>
    set(state => ({ submissions: { ...state.submissions, [challengeId]: submission } })),
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSessionFlagged: () => set({ sessionFlagged: true }),
  addCheatEvent: (event) =>
    set(state => ({ cheatEvents: [...state.cheatEvents, event] })),
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  setActivePanel: (activePanel) => set({ activePanel }),
  reset: () => set(initialState),
}));
