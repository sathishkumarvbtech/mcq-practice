import { WorkoutProblem } from '../types/quiz';

const EMPTY_STARTER_CODE = `# Write your Python code below:

`;

export const workoutProblems: WorkoutProblem[] = [
  // ==========================================
  // LEVEL 1: BASIC SYNTAX AND VARIABLES (Q1 - Q5)
  // ==========================================
  {
    id: 'prob-1',
    title: '1. Print Hello, Python!',
    difficulty: 'Beginner',
    topic: 'Basic Syntax & Output',
    description: 'Write Python code to print `"Hello, Python!"` on the screen.',
    examples: [
      {
        input: 'None (direct script output)',
        output: 'Hello, Python!',
        explanation: 'Outputs the exact greeting text to standard console output.',
      },
    ],
    constraints: [
      'Use the print() function.',
      'Check string case and punctuation ("Hello, Python!").',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Use Python\'s built-in print() function. Enclose the text in quotes and ensure exact punctuation with the comma and exclamation mark.',
    logicExplanation: {
      summary: 'Python standard output uses the built-in print() function to format and stream character strings directly to the console output buffer.',
      steps: [
        'Call the built-in print() function with opening and closing parentheses ().',
        'Pass the text string "Hello, Python!" enclosed in either double ("...") or single (\'...\') quotation marks.',
        'Python converts the string into UTF-8 encoded text and writes it directly to sys.stdout with a trailing newline (\\n).'
      ],
      canonicalSolution: 'print("Hello, Python!")',
      keyTakeaway: 'print() automatically appends an invisible newline (\\n) character at the end of each call, ensuring subsequent prints start on a fresh line.',
    },
    internalMechanism: 'In Python, print() is a built-in function that takes string literals, converts them via str(), writes bytes to the standard output buffer (sys.stdout), and flushes with a newline (\\n) character.',
    testCases: [
      {
        id: 'tc-1-1',
        inputDescription: 'Check printed console output matches exact greeting',
        testCall: '__stdout__',
        expectedOutput: 'Hello, Python!',
      },
    ],
  },
  {
    id: 'prob-2',
    title: '2. Create and Print Profile Variables',
    difficulty: 'Beginner',
    topic: 'Variables & Data Types',
    description: 'Create three variables: `name`, `age`, and `city`. Store your details in them and print them separated by space.',
    examples: [
      {
        input: 'Sample values: name="Alex", age=25, city="New York"',
        output: 'Alex 25 New York',
        explanation: 'Variables store values in memory and print() outputs them separated by space.',
      },
    ],
    constraints: [
      'Define variable names: name, age, city.',
      'Use print() to output their values.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Create each variable using the assignment operator (=), putting text in quotes and numbers without quotes. Pass all three variables separated by commas inside print(...).',
    logicExplanation: {
      summary: 'Variables are symbolic identifiers that bind human-friendly names to values stored in heap memory. The print() function can accept multiple comma-separated variables and automatically joins them with spaces.',
      steps: [
        'Assign your name as a string to the variable name: name = "Alex".',
        'Assign your age as a number to age: age = 25 (without quotes, so it is stored as an integer).',
        'Assign your city as a string: city = "New York".',
        'Call print(name, age, city) with commas. Python automatically converts each object via str() and separates them with a space.'
      ],
      canonicalSolution: 'name = "Alex"\nage = 25\ncity = "New York"\nprint(name, age, city)',
      keyTakeaway: 'Passing multiple arguments to print(a, b, c) automatically formats them with a space separator (sep=" "). You do not need manual string concatenation with "+".',
    },
    internalMechanism: 'Variables in Python are symbolic names referencing heap-allocated objects. Creating name = "..." updates the local frame namespace dictionary, associating the identifier pointer with the object.',
    testCases: [
      {
        id: 'tc-2-1',
        inputDescription: 'Verify variables name, age, city are defined',
        testCall: "'name' in globals() and 'age' in globals() and 'city' in globals()",
        expectedOutput: 'True',
      },
      {
        id: 'tc-2-2',
        inputDescription: 'Verify variables are printed to console',
        testCall: "len(_captured_user_stdout.strip()) > 0",
        expectedOutput: 'True',
      },
    ],
  },
  {
    id: 'prob-3',
    title: '3. Basic Arithmetic: a = 15, b = 5',
    difficulty: 'Beginner',
    topic: 'Numbers & Arithmetic',
    description: 'Create two numbers `a = 15` and `b = 5`. Print their sum (`a + b`), subtraction (`a - b`), multiplication (`a * b`), and division (`a / b`).',
    examples: [
      {
        input: 'Values: a = 15, b = 5',
        output: '20\n10\n75\n3.0',
        explanation: 'Computes and prints all 4 primary arithmetic operations on separate lines.',
      },
    ],
    constraints: [
      'Define a = 15 and b = 5.',
      'Print sum, difference, product, and division in order.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Assign 15 to a and 5 to b. Then use the 4 standard arithmetic operators (+, -, *, /) inside print() calls.',
    logicExplanation: {
      summary: 'Python supports standard mathematical operators for numeric computations: + (addition), - (subtraction), * (multiplication), and / (true floating-point division).',
      steps: [
        'Define the integer variables: a = 15 and b = 5.',
        'Compute and print sum: a + b yields integer 20.',
        'Compute and print subtraction: a - b yields integer 10.',
        'Compute and print multiplication: a * b yields integer 75.',
        'Compute and print true division: a / b yields float 3.0 (Python 3 true division always produces a floating-point number).'
      ],
      canonicalSolution: 'a = 15\nb = 5\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a / b)',
      keyTakeaway: 'In Python 3, single slash (/) always performs true floating-point division, returning 3.0 rather than integer 3. To perform integer floor division, use the double slash (//) operator.',
    },
    internalMechanism: 'Python uses dunder methods __add__, __sub__, __mul__, and __truediv__. True division (/) always converts operands to floating-point representation (3.0 instead of integer 3).',
    testCases: [
      {
        id: 'tc-3-1',
        inputDescription: 'Check variables a = 15 and b = 5 are assigned',
        testCall: "a == 15 and b == 5",
        expectedOutput: 'True',
      },
      {
        id: 'tc-3-2',
        inputDescription: 'Verify arithmetic results appear in console output',
        testCall: "'20' in _captured_user_stdout and '10' in _captured_user_stdout and '75' in _captured_user_stdout and '3.0' in _captured_user_stdout",
        expectedOutput: 'True',
      },
    ],
  },
  {
    id: 'prob-4',
    title: '4. Print Data Type of price = 99.5',
    difficulty: 'Beginner',
    topic: 'Data Types & Float',
    description: 'Create a variable `price = 99.5`. Print its data type using the `type()` function.',
    examples: [
      {
        input: 'price = 99.5',
        output: "<class 'float'>",
        explanation: 'Python detects decimal numbers as floating-point numbers.',
      },
    ],
    constraints: [
      'Define price = 99.5.',
      'Pass the variable to type().',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Pass the variable name into Python\'s built-in type(...) function inside a print(...) statement to display its data type.',
    logicExplanation: {
      summary: 'Python is an object-oriented, dynamically typed language. The built-in type() function inspects an object at runtime and returns its underlying class constructor.',
      steps: [
        'Initialize the variable price = 99.5 with a decimal value.',
        'Because the value contains a decimal point, Python allocates a PyFloatObject of type float.',
        'Pass the variable into type(price) to inspect its type.',
        'Pass that into print(...) to output <class \'float\'> to the console.'
      ],
      canonicalSolution: 'price = 99.5\nprint(type(price))',
      keyTakeaway: 'You do not declare data types explicitly in Python; the interpreter determines and associates types dynamically when values are assigned.',
    },
    internalMechanism: 'type(price) inspects the ob_type header of the PyFloatObject, returning the class type `<class \'float\'>`.',
    testCases: [
      {
        id: 'tc-4-1',
        inputDescription: 'Check price is assigned 99.5',
        testCall: "price == 99.5",
        expectedOutput: 'True',
      },
      {
        id: 'tc-4-2',
        inputDescription: 'Check printed type output contains float',
        testCall: '__stdout_contains__',
        expectedOutput: 'float',
      },
    ],
  },
  {
    id: 'prob-5',
    title: '5. Python Comments',
    difficulty: 'Beginner',
    topic: 'Comments & Documentation',
    description: 'Write a Python program with a comment explaining what the code does, then print `"Python comments are useful!"`.',
    examples: [
      {
        input: 'A comment line + print statement',
        output: 'Python comments are useful!',
        explanation: 'Comments start with # and are ignored by Python when the code runs.',
      },
    ],
    constraints: [
      'Use # for your comment.',
      'Print "Python comments are useful!".',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Start a line with the hash symbol (#) followed by any descriptive note. On the next line, call print() with the required text.',
    logicExplanation: {
      summary: 'Comments document human intent and program reasoning. The Python parser completely ignores everything following a # symbol up to the end of that line.',
      steps: [
        'Add a line starting with #, such as # Explaining program behavior.',
        'During lexical analysis, Python tokenizer skips any text marked with #.',
        'On the next line, call print("Python comments are useful!") which compiles and executes normally.'
      ],
      canonicalSolution: '# This program prints a helpful message\nprint("Python comments are useful!")',
      keyTakeaway: 'Comments produce 0 bytecode instructions. Use them to explain "why" a particular logic is implemented, rather than stating the obvious.',
    },
    internalMechanism: 'The Python lexer categorizes characters following # as COMMENT tokens and completely skips them. Comments generate 0 bytecode instructions.',
    testCases: [
      {
        id: 'tc-5-1',
        inputDescription: 'Check console output for the message',
        testCall: '__stdout__',
        expectedOutput: 'Python comments are useful!',
      },
    ],
  },

  // ==========================================
  // LEVEL 2: DATA TYPES, CASTING AND STRINGS (Q6 - Q10)
  // ==========================================
  {
    id: 'prob-6',
    title: '6. Cast String "250" to Integer and Add 50',
    difficulty: 'Beginner',
    topic: 'Type Casting & Numbers',
    description: 'Convert the string `"250"` into an integer, add `50` to it, and print the result.',
    examples: [
      {
        input: 'String "250" and number 50',
        output: '300',
        explanation: 'int("250") produces 250, then 250 + 50 = 300.',
      },
    ],
    constraints: [
      'Use int() to cast the string.',
      'Print the final calculated sum.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Strings and integers cannot be added directly. Use the int(...) function to convert the string to a numeric integer before adding 50.',
    logicExplanation: {
      summary: 'Python is a strongly typed language that does not silently coerce text into numbers. You must explicitly cast string digits using the int() constructor before performing arithmetic.',
      steps: [
        'The value "250" is of type str (character sequence), while 50 is an int.',
        'Attempting "250" + 50 directly triggers a TypeError: can only concatenate str to str.',
        'Use int("250") to parse the text characters into the integer numeric value 250.',
        'Add 50 to the integer: 250 + 50 = 300, and print the sum.'
      ],
      canonicalSolution: 'number_str = "250"\nresult = int(number_str) + 50\nprint(result)',
      keyTakeaway: 'Explicit casting with int() guarantees data integrity. Calling int() on non-numeric strings (like "abc") will raise a ValueError.',
    },
    internalMechanism: 'Python is strongly typed. Attempting `"250" + 50` raises a TypeError. `int("250")` parses decimal digits and constructs a PyLongObject for addition.',
    testCases: [
      {
        id: 'tc-6-1',
        inputDescription: 'Check console output is 300',
        testCall: '__stdout_contains__',
        expectedOutput: '300',
      },
    ],
  },
  {
    id: 'prob-7',
    title: '7. Cast Integer 100 to String and Print Type',
    difficulty: 'Beginner',
    topic: 'Casting & Strings',
    description: 'Convert the integer `100` into a string using `str()` and print its data type.',
    examples: [
      {
        input: 'Integer 100',
        output: "<class 'str'>",
        explanation: 'str(100) turns integer 100 into "100", whose type is str.',
      },
    ],
    constraints: [
      'Use str(100).',
      'Print the type of the converted string.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Convert the number using the str(...) constructor function, then check its data type using type(...) inside print().',
    logicExplanation: {
      summary: 'The str() constructor converts any object into its readable string representation. Once cast to str, mathematical operations become string operations.',
      steps: [
        'Define an integer variable or literal: 100.',
        'Call str(100) which converts the numeric object into the string "100".',
        'Pass the converted string into type(...) to obtain its class: <class \'str\'>.',
        'Print the resulting type object to the console.'
      ],
      canonicalSolution: 'num = 100\ntext = str(num)\nprint(type(text))',
      keyTakeaway: 'Converting numbers to strings is essential when preparing text for file storage, display strings, or string concatenation.',
    },
    internalMechanism: 'str(100) calls PyLong_Type tp_str slot to create an immutable PyUnicodeObject holding decimal digits.',
    testCases: [
      {
        id: 'tc-7-1',
        inputDescription: 'Check output contains str type',
        testCall: '__stdout_contains__',
        expectedOutput: 'str',
      },
    ],
  },
  {
    id: 'prob-8',
    title: '8. Store "Python Programming" and Print Length',
    difficulty: 'Beginner',
    topic: 'Strings & len()',
    description: 'Store `"Python Programming"` in a variable and print its length using the `len()` function.',
    examples: [
      {
        input: 'Text: "Python Programming"',
        output: '18',
        explanation: 'The string has 18 characters, including the space.',
      },
    ],
    constraints: [
      'Store "Python Programming" in a variable.',
      'Use len() to print the character count.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Store the text in a variable, then pass that variable into Python\'s built-in len(...) function inside print().',
    logicExplanation: {
      summary: 'The built-in len() function measures the number of elements in any sequence. For strings, it counts every individual character, including punctuation and whitespace.',
      steps: [
        'Store the string in a variable: course = "Python Programming".',
        'Call len(course) to inspect its character count.',
        'Counting characters: "Python" (6) + " " (1) + "Programming" (11) = 18 total characters.',
        'Print the integer length.'
      ],
      canonicalSolution: 'course = "Python Programming"\nprint(len(course))',
      keyTakeaway: 'len() executes in O(1) constant time because CPython stores the length directly in the string header (ob_size) rather than looping through characters.',
    },
    internalMechanism: 'In CPython, string length is precomputed in PyVarObject.ob_size. Calling len() executes in O(1) time without scanning characters.',
    testCases: [
      {
        id: 'tc-8-1',
        inputDescription: 'Check length 18 is printed',
        testCall: '__stdout_contains__',
        expectedOutput: '18',
      },
    ],
  },
  {
    id: 'prob-9',
    title: '9. Join First Name and Last Name',
    difficulty: 'Beginner',
    topic: 'String Concatenation',
    description: 'Create two variables `first_name` and `last_name`. Join them into one string separated by a space and print it.',
    examples: [
      {
        input: 'Sample values: first_name="Guido", last_name="van Rossum"',
        output: 'Guido van Rossum',
        explanation: 'Combines two string variables with a space between them.',
      },
    ],
    constraints: [
      'Define first_name and last_name.',
      'Join them with a space.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'You can combine strings using the + operator with a space " " in between (or pass them separated by commas inside print()).',
    logicExplanation: {
      summary: 'Strings can be joined together using concatenation (+), formatted f-strings (f"{a} {b}"), or by passing multiple arguments into print().',
      steps: [
        'Declare first_name = "Guido" and last_name = "van Rossum".',
        'To include a space between them using +, join with an explicit space: first_name + " " + last_name.',
        'Alternatively, use Python f-strings: f"{first_name} {last_name}".',
        'Print the concatenated full name.'
      ],
      canonicalSolution: 'first_name = "Guido"\nlast_name = "van Rossum"\nfull_name = first_name + " " + last_name\nprint(full_name)',
      keyTakeaway: 'Python strings are immutable. Every concatenation (+) allocates a new string in memory containing the combined characters.',
    },
    internalMechanism: 'String concatenation or f-strings allocate a new string buffer with combined length, copying characters into the new memory object.',
    testCases: [
      {
        id: 'tc-9-1',
        inputDescription: 'Verify first_name and last_name are defined in globals',
        testCall: "'first_name' in globals() and 'last_name' in globals()",
        expectedOutput: 'True',
      },
      {
        id: 'tc-9-2',
        inputDescription: 'Verify full name output in console contains a space',
        testCall: "len(_captured_user_stdout.strip()) > 0 and ' ' in _captured_user_stdout.strip()",
        expectedOutput: 'True',
      },
    ],
  },
  {
    id: 'prob-10',
    title: '10. Convert Float 12.8 to Integer',
    difficulty: 'Beginner',
    topic: 'Casting & Truncation',
    description: 'Create a variable `number = 12.8`. Convert it into an integer using `int()` and print the result.',
    examples: [
      {
        input: 'number = 12.8',
        output: '12',
        explanation: 'int(12.8) truncates the decimal part, resulting in 12.',
      },
    ],
    constraints: [
      'Define number = 12.8.',
      'Print int(number) which is 12.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Pass the float variable into the int(...) function inside print() to truncate the decimal part without rounding.',
    logicExplanation: {
      summary: 'Passing a floating-point number to int() truncates the fractional portion towards zero. It does NOT round to the nearest whole number.',
      steps: [
        'Assign number = 12.8.',
        'Call int(number). The int() function discards .8 and retains only the whole integer 12.',
        'Even though 12.8 is mathematically closer to 13, int() performs strict truncation.',
        'Print the converted integer 12.'
      ],
      canonicalSolution: 'number = 12.8\nprint(int(number))',
      keyTakeaway: 'If you want standard mathematical rounding to the nearest integer, use the round() function: round(12.8) produces 13, whereas int(12.8) produces 12.',
    },
    internalMechanism: 'int() truncates floating-point values towards zero by discarding decimal digits. It does not round to 13.',
    testCases: [
      {
        id: 'tc-10-1',
        inputDescription: 'Check truncated integer 12 is printed',
        testCall: '__stdout_contains__',
        expectedOutput: '12',
      },
    ],
  },

  // ==========================================
  // LEVEL 3: NUMBERS AND COMPARISON OPERATORS (Q11 - Q15)
  // ==========================================
  {
    id: 'prob-11',
    title: '11. Find Remainder of 29 Divided by 6',
    difficulty: 'Beginner',
    topic: 'Modulo Operator',
    description: 'Find the remainder when 29 is divided by 6 using the modulo (`%`) operator and print the result.',
    examples: [
      {
        input: 'Dividend: 29, Divisor: 6',
        output: '5',
        explanation: '29 = (6 * 4) + 5, so the remainder is 5.',
      },
    ],
    constraints: [
      'Use the modulo operator %.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Use the modulo operator (%) between 29 and 6 inside print() to calculate the remainder left over after division.',
    logicExplanation: {
      summary: 'The modulo operator (%) calculates the remainder after integer division. It answers: after fitting the divisor as many whole times as possible, what is left over?',
      steps: [
        'Divide 29 by 6: 6 fits into 29 four times (6 * 4 = 24).',
        'Subtract 24 from 29: 29 - 24 = 5.',
        'Evaluate 29 % 6 inside print() to output 5.'
      ],
      canonicalSolution: 'print(29 % 6)',
      keyTakeaway: 'Modulo is widely used to check even/odd numbers (n % 2 == 0), wrap circular indices, and extract trailing digits.',
    },
    internalMechanism: 'In Python, modulo calculates r = a - (a // b) * b. For 29 % 6, 29 // 6 is 4, and 29 - 24 = 5.',
    testCases: [
      {
        id: 'tc-11-1',
        inputDescription: 'Check remainder 5 is printed',
        testCall: '__stdout_contains__',
        expectedOutput: '5',
      },
    ],
  },
  {
    id: 'prob-12',
    title: '12. Check If 25 Is Greater Than 15',
    difficulty: 'Beginner',
    topic: 'Comparison Operators',
    description: 'Check whether 25 is greater than 15 using the `>` operator and print the boolean result.',
    examples: [
      {
        input: 'Values: 25 and 15',
        output: 'True',
        explanation: 'Since 25 is greater than 15, the comparison returns True.',
      },
    ],
    constraints: [
      'Use the > comparison operator.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Place the greater-than comparison operator (>) between 25 and 15 inside a print(...) statement.',
    logicExplanation: {
      summary: 'Comparison operators compare two values and produce a boolean result: either True or False.',
      steps: [
        'Apply the greater-than relational operator: 25 > 15.',
        'Since 25 is strictly higher than 15, the expression resolves to the boolean object True.',
        'Print the boolean result to standard output.'
      ],
      canonicalSolution: 'print(25 > 15)',
      keyTakeaway: 'In Python, bool is a subclass of int. True equals 1 and False equals 0 in mathematical contexts.',
    },
    internalMechanism: 'Comparison operators return singletons Py_True or Py_False of type bool, which is an integer subclass where True == 1.',
    testCases: [
      {
        id: 'tc-12-1',
        inputDescription: 'Check True is printed',
        testCall: '__stdout_contains__',
        expectedOutput: 'True',
      },
    ],
  },
  {
    id: 'prob-13',
    title: '13. Check If Two Numbers Are Equal',
    difficulty: 'Beginner',
    topic: 'Equality Operator',
    description: 'Check whether two numbers (e.g. `10` and `10`) are equal using the `==` operator and print `True` or `False`.',
    examples: [
      {
        input: 'Values: 10 and 10',
        output: 'True',
        explanation: 'Both values are identical, so == evaluates to True.',
      },
    ],
    constraints: [
      'Use == (not single = assignment).',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Remember to use the double equals operator (==) for comparison rather than a single = (which is for assignment).',
    logicExplanation: {
      summary: 'The equality operator (==) tests whether two expressions have equal values. A single equals (=) assigns a variable, while double equals (==) tests equality.',
      steps: [
        'Define or compare two equal numeric values, e.g. 10 == 10.',
        'Python calls the __eq__ method to compare value equivalence.',
        'Because both values are identical, the expression returns True.'
      ],
      canonicalSolution: 'a = 10\nb = 10\nprint(a == b)',
      keyTakeaway: 'Never confuse single = (assignment) with double == (equality check). Using a single = in a condition raises a SyntaxError in Python.',
    },
    internalMechanism: 'The == operator tests value equality by calling __eq__, verifying whether values match.',
    testCases: [
      {
        id: 'tc-13-1',
        inputDescription: 'Check boolean equality printed',
        testCall: '__stdout_contains__',
        expectedOutput: 'True',
      },
    ],
  },
  {
    id: 'prob-14',
    title: '14. Predict Output: x > 5 and y < 5',
    difficulty: 'Beginner',
    topic: 'Logical AND',
    description: 'Given `x = 10` and `y = 3`, evaluate whether `x > 5 and y < 5` and print the boolean result.',
    examples: [
      {
        input: 'x = 10, y = 3',
        output: 'True',
        explanation: '10 > 5 is True and 3 < 5 is True. Both are True, so result is True.',
      },
    ],
    constraints: [
      'Define x = 10 and y = 3.',
      'Print the evaluation of x > 5 and y < 5.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Define x and y with the specified values, then print the compound condition using the and keyword.',
    logicExplanation: {
      summary: 'The logical and operator returns True if and only if BOTH conditions evaluate to True. If either condition is False, the entire expression evaluates to False.',
      steps: [
        'Define x = 10 and y = 3.',
        'Evaluate the left condition: x > 5 -> 10 > 5 is True.',
        'Evaluate the right condition: y < 5 -> 3 < 5 is True.',
        'Combine with and: True and True resolves to True.'
      ],
      canonicalSolution: 'x = 10\ny = 3\nprint(x > 5 and y < 5)',
      keyTakeaway: 'Python uses short-circuit evaluation. If the left operand of an "and" expression is False, Python stops immediately and returns False without evaluating the right operand.',
    },
    internalMechanism: 'Python evaluates `x > 5` (True). Since left side is true, it evaluates `y < 5` (True), yielding True.',
    testCases: [
      {
        id: 'tc-14-1',
        inputDescription: 'Check output is True',
        testCall: '__stdout_contains__',
        expectedOutput: 'True',
      },
    ],
  },
  {
    id: 'prob-15',
    title: '15. Predict Output: a > 10 or b > 10',
    difficulty: 'Beginner',
    topic: 'Logical OR',
    description: 'Given `a = 8` and `b = 12`, evaluate whether `a > 10 or b > 10` and print the boolean result.',
    examples: [
      {
        input: 'a = 8, b = 12',
        output: 'True',
        explanation: '8 > 10 is False, but 12 > 10 is True. The or operator requires only one side to be True.',
      },
    ],
    constraints: [
      'Define a = 8 and b = 12.',
      'Print the evaluation of a > 10 or b > 10.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Assign 8 to a and 12 to b. The logical or operator evaluates to True if at least one side is True.',
    logicExplanation: {
      summary: 'The logical or operator returns True if AT LEAST ONE of the operands evaluates to True. It only returns False if BOTH operands are False.',
      steps: [
        'Define a = 8 and b = 12.',
        'Evaluate the left condition: a > 10 -> 8 > 10 is False.',
        'Evaluate the right condition: b > 10 -> 12 > 10 is True.',
        'Combine with or: False or True resolves to True.'
      ],
      canonicalSolution: 'a = 8\nb = 12\nprint(a > 10 or b > 10)',
      keyTakeaway: 'In an "or" expression, if the left operand is True, Python short-circuits and immediately returns True without checking the right operand.',
    },
    internalMechanism: 'Python evaluates `8 > 10` (False). For `or`, it proceeds to evaluate the right side `12 > 10` (True), resulting in True.',
    testCases: [
      {
        id: 'tc-15-1',
        inputDescription: 'Check output is True',
        testCall: '__stdout_contains__',
        expectedOutput: 'True',
      },
    ],
  },

  // ==========================================
  // LEVEL 4: LOGICAL OPERATORS (Q16 - Q20)
  // ==========================================
  {
    id: 'prob-16',
    title: '16. Working Age Check (and)',
    difficulty: 'Beginner',
    topic: 'Logical Operators',
    description: 'Given `age = 25`, write Python code to check whether the age is at least 18 and below 60 using `and`. Print the result.',
    examples: [
      {
        input: 'age = 25',
        output: 'True',
        explanation: '25 is >= 18 and also < 60, satisfying both requirements.',
      },
    ],
    constraints: [
      'Define age = 25.',
      'Use the and operator.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Write two relational conditions (one for >= 18 and one for < 60) and connect them using the and operator inside print().',
    logicExplanation: {
      summary: 'Range validation requires verifying that a value is greater than or equal to the lower bound AND strictly less than the upper bound.',
      steps: [
        'Define age = 25.',
        'Check lower bound: age >= 18 (25 >= 18 is True).',
        'Check upper bound: age < 60 (25 < 60 is True).',
        'Join with and: True and True evaluates to True.'
      ],
      canonicalSolution: 'age = 25\nprint(age >= 18 and age < 60)',
      keyTakeaway: 'Both conditions must be stated completely: write age >= 18 and age < 60, not age >= 18 and < 60.',
    },
    internalMechanism: 'Logical "and" requires both expressions to be truthy. Since 25 >= 18 is True and 25 < 60 is True, it returns True.',
    testCases: [
      {
        id: 'tc-16-1',
        inputDescription: 'Check output is True',
        testCall: '__stdout_contains__',
        expectedOutput: 'True',
      },
    ],
  },
  {
    id: 'prob-17',
    title: '17. Boundary Check: 0 or 100 (or)',
    difficulty: 'Beginner',
    topic: 'Logical Operators',
    description: 'Given `number = 0`, write Python code to check whether the number is equal to 0 or equal to 100 using `or`. Print the result.',
    examples: [
      {
        input: 'number = 0',
        output: 'True',
        explanation: 'The number is 0, so the or condition succeeds immediately.',
      },
    ],
    constraints: [
      'Define number = 0.',
      'Use explicit comparison: number == 0 or number == 100.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Write two separate equality checks using == (one comparing with 0, another with 100), connected by the or operator.',
    logicExplanation: {
      summary: 'Checking if a variable matches one of several candidate values requires testing each condition individually with the == operator and connecting them with "or".',
      steps: [
        'Define number = 0.',
        'Check first target: number == 0 (0 == 0 is True).',
        'Because the first condition is True, the "or" operator short-circuits and immediately returns True.'
      ],
      canonicalSolution: 'number = 0\nprint(number == 0 or number == 100)',
      keyTakeaway: 'A common beginner mistake is writing number == 0 or 100. In Python, 100 is truthy, so number == 0 or 100 always evaluates to 100 (truthy) regardless of number! Always write number == 0 or number == 100.',
    },
    internalMechanism: '`number == 0` evaluates to True. The `or` operator short-circuits and immediately yields True without evaluating the second term.',
    testCases: [
      {
        id: 'tc-17-1',
        inputDescription: 'Check output is True',
        testCall: '__stdout_contains__',
        expectedOutput: 'True',
      },
    ],
  },
  {
    id: 'prob-18',
    title: '18. Invert Boolean with NOT',
    difficulty: 'Beginner',
    topic: 'Logical Operators',
    description: 'Given `is_raining = True`, use the `not` operator to print the opposite Boolean value.',
    examples: [
      {
        input: 'is_raining = True',
        output: 'False',
        explanation: 'The not operator inverts True into False.',
      },
    ],
    constraints: [
      'Define is_raining = True.',
      'Use the not operator.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Place the not keyword directly in front of the boolean variable name inside your print() function.',
    logicExplanation: {
      summary: 'The logical not operator performs boolean negation. It flips True to False and False to True.',
      steps: [
        'Define is_raining = True.',
        'Apply the not operator: not is_raining inverts True to False.',
        'Print the inverted boolean.'
      ],
      canonicalSolution: 'is_raining = True\nprint(not is_raining)',
      keyTakeaway: 'not can be used on any truthy or falsy object in Python: not 0 is True, not "" is True, and not [1, 2] is False.',
    },
    internalMechanism: 'The `not` operator negates truth values: not True evaluates to False.',
    testCases: [
      {
        id: 'tc-18-1',
        inputDescription: 'Check output is False',
        testCall: '__stdout_contains__',
        expectedOutput: 'False',
      },
    ],
  },
  {
    id: 'prob-19',
    title: '19. Inclusive Range Check (10 to 50)',
    difficulty: 'Beginner',
    topic: 'Chained Comparison',
    description: 'Given `number = 35`, check whether it is between 10 and 50, inclusive (`10 <= number <= 50`). Print the result.',
    examples: [
      {
        input: 'number = 35',
        output: 'True',
        explanation: '35 falls between 10 and 50 inclusive.',
      },
    ],
    constraints: [
      'Define number = 35.',
      'Check 10 <= number <= 50.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Python supports chained comparisons directly (e.g. 10 <= number <= 50), or you can use (number >= 10 and number <= 50).',
    logicExplanation: {
      summary: 'Python uniquely supports mathematical chained comparisons: 10 <= number <= 50 evaluates both boundary conditions cleanly in a single expression.',
      steps: [
        'Define number = 35.',
        'Apply the chained expression: 10 <= number <= 50.',
        'Python checks 10 <= 35 (True) and 35 <= 50 (True).',
        'Both are True, so the expression resolves to True.'
      ],
      canonicalSolution: 'number = 35\nprint(10 <= number <= 50)',
      keyTakeaway: 'Chained comparison evaluates the middle operand (number) only once, making it both cleaner and more efficient than (number >= 10 and number <= 50).',
    },
    internalMechanism: 'Chained comparison `10 <= number <= 50` is evaluated in Python with single evaluation of the middle variable.',
    testCases: [
      {
        id: 'tc-19-1',
        inputDescription: 'Check output is True',
        testCall: '__stdout_contains__',
        expectedOutput: 'True',
      },
    ],
  },
  {
    id: 'prob-20',
    title: '20. Student Pass Eligibility Check',
    difficulty: 'Beginner',
    topic: 'Logical Operators',
    description: 'A student passes only if marks are at least 35 AND attendance is at least 75%. Given `marks = 60` and `attendance = 80`, print the pass result (`True` or `False`).',
    examples: [
      {
        input: 'marks = 60, attendance = 80',
        output: 'True',
        explanation: 'Both criteria are satisfied (60 >= 35 and 80 >= 75).',
      },
    ],
    constraints: [
      'Define marks = 60 and attendance = 80.',
      'Check marks >= 35 and attendance >= 75.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Define both variables and use the and keyword to verify that marks >= 35 and attendance >= 75 inside print().',
    logicExplanation: {
      summary: 'Business rules with multiple mandatory requirements are expressed using the logical and operator, ensuring every qualification threshold is met.',
      steps: [
        'Define marks = 60 and attendance = 80.',
        'Verify marks: marks >= 35 -> 60 >= 35 is True.',
        'Verify attendance: attendance >= 75 -> 80 >= 75 is True.',
        'Both conditions are True: True and True resolves to True.'
      ],
      canonicalSolution: 'marks = 60\nattendance = 80\nprint(marks >= 35 and attendance >= 75)',
      keyTakeaway: 'Logical "and" is the standard way to enforce strict prerequisites: if any single condition fails, the overall outcome is False.',
    },
    internalMechanism: 'Compound and requires both threshold conditions to pass. Since 60 >= 35 and 80 >= 75 are both True, result is True.',
    testCases: [
      {
        id: 'tc-20-1',
        inputDescription: 'Check output is True',
        testCall: '__stdout_contains__',
        expectedOutput: 'True',
      },
    ],
  },

  // ==========================================
  // LEVEL 5: TERNARY OPERATOR (Q21 - Q25)
  // ==========================================
  {
    id: 'prob-21',
    title: '21. Ternary Operator: Adult or Minor',
    difficulty: 'Beginner',
    topic: 'Ternary Operator',
    description: 'Given `age = 17`, assign `"Adult"` if age is at least 18; otherwise assign `"Minor"` using a ternary operator. Print the result.',
    examples: [
      {
        input: 'age = 17',
        output: 'Minor',
        explanation: 'Since 17 is less than 18, the ternary expression selects the else branch ("Minor").',
      },
    ],
    constraints: [
      'Define age = 17.',
      'Use ternary: value_if_true if condition else value_if_false.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Use Python\'s one-line conditional expression format: `value_if_true if condition else value_if_false`.',
    logicExplanation: {
      summary: 'Python\'s ternary operator provides concise one-line if-else branching: value_if_true if condition else value_if_false.',
      steps: [
        'Define age = 17.',
        'Evaluate the middle condition: age >= 18 -> 17 >= 18 is False.',
        'Because the condition is False, Python jumps to the else branch and returns "Minor".',
        'Assign the result to status and print it.'
      ],
      canonicalSolution: 'age = 17\nstatus = "Adult" if age >= 18 else "Minor"\nprint(status)',
      keyTakeaway: 'Unlike other languages that use ? :, Python reads like natural English: result = "Adult" if age >= 18 else "Minor". The condition always sits in the middle.',
    },
    internalMechanism: 'Python ternary syntax evaluates `condition`. Since 17 >= 18 is False, it jumps directly to the else branch "Minor".',
    testCases: [
      {
        id: 'tc-21-1',
        inputDescription: 'Check output is Minor',
        testCall: '__stdout_contains__',
        expectedOutput: 'Minor',
      },
    ],
  },
  {
    id: 'prob-22',
    title: '22. Ternary Operator: Even or Odd',
    difficulty: 'Beginner',
    topic: 'Ternary Operator',
    description: 'Given `number = 8`, assign `"Even"` if the number is even; otherwise assign `"Odd"` using a ternary operator. Print the result.',
    examples: [
      {
        input: 'number = 8',
        output: 'Even',
        explanation: '8 % 2 == 0 is True, so the ternary expression selects "Even".',
      },
    ],
    constraints: [
      'Define number = 8.',
      'Use ternary expression with % 2 == 0.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'A number is even if dividing it by 2 leaves no remainder (number % 2 == 0). Use this as the condition inside your ternary expression.',
    logicExplanation: {
      summary: 'Modulo (% 2) checks if a number is divisible by 2 with no remainder. Combining modulo with a ternary expression cleanly classifies numbers as Even or Odd.',
      steps: [
        'Define number = 8.',
        'Evaluate parity condition: 8 % 2 == 0 (8 % 2 is 0, and 0 == 0 is True).',
        'Because the condition is True, the expression selects the first branch: "Even".',
        'Print the result.'
      ],
      canonicalSolution: 'number = 8\nparity = "Even" if number % 2 == 0 else "Odd"\nprint(parity)',
      keyTakeaway: 'Ternary expressions are expressions that evaluate to a value, meaning you can assign them directly to variables or pass them into print() as arguments.',
    },
    internalMechanism: 'Computes `8 % 2 == 0` (True), jumping straight to the first branch "Even".',
    testCases: [
      {
        id: 'tc-22-1',
        inputDescription: 'Check output is Even',
        testCall: '__stdout_contains__',
        expectedOutput: 'Even',
      },
    ],
  },
  {
    id: 'prob-23',
    title: '23. Ternary Operator: Pass or Fail',
    difficulty: 'Beginner',
    topic: 'Ternary Operator',
    description: 'Given `marks = 32`, assign `"Pass"` if marks are at least 35; otherwise assign `"Fail"` using a ternary operator. Print the result.',
    examples: [
      {
        input: 'marks = 32',
        output: 'Fail',
        explanation: '32 is below 35, so the ternary condition evaluates to False, yielding "Fail".',
      },
    ],
    constraints: [
      'Define marks = 32.',
      'Use ternary with marks >= 35 threshold.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Structure the ternary expression with marks >= 35 as the test condition: "Pass" if condition else "Fail".',
    logicExplanation: {
      summary: 'Grading thresholds are concisely evaluated with ternary conditionals. If the score meets or exceeds the cutoff, assign "Pass", otherwise "Fail".',
      steps: [
        'Define marks = 32.',
        'Evaluate condition: marks >= 35 -> 32 >= 35 is False.',
        'Since condition is False, the else branch "Fail" is chosen.',
        'Print the grade result.'
      ],
      canonicalSolution: 'marks = 32\ngrade = "Pass" if marks >= 35 else "Fail"\nprint(grade)',
      keyTakeaway: 'The else clause is mandatory in Python ternary expressions. You cannot omit the else branch.',
    },
    internalMechanism: 'Condition 32 >= 35 is False, so the expression evaluates to "Fail".',
    testCases: [
      {
        id: 'tc-23-1',
        inputDescription: 'Check output is Fail',
        testCall: '__stdout_contains__',
        expectedOutput: 'Fail',
      },
    ],
  },
  {
    id: 'prob-24',
    title: '24. Ternary Operator: Delivery Charge',
    difficulty: 'Beginner',
    topic: 'Ternary Operator',
    description: 'Given `amount = 600`, assign `"Free Delivery"` if the amount is at least 500; otherwise assign `"Delivery Charge"` using a ternary operator. Print the result.',
    examples: [
      {
        input: 'amount = 600',
        output: 'Free Delivery',
        explanation: 'amount (600) >= 500 is True, so free delivery applies.',
      },
    ],
    constraints: [
      'Define amount = 600.',
      'Check threshold amount >= 500 with ternary.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Use amount >= 500 as the condition between the "Free Delivery" and "Delivery Charge" branches.',
    logicExplanation: {
      summary: 'E-commerce discount and fee logic frequently uses ternary expressions to choose between complimentary service or a fee based on an order threshold.',
      steps: [
        'Define amount = 600.',
        'Evaluate order threshold: amount >= 500 -> 600 >= 500 is True.',
        'Because the condition is True, the expression selects "Free Delivery".',
        'Print the resulting delivery status.'
      ],
      canonicalSolution: 'amount = 600\ndelivery = "Free Delivery" if amount >= 500 else "Delivery Charge"\nprint(delivery)',
      keyTakeaway: 'Ternary operators collapse multi-line if-else blocks into one clean line, improving code readability when assigning variable values.',
    },
    internalMechanism: 'Condition 600 >= 500 is True, so the expression evaluates to "Free Delivery".',
    testCases: [
      {
        id: 'tc-24-1',
        inputDescription: 'Check output is Free Delivery',
        testCall: '__stdout_contains__',
        expectedOutput: 'Free Delivery',
      },
    ],
  },
  {
    id: 'prob-25',
    title: '25. Ternary with Logical AND: Eligibility',
    difficulty: 'Beginner',
    topic: 'Ternary & Logical Operators',
    description: 'A person is eligible only if they are at least 18 years old AND have an ID (`has_id = True`). Given `age = 22` and `has_id = True`, assign `"Eligible"` or `"Not Eligible"` using a ternary operator with a logical operator. Print the result.',
    examples: [
      {
        input: 'age = 22, has_id = True',
        output: 'Eligible',
        explanation: 'Both criteria (age >= 18 and has_id == True) are satisfied, yielding "Eligible".',
      },
    ],
    constraints: [
      'Define age = 22 and has_id = True.',
      'Use ternary with logical and operator.',
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: 'Combine the two conditions with the and operator in the condition portion of the ternary expression: "Eligible" if condition1 and condition2 else "Not Eligible".',
    logicExplanation: {
      summary: 'Compound logical conditions can be placed directly in the condition part of a ternary expression to evaluate multi-factor eligibility in a single readable line.',
      steps: [
        'Define age = 22 and has_id = True.',
        'Evaluate compound condition: age >= 18 and has_id.',
        'Check age: 22 >= 18 is True.',
        'Check ID: has_id is True. True and True resolves to True.',
        'Because condition is True, the ternary expression yields "Eligible".'
      ],
      canonicalSolution: 'age = 22\nhas_id = True\nstatus = "Eligible" if age >= 18 and has_id else "Not Eligible"\nprint(status)',
      keyTakeaway: 'Adding parentheses around compound conditions: "Eligible" if (age >= 18 and has_id) else "Not Eligible" makes complex ternary expressions immediately clear to other engineers.',
    },
    internalMechanism: 'Compound condition 22 >= 18 and True evaluates to True, returning "Eligible".',
    testCases: [
      {
        id: 'tc-25-1',
        inputDescription: 'Check output is Eligible',
        testCall: '__stdout_contains__',
        expectedOutput: 'Eligible',
      },
    ],
  },
];
