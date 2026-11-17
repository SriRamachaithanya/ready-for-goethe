import React, { useEffect, useRef } from 'react';
import { Check, X, Info, ArrowRight } from 'lucide-react';
import NoticePanel from './NoticePanel.jsx';

export default function QuestionCard({
  headingRef,
  question,
  questionNumber,
  isLastQuestion,
  selectedOptionId,
  isAnswered,
  onSelectOption,
  onNextQuestion,
}) {
  const explanationRef = useRef(null);

  // Focus explanation panel when answered for screen readers
  useEffect(() => {
    if (isAnswered && explanationRef.current) {
      explanationRef.current.focus();
    }
  }, [isAnswered]);

  // Keyboard navigation:
  // 1-4 to select option (when not answered)
  // Enter or Space to proceed to next question (when answered)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      // Don't trigger if a dialog is open (e.g. How it works modal)
      if (document.querySelector('[role="dialog"]')) return;

      if (!isAnswered) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const index = parseInt(e.key, 10) - 1;
          const opt = question.options[index];
          if (opt) {
            e.preventDefault();
            onSelectOption(opt);
          }
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          // Avoid double trigger if activeElement is already a button being activated
          if (document.activeElement?.tagName !== 'BUTTON') {
            e.preventDefault();
            onNextQuestion();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, question, onSelectOption, onNextQuestion]);

  const skillLabels = {
    vocabulary: 'Vocabulary · Wortschatz',
    grammar: 'Grammar · Grammatik',
    reading: 'Reading · Lesen',
  };

  return (
    <div className="w-full max-w-[680px] mx-auto">
      {/* Ticket Container with Notches */}
      <div className="relative bg-surface rounded-card border-[1.5px] border-ink/14 shadow-card p-6 sm:p-8 overflow-hidden">
        {/* Left and Right Notches for Ticket Aesthetics */}
        <div
          className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-paper border-r-[1.5px] border-ink/14 shadow-[inset_-2px_0_4px_rgba(20,33,61,0.06)]"
          aria-hidden="true"
        />
        <div
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-paper border-l-[1.5px] border-ink/14 shadow-[inset_2px_0_4px_rgba(20,33,61,0.06)]"
          aria-hidden="true"
        />

        {/* Skill Badge */}
        <div className="flex items-center mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-ink/[0.06] text-ink">
            {skillLabels[question.skill] || question.skill}
          </span>
        </div>

        {/* Reading Passage if present */}
        {question.passage && <NoticePanel passage={question.passage} />}

        {/* Question Prompt */}
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-serif font-bold text-xl sm:text-2xl text-ink leading-snug mb-6 focus:outline-none"
          lang="de"
        >
          {question.prompt}
        </h2>

        {/* Options List */}
        <div
          className="space-y-3"
          role="radiogroup"
          aria-label={`Options for question ${questionNumber}`}
        >
          {question.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.isCorrect;

            let buttonStyles = "bg-paper/50 border-ink/14 text-ink hover:bg-paper hover:-translate-y-0.5 hover:shadow-sm";
            let indicator = null;

            if (isAnswered) {
              if (isSelected && isCorrect) {
                // Correctly chosen
                buttonStyles = "bg-stamp-green-tint border-stamp-green text-stamp-green font-medium ring-1 ring-stamp-green";
                indicator = (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-stamp-green ml-auto pl-2 shrink-0">
                    <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                    <span>Correct</span>
                  </span>
                );
              } else if (isSelected && !isCorrect) {
                // Wrong chosen
                buttonStyles = "bg-stamp-red-tint border-stamp-red text-stamp-red font-medium ring-1 ring-stamp-red";
                indicator = (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-stamp-red ml-auto pl-2 shrink-0">
                    <X className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                    <span>Not quite</span>
                  </span>
                );
              } else if (isCorrect) {
                // Revealed correct answer
                buttonStyles = "bg-stamp-green-tint/70 border-stamp-green text-stamp-green font-medium";
                indicator = (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-stamp-green ml-auto pl-2 shrink-0">
                    <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                    <span>Correct answer</span>
                  </span>
                );
              } else {
                // Other options dim
                buttonStyles = "opacity-40 border-ink/10 text-ink/70 bg-transparent cursor-not-allowed";
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isAnswered}
                onClick={() => onSelectOption(option)}
                className={`w-full min-h-[56px] px-4 py-3 rounded-card border-[1.5px] flex items-center text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${buttonStyles}`}
              >
                {/* 1-4 Badge */}
                <span
                  className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center mr-3.5 shrink-0 transition-colors ${
                    isAnswered && (isSelected || isCorrect)
                      ? isCorrect
                        ? 'bg-stamp-green text-white'
                        : 'bg-stamp-red text-white'
                      : 'bg-ink/10 text-ink'
                  }`}
                  aria-hidden="true"
                >
                  {idx + 1}
                </span>

                {/* Option text */}
                <span className="text-sm sm:text-base leading-snug flex-1" lang="de">
                  {option.text}
                </span>

                {/* Status Indicator (Icon + Plain text) */}
                {indicator}
              </button>
            );
          })}
        </div>

        {/* Explanation Panel & Next Action */}
        {isAnswered && (
          <div
            ref={explanationRef}
            tabIndex={-1}
            className="mt-6 pt-5 border-t border-ink/10 animate-fadeIn focus:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-lg"
            aria-live="polite"
          >
            <div className="flex items-start gap-3 p-4 rounded-xl bg-ink/[0.04] border border-ink/10">
              <Info className="w-5 h-5 text-ink shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-sm text-ink/90 leading-relaxed">
                <span className="font-semibold text-ink block mb-0.5">Explanation</span>
                {question.explanation}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-ink-muted hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 rounded border border-ink/20 bg-paper text-ink font-mono text-[11px]">Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded border border-ink/20 bg-paper text-ink font-mono text-[11px]">Space</kbd> to continue
              </span>

              <button
                type="button"
                onClick={onNextQuestion}
                className="w-full sm:w-auto ml-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-btn bg-ink text-paper font-semibold text-sm hover:bg-ink/90 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-ink"
              >
                <span>{isLastQuestion ? 'See my boarding pass' : 'Next question'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

