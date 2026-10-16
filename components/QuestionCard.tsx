'use client';

import React from 'react';
import { Bookmark, Check, X, Lightbulb, ArrowLeft, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Question } from '../types/quiz';
import FormattedText from './FormattedText';

interface QuestionCardProps {
  question: Question;
  index: number;
  totalCount: number;
  selectedOption?: number;
  isFlagged: boolean;
  onSelectOption: (optionIndex: number) => void;
  onToggleFlag: () => void;
  submitted: boolean;
  mode: 'practice' | 'exam';
  layout: 'single' | 'list';
  onNext?: () => void;
  onPrev?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  onSubmitQuiz?: () => void;
}

export default function QuestionCard({
  question,
  index,
  totalCount,
  selectedOption,
  isFlagged,
  onSelectOption,
  onToggleFlag,
  submitted,
  mode,
  layout,
  onNext,
  onPrev,
  isFirst,
  isLast,
  onSubmitQuiz,
}: QuestionCardProps) {
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && selectedOption === question.correctIndex;
  const showFeedback = submitted || (mode === 'practice' && isAnswered);

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <article
      id={`question-${question.id}`}
      className={`relative w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-7 shadow-sm transition-all duration-200 ${
        layout === 'list' ? 'mb-6' : ''
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
            Q{index + 1}
            <span className="text-slate-400 font-normal ml-1">/ {totalCount}</span>
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {question.topic}
          </span>
          {mode === 'practice' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              ⚡ Practice Mode
            </span>
          )}
        </div>

        {/* Flag Bookmark Action */}
        <button
          type="button"
          onClick={onToggleFlag}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            isFlagged
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isFlagged ? 'Remove flag' : 'Flag question for review'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500' : ''}`} />
          <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Flag'}</span>
        </button>
      </div>

      {/* Question Text */}
      <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-white leading-relaxed mb-6">
        <FormattedText text={question.question} isTitle />
      </h2>

      {/* Options Grid */}
      <div className="grid gap-3 mb-6" role="radiogroup" aria-labelledby={`question-${question.id}`}>
        {question.options.map((option, optIdx) => {
          const isSelected = selectedOption === optIdx;
          const isOptionCorrect = optIdx === question.correctIndex;

          let optionStyle = 'border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200';
          let letterStyle = 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';

          if (showFeedback) {
            if (isOptionCorrect) {
              optionStyle = 'border-emerald-500/80 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 shadow-sm ring-1 ring-emerald-500/30';
              letterStyle = 'bg-emerald-500 text-white border-emerald-600';
            } else if (isSelected && !isOptionCorrect) {
              optionStyle = 'border-rose-500/80 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 shadow-sm ring-1 ring-rose-500/30';
              letterStyle = 'bg-rose-500 text-white border-rose-600';
            } else {
              optionStyle = 'opacity-60 border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 text-slate-500 dark:text-slate-500';
            }
          } else if (isSelected) {
            optionStyle = 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20 shadow-sm';
            letterStyle = 'bg-indigo-600 text-white border-indigo-700';
          }

          const isDisabled = submitted;

          return (
            <button
              key={optIdx}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectOption(optIdx)}
              className={`w-full text-left flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-150 active:scale-[0.99] cursor-pointer ${optionStyle} ${
                isDisabled ? 'cursor-default' : ''
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Keyboard letter badge */}
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-bold border transition-colors shrink-0 ${letterStyle}`}
                >
                  {optionLetters[optIdx]}
                </span>
                <span className="text-sm sm:text-base font-medium wrap-break-word leading-relaxed">
                  <FormattedText text={option} />
                </span>
              </div>

              {/* Status indicator icon */}
              {showFeedback && isOptionCorrect && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  <span className="hidden sm:inline">Correct</span>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-3" />
                  </div>
                </div>
              )}
              {showFeedback && isSelected && !isOptionCorrect && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 shrink-0">
                  <span className="hidden sm:inline">Incorrect</span>
                  <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center">
                    <X className="w-3.5 h-3.5 stroke-3" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {showFeedback && (
        <div
          className={`rounded-xl p-4 sm:p-5 border transition-all animate-fade-in ${
            isCorrect
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100'
              : 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-800/40 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-indigo-400/15 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Explanation & Concept
              </h4>
              <p className="text-sm font-medium leading-relaxed">
                <FormattedText text={question.explanation} />
              </p>
              <div className="pt-1.5 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Correct Answer:</span>
                <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-bold">
                  {optionLetters[question.correctIndex]}: {question.options[question.correctIndex]}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footers for Single Question layout */}
      {layout === 'single' && (
        <div className="flex items-center justify-between gap-3 pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={isFirst}
            onClick={onPrev}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isFirst
                ? 'opacity-40 cursor-not-allowed border-transparent text-slate-400'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Tip: Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">1-4</kbd> or <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">A-D</kbd> to answer
          </div>

          {!isLast ? (
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : !submitted ? (
            <button
              type="button"
              onClick={onSubmitQuiz}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 transition-all active:scale-95"
            >
              <CornerDownLeft className="w-4 h-4" />
              <span>Finish & Submit</span>
            </button>
          ) : null}
        </div>
      )}
    </article>
  );
}
