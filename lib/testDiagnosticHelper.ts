import type { TestCase, TestCaseResult, WorkoutProblem } from '../types/quiz';

export interface TestDiagnostic {
  issueTitle: string;
  issueDescription: string;
  closestHint: string;
  badgeType: 'empty' | 'syntax' | 'casing' | 'whitespace' | 'variable' | 'type' | 'value' | 'runtime';
}

/**
 * Intelligently analyzes why a test case failed and extracts the closest
 * conceptual hint and troubleshooting steps to guide the user.
 */
export function analyzeTestFailure(
  result: TestCaseResult,
  testCase?: TestCase,
  problem?: WorkoutProblem,
  userCode: string = ''
): TestDiagnostic {
  const actual = (result.actualOutput || '').trim();
  const expected = (result.expectedOutput || '').trim();
  const error = (result.error || '').trim();
  const testCall = (testCase?.testCall || '').trim();

  // 1. If explicit testCase hint exists, prioritize it as the closest hint
  const fallbackHint =
    testCase?.hint ||
    problem?.solutionHint ||
    'Review the problem requirements and verify your code output format.';

  // 2. Syntax / Compilation / Python Runtime Errors
  if (error || actual.includes('Error:') || actual.includes('Exception:')) {
    const errText = error || actual;

    if (errText.includes('SyntaxError')) {
      return {
        issueTitle: 'Python Syntax Error',
        issueDescription:
          'Python could not parse your code. This usually happens when a quotation mark (" or \') is unclosed, a parenthesis is missing, or a line has invalid syntax.',
        closestHint:
          'Check that every string starts and ends with matching quotes, and every opening parenthesis ( has a closing ).',
        badgeType: 'syntax',
      };
    }

    if (errText.includes('NameError')) {
      const match = errText.match(/name '(\w+)' is not defined/);
      const varName = match ? match[1] : 'variable';
      return {
        issueTitle: `Undefined Name: '${varName}'`,
        issueDescription: `Python encountered '${varName}', but it has not been defined yet in your script.`,
        closestHint: `Make sure you create the variable using assignment: ${varName} = ... before using it.`,
        badgeType: 'variable',
      };
    }

    if (errText.includes('TypeError')) {
      return {
        issueTitle: 'Data Type Error',
        issueDescription:
          'An operation was attempted on incompatible data types (for example, concatenating a string with a number without str()).',
        closestHint:
          'Use type conversion functions like str(x), int(x), or float(x), or pass multiple items with commas in print(a, b).',
        badgeType: 'type',
      };
    }

    if (errText.includes('IndentationError')) {
      return {
        issueTitle: 'Indentation Error',
        issueDescription:
          'Python uses whitespace indentation to structure blocks. Unexpected leading spaces or tabs caused a parsing failure.',
        closestHint: 'Ensure your code lines start at the very beginning of the line without extra spaces.',
        badgeType: 'syntax',
      };
    }

    if (errText.includes('ZeroDivisionError')) {
      return {
        issueTitle: 'Zero Division Error',
        issueDescription: 'A mathematical division or modulo by 0 occurred.',
        closestHint: 'Check your arithmetic expression to make sure the divisor is not zero.',
        badgeType: 'runtime',
      };
    }

    return {
      issueTitle: 'Runtime Execution Error',
      issueDescription: `Python raised an error while running your code: ${errText.split('\n')[0]}`,
      closestHint: fallbackHint,
      badgeType: 'runtime',
    };
  }

  // 3. Output is completely empty (User didn't print or return anything)
  if (!actual || actual === "''" || actual === '""' || actual === 'None') {
    return {
      issueTitle: 'No Output Captured',
      issueDescription:
        'Your code executed, but no output was printed to the console buffer. The verification test expected output.',
      closestHint:
        expected && expected !== 'None'
          ? `Call the built-in print() function with the required value, e.g.: print("${expected.replace(/"/g, '')}")`
          : fallbackHint,
      badgeType: 'empty',
    };
  }

  // 4. Output checking: Casing mismatch (e.g. "hello, python!" vs "Hello, Python!")
  if (actual.toLowerCase() === expected.toLowerCase() && actual !== expected) {
    return {
      issueTitle: 'Letter Casing Mismatch',
      issueDescription: `Your output matched the words, but the letter casing differs. Expected "${expected}", but got "${actual}".`,
      closestHint: `Python is strictly case-sensitive. Check capital and lowercase letters to match "${expected}" exactly.`,
      badgeType: 'casing',
    };
  }

  // 5. Output checking: Punctuation or whitespace difference
  const cleanActual = actual.replace(/[^a-zA-Z0-9]/g, '');
  const cleanExpected = expected.replace(/[^a-zA-Z0-9]/g, '');
  if (cleanActual === cleanExpected && cleanActual.length > 0 && actual !== expected) {
    return {
      issueTitle: 'Spacing or Punctuation Difference',
      issueDescription: `The letters match, but spacing or punctuation (quotes, commas, exclamation mark) differs. Got "${actual}", expected "${expected}".`,
      closestHint: `Check for missing or extra spaces, commas, or punctuation. Make sure your string is exactly "${expected}".`,
      badgeType: 'whitespace',
    };
  }

  // 6. Variable existence test check
  if (testCall.includes("' in globals()")) {
    // Extract variables expected by regex
    const matches = Array.from(testCall.matchAll(/'([a-zA-Z_][a-zA-Z0-9_]*)' in globals\(\)/g)).map(
      (m) => m[1]
    );
    const missing = matches.filter((v) => !new RegExp(`\\b${v}\\s*=`).test(userCode));

    if (missing.length > 0) {
      return {
        issueTitle: `Missing Variable: ${missing.join(', ')}`,
        issueDescription: `The verification suite checked for the variable${
          missing.length > 1 ? 's' : ''
        } ${missing.map((v) => `'${v}'`).join(', ')}, but could not find them in your code.`,
        closestHint: `Declare: ${missing.map((v) => `${v} = ...`).join(', ')} before running test cases.`,
        badgeType: 'variable',
      };
    }
  }

  // 7. Boolean condition check (e.g. `a == 15 and b == 5` returned False)
  if (expected === 'True' && (actual === 'False' || actual === '')) {
    return {
      issueTitle: 'Constraint or Condition Failed',
      issueDescription: `The test condition (${testCall}) evaluated to False instead of True.`,
      closestHint:
        problem?.solutionHint ||
        `Review the required values in the problem description to ensure your variables hold the exact specified numbers or strings.`,
      badgeType: 'value',
    };
  }

  // 8. General Value / Return Mismatch
  return {
    issueTitle: 'Output Mismatch',
    issueDescription: `Your code produced "${actual}", but the test expected "${expected}".`,
    closestHint: fallbackHint,
    badgeType: 'value',
  };
}
