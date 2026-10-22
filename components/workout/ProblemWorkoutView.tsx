'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Code2,
  Play,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Check,
  Award,
  Terminal,
  FileCheck,
  ArrowRight,
  GraduationCap,
  Lock,
  Copy,
} from 'lucide-react';
import CodeEditor from './CodeEditor';
import ConsoleOutput from './ConsoleOutput';
import TestResultViewer from './TestResultViewer';
import { workoutProblems } from '../../data/workoutProblems';
import { usePythonRunner } from '../../lib/usePythonRunner';
import type { WorkoutProblem } from '../../types/quiz';

const COMPLETED_PROBLEMS_STORAGE_KEY = 'python_mcq_workout_completed_v4';
const USER_CODES_STORAGE_KEY = 'python_mcq_workout_codes_v4';

interface ProblemWorkoutViewProps {
  onWorkoutProgressChange?: () => void;
}

export default function ProblemWorkoutView({ onWorkoutProgressChange }: ProblemWorkoutViewProps = {}) {
  const [selectedProblemIndex, setSelectedProblemIndex] = useState<number>(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<'tests' | 'console'>('tests');
  const [completedProblemIds, setCompletedProblemIds] = useState<Set<string>>(new Set());
  const [userCodes, setUserCodes] = useState<Record<string, string>>({});
  const [copiedSolution, setCopiedSolution] = useState<boolean>(false);

  const handleCopySolution = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  const {
    isExecuting,
    stdout,
    stderr,
    executionTimeMs,
    testResults,
    hasRun,
    success,
    runCode,
    clearOutput,
  } = usePythonRunner();

  // Load completed problems and saved code from localStorage
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem(COMPLETED_PROBLEMS_STORAGE_KEY);
      if (savedCompleted) {
        setCompletedProblemIds(new Set(JSON.parse(savedCompleted)));
      }

      const savedCodes = localStorage.getItem(USER_CODES_STORAGE_KEY);
      if (savedCodes) {
        setUserCodes(JSON.parse(savedCodes));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Filter problems by difficulty
  const filteredProblems = useMemo(() => {
    if (selectedDifficulty === 'All') return workoutProblems;
    return workoutProblems.filter((p) => p.difficulty === selectedDifficulty);
  }, [selectedDifficulty]);

  const currentProblem: WorkoutProblem = filteredProblems[selectedProblemIndex] || workoutProblems[0];
  const hasNextProblem = selectedProblemIndex < filteredProblems.length - 1;

  // Switch problem
  const handleSelectProblem = useCallback((idx: number) => {
    setSelectedProblemIndex(idx);
    setShowHint(false);
    clearOutput();
    setActiveRightTab('tests');
  }, [clearOutput]);

  const handleNextProblem = useCallback(() => {
    if (hasNextProblem) {
      handleSelectProblem(selectedProblemIndex + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }, [hasNextProblem, handleSelectProblem, selectedProblemIndex]);

  // Press Enter to go to next problem when passed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        testResults &&
        testResults.length > 0 &&
        testResults.every((t) => t.passed) &&
        hasNextProblem
      ) {
        const target = e.target as HTMLElement | null;
        const isEditing = target?.tagName === 'TEXTAREA' || target?.tagName === 'INPUT';
        if (e.key === 'Enter' && (!isEditing || e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          handleNextProblem();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [testResults, hasNextProblem, handleNextProblem]);

  // Current code in editor
  const currentCode = userCodes[currentProblem.id] ?? currentProblem.starterCode;

  // Update code handler
  const handleCodeChange = (newCode: string) => {
    setUserCodes((prev) => {
      const updated = { ...prev, [currentProblem.id]: newCode };
      try {
        localStorage.setItem(USER_CODES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  // Reset code to starter code
  const handleResetCode = () => {
    handleCodeChange(currentProblem.starterCode);
    clearOutput();
  };

  // Run custom code (without tests)
  const handleRunCustomCode = async () => {
    setActiveRightTab('console');
    await runCode(currentCode);
  };

  // Run test suite
  const handleRunTests = async () => {
    setActiveRightTab('tests');
    const result = await runCode(currentCode, currentProblem.testCases);

    if (result.testResults && result.testResults.length > 0) {
      const allPassed = result.testResults.every((t) => t.passed);
      if (allPassed) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Mark problem as completed
        setCompletedProblemIds((prev) => {
          const next = new Set(prev);
          next.add(currentProblem.id);
          try {
            localStorage.setItem(COMPLETED_PROBLEMS_STORAGE_KEY, JSON.stringify(Array.from(next)));
          } catch {
            // Ignore
          }
          return next;
        });

        onWorkoutProgressChange?.();

        // Defocus editor so user can immediately press Enter to proceed when ready
        if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 space-y-6">
      {/* Workout Hero Header */}
      <div className="rounded-2xl p-6 bg-linear-to-r from-slate-900 via-brand-950 to-slate-900 border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-python-gold/20 text-python-gold border border-python-gold/30">
                <Code2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Python Beginner Practice · 25 Coding Challenges
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-success-500/15 text-success-400 border border-success-500/30">
                <Sparkles className="w-3 h-3" />
                25 Challenges
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Write Python code, run automated verification test cases, and explore under-the-hood engine breakdowns across all 5 beginner levels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs flex items-center gap-2">
              <Award className="w-4 h-4 text-python-gold" />
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Problems Solved</div>
                <div className="text-white font-bold font-mono">
                  {completedProblemIds.size} / {workoutProblems.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
          <button
            key={diff}
            type="button"
            onClick={() => {
              setSelectedDifficulty(diff);
              setSelectedProblemIndex(0);
              clearOutput();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDifficulty === diff
                ? 'bg-python-blue text-white shadow-sm shadow-brand-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {diff} ({diff === 'All' ? workoutProblems.length : workoutProblems.filter((p) => p.difficulty === diff).length})
          </button>
        ))}
      </div>

      {/* Main Studio Grid: Left Specs & Right IDE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Selector + Problem Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Problem Selector Drawer/Dropdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-3 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Challenges ({filteredProblems.length})
            </div>
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              {filteredProblems.map((p, idx) => {
                const isSelected = p.id === currentProblem.id;
                const isSolved = completedProblemIds.has(p.id);

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProblem(idx)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-950/60 border border-brand-300 dark:border-brand-700/80 text-python-blue dark:text-python-blue-light font-bold shadow-xs'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-slate-400 text-[11px]">#{idx + 1}</span>
                      <span className="truncate">{p.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-success-500" />}
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                          p.difficulty === 'Beginner'
                            ? 'bg-success-500/10 text-success-600 dark:text-success-400'
                            : p.difficulty === 'Intermediate'
                            ? 'bg-warning-500/10 text-warning-600 dark:text-warning-400'
                            : 'bg-danger-500/10 text-danger-600 dark:text-danger-400'
                        }`}
                      >
                        {p.difficulty}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problem Spec Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-6 shadow-sm space-y-5">
            {/* Title & Tags */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {currentProblem.topic}
                </span>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    currentProblem.difficulty === 'Beginner'
                      ? 'bg-success-500/10 text-success-600 dark:text-success-400 border border-success-500/20'
                      : currentProblem.difficulty === 'Intermediate'
                      ? 'bg-warning-500/10 text-warning-600 dark:text-warning-400 border border-warning-500/20'
                      : 'bg-danger-500/10 text-danger-600 dark:text-danger-400 border border-danger-500/20'
                  }`}
                >
                  {currentProblem.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentProblem.title}</span>
                {completedProblemIds.has(currentProblem.id) && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success-600 dark:text-success-400 bg-success-500/10 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3 stroke-3" /> Solved
                  </span>
                )}
              </h3>
            </div>

            {/* Description */}
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {currentProblem.description}
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Example</h4>
              {currentProblem.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-3 text-xs font-mono space-y-1.5"
                >
                  {ex.input && (
                    <div className="text-slate-800 dark:text-slate-200">
                      <span className="text-slate-400 font-semibold select-none">
                        {ex.input.toLowerCase().startsWith('sample') ||
                        ex.input.toLowerCase().startsWith('values') ||
                        ex.input.toLowerCase().startsWith('text') ||
                        ex.input.toLowerCase().startsWith('none') ||
                        ex.input.toLowerCase().startsWith('dividend') ||
                        ex.input.toLowerCase().startsWith('string') ||
                        ex.input.toLowerCase().startsWith('integer') ||
                        ex.input.toLowerCase().startsWith('compare') ||
                        ex.input.toLowerCase().startsWith('comment')
                          ? ''
                          : 'Sample Input / Values: '}
                      </span>
                      <span className="text-python-blue dark:text-python-blue-light">{ex.input}</span>
                    </div>
                  )}
                  <div className="text-slate-800 dark:text-slate-200">
                    <span className="text-slate-400 font-semibold select-none">Expected Output: </span>
                    <span className="text-success-600 dark:text-success-400 font-bold whitespace-pre-line">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="text-slate-500 dark:text-slate-400 font-sans text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            {currentProblem.constraints && currentProblem.constraints.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Constraints & Requirements
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {currentProblem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Solution Hint Accordion */}
            {currentProblem.solutionHint && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-python-gold hover:text-python-gold-dark transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>{showHint ? 'Hide Hint' : 'Need a Hint? (Guidance only, no spoilers)'}</span>
                </button>

                {showHint && (
                  <div className="mt-2 p-3.5 rounded-xl bg-warning-500/10 border border-warning-500/25 text-xs text-slate-700 dark:text-slate-300 leading-relaxed animate-fade-in space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-python-gold text-[11px] uppercase tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Conceptual Guidance</span>
                    </div>
                    <p className="font-sans leading-relaxed">{currentProblem.solutionHint}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
              <button
                type="button"
                disabled={selectedProblemIndex === 0}
                onClick={() => handleSelectProblem(selectedProblemIndex - 1)}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-slate-400 font-mono text-[11px]">
                {selectedProblemIndex + 1} of {filteredProblems.length}
              </span>

              <button
                type="button"
                disabled={selectedProblemIndex === filteredProblems.length - 1}
                onClick={() => handleSelectProblem(selectedProblemIndex + 1)}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Test/Output Viewers (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* IDE Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-3 sm:px-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-python-blue-light" />
                <span className="truncate">Python 3.12 Workspace</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleResetCode}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Reset solution to initial code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Reset</span>
              </button>

              <button
                type="button"
                disabled={isExecuting}
                onClick={handleRunCustomCode}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Code</span>
              </button>

              <button
                type="button"
                disabled={isExecuting}
                onClick={handleRunTests}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold bg-success-600 hover:bg-success-500 text-white shadow-sm shadow-success-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Run Tests</span>
              </button>

              {testResults && testResults.length > 0 && testResults.every((t) => t.passed) && hasNextProblem && (
                <button
                  type="button"
                  onClick={handleNextProblem}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-success-600 hover:bg-success-500 text-white shadow-md shadow-success-500/25 active:scale-95 transition-all cursor-pointer"
                  title="Next challenge (or press Enter)"
                >
                  <span>Next Challenge</span>
                  <span className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-success-700/80 font-mono">Enter ↵</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Code Editor */}
          <CodeEditor
            value={currentCode}
            onChange={handleCodeChange}
            onRun={handleRunTests}
            onReset={handleResetCode}
            isExecuting={isExecuting}
            minHeight="320px"
          />

          {/* Output / Tests Tab Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveRightTab('tests')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeRightTab === 'tests'
                      ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-python-gold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Test Cases ({currentProblem.testCases.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRightTab('console')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeRightTab === 'console'
                      ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-python-gold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Console Output</span>
                </button>
              </div>

              {testResults && testResults.length > 0 && (
                <span className="text-[11px] font-mono text-slate-500">
                  {testResults.filter((t) => t.passed).length}/{testResults.length} Passed
                </span>
              )}
            </div>

            {/* Tab 1: Test Result Viewer */}
            {activeRightTab === 'tests' ? (
              <div className="space-y-3">
                <TestResultViewer
                  testCases={currentProblem.testCases}
                  results={testResults}
                  isExecuting={isExecuting}
                  onNextProblem={handleNextProblem}
                  hasNextProblem={hasNextProblem}
                  problem={currentProblem}
                  userCode={currentCode}
                  onRevealHint={() => setShowHint(true)}
                />

                {testResults && testResults.length > 0 && testResults.every((t) => t.passed) && !hasNextProblem && (
                  <div className="p-5 rounded-2xl bg-linear-to-r from-brand-950/80 via-slate-900 to-brand-950/80 border-2 border-python-gold/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-white animate-fade-in shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🏆</span>
                      <div>
                        <div className="text-sm font-bold text-python-gold">
                          Congratulations! All 25 Challenges Completed!
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5">
                          You have successfully written and verified code for all 25 beginner Python problems.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Tab 2: Standard Console Output */
              <ConsoleOutput
                stdout={stdout}
                stderr={stderr}
                executionTimeMs={executionTimeMs}
                isExecuting={isExecuting}
                hasRun={hasRun}
                success={success}
                onClear={clearOutput}
                maxHeight="300px"
              />
            )}

            {/* Logic Workout: Detailed Explanation Unlocked After Success */}
            {Boolean(
              (testResults && testResults.length > 0 && testResults.every((t) => t.passed)) ||
                completedProblemIds.has(currentProblem.id)
            ) ? (
              <div className="rounded-2xl border-2 border-brand-300 dark:border-brand-800/80 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xl space-y-5 animate-fade-in">
                {/* Header Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-success-500/15 text-success-500 border border-success-500/30">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          Logic Workout · Deep Dive & Solution Breakdown
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-success-500/10 text-success-600 dark:text-success-400 border border-success-500/30">
                          <Check className="w-3 h-3 stroke-3" /> Unlocked on Success
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Detailed breakdown of the core logic, step-by-step walkthrough, and optimal Python solution.
                      </p>
                    </div>
                  </div>

                  {hasNextProblem && (
                    <button
                      type="button"
                      onClick={handleNextProblem}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-success-600 hover:bg-success-500 text-white shadow-md shadow-success-500/25 active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      <span>Next Challenge ➔</span>
                    </button>
                  )}
                </div>

                {/* 1. Core Logic Overview */}
                {currentProblem.logicExplanation?.summary && (
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <span>1. Core Logic Explained</span>
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      {currentProblem.logicExplanation.summary}
                    </p>
                  </div>
                )}

                {/* 2. Step-by-Step Execution Walkthrough */}
                {currentProblem.logicExplanation?.steps && currentProblem.logicExplanation.steps.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      2. Step-by-Step Logic Walkthrough
                    </h5>
                    <div className="space-y-2">
                      {currentProblem.logicExplanation.steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-python-blue/15 text-python-blue font-mono font-bold text-[11px] shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span className="leading-relaxed font-sans">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Canonical Reference Python Solution */}
                {currentProblem.logicExplanation?.canonicalSolution && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        3. Optimal Reference Solution
                      </h5>
                      <button
                        type="button"
                        onClick={() => handleCopySolution(currentProblem.logicExplanation!.canonicalSolution)}
                        className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Copy reference code"
                      >
                        {copiedSolution ? (
                          <>
                            <Check className="w-3 h-3 text-success-400" />
                            <span className="text-success-400 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-xs font-mono text-python-blue-light p-4 shadow-inner">
                      <pre className="overflow-x-auto whitespace-pre leading-relaxed">{currentProblem.logicExplanation.canonicalSolution}</pre>
                    </div>
                  </div>
                )}

                {/* 4. Key Takeaways & Best Practices */}
                {currentProblem.logicExplanation?.keyTakeaway && (
                  <div className="p-4 rounded-xl bg-python-blue/10 border border-python-blue/20 text-xs text-slate-700 dark:text-slate-200 leading-relaxed space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-python-blue dark:text-python-blue-light text-[11px] uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4 text-python-gold" />
                      <span>Key Takeaway & Python Best Practice</span>
                    </div>
                    <p className="font-sans leading-relaxed">{currentProblem.logicExplanation.keyTakeaway}</p>
                  </div>
                )}

                {/* 5. Under the Hood · What Happens Inside Python */}
                {currentProblem.internalMechanism && (
                  <div className="p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-python-gold text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>Under the Hood · Python Engine Internals</span>
                    </div>
                    <p className="font-sans leading-relaxed">{currentProblem.internalMechanism}</p>
                  </div>
                )}

                {/* Bottom Navigation Call to Action */}
                {hasNextProblem && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-xs text-slate-400 font-medium">
                      Ready for Challenge #{selectedProblemIndex + 2}: {filteredProblems[selectedProblemIndex + 1]?.title}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextProblem}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-success-600 hover:bg-success-500 text-white shadow-lg shadow-success-500/25 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>Continue to Next Challenge</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-success-700/80 font-mono">Enter ↵</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Locked Placeholder before solving */
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 sm:p-5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                      Detailed Logic Breakdown & Reference Solution Locked
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Write your code and pass all test cases above to unlock the in-depth logic walkthrough.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-500 font-semibold whitespace-nowrap">
                  Unlocks on Pass
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
