import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar.jsx';
import QuestionCard from '../components/QuestionCard.jsx';

export default function QuizPage({
  questions,
  onCompleteQuiz,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectOption = (option) => {
    if (isAnswered) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    const answerRecord = {
      id: currentQuestion.id,
      skill: currentQuestion.skill,
      topic: currentQuestion.topic,
      isCorrect: option.isCorrect,
      selectedOptionText: option.text,
      correctOptionText: currentQuestion.correctText,
    };

    setAnswers((prev) => [...prev, answerRecord]);
  };

  const handleNext = () => {
    if (!isAnswered) return;

    if (isLastQuestion) {
      onCompleteQuiz(answers);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Segmented Progress Bar */}
      <ProgressBar currentIndex={currentIndex} total={questions.length} />

      {/* Active Question Card */}
      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        isLastQuestion={isLastQuestion}
        selectedOptionId={selectedOptionId}
        isAnswered={isAnswered}
        onSelectOption={handleSelectOption}
        onNextQuestion={handleNext}
      />
    </div>
  );
}
