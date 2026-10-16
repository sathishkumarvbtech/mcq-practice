'use client';

import React from 'react';
import { Volume2, VolumeX, RotateCcw, Clock, Pause, Play, Sparkles, BookOpen, Layers, LayoutList } from 'lucide-react';
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
}: HeaderProps) {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/75 dark:bg-slate-950/75 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-linear-to-tr from-python-blue via-brand-600 to-python-gold p-0.5 shadow-md shadow-brand-500/10">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <span className="text-xl">🐍</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    Python MCQ Arena
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-500/10 text-success-600 dark:text-success-500 border border-success-500/20">
                    <Sparkles className="w-3 h-3" />
                    v2.0
                  </span>
                  <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {answeredCount}/{totalQuestions}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  {totalQuestions} Interactive Questions · W3Schools Python Essentials
                </p>
              </div>
            </div>

            {/* Mobile View Controls */}
            <div className="flex items-center gap-1.5 md:hidden">
              <ThemeToggle isMuted={isMuted} variant="icon" />
              <button
                type="button"
                onClick={onToggleMute}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300"
                aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-danger-500" /> : <Volume2 className="w-4 h-4 text-success-500" />}
              </button>
            </div>
          </div>

          {/* Center: Mode Switcher & View Switcher */}
          <div className="flex items-center justify-between sm:justify-center gap-2 flex-wrap">
            {/* Practice vs Exam Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onModeChange('practice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'practice'
                    ? 'bg-white dark:bg-slate-800 text-python-blue dark:text-python-blue-light shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Practice</span>
              </button>
              <button
                type="button"
                onClick={() => onModeChange('exam')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'exam'
                    ? 'bg-white dark:bg-slate-800 text-warning-600 dark:text-warning-500 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>📝</span>
                <span>Exam Mode</span>
              </button>
            </div>

            {/* Layout Toggle: Single vs List */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onLayoutChange('single')}
                title="Single Question Focus View"
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  layout === 'single'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onLayoutChange('list')}
                title="All Questions List View"
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  layout === 'list'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Timer Widget */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-python-blue animate-pulse" />
              <span>{formatTime(timerSeconds)}</span>
              <button
                type="button"
                onClick={onToggleTimer}
                className="hover:text-python-blue transition-colors"
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={onToggleMute}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:border-brand-500/50 transition-all shadow-sm active:scale-95"
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-danger-500" /> : <Volume2 className="w-4 h-4 text-success-500" />}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle isMuted={isMuted} variant="segmented" />

            {/* Reset Button */}
            <button
              type="button"
              onClick={onResetQuiz}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-danger-100/60 dark:border-danger-900/40 bg-danger-50/50 dark:bg-danger-950/20 text-danger-600 dark:text-danger-400 text-xs font-semibold hover:bg-danger-100/60 dark:hover:bg-danger-900/30 transition-all active:scale-95"
              title="Reset all answers"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
