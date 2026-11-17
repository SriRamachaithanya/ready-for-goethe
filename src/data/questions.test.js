import { describe, it, expect } from 'vitest';
import { questions, SKILLS, practiceTips } from './questions.js';

describe('Question Bank Validation', () => {
  it('contains exactly 12 questions', () => {
    expect(questions).toHaveLength(12);
  });

  it('has 4 questions per skill', () => {
    for (const skill of SKILLS) {
      const skillQuestions = questions.filter((q) => q.skill === skill);
      expect(skillQuestions).toHaveLength(4);
    }
  });

  it('has unique IDs for every question', () => {
    const ids = questions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(questions.length);
  });

  it('has exactly 4 unique options for each question', () => {
    for (const q of questions) {
      expect(q.options).toBeInstanceOf(Array);
      expect(q.options).toHaveLength(4);
      const uniqueOptions = new Set(q.options);
      expect(uniqueOptions.size).toBe(4);
    }
  });

  it('has a valid answerIndex for each question within range 0-3', () => {
    for (const q of questions) {
      expect(typeof q.answerIndex).toBe('number');
      expect(q.answerIndex).toBeGreaterThanOrEqual(0);
      expect(q.answerIndex).toBeLessThan(4);
      expect(q.options[q.answerIndex]).toBeDefined();
    }
  });

  it('has non-empty explanation and prompt for each question', () => {
    for (const q of questions) {
      expect(typeof q.prompt).toBe('string');
      expect(q.prompt.trim().length).toBeGreaterThan(0);
      expect(typeof q.explanation).toBe('string');
      expect(q.explanation.trim().length).toBeGreaterThan(0);
    }
  });

  it('ensures reading questions have non-empty passages', () => {
    const readingQuestions = questions.filter((q) => q.skill === 'reading');
    expect(readingQuestions.length).toBeGreaterThan(0);
    for (const q of readingQuestions) {
      expect(typeof q.passage).toBe('string');
      expect(q.passage.trim().length).toBeGreaterThan(0);
    }
  });

  it('ensures every question topic has a corresponding practice tip', () => {
    for (const q of questions) {
      expect(practiceTips[q.topic]).toBeDefined();
      expect(typeof practiceTips[q.topic]).toBe('string');
      expect(practiceTips[q.topic].trim().length).toBeGreaterThan(0);
    }
  });
});
