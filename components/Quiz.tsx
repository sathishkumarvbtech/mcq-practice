'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { questions } from '../data/questions';
import { QuizMode, ViewLayout, ReviewFilter, Question } from '../types/quiz';
import Header from './Header';
import ProgressBar from './ProgressBar';
import TopicFilter from './TopicFilter';
import QuestionPalette from './QuestionPalette';
import QuestionCard from './QuestionCard';
import QuizResults from './QuizResults';
import Modal from './Modal';
import WorkoutDrawer from './workout/WorkoutDrawer';
import ProblemWorkoutView from './workout/ProblemWorkoutView';
import { playSelectSound, playCorrectSound, playIncorrectSound } from '../lib/sound';
import { AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'python_mcq_state_v2';

export default function Quiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mode, setMode] = useState<QuizMode>('practice');
  const [layout, setLayout] = useState<ViewLayout>('single');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [isWorkoutOpen, setIsWorkoutOpen] = useState<boolean>(false);
  const [workoutQuestion, setWorkoutQuestion] = useState<Question | undefined>(undefined);
  const [mounted, setMounted] = useState<boolean>(false);
  const [workoutResetKey, setWorkoutResetKey] = useState<number>(0);
  const [workoutSolvedCount, setWorkoutSolvedCount] = useState<number>(0);

  const updateWorkoutCount = useCallback(() => {
    try {
      const saved = localStorage.getItem('python_mcq_workout_completed_v4');
      if (saved) {
        setWorkoutSolvedCount(JSON.parse(saved).length || 0);
      } else {
        setWorkoutSolvedCount(0);
      }
    } catch {
      setWorkoutSolvedCount(0);
    }
  }, []);

  useEffect(() => {
    updateWorkoutCount();
  }, [updateWorkoutCount, mode, workoutResetKey]);

  // Load state from localStorage on initial render
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.submitted) setSubmitted(parsed.submitted);
        if (parsed.flagged) setFlagged(new Set(parsed.flagged));
        if (parsed.mode) setMode(parsed.mode);
        if (parsed.layout) setLayout(parsed.layout);
        if (parsed.timerSeconds) setTimerSeconds(parsed.timerSeconds);
        if (parsed.isMuted !== undefined) setIsMuted(parsed.isMuted);
      }
    } catch {
      // Ignore storage error
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          answers,
          submitted,
          flagged: Array.from(flagged),
          mode,
          layout,
          timerSeconds,
          isMuted,
        })
      );
    } catch {
      // Ignore storage error
    }
  }, [answers, submitted, flagged, mode, layout, timerSeconds, isMuted, mounted]);

  // Stopwatch timer
  useEffect(() => {
    if (!isTimerRunning || submitted) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, submitted]);

  // Unique topics
  const topics = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => set.add(q.topic));
    return Array.from(set);
  }, []);

  // Topic counts
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = { All: questions.length };
    questions.forEach((q) => {
      counts[q.topic] = (counts[q.topic] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered questions based on selected topic and (if submitted) reviewFilter
  const displayQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Topic filter check
      if (selectedTopic !== 'All' && q.topic !== selectedTopic) {
        return false;
      }
      // Review filter check after submission
      if (submitted) {
        if (reviewFilter === 'incorrect') {
          return answers[q.id] !== q.correctIndex;
        }
        if (reviewFilter === 'flagged') {
          return flagged.has(q.id);
        }
      }
      return true;
    });
  }, [selectedTopic, submitted, reviewFilter, answers, flagged]);

  // Answered count across all 25 questions
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  // Ensure currentIndex stays within bounds when displayQuestions change
  useEffect(() => {
    if (currentIndex >= displayQuestions.length) {
      setCurrentIndex(Math.max(0, displayQuestions.length - 1));
    }
  }, [displayQuestions.length, currentIndex]);

  // Answer selection handler
  const handleSelectOption = useCallback(
    (questionId: string, optionIndex: number) => {
      if (submitted) return;

      const q = questions.find((item) => item.id === questionId);
      if (!q) return;

      setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));

      if (mode === 'practice') {
        if (optionIndex === q.correctIndex) {
          playCorrectSound(isMuted);
        } else {
          playIncorrectSound(isMuted);
        }
      } else {
        playSelectSound(isMuted);
      }
    },
    [submitted, mode, isMuted]
  );

  // Toggle flag
  const handleToggleFlag = useCallback((questionId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, []);

  // Open Python Workout Scratchpad
  const handleOpenWorkout = useCallback((q: Question) => {
    setWorkoutQuestion(q);
    setIsWorkoutOpen(true);
  }, []);

  // Submit quiz - display results immediately on screen
  const handleConfirmSubmit = useCallback(() => {
    setSubmitted(true);
    setShowSubmitModal(false);
    setLayout('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Open reset modal (no window.confirm alert)
  const handleOpenResetModal = useCallback(() => {
    setShowResetModal(true);
  }, []);

  // Confirm reset quiz and entire application
  const handleConfirmReset = useCallback(() => {
    // 1. Reset Quiz state
    setAnswers({});
    setSubmitted(false);
    setFlagged(new Set());
    setCurrentIndex(0);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setReviewFilter('all');
    setSelectedTopic('All');
    setShowResetModal(false);

    // 2. Clear all LocalStorage data across the entire application
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('python_basics_quiz_answers_v3');
      localStorage.removeItem('python_mcq_workout_completed_v4');
      localStorage.removeItem('python_mcq_workout_codes_v4');
      localStorage.removeItem('python_mcq_workout_completed_v1');
      localStorage.removeItem('python_mcq_workout_completed_v2');
      localStorage.removeItem('python_mcq_workout_completed_v3');
      localStorage.removeItem('python_mcq_workout_codes_v1');
      localStorage.removeItem('python_mcq_workout_codes_v2');
      localStorage.removeItem('python_mcq_workout_codes_v3');
      localStorage.removeItem('python_basics_quiz_timer');
      localStorage.removeItem('python_basics_quiz_flagged');
      localStorage.removeItem('python_basics_quiz_submitted');
    } catch {
      // Ignore
    }

    // 3. Remount Workout Lab completely fresh
    setWorkoutResetKey((k) => k + 1);
    setWorkoutSolvedCount(0);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const currentQ = displayQuestions[currentIndex];
      if (!currentQ) return;

      // Numbers 1-4 or letters A-D to select option
      const key = e.key.toUpperCase();
      if (['1', '2', '3', '4'].includes(key)) {
        const optIdx = parseInt(key, 10) - 1;
        if (optIdx < currentQ.options.length) {
          handleSelectOption(currentQ.id, optIdx);
        }
      } else if (['A', 'B', 'C', 'D'].includes(key)) {
        const optIdx = key.charCodeAt(0) - 65;
        if (optIdx < currentQ.options.length) {
          handleSelectOption(currentQ.id, optIdx);
        }
      } else if (key === 'F') {
        handleToggleFlag(currentQ.id);
      } else if (e.key === 'ArrowRight' || e.key === 'j') {
        if (currentIndex < displayQuestions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, displayQuestions, handleSelectOption, handleToggleFlag]);

  const activeQuestion = displayQuestions[currentIndex];

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-slate-100/50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <Header
        mode={mode}
        onModeChange={(newMode) => setMode(newMode)}
        layout={layout}
        onLayoutChange={(newLayout) => setLayout(newLayout)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        onToggleTimer={() => setIsTimerRunning((prev) => !prev)}
        onResetQuiz={handleOpenResetModal}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        workoutSolvedCount={workoutSolvedCount}
        totalWorkoutProblems={25}
      />

      {mode === 'workout' ? (
        <ProblemWorkoutView key={workoutResetKey} onWorkoutProgressChange={updateWorkoutCount} />
      ) : (
        <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          {/* Results Banner when submitted */}
          {submitted && (
            <QuizResults
              questions={questions}
              answers={answers}
              flagged={flagged}
              timeSpentSeconds={timerSeconds}
              reviewFilter={reviewFilter}
              onSetReviewFilter={(f) => setReviewFilter(f)}
              onRetake={handleOpenResetModal}
              isMuted={isMuted}
              mode={mode}
            />
          )}

          {/* Global Progress Bar */}
          <ProgressBar
            answeredCount={answeredCount}
            totalQuestions={questions.length}
            flaggedCount={flagged.size}
            currentIndex={layout === 'single' ? currentIndex : undefined}
            layout={layout}
          />

          {/* Topic Filter Chips */}
          <TopicFilter
            topics={topics}
            selectedTopic={selectedTopic}
            onSelectTopic={(t) => {
              setSelectedTopic(t);
              setCurrentIndex(0);
            }}
            topicCounts={topicCounts}
          />

          {/* Question Palette Matrix */}
          <QuestionPalette
            questions={questions}
            answers={answers}
            flagged={flagged}
            currentIndex={
              layout === 'single' && activeQuestion
                ? questions.findIndex((q) => q.id === activeQuestion.id)
                : -1
            }
            onSelectQuestion={(idx) => {
              const targetQuestion = questions[idx];
              if (selectedTopic !== 'All' && targetQuestion.topic !== selectedTopic) {
                setSelectedTopic('All');
              }
              const displayIdx = displayQuestions.findIndex((q) => q.id === targetQuestion.id);
              if (displayIdx !== -1) {
                setCurrentIndex(displayIdx);
              }
              if (layout === 'list') {
                const el = document.getElementById(`question-${targetQuestion.id}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            submitted={submitted}
            mode={mode}
          />

          {/* Questions Display */}
          {displayQuestions.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No questions found for the selected filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedTopic('All');
                  setReviewFilter('all');
                }}
                className="mt-3 px-4 py-2 text-xs font-semibold rounded-xl bg-python-blue hover:bg-brand-600 text-white shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : layout === 'single' && !submitted ? (
            /* Single Question Stepper View */
            activeQuestion && (
              <QuestionCard
                key={activeQuestion.id}
                question={activeQuestion}
                index={currentIndex}
                totalCount={displayQuestions.length}
                selectedOption={answers[activeQuestion.id]}
                isFlagged={flagged.has(activeQuestion.id)}
                onSelectOption={(opt) => handleSelectOption(activeQuestion.id, opt)}
                onToggleFlag={() => handleToggleFlag(activeQuestion.id)}
                onOpenWorkout={handleOpenWorkout}
                submitted={submitted}
                mode={mode}
                layout="single"
                onNext={() => setCurrentIndex((prev) => Math.min(prev + 1, displayQuestions.length - 1))}
                onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                isFirst={currentIndex === 0}
                isLast={currentIndex === displayQuestions.length - 1}
                onSubmitQuiz={() => setShowSubmitModal(true)}
              />
            )
          ) : (
            /* List View (or Submitted Review Mode) */
            <div className="space-y-6">
              {displayQuestions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  totalCount={displayQuestions.length}
                  selectedOption={answers[q.id]}
                  isFlagged={flagged.has(q.id)}
                  onSelectOption={(opt) => handleSelectOption(q.id, opt)}
                  onToggleFlag={() => handleToggleFlag(q.id)}
                  onOpenWorkout={handleOpenWorkout}
                  submitted={submitted}
                  mode={mode}
                  layout="list"
                />
              ))}

              {/* List View Submit Button */}
              {!submitted && (
                <div className="sticky bottom-6 z-20 flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl">
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-white">{answeredCount}</span> of{' '}
                    <span className="font-bold text-slate-900 dark:text-white">{questions.length}</span> questions answered
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-python-blue hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Submit Quiz</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* Workout Scratchpad Drawer */}
      <WorkoutDrawer
        isOpen={isWorkoutOpen}
        onClose={() => setIsWorkoutOpen(false)}
        question={workoutQuestion}
      />

      {/* Common Modal for Resetting Quiz & Practice */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Entire Application?"
        description="Are you sure you want to reset everything across the application?"
        variant="danger"
        icon={<RotateCcw className="w-5 h-5 text-danger-500" />}
        confirmText="Yes, Reset Everything"
        cancelText="Cancel"
        onConfirm={handleConfirmReset}
      >
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-slate-300">
            This will permanently reset all quiz answers, flagged questions, elapsed time, and all 25 Workout Lab coding solutions and challenge progress back to the beginning.
          </p>
          <div className="p-3.5 rounded-2xl bg-danger-50/80 dark:bg-danger-950/30 border border-danger-200/60 dark:border-danger-900/50 text-danger-700 dark:text-danger-400 text-xs font-semibold">
            ⚠️ You will restart completely fresh from Question 1 & Problem 1.
          </div>
        </div>
      </Modal>

      {/* Common Modal for Exam Submission */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Final Exam?"
        description="Check your status before finalizing your score."
        variant="warning"
        icon={<AlertTriangle className="w-5 h-5 text-warning-500" />}
        confirmText="Yes, Submit Now"
        cancelText="Keep Answering"
        onConfirm={handleConfirmSubmit}
        maxWidth="md"
      >
        <div className="space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Answered Questions:</span>
              <span className="font-bold font-mono text-success-600 dark:text-success-400">
                {answeredCount} / {questions.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Unanswered Questions:</span>
              <span className="font-bold font-mono text-danger-500">
                {questions.length - answeredCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Flagged for Review:</span>
              <span className="font-bold font-mono text-warning-500">{flagged.size}</span>
            </div>
          </div>

          {questions.length - answeredCount > 0 && (
            <p className="text-xs text-warning-600 dark:text-warning-400 font-medium">
              ⚠️ You still have {questions.length - answeredCount} unanswered questions. Unanswered questions are marked incorrect.
            </p>
          )}
        </div>
      </Modal>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200/80 dark:border-slate-800/80 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          🐍 Python Beginner Practice · 25 Coding Problems & Interactive Quiz
        </p>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          Keyboard navigation enabled · Press [1-4] or [A-D] to select, [F] to flag, [J/K] or Arrow Keys to navigate
        </p>
      </footer>
    </div>
  );
}
