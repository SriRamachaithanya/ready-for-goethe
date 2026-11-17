import React, { useState } from 'react';
import { Plane, ArrowRight, CheckCircle2, Shield, Clock, BookOpen } from 'lucide-react';

export default function LandingPage({ passengerName, setPassengerName, onStartQuiz }) {
  const [localName, setLocalName] = useState(passengerName || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    setPassengerName(localName.trim());
    onStartQuiz(localName.trim());
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 flex flex-col items-center">
      {/* Hero Headline & Subhead */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-ink/[0.06] text-ink mb-4">
          <Plane className="w-3.5 h-3.5 rotate-45" aria-hidden="true" />
          Goethe-Zertifikat A1 Pre-Flight Check
        </span>
        <h1 className="heading-fluid font-serif font-bold text-ink tracking-tight text-balance">
          Are you ready for your German exam?
        </h1>
        <p className="mt-4 text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl mx-auto text-balance">
          A realistic 5-minute diagnostic for Indian professionals learning German. Know your clearance status before you risk your exam fee.
        </p>
      </div>

      {/* Ticket Check-In Card */}
      <div className="w-full max-w-md bg-surface rounded-card border-[1.5px] border-ink/14 shadow-card p-6 sm:p-8 relative overflow-hidden">
        {/* Left and Right Notches */}
        <div
          className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-paper border-r-[1.5px] border-ink/14 shadow-[inset_-2px_0_4px_rgba(20,33,61,0.06)]"
          aria-hidden="true"
        />
        <div
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-paper border-l-[1.5px] border-ink/14 shadow-[inset_2px_0_4px_rgba(20,33,61,0.06)]"
          aria-hidden="true"
        />

        {/* Top Header of Ticket */}
        <div className="flex items-center justify-between pb-4 border-b border-ink/10 text-xs font-mono font-bold text-ink-muted uppercase">
          <span>CHECK-IN</span>
          <span>GATE: ONLINE</span>
        </div>

        {/* Route Line */}
        <div className="py-5 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="font-serif font-bold text-lg text-ink">INDIA</span>
            <div className="flex items-center gap-1 text-ink/40">
              <span className="w-4 border-b border-dashed border-ink/40" />
              <Plane className="w-4 h-4 text-ink rotate-45 transform" aria-hidden="true" />
              <span className="w-4 border-b border-dashed border-ink/40" />
            </div>
            <span className="font-serif font-bold text-lg text-ink">DEUTSCHLAND</span>
          </div>
          <span className="text-[11px] font-mono text-ink-muted mt-1 block uppercase">
            TARGET: GOETHE-ZERTIFIKAT A1
          </span>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-paper border border-ink/10 text-ink">
            Vocabulary · 4
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-paper border border-ink/10 text-ink">
            Grammar · 4
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-paper border border-ink/10 text-ink">
            Reading · 4
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="passenger-name"
              className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5"
            >
              Name on your boarding pass <span className="font-normal lowercase text-ink-muted/80">(optional, never stored on a server)</span>
            </label>
            <input
              id="passenger-name"
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              maxLength={40}
              className="w-full px-4 py-3 rounded-btn border-[1.5px] border-ink/20 bg-paper/50 text-ink text-sm placeholder:text-ink/35 focus:outline-none focus:border-ink focus:bg-surface focus-visible:ring-2 focus-visible:ring-ink transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full h-[52px] rounded-btn bg-ink text-paper font-semibold text-base flex items-center justify-center gap-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all shadow-md focus-visible:ring-3 focus-visible:ring-ink"
          >
            <span>Start check</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-ink-muted">
          12 questions · about 5 minutes · no sign-up
        </p>
      </div>

      {/* Trust Points Under Ticket */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 max-w-xl w-full text-center sm:text-left">
        <div className="flex items-start gap-3 p-2">
          <div className="w-8 h-8 rounded-lg bg-ink/5 flex items-center justify-center shrink-0 text-ink">
            <Clock className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <span className="font-semibold text-sm text-ink block">12 questions</span>
            <span className="text-xs text-ink-muted">Carefully selected high-signal A1 items</span>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2">
          <div className="w-8 h-8 rounded-lg bg-ink/5 flex items-center justify-center shrink-0 text-ink">
            <Shield className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <span className="font-semibold text-sm text-ink block">Per-skill result</span>
            <span className="text-xs text-ink-muted">Individual gates for Vocab, Grammar, Reading</span>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2">
          <div className="w-8 h-8 rounded-lg bg-ink/5 flex items-center justify-center shrink-0 text-ink">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <span className="font-semibold text-sm text-ink block">Practice plan</span>
            <span className="text-xs text-ink-muted">Targeted recommendations to fix mistakes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
