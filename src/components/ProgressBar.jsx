import React from 'react';

const SKILL_SECTIONS = [
  { name: 'Vocabulary', startIndex: 0, count: 4 },
  { name: 'Grammar', startIndex: 4, count: 4 },
  { name: 'Reading', startIndex: 8, count: 4 },
];

export default function ProgressBar({ currentIndex, total = 12 }) {
  const currentNumber = currentIndex + 1;

  return (
    <div className="w-full mb-8">
      {/* Question Counter (Announced by screen readers) */}
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
        <span aria-live="polite" aria-atomic="true">
          Question {currentNumber} of {total}
        </span>
        <span className="text-ink/60">Goethe A1 Check</span>
      </div>

      {/* Segmented bar grouped by skill */}
      <div
        className="grid grid-cols-3 gap-3 sm:gap-4"
        role="progressbar"
        aria-valuenow={currentNumber}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Progress: Question ${currentNumber} of ${total}`}
      >
        {SKILL_SECTIONS.map((section) => {
          const isSkillActive =
            currentIndex >= section.startIndex &&
            currentIndex < section.startIndex + section.count;
          const isSkillDone = currentIndex >= section.startIndex + section.count;

          return (
            <div key={section.name} className="flex flex-col gap-1.5">
              <span
                className={`text-[11px] font-semibold tracking-wide transition-colors ${
                  isSkillActive
                    ? 'text-ink font-bold'
                    : isSkillDone
                    ? 'text-ink/75'
                    : 'text-ink-muted/60'
                }`}
              >
                {section.name}
              </span>

              <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                {Array.from({ length: section.count }).map((_, tickIdx) => {
                  const globalIdx = section.startIndex + tickIdx;
                  const isCompleted = globalIdx < currentIndex;
                  const isCurrent = globalIdx === currentIndex;

                  return (
                    <div
                      key={globalIdx}
                      className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                        isCurrent
                          ? 'bg-ink ring-2 ring-ink/20 ring-offset-1 scale-105'
                          : isCompleted
                          ? 'bg-ink/70'
                          : 'bg-ink/10'
                      }`}
                      title={`Question ${globalIdx + 1} (${section.name})`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
