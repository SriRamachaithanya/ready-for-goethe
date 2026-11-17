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
 * Prepares a single question with shuffled options and tracking by text
 */
function prepareSingleQuestion(q) {
  const correctText = q.options[q.answerIndex];

  const mappedOptions = q.options.map((optText, idx) => ({
    id: `${q.id}-opt-${idx}`,
    text: optText,
    isCorrect: optText === correctText,
  }));

  const shuffledOptions = shuffleArray(mappedOptions);

  return {
    id: q.id,
    skill: q.skill,
    topic: q.topic,
    prompt: q.prompt,
    passage: q.passage,
    explanation: q.explanation,
    options: shuffledOptions,
    correctText,
  };
}

/**
 * Prepares a fresh quiz session:
 * 1. Shuffles questions within Vocabulary and Grammar.
 * 2. For Reading: groups questions by passage, shuffles passage order,
 *    and keeps the two questions of each passage next to each other.
 * 3. Shuffles all 4 options for each question.
 * 4. Tracks correct answer by option text, never by original index.
 * 
 * @param {Array} rawQuestions 
 * @returns {Array} Prepared quiz questions ready for presentation
 */
export function prepareQuizSession(rawQuestions) {
  const preparedQuestions = [];

  for (const skill of SKILLS) {
    const skillQuestions = rawQuestions.filter((q) => q.skill === skill);

    if (skill === 'reading') {
      // Group reading questions by passage
      const passageMap = new Map();
      for (const q of skillQuestions) {
        const key = q.passage;
        if (!passageMap.has(key)) {
          passageMap.set(key, []);
        }
        passageMap.get(key).push(q);
      }

      // Shuffle the order of passages
      const passageGroups = Array.from(passageMap.values());
      const shuffledPassageGroups = shuffleArray(passageGroups);

      // Keep questions of each passage contiguous
      for (const group of shuffledPassageGroups) {
        const shuffledGroupQuestions = shuffleArray(group);
        for (const q of shuffledGroupQuestions) {
          preparedQuestions.push(prepareSingleQuestion(q));
        }
      }
    } else {
      const shuffledSkillQuestions = shuffleArray(skillQuestions);
      for (const q of shuffledSkillQuestions) {
        preparedQuestions.push(prepareSingleQuestion(q));
      }
    }
  }

  return preparedQuestions;
}
