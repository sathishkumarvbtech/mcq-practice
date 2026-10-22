import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import type { TestCase, TestCaseResult, ExecutionResult } from '../../../types/quiz';

interface RunRequestBody {
  code?: string;
  input?: string;
  testCases?: TestCase[];
}

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: RunRequestBody = await request.json();
    const code = body.code || '';
    const stdinInput = body.input || '';
    const testCases = body.testCases;

    if (!code.trim()) {
      return NextResponse.json<ExecutionResult>({
        stdout: '',
        stderr: 'Error: No code provided to execute.',
        executionTimeMs: 0,
        success: false,
      });
    }

    // Basic heuristic to block malicious filesystem destruction or socket backdoors
    const bannedPatterns = [
      /import\s+os\s*;\s*os\.system/i,
      /subprocess\.(Popen|run|call|check_output)/i,
      /shutil\.rmtree/i,
      /os\.remove\(/i,
      /os\.unlink\(/i,
      /socket\.socket/i,
    ];

    for (const pattern of bannedPatterns) {
      if (pattern.test(code)) {
        return NextResponse.json({
          stdout: '',
          stderr: 'Security Notice: System shell and network socket operations are restricted in this sandbox environment.',
          executionTimeMs: 0,
          success: false,
          error: 'Restricted operation',
        }, { status: 400 });
      }
    }

    const startTime = performance.now();

    // If test cases are provided, append a test runner harness
    let executionScript = code;
    const isTestRun = Array.isArray(testCases) && testCases.length > 0;

    if (isTestRun) {
      const serializedTests = JSON.stringify(testCases);
      executionScript = `
import sys
import io
import json
import traceback

# Buffer stdout to capture user script output
_user_stdout_buffer = io.StringIO()
_orig_stdout = sys.stdout
_user_exec_error = None

sys.stdout = _user_stdout_buffer

# --- Execute User Script in Global Scope ---
try:
${code.split('\n').map((l) => '    ' + l).join('\n')}
except Exception as _e:
    _user_exec_error = traceback.format_exc()

# Restore stdout
sys.stdout = _orig_stdout
_captured_user_stdout = _user_stdout_buffer.getvalue()

# Print captured user stdout first for the console viewer
sys.stdout.write(_captured_user_stdout)

# --- Test Runner Harness ---
def _run_test_suite():
    tests = json.loads(${JSON.stringify(serializedTests)})
    results = []
    
    for t in tests:
        test_id = t["id"]
        test_call = t["testCall"]
        expected_raw = t["expectedOutput"]
        
        if _user_exec_error:
            results.append({
                "testCaseId": test_id,
                "passed": False,
                "actualOutput": "Execution Error",
                "expectedOutput": expected_raw,
                "error": _user_exec_error
            })
            continue

        try:
            passed = False
            actual_str = ""

            # Check if testing stdout
            if test_call == "__stdout__":
                actual_str = _captured_user_stdout.strip()
                # Clean quotes from expected_raw if needed
                exp_clean = expected_raw.strip().strip("'\\"")
                passed = (actual_str == exp_clean or actual_str == expected_raw.strip())
            elif test_call == "__stdout_contains__":
                actual_str = _captured_user_stdout.strip()
                exp_clean = expected_raw.strip().strip("'\\"")
                passed = exp_clean.lower() in actual_str.lower()
            else:
                # Evaluate expression in global scope
                actual_val = eval(test_call, globals())
                actual_str = repr(actual_val)
                
                try:
                    expected_val = eval(expected_raw)
                    passed = (actual_val == expected_val)
                except Exception:
                    if actual_str == expected_raw or str(actual_val) == expected_raw:
                        passed = True
                    else:
                        try:
                            passed = json.loads(actual_str) == json.loads(expected_raw)
                        except Exception:
                            passed = False
                        
            results.append({
                "testCaseId": test_id,
                "passed": passed,
                "actualOutput": actual_str,
                "expectedOutput": expected_raw
            })
        except Exception as err:
            results.append({
                "testCaseId": test_id,
                "passed": False,
                "actualOutput": f"{type(err).__name__}: {str(err)}",
                "expectedOutput": expected_raw,
                "error": str(err)
            })
            
    print("\\n__TEST_RESULTS_START__")
    print(json.dumps(results))
    print("__TEST_RESULTS_END__")

if __name__ == "__main__":
    try:
        _run_test_suite()
    except Exception as e:
        sys.stderr.write(traceback.format_exc())
`;
    }

    // Execute with python3 with 4-second timeout
    const execution = await new Promise<{
      stdout: string;
      stderr: string;
      exitCode: number | null;
      timedOut: boolean;
    }>((resolve) => {
      let stdout = '';
      let stderr = '';
      let timedOut = false;

      const pyProcess = spawn('python3', ['-c', executionScript], {
        env: { ...process.env, PYTHONUNBUFFERED: '1' },
      });

      const timer = setTimeout(() => {
        timedOut = true;
        pyProcess.kill('SIGKILL');
      }, 4000);

      // Handle stdin if provided
      if (stdinInput && pyProcess.stdin) {
        pyProcess.stdin.write(stdinInput);
        pyProcess.stdin.end();
      }

      pyProcess.stdout.on('data', (data) => {
        if (stdout.length < 500000) {
          stdout += data.toString();
        }
      });

      pyProcess.stderr.on('data', (data) => {
        if (stderr.length < 200000) {
          stderr += data.toString();
        }
      });

      pyProcess.on('close', (exitCode) => {
        clearTimeout(timer);
        resolve({ stdout, stderr, exitCode, timedOut });
      });

      pyProcess.on('error', (err) => {
        clearTimeout(timer);
        resolve({ stdout, stderr: err.message, exitCode: -1, timedOut: false });
      });
    });

    const executionTimeMs = Math.round(performance.now() - startTime);

    if (execution.timedOut) {
      return NextResponse.json({
        stdout: execution.stdout,
        stderr: 'Time Limit Exceeded: Execution took longer than 4.0 seconds (possible infinite loop).',
        executionTimeMs,
        success: false,
        error: 'Timeout',
      });
    }

    // Parse test results if this was a test run
    let testResults: TestCaseResult[] | undefined = undefined;
    let cleanStdout = execution.stdout;

    if (isTestRun) {
      const match = execution.stdout.match(/__TEST_RESULTS_START__\n([\s\S]*?)\n__TEST_RESULTS_END__/);
      if (match && match[1]) {
        try {
          testResults = JSON.parse(match[1]);
          cleanStdout = execution.stdout.replace(/__TEST_RESULTS_START__[\s\S]*?__TEST_RESULTS_END__\n?/, '').trim();
        } catch {
          // Keep stdout as is if parsing fails
        }
      }
    }

    return NextResponse.json({
      stdout: cleanStdout,
      stderr: execution.stderr,
      executionTimeMs,
      success: execution.exitCode === 0 && !execution.stderr.trim(),
      testResults,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error while executing Python code.';
    return NextResponse.json(
      {
        stdout: '',
        stderr: message,
        executionTimeMs: 0,
        success: false,
      },
      { status: 500 }
    );
  }
}
