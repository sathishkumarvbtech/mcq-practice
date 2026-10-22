import { useState, useCallback } from 'react';
import type { TestCase, TestCaseResult, ExecutionResult } from '../types/quiz';

export interface PythonRunnerState {
  isExecuting: boolean;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  testResults?: TestCaseResult[];
  hasRun: boolean;
  success?: boolean;
}

export function usePythonRunner() {
  const [state, setState] = useState<PythonRunnerState>({
    isExecuting: false,
    stdout: '',
    stderr: '',
    executionTimeMs: 0,
    hasRun: false,
  });

  const runCode = useCallback(
    async (code: string, testCases?: TestCase[], stdinInput?: string): Promise<ExecutionResult & { testResults?: TestCaseResult[] }> => {
      setState((prev) => ({
        ...prev,
        isExecuting: true,
        hasRun: true,
      }));

      try {
        const res = await fetch('/api/run-python', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            testCases,
            input: stdinInput,
          }),
        });

        const data = await res.json();

        setState({
          isExecuting: false,
          stdout: data.stdout || '',
          stderr: data.stderr || '',
          executionTimeMs: data.executionTimeMs || 0,
          testResults: data.testResults,
          hasRun: true,
          success: data.success,
        });

        return data;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to communicate with Python execution engine.';
        setState({
          isExecuting: false,
          stdout: '',
          stderr: errorMsg,
          executionTimeMs: 0,
          hasRun: true,
          success: false,
        });

        return {
          stdout: '',
          stderr: errorMsg,
          executionTimeMs: 0,
          success: false,
          error: errorMsg,
        };
      }
    },
    []
  );

  const clearOutput = useCallback(() => {
    setState({
      isExecuting: false,
      stdout: '',
      stderr: '',
      executionTimeMs: 0,
      testResults: undefined,
      hasRun: false,
    });
  }, []);

  return {
    ...state,
    runCode,
    clearOutput,
  };
}
