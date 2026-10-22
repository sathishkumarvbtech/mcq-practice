'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import type { TestCase, TestCaseResult, WorkoutProblem } from '../../types/quiz';
import { analyzeTestFailure } from '../../lib/testDiagnosticHelper';

interface TestResultViewerProps {
  testCases: TestCase[];
  results?: TestCaseResult[];
  isExecuting: boolean;
  onNextProblem?: () => void;
  hasNextProblem?: boolean;
  problem?: WorkoutProblem;
  userCode?: string;
  onRevealHint?: () => void;
}

export default function TestResultViewer({
  testCases,
  results,
  isExecuting,
  onNextProblem,
  hasNextProblem,
  problem,
  userCode,
  onRevealHint,
}: TestResultViewerProps) {
  const [showFullProblemHint, setShowFullProblemHint] = useState(true);

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
  const failedResults = results.filter((r) => !r.passed);

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
              <span className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-success-700/80 font-mono">
                Enter ↵
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Test Cases List with bounded scrolling to prevent over-scroll */}
      <div className="p-3 space-y-3 max-h-95 overflow-y-auto pr-1.5">
        {results.map((result, idx) => {
          const tc = testCases.find((item) => item.id === result.testCaseId);
          const diagnostic = !result.passed
            ? analyzeTestFailure(result, tc, problem, userCode)
            : null;

          return (
            <div
              key={result.testCaseId}
              className={`p-3.5 rounded-xl border text-xs font-mono transition-colors ${
                result.passed
                  ? 'bg-slate-900/60 border-success-900/40'
                  : 'bg-danger-950/25 border-danger-900/60 shadow-sm'
              }`}
            >
              {/* Header */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] mb-2">
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
                  <div className="font-semibold">
                    {result.actualOutput ? (
                      result.actualOutput
                    ) : (
                      <span className="text-slate-500 italic">(empty - no output)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Specific Test Error Traceback if any */}
              {result.error && (
                <div className="mt-2 text-danger-400 text-[11px] bg-danger-950/50 p-2 rounded border border-danger-900/50 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="break-all">{result.error}</span>
                </div>
              )}

              {/* Targeted Diagnostic & Closest Hint for this failed test */}
              {diagnostic && (
                <div className="mt-3 p-2.5 rounded-lg bg-slate-950/90 border border-warning-500/30 text-xs font-sans space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded bg-danger-500/10 text-danger-400 shrink-0 mt-0.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-danger-300 text-[11px]">
                        Issue: {diagnostic.issueTitle}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        {diagnostic.issueDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1.5 border-t border-slate-800/80">
                    <div className="p-1 rounded bg-python-gold/15 text-python-gold shrink-0 mt-0.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-python-gold text-[11px]">
                        Closest Hint & Solution Guidance:
                      </div>
                      <p className="text-[11px] text-slate-200 mt-0.5 leading-relaxed font-mono">
                        {diagnostic.closestHint}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Global Failure Help & Problem Hint Panel */}
        {!allPassed && problem && (
          <div className="mt-4 rounded-xl border border-warning-500/35 bg-linear-to-b from-warning-950/30 via-slate-950 to-slate-950 p-4 text-xs font-sans shadow-lg animate-fade-in space-y-3">
            <div className="flex items-center justify-between border-b border-warning-500/20 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-warning-500/20 text-python-gold">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-python-gold text-xs uppercase tracking-wide">
                    What&apos;s the Issue? Problem Hint & Guidance
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {failedResults.length} test case{failedResults.length > 1 ? 's' : ''} failed. Here is the closest guidance to help you resolve it.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onRevealHint && (
                  <button
                    type="button"
                    onClick={onRevealHint}
                    className="text-[11px] font-semibold text-python-gold hover:text-python-gold-dark transition-colors px-2 py-0.5 rounded bg-warning-500/10 border border-warning-500/20"
                  >
                    Open Sidebar Hint
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowFullProblemHint((prev) => !prev)}
                  className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title={showFullProblemHint ? 'Collapse hint' : 'Expand hint'}
                >
                  {showFullProblemHint ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {showFullProblemHint && (
              <div className="space-y-3 pt-1 max-h-55 overflow-y-auto pr-1">
                {/* Conceptual Solution Hint */}
                {problem.solutionHint && (
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold text-python-gold text-[11px] mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Key Concept & Rule:</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {problem.solutionHint}
                    </p>
                  </div>
                )}

                {/* Constraints Checklist */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="space-y-1 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <Info className="w-3 h-3 text-python-blue-light" />
                      Requirements Checklist:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-300">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Example format helper */}
                {problem.examples && problem.examples[0] && (
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500 font-semibold">Expected Format:</span>
                    <span className="text-success-400 font-bold">
                      {problem.examples[0].output}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* All Passed Celebration Footer */}
        {allPassed && hasNextProblem && onNextProblem && (
          <div className="mt-3 p-3.5 rounded-xl bg-success-950/50 border border-success-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-white animate-fade-in shadow-sm font-sans">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎉</span>
              <div>
                <div className="text-xs font-bold text-success-300">
                  Challenge Passed! All verification tests succeeded.
                </div>
                <div className="text-[11px] text-slate-300">
                  Study the Logic Workout below, or press{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-python-gold font-mono font-bold border border-slate-700 text-[10px]">
                    Enter ↵
                  </kbd>{' '}
                  or click Next Challenge to proceed.
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
