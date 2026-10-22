export type Question = {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type QuizMode = 'practice' | 'exam' | 'workout';

export type TestCase = {
  id: string;
  inputDescription: string;
  testCall: string;
  expectedOutput: string;
  isSecret?: boolean;
};

export type WorkoutProblem = {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topic: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints?: string[];
  starterCode: string;
  solutionHint?: string;
  logicExplanation?: {
    summary: string;
    steps: string[];
    canonicalSolution: string;
    keyTakeaway: string;
  };
  internalMechanism?: string;
  testCases: TestCase[];
};

export type ExecutionResult = {
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  success: boolean;
  error?: string;
};

export type TestCaseResult = {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  error?: string;
};

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
