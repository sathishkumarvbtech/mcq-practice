# Python Basics MCQ Arena (W3Schools Syllabus)

A high-performance, modern Next.js 15 + React 19 + Tailwind CSS v4 application featuring 50 in-depth multiple-choice questions based on the W3Schools Python core curriculum.

## Features
- **50 In-Depth W3Schools Curriculum Questions**:
  - Python Intro & Execution Model (CPython, GIL, Bytecode, Dynamic Typing)
  - Python Syntax & Indentation (TabError, Line Continuations, Ellipsis)
  - Python Output & Formatting (sep, end, sys.stderr, flush, docstrings)
  - Python Variables & Scope (Unpacking, Aliasing, global vs nonlocal)
  - Python Data Types & Collections (Hash collisions, Set uniqueness, Tuple mutability)
  - Python Numbers & Arithmetic (Banker's Rounding, Floor Division, Modulo, Precision)
  - Python Casting & Coercion (Base conversions, Boolean conversions, Floats)
  - Python Strings (Step slicing, find vs index, split defaults, raw strings, intern)
  - Python Booleans & Logic (Short-circuiting operands, Boolean arithmetic, Custom __bool__)
- **Automated Scorecard Delivery**: Candidate results are automatically dispatched to `sk1420000@gmail.com` with a full audit of all 50 questions upon final submission. Zero email prompt friction.
- **Configurable Environment**: Supports `.env.local` for SMTP (Gmail, Outlook, SendGrid, Mailtrap) with instant preview mode fallback.
- **Modern Segmented Theme Toggle**: Silky-smooth Light & Dark theme toggle with tactile audio cues and Tailwind v4 support.
- **Accessible Modal System**: Reusable, animated common modal dialogs for resets and exam submission confirmations.
- **Practice & Exam Modes**: Instant feedback mode with sound effects or timed exam mode with review palette.
- **Detailed Analytics**: Topic-by-topic mastery breakdown, filtered mistakes review, and printable certificates.

## Environment Setup (.env.local)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your SMTP server credentials:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password
SMTP_FROM="Python MCQ Arena <noreply@mcqarena.com>"
```
*(If left blank, the app runs in built-in simulated preview mode).*

## Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Build for Production
```bash
npm run build
npm start
```
