'use client';

import React from 'react';

interface FormattedTextProps {
  text: string;
  isTitle?: boolean;
}

// Highlights Python tokens in text and code expressions
export default function FormattedText({ text, isTitle = false }: FormattedTextProps) {
  // Regex pattern matching backticked code or common Python snippets (e.g. print(...), x = ..., 10 // 3, etc.)
  const codeRegex = /(`[^`]+`|\bprint\(.*?\)|x\s*=\s*\d+|10\s*\/\/\s*3|4\s*\*\*\s*2|5\s*>\s*2|int\('.*?'\)|len\(.*?\)|s\[\d+\]|s\s*=\s*'.*?'|if\s+.*?:|global\s+\w+)/g;

  const parts = text.split(codeRegex);

  if (parts.length === 1 && !text.includes('`')) {
    return <span>{text}</span>;
  }

  return (
    <span className="inline">
      {parts.map((part, index) => {
        if (!part) return null;

        const isCodeMatch =
          part.startsWith('`') && part.endsWith('`')
            ? true
            : /^(print\(|x\s*=|10\s*\/\/|4\s*\*\*|5\s*>|int\(|len\(|s\[|s\s*=|if\s+|global\s+)/.test(part);

        if (isCodeMatch) {
          const cleanCode = part.startsWith('`') && part.endsWith('`') ? part.slice(1, -1) : part;
          return (
            <code
              key={index}
              className={`font-mono font-semibold px-2 py-0.5 mx-1 rounded-md transition-colors ${
                isTitle
                  ? 'bg-amber-500/10 dark:bg-amber-400/15 text-amber-600 dark:text-amber-300 border border-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cleanCode}
            </code>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
