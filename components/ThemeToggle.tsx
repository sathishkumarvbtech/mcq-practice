'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { playThemeSound } from '../lib/sound';

interface ThemeToggleProps {
  isMuted?: boolean;
  className?: string;
  variant?: 'segmented' | 'icon';
}

export default function ThemeToggle({
  isMuted = false,
  className = '',
  variant = 'segmented',
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('python-mcq-theme') as 'light' | 'dark' | null;
      const initialTheme =
        saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setTheme(initialTheme);
      applyThemeToDom(initialTheme);
    } catch {
      // Fallback to dark
      applyThemeToDom('dark');
    }
  }, []);

  const applyThemeToDom = (newTheme: 'light' | 'dark') => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  };

  const handleSelectTheme = (newTheme: 'light' | 'dark') => {
    if (theme === newTheme) return;
    setTheme(newTheme);
    try {
      localStorage.setItem('python-mcq-theme', newTheme);
    } catch {
      // Ignore storage error
    }
    applyThemeToDom(newTheme);
    playThemeSound(isMuted);
  };

  const handleToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    handleSelectTheme(next);
  };

  if (!mounted) {
    return (
      <div
        className={`h-9 w-20 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 animate-pulse ${className}`}
      />
    );
  }

  // Compact Icon-only mode (used for smaller spaces if needed)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        type="button"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className={`relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-python-gold-dark dark:hover:text-python-blue-light hover:border-python-gold/50 dark:hover:border-python-blue-light/50 transition-all duration-200 shadow-sm active:scale-95 ${className}`}
        title={`Current: ${theme.toUpperCase()} mode · Click to switch`}
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-python-blue-light transition-transform duration-300 rotate-0 hover:-rotate-12" />
        ) : (
          <Sun className="w-4 h-4 text-python-gold-dark transition-transform duration-300 rotate-0 hover:rotate-45" />
        )}
      </button>
    );
  }

  // Segmented Pill Switch: matches Header's Practice/Exam & View switches
  return (
    <div
      role="radiogroup"
      aria-label="Theme mode"
      className={`flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors ${className}`}
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        onClick={() => handleSelectTheme('light')}
        title="Switch to Light Theme"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          theme === 'light'
            ? 'bg-white text-python-gold-dark shadow-sm scale-100 font-bold'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        <Sun
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            theme === 'light' ? 'text-python-gold-dark rotate-0 scale-110' : 'text-slate-400 rotate-45'
          }`}
        />
        <span className="hidden sm:inline text-[11px]">Light</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === 'dark'}
        onClick={() => handleSelectTheme('dark')}
        title="Switch to Dark Theme"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-slate-800 text-python-blue-light shadow-sm scale-100 font-bold'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        <Moon
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            theme === 'dark' ? 'text-python-blue-light -rotate-12 scale-110' : 'text-slate-400 rotate-0'
          }`}
        />
        <span className="hidden sm:inline text-[11px]">Dark</span>
      </button>
    </div>
  );
}
