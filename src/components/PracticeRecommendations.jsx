import React from 'react';
import { Target, Info, CheckCircle2 } from 'lucide-react';

export default function PracticeRecommendations({
  recommendations = [],
  noMistakesRecommendation,
}) {
  const topicTitles = {
    greetings: 'Greetings & Salutations (Begrüßungen)',
    'numbers-time': 'Numbers & Telling Time (Zahlen & Uhrzeit)',
    family: 'Family & Relationships (Familie)',
    'food-shopping': 'Shopping & Groceries (Einkaufen)',
    articles: 'Noun Articles: der, die, das (Artikel)',
    'verb-conjugation': 'Present Tense Verb Conjugation (Konjugation)',
    'word-order': 'Main Clause Word Order (Satzstellung)',
    negation: 'Negation: nicht vs. kein (Verneinung)',
    'reading-messages': 'Reading Short Emails & Notes (Nachrichten)',
    'reading-notices': 'Reading Public Signs & Hours (Schilder & Zeiten)',
  };

  const hasMistakes = recommendations.length > 0;

  return (
    <div className="w-full max-w-[960px] mx-auto mt-10 space-y-6 printable-area">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-ink/5 border border-ink/10 flex items-center justify-center text-ink">
          <Target className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-ink">
            Before you book, practise these
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted">
            Personalized study focus based on your diagnostic check mistakes
          </p>
        </div>
      </div>

      {/* Cards list or Zero Mistakes State */}
      {hasMistakes ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((item, index) => (
            <div
              key={item.topic}
              className="bg-surface rounded-card border-[1.5px] border-ink/14 p-5 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-ink text-paper text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-ink/[0.06] text-ink">
                    {item.skill}
                  </span>
                </div>

                <h4 className="font-semibold text-sm sm:text-base text-ink mb-2">
                  {topicTitles[item.topic] || item.topic}
                </h4>

                <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
                  {item.tip}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between text-[11px] text-ink-muted">
                <span>Mistakes: {item.mistakeCount}</span>
                <span className="font-mono text-ink/60">Module focus</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-card border-[1.5px] border-stamp-green/30 bg-stamp-green-tint/30 p-6 shadow-card flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-stamp-green shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h4 className="font-serif font-bold text-lg text-ink">
              No specific weaknesses detected in these 12 questions!
            </h4>
            <p className="text-sm text-ink/85 mt-1 leading-relaxed">
              {noMistakesRecommendation || "Take a full official practice exam before booking."}
            </p>
          </div>
        </div>
      )}

      {/* Honest Note Card */}
      <div className="bg-surface rounded-card border-[1.5px] border-ink/14 p-5 shadow-card flex items-start gap-3.5 print-hide">
        <Info className="w-5 h-5 text-ink-muted shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          <strong className="text-ink font-semibold">Honest diagnostic note: </strong>
          This 12-question check is an estimate, not a guarantee. It does not test Listening (Hören), Writing (Schreiben) or Speaking (Sprechen), which are part of the real Goethe-Zertifikat A1 exam.
        </div>
      </div>
    </div>
  );
}
