export type Question = {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type QuizMode = 'practice' | 'exam';

export type ViewLayout = 'single' | 'list';

export type ReviewFilter = 'all' | 'incorrect' | 'flagged';

export type TopicStat = {
  topic: string;
  total: number;
  answered: number;
  correct: number;
  percentage: number;
};

export type QuizHistoryItem = {
  id: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  timeSpentSeconds: number;
  mode: QuizMode;
};
