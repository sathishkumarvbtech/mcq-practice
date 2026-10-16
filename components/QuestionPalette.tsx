'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Question } from '../types/quiz';

interface QuestionPaletteProps {
  questions: Question[];
  answers: Record<string, number>;
  flagged: Set<string>;
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  submitted: boolean;
  mode: 'practice' | 'exam';
}

export default function QuestionPalette({
  questions,
  answers,
  flagged,
  currentIndex,
  onSelectQuestion,
  submitted,
  mode,
}: QuestionPaletteProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
          Question Navigator
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Answered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Flagged
          </span>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-25 gap-1.5">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isFlagged = flagged.has(q.id);
          const isCurrent = currentIndex === idx;

          let statusClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

          if (submitted || (mode === 'practice' && isAnswered)) {
            const isCorrect = answers[q.id] === q.correctIndex;
            if (isAnswered) {
              statusClass = isCorrect
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-rose-500 text-white border-rose-600';
            }
          } else if (isAnswered) {
            statusClass = 'bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-500/20';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuestion(idx)}
              className={`relative flex items-center justify-center h-8 rounded-lg text-xs font-mono font-bold border transition-all active:scale-95 ${statusClass} ${
                isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950 scale-105 z-10' : ''
              }`}
              title={`Question ${idx + 1} (${q.topic})`}
            >
              {idx + 1}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-white dark:border-slate-900"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
