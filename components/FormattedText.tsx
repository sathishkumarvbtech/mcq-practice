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
                  ? 'bg-python-gold/15 dark:bg-python-gold/20 text-python-gold-dark dark:text-python-gold border border-python-gold/30'
                  : 'bg-brand-50 dark:bg-brand-950/40 text-python-blue dark:text-python-blue-light border border-brand-200/60 dark:border-brand-800/60'
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
