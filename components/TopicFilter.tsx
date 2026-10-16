'use client';

import React from 'react';
import { Tag } from 'lucide-react';

interface TopicFilterProps {
  topics: string[];
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
  topicCounts: Record<string, number>;
}

export default function TopicFilter({
  topics,
  selectedTopic,
  onSelectTopic,
  topicCounts,
}: TopicFilterProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <Tag className="w-3.5 h-3.5 text-indigo-500" />
        <span>Filter by Python Concept</span>
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        <button
          type="button"
          onClick={() => onSelectTopic('All')}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedTopic === 'All'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          All Topics ({topicCounts['All'] || 0})
        </button>
        {topics.map((topic) => {
          const isSelected = selectedTopic === topic;
          const count = topicCounts[topic] || 0;
          return (
            <button
              key={topic}
              type="button"
              onClick={() => onSelectTopic(topic)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/25'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <span>{topic}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
