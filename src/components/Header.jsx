import React from 'react';
import { Plane, HelpCircle } from 'lucide-react';

export default function Header({ onOpenHowItWorks }) {
  return (
    <header className="w-full border-b border-ink/10 bg-surface/80 backdrop-blur-sm sticky top-0 z-30 transition-all">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 z-50 bg-ink text-paper px-4 py-2 rounded-btn text-sm font-medium shadow-card"
      >
        Skip to main content
      </a>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Mark & Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ink text-paper flex items-center justify-center shadow-sm">
            <Plane className="w-4 h-4 text-paper transform -rotate-45" aria-hidden="true" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
            <span className="font-serif font-bold text-lg text-ink tracking-tight">Exam Ready</span>
            <span className="text-xs text-ink-muted font-medium flex items-center gap-1">
              <span className="hidden sm:inline">·</span> by Globio
            </span>
          </div>
        </div>

        {/* How It Works Button */}
        <button
          type="button"
          onClick={onOpenHowItWorks}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink-muted hover:text-ink hover:bg-ink/5 px-3.5 py-2 min-h-[44px] rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ink"
          aria-haspopup="dialog"
        >
          <HelpCircle className="w-4 h-4" aria-hidden="true" />
          <span>How it works</span>
        </button>
      </div>
    </header>
  );
}
