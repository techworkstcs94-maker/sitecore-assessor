'use client';

import React from 'react';
import RegistrationForm from '@/components/registration/RegistrationForm';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Nav ──────────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border)',
        height: '64px',
      }}>
        <div style={{
          maxWidth: '1440px', margin: '0 auto',
          padding: '0 32px', height: '100%',
          display: 'flex', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 32, height: 32, flexShrink: 0,
              background: 'var(--accent)',
              borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.8rem', color: 'var(--on-accent)',
            }}>SC</div>
            <span style={{
              fontFamily: 'var(--font-ui)', fontWeight: 700,
              fontSize: '1.05rem', color: 'var(--accent)',
              letterSpacing: '-0.01em',
            }}>Sitecore Assessor</span>
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main style={{ paddingTop: '88px', paddingBottom: '48px', flex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>

          {/* ── Hero: info card + registration panel ─────────────────────── */}
          <section style={{
            display: 'grid',
            gridTemplateColumns: '1fr 400px',
            gap: '28px',
          }}>
            {/* Left: Info card */}
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '12px',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '340px',
            }}>
              {/* Subtle radial glow */}
              <div style={{
                position: 'absolute', top: -100, right: -100,
                width: 320, height: 320,
                background: 'radial-gradient(circle, rgba(164,230,255,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="label-caps" style={{ color: 'var(--success)', marginBottom: '14px' }}>
                  Developer Assessment Portal
                </div>
                <h1 style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                  maxWidth: '520px',
                }}>
                  Sitecore XM Cloud<br />
                  <span style={{ color: 'var(--accent)' }}>React &amp; Next.js</span><br />
                  Technical Challenge
                </h1>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  maxWidth: '480px',
                  marginBottom: '28px',
                }}>
                  A timed, proctored assessment covering React components, Next.js App Router,
                  Sitecore JSS integration, TypeScript, and performance optimisation.
                  Your tier is automatically matched to your experience level.
                </p>

                {/* Tech badges */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['React', 'Next.js', 'TypeScript', 'Sitecore JSS', 'CSS / Tailwind'].map(tag => (
                    <span key={tag} style={{
                      background: 'var(--accent-muted)',
                      border: '1px solid rgba(164,230,255,0.2)',
                      borderRadius: '6px',
                      padding: '4px 12px',
                      fontSize: '0.8rem',
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-code)',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Registration glass panel */}
            <div className="glass-panel" style={{ borderRadius: '12px', padding: '36px' }}>
              <div className="label-caps" style={{ color: 'var(--success)', marginBottom: '8px' }}>
                Start Your Assessment
              </div>
              <h2 style={{
                fontFamily: 'var(--font-ui)', fontWeight: 700,
                fontSize: '1.25rem', color: 'var(--text-primary)',
                letterSpacing: '-0.01em', marginBottom: '6px',
              }}>
                Register &amp; Begin
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Enter your details to receive a personalised challenge set based on your experience level.
              </p>

              <RegistrationForm />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
