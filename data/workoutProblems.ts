import { WorkoutProblem } from "../types/quiz";

const EMPTY_STARTER_CODE = `# Write your Python code below:

`;

export const workoutProblems: WorkoutProblem[] = [
  {
    id: "prob-52",
    title: "52. While: Countdown from 5 to 1",
    difficulty: "Beginner",
    topic: "While Loop",
    description:
      "Given number = 5, use a while loop to print the countdown from 5 to 1, with each number on a new line.",
    examples: [
      {
        input: "number = 5",
        output: "5\n4\n3\n2\n1",
        explanation: "Decrease the number by 1 after each iteration.",
      },
    ],
    constraints: [
      "Use a while loop.",
      "Print numbers from 5 down to 1.",
      "Do not use a for loop.",
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint:
      "Start with number = 5. Continue while number >= 1 and decrease it by 1.",
    logicExplanation: {
      summary:
        "A while loop can count backwards when its control variable is decreased on every iteration.",
      steps: [
        "Initialize number = 5.",
        "Check whether number >= 1.",
        "Print the current number.",
        "Decrease number by 1.",
        "Repeat until number becomes 0.",
      ],
      canonicalSolution:
        "number = 5\nwhile number >= 1:\n    print(number)\n    number -= 1",
      keyTakeaway:
        "A loop must update its control variable so that its condition eventually becomes False.",
    },
    internalMechanism:
      "The condition is checked before each iteration. Decrementing number eventually makes number >= 1 False and ends the loop.",
    testCases: [
      {
        id: "tc-52-1",
        inputDescription: "Verify countdown output",
        testCall: "__stdout__",
        expectedOutput: "5\n4\n3\n2\n1",
      },
    ],
  },
  {
    id: "prob-53",
    title: "53. While: Sum of First 5 Natural Numbers",
    difficulty: "Beginner",
    topic: "While Loop & Arithmetic",
    description:
      "Given number = 1, use a while loop to calculate and print the sum of the first five natural numbers.",
    examples: [
      {
        input: "number = 1",
        output: "15",
        explanation: "Add the numbers 1, 2, 3, 4, and 5.",
      },
    ],
    constraints: [
      "Use a while loop.",
      "Use a total variable to store the sum.",
      "Do not use sum() or a for loop.",
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint:
      "Initialize total = 0. While number <= 5, add number to total and increase number by 1.",
    logicExplanation: {
      summary:
        "A running total stores the accumulated result while a counter-controlled while loop visits each number.",
      steps: [
        "Initialize number = 1 and total = 0.",
        "Check whether number <= 5.",
        "Add number to total.",
        "Increase number by 1.",
        "Repeat until number becomes 6.",
        "Print total.",
      ],
      canonicalSolution:
        "number = 1\ntotal = 0\nwhile number <= 5:\n    total += number\n    number += 1\nprint(total)",
      keyTakeaway:
        "A running-total variable accumulates values across loop iterations.",
    },
    internalMechanism:
      "Each iteration adds the current counter value to total before incrementing the counter. The loop stops after processing 5.",
    testCases: [
      {
        id: "tc-53-1",
        inputDescription: "Verify sum of first five natural numbers",
        testCall: "__stdout__",
        expectedOutput: "15",
      },
    ],
  },
  {
    id: "prob-54",
    title: "54. While: Calculate Factorial",
    difficulty: "Intermediate",
    topic: "While Loop & Arithmetic",
    description:
      "Given number = 5, calculate its factorial using a while loop and print the result. Factorial is the product of all positive integers from 1 to the given number.",
    examples: [
      {
        input: "number = 5",
        output: "120",
        explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120.",
      },
    ],
    constraints: [
      "Use a while loop.",
      "Use a result variable initialized to 1.",
      "Do not use math.factorial() or a for loop.",
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint:
      "Start counter at 1. While counter <= number, multiply result by counter and increment counter.",
    logicExplanation: {
      summary:
        "A factorial is calculated by multiplying a running result by each integer from 1 through the given number.",
      steps: [
        "Initialize number = 5, counter = 1, and result = 1.",
        "Check whether counter <= number.",
        "Multiply result by counter.",
        "Increase counter by 1.",
        "Repeat until counter becomes 6.",
        "Print result.",
      ],
      canonicalSolution:
        "number = 5\ncounter = 1\nresult = 1\nwhile counter <= number:\n    result *= counter\n    counter += 1\nprint(result)",
      keyTakeaway:
        "A loop can build a product by repeatedly updating an accumulator variable.",
    },
    internalMechanism:
      "The accumulator starts at the multiplicative identity 1. Each iteration multiplies it by the next counter value until all factors have been processed.",
    testCases: [
      {
        id: "tc-54-1",
        inputDescription: "Verify factorial of five",
        testCall: "__stdout__",
        expectedOutput: "120",
      },
    ],
  },
  {
    id: "prob-55",
    title: "55. While: Check Palindrome Number",
    difficulty: "Advanced",
    topic: "While Loop, Modulo & Conditional Logic",
    description:
      "Given number = 1221, use a while loop to reverse the number mathematically. Print 'Palindrome' if the reversed number is equal to the original number; otherwise print 'Not Palindrome'. Do not convert the number to a string.",
    examples: [
      {
        input: "number = 1221",
        output: "Palindrome",
        explanation: "Reversing 1221 produces 1221, which is the original number.",
      },
    ],
    constraints: [
      "Use a while loop to reverse the number.",
      "Use % and // operators.",
      "Do not convert the number into a string.",
      "Use an if-else condition to compare the values.",
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint:
      "Store the original number separately. Extract digits with % 10, build the reverse, and remove digits with // 10. Compare both numbers after the loop.",
    logicExplanation: {
      summary:
        "A palindrome number reads the same forwards and backwards. A while loop can reverse its digits for a numeric comparison.",
      steps: [
        "Store the original value in original_number.",
        "Initialize reversed_number = 0.",
        "Extract the last digit using number % 10.",
        "Append the digit using reversed_number * 10 + digit.",
        "Remove the last digit using number // 10.",
        "Repeat until number becomes 0.",
        "Compare reversed_number with original_number and print the result.",
      ],
      canonicalSolution:
        'number = 1221\noriginal_number = number\nreversed_number = 0\nwhile number > 0:\n    digit = number % 10\n    reversed_number = reversed_number * 10 + digit\n    number //= 10\nif reversed_number == original_number:\n    print("Palindrome")\nelse:\n    print("Not Palindrome")',
      keyTakeaway:
        "Combining a while loop, modulo, floor division, and if-else makes it possible to solve digit-based problems without string conversion.",
    },
    internalMechanism:
      "The loop extracts digits from right to left and constructs a reversed integer. The final conditional compares that integer with the preserved original value.",
    testCases: [
      {
        id: "tc-55-1",
        inputDescription: "Verify palindrome number",
        testCall: "__stdout__",
        expectedOutput: "Palindrome",
      },
    ],
  },
  {
    id: "prob-56",
    title: "56. While: Print Even Numbers",
    difficulty: "Beginner",
    topic: "While Loop",
    description:
      "Given number = 2, use a while loop to print all even numbers from 2 to 10.",
    examples: [
      {
        input: "number = 2",
        output: "2\n4\n6\n8\n10",
        explanation: "Increase the number by 2 in each iteration.",
      },
    ],
    constraints: [
      "Use a while loop.",
      "Print even numbers from 2 to 10.",
      "Do not use a for loop.",
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: "Use while number <= 10 and increase number by 2.",
    logicExplanation: {
      summary:
        "A while loop repeats until its condition becomes False. Incrementing by 2 generates consecutive even numbers.",
      steps: [
        "Initialize number = 2.",
        "Check whether number <= 10.",
        "Print the current number.",
        "Increase number by 2.",
        "Repeat until number becomes 12.",
      ],
      canonicalSolution:
        "number = 2\nwhile number <= 10:\n    print(number)\n    number += 2",
      keyTakeaway:
        "Changing the increment controls the sequence generated by a loop.",
    },
    internalMechanism:
      "The while condition is evaluated before each iteration. The loop terminates when number exceeds 10.",
    testCases: [
      {
        id: "tc-56-1",
        inputDescription: "Verify even number sequence",
        testCall: "__stdout__",
        expectedOutput: "2\n4\n6\n8\n10",
      },
    ],
  },
  {
    id: "prob-57",
    title: "57. While: Count Number of Digits",
    difficulty: "Beginner",
    topic: "While Loop & Arithmetic",
    description:
      "Given number = 58321, count how many digits it contains using a while loop and print the count.",
    examples: [
      {
        input: "number = 58321",
        output: "5",
        explanation: "The number contains five digits.",
      },
    ],
    constraints: [
      "Use a while loop.",
      "Use integer division (//).",
      "Do not convert the number into a string.",
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint:
      "Use number // 10 to remove the last digit and increment a counter in every iteration.",
    logicExplanation: {
      summary:
        "Integer division by 10 removes the last digit of a positive integer. Repeating this process counts the digits.",
      steps: [
        "Initialize number = 58321 and count = 0.",
        "Check whether number > 0.",
        "Increase count by 1.",
        "Remove the last digit using number // 10.",
        "Repeat until number becomes 0.",
        "Print count.",
      ],
      canonicalSolution:
        "number = 58321\ncount = 0\nwhile number > 0:\n    count += 1\n    number //= 10\nprint(count)",
      keyTakeaway:
        "The // operator performs floor division and can remove the last digit of a positive integer when dividing by 10.",
    },
    internalMechanism:
      "Each iteration reduces the integer by a factor of ten using floor division. The counter records the number of reductions.",
    testCases: [
      {
        id: "tc-57-1",
        inputDescription: "Check digit count",
        testCall: "__stdout__",
        expectedOutput: "5",
      },
    ],
  },
  {
    id: "prob-58",
    title: "58. While: Reverse a Number",
    difficulty: "Intermediate",
    topic: "While Loop & Modulo",
    description:
      "Given number = 1234, reverse its digits using a while loop and print the reversed number.",
    examples: [
      {
        input: "number = 1234",
        output: "4321",
        explanation: "Extract each last digit and build the reversed number.",
      },
    ],
    constraints: [
      "Use a while loop.",
      "Use % and // operators.",
      "Do not convert the number into a string.",
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint:
      "Extract the last digit using number % 10 and update reversed_number using reversed_number * 10 + digit.",
    logicExplanation: {
      summary:
        "A number can be reversed mathematically by extracting its digits from right to left and appending them to a new number.",
      steps: [
        "Initialize number = 1234 and reversed_number = 0.",
        "Extract the last digit using number % 10.",
        "Multiply reversed_number by 10 and add the extracted digit.",
        "Remove the last digit using number // 10.",
        "Repeat until number becomes 0.",
        "Print reversed_number.",
      ],
      canonicalSolution:
        "number = 1234\nreversed_number = 0\nwhile number > 0:\n    digit = number % 10\n    reversed_number = reversed_number * 10 + digit\n    number //= 10\nprint(reversed_number)",
      keyTakeaway:
        "Modulo extracts the last digit, while floor division removes it.",
    },
    internalMechanism:
      "The modulo operator extracts the remainder digit. Multiplication by 10 shifts the accumulated digits left before appending the next digit.",
    testCases: [
      {
        id: "tc-58-1",
        inputDescription: "Verify reversed number",
        testCall: "__stdout__",
        expectedOutput: "4321",
      },
    ],
  },
  {
    id: "prob-59",
    title: "59. While: Multiplication Table",
    difficulty: "Intermediate",
    topic: "While Loop & Arithmetic",
    description:
      "Given number = 7, use a while loop to print its multiplication table from 1 to 10.",
    examples: [
      {
        input: "number = 7",
        output: "7\n14\n21\n28\n35\n42\n49\n56\n63\n70",
        explanation: "Multiply 7 by each number from 1 to 10.",
      },
    ],
    constraints: [
      "Use a while loop.",
      "Print 10 results.",
      "Use a counter variable.",
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint:
      "Initialize counter = 1. Print number * counter and increment the counter.",
    logicExplanation: {
      summary:
        "A counter-controlled while loop can generate multiplication tables by repeatedly multiplying a fixed number by an increasing counter.",
      steps: [
        "Initialize number = 7.",
        "Initialize counter = 1.",
        "Check counter <= 10.",
        "Print number * counter.",
        "Increment counter by 1.",
        "Stop when counter becomes 11.",
      ],
      canonicalSolution:
        "number = 7\ncounter = 1\nwhile counter <= 10:\n    print(number * counter)\n    counter += 1",
      keyTakeaway:
        "A counter-controlled loop is useful when the number of repetitions is known.",
    },
    internalMechanism:
      "The loop counter determines the multiplication factor and controls the number of iterations.",
    testCases: [
      {
        id: "tc-59-1",
        inputDescription: "Verify multiplication table",
        testCall: "__stdout__",
        expectedOutput: "7\n14\n21\n28\n35\n42\n49\n56\n63\n70",
      },
    ],
  },
  {
    id: "prob-60",
    title: "60. Match-Case: Vowel or Consonant",
    difficulty: "Intermediate",
    topic: "Match-Case",
    description:
      "Given letter = 'a', use match-case to print 'Vowel' for a, e, i, o, u (lowercase). Print 'Consonant' for other alphabetic letters and 'Invalid input' otherwise.",
    examples: [
      {
        input: "letter = 'a'",
        output: "Vowel",
        explanation: "The letter matches one of the vowel patterns.",
      },
    ],
    constraints: [
      "Use match-case.",
      "Group multiple vowel patterns using |.",
      "Use a wildcard case for other inputs.",
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint:
      'Use case "a" | "e" | "i" | "o" | "u": and use str.isalpha() to validate other letters.',
    logicExplanation: {
      summary:
        "Match-case supports alternative patterns using the | operator. A guard can add a condition to a case.",
      steps: [
        'Initialize letter = "a".',
        "Match the letter.",
        "Check whether it matches any vowel pattern.",
        "If not, check whether it is alphabetic using a guard.",
        "Otherwise print Invalid input.",
      ],
      canonicalSolution:
        'letter = "a"\nmatch letter:\n    case "a" | "e" | "i" | "o" | "u":\n        print("Vowel")\n    case value if value.isalpha():\n        print("Consonant")\n    case _:\n        print("Invalid input")',
      keyTakeaway:
        "The | operator combines alternative patterns, while if adds a guard condition to a case.",
    },
    internalMechanism:
      "Python evaluates each pattern in order. A guarded pattern matches only when its pattern matches and its guard expression is truthy.",
    testCases: [
      {
        id: "tc-60-1",
        inputDescription: "Check vowel classification",
        testCall: "__stdout__",
        expectedOutput: "Vowel",
      },
    ],
  },
  {
    id: "prob-61",
    title: "61. Match-Case: Simple ATM Menu",
    difficulty: "Intermediate",
    topic: "Match-Case",
    description:
      "Given balance = 5000 and choice = 2, use match-case to handle ATM options: 1 for Check Balance, 2 for Withdraw, 3 for Deposit, and 4 for Exit. For this exercise, option 2 should print 'Withdraw selected'.",
    examples: [
      {
        input: "balance = 5000, choice = 2",
        output: "Withdraw selected",
        explanation: "Case 2 matches the selected menu option.",
      },
    ],
    constraints: [
      "Use match-case.",
      "Include all four menu options.",
      "Use a wildcard case for invalid choices.",
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint: "Use match choice and create one case for each menu option.",
    logicExplanation: {
      summary:
        "Match-case is useful for handling menu selections because each option can have its own clearly separated execution block.",
      steps: [
        "Initialize balance = 5000 and choice = 2.",
        "Start match choice.",
        "Case 1 handles balance checking.",
        "Case 2 handles withdrawal selection.",
        "Case 3 handles deposit selection.",
        "Case 4 handles exit.",
        "The wildcard case handles invalid choices.",
      ],
      canonicalSolution:
        'balance = 5000\nchoice = 2\nmatch choice:\n    case 1:\n        print(balance)\n    case 2:\n        print("Withdraw selected")\n    case 3:\n        print("Deposit selected")\n    case 4:\n        print("Exit selected")\n    case _:\n        print("Invalid choice")',
      keyTakeaway:
        "Match-case makes menu-based branching easier to read and maintain.",
    },
    internalMechanism:
      "The match statement compares the choice against literal patterns and executes the matching case block.",
    testCases: [
      {
        id: "tc-61-1",
        inputDescription: "Check selected ATM option",
        testCall: "__stdout__",
        expectedOutput: "Withdraw selected",
      },
    ],
  },
  {
    id: "prob-62",
    title: "62. Advanced: Number Guessing Game",
    difficulty: "Advanced",
    topic: "While Loop & Conditional Logic",
    description:
      'Given secret_number = 7 and guesses = [3, 5, 7], use a while loop to process the guesses. Print "Too low" when the guess is smaller, "Too high" when it is larger, and "Correct" when it matches. Stop after the correct guess.',
    examples: [
      {
        input: "secret_number = 7, guesses = [3, 5, 7]",
        output: "Too low\nToo low\nCorrect",
        explanation:
          "The first two guesses are too small. The third guess matches the secret number, so the loop stops.",
      },
    ],
    constraints: [
      "Use a while loop.",
      "Use an index to access guesses.",
      "Use if / elif / else.",
      "Stop immediately after the correct guess.",
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint:
      "Initialize index = 0 and use while index < len(guesses). Use break when the guess matches the secret number.",
    logicExplanation: {
      summary:
        "A guessing game combines list indexing, loop control and conditional comparisons to process repeated attempts.",
      steps: [
        "Set secret_number = 7.",
        "Create the guesses list.",
        "Initialize index = 0.",
        "Read guesses[index] inside the loop.",
        "Compare the guess with secret_number.",
        "Print the appropriate message.",
        "Use break when the guess is correct.",
        "Otherwise increase index.",
      ],
      canonicalSolution:
        'secret_number = 7\nguesses = [3, 5, 7]\nindex = 0\nwhile index < len(guesses):\n    guess = guesses[index]\n    if guess < secret_number:\n        print("Too low")\n    elif guess > secret_number:\n        print("Too high")\n    else:\n        print("Correct")\n        break\n    index += 1',
      keyTakeaway:
        "break immediately exits a loop when the required condition is satisfied.",
    },
    internalMechanism:
      "The loop checks the list boundary, accesses each element by index, evaluates comparisons and terminates early when break executes.",
    testCases: [
      {
        id: "tc-62-1",
        inputDescription: "Verify guessing game output",
        testCall: "__stdout__",
        expectedOutput: "Too low\nToo low\nCorrect",
      },
    ],
  },
  {
    id: "prob-63",
    title: "63. Advanced: Menu-Driven ATM",
    difficulty: "Advanced",
    topic: "While Loop & Match-Case",
    description:
      "Create a menu-driven ATM using a while loop and match-case. Given balance = 1000 and choices = [1, 2, 3], option 1 deposits 500, option 2 withdraws 200, and option 3 exits. Process all choices and print the final balance. Use an index to read the choices list.",
    examples: [
      {
        input: "balance = 1000, choices = [1, 2, 3]",
        output: "1500\n1300\nATM closed\n1300",
        explanation:
          "Deposit 500, withdraw 200, then exit with a final balance of 1300.",
      },
    ],
    constraints: [
      "Use a while loop.",
      "Use match-case for menu options.",
      "Update balance after deposits and withdrawals.",
      "Stop when option 3 is selected.",
      "Print the final balance after the loop.",
    ],
    starterCode: EMPTY_STARTER_CODE,
    solutionHint:
      "Use index = 0 and while index < len(choices). Inside the loop, match choices[index]. Use break for option 3.",
    logicExplanation: {
      summary:
        "A menu-driven ATM combines repeated processing, pattern matching and state updates. The balance changes as transactions are processed.",
      steps: [
        "Initialize balance = 1000.",
        "Create choices = [1, 2, 3] and index = 0.",
        "Repeat while index is less than the number of choices.",
        "Read the current choice.",
        "Use match-case to identify the transaction.",
        "Add 500 for deposit.",
        "Subtract 200 for withdrawal.",
        "Use break for exit.",
        "Print the final balance after the loop.",
      ],
      canonicalSolution:
        'balance = 1000\nchoices = [1, 2, 3]\nindex = 0\nwhile index < len(choices):\n    choice = choices[index]\n    match choice:\n        case 1:\n            balance += 500\n            print(balance)\n        case 2:\n            balance -= 200\n            print(balance)\n        case 3:\n            print("ATM closed")\n            break\n        case _:\n            print("Invalid choice")\n    index += 1\nprint(balance)',
      keyTakeaway:
        "Use while for repeated execution, match-case for menu selection, and variables to maintain application state.",
    },
    internalMechanism:
      "Each iteration reads a menu option, dispatches through structural pattern matching, updates the balance, and optionally terminates using break.",
    testCases: [
      {
        id: "tc-63-1",
        inputDescription: "Verify ATM transactions and final balance",
        testCall: "__stdout__",
        expectedOutput: "1500\n1300\nATM closed\n1300",
      },
    ],
  },
];
