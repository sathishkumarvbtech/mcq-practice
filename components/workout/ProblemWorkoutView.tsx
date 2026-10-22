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
  Copy,
  BookOpen,
  Laptop,
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
  const [activeRightTab, setActiveRightTab] = useState<'tests' | 'console' | 'solution'>('tests');
  const [mobileTab, setMobileTab] = useState<'problem' | 'editor' | 'solution'>('editor');
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
  const isCurrentProblemSolved = completedProblemIds.has(currentProblem.id);

  // Switch problem
  const handleSelectProblem = useCallback(
    (idx: number) => {
      setSelectedProblemIndex(idx);
      setShowHint(false);
      clearOutput();
      setActiveRightTab('tests');
      // On mobile, keep in editor view for fast problem solving
      setMobileTab('editor');
    },
    [clearOutput]
  );

  const handleNextProblem = useCallback(() => {
    if (hasNextProblem) {
      handleSelectProblem(selectedProblemIndex + 1);
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
    setMobileTab('editor');
    await runCode(currentCode);
  };

  // Run test suite
  const handleRunTests = async () => {
    setActiveRightTab('tests');
    setMobileTab('editor');
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

  const isSolvedOrPassed = Boolean(
    (testResults && testResults.length > 0 && testResults.every((t) => t.passed)) ||
      isCurrentProblemSolved
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 py-4 space-y-4">
      {/* Sleek, Compact Workout Header Bar */}
      <div className="rounded-2xl p-4 sm:p-5 bg-linear-to-r from-slate-900 via-brand-950 to-slate-900 border border-slate-800 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-python-gold/20 text-python-gold border border-python-gold/30 shrink-0">
              <Code2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  Python Workout Studio
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-success-500/15 text-success-400 border border-success-500/30">
                  <Sparkles className="w-3 h-3" />
                  25 Challenges
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 hidden sm:block">
                Interactive in-browser Python execution with instant test case diagnostics.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
            {/* Difficulty Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    setSelectedDifficulty(diff);
                    setSelectedProblemIndex(0);
                    clearOutput();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-python-blue text-white shadow-xs'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Solved Counter Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs flex items-center gap-2 shrink-0">
              <Award className="w-4 h-4 text-python-gold" />
              <div className="text-right">
                <span className="text-white font-bold font-mono">
                  {completedProblemIds.size} / {workoutProblems.length}
                </span>
                <span className="text-slate-400 text-[10px] ml-1 hidden xs:inline">Solved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Only Segmented View Switcher (< lg) */}
      <div className="flex lg:hidden items-center justify-between p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMobileTab('problem')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'problem'
              ? 'bg-white dark:bg-slate-800 text-python-blue dark:text-python-blue-light shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Instructions</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'editor'
              ? 'bg-white dark:bg-slate-800 text-python-blue dark:text-python-blue-light shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Code & Tests</span>
        </button>

        {isSolvedOrPassed && (
          <button
            type="button"
            onClick={() => setMobileTab('solution')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'solution'
                ? 'bg-white dark:bg-slate-800 text-success-600 dark:text-success-400 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-success-500" />
            <span>Solution</span>
          </button>
        )}
      </div>

      {/* Main Studio Grid: Left Specs & Right IDE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ======================================================== */}
        {/* Left Column: Problem Selector + Spec (5 cols)             */}
        {/* Sticky on desktop to eliminate over-scroll void!         */}
        {/* ======================================================== */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            mobileTab !== 'problem' ? 'hidden lg:block' : 'block'
          } lg:sticky lg:top-18 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto pr-0.5`}
        >
          {/* Quick Problem Selector Drawer */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-3 shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              <span>Challenges List</span>
              <span className="font-mono text-slate-500">{filteredProblems.length} Problems</span>
            </div>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {filteredProblems.map((p, idx) => {
                const isSelected = p.id === currentProblem.id;
                const isSolved = completedProblemIds.has(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProblem(idx)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs space-y-4">
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

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentProblem.title}</span>
                {isCurrentProblemSolved && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success-600 dark:text-success-400 bg-success-500/10 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3 stroke-3" /> Solved
                  </span>
                )}
              </h3>
            </div>

            {/* Description */}
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {currentProblem.description}
            </div>

            {/* Examples */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Example</h4>
              {currentProblem.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-3 text-xs font-mono space-y-1"
                >
                  {ex.input && (
                    <div className="text-slate-800 dark:text-slate-200">
                      <span className="text-slate-400 select-none">Input: </span>
                      <span className="text-python-blue-light">{ex.input}</span>
                    </div>
                  )}
                  <div className="text-success-600 dark:text-success-400">
                    <span className="text-slate-400 select-none">Expected Output: </span>
                    <span className="font-bold">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="text-slate-500 text-[11px] pt-0.5 font-sans">
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            {currentProblem.constraints && currentProblem.constraints.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Constraints & Requirements
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400 font-sans">
                  {currentProblem.constraints.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Solution Hint Accordion */}
            {currentProblem.solutionHint && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-python-gold hover:text-python-gold-dark transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>{showHint ? 'Hide Hint' : 'Need a Hint? (Guidance only, no spoilers)'}</span>
                </button>

                {showHint && (
                  <div className="mt-2 p-3 rounded-xl bg-warning-500/10 border border-warning-500/25 text-xs text-slate-700 dark:text-slate-300 leading-relaxed animate-fade-in space-y-1">
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
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
              <button
                type="button"
                disabled={selectedProblemIndex === 0}
                onClick={() => handleSelectProblem(selectedProblemIndex - 1)}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Action Button to switch to Editor */}
            <div className="block lg:hidden pt-2">
              <button
                type="button"
                onClick={() => setMobileTab('editor')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-python-blue text-white flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Open Code Editor & Test Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Right Column: Code Editor & Multi-Tab Output (7 cols)    */}
        {/* ======================================================== */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            mobileTab !== 'editor' && mobileTab !== 'solution' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Mobile Current Problem Indicator */}
          <div className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-white truncate">
              #{selectedProblemIndex + 1}. {currentProblem.title}
            </span>
            <button
              type="button"
              onClick={() => setMobileTab('problem')}
              className="text-python-blue dark:text-python-blue-light font-semibold shrink-0 text-[11px] underline"
            >
              View Instructions
            </button>
          </div>

          {/* IDE Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-2.5 sm:px-4 shadow-xs">
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
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Reset solution to initial code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                type="button"
                disabled={isExecuting}
                onClick={handleRunCustomCode}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-success-600 hover:bg-success-500 text-white shadow-md shadow-success-500/25 active:scale-95 transition-all cursor-pointer"
                  title="Next challenge (or press Enter)"
                >
                  <span>Next</span>
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
            minHeight="240px"
          />

          {/* Output / Tests Tab Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveRightTab('tests')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeRightTab === 'console'
                      ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-python-gold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Console</span>
                </button>

                {isSolvedOrPassed && (
                  <button
                    type="button"
                    onClick={() => setActiveRightTab('solution')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeRightTab === 'solution'
                        ? 'bg-success-950/80 text-success-300 border border-success-700/60 shadow-xs'
                        : 'text-success-600 dark:text-success-400 hover:bg-success-950/20'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Deep Dive Solution</span>
                  </button>
                )}
              </div>

              {testResults && testResults.length > 0 && (
                <span className="text-[11px] font-mono text-slate-500">
                  {testResults.filter((t) => t.passed).length}/{testResults.length} Passed
                </span>
              )}
            </div>

            {/* Tab 1: Test Result Viewer */}
            {activeRightTab === 'tests' && (
              <TestResultViewer
                testCases={currentProblem.testCases}
                results={testResults}
                isExecuting={isExecuting}
                onNextProblem={handleNextProblem}
                hasNextProblem={hasNextProblem}
                problem={currentProblem}
                userCode={currentCode}
                onRevealHint={() => {
                  setShowHint(true);
                  setMobileTab('problem');
                }}
              />
            )}

            {/* Tab 2: Standard Console Output */}
            {activeRightTab === 'console' && (
              <ConsoleOutput
                stdout={stdout}
                stderr={stderr}
                executionTimeMs={executionTimeMs}
                isExecuting={isExecuting}
                hasRun={hasRun}
                success={success}
                onClear={clearOutput}
                maxHeight="280px"
              />
            )}

            {/* Tab 3: Deep Dive Solution & Reference Code */}
            {activeRightTab === 'solution' && isSolvedOrPassed && (
              <div className="rounded-2xl border-2 border-brand-300 dark:border-brand-800/80 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-lg space-y-4 animate-fade-in max-h-125 overflow-y-auto pr-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-success-500/15 text-success-500">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Logic Workout & Solution Breakdown
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Detailed breakdown and reference solution for #{selectedProblemIndex + 1}.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopySolution(currentProblem.logicExplanation?.canonicalSolution || '')}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
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

                {/* Core Logic */}
                {currentProblem.logicExplanation?.summary && (
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      1. Core Logic Explained
                    </h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      {currentProblem.logicExplanation.summary}
                    </p>
                  </div>
                )}

                {/* Reference Code */}
                {currentProblem.logicExplanation?.canonicalSolution && (
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      2. Canonical Reference Solution
                    </h5>
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-xs font-mono text-python-blue-light p-3 shadow-inner">
                      <pre className="overflow-x-auto whitespace-pre leading-relaxed">
                        {currentProblem.logicExplanation.canonicalSolution}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Key Takeaway */}
                {currentProblem.logicExplanation?.keyTakeaway && (
                  <div className="p-3 rounded-xl bg-python-blue/10 border border-python-blue/20 text-xs text-slate-700 dark:text-slate-200 leading-relaxed space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-python-blue dark:text-python-blue-light text-[11px] uppercase tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5 text-python-gold" />
                      <span>Key Takeaway</span>
                    </div>
                    <p className="font-sans leading-relaxed">{currentProblem.logicExplanation.keyTakeaway}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
