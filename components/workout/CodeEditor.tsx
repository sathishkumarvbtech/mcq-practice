'use client';

import React, { useRef } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  isExecuting?: boolean;
  onReset?: () => void;
  minHeight?: string;
  readOnly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  onRun,
  isExecuting = false,
  onReset,
  minHeight = '240px',
  readOnly = false,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Split lines for line numbers
  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Tab key interception for 4-space indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Run on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onRun && !isExecuting) {
        onRun();
      }
      return;
    }

    if (e.key === 'Tab' && !readOnly) {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '    ';

      const newValue = value.substring(0, start) + spaces + value.substring(end);
      onChange(newValue);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner group">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-warning-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-success-500/80" />
          </div>
          <span className="ml-2 font-mono font-semibold text-python-blue-light">solution.py</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Python 3.12</span>
        </div>

        <div className="flex items-center gap-1">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Reset code to original starter"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-success-400" />
                <span className="text-success-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body: Line numbers + Textarea */}
      <div className="relative flex min-h-40" style={{ minHeight }}>
        {/* Line Numbers */}
        <div
          aria-hidden="true"
          className="w-10 sm:w-12 py-3 pr-2 text-right font-mono text-xs text-slate-600 bg-slate-900/60 border-r border-slate-800/80 select-none shrink-0"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            placeholder="# Write or edit your Python code here..."
            className="w-full h-full p-3 font-mono text-xs sm:text-sm text-slate-100 bg-transparent resize-y outline-none leading-6 placeholder:text-slate-600 selection:bg-brand-600/40"
            style={{ tabSize: 4 }}
          />
        </div>
      </div>

      {/* Keyboard Shortcut Hint Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-t border-slate-800/80 text-[11px] text-slate-500">
        <span>Tab = 4 spaces</span>
        <span className="font-mono">Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Ctrl</kbd> + <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Enter</kbd> to Run</span>
      </div>
    </div>
  );
}
