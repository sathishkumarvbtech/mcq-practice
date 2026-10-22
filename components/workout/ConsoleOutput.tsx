'use client';

import React, { useState } from 'react';
import { Terminal, Trash2, Copy, Check, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ConsoleOutputProps {
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  isExecuting: boolean;
  hasRun: boolean;
  success?: boolean;
  onClear?: () => void;
  maxHeight?: string;
}

export default function ConsoleOutput({
  stdout,
  stderr,
  executionTimeMs,
  isExecuting,
  hasRun,
  success,
  onClear,
  maxHeight = '280px',
}: ConsoleOutputProps) {
  const [copied, setCopied] = useState(false);

  const fullOutput = (stdout ? stdout : '') + (stderr ? (stdout ? '\n' : '') + stderr : '');

  const handleCopy = () => {
    if (!fullOutput) return;
    navigator.clipboard.writeText(fullOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
      {/* Console Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-python-gold" />
          <span className="font-mono font-semibold text-slate-300">Terminal Output</span>

          {hasRun && !isExecuting && (
            <div className="flex items-center gap-1.5 ml-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                <Clock className="w-3 h-3 text-slate-500" />
                {executionTimeMs}ms
              </span>

              {success ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success-400 bg-success-950/40 border border-success-800/40 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" />
                  Exit Code: 0
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-danger-400 bg-danger-950/40 border border-danger-800/40 px-2 py-0.5 rounded">
                  <AlertCircle className="w-3 h-3" />
                  Error
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {hasRun && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Clear console"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {hasRun && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Copy output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-success-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Output Content */}
      <div
        className="p-3.5 font-mono text-xs sm:text-sm overflow-y-auto leading-relaxed select-text"
        style={{ maxHeight, minHeight: '100px' }}
      >
        {isExecuting ? (
          <div className="flex items-center gap-2 text-python-gold py-2 animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-python-gold animate-ping" />
            <span>Executing Python code...</span>
          </div>
        ) : !hasRun ? (
          <div className="text-slate-600 italic py-2">
            Click &quot;Run Code&quot; (or Ctrl+Enter) to execute your Python script and see output here.
          </div>
        ) : (
          <div className="space-y-2">
            {stdout && (
              <pre className="whitespace-pre-wrap text-slate-100 font-mono m-0">
                {stdout}
              </pre>
            )}

            {stderr && (
              <pre className="whitespace-pre-wrap text-danger-400 bg-danger-950/30 border border-danger-900/40 p-2.5 rounded-lg font-mono m-0">
                {stderr}
              </pre>
            )}

            {!stdout && !stderr && (
              <div className="text-slate-500 italic">
                (Program exited with returncode 0 and produced no output)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
