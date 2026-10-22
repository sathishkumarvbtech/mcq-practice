import type { Question } from '../types/quiz';

export const questions: Question[] = [
  // ==========================================
  // LEVEL 1: BASIC SYNTAX AND VARIABLES (Q1 - Q5)
  // ==========================================
  {
    id: 'q1',
    topic: 'Basic Syntax & Output',
    question: 'In Python 3, how does the `print()` function handle its arguments by default when called like `print("Hello, Python!")`?',
    options: [
      'It prints the text without a trailing character, requiring an explicit `\\n` to advance the cursor',
      'It converts arguments to string representations via `str()`, writes them to `sys.stdout`, and terminates with a newline character `\\n`',
      'It is a language statement rather than a function and cannot accept keyword arguments',
      'It directly writes ASCII machine codes to hardware registers without buffer flushing'
    ],
    correctIndex: 1,
    explanation: 'In Python 3, `print()` is a built-in function that converts its positional arguments to string representations using `str()`, streams them to `sys.stdout`, and terminates with `end="\\n"` by default.'
  },
  {
    id: 'q2',
    topic: 'Variables & Memory',
    question: 'When creating variables like `name = "Alex"`, `age = 25`, and `city = "New York"`, how does Python store these in memory?',
    options: [
      'Variables allocate static fixed-size slots directly inside a compiled binary data segment',
      'Variable names are labels (references) pointing to dynamically allocated objects in heap memory',
      'All variables must be pre-declared with explicit data types in Python',
      'Python copies the raw bytes of the value directly into the variable name without object wrappers'
    ],
    correctIndex: 1,
    explanation: 'Python utilizes dynamic typing and object references. Variable names (`name`, `age`, `city`) are stored in the frame\'s symbol table as pointers referencing heap-allocated objects (`PyUnicodeObject`, `PyLongObject`).'
  },
  {
    id: 'q3',
    topic: 'Arithmetic & Division',
    question: 'What is the output and data type of `15 / 5` in Python 3?',
    options: [
      '`3` of type `int`',
      '`3.0` of type `float`',
      '`3` of type `float`',
      '`3.0` of type `double`'
    ],
    correctIndex: 1,
    explanation: 'In Python 3, true division (`/`) always returns a floating-point number (`float`), even when the division has no remainder. Hence `15 / 5` evaluates to `3.0`. For integer division, floor division (`//`) is used.'
  },
  {
    id: 'q4',
    topic: 'Data Types & Float',
    question: 'Given `price = 99.5`, what is returned by `type(price)` in Python?',
    options: [
      '`<type "decimal">`',
      '`<class "number">`',
      '`<class "float">`',
      '`<class "double">`'
    ],
    correctIndex: 2,
    explanation: 'Numbers with a decimal point in Python are instances of the built-in `float` class (represented internally by CPython\'s `PyFloatObject` using IEEE 754 double precision).'
  },
  {
    id: 'q5',
    topic: 'Comments & Documentation',
    question: 'How does the Python compiler treat comments that begin with the `#` symbol?',
    options: [
      'They are compiled into special debug bytecode instructions stored in `.pyc` files',
      'They are stripped out during the lexical analysis (tokenizing) phase and have zero runtime overhead',
      'They are executed as inactive strings that occupy RAM until garbage collected',
      'They can only appear at the start of a file before any executable statements'
    ],
    correctIndex: 1,
    explanation: 'Lines and snippets starting with `#` are discarded by the Python tokenizer during lexical analysis. They generate no bytecode and have zero impact on program execution speed or memory footprint.'
  },

  // ==========================================
  // LEVEL 2: DATA TYPES, CASTING AND STRINGS (Q6 - Q10)
  // ==========================================
  {
    id: 'q6',
    topic: 'Data Types & Casting',
    question: 'What occurs if you attempt to execute `"250" + 50` directly in Python without type casting?',
    options: [
      'Python automatically coerces `50` to string and returns `"25050"`',
      'Python automatically coerces `"250"` to integer and returns `300`',
      'Python raises a `TypeError: can only concatenate str (not "int") to str`',
      'Python returns `None` and displays a runtime warning'
    ],
    correctIndex: 2,
    explanation: 'Python is strongly typed and does not perform implicit type coercion between incompatible types like strings and integers. To add them numerically, explicit casting `int("250") + 50` is mandatory.'
  },
  {
    id: 'q7',
    topic: 'Type Casting & Conversion',
    question: 'Given `n = 100`, what is the result and type of executing `str(n)`?',
    options: [
      'The string `"100"` of type `<class "str">`',
      'A character array `[\'1\', \'0\', \'0\']` of type `<class "list">`',
      'An integer object modified in-place to behave as text',
      'A pointer to an ASCII buffer with type `<class "bytes">`'
    ],
    correctIndex: 0,
    explanation: '`str(100)` invokes the `tp_str` conversion slot on the integer object, constructing a new immutable `str` instance containing `"100"`.'
  },
  {
    id: 'q8',
    topic: 'Strings & len()',
    question: 'What is the time complexity of `len("Python Programming")` in standard CPython implementation?',
    options: [
      '$O(N)$ because Python must iterate over every character until it reaches a null terminator',
      '$O(1)$ because string length is precomputed and stored in the object\'s header structure',
      '$O(\\log N)$ because strings use a binary search tree of character blocks',
      '$O(N^2)$ due to Unicode UTF-8 decoding overhead'
    ],
    correctIndex: 1,
    explanation: 'In CPython, strings store their character count directly in the `ob_size` field of the `PyVarObject` struct when instantiated. Calling `len()` is an instant $O(1)$ field retrieval with zero character scanning.'
  },
  {
    id: 'q9',
    topic: 'String Concatenation',
    question: 'Why are f-strings like `f"{first} {last}"` preferred over repeated string concatenation (`first + " " + last`) in Python?',
    options: [
      'f-strings convert all variables to global variables automatically',
      'f-strings are compiled into an optimized `BUILD_STRING` opcode, avoiding intermediate string allocations',
      'Concatenation with `+` mutates existing strings in place, causing race conditions',
      'f-strings execute asynchronously on a background thread'
    ],
    correctIndex: 1,
    explanation: 'Because Python strings are immutable, repeated `+` concatenation allocates intermediate strings in memory. f-strings (PEP 498) evaluate expressions and join them into a single buffer via the `BUILD_STRING` opcode for maximum performance.'
  },
  {
    id: 'q10',
    topic: 'Casting & Float Truncation',
    question: 'What is the exact result of `int(12.8)` and `int(-3.7)` in Python?',
    options: [
      '`13` and `-4` because Python rounds to the nearest integer',
      '`12` and `-3` because `int()` truncates the fractional part towards zero',
      '`12` and `-4` because Python rounds towards negative infinity',
      '`13` and `-3` because positive numbers round up and negative numbers round down'
    ],
    correctIndex: 1,
    explanation: '`int()` on floating-point numbers performs truncation towards zero by discarding the fractional digits. Therefore, `int(12.8)` yields `12` and `int(-3.7)` yields `-3`.'
  },

  // ==========================================
  // LEVEL 3: NUMBERS AND COMPARISON OPERATORS (Q11 - Q15)
  // ==========================================
  {
    id: 'q11',
    topic: 'Modulo Operator',
    question: 'What is the result of `29 % 6` in Python, and how is it calculated?',
    options: [
      '`4` because 29 divided by 6 is 4 with 5 left over',
      '`5` because `29 - (29 // 6) * 6` equals `29 - 24 = 5`',
      '`0.833` representing the fractional remainder',
      '`1` because modulo returns the remainder from the nearest power of two'
    ],
    correctIndex: 1,
    explanation: 'The modulo operator `%` calculates the remainder of floor division according to $r = a - (a // b) * b$. For `29 % 6`: $29 // 6 = 4$, and $29 - (4 * 6) = 5$.'
  },
  {
    id: 'q12',
    topic: 'Comparison Operators',
    question: 'In Python, comparison operators like `>` and `<` return values of type `bool`. What is the underlying relationship between `bool` and `int`?',
    options: [
      '`bool` is completely unrelated to `int` and cannot be converted without explicit casting',
      '`bool` is a subclass of `int`, where `True == 1` and `False == 0`',
      '`int` is a subclass of `bool` with an integer precision mask',
      '`bool` values are string aliases for `"True"` and `"False"`'
    ],
    correctIndex: 1,
    explanation: 'In Python, `bool` is a built-in subclass of `int` (`issubclass(bool, int) is True`). `True` has the numerical value `1` and `False` has the numerical value `0`.'
  },
  {
    id: 'q13',
    topic: 'Equality Operator',
    question: 'What is the critical distinction between the `==` operator and the `is` keyword in Python?',
    options: [
      '`==` compares identity (memory addresses), while `is` compares values',
      '`==` compares values (equality via `__eq__`), while `is` compares object identity (memory address in RAM)',
      '`==` is only used for strings, while `is` is only used for numbers',
      '`==` and `is` are completely interchangeable aliases'
    ],
    correctIndex: 1,
    explanation: '`==` tests value equality (whether two objects hold equivalent contents), while `is` tests identity (whether two references point to the exact same memory location: `id(a) == id(b)`).'
  },
  {
    id: 'q14',
    topic: 'Comparison & Logical AND',
    question: 'Given `x = 10` and `y = 3`, what is the output of `print(x > 5 and y < 5)`?',
    options: [
      '`False` because `10` is greater than `5` but `3` is not equal to `5`',
      '`True` because both conditions `10 > 5` (True) and `3 < 5` (True) are satisfied',
      '`10` because the `and` operator returns the left operand when true',
      '`TypeError` because comparisons cannot be chained with `and`'
    ],
    correctIndex: 1,
    explanation: '`10 > 5` evaluates to `True`, and `3 < 5` evaluates to `True`. `True and True` evaluates to `True`.'
  },
  {
    id: 'q15',
    topic: 'Comparison & Logical OR',
    question: 'Given `a = 8` and `b = 12`, what is the output of `print(a > 10 or b > 10)`?',
    options: [
      '`True` because `b > 10` (12 > 10) evaluates to `True`',
      '`False` because `a > 10` (8 > 10) is False, which invalidates the expression',
      '`8` because `or` returns the first evaluated integer',
      '`None` because one condition is false'
    ],
    correctIndex: 0,
    explanation: 'In an `or` expression, if either condition is true, the result is `True`. Although `8 > 10` is False, `12 > 10` is True, making `False or True` evaluate to `True`.'
  },

  // ==========================================
  // LEVEL 4: LOGICAL OPERATORS (Q16 - Q20)
  // ==========================================
  {
    id: 'q16',
    topic: 'Logical Operators',
    question: 'Given `age = 25`, which expression correctly checks that `age` is at least 18 and strictly below 60?',
    options: [
      '`age >= 18 and age < 60` (or `18 <= age < 60`)',
      '`age >= 18 or age < 60`',
      '`age > 18 & age <= 60`',
      '`age == 18 to 60`'
    ],
    correctIndex: 0,
    explanation: 'To verify that a value meets two simultaneous bounds, use the logical `and` operator (`age >= 18 and age < 60`) or Python\'s chained comparison syntax (`18 <= age < 60`).'
  },
  {
    id: 'q17',
    topic: 'Logical Operators',
    question: 'Why is `number == 0 or 100` considered a common logic bug when checking if `number` is 0 or 100?',
    options: [
      'It causes a SyntaxError because numbers cannot follow `or`',
      'In Python, non-zero integers are truthy, so `or 100` always evaluates to truthy `100`, making the condition always truthy',
      'It only checks numbers divisible by 100',
      'Python automatically converts `or` to bitwise `|`'
    ],
    correctIndex: 1,
    explanation: 'Because `==` has higher precedence than `or`, Python evaluates `(number == 0) or 100`. If `number != 0`, it evaluates `False or 100`, which returns `100` (truthy). The correct code is `number == 0 or number == 100`.'
  },
  {
    id: 'q18',
    topic: 'Logical Operators',
    question: 'Given `is_raining = True`, what is the effect of applying the `not` keyword (`not is_raining`)?',
    options: [
      'It reverses the boolean value to `False`',
      'It deletes the variable from the local namespace',
      'It converts `True` to integer `0`',
      'It raises a TypeError unless wrapped in parentheses'
    ],
    correctIndex: 0,
    explanation: 'The `not` operator performs logical negation. If the operand is truthy, it returns `False`; if falsy, it returns `True`. Thus `not True` evaluates to `False`.'
  },
  {
    id: 'q19',
    topic: 'Chained Comparison',
    question: 'In Python, what is the special feature of writing a chained comparison like `10 <= number <= 50`?',
    options: [
      'It evaluates `10 <= number` first to a boolean, then compares that boolean to `50` (causing subtle bugs)',
      'The intermediate expression `number` is evaluated only once, translating to `(10 <= number) and (number <= 50)`',
      'It only works for integers and fails on floating-point numbers',
      'It requires parentheses: `(10 <= number) <= 50`'
    ],
    correctIndex: 1,
    explanation: 'Python natively supports chained comparisons. `10 <= number <= 50` is semantically equivalent to `10 <= number and number <= 50`, but `number` is only evaluated once.'
  },
  {
    id: 'q20',
    topic: 'Compound Conditions',
    question: 'A student passes if `marks >= 35` and `attendance >= 75`. If `marks = 60` and `attendance = 80`, what does `marks >= 35 and attendance >= 75` evaluate to?',
    options: [
      '`True` because both 60 >= 35 and 80 >= 75 are True',
      '`False` because attendance must be exactly 75',
      '`60` because `and` returns the first truthy number',
      '`None`'
    ],
    correctIndex: 0,
    explanation: 'Both criteria are evaluated: `60 >= 35` is True, and `80 >= 75` is True. `True and True` produces `True`.'
  },

  // ==========================================
  // LEVEL 5: TERNARY OPERATOR (Q21 - Q25)
  // ==========================================
  {
    id: 'q21',
    topic: 'Ternary Operator',
    question: 'What is the correct syntax for Python\'s ternary conditional expression (introduced in PEP 308)?',
    options: [
      '`condition ? value_if_true : value_if_false`',
      '`value_if_true if condition else value_if_false`',
      '`if condition then value_if_true else value_if_false`',
      '`(condition) -> value_if_true : value_if_false`'
    ],
    correctIndex: 1,
    explanation: 'Unlike C or JavaScript which use the `? :` operator, Python uses the readable syntax: `value_if_true if condition else value_if_false`.'
  },
  {
    id: 'q22',
    topic: 'Ternary Operator',
    question: 'Given `number = 8`, what is the output of `"Even" if number % 2 == 0 else "Odd"`?',
    options: [
      '`"Even"` because `8 % 2` is `0`, making `0 == 0` evaluate to `True`',
      '`"Odd"` because 8 is divisible by 2',
      '`True`',
      '`0`'
    ],
    correctIndex: 0,
    explanation: '`8 % 2 == 0` evaluates to `0 == 0`, which is `True`. The expression returns the `value_if_true` branch, which is `"Even"`.'
  },
  {
    id: 'q23',
    topic: 'Ternary Operator',
    question: 'Given `marks = 32`, what is evaluated by `"Pass" if marks >= 35 else "Fail"`?',
    options: [
      '`"Pass"`',
      '`"Fail"` because 32 >= 35 is False, so the else branch executes',
      '`None`',
      '`False`'
    ],
    correctIndex: 1,
    explanation: '`32 >= 35` evaluates to `False`. The ternary operator skips the true branch and returns the else branch: `"Fail"`.'
  },
  {
    id: 'q24',
    topic: 'Ternary Operator',
    question: 'Given `amount = 600`, what is the result of `"Free Delivery" if amount >= 500 else "Delivery Charge"`?',
    options: [
      '`"Free Delivery"` because 600 >= 500 is True',
      '`"Delivery Charge"`',
      '`500`',
      '`True`'
    ],
    correctIndex: 0,
    explanation: 'Since 600 is greater than or equal to 500, the condition is True, yielding `"Free Delivery"`.'
  },
  {
    id: 'q25',
    topic: 'Ternary & Logical Operators',
    question: 'Given `age = 22` and `has_id = True`, what is returned by `"Eligible" if age >= 18 and has_id else "Not Eligible"`?',
    options: [
      '`"Eligible"` because both `age >= 18` and `has_id` are True',
      '`"Not Eligible"`',
      '`True`',
      '`SyntaxError` because `and` cannot be used inside a ternary expression'
    ],
    correctIndex: 0,
    explanation: 'The condition `age >= 18 and has_id` evaluates to `22 >= 18` (True) and `True` -> `True`. The ternary expression evaluates to `"Eligible"`.'
  }
];
