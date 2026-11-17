import { describe, it, expect } from 'vitest';
import { calculateReadiness, getSkillStatus, nextStepHint, SCORING_CONFIG } from './scoring.js';
import { practiceTips } from '../data/questions.js';

describe('Scoring & Readiness Logic', () => {
  it('correctly classifies boundary values at 50% and 75%', () => {
    // Exactly 75% -> ready
    expect(getSkillStatus(75)).toBe('ready');
    expect(getSkillStatus(100)).toBe('ready');
    expect(getSkillStatus(74.9)).toBe('borderline');
    // Exactly 50% -> borderline
    expect(getSkillStatus(50)).toBe('borderline');
    expect(getSkillStatus(49.9)).toBe('not_yet');
    expect(getSkillStatus(0)).toBe('not_yet');
  });

  it('handles nextStepHint at 1/4, 2/4, 3/4 and edge cases', () => {
    // B5 tests
    expect(nextStepHint(1, 4)).toBe('One more correct answer would change this to Borderline');
    expect(nextStepHint(2, 4)).toBe('One more correct answer would change this to Cleared');
    expect(nextStepHint(3, 4)).toBeNull();
    expect(nextStepHint(4, 4)).toBeNull();
    expect(nextStepHint(0, 4)).toBeNull();
  });

  it('handles all correct answers (12/12) -> Ready to book, no-mistakes tip', () => {
    const answers = [
      { id: 'v1', skill: 'vocabulary', topic: 'greetings', isCorrect: true },
      { id: 'v2', skill: 'vocabulary', topic: 'numbers-time', isCorrect: true },
      { id: 'v3', skill: 'vocabulary', topic: 'family', isCorrect: true },
      { id: 'v4', skill: 'vocabulary', topic: 'food-shopping', isCorrect: true },
      { id: 'g1', skill: 'grammar', topic: 'articles', isCorrect: true },
      { id: 'g2', skill: 'grammar', topic: 'verb-conjugation', isCorrect: true },
      { id: 'g3', skill: 'grammar', topic: 'word-order', isCorrect: true },
      { id: 'g4', skill: 'grammar', topic: 'negation', isCorrect: true },
      { id: 'r1', skill: 'reading', topic: 'reading-messages', isCorrect: true },
      { id: 'r2', skill: 'reading', topic: 'reading-messages', isCorrect: true },
      { id: 'r3', skill: 'reading', topic: 'reading-notices', isCorrect: true },
      { id: 'r4', skill: 'reading', topic: 'reading-notices', isCorrect: true },
    ];

    const result = calculateReadiness(answers, practiceTips);

    expect(result.totalCorrect).toBe(12);
    expect(result.overallPercentage).toBe(100);
    expect(result.verdict).toBe('Ready to book');
    expect(result.verdictKey).toBe('ready');
    expect(result.verdictSubtitle).toBe(SCORING_CONFIG.verdictSubtitles.ready);

    expect(result.skills.vocabulary.percentage).toBe(100);
    expect(result.skills.vocabulary.status).toBe('ready');
    expect(result.skills.vocabulary.statusLabel).toBe('CLEARED');

    expect(result.skills.grammar.status).toBe('ready');
    expect(result.skills.reading.status).toBe('ready');

    expect(result.recommendations).toHaveLength(0);
    expect(result.noMistakesRecommendation).toBe('Take a full official practice exam before booking.');
  });

  it('B3 top-up logic: exactly one mistake gives 2-3 practice items', () => {
    // 1 mistake in vocabulary ('greetings')
    const answers = [
      { id: 'v1', skill: 'vocabulary', topic: 'greetings', isCorrect: false },
      { id: 'v2', skill: 'vocabulary', topic: 'numbers-time', isCorrect: true },
      { id: 'v3', skill: 'vocabulary', topic: 'family', isCorrect: true },
      { id: 'v4', skill: 'vocabulary', topic: 'food-shopping', isCorrect: true },
      { id: 'g1', skill: 'grammar', topic: 'articles', isCorrect: true },
      { id: 'g2', skill: 'grammar', topic: 'verb-conjugation', isCorrect: true },
      { id: 'g3', skill: 'grammar', topic: 'word-order', isCorrect: true },
      { id: 'g4', skill: 'grammar', topic: 'negation', isCorrect: true },
      { id: 'r1', skill: 'reading', topic: 'reading-messages', isCorrect: true },
      { id: 'r2', skill: 'reading', topic: 'reading-messages', isCorrect: true },
      { id: 'r3', skill: 'reading', topic: 'reading-notices', isCorrect: true },
      { id: 'r4', skill: 'reading', topic: 'reading-notices', isCorrect: true },
    ];

    const result = calculateReadiness(answers, practiceTips);

    // Total recommendations must be between 2 and 3
    expect(result.recommendations.length).toBeGreaterThanOrEqual(2);
    expect(result.recommendations.length).toBeLessThanOrEqual(3);

    // First recommendation is the mistake topic
    expect(result.recommendations[0].topic).toBe('greetings');
    expect(result.recommendations[0].mistakeCount).toBe(1);
    expect(result.recommendations[0].reinforce).toBe(false);

    // Subsequent recommendations are "reinforce" items from the weakest skill (vocabulary)
    for (let i = 1; i < result.recommendations.length; i++) {
      expect(result.recommendations[i].reinforce).toBe(true);
      expect(result.recommendations[i].skill).toBe('vocabulary');
      expect(result.recommendations[i].mistakeCount).toBe(0);
    }
  });

  it('handles all wrong answers (0/12) -> Not yet', () => {
    const answers = [
      { id: 'v1', skill: 'vocabulary', topic: 'greetings', isCorrect: false },
      { id: 'v2', skill: 'vocabulary', topic: 'numbers-time', isCorrect: false },
      { id: 'v3', skill: 'vocabulary', topic: 'family', isCorrect: false },
      { id: 'v4', skill: 'vocabulary', topic: 'food-shopping', isCorrect: false },
      { id: 'g1', skill: 'grammar', topic: 'articles', isCorrect: false },
      { id: 'g2', skill: 'grammar', topic: 'verb-conjugation', isCorrect: false },
      { id: 'g3', skill: 'grammar', topic: 'word-order', isCorrect: false },
      { id: 'g4', skill: 'grammar', topic: 'negation', isCorrect: false },
      { id: 'r1', skill: 'reading', topic: 'reading-messages', isCorrect: false },
      { id: 'r2', skill: 'reading', topic: 'reading-messages', isCorrect: false },
      { id: 'r3', skill: 'reading', topic: 'reading-notices', isCorrect: false },
      { id: 'r4', skill: 'reading', topic: 'reading-notices', isCorrect: false },
    ];

    const result = calculateReadiness(answers, practiceTips);

    expect(result.totalCorrect).toBe(0);
    expect(result.overallPercentage).toBe(0);
    expect(result.verdict).toBe('Not yet');
    expect(result.verdictKey).toBe('not_yet');
    expect(result.verdictSubtitle).toBe(SCORING_CONFIG.verdictSubtitles.not_yet);

    expect(result.skills.vocabulary.status).toBe('not_yet');
    expect(result.skills.grammar.status).toBe('not_yet');
    expect(result.skills.reading.status).toBe('not_yet');

    expect(result.recommendations.length).toBeGreaterThanOrEqual(2);
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
  });

  it('follows weakest skill: one weak skill (reading < 50%) with high average gives "Not yet"', () => {
    // Vocab: 4/4 (100%), Grammar: 4/4 (100%), Reading: 1/4 (25%) -> Overall: 9/12 = 75%
    // Even though overall is 75%, verdict MUST be "Not yet" because Reading is < 50%
    const answers = [
      { id: 'v1', skill: 'vocabulary', topic: 'greetings', isCorrect: true },
      { id: 'v2', skill: 'vocabulary', topic: 'numbers-time', isCorrect: true },
      { id: 'v3', skill: 'vocabulary', topic: 'family', isCorrect: true },
      { id: 'v4', skill: 'vocabulary', topic: 'food-shopping', isCorrect: true },
      { id: 'g1', skill: 'grammar', topic: 'articles', isCorrect: true },
      { id: 'g2', skill: 'grammar', topic: 'verb-conjugation', isCorrect: true },
      { id: 'g3', skill: 'grammar', topic: 'word-order', isCorrect: true },
      { id: 'g4', skill: 'grammar', topic: 'negation', isCorrect: true },
      { id: 'r1', skill: 'reading', topic: 'reading-messages', isCorrect: false },
      { id: 'r2', skill: 'reading', topic: 'reading-messages', isCorrect: false },
      { id: 'r3', skill: 'reading', topic: 'reading-notices', isCorrect: false },
      { id: 'r4', skill: 'reading', topic: 'reading-notices', isCorrect: true },
    ];

    const result = calculateReadiness(answers, practiceTips);

    expect(result.overallPercentage).toBe(75);
    expect(result.skills.vocabulary.status).toBe('ready');
    expect(result.skills.grammar.status).toBe('ready');
    expect(result.skills.reading.status).toBe('not_yet');
    expect(result.skills.reading.percentage).toBe(25);

    expect(result.verdict).toBe('Not yet');
    expect(result.verdictKey).toBe('not_yet');
  });

  it('verdict is "Almost there" when no skill is Not yet, but at least one is Borderline', () => {
    // Vocab: 4/4 (100%), Grammar: 3/4 (75%), Reading: 2/4 (50% -> Borderline)
    const answers = [
      { id: 'v1', skill: 'vocabulary', topic: 'greetings', isCorrect: true },
      { id: 'v2', skill: 'vocabulary', topic: 'numbers-time', isCorrect: true },
      { id: 'v3', skill: 'vocabulary', topic: 'family', isCorrect: true },
      { id: 'v4', skill: 'vocabulary', topic: 'food-shopping', isCorrect: true },
      { id: 'g1', skill: 'grammar', topic: 'articles', isCorrect: true },
      { id: 'g2', skill: 'grammar', topic: 'verb-conjugation', isCorrect: true },
      { id: 'g3', skill: 'grammar', topic: 'word-order', isCorrect: true },
      { id: 'g4', skill: 'grammar', topic: 'negation', isCorrect: false },
      { id: 'r1', skill: 'reading', topic: 'reading-messages', isCorrect: true },
      { id: 'r2', skill: 'reading', topic: 'reading-messages', isCorrect: true },
      { id: 'r3', skill: 'reading', topic: 'reading-notices', isCorrect: false },
      { id: 'r4', skill: 'reading', topic: 'reading-notices', isCorrect: false },
    ];

    const result = calculateReadiness(answers, practiceTips);

    expect(result.skills.vocabulary.status).toBe('ready');
    expect(result.skills.grammar.status).toBe('ready'); // 75%
    expect(result.skills.reading.status).toBe('borderline'); // 50%
    expect(result.verdict).toBe('Almost there');
    expect(result.verdictKey).toBe('almost');
  });

  it('ranks practice recommendations by mistake count, breaking ties by lowest-scoring skill', () => {
    const answers = [
      { id: 'v1', skill: 'vocabulary', topic: 'greetings', isCorrect: false }, // 1 mistake
      { id: 'v2', skill: 'vocabulary', topic: 'numbers-time', isCorrect: true },
      { id: 'v3', skill: 'vocabulary', topic: 'family', isCorrect: true },
      { id: 'v4', skill: 'vocabulary', topic: 'food-shopping', isCorrect: true }, // Vocab: 75%

      { id: 'g1', skill: 'grammar', topic: 'articles', isCorrect: false }, // 1 mistake
      { id: 'g2', skill: 'grammar', topic: 'verb-conjugation', isCorrect: false }, // 1 mistake
      { id: 'g3', skill: 'grammar', topic: 'word-order', isCorrect: true },
      { id: 'g4', skill: 'grammar', topic: 'negation', isCorrect: true }, // Grammar: 50%

      { id: 'r1', skill: 'reading', topic: 'reading-messages', isCorrect: false }, // mistake 1
      { id: 'r2', skill: 'reading', topic: 'reading-messages', isCorrect: false }, // mistake 2 (total 2)
      { id: 'r3', skill: 'reading', topic: 'reading-notices', isCorrect: false }, // 1 mistake
      { id: 'r4', skill: 'reading', topic: 'reading-notices', isCorrect: true }, // Reading: 25%
    ];

    const result = calculateReadiness(answers, practiceTips);

    // Top 3 should be selected
    expect(result.recommendations).toHaveLength(3);
    // Highest mistakes first
    expect(result.recommendations[0].topic).toBe('reading-messages');
    expect(result.recommendations[0].mistakeCount).toBe(2);

    expect(result.recommendations[1].topic).toBe('reading-notices');
    expect(result.recommendations[1].skillScore).toBe(25);

    expect(result.recommendations[2].skillScore).toBe(50);
  });
});
