'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import type { editor } from 'monaco-editor';
import Spinner from '@/components/ui/Spinner';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then(m => m.default),
  {
    ssr: false,
    loading: () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--bg-base)' }}>
        <Spinner size={32} />
      </div>
    ),
  }
);

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  filename: string;
  onRunTests: () => void;
}

const MONACO_THEME = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '3D5070', fontStyle: 'italic' },
    { token: 'keyword', foreground: '7C5CFC', fontStyle: 'bold' },
    { token: 'string', foreground: '22D48F' },
    { token: 'number', foreground: 'F5A623' },
    { token: 'type', foreground: '4DA6FF' },
  ],
  colors: {
    'editor.background': '#070B14',
    'editor.foreground': '#E8EEF8',
    'editor.lineHighlightBackground': '#0D1421',
    'editor.selectionBackground': '#2D1F6E',
    'editorCursor.foreground': '#7C5CFC',
    'editorLineNumber.foreground': '#3D5070',
    'editorLineNumber.activeForeground': '#7A8BA8',
    'editor.inactiveSelectionBackground': '#1A2640',
    'editorIndentGuide.background': '#1E2D45',
    'editorIndentGuide.activeBackground': '#3D5070',
    'scrollbarSlider.background': '#1E2D45',
    'scrollbarSlider.hoverBackground': '#3D5070',
  },
};

function getLanguage(filename: string): string {
  if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return 'typescript';
  if (filename.endsWith('.css')) return 'css';
  return 'javascript';
}

export default function CodeEditor({ value, onChange, filename, onRunTests }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  function handleMount(editorInstance: editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) {
    editorRef.current = editorInstance;
    monaco.editor.defineTheme('sc-dark', MONACO_THEME);
    monaco.editor.setTheme('sc-dark');

    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onRunTests);
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 4px',
        height: '36px',
      }}>
        <div style={{
          padding: '0 16px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '2px solid var(--accent)',
          fontSize: '0.8rem',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-code)',
          background: 'var(--bg-raised)',
        }}>
          {filename}
        </div>
      </div>

      {/* Editor with gutter dot-grid bg */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div className="editor-gutter-bg" style={{ position: 'absolute', left: 0, top: 0, width: 56, bottom: 0 }} />
        <MonacoEditor
          height="100%"
          language={getLanguage(filename)}
          value={value}
          onChange={v => onChange(v ?? '')}
          onMount={handleMount}
          options={{
            fontSize: 13,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
            overviewRulerLanes: 0,
          }}
        />
      </div>

      {/* Status bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        padding: '2px 12px',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-code)',
        height: '22px',
      }}>
        <span>{filename.endsWith('.tsx') ? 'TypeScript React' : 'TypeScript'}</span>
        <span>{value.length} chars · Ctrl+Enter to run</span>
      </div>
    </div>
  );
}
