import React from 'react';
import { Plane } from 'lucide-react';
import StampBadge from './StampBadge.jsx';
import Barcode from './Barcode.jsx';
import { nextStepHint } from '../lib/scoring.js';

export default function BoardingPass({
  passengerName,
  evaluation,
  answers = [],
  formattedDate,
}) {
  const { skills, verdict, verdictKey, verdictSubtitle } = evaluation;

  const gates = [
    {
      gateCode: 'V',
      name: 'Vocabulary',
      sublabel: 'Gate V · Wortschatz',
      key: 'vocabulary',
      delay: 'delay-gate-0',
    },
    {
      gateCode: 'G',
      name: 'Grammar',
      sublabel: 'Gate G · Grammatik',
      key: 'grammar',
      delay: 'delay-gate-1',
    },
    {
      gateCode: 'R',
      name: 'Reading',
      sublabel: 'Gate R · Lesen',
      key: 'reading',
      delay: 'delay-gate-2',
    },
  ];

  const displayName = passengerName?.trim() || 'Learner';

  const verdictColors = {
    ready: 'text-stamp-green',
    almost: 'text-stamp-amber',
    not_yet: 'text-stamp-red',
  };

  return (
    <div className="w-full max-w-[960px] mx-auto printable-area">
      <div className="bg-surface rounded-card border-[1.5px] border-ink/14 shadow-card overflow-hidden flex flex-col sm:flex-row relative">
        
        {/* ================= STUB (ABOVE GATES ON MOBILE < 640px, RIGHT ON DESKTOP) ================= */}
        <div className="w-full sm:w-[290px] bg-paper/40 p-6 sm:p-7 flex flex-col justify-between order-1 sm:order-2">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-ink/10">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-ink-muted">
                FLIGHT STATUS
              </span>
              <span className="text-[11px] font-mono text-ink/60">SEAT: 01A</span>
            </div>

            {/* Verdict */}
            <div className="mt-5 mb-4">
              <span className="text-xs uppercase tracking-wider text-ink-muted font-semibold block mb-1">
                Verdict
              </span>
              <h3
                className={`font-serif font-bold text-2xl sm:text-3xl leading-tight ${verdictColors[verdictKey] || 'text-ink'}`}
              >
                {verdict}
              </h3>
            </div>

            {/* Plain-language explanation */}
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans mb-6">
              {verdictSubtitle}
            </p>
          </div>

          {/* Barcode section directly after verdict & subtitle */}
          <div className="mt-auto pt-4 border-t border-ink/10">
            <Barcode answers={answers} />
          </div>
        </div>

        {/* ================= PERFORATION LINE & NOTCHES ================= */}
        {/* Desktop Vertical Perforation (between Main left and Stub right) */}
        <div className="hidden sm:flex flex-col items-center justify-between relative w-0 border-r-[2px] border-dashed border-ink/20 sm:order-none">
          {/* Top Semicircle Notch */}
          <div className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-paper border-b-[1.5px] border-ink/14 shadow-[inset_0_-2px_4px_rgba(20,33,61,0.06)]" />
          {/* Bottom Semicircle Notch */}
          <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-paper border-t-[1.5px] border-ink/14 shadow-[inset_0_2px_4px_rgba(20,33,61,0.06)]" />
        </div>

        {/* Mobile Horizontal Perforation (between Stub top and Main bottom) */}
        <div className="sm:hidden flex items-center justify-between relative h-0 border-b-[2px] border-dashed border-ink/20 order-2">
          {/* Left Semicircle Notch */}
          <div className="absolute -left-3.5 -top-3.5 w-7 h-7 rounded-full bg-paper border-r-[1.5px] border-ink/14 shadow-[inset_-2px_0_4px_rgba(20,33,61,0.06)]" />
          {/* Right Semicircle Notch */}
          <div className="absolute -right-3.5 -top-3.5 w-7 h-7 rounded-full bg-paper border-l-[1.5px] border-ink/14 shadow-[inset_2px_0_4px_rgba(20,33,61,0.06)]" />
        </div>

        {/* ================= MAIN SECTION (GATES & ROUTE) ================= */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between relative order-3 sm:order-1">
          
          {/* Header Strip */}
          <div className="border-b-[1.5px] border-ink/10 pb-5 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wider text-ink-muted mb-2.5 font-semibold">
              <span className="flex items-center gap-1.5 text-ink">
                <Plane className="w-3.5 h-3.5 rotate-45" aria-hidden="true" />
                BOARDING PASS · EXAM READY
              </span>
              <span className="font-mono text-ink/70">CLASS: A1 DIAGNOSTIC</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <span className="block text-[11px] font-medium text-ink-muted uppercase">Passenger</span>
                <span className="font-serif font-bold text-base sm:text-lg text-ink truncate block">
                  {displayName}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-medium text-ink-muted uppercase">Date</span>
                <span className="font-sans font-semibold text-sm sm:text-base text-ink block">
                  {formattedDate}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[11px] font-medium text-ink-muted uppercase">Destination</span>
                <span className="font-mono font-bold text-sm sm:text-base text-ink block">
                  FLIGHT: GOETHE A1
                </span>
              </div>
            </div>
          </div>

          {/* Three Gates */}
          <div className="space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-muted flex items-center justify-between">
              <span>Skill Clearance Gates</span>
              <span className="text-[11px] font-normal text-ink-muted/80">60% Exam Baseline · 75% Safety Target</span>
            </div>

            {gates.map((gate) => {
              const skillData = skills[gate.key] || { correct: 0, total: 4, percentage: 0, status: 'not_yet' };
              const percent = skillData.percentage;
              const hint = nextStepHint(skillData.correct, skillData.total);

              return (
                <div
                  key={gate.key}
                  className="p-4 rounded-xl bg-paper/60 border border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Gate Title & Score */}
                  <div className="sm:w-1/3">
                    <span className="text-[11px] font-mono font-bold text-ink/60 block">
                      {gate.sublabel}
                    </span>
                    <span className="font-serif font-bold text-lg text-ink block">
                      {gate.name}
                    </span>
                    <span className="text-xs font-semibold text-ink-muted mt-0.5 inline-block">
                      Score: <span className="text-ink">{skillData.correct} / {skillData.total}</span> ({percent}%)
                    </span>
                  </div>

                  {/* Horizontal Bar with 50% and 75% tick markers (A2 fix) */}
                  <div className="flex-1 sm:px-4">
                    <div className="relative pt-1 pb-6">
                      {/* Bar track - clearly visible at 0% */}
                      <div className="h-3 w-full bg-ink/10 border border-ink/10 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            skillData.status === 'ready'
                              ? 'bg-stamp-green'
                              : skillData.status === 'borderline'
                              ? 'bg-stamp-amber'
                              : 'bg-stamp-red'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {/* Threshold Ticks & Labels: 50% and 75% */}
                      {[50, 75].map((t) => (
                        <div
                          key={t}
                          className="absolute top-0 pointer-events-none -translate-x-1/2"
                          style={{ left: `${t}%` }}
                        >
                          <div className="w-[2px] h-[20px] bg-ink/50 mx-auto" />
                          <span className="absolute top-[22px] left-1/2 -translate-x-1/2 text-[10px] font-mono text-ink-muted whitespace-nowrap">
                            {t}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stamp Badge & Threshold Hint */}
                  <div className="sm:w-36 flex flex-col sm:items-end justify-center">
                    <StampBadge status={skillData.status} delayClass={gate.delay} />
                    {hint && (
                      <span className="text-[11px] text-ink-muted mt-1 sm:text-right leading-tight">
                        {hint}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* B5: Honest uncertainty line under the gates */}
            <p className="text-xs text-ink-muted italic pt-1">
              Each skill has only 4 questions, so one answer can change a status. Treat this as a guide, not a prediction.
            </p>
          </div>

          {/* Bottom Route line hint */}
          <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between text-xs text-ink-muted font-mono">
            <span>ORIGIN: INDIA (DEL / BOM / BLR)</span>
            <span className="hidden sm:inline">✈ DIRECT CLEARANCE</span>
            <span>DEST: DEUTSCHLAND</span>
          </div>
        </div>

      </div>
    </div>
  );
}
