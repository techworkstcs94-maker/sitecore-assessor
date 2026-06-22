import React from 'react';
import type { CheatEvent } from '@/types';
import { SeverityBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface CheatTimelineProps {
  events: CheatEvent[];
}

export default function CheatTimeline({ events }: CheatTimelineProps) {
  if (events.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--success)', fontSize: '0.9rem' }}>
        ✓ No suspicious activity detected.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {events.map(event => (
        <div
          key={event.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '10px 14px',
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
          }}
        >
          <SeverityBadge severity={event.severity} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'var(--font-code)' }}>
                {event.event_type}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {formatDate(event.occurred_at)}
              </span>
            </div>
            {event.detail && (
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{event.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
