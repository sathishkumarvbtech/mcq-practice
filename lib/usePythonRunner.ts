import { useState, useCallback, useEffect, useRef } from 'react';
import type { TestCase, TestCaseResult, ExecutionResult } from '../types/quiz';

export interface PythonRunnerState {
  isExecuting: boolean;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  testResults?: TestCaseResult[];
  hasRun: boolean;
  success?: boolean;
  isEngineReady?: boolean;
}

interface WorkerMessageData {
  id: string;
  type: 'ready' | 'init_error' | 'result';
  stdout?: string;
  stderr?: string;
  executionTimeMs?: number;
  success?: boolean;
  testResults?: TestCaseResult[];
  error?: string;
}

export function usePythonRunner() {
  const [state, setState] = useState<PythonRunnerState>({
    isExecuting: false,
    stdout: '',
    stderr: '',
    executionTimeMs: 0,
    hasRun: false,
    isEngineReady: false,
  });

  const workerRef = useRef<Worker | null>(null);
  const pendingRequests = useRef<
    Map<
      string,
      {
        resolve: (val: ExecutionResult & { testResults?: TestCaseResult[] }) => void;
        reject: (reason?: unknown) => void;
        timer: NodeJS.Timeout;
      }
    >
  >(new Map());

  // Function to create and configure worker
  const initWorker = useCallback(() => {
    if (typeof window === 'undefined' || !window.Worker) {
      return null;
    }

    try {
      if (workerRef.current) {
        workerRef.current.terminate();
      }

      const worker = new Worker('/pyodide-worker.js');

      worker.onmessage = (e: MessageEvent<WorkerMessageData>) => {
        const { id, type, stdout, stderr, executionTimeMs, success, testResults, error } = e.data;

        if (type === 'ready') {
          setState((prev) => ({ ...prev, isEngineReady: true }));
          return;
        }

        if (type === 'init_error') {
          // If Pyodide CDN failed, we will fallback to server API if needed
          setState((prev) => ({ ...prev, isEngineReady: false }));
          return;
        }

        const pending = pendingRequests.current.get(id);
        if (pending) {
          clearTimeout(pending.timer);
          pendingRequests.current.delete(id);

          pending.resolve({
            stdout: stdout || '',
            stderr: stderr || (error ? String(error) : ''),
            executionTimeMs: executionTimeMs || 0,
            success: !!success,
            testResults,
            error: error || undefined,
          });
        }
      };

      worker.onerror = () => {
        // Handle worker-level errors
        for (const [id, req] of pendingRequests.current.entries()) {
          clearTimeout(req.timer);
          req.reject(new Error('Web Worker error during execution'));
          pendingRequests.current.delete(id);
        }
      };

      // Warm up Pyodide in background
      worker.postMessage({ type: 'init', id: 'warmup' });
      workerRef.current = worker;
      return worker;
    } catch {
      return null;
    }
  }, []);

  // Initialize worker on mount
  useEffect(() => {
    const worker = initWorker();
    const pending = pendingRequests.current;

    return () => {
      // Cleanup all pending
      for (const [, req] of pending.entries()) {
        clearTimeout(req.timer);
      }
      pending.clear();
      worker?.terminate();
    };
  }, [initWorker]);

  // Fallback server runner (used only if worker/WebAssembly unavailable)
  const runViaServer = useCallback(
    async (
      code: string,
      testCases?: TestCase[],
      stdinInput?: string
    ): Promise<ExecutionResult & { testResults?: TestCaseResult[] }> => {
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
      return data;
    },
    []
  );

  const runCode = useCallback(
    async (
      code: string,
      testCases?: TestCase[],
      stdinInput?: string
    ): Promise<ExecutionResult & { testResults?: TestCaseResult[] }> => {
      setState((prev) => ({
        ...prev,
        isExecuting: true,
        hasRun: true,
      }));

      // Try client-side Pyodide Web Worker first (guaranteed to work on Vercel)
      if (typeof window !== 'undefined' && window.Worker) {
        if (!workerRef.current) {
          initWorker();
        }

        const worker = workerRef.current;
        if (worker) {
          const requestId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

          try {
            const workerPromise = new Promise<ExecutionResult & { testResults?: TestCaseResult[] }>(
              (resolve, reject) => {
                const timer = setTimeout(() => {
                  pendingRequests.current.delete(requestId);
                  // Terminate and recreate hung worker (e.g. infinite loops)
                  initWorker();
                  resolve({
                    stdout: '',
                    stderr: 'Time Limit Exceeded: Execution took longer than 4.0 seconds (possible infinite loop).',
                    executionTimeMs: 4000,
                    success: false,
                    error: 'Timeout',
                  });
                }, 4000);

                pendingRequests.current.set(requestId, { resolve, reject, timer });

                worker.postMessage({
                  id: requestId,
                  type: 'run',
                  code,
                  testCases,
                  input: stdinInput,
                });
              }
            );

            const result = await workerPromise;

            setState((prev) => ({
              ...prev,
              isExecuting: false,
              stdout: result.stdout || '',
              stderr: result.stderr || '',
              executionTimeMs: result.executionTimeMs || 0,
              testResults: result.testResults,
              hasRun: true,
              success: result.success,
            }));

            return result;
          } catch {
            // Worker failed, continue to server fallback
          }
        }
      }

      // Fallback: server execution
      try {
        const data = await runViaServer(code, testCases, stdinInput);

        setState((prev) => ({
          ...prev,
          isExecuting: false,
          stdout: data.stdout || '',
          stderr: data.stderr || '',
          executionTimeMs: data.executionTimeMs || 0,
          testResults: data.testResults,
          hasRun: true,
          success: data.success,
        }));

        return data;
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to communicate with Python execution engine.';
        setState((prev) => ({
          ...prev,
          isExecuting: false,
          stdout: '',
          stderr: errorMsg,
          executionTimeMs: 0,
          hasRun: true,
          success: false,
        }));

        return {
          stdout: '',
          stderr: errorMsg,
          executionTimeMs: 0,
          success: false,
          error: errorMsg,
        };
      }
    },
    [initWorker, runViaServer]
  );

  const clearOutput = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isExecuting: false,
      stdout: '',
      stderr: '',
      executionTimeMs: 0,
      testResults: undefined,
      hasRun: false,
    }));
  }, []);

  return {
    ...state,
    runCode,
    clearOutput,
  };
}
