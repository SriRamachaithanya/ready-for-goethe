import React from 'react';
import { BookOpen } from 'lucide-react';

export default function NoticePanel({ passage }) {
  if (!passage) return null;

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        <BookOpen className="w-3.5 h-3.5 text-ink" aria-hidden="true" />
        <span>Textvorlage (Reading passage)</span>
      </div>
      <div
        className="p-4 sm:p-5 rounded-r-xl rounded-l bg-ink/[0.04] border-l-4 border-ink font-sans text-sm sm:text-base text-ink leading-relaxed whitespace-pre-line select-text"
        lang="de"
      >
        {passage}
      </div>
    </div>
  );
}
