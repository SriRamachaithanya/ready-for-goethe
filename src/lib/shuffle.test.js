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
});
