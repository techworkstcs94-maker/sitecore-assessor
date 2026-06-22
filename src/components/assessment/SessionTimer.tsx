'use client';

import React, { useEffect, useState } from 'react';
import { formatTime } from '@/lib/utils';

interface SessionTimerProps {
  totalSeconds: number;
  onExpire?: () => void;
}

export default function SessionTimer({ totalSeconds, onExpire }: SessionTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) { onExpire?.(); return; }
    const id = setInterval(() => setRemaining(s => {
      if (s <= 1) { onExpire?.(); clearInterval(id); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(id);
  }, []);

  const pct = remaining / totalSeconds;
  const isLow = remaining < 600;

  return (
    <div style={{
      background: 'var(--bg-raised)',
      border: `1px solid ${isLow ? 'var(--danger)' : 'var(--border)'}`,
      borderRadius: '4px',
      padding: '12px 16px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.06em' }}>
        TIME REMAINING
      </div>
      <div style={{
        fontSize: '1.8rem',
        fontFamily: 'var(--font-code)',
        fontWeight: 700,
        color: isLow ? 'var(--danger)' : 'var(--text-primary)',
        letterSpacing: '0.05em',
      }}>
        {formatTime(remaining)}
      </div>
      <div style={{
        height: 4,
        background: 'var(--border)',
        borderRadius: 2,
        marginTop: 10,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct * 100}%`,
          background: isLow ? 'var(--danger)' : 'var(--accent)',
          transition: 'width 1s linear, background 0.3s',
          borderRadius: 2,
        }} />
      </div>
    </div>
  );
}
