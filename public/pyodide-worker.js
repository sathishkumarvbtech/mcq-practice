/* eslint-disable no-restricted-globals */
/**
 * Pyodide Web Worker
 * Executes Python code safely in the browser via WebAssembly.
 * Fixes Vercel deployment "spawn python3 ENOENT" error by running
 * Python completely client-side in an isolated worker thread.
 */

let pyodideInstance = null;
let initPromise = null;

async function initPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
      // @ts-ignore
      pyodideInstance = await self.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });
      return pyodideInstance;
    } catch (err) {
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

const PYTHON_RUNNER_HARNESS = `
import sys
import io
import json
import traceback

user_code = _py_user_code
stdin_input = _py_stdin_input
is_test_run = _py_is_test_run

if stdin_input:
    sys.stdin = io.StringIO(stdin_input)
else:
    sys.stdin = io.StringIO()

_user_stdout_buffer = io.StringIO()
_user_stderr_buffer = io.StringIO()
_orig_stdout = sys.stdout
_orig_stderr = sys.stderr

sys.stdout = _user_stdout_buffer
sys.stderr = _user_stderr_buffer
_user_exec_error = None

# Sandbox globals for the user script
_sandbox_globals = {
    '__name__': '__main__',
    '__doc__': None,
    '__builtins__': __builtins__
}

try:
    exec(user_code, _sandbox_globals)
except Exception as _e:
    _user_exec_error = traceback.format_exc()
    _user_stderr_buffer.write(_user_exec_error)
finally:
    sys.stdout = _orig_stdout
    sys.stderr = _orig_stderr

_captured_user_stdout = _user_stdout_buffer.getvalue()
_captured_user_stderr = _user_stderr_buffer.getvalue()

# Expose captured stdout to globals so test expressions can check it
_sandbox_globals['_captured_user_stdout'] = _captured_user_stdout

test_results = []
if is_test_run:
    # Convert _py_test_cases safely whether passed as JsProxy, list, or JSON string
    raw_tests = _py_test_cases
    tests = []
    if isinstance(raw_tests, str):
        try:
            tests = json.loads(raw_tests)
        except Exception:
            tests = []
    elif hasattr(raw_tests, 'to_py'):
        try:
            tests = raw_tests.to_py()
        except Exception:
            tests = []
    elif isinstance(raw_tests, list):
        tests = raw_tests
    else:
        try:
            tests = list(raw_tests)
        except Exception:
            tests = []

    for t in tests:
        # Support dict access whether dict or JsProxy
        if isinstance(t, dict):
            test_id = t.get("id", "")
            test_call = t.get("testCall", "")
            expected_raw = str(t.get("expectedOutput", ""))
        else:
            test_id = str(getattr(t, "id", ""))
            test_call = str(getattr(t, "testCall", ""))
            expected_raw = str(getattr(t, "expectedOutput", ""))
        
        if _user_exec_error:
            test_results.append({
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

            # Check if testing stdout directly
            if test_call == "__stdout__":
                actual_str = _captured_user_stdout.strip()
                exp_clean = expected_raw.strip().strip("'\\"")
                passed = (actual_str == exp_clean or actual_str == expected_raw.strip())
            elif test_call == "__stdout_contains__":
                actual_str = _captured_user_stdout.strip()
                exp_clean = expected_raw.strip().strip("'\\"")
                passed = exp_clean.lower() in actual_str.lower()
            else:
                # Evaluate expression in the user's execution namespace
                actual_val = eval(test_call, _sandbox_globals)
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
                        
            test_results.append({
                "testCaseId": test_id,
                "passed": passed,
                "actualOutput": actual_str,
                "expectedOutput": expected_raw
            })
        except Exception as err:
            test_results.append({
                "testCaseId": test_id,
                "passed": False,
                "actualOutput": f"{type(err).__name__}: {str(err)}",
                "expectedOutput": expected_raw,
                "error": str(err)
            })

_runner_output = {
    "stdout": _captured_user_stdout,
    "stderr": _captured_user_stderr,
    "success": (_user_exec_error is None) and (not _captured_user_stderr.strip()),
    "testResults": test_results if is_test_run else None
}
_py_result_json = json.dumps(_runner_output)
`;

self.onmessage = async (event) => {
  const { id, type, code, testCases, input } = event.data;

  if (type === 'init') {
    try {
      await initPyodide();
      self.postMessage({ id, type: 'ready' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      self.postMessage({ id, type: 'init_error', error: msg });
    }
    return;
  }

  if (type === 'run') {
    const startTime = performance.now();
    try {
      const py = await initPyodide();

      const isTestRun = Array.isArray(testCases) && testCases.length > 0;

      // Pass input parameters directly into Pyodide globals as serialized JSON / primitives
      py.globals.set('_py_user_code', code || '');
      py.globals.set('_py_stdin_input', input || '');
      // Pass as JSON string to guarantee safe, cross-boundary serialization
      py.globals.set('_py_test_cases', JSON.stringify(testCases || []));
      py.globals.set('_py_is_test_run', isTestRun);

      await py.runPythonAsync(PYTHON_RUNNER_HARNESS);

      const resultJson = py.globals.get('_py_result_json');
      const parsed = JSON.parse(resultJson);
      const executionTimeMs = Math.round(performance.now() - startTime);

      self.postMessage({
        id,
        type: 'result',
        stdout: parsed.stdout || '',
        stderr: parsed.stderr || '',
        executionTimeMs,
        success: parsed.success,
        testResults: parsed.testResults || undefined,
      });
    } catch (err) {
      const executionTimeMs = Math.round(performance.now() - startTime);
      const msg = err instanceof Error ? err.message : String(err);
      self.postMessage({
        id,
        type: 'result',
        stdout: '',
        stderr: msg,
        executionTimeMs,
        success: false,
        error: msg,
      });
    }
  }
};
