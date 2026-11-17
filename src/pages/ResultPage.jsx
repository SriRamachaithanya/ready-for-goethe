import React from 'react';
import { RotateCcw, Printer, HelpCircle } from 'lucide-react';
import BoardingPass from '../components/BoardingPass.jsx';
import PracticeRecommendations from '../components/PracticeRecommendations.jsx';

export default function ResultPage({
  passengerName,
  evaluation,
  answers = [],
  formattedDate,
  onRetakeCheck,
  onOpenHowItWorks,
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Action Bar (Top on desktop, hidden in print) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 print-hide">
        <div>
          <span className="text-xs uppercase tracking-wider text-ink-muted font-mono block">
            VERIFICATION COMPLETE
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-ink">
            Your Exam Readiness Boarding Pass
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onRetakeCheck}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-btn border-[1.5px] border-ink/20 bg-surface text-ink text-sm font-semibold hover:bg-paper hover:border-ink/40 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-ink"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Retake check</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-btn border-[1.5px] border-ink/20 bg-surface text-ink text-sm font-semibold hover:bg-paper hover:border-ink/40 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-ink"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            <span>Print / Save</span>
          </button>
        </div>
      </div>

      {/* Hero Boarding Pass Component */}
      <BoardingPass
        passengerName={passengerName}
        evaluation={evaluation}
        answers={answers}
        formattedDate={formattedDate}
      />

      {/* Practice Recommendations & Honest Note */}
      <PracticeRecommendations
        recommendations={evaluation.recommendations}
        noMistakesRecommendation={evaluation.noMistakesRecommendation}
      />

      {/* Bottom Footer Actions (Hidden in print) */}
      <div className="mt-10 pt-6 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted print-hide">
        <p>
          Need to verify your readiness criteria?{' '}
          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="font-semibold text-ink underline hover:text-ink/80 focus-visible:ring-2 focus-visible:ring-ink rounded px-1"
          >
            How we calculate readiness
          </button>
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRetakeCheck}
            className="text-xs font-medium text-ink hover:underline min-h-[44px] inline-flex items-center px-2"
          >
            Retake test with fresh shuffled questions
          </button>
        </div>
      </div>
    </div>
  );
}
