import { describe, it, expect } from 'vitest';
import { shuffleArray, prepareQuizSession } from './shuffle.js';
import { questions } from '../data/questions.js';

describe('Shuffle Utilities', () => {
  it('shuffleArray keeps all items and preserves length', () => {
    const original = [1, 2, 3, 4, 5, 6];
    const shuffled = shuffleArray(original);
    expect(shuffled).toHaveLength(original.length);
    expect(new Set(shuffled)).toEqual(new Set(original));
  });

  it('prepareQuizSession accurately links the correct option regardless of position', () => {
    const prepared = prepareQuizSession(questions);
    expect(prepared).toHaveLength(12);

    for (const q of prepared) {
      expect(q.options).toHaveLength(4);
      const correctOpts = q.options.filter((opt) => opt.isCorrect);
      expect(correctOpts).toHaveLength(1);
      expect(correctOpts[0].text).toBe(q.correctText);
    }
  });

  it('B6: keeps reading questions contiguous by passage', () => {
    // Run multiple times to verify across randomized runs
    for (let run = 0; run < 15; run++) {
      const prepared = prepareQuizSession(questions);
      const readingQuestions = prepared.filter((q) => q.skill === 'reading');
      expect(readingQuestions).toHaveLength(4);

      // Verify that questions with the same passage are contiguous (indices difference is 1)
      const passageFirstIndex = new Map();
      const passageLastIndex = new Map();

      readingQuestions.forEach((q, idx) => {
        if (!passageFirstIndex.has(q.passage)) {
          passageFirstIndex.set(q.passage, idx);
        }
        passageLastIndex.set(q.passage, idx);
      });

      for (const [passage, firstIdx] of passageFirstIndex.entries()) {
        const lastIdx = passageLastIndex.get(passage);
        // There are 2 questions per passage; if contiguous, lastIdx - firstIdx === 1
        expect(lastIdx - firstIdx).toBe(1);
      }
    }
  });
});
