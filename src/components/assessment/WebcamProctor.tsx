'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { CheatSeverity } from '@/types';

type WebcamEventType =
  | 'CAMERA_DENIED'
  | 'NO_FACE_DETECTED'
  | 'MULTIPLE_FACES_DETECTED'
  | 'LOOKING_AWAY'
  | 'PHONE_SUSPECTED'
  | 'GAZE_OFF_SCREEN';

interface WebcamPrctorEvent {
  type: WebcamEventType;
  severity: CheatSeverity;
  detail: string;
}

interface WebcamPrctorProps {
  onEvent: (e: WebcamPrctorEvent) => void;
  active: boolean;
}

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights';
const SCAN_INTERVAL_MS = 4000;

// Consecutive-scan thresholds before flagging
const THRESHOLDS = {
  noFace: 3,       // 3 × 4s = 12s absent
  lookAway: 2,     // 2 × 4s = 8s looking sideways
  phoneDown: 3,    // 3 × 4s = 12s head tilted down
  gazeOff: 3,      // 3 × 4s = 12s eyes off screen
};

// Head-pose limits
const YAW_LIMIT   = 0.28;  // ~30° horizontal turn
const PITCH_DOWN  = 0.68;  // head noticeably tilted downward
const PITCH_UP    = 0.25;  // head strongly tilted upward

// Gaze: how far iris can deviate from eye centre (0–1 relative to eye width)
const GAZE_LIMIT  = 0.30;

type CamStatus = 'initialising' | 'active' | 'denied' | 'unavailable';
type FaceStatus = 'loading' | 'ready' | 'failed';

// ── Geometry helpers ─────────────────────────────────────────────────────────

interface Pt { x: number; y: number }

function mid(a: Pt, b: Pt): Pt {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function dist(a: Pt, b: Pt): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Estimates head pose from the 68-point landmark array.
 * Returns yaw  (+ = right, − = left),
 *         pitch (+ = down, − = up),   normalised ~0–1.
 */
function estimateHeadPose(pts: Pt[]) {
  const noseTip   = pts[30];
  const leftEyeL  = pts[36]; // outer left-eye corner
  const rightEyeR = pts[45]; // outer right-eye corner
  const chin      = pts[8];
  const eyeMid    = mid(leftEyeL, rightEyeR);
  const eyeWidth  = dist(leftEyeL, rightEyeR);
  const faceH     = dist(eyeMid, chin);

  const yaw   = eyeWidth  > 0 ? (noseTip.x - eyeMid.x) / eyeWidth  : 0;
  const pitch = faceH     > 0 ? (noseTip.y - eyeMid.y) / faceH     : 0;
  return { yaw, pitch };
}

/**
 * Estimates horizontal gaze offset for one eye (indices from 68-point model).
 * Returns value −1 (far left) … +1 (far right); 0 = centred.
 *
 * Approximation: the eye-centre landmark is at index `midIdx`.
 * We use the outer corners and the eyelid midpoints as a proxy for iris position.
 */
function estimateEyeGaze(pts: Pt[], outerL: number, outerR: number, topM: number, botM: number): number {
  const corner1 = pts[outerL];
  const corner2 = pts[outerR];
  const top     = pts[topM];
  const bot     = pts[botM];
  const centre  = mid(top, bot);                      // rough iris proxy
  const eyeW    = dist(corner1, corner2);
  if (eyeW < 1) return 0;
  const eyeMidX = (corner1.x + corner2.x) / 2;
  return (centre.x - eyeMidX) / eyeW;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function WebcamProctor({ onEvent, active }: WebcamPrctorProps) {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const streamRef  = useRef<MediaStream | null>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modelsRef  = useRef(false);

  // Per-behaviour streak counters
  const streaks = useRef({ noFace: 0, lookAway: 0, phoneDown: 0, gazeOff: 0 });

  const [camStatus,  setCamStatus]  = useState<CamStatus>('initialising');
  const [faceStatus, setFaceStatus] = useState<FaceStatus>('loading');
  const [indicator,  setIndicator]  = useState<'ok' | 'away' | 'multi' | 'phone' | 'gaze' | 'none' | null>(null);
  const [minimised,  setMinimised]  = useState(false);

  const stopScan = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const startScan = useCallback(() => {
    async function scan() {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !modelsRef.current) {
        timerRef.current = setTimeout(scan, SCAN_INTERVAL_MS);
        return;
      }

      try {
        const faceapi = await import('face-api.js');

        // detectAllFaces + landmarks in one pass
        const results = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.45 }))
          .withFaceLandmarks(true); // true → tiny landmark net

        const count = results.length;

        // ── No face ───────────────────────────────────────────────────────
        if (count === 0) {
          streaks.current.noFace++;
          streaks.current.lookAway = 0;
          streaks.current.phoneDown = 0;
          streaks.current.gazeOff = 0;
          setIndicator('none');
          if (streaks.current.noFace >= THRESHOLDS.noFace) {
            onEvent({ type: 'NO_FACE_DETECTED', severity: 'medium', detail: 'No face visible for extended period' });
            streaks.current.noFace = 0;
          }
          timerRef.current = setTimeout(scan, SCAN_INTERVAL_MS);
          return;
        }

        streaks.current.noFace = 0;

        // ── Multiple faces ────────────────────────────────────────────────
        if (count >= 2) {
          setIndicator('multi');
          onEvent({ type: 'MULTIPLE_FACES_DETECTED', severity: 'high', detail: `${count} faces detected — possible assistance` });
        }

        // Analyse primary (closest / largest) face
        const primary = results[0];
        const pts = primary.landmarks.positions as Pt[];
        const { yaw, pitch } = estimateHeadPose(pts);

        // ── Looking away (sideways) ───────────────────────────────────────
        if (Math.abs(yaw) > YAW_LIMIT) {
          streaks.current.lookAway++;
          if (streaks.current.lookAway >= THRESHOLDS.lookAway) {
            setIndicator('away');
            const dir = yaw > 0 ? 'right' : 'left';
            onEvent({ type: 'LOOKING_AWAY', severity: 'medium', detail: `Head turned ${dir} — not facing screen` });
            streaks.current.lookAway = 0;
          }
        } else {
          streaks.current.lookAway = 0;
        }

        // ── Phone / notes (persistent downward tilt) ──────────────────────
        if (pitch > PITCH_DOWN) {
          streaks.current.phoneDown++;
          if (streaks.current.phoneDown >= THRESHOLDS.phoneDown) {
            setIndicator('phone');
            onEvent({ type: 'PHONE_SUSPECTED', severity: 'medium', detail: 'Head tilted down — possible phone or notes use' });
            streaks.current.phoneDown = 0;
          }
        } else {
          streaks.current.phoneDown = 0;
        }

        // ── Gaze off-screen ───────────────────────────────────────────────
        // Left eye:  outer-L=36, outer-R=39, top-mid=37, bot-mid=41
        // Right eye: outer-L=42, outer-R=45, top-mid=43, bot-mid=47
        const gazeL = estimateEyeGaze(pts, 36, 39, 37, 41);
        const gazeR = estimateEyeGaze(pts, 42, 45, 43, 47);
        const gazeAvg = (gazeL + gazeR) / 2;

        const headStraight = Math.abs(yaw) < 0.15 && pitch > PITCH_UP && pitch < PITCH_DOWN;
        const eyesDeviated = Math.abs(gazeAvg) > GAZE_LIMIT;

        if (headStraight && eyesDeviated) {
          streaks.current.gazeOff++;
          if (streaks.current.gazeOff >= THRESHOLDS.gazeOff) {
            setIndicator('gaze');
            const dir = gazeAvg > 0 ? 'right' : 'left';
            onEvent({ type: 'GAZE_OFF_SCREEN', severity: 'low', detail: `Eyes consistently looking ${dir} — possible second screen or notes` });
            streaks.current.gazeOff = 0;
          }
        } else {
          streaks.current.gazeOff = 0;
        }

        // All clear if no issue triggered this frame
        if (count === 1 && Math.abs(yaw) <= YAW_LIMIT && pitch <= PITCH_DOWN) {
          setIndicator('ok');
        }
      } catch {
        // skip frame silently
      }

      timerRef.current = setTimeout(scan, SCAN_INTERVAL_MS);
    }

    timerRef.current = setTimeout(scan, SCAN_INTERVAL_MS);
  }, [onEvent]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    async function init() {
      // Step 1 — camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCamStatus('active');
      } catch (err) {
        if (cancelled) return;
        const denied = err instanceof DOMException &&
          ['NotAllowedError', 'PermissionDeniedError', 'NotFoundError', 'DevicesNotFoundError'].includes(err.name);
        setCamStatus(denied ? 'denied' : 'unavailable');
        if (denied) onEvent({ type: 'CAMERA_DENIED', severity: 'medium', detail: 'Candidate denied or has no webcam access' });
        return;
      }

      // Step 2 — models (face detector + tiny landmark net)
      try {
        const faceapi = await import('face-api.js');
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        ]);
        if (cancelled) return;
        modelsRef.current = true;
        setFaceStatus('ready');
        startScan();
      } catch (modelErr) {
        console.warn('[WebcamProctor] Models failed to load:', modelErr);
        if (!cancelled) setFaceStatus('failed');
      }
    }

    init();

    return () => {
      cancelled = true;
      stopScan();
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [active, startScan, stopScan, onEvent]);

  if (!active) return null;

  // ── Status label & colour ─────────────────────────────────────────────────
  const dotColor =
    camStatus !== 'active'           ? (camStatus === 'denied' ? 'var(--danger)' : 'var(--warning)')
    : indicator === 'multi'          ? 'var(--danger)'
    : indicator === 'away'           ? 'var(--danger)'
    : indicator === 'phone'          ? 'var(--warning)'
    : indicator === 'gaze'           ? 'var(--warning)'
    : indicator === 'none'           ? 'var(--warning)'
    : faceStatus === 'ready'         ? 'var(--success)'
    :                                  'var(--warning)';

  const headerLabel =
    camStatus === 'initialising'  ? 'Starting…'
    : camStatus === 'denied'      ? '✕ No camera'
    : camStatus === 'unavailable' ? '✕ In use'
    : indicator === 'multi'       ? '⚠ Multi-face'
    : indicator === 'away'        ? '⚠ Looking away'
    : indicator === 'phone'       ? '⚠ Head down'
    : indicator === 'gaze'        ? '⚠ Eyes off screen'
    : indicator === 'none'        ? '⚠ No face'
    : faceStatus === 'loading'    ? 'Loading AI…'
    : faceStatus === 'failed'     ? '● Cam only'
    :                               '● Live';

  const alertBorder = indicator && indicator !== 'ok'
    ? 'rgba(255,180,171,0.5)'
    : 'var(--border)';

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '24px', zIndex: 1500,
      background: 'var(--bg-raised)',
      border: `1px solid ${alertBorder}`,
      borderRadius: '10px', overflow: 'hidden',
      width: minimised ? '130px' : '176px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
      transition: 'width 0.2s, border-color 0.3s',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '5px 10px', background: 'var(--bg-overlay)',
        borderBottom: minimised ? 'none' : '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
            background: dotColor,
            boxShadow: camStatus === 'active' ? `0 0 5px ${dotColor}` : 'none',
          }} />
          <span style={{
            fontSize: '0.63rem', fontFamily: 'var(--font-code)',
            color: dotColor, textTransform: 'uppercase', letterSpacing: '0.04em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {headerLabel}
          </span>
        </div>
        <button
          onClick={() => setMinimised(m => !m)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.65rem', padding: 0, lineHeight: 1, flexShrink: 0 }}
        >
          {minimised ? '▲' : '▼'}
        </button>
      </div>

      {/* Video / message */}
      {!minimised && (
        <div style={{ position: 'relative', background: '#000', lineHeight: 0, minHeight: camStatus === 'active' ? 0 : 56 }}>
          <video
            ref={videoRef} muted playsInline
            style={{ width: '100%', display: camStatus === 'active' ? 'block' : 'none', transform: 'scaleX(-1)' }}
          />

          {camStatus === 'initialising' && (
            <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-code)' }}>
              Requesting camera…
            </div>
          )}
          {camStatus === 'denied' && (
            <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.68rem', color: 'var(--danger)', fontFamily: 'var(--font-code)', lineHeight: 1.5 }}>
              Camera access denied
            </div>
          )}
          {camStatus === 'unavailable' && (
            <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.68rem', color: 'var(--warning)', fontFamily: 'var(--font-code)', lineHeight: 1.5 }}>
              Camera in use by<br />another app
            </div>
          )}

          {/* Overlay status line at bottom of video */}
          {camStatus === 'active' && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '3px 6px',
              background: 'rgba(0,0,0,0.55)',
              textAlign: 'center', fontSize: '0.58rem',
              color: faceStatus === 'failed' ? 'var(--text-muted)' : dotColor,
              fontFamily: 'var(--font-code)',
            }}>
              {faceStatus === 'loading' && 'Loading face AI…'}
              {faceStatus === 'failed' && 'Face detection unavailable'}
              {faceStatus === 'ready'  && 'PROCTORED · ' + (
                indicator === 'ok'    ? 'Face OK' :
                indicator === 'away'  ? 'LOOKING AWAY' :
                indicator === 'phone' ? 'HEAD DOWN' :
                indicator === 'gaze'  ? 'EYES OFF SCREEN' :
                indicator === 'multi' ? 'MULTIPLE FACES' :
                indicator === 'none'  ? 'NO FACE' : 'Scanning…'
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
