import React from 'react';
import type { Challenge } from '@/types';

interface PreviewPanelProps {
  challenge: Challenge;
}

export default function PreviewPanel({ challenge }: PreviewPanelProps) {
  // Inject a zoom rule so full-width preview HTML scales down to fit the ~380px panel
  const scaledDoc = challenge.previewHtml
    ? challenge.previewHtml.replace(
        '</head>',
        `<style>
          html { zoom: 0.62; }
          body { margin: 0; }
        </style></head>`
      )
    : '<html><body style="background:#0b1326;color:#859399;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;font-size:14px">No preview available</body></html>';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <span className="label-caps" style={{ color: 'var(--text-muted)' }}>Reference Output</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '8px' }}>
          — {challenge.title}
        </span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <iframe
          srcDoc={scaledDoc}
          title={`Preview: ${challenge.title}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            background: '#0b1326',
          }}
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
