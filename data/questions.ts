import type { Question } from '../types/quiz';

export const questions: Question[] = [
  // ==========================================
  // TOPIC 1: Python Intro & Ecosystem (Q1 - Q4)
  // ==========================================
  {
    id: 'q1',
    topic: 'Python Intro',
    question: 'What is the role of the Global Interpreter Lock (GIL) in CPython, and what is its direct impact on multi-threading?',
    options: [
      'It restricts Python processes to a single CPU core by preventing multi-process architectures from spawning',
      'It is a mutex synchronizing CPython bytecode execution so only one native thread executes Python bytecode at a time, protecting thread-unsafe memory management',
      'It is a JIT lock that disables optimization passes whenever recursive functions are called',
      'It prevents concurrent I/O operations from writing to network sockets simultaneously'
    ],
    correctIndex: 1,
    explanation: 'The Global Interpreter Lock (GIL) in CPython is a mutual-exclusion mechanism ensuring that only one native OS thread executes Python bytecode at any given moment, safeguarding CPython reference counting and memory allocations from race conditions.'
  },
  {
    id: 'q2',
    topic: 'Python Intro',
    question: 'How is Python source code executed under standard CPython implementation?',
    options: [
      'Directly compiled into machine-level x86/ARM binary assembly',
      'Purely interpreted line-by-line without any intermediate stage',
      'Compiled into bytecode (.pyc) which is then executed by the Python Virtual Machine (PVM)',
      'Transpiled directly into C++ before execution'
    ],
    correctIndex: 2,
    explanation: 'CPython first compiles source code into platform-independent intermediate bytecode (.pyc files in __pycache__), which is then interpreted by the Python Virtual Machine (PVM).'
  },
  {
    id: 'q3',
    topic: 'Python Intro',
    question: 'Python is dynamically and strongly typed. What does "strongly typed" specifically mean in Python?',
    options: [
      'Variables must have explicit type declarations before assignment',
      'An object\'s type cannot change unexpectedly, and implicit coercion between incompatible types (e.g., "5" + 2) is not permitted',
      'Python compiles code into strongly enforced static binaries',
      'All variables are immutable by default'
    ],
    correctIndex: 1,
    explanation: 'Strong typing means Python enforces type boundaries strictly: attempting "5" + 2 raises a TypeError rather than coercing "52" or 7.'
  },
  {
    id: 'q4',
    topic: 'Python Get Started',
    question: 'Which command line flag allows executing arbitrary Python code directly from the terminal without creating a script file?',
    options: [
      'python -e "print(\'Hello\')"',
      'python -c "print(\'Hello\')"',
      'python -r "print(\'Hello\')"',
      'python -x "print(\'Hello\')"'
    ],
    correctIndex: 1,
    explanation: 'The -c (command) flag allows passing Python statements directly as a command line string: python -c "statement".'
  },

  // ==========================================
  // TOPIC 2: Python Syntax & Indentation (Q5 - Q8)
  // ==========================================
  {
    id: 'q5',
    topic: 'Python Syntax',
    question: 'What occurs if you mix tab characters and space characters for indentation within the same code block in Python 3?',
    options: [
      'Python silently treats 1 tab as exactly 4 spaces',
      'Python automatically normalizes tabs into spaces at runtime',
      'Python raises a TabError: inconsistent use of tabs and spaces in indentation',
      'Python prompts a warning but executes the script normally'
    ],
    correctIndex: 2,
    explanation: 'Python 3 strictly disallows mixing tabs and spaces for indentation in the same block, raising a TabError.'
  },
  {
    id: 'q6',
    topic: 'Python Syntax',
    question: 'What is the PEP 8 recommended way to split a long logical line across multiple lines in Python?',
    options: [
      'Using the backslash character (\\) on every continued line',
      'Enclosing the expression within parentheses ( ), brackets [ ], or braces { } using implicit line continuation',
      'Terminating each line segment with a semicolon (;)',
      'Placing triple quotes around every individual line'
    ],
    correctIndex: 1,
    explanation: 'PEP 8 strongly favors implicit line continuation inside parentheses, brackets, and braces over using backslashes.'
  },
  {
    id: 'q7',
    topic: 'Python Syntax',
    question: 'Which of the following statements represents valid Python syntax?',
    options: [
      'x = 10; y = 20; print(x + y)',
      'x = 10 and y = 20',
      'int x = 10;',
      'val x := 10;'
    ],
    correctIndex: 0,
    explanation: 'Semicolons (;) can be used to separate multiple simple statements on a single line in Python, making option A valid syntax.'
  },
  {
    id: 'q8',
    topic: 'Python Syntax',
    question: 'What is the syntactic difference between the pass statement and the Ellipsis literal (...) in a function body?',
    options: [
      'pass is valid syntax, but ... causes a SyntaxError',
      '... is valid syntax, but pass causes an IndentationError',
      'Both are valid non-operational placeholders, but ... is an actual singleton object of type ellipsis',
      'pass returns False, while ... returns True'
    ],
    correctIndex: 2,
    explanation: 'Both can serve as code block placeholders, but pass is a language keyword that does nothing, whereas ... evaluates to the built-in Ellipsis singleton object.'
  },

  // ==========================================
  // TOPIC 3: Python Output & Formatting (Q9 - Q12)
  // ==========================================
  {
    id: 'q9',
    topic: 'Python Output',
    question: 'What is the exact output of: print("A", "B", "C", sep=":", end="*"); print("D") ?',
    options: [
      'A:B:C*D',
      'A B C*D',
      'A:B:C\\nD',
      'A:B:C\\n*D'
    ],
    correctIndex: 0,
    explanation: 'print("A", "B", "C", sep=":", end="*") outputs "A:B:C*", and the subsequent print("D") prints immediately on the same line, producing "A:B:C*D".'
  },
  {
    id: 'q10',
    topic: 'Python Output',
    question: 'What occurs when executing: print("Score: " + 100) ?',
    options: [
      'Prints: Score: 100',
      'Raises a TypeError: can only concatenate str (not "int") to str',
      'Prints: Score: None',
      'Prints: Score: "100"'
    ],
    correctIndex: 1,
    explanation: 'The + operator concatenates strings, but requires both operands to be strings. It raises a TypeError when passed an integer without str() casting.'
  },
  {
    id: 'q11',
    topic: 'Python Output',
    question: 'How do you redirect output from print() to write directly to standard error (stderr) in Python?',
    options: [
      'print("Error", target="stderr")',
      'import sys; print("Error", file=sys.stderr)',
      'print.error("Error")',
      'sys.stderr.print("Error")'
    ],
    correctIndex: 1,
    explanation: 'The file parameter of print() accepts any file-like object with a write(string) method, such as sys.stderr.'
  },
  {
    id: 'q12',
    topic: 'Python Output',
    question: 'What does the flush=True parameter do in the print() function?',
    options: [
      'Clears the terminal screen before printing',
      'Forces the output stream buffer to flush immediately to the console without buffering',
      'Removes all non-printable ASCII characters',
      'Resets all global variables after printing'
    ],
    correctIndex: 1,
    explanation: 'Output streams are normally buffered for efficiency. Setting flush=True forces the runtime to flush the stream buffer immediately.'
  },

  // ==========================================
  // TOPIC 4: Python Comments & Docstrings (Q13 - Q15)
  // ==========================================
  {
    id: 'q13',
    topic: 'Python Comments',
    question: 'What is the key functional difference between a comment (#) and a docstring (""") in a Python function?',
    options: [
      'Comments can span multiple lines, but docstrings cannot',
      'Docstrings are stored at runtime in the object\'s __doc__ attribute, whereas comments are discarded by the compiler',
      'Comments are executed at runtime, while docstrings are ignored',
      'Docstrings must begin with a hash symbol (#)'
    ],
    correctIndex: 1,
    explanation: 'Docstrings are retained by the bytecode compiler and accessible at runtime via func.__doc__ or help(func), whereas comments are stripped out during lexical analysis.'
  },
  {
    id: 'q14',
    topic: 'Python Comments',
    question: 'What does the following print: def add(a, b): """Returns sum."""; return a + b; print(add.__doc__)?',
    options: [
      'None',
      'Returns sum.',
      'add(a, b)',
      'SyntaxError'
    ],
    correctIndex: 1,
    explanation: 'The string literal immediately following the function definition header becomes its __doc__ attribute, printing "Returns sum.".'
  },
  {
    id: 'q15',
    topic: 'Python Comments',
    question: 'What is the purpose of a shebang line like #!/usr/bin/env python3 at the very top of a Python file?',
    options: [
      'It activates type-checking in Python 3',
      'It tells Unix-like operating systems which interpreter to use when executing the file directly as an executable',
      'It imports standard environment variables into the script',
      'It is a special multiline comment syntax'
    ],
    correctIndex: 1,
    explanation: 'In Unix/Linux systems, the shebang (#!) informs the program loader which interpreter executable to invoke when running the script directly.'
  },

  // ==========================================
  // TOPIC 5: Python Variables & Scope (Q16 - Q21)
  // ==========================================
  {
    id: 'q16',
    topic: 'Python Variables',
    question: 'What will be the value of rest in: first, *rest, last = [1, 2, 3, 4, 5] ?',
    options: [
      '(2, 3, 4)',
      '[2, 3, 4]',
      '[1, 2, 3, 4]',
      '3'
    ],
    correctIndex: 1,
    explanation: 'Extended iterable unpacking with * collects remaining items into a list: first=1, last=5, and rest=[2, 3, 4].'
  },
  {
    id: 'q17',
    topic: 'Python Variables',
    question: 'What is the output of: a = [1, 2]; b = a; b.append(3); print(a) ?',
    options: [
      '[1, 2]',
      '[1, 2, 3]',
      '[3]',
      'TypeError: cannot mutate alias'
    ],
    correctIndex: 1,
    explanation: 'In Python, assignment binds names to objects. b = a makes b reference the exact same list object in memory, so mutating b also affects a.'
  },
  {
    id: 'q18',
    topic: 'Python Variables',
    question: 'What happens when executing: x = 10; def fn(): print(x); x = 20; fn() ?',
    options: [
      'Prints 10, then changes x to 20',
      'Prints 20',
      'Raises UnboundLocalError: cannot access local variable \'x\' where it is not associated with a value',
      'Prints None'
    ],
    correctIndex: 2,
    explanation: 'Because x = 20 assigns to x inside fn, Python marks x as a local variable for the entire function scope. Accessing it prior to assignment raises an UnboundLocalError.'
  },
  {
    id: 'q19',
    topic: 'Python Variables',
    question: 'What distinguishes the nonlocal keyword from the global keyword in Python?',
    options: [
      'nonlocal targets variables in the enclosing (outer non-global) function scope, while global targets the module-level scope',
      'nonlocal creates thread-safe variables',
      'global is used for numbers, while nonlocal is used for collections',
      'There is no difference; they are aliases for each other'
    ],
    correctIndex: 0,
    explanation: 'nonlocal binds names to previously assigned variables in nearest enclosing scopes (excluding globals), while global binds directly to the top module namespace.'
  },
  {
    id: 'q20',
    topic: 'Python Variables',
    question: 'What happens when you run: a = b = []; a.append(1); b.append(2); print(a)?',
    options: [
      '[1]',
      '[2]',
      '[1, 2]',
      '[]'
    ],
    correctIndex: 2,
    explanation: 'Chained assignment binds both a and b to the exact same list instance in memory. Modifying either modifies the shared list, resulting in [1, 2].'
  },
  {
    id: 'q21',
    topic: 'Python Variables',
    question: 'What is the result of using the del statement on a variable: x = 5; del x; print(x)?',
    options: [
      'Prints 0',
      'Prints None',
      'Raises NameError: name \'x\' is not defined',
      'Prints False'
    ],
    correctIndex: 2,
    explanation: 'del x removes the binding of the name x from the local or global namespace. Referencing it afterward raises a NameError.'
  },

  // ==========================================
  // TOPIC 6: Python Data Types & Collections (Q22 - Q27)
  // ==========================================
  {
    id: 'q22',
    topic: 'Python Data Types',
    question: 'What is the result of: d = {1: "a", 1.0: "b"}; print(len(d), d[1]) ?',
    options: [
      '2 "a"',
      '1 "b"',
      '2 "b"',
      'TypeError: conflicting keys'
    ],
    correctIndex: 1,
    explanation: 'In Python, 1 == 1.0 evaluates to True and hash(1) == hash(1.0). Therefore, 1.0 is treated as the same key as 1, overwriting its value with "b" and keeping length 1.'
  },
  {
    id: 'q23',
    topic: 'Python Data Types',
    question: 'What is the data type of the variable t in: t = (42) vs t2 = (42,)?',
    options: [
      'Both are tuples',
      't is an int, while t2 is a tuple',
      'Both are integers',
      't is a tuple, while t2 is a syntax error'
    ],
    correctIndex: 1,
    explanation: 'Parentheses without a trailing comma are treated as mathematical grouping. To create a single-element tuple, a comma is required: (42,).'
  },
  {
    id: 'q24',
    topic: 'Python Data Types',
    question: 'What happens if you execute: t = (1, 2, [3, 4]); t[2].append(5); print(t) ?',
    options: [
      'Raises TypeError because tuples are immutable and cannot change',
      'Successfully prints (1, 2, [3, 4, 5])',
      'Silently ignores the append operation',
      'Creates a new tuple copy automatically'
    ],
    correctIndex: 1,
    explanation: 'The tuple holds references to objects. While the tuple\'s reference bindings cannot be changed, mutable objects inside the tuple (like lists) can be mutated in place!'
  },
  {
    id: 'q25',
    topic: 'Python Data Types',
    question: 'Which of the following can be used as a key in a Python dictionary?',
    options: [
      '["apple", "banana"] (list)',
      '{"apple": 1} (dict)',
      '("apple", [1, 2]) (tuple containing list)',
      '("apple", 1, 2) (tuple of immutable elements)'
    ],
    correctIndex: 3,
    explanation: 'Dictionary keys must be hashable. Tuples are hashable only if all of their elements are also hashable. Lists and dicts are mutable and unhashable.'
  },
  {
    id: 'q26',
    topic: 'Python Data Types',
    question: 'What is the fundamental difference between the "==" operator and the "is" operator?',
    options: [
      '"==" checks object identity (memory address), while "is" checks value equality',
      '"==" checks value equality, while "is" checks object identity (same memory location via id())',
      '"is" only works for integers, while "==" works for strings',
      'There is no difference; they can be used interchangeably'
    ],
    correctIndex: 1,
    explanation: '"==" checks if values are equal (invoking __eq__), while "is" checks if two variables refer to the exact same object in memory (id(a) == id(b)).'
  },
  {
    id: 'q27',
    topic: 'Python Data Types',
    question: 'What does Python do under the hood with small integers in the range [-5, 256]?',
    options: [
      'Converts them to 8-bit unsigned integers',
      'Interns (caches) them as singleton objects in memory so identical values share the same object ID',
      'Disallows using them as dictionary keys',
      'Stores them on the CPU cache exclusively'
    ],
    correctIndex: 1,
    explanation: 'CPython pre-allocates and caches an array of integer objects for integers in the range [-5, 256]. Thus, a = 256 and b = 256 satisfy "a is b".'
  },

  // ==========================================
  // TOPIC 7: Python Numbers & Math (Q28 - Q32)
  // ==========================================
  {
    id: 'q28',
    topic: 'Python Numbers',
    question: 'What does the floor division expression -7 // 2 evaluate to in Python?',
    options: [
      '-3',
      '-3.5',
      '-4',
      'Error'
    ],
    correctIndex: 2,
    explanation: 'Python\'s // operator performs floor division (rounding down towards negative infinity). -3.5 rounded down towards negative infinity is -4.'
  },
  {
    id: 'q29',
    topic: 'Python Numbers',
    question: 'What does the modulo expression -7 % 3 evaluate to in Python?',
    options: [
      '-1',
      '2',
      '1',
      '-2'
    ],
    correctIndex: 1,
    explanation: 'In Python, modulo follows the sign of the divisor: r = a - (a // b) * b. Here -7 - (-7 // 3) * 3 = -7 - (-3 * 3) = -7 + 9 = 2.'
  },
  {
    id: 'q30',
    topic: 'Python Numbers',
    question: 'Why does 0.1 + 0.2 == 0.3 evaluate to False in standard Python?',
    options: [
      'Python bug in the float parser',
      'Due to binary floating-point representation limits defined by IEEE 754 standard',
      'Because 0.1 is converted to a rational fraction',
      'Because equality operator cannot be used on floats'
    ],
    correctIndex: 1,
    explanation: 'Decimals like 0.1 and 0.2 cannot be represented precisely in binary floating-point, resulting in 0.30000000000000004 != 0.3.'
  },
  {
    id: 'q31',
    topic: 'Python Numbers',
    question: 'Given complex number z = 3 + 4j, what are the types and values of z.real and z.imag?',
    options: [
      'int: 3 and 4',
      'float: 3.0 and 4.0',
      'complex: 3j and 4j',
      'str: "3" and "4"'
    ],
    correctIndex: 1,
    explanation: 'The .real and .imag attributes of a complex number in Python are always stored as floating-point numbers: 3.0 and 4.0.'
  },
  {
    id: 'q32',
    topic: 'Python Numbers',
    question: 'How do random.randint(1, 10) and random.randrange(1, 10) differ regarding the upper bound 10?',
    options: [
      'randint excludes 10, while randrange includes 10',
      'randint includes 10 (stop is inclusive), while randrange excludes 10 (stop is exclusive)',
      'Both include 10',
      'Both exclude 10'
    ],
    correctIndex: 1,
    explanation: 'random.randint(a, b) includes both endpoints [a, b], while random.randrange(a, b) follows the standard range convention where b is excluded [a, b).'
  },

  // ==========================================
  // TOPIC 8: Python Casting & Conversion (Q33 - Q36)
  // ==========================================
  {
    id: 'q33',
    topic: 'Python Casting',
    question: 'What does int("1101", 2) return in Python?',
    options: [
      '1101',
      '13',
      'TypeError: base argument not allowed for string',
      '2'
    ],
    correctIndex: 1,
    explanation: 'The int() function accepts an optional second argument specifying the numerical base (radix). Binary 1101 is 1*8 + 1*4 + 0*2 + 1*1 = 13.'
  },
  {
    id: 'q34',
    topic: 'Python Casting',
    question: 'What is the output of round(2.5) and round(3.5) in Python 3?',
    options: [
      '3 and 4 (standard rounding up)',
      '2 and 3 (standard truncation)',
      '2 and 4 ("round half to even" / Banker\'s rounding)',
      '3 and 3'
    ],
    correctIndex: 2,
    explanation: 'Python 3 implements "Banker\'s rounding" (round half to nearest even integer): 2.5 rounds to even 2, and 3.5 rounds to even 4.'
  },
  {
    id: 'q35',
    topic: 'Python Casting',
    question: 'What is the result of casting float("inf") and float("-inf") in Python?',
    options: [
      'Raises ValueError',
      'Returns positive and negative infinity representations',
      'Returns max 64-bit integer',
      'Returns 0.0'
    ],
    correctIndex: 1,
    explanation: 'Python\'s float() constructor can parse "inf", "+inf", "-inf", and "nan" into special IEEE 754 floating-point values.'
  },
  {
    id: 'q36',
    topic: 'Python Casting',
    question: 'What happens when you cast a boolean to an integer: int(True) and int(False)?',
    options: [
      'Returns 1 and 0',
      'Raises TypeError',
      'Returns True and False',
      'Returns -1 and 0'
    ],
    correctIndex: 0,
    explanation: 'In Python, bool is a direct subclass of int. True has an integer value of 1, and False has an integer value of 0.'
  },

  // ==========================================
  // TOPIC 9: Python Strings Deep Dive (Q37 - Q44)
  // ==========================================
  {
    id: 'q37',
    topic: 'Python Strings',
    question: 'What is the result of slicing s = "PYTHON" with s[::-1]?',
    options: [
      '"PYTHON"',
      '"NOHTYP"',
      '"N"',
      'IndexError'
    ],
    correctIndex: 1,
    explanation: 'A step size of -1 iterates backwards from end to start, reversing the string to "NOHTYP".'
  },
  {
    id: 'q38',
    topic: 'Python Strings',
    question: 'What happens when accessing an out-of-range index directly s[100] versus slicing s[50:100] on s = "Python"?',
    options: [
      'Both raise an IndexError',
      's[100] raises IndexError, but slicing s[50:100] gracefully returns empty string ""',
      's[100] returns None, slicing returns ""',
      'Both return empty string ""'
    ],
    correctIndex: 1,
    explanation: 'Direct indexing out of range raises IndexError. Slices in Python are bounded automatically and return an empty string "" without error.'
  },
  {
    id: 'q39',
    topic: 'Python Strings',
    question: 'What happens when executing: s = "hello"; s[0] = "H"?',
    options: [
      's becomes "Hello"',
      'Raises TypeError: \'str\' object does not support item assignment',
      's creates a new string silently',
      'Raises AttributeError'
    ],
    correctIndex: 1,
    explanation: 'Strings in Python are strictly immutable. Modifying an index in place raises a TypeError.'
  },
  {
    id: 'q40',
    topic: 'Python Strings',
    question: 'What is the key difference between str.find("x") and str.index("x") when "x" is NOT found?',
    options: [
      'find() returns None, index() returns -1',
      'find() returns -1, while index() raises a ValueError',
      'find() raises a ValueError, index() returns -1',
      'Both raise ValueError'
    ],
    correctIndex: 1,
    explanation: 'When the substring is not found, find() safely returns -1, whereas index() raises a ValueError exception.'
  },
  {
    id: 'q41',
    topic: 'Python Strings',
    question: 'What does "  hello   world  ".split() return (with NO arguments passed)?',
    options: [
      '["", "", "hello", "", "", "world", "", ""]',
      '["hello", "world"]',
      '["  hello", "world  "]',
      'Raises ValueError'
    ],
    correctIndex: 1,
    explanation: 'When split() is called without arguments, any consecutive sequence of whitespace characters is treated as a single separator, and leading/trailing whitespace is stripped.'
  },
  {
    id: 'q42',
    topic: 'Python Strings',
    question: 'What is the output of: "-".join(["a", "b", "c"]) ?',
    options: [
      '"a-b-c"',
      '"-a-b-c-"',
      '["a-b-c"]',
      'TypeError: join must be called on list'
    ],
    correctIndex: 0,
    explanation: 'The separator string\'s join() method joins iterable elements with the separator between them, returning "a-b-c".'
  },
  {
    id: 'q43',
    topic: 'Python Strings',
    question: 'What is the printed representation of a raw string: print(r"C:\\new\\folder") ?',
    options: [
      'C:\\new\\folder (with literal backslashes, no newline on \\n)',
      'C: followed by a newline and folder',
      'C:/new/folder',
      'SyntaxError'
    ],
    correctIndex: 0,
    explanation: 'Raw string literals (prefixed with r or R) treat backslashes as literal characters rather than escape sequence prefixes.'
  },
  {
    id: 'q44',
    topic: 'Python Strings',
    question: 'What does the string strip() method do in: "xyzPythonzyx".strip("xyz") ?',
    options: [
      'Removes the exact word "xyz" only once',
      'Removes any occurrences of the characters \'x\', \'y\', or \'z\' from both ends, returning "Python"',
      'Raises ValueError because argument must be 1 character',
      'Replaces all x, y, z in the string with empty spaces'
    ],
    correctIndex: 1,
    explanation: 'The argument to strip() is treated as a set of characters to strip, removing all combinations of those characters from both the left and right ends.'
  },

  // ==========================================
  // TOPIC 10: Python Booleans & Logic (Q45 - Q50)
  // ==========================================
  {
    id: 'q45',
    topic: 'Python Booleans',
    question: 'What is the result of the short-circuit evaluation: "" or "Default" or "Fallback"?',
    options: [
      'True',
      '"Default"',
      '"Fallback"',
      '""'
    ],
    correctIndex: 1,
    explanation: 'The or operator returns the first truthy operand it encounters. Since "" is falsy and "Default" is truthy, it returns "Default" without evaluating "Fallback".'
  },
  {
    id: 'q46',
    topic: 'Python Booleans',
    question: 'What does 10 and 20 and 0 and 30 evaluate to in Python?',
    options: [
      'False',
      '0',
      '30',
      '10'
    ],
    correctIndex: 1,
    explanation: 'The and operator evaluates left to right and returns the first falsy operand encountered (here, 0), or the last operand if all are truthy.'
  },
  {
    id: 'q47',
    topic: 'Python Booleans',
    question: 'What does True + True + False evaluate to in Python, and why?',
    options: [
      'Raises TypeError',
      'True',
      '2, because bool is a subclass of int with True==1 and False==0',
      '"TrueTrueFalse"'
    ],
    correctIndex: 2,
    explanation: 'bool inherits directly from int in Python (issubclass(bool, int) is True). Arithmetic on booleans treats True as 1 and False as 0, yielding 1 + 1 + 0 = 2.'
  },
  {
    id: 'q48',
    topic: 'Python Booleans',
    question: 'What does the chained comparison 3 > 2 == 2 evaluate to in Python?',
    options: [
      'False',
      'True',
      'Raises SyntaxError',
      'TypeError: cannot chain comparisons'
    ],
    correctIndex: 1,
    explanation: 'Chained comparisons in Python expand to conjunctions: (3 > 2) and (2 == 2). Since both expressions are True, the entire statement evaluates to True.'
  },
  {
    id: 'q49',
    topic: 'Python Booleans',
    question: 'What is the operator precedence between not, and, and or in Python boolean expressions?',
    options: [
      'and > or > not',
      'not > and > or',
      'or > and > not',
      'Left-to-right with equal precedence'
    ],
    correctIndex: 1,
    explanation: 'not has the highest precedence, followed by and, and finally or. Thus True or False and False evaluates as True or (False and False) = True.'
  },
  {
    id: 'q50',
    topic: 'Python Booleans',
    question: 'How does Python determine the truthiness of a user-defined class instance?',
    options: [
      'It checks __bool__(); if not defined, it falls back to __len__(); if neither is defined, the object is considered True',
      'All user-defined class instances are False by default',
      'It checks the memory address of the instance',
      'It raises an exception unless the object explicitly inherits from bool'
    ],
    correctIndex: 0,
    explanation: 'Python calls __bool__() first. If not implemented, it checks __len__() (returning False if 0). If neither is defined, the instance evaluates to True by default.'
  }
];
