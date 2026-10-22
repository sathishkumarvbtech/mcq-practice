'use client';

import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import type { TestCase, TestCaseResult } from '../../types/quiz';

interface TestResultViewerProps {
  testCases: TestCase[];
  results?: TestCaseResult[];
  isExecuting: boolean;
  onNextProblem?: () => void;
  hasNextProblem?: boolean;
}

export default function TestResultViewer({
  testCases,
  results,
  isExecuting,
  onNextProblem,
  hasNextProblem,
}: TestResultViewerProps) {
  if (isExecuting) {
    return (
      <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-slate-800 bg-slate-950 text-slate-400">
        <div className="w-6 h-6 border-2 border-python-blue border-t-python-gold rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono">Running test cases...</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2 mb-2 text-slate-300 font-semibold">
          <span>Test Suite Preview</span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            {testCases.length} Test Cases
          </span>
        </div>
        <p className="text-slate-500 mb-3 text-[11px]">
          Click &quot;Run Test Cases&quot; to test your code against the verification suite.
        </p>
        <div className="space-y-2">
          {testCases.map((tc, idx) => (
            <div
              key={tc.id}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Case {idx + 1}:</span>
                <span className="text-python-blue-light">{tc.inputDescription}</span>
              </div>
              <span className="text-slate-500 text-[11px]">Expected: {tc.expectedOutput}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
      {/* Banner */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b ${
          allPassed
            ? 'bg-success-950/40 border-success-800/50 text-success-300'
            : 'bg-danger-950/40 border-danger-800/50 text-danger-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {allPassed ? (
            <CheckCircle2 className="w-5 h-5 text-success-400" />
          ) : (
            <XCircle className="w-5 h-5 text-danger-400" />
          )}
          <span className="font-bold text-sm">
            {allPassed ? 'All Test Cases Passed! 🎉' : `${passedCount} of ${totalCount} Test Cases Passed`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-black/30">
            {Math.round((passedCount / totalCount) * 100)}%
          </span>

          {allPassed && hasNextProblem && onNextProblem && (
            <button
              type="button"
              onClick={onNextProblem}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-success-500 hover:bg-success-400 text-white shadow-md shadow-success-500/25 active:scale-95 transition-all cursor-pointer"
              title="Next challenge (or press Enter)"
            >
              <span>Next Challenge</span>
              <span className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-success-700/80 font-mono">Enter ↵</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Test Cases List */}
      <div className="p-3 space-y-2.5">
        {results.map((result, idx) => {
          const tc = testCases.find((item) => item.id === result.testCaseId);
          return (
            <div
              key={result.testCaseId}
              className={`p-3 rounded-xl border text-xs font-mono transition-colors ${
                result.passed
                  ? 'bg-slate-900/60 border-success-900/40'
                  : 'bg-danger-950/20 border-danger-900/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {result.passed ? (
                    <span className="inline-flex items-center gap-1 text-success-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Test Case {idx + 1}: Passed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-danger-400 font-bold">
                      <XCircle className="w-3.5 h-3.5" />
                      Test Case {idx + 1}: Failed
                    </span>
                  )}
                </div>

                {tc && (
                  <span className="text-[11px] text-slate-500 font-normal">
                    {tc.inputDescription}
                  </span>
                )}
              </div>

              {/* Expression Call */}
              {tc && (
                <div className="mb-2 text-slate-300 bg-slate-950/60 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500">Call: </span>
                  <span className="text-python-blue-light">{tc.testCall}</span>
                </div>
              )}

              {/* Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                  <div className="text-slate-500 mb-0.5">Expected:</div>
                  <div className="text-slate-200 font-semibold">{result.expectedOutput}</div>
                </div>

                <div
                  className={`p-2 rounded border ${
                    result.passed
                      ? 'bg-success-950/30 border-success-900/40 text-success-300'
                      : 'bg-danger-950/30 border-danger-900/40 text-danger-300'
                  }`}
                >
                  <div className="text-slate-500 mb-0.5">Actual:</div>
                  <div className="font-semibold">{result.actualOutput}</div>
                </div>
              </div>

              {result.error && (
                <div className="mt-2 text-danger-400 text-[11px] bg-danger-950/40 p-2 rounded border border-danger-900/50 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{result.error}</span>
                </div>
              )}
            </div>
          );
        })}

        {allPassed && hasNextProblem && onNextProblem && (
          <div className="mt-3 p-3.5 rounded-xl bg-success-950/50 border border-success-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-white animate-fade-in shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎉</span>
              <div>
                <div className="text-xs font-bold text-success-300">
                  Challenge Passed! All verification tests succeeded.
                </div>
                <div className="text-[11px] text-slate-300">
                  Study the Logic Workout below, or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-python-gold font-mono font-bold border border-slate-700 text-[10px]">Enter ↵</kbd> or click Next Challenge to proceed.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onNextProblem}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-success-500 hover:bg-success-400 text-white shadow-md shadow-success-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <span>Next Challenge</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-success-700/80 font-mono">Enter ↵</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
