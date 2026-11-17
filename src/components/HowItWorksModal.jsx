import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore upon close
    const previousActiveElement = document.activeElement;

    // Focus close button initially
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Simple focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-surface border border-ink/15 rounded-card p-6 sm:p-8 shadow-card relative max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between pb-4 border-b border-ink/10">
          <div>
            <h2 id="modal-title" className="font-serif font-bold text-2xl text-ink">
              How we calculate readiness
            </h2>
            <p className="text-sm text-ink-muted mt-0.5">
              Our scoring rules, explained simply
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors focus-visible:ring-2 focus-visible:ring-ink"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-sm text-ink/85 leading-relaxed">
          {/* Real exam anchor */}
          <div className="flex gap-3 items-start p-3.5 rounded-xl bg-ink/[0.03] border border-ink/10">
            <ShieldCheck className="w-5 h-5 text-ink shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-ink">The Real Exam Standard (60%)</p>
              <p className="text-xs text-ink-muted mt-1">
                The Goethe-Institut sets the pass mark at 60%. Because our diagnostic check is compact (12 questions), we build in an intentional safety margin so you do not gamble your exam fee.
              </p>
            </div>
          </div>

          {/* Skill Thresholds */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-ink text-sm uppercase tracking-wider">Per-Skill Gates</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stamp-green-tint border border-stamp-green/20">
                <span className="flex items-center gap-2 font-medium text-stamp-green">
                  <CheckCircle2 className="w-4 h-4" /> Ready (Cleared)
                </span>
                <span className="font-semibold text-stamp-green">≥ 75%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stamp-amber-tint border border-stamp-amber/20">
                <span className="flex items-center gap-2 font-medium text-stamp-amber">
                  <AlertCircle className="w-4 h-4" /> Borderline
                </span>
                <span className="font-semibold text-stamp-amber">50% – 74%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stamp-red-tint border border-stamp-red/20">
                <span className="flex items-center gap-2 font-medium text-stamp-red">
                  <XCircle className="w-4 h-4" /> Not Yet
                </span>
                <span className="font-semibold text-stamp-red">&lt; 50%</span>
              </div>
            </div>
          </div>

          {/* Weakest skill rule */}
          <div>
            <h3 className="font-semibold text-ink text-sm">The Weakest-Skill Principle</h3>
            <p className="text-xs text-ink-muted mt-1">
              Your overall boarding pass verdict is driven by your weakest skill, not your average score. Even with 100% in Vocabulary and Grammar, falling below 50% in Reading marks your status as <em>Not yet</em>. This is a cautious rule we chose on purpose: one weak skill can cost you the exam.
            </p>
          </div>

          {/* Privacy Note */}
          <div className="text-xs text-ink-muted pt-2 border-t border-ink/10">
            <strong>Privacy Guarantee:</strong> No account required. Any passenger name entered is purely cosmetic on your local device and is never stored on a server or transmitted anywhere.
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-ink/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-ink text-paper text-sm font-semibold rounded-btn hover:bg-ink/90 transition-all shadow-sm"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
