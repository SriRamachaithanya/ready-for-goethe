import { SKILLS } from '../data/questions.js';

/**
 * Fisher-Yates shuffle implementation
 * Returns a new shuffled array without mutating the original
 */
export function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Prepares a fresh quiz session:
 * 1. Shuffles questions within each skill (Vocabulary, Grammar, Reading)
 *    so the segmented progress bar neatly groups them under skill headers.
 * 2. Shuffles all 4 options for each question.
 * 3. Tracks correct answer by option text, never by original index.
 * 
 * @param {Array} rawQuestions 
 * @returns {Array} Prepared quiz questions ready for presentation
 */
export function prepareQuizSession(rawQuestions) {
  const preparedQuestions = [];

  for (const skill of SKILLS) {
    const skillQuestions = rawQuestions.filter((q) => q.skill === skill);
    const shuffledSkillQuestions = shuffleArray(skillQuestions);

    for (const q of shuffledSkillQuestions) {
      const correctText = q.options[q.answerIndex];

      const mappedOptions = q.options.map((optText, idx) => ({
        id: `${q.id}-opt-${idx}`,
        text: optText,
        isCorrect: optText === correctText,
      }));

      const shuffledOptions = shuffleArray(mappedOptions);

      preparedQuestions.push({
        id: q.id,
        skill: q.skill,
        topic: q.topic,
        prompt: q.prompt,
        passage: q.passage,
        explanation: q.explanation,
        options: shuffledOptions,
        correctText,
      });
    }
  }

  return preparedQuestions;
}
