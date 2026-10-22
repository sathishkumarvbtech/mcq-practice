'use client';

import React from 'react';
import { Bookmark, Check, X, Lightbulb, ArrowLeft, ArrowRight, CornerDownLeft, Code2 } from 'lucide-react';
import { Question, QuizMode } from '../types/quiz';
import FormattedText from './FormattedText';

interface QuestionCardProps {
  question: Question;
  index: number;
  totalCount: number;
  selectedOption?: number;
  isFlagged: boolean;
  onSelectOption: (optionIndex: number) => void;
  onToggleFlag: () => void;
  onOpenWorkout?: (question: Question) => void;
  submitted: boolean;
  mode: QuizMode;
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
  onOpenWorkout,
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
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-brand-50 dark:bg-brand-900/30 text-python-blue dark:text-python-blue-light border border-brand-200/50 dark:border-brand-800/50">
            Q{index + 1}
            <span className="text-slate-400 font-normal ml-1">/ {totalCount}</span>
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {question.topic}
          </span>
          {mode === 'practice' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-warning-600 dark:text-warning-400 bg-warning-500/10 px-2 py-0.5 rounded-full border border-warning-500/20">
              ⚡ Practice Mode
            </span>
          )}
        </div>

        {/* Action Buttons: Work Out + Flag */}
        <div className="flex items-center gap-2">
          {onOpenWorkout && (
            <button
              type="button"
              onClick={() => onOpenWorkout(question)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-python-blue dark:text-python-blue-light hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800/80 transition-all cursor-pointer shadow-2xs"
              title="Test and execute code in Python scratchpad"
            >
              <Code2 className="w-3.5 h-3.5 text-python-blue-light" />
              <span className="hidden sm:inline">Work Out Code</span>
              <span className="sm:hidden">Work Out</span>
            </button>
          )}

          {/* Flag Bookmark Action */}
          <button
            type="button"
            onClick={onToggleFlag}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isFlagged
                ? 'bg-warning-500/15 text-warning-600 dark:text-warning-400 border border-warning-500/30'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isFlagged ? 'Remove flag' : 'Flag question for review'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-warning-500' : ''}`} />
            <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Flag'}</span>
          </button>
        </div>
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
              optionStyle = 'border-success-500/80 bg-success-50/60 dark:bg-success-950/30 text-success-950 dark:text-success-200 shadow-sm ring-1 ring-success-500/30';
              letterStyle = 'bg-success-500 text-white border-success-600';
            } else if (isSelected && !isOptionCorrect) {
              optionStyle = 'border-danger-500/80 bg-danger-50/60 dark:bg-danger-950/30 text-danger-950 dark:text-danger-200 shadow-sm ring-1 ring-danger-500/30';
              letterStyle = 'bg-danger-500 text-white border-danger-600';
            } else {
              optionStyle = 'opacity-60 border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 text-slate-500 dark:text-slate-500';
            }
          } else if (isSelected) {
            optionStyle = 'border-python-blue dark:border-python-blue-light bg-brand-50/70 dark:bg-brand-900/30 text-slate-900 dark:text-white ring-2 ring-brand-500/20 shadow-sm';
            letterStyle = 'bg-python-blue text-white border-brand-700';
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
                <div className="flex items-center gap-1.5 text-xs font-bold text-success-600 dark:text-success-400 shrink-0">
                  <span className="hidden sm:inline">Correct</span>
                  <div className="w-6 h-6 rounded-full bg-success-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-3" />
                  </div>
                </div>
              )}
              {showFeedback && isSelected && !isOptionCorrect && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-danger-600 dark:text-danger-400 shrink-0">
                  <span className="hidden sm:inline">Incorrect</span>
                  <div className="w-6 h-6 rounded-full bg-danger-500 text-white flex items-center justify-center">
                    <X className="w-3.5 h-3.5 stroke-3" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation & Hint Box */}
      {showFeedback && (
        <div
          className={`rounded-xl p-4 sm:p-5 border transition-all animate-fade-in ${
            isCorrect
              ? 'bg-success-50/50 dark:bg-success-950/20 border-success-200/80 dark:border-success-800/40 text-success-950 dark:text-success-100'
              : 'bg-danger-50/40 dark:bg-danger-950/20 border-danger-200/80 dark:border-danger-800/50 text-slate-800 dark:text-slate-200'
          }`}
        >
          {/* Header indicator */}
          <div className="flex items-start gap-3">
            <div
              className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                isCorrect
                  ? 'bg-success-500/15 text-success-600 dark:text-success-400'
                  : 'bg-danger-500/15 text-danger-600 dark:text-danger-400'
              }`}
            >
              {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </div>

            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isCorrect
                      ? 'text-success-700 dark:text-success-400'
                      : 'text-danger-700 dark:text-danger-400'
                  }`}
                >
                  {isCorrect ? '✅ Correct Answer!' : '❌ Incorrect Selection · Issue & Closest Hint'}
                </h4>

                <span className="text-[11px] font-mono text-slate-500">
                  Topic: {question.topic}
                </span>
              </div>

              {/* If incorrect, show what was chosen and why it's a trap/mistake */}
              {!isCorrect && selectedOption !== undefined && (
                <div className="p-3 rounded-lg bg-white/70 dark:bg-slate-900/80 border border-danger-200/60 dark:border-danger-900/60 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-danger-600 dark:text-danger-400 font-bold">
                    <span>Your Choice:</span>
                    <span className="font-mono bg-danger-50 dark:bg-danger-950 px-1.5 py-0.5 rounded border border-danger-200 dark:border-danger-800">
                      Option {optionLetters[selectedOption]}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-sans italic">
                    &quot;{question.options[selectedOption]}&quot;
                  </p>
                  <p className="text-[11px] text-danger-700 dark:text-danger-300 font-medium pt-0.5">
                    <strong>Issue with this choice:</strong> This option does not adhere to Python&apos;s rules for {question.topic.toLowerCase()}. See the explanation and correct answer below.
                  </p>
                </div>
              )}

              {/* Explanation Text */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Concept & Detailed Explanation:
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                  <FormattedText text={question.explanation} />
                </p>
              </div>

              {/* Closest Hint / Question Hint if present */}
              {question.hint && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-warning-500/10 border border-warning-500/25 text-xs text-slate-700 dark:text-slate-300">
                  <Lightbulb className="w-4 h-4 text-python-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-python-gold font-bold">Closest Problem Hint:</strong>{' '}
                    <span>{question.hint}</span>
                  </div>
                </div>
              )}

              {/* Correct Answer badge */}
              <div className="pt-1.5 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 flex-wrap border-t border-slate-200/60 dark:border-slate-800/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Correct Answer:</span>
                <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-success-300 dark:border-success-800 text-success-700 dark:text-success-400 font-bold">
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-python-blue hover:bg-brand-600 text-white shadow-sm shadow-brand-500/20 transition-all active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : !submitted ? (
            <button
              type="button"
              onClick={onSubmitQuiz}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-success-600 hover:bg-success-500 text-white shadow-sm shadow-success-500/20 transition-all active:scale-95"
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
