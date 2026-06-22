export type Tier = 'beginner' | 'intermediate' | 'experienced';
export type ChallengeCategoryType =
  | 'React Component'
  | 'Next.js'
  | 'CSS/Layout'
  | 'JavaScript Logic'
  | 'Sitecore JSS'
  | 'Performance'
  | 'TypeScript';

export type CheatSeverity = 'low' | 'medium' | 'high' | 'critical';
export type CheatEventType =
  | 'TAB_SWITCH'
  | 'WINDOW_BLUR'
  | 'WINDOW_BLUR_EXTENDED'
  | 'COPY_DETECTED'
  | 'PASTE_DETECTED'
  | 'DEVTOOLS_OPENED'
  | 'RIGHT_CLICK'
  | 'FULLSCREEN_EXIT'
  | 'SCREENSHOT_ATTEMPT'
  | 'RAPID_TYPING'
  | 'IDLE_TOO_LONG'
  | 'MULTIPLE_SUBMISSIONS'
  | 'EXTERNAL_RESOURCE'
  | 'SESSION_FLAGGED';

export interface ChallengeTest {
  id: string;
  name: string;
  points: number;
  validator: string;
  errorMessage: string;
}

export interface Challenge {
  id: string;
  tier: Tier;
  category: ChallengeCategoryType;
  title: string;
  points: number;
  timeLimit: number;
  brief: string;
  tasks: string[];
  hint: string;
  starterCode: string;
  solution: string;
  tests: ChallengeTest[];
  previewHtml: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  years_experience: number;
  level: Tier;
  session_token: string | null;
  session_started_at: string | null;
  session_ended_at: string | null;
  total_score: number;
  max_score: number;
  created_at: string;
}

export interface Submission {
  id: string;
  candidate_id: string;
  challenge_id: string;
  code: string;
  score: number;
  max_score: number;
  passed_tests: number;
  total_tests: number;
  submitted_at: string;
  attempt_number: number;
}

export interface CheatEvent {
  id: string;
  candidate_id: string;
  event_type: CheatEventType;
  detail: string | null;
  severity: CheatSeverity;
  occurred_at: string;
}

export interface TestResult {
  testId: string;
  name: string;
  passed: boolean;
  pointsEarned: number;
  pointsPossible: number;
  errorMessage?: string;
}

export interface RunResult {
  challengeId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  results: TestResult[];
  executionTimeMs: number;
}

export interface CandidateReport {
  candidate: Candidate;
  submissions: Submission[];
  cheatEvents: CheatEvent[];
  cheatScore: number;
  cheatRisk: 'clean' | 'suspicious' | 'flagged';
}

export interface SessionState {
  candidate: Candidate | null;
  challenges: Challenge[];
  currentChallengeId: string | null;
  submissions: Record<string, Submission>;
  code: Record<string, string>;
  runResults: Record<string, RunResult>;
  isRunning: boolean;
  isSubmitting: boolean;
  sessionFlagged: boolean;
  cheatEvents: CheatEvent[];
  drawerOpen: boolean;
  activePanel: 'brief' | 'results' | 'preview';
}
