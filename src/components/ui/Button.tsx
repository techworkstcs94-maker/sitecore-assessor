'use client';

import React from 'react';
import { cx } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  running?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  running,
  disabled,
  className,
  style,
  children,
  ...rest
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 700,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.5 : 1,
    border: 'none',
    transition: 'opacity 0.15s, transform 0.1s',
    ...style,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--on-accent)',
      borderRadius: '8px',
    },
    ghost: {
      background: 'none',
      border: '1px solid var(--border)',
      color: 'var(--text-secondary)',
      borderRadius: '8px',
    },
    danger: {
      background: 'var(--danger-muted)',
      border: '1px solid rgba(255,180,171,0.3)',
      color: 'var(--danger)',
      borderRadius: '8px',
    },
    success: {
      background: 'var(--success)',
      color: 'var(--on-success)',
      borderRadius: '8px',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { fontSize: '0.8rem', padding: '5px 12px' },
    md: { fontSize: '0.875rem', padding: '8px 16px' },
    lg: { fontSize: '0.95rem', padding: '11px 24px' },
  };

  return (
    <button
      className={cx(running ? 'btn-running' : '', className ?? '')}
      disabled={disabled || loading}
      style={{ ...baseStyle, ...variantStyles[variant], ...sizeStyles[size] }}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
