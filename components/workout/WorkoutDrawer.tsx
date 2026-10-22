'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Play, Sparkles, Code2, RotateCcw } from 'lucide-react';
import CodeEditor from './CodeEditor';
import ConsoleOutput from './ConsoleOutput';
import { usePythonRunner } from '../../lib/usePythonRunner';
import type { Question } from '../../types/quiz';

interface WorkoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  question?: Question;
  initialCode?: string;
}

export default function WorkoutDrawer({
  isOpen,
  onClose,
  question,
  initialCode,
}: WorkoutDrawerProps) {
  // Extract snippet from question or use starter template
  const getInitialCode = useCallback(() => {
    if (initialCode) return initialCode;
    if (!question) {
      return `# Python Workout Scratchpad
# Type your Python code below:

`;
    }

    // Try to extract Python snippets from the question
    const backtickMatches = question.question.match(/`([^`]+)`/g);
    if (backtickMatches && backtickMatches.length > 0) {
      const cleaned = backtickMatches.map((m) => m.slice(1, -1));
      return `# Workout scratchpad for: ${question.topic}
# Extracted snippet:
${cleaned.join('\n')}
`;
    }

    return `# Workout scratchpad for: ${question.topic}
# Question: ${question.question.slice(0, 80)}...

# Test code here:
print("Ready to run!")
`;
  }, [initialCode, question]);

  const [code, setCode] = useState<string>(getInitialCode);
  const { isExecuting, stdout, stderr, executionTimeMs, hasRun, success, runCode, clearOutput } =
    usePythonRunner();

  // Reset code when question changes or drawer opens
  useEffect(() => {
    if (isOpen) {
      setCode(getInitialCode());
      clearOutput();
    }
  }, [isOpen, getInitialCode, clearOutput]);

  if (!isOpen) return null;

  const handleRun = () => {
    runCode(code);
  };

  const handleReset = () => {
    setCode(getInitialCode());
    clearOutput();
  };

  const handleInsertOptionCode = (optionText: string) => {
    const cleanOption = optionText.replace(/`([^`]+)`/g, '$1');
    setCode((prev) => `${prev.trim()}\n\n# Tested option:\n${cleanOption}\n`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <aside
          aria-label="Python Workout Scratchpad"
          className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl animate-fade-in"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-800/90 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-python-blue/20 text-python-blue-light border border-python-blue/30">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Python Workout Scratchpad
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-python-gold/15 text-python-gold border border-python-gold/30">
                    <Sparkles className="w-3 h-3" />
                    Interactive
                  </span>
                </div>
                {question && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Working out: <span className="text-python-blue-light font-medium">{question.topic}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close workout drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Option Insertion Bar (if question provided) */}
          {question && question.options.length > 0 && (
            <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/60 text-xs">
              <span className="text-slate-400 mr-2 font-medium">Insert Option to Test:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertOptionCode(opt)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] border border-slate-700/60 transition-colors"
                    title={`Append option ${String.fromCharCode(65 + idx)} into scratchpad`}
                  >
                    + Option {String.fromCharCode(65 + idx)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Code Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">Code Editor</span>
                <span className="text-[11px] text-slate-500 font-mono">Python 3.12 Engine</span>
              </div>
              <CodeEditor
                value={code}
                onChange={setCode}
                onRun={handleRun}
                onReset={handleReset}
                isExecuting={isExecuting}
                minHeight="220px"
              />
            </div>

            {/* Run Button Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Snippet</span>
              </button>

              <button
                type="button"
                disabled={isExecuting}
                onClick={handleRun}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-python-blue hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Terminal Console Output */}
            <div>
              <ConsoleOutput
                stdout={stdout}
                stderr={stderr}
                executionTimeMs={executionTimeMs}
                isExecuting={isExecuting}
                hasRun={hasRun}
                success={success}
                onClear={clearOutput}
                maxHeight="260px"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-800/90 bg-slate-950 text-xs text-slate-500 flex items-center justify-between">
            <span>Runs isolated inside safe sandbox</span>
            <span className="font-mono text-python-gold">Press Ctrl+Enter to execute</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
