'use client';

import React, { useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Share2,
  Printer,
  RotateCcw,
  Check,
  Filter,
  BarChart3,
  Bookmark,
  Eye,
} from 'lucide-react';
import { Question, ReviewFilter, TopicStat, QuizMode } from '../types/quiz';
import { playCompleteSound } from '../lib/sound';
import Modal from './Modal';

interface AutoEmailStatus {
  status: 'idle' | 'sending' | 'success' | 'preview' | 'error';
  message: string;
  recipient: string;
}

interface QuizResultsProps {
  questions: Question[];
  answers: Record<string, number>;
  flagged: Set<string>;
  timeSpentSeconds: number;
  reviewFilter: ReviewFilter;
  onSetReviewFilter: (filter: ReviewFilter) => void;
  onRetake: () => void;
  isMuted: boolean;
  mode?: QuizMode;
  autoEmailStatus?: AutoEmailStatus;
}

export default function QuizResults({
  questions,
  answers,
  flagged,
  timeSpentSeconds,
  reviewFilter,
  onSetReviewFilter,
  onRetake,
  isMuted,
  autoEmailStatus,
}: QuizResultsProps) {
  const [copied, setCopied] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const totalQuestions = questions.length;
  const score = questions.reduce(
    (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
    0
  );
  const percentage = Math.round((score / totalQuestions) * 100);
  const incorrectCount = totalQuestions - score;

  // Format time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  // Trigger celebration on mount
  useEffect(() => {
    playCompleteSound(isMuted);

    if (percentage >= 70) {
      try {
        confetti({
          particleCount: percentage >= 90 ? 120 : 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#306998', '#FFD43B', '#10B981', '#6366F1'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [percentage, isMuted]);

  // Topic mastery statistics
  const topicStats = useMemo(() => {
    const stats: Record<string, TopicStat> = {};
    questions.forEach((q) => {
      if (!stats[q.topic]) {
        stats[q.topic] = {
          topic: q.topic,
          total: 0,
          answered: 0,
          correct: 0,
          percentage: 0,
        };
      }
      const stat = stats[q.topic];
      stat.total += 1;
      if (answers[q.id] !== undefined) {
        stat.answered += 1;
        if (answers[q.id] === q.correctIndex) {
          stat.correct += 1;
        }
      }
    });

    Object.values(stats).forEach((stat) => {
      stat.percentage = Math.round((stat.correct / stat.total) * 100);
    });

    return stats;
  }, [questions, answers]);

  const getTier = () => {
    if (percentage === 100) return { title: 'Python Grandmaster', icon: Trophy, color: 'text-amber-500' };
    if (percentage >= 85) return { title: 'Python Expert', icon: Award, color: 'text-indigo-500' };
    if (percentage >= 70) return { title: 'Proficient Developer', icon: CheckCircle2, color: 'text-emerald-500' };
    if (percentage >= 50) return { title: 'Apprentice Coder', icon: BarChart3, color: 'text-blue-500' };
    return { title: 'Getting Started', icon: BookOpenIcon, color: 'text-slate-500' };
  };

  function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
    return <CheckCircle2 {...props} />;
  }

  const tier = getTier();
  const TierIcon = tier.icon;

  const handleShare = async () => {
    const text = `🐍 Python Basics MCQ Quiz Result:\nScore: ${score}/${totalQuestions} (${percentage}%)\nTime: ${formatTime(
      timeSpentSeconds
    )}\nMastery: ${tier.title}`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-9 shadow-xl shadow-slate-900/5 mb-8 animate-fade-in transition-colors">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-tr from-indigo-500 via-blue-600 to-amber-400 p-1 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <TierIcon className={`w-10 h-10 ${tier.color}`} />
            </div>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 mb-1.5">
              Performance Report
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {tier.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              You scored <strong className="text-slate-900 dark:text-white font-bold">{percentage}%</strong> across {totalQuestions} in-depth Python topics.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-95 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Share Result'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-95 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={onRetake}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AUTOMATIC SUBMISSION CONFIRMATION BANNER */}
      {/* ========================================================================= */}
      <div className="my-6 p-4 sm:p-5 rounded-2xl bg-linear-to-r from-emerald-500/10 via-indigo-500/10 to-blue-500/10 border border-emerald-500/25 dark:border-emerald-500/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/25 shrink-0 mt-0.5 sm:mt-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Automatic Final Submission Dispatched
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-700/50">
                sk1420000@gmail.com
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              Every detail—all {totalQuestions} questions, chosen answers, correct answers, and topic breakdowns—has been automatically sent to <strong className="font-mono text-emerald-700 dark:text-emerald-300">sk1420000@gmail.com</strong> at final submit.
            </p>
            {autoEmailStatus && autoEmailStatus.status === 'preview' && (
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                💡 Running in preview mode: configure your SMTP credentials in <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 font-mono">.env.local</code> to deliver live emails to sk1420000@gmail.com.
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPreviewModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs whitespace-nowrap active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
          <span>Inspect {totalQuestions}-Question Email</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Score</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {score}
            </span>
            <span className="text-sm font-medium text-slate-400">/ {totalQuestions}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50">
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accuracy Rate
          </span>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
            {percentage}%
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/50">
          <span className="text-xs font-medium text-rose-700 dark:text-rose-400 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            Incorrect Answers
          </span>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-rose-700 dark:text-rose-300 font-mono">
            {incorrectCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/50">
          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Time Taken
          </span>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 font-mono">
            {formatTime(timeSpentSeconds)}
          </div>
        </div>
      </div>

      {/* Topic Mastery Breakdown */}
      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          Topic Mastery Breakdown ({Object.keys(topicStats).length} Topics)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(topicStats).map((stat) => (
            <div
              key={stat.topic}
              className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800/70"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                <span className="truncate pr-2">{stat.topic}</span>
                <span className="font-mono">{stat.correct} / {stat.total} ({stat.percentage}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-200/70 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    stat.percentage >= 80
                      ? 'bg-emerald-500'
                      : stat.percentage >= 50
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Filter Navigation Bar */}
      <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Filter className="w-3.5 h-3.5 text-indigo-500" />
          <span>Review Mode</span>
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => onSetReviewFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              reviewFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Questions ({totalQuestions})
          </button>
          <button
            type="button"
            onClick={() => onSetReviewFilter('incorrect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              reviewFilter === 'incorrect'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mistakes Only ({incorrectCount})
          </button>
          <button
            type="button"
            onClick={() => onSetReviewFilter('flagged')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              reviewFilter === 'flagged'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-3 h-3 fill-amber-500" />
            <span>Flagged ({flagged.size})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HTML EMAIL SCORECARD MODAL PREVIEW (ALL 50 QUESTIONS AUDIT) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* HTML EMAIL SCORECARD MODAL PREVIEW (ALL 50 QUESTIONS AUDIT) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title={`Dispatched Email Audit Preview (${totalQuestions} Questions)`}
        description="This exact detailed scorecard was automatically sent to sk1420000@gmail.com."
        variant="success"
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        cancelText="Close Preview"
        maxWidth="lg"
      >
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Email Envelope Simulation */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1 font-mono">
            <div><strong>Subject:</strong> 🐍 [Final Submission] Scored {score}/{totalQuestions} ({percentage}%) - {tier.title}</div>
            <div><strong>From:</strong> Python MCQ Arena &lt;noreply@mcqarena.com&gt;</div>
            <div><strong>To:</strong> <span className="text-emerald-600 dark:text-emerald-400 font-bold">sk1420000@gmail.com</span></div>
          </div>

          {/* Rendered HTML Email Preview Box */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 text-center">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2">
                {tier.title}
              </span>
              <h4 className="text-2xl font-extrabold">{score} / {totalQuestions} ({percentage}%)</h4>
              <p className="text-xs text-slate-300 mt-1">
                Python MCQ Arena · All {totalQuestions} In-Depth Questions Audit
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Delivered automatically to <strong>sk1420000@gmail.com</strong>
              </p>
            </div>

            <div className="grid grid-cols-3 text-center border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 py-2.5 text-xs">
              <div>
                <div className="text-slate-400 font-medium">Score</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{score} / {totalQuestions}</div>
              </div>
              <div className="border-x border-slate-200 dark:border-slate-700">
                <div className="text-slate-400 font-medium">Incorrect</div>
                <div className="text-base font-bold text-rose-500 mt-0.5">{incorrectCount}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium">Time Taken</div>
                <div className="text-base font-bold text-indigo-500 mt-0.5">{formatTime(timeSpentSeconds)}</div>
              </div>
            </div>

            {/* All Questions Audit List */}
            <div className="p-4 bg-white dark:bg-slate-900 text-xs">
              <div className="font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wide text-[11px]">
                Included in Email: Full Audit of All {questions.length} Questions
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const userAns = answers[q.id];
                  const isCorrect = userAns === q.correctIndex;
                  const isAnswered = userAns !== undefined;
                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                        isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                          : isAnswered
                          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                          : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-indigo-600 dark:text-indigo-400">Q{idx + 1} · {q.topic}</span>
                        <span>{isCorrect ? '✅ Correct' : isAnswered ? '❌ Incorrect' : '⚠️ Unanswered'}</span>
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{q.question}</p>
                      <div className="text-slate-600 dark:text-slate-400">
                        <strong>Choice:</strong> {isAnswered ? q.options[userAns] : 'Not Answered'}
                        {!isCorrect && <span className="ml-2 text-emerald-600 dark:text-emerald-400">· <strong>Correct:</strong> {q.options[q.correctIndex]}</span>}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[10px] mt-1 bg-white/50 dark:bg-slate-800/50 p-1.5 rounded">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}
