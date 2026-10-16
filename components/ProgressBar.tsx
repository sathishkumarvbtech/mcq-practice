'use client';

import React from 'react';
import { Bookmark, CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  answeredCount: number;
  totalQuestions: number;
  flaggedCount: number;
  currentIndex?: number;
  layout: 'single' | 'list';
}

export default function ProgressBar({
  answeredCount,
  totalQuestions,
  flaggedCount,
  currentIndex,
  layout,
}: ProgressBarProps) {
  const percentage = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm mb-6 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 mb-2.5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {answeredCount} of {totalQuestions} Answered
          </span>
          {flaggedCount > 0 && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <Bookmark className="w-3 h-3 fill-amber-500" />
              {flaggedCount} Flagged
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {layout === 'single' && typeof currentIndex === 'number' && (
            <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50">
              Question {currentIndex + 1} / {totalQuestions}
            </span>
          )}
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
            {percentage}% Complete
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-300 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
