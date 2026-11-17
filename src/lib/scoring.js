import { practiceTips } from '../data/questions.js';

/**
 * Scoring Configuration
 * Goethe real exam pass mark: 60%.
 * Safety margin applied for this compact 12-question check.
 */
export const SCORING_CONFIG = {
  anchorPassRate: 60,
  thresholds: {
    ready: 75,      // >= 75% -> Ready (Cleared)
    borderline: 50, // 50% - 74% -> Borderline
                    // < 50% -> Not yet
  },
  statusKeys: {
    READY: 'ready',
    BORDERLINE: 'borderline',
    NOT_YET: 'not_yet',
  },
  statusLabels: {
    ready: 'CLEARED',
    borderline: 'BORDERLINE',
    not_yet: 'NOT YET',
  },
  verdicts: {
    READY: 'Ready to book',
    ALMOST: 'Almost there',
    NOT_YET: 'Not yet',
  },
  verdictKeys: {
    READY: 'ready',
    ALMOST: 'almost',
    NOT_YET: 'not_yet',
  },
  verdictSubtitles: {
    ready: "You look ready. Book your exam with confidence, and still do one full practice test first.",
    almost: "You are close. Practise the topics below, then retake this check before booking.",
    not_yet: "Wait a little before booking. Practise the topics below to protect your exam fee.",
  },
  noMistakesRecommendation: "Take a full official practice exam before booking.",
};

export const SKILL_TOPICS = {
  vocabulary: ['greetings', 'numbers-time', 'family', 'food-shopping'],
  grammar: ['articles', 'verb-conjugation', 'word-order', 'negation'],
  reading: ['reading-messages', 'reading-notices'],
};

/**
 * Returns a hint if the score is right on an evaluation threshold.
 * @param {number} correctCount
 * @param {number} total
 * @returns {string | null}
 */
export function nextStepHint(correctCount, total = 4) {
  if (total === 4) {
    if (correctCount === 2) {
      return "One more correct answer would change this to Cleared";
    }
    if (correctCount === 1) {
      return "One more correct answer would change this to Borderline";
    }
  }
  return null;
}

/**
 * Determine skill status based on score percentage
 * @param {number} percentage
 * @returns {'ready' | 'borderline' | 'not_yet'}
 */
export function getSkillStatus(percentage) {
  if (percentage >= SCORING_CONFIG.thresholds.ready) {
    return SCORING_CONFIG.statusKeys.READY;
  }
  if (percentage >= SCORING_CONFIG.thresholds.borderline) {
    return SCORING_CONFIG.statusKeys.BORDERLINE;
  }
  return SCORING_CONFIG.statusKeys.NOT_YET;
}

/**
 * Calculate readiness results from answered questions
 * @param {Array<{ id: string, skill: string, topic: string, isCorrect: boolean }>} answers
 * @param {Record<string, string>} tipsMap
 * @returns {object} Evaluation results
 */
export function calculateReadiness(answers = [], tipsMap = practiceTips) {
  const skillBuckets = {};
  const topicMistakes = {};
  const topicSkillMap = {};

  let totalCorrect = 0;
  const totalQuestions = answers.length;

  for (const item of answers) {
    const { skill, topic, isCorrect } = item;

    if (!skillBuckets[skill]) {
      skillBuckets[skill] = { correct: 0, total: 0 };
    }
    skillBuckets[skill].total += 1;
    if (isCorrect) {
      skillBuckets[skill].correct += 1;
      totalCorrect += 1;
    } else {
      topicMistakes[topic] = (topicMistakes[topic] || 0) + 1;
      topicSkillMap[topic] = skill;
    }
  }

  // Calculate per-skill details
  const skills = {};
  let weakestStatusRank = 3; // 3: ready, 2: borderline, 1: not_yet
  let hasNotYet = false;
  let hasBorderline = false;
  let weakestSkill = null;
  let minSkillPercentage = Infinity;

  for (const [skillKey, data] of Object.entries(skillBuckets)) {
    const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    const status = getSkillStatus(percentage);
    const label = SCORING_CONFIG.statusLabels[status];

    skills[skillKey] = {
      correct: data.correct,
      total: data.total,
      percentage,
      status,
      statusLabel: label,
    };

    if (percentage < minSkillPercentage) {
      minSkillPercentage = percentage;
      weakestSkill = skillKey;
    }

    if (status === SCORING_CONFIG.statusKeys.NOT_YET) {
      hasNotYet = true;
      weakestStatusRank = 1;
    } else if (status === SCORING_CONFIG.statusKeys.BORDERLINE) {
      hasBorderline = true;
      if (weakestStatusRank > 2) weakestStatusRank = 2;
    }
  }

  // Verdict calculation driven strictly by the weakest skill
  let verdict;
  let verdictKey;

  if (hasNotYet) {
    verdict = SCORING_CONFIG.verdicts.NOT_YET;
    verdictKey = SCORING_CONFIG.verdictKeys.NOT_YET;
  } else if (hasBorderline) {
    verdict = SCORING_CONFIG.verdicts.ALMOST;
    verdictKey = SCORING_CONFIG.verdictKeys.ALMOST;
  } else {
    verdict = SCORING_CONFIG.verdicts.READY;
    verdictKey = SCORING_CONFIG.verdictKeys.READY;
  }

  const verdictSubtitle = SCORING_CONFIG.verdictSubtitles[verdictKey];

  // Practice recommendations:
  // Count mistakes per topic, rank by mistakes.
  // Ties broken by the lowest-scoring skill percentage.
  const topicsWithMistakes = Object.keys(topicMistakes).map((topic) => {
    const mistakeCount = topicMistakes[topic];
    const skill = topicSkillMap[topic];
    const skillScore = skills[skill] ? skills[skill].percentage : 0;
    return {
      topic,
      mistakeCount,
      skill,
      skillScore,
      tip: tipsMap[topic] || '',
      reinforce: false,
    };
  });

  // Sort: primary descending by mistakeCount, secondary ascending by skillScore (lowest scoring skill first)
  topicsWithMistakes.sort((a, b) => {
    if (b.mistakeCount !== a.mistakeCount) {
      return b.mistakeCount - a.mistakeCount;
    }
    if (a.skillScore !== b.skillScore) {
      return a.skillScore - b.skillScore; // lower skill score comes first
    }
    return a.topic.localeCompare(b.topic);
  });

  let recommendations = [];

  if (topicsWithMistakes.length > 0) {
    recommendations = topicsWithMistakes.slice(0, 3);

    // B3: If fewer than 2 topics have mistakes, top up the list with 1-2 "reinforce"
    // items taken from the weakest skill's other topics.
    if (recommendations.length < 2 && weakestSkill) {
      const existingTopics = new Set(recommendations.map((r) => r.topic));
      const pool = (SKILL_TOPICS[weakestSkill] || []).filter((t) => !existingTopics.has(t));
      const needed = Math.min(pool.length, 3 - recommendations.length);

      for (let i = 0; i < needed; i++) {
        const topTopic = pool[i];
        recommendations.push({
          topic: topTopic,
          mistakeCount: 0,
          skill: weakestSkill,
          skillScore: skills[weakestSkill] ? skills[weakestSkill].percentage : 0,
          tip: tipsMap[topTopic] || '',
          reinforce: true,
        });
      }
    }
  }

  const overallPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return {
    totalCorrect,
    totalQuestions,
    overallPercentage,
    skills,
    verdict,
    verdictKey,
    verdictSubtitle,
    recommendations,
    noMistakesRecommendation: SCORING_CONFIG.noMistakesRecommendation,
  };
}
