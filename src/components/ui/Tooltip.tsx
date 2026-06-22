'use client';

import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ text, children, position = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const posStyle: React.CSSProperties = {
    top: position === 'bottom' ? '100%' : position === 'top' ? undefined : '50%',
    bottom: position === 'top' ? '100%' : undefined,
    left: position === 'right' ? '100%' : position === 'left' ? undefined : '50%',
    right: position === 'left' ? '100%' : undefined,
    transform: position === 'top' || position === 'bottom'
      ? 'translateX(-50%)'
      : 'translateY(-50%)',
    marginBottom: position === 'top' ? 6 : undefined,
    marginTop: position === 'bottom' ? 6 : undefined,
    marginLeft: position === 'right' ? 6 : undefined,
    marginRight: position === 'left' ? 6 : undefined,
  };

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span style={{
          position: 'absolute',
          zIndex: 999,
          background: 'var(--bg-overlay)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          fontSize: '0.75rem',
          padding: '4px 8px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          ...posStyle,
        }}>
          {text}
        </span>
      )}
    </span>
  );
}
