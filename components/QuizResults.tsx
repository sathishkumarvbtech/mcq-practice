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
} from 'lucide-react';
import { Question, ReviewFilter, TopicStat, QuizMode } from '../types/quiz';
import { playCompleteSound } from '../lib/sound';

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
}: QuizResultsProps) {
  const [copied, setCopied] = useState(false);

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
          <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-tr from-python-blue via-brand-600 to-python-gold p-1 shadow-lg shadow-brand-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <TierIcon className={`w-10 h-10 ${tier.color}`} />
            </div>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-900/30 text-python-blue dark:text-python-blue-light border border-brand-200/50 dark:border-brand-800/50 mb-1.5">
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
            {copied ? <Check className="w-4 h-4 text-success-500" /> : <Share2 className="w-4 h-4" />}
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-python-blue hover:bg-brand-600 text-white shadow-md shadow-brand-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
        </div>
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

    </section>
  );
}
