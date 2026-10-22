'use client';

import React from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Clock,
  Pause,
  Play,
  Sparkles,
  BookOpen,
  Layers,
  LayoutList,
  Code2,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { QuizMode, ViewLayout } from '../types/quiz';

interface HeaderProps {
  mode: QuizMode;
  onModeChange: (mode: QuizMode) => void;
  layout: ViewLayout;
  onLayoutChange: (layout: ViewLayout) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetQuiz: () => void;
  answeredCount: number;
  totalQuestions: number;
  workoutSolvedCount?: number;
  totalWorkoutProblems?: number;
}

export default function Header({
  mode,
  onModeChange,
  layout,
  onLayoutChange,
  isMuted,
  onToggleMute,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetQuiz,
  answeredCount,
  totalQuestions,
  workoutSolvedCount = 0,
  totalWorkoutProblems = 25,
}: HeaderProps) {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        {/* Main Header Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* 1. Left: Brand & Progress Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-linear-to-tr from-python-blue via-brand-600 to-python-gold p-0.5 shadow-md shadow-brand-500/10 shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <span className="text-lg sm:text-xl">🐍</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Python Beginner Practice
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success-500/10 text-success-600 dark:text-success-400 border border-success-500/20 whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5" />
                  25 Problems
                </span>
                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap font-semibold">
                  {mode === 'workout'
                    ? `${workoutSolvedCount}/${totalWorkoutProblems} Solved`
                    : `${answeredCount}/${totalQuestions} Answered`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                25 Coding Problems & Interactive Quiz · 5 Progressive Levels
              </p>
            </div>
          </div>

          {/* 2. Center: Mode Switcher & Layout Toggle (Desktop lg+ inline) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <button
                type="button"
                onClick={() => onModeChange('practice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'practice'
                    ? 'bg-white dark:bg-slate-800 text-python-blue dark:text-python-blue-light shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Practice</span>
              </button>
              <button
                type="button"
                onClick={() => onModeChange('exam')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'exam'
                    ? 'bg-white dark:bg-slate-800 text-warning-600 dark:text-warning-500 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>📝</span>
                <span>Exam Mode</span>
              </button>
              <button
                type="button"
                onClick={() => onModeChange('workout')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'workout'
                    ? 'bg-white dark:bg-slate-800 text-python-blue dark:text-python-blue-light shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-python-gold" />
                <span>Workout Lab</span>
              </button>
            </div>

            {/* Quiz View Layout Switcher (Single Focus vs Full List) */}
            {mode !== 'workout' && (
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs animate-fade-in">
                <button
                  type="button"
                  onClick={() => onLayoutChange('single')}
                  title="Single Question Focus View"
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    layout === 'single'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">Focus</span>
                </button>
                <button
                  type="button"
                  onClick={() => onLayoutChange('list')}
                  title="All Questions List View"
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    layout === 'list'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">List</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Right: Utility Controls (Timer, Mute, Theme, Master Reset) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Timer Widget */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-python-blue animate-pulse" />
              <span>{formatTime(timerSeconds)}</span>
              <button
                type="button"
                onClick={onToggleTimer}
                className="hover:text-python-blue transition-colors ml-0.5 cursor-pointer"
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                aria-label={isTimerRunning ? 'Pause timer' : 'Resume timer'}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

            {/* Sound Mute/Unmute */}
            <button
              type="button"
              onClick={onToggleMute}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:border-brand-500/50 transition-all shadow-xs active:scale-95 cursor-pointer"
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-danger-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-success-500" />
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle isMuted={isMuted} variant="segmented" className="hidden sm:flex" />
            <ThemeToggle isMuted={isMuted} variant="icon" className="sm:hidden" />

            {/* Master Reset Button: Always accessible across mobile and desktop */}
            <button
              type="button"
              onClick={onResetQuiz}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-danger-200/80 dark:border-danger-900/60 bg-danger-50/80 dark:bg-danger-950/40 text-danger-600 dark:text-danger-400 text-xs font-bold hover:bg-danger-100 dark:hover:bg-danger-900/50 transition-all active:scale-95 cursor-pointer shadow-xs"
              title="Reset all quiz answers, timer, and workout solutions back to start"
              aria-label="Reset all progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">Reset</span>
            </button>
          </div>
        </div>

        {/* Secondary Row for Mobile & Tablet (< lg screens) */}
        <div className="lg:hidden mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
          {/* Mode Switcher Tabs */}
          <div className="flex-1 grid grid-cols-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={() => onModeChange('practice')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'practice'
                  ? 'bg-white dark:bg-slate-800 text-python-blue dark:text-python-blue-light shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Practice</span>
            </button>
            <button
              type="button"
              onClick={() => onModeChange('exam')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'exam'
                  ? 'bg-white dark:bg-slate-800 text-warning-600 dark:text-warning-500 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="shrink-0">📝</span>
              <span className="truncate">Exam</span>
            </button>
            <button
              type="button"
              onClick={() => onModeChange('workout')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'workout'
                  ? 'bg-white dark:bg-slate-800 text-python-blue dark:text-python-blue-light shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-python-gold shrink-0" />
              <span className="truncate">Workout</span>
            </button>
          </div>

          {/* Quiz Layout Switcher (Focus vs List) on Mobile */}
          {mode !== 'workout' && (
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => onLayoutChange('single')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  layout === 'single'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500'
                }`}
                title="Focus view"
                aria-label="Focus view"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onLayoutChange('list')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  layout === 'list'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500'
                }`}
                title="List view"
                aria-label="List view"
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
