import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HowItWorksModal from './components/HowItWorksModal.jsx';
import LandingPage from './pages/LandingPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import ResultPage from './pages/ResultPage.jsx';

import { questions as rawQuestions } from './data/questions.js';
import { prepareQuizSession } from './lib/shuffle.js';
import { calculateReadiness } from './lib/scoring.js';
import {
  saveLastResult,
  loadLastResult,
  savePassengerName,
  loadPassengerName,
} from './lib/storage.js';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'quiz' | 'result'
  const [passengerName, setPassengerName] = useState(() => loadPassengerName());
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [evaluation, setEvaluation] = useState(() => loadLastResult());
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [examDate, setExamDate] = useState(() => {
    return new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  });

  const headingRef = useRef(null);
  const isInitialMount = useRef(true);

  // Focus management across view changes (skipping initial page load)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (view === 'quiz') {
      setAnnouncement('Question 1 of 12');
    } else {
      setAnnouncement('');
    }

    // Move focus without scrolling twice
    if (headingRef.current) {
      headingRef.current.focus({ preventScroll: true });
    }
  }, [view]);

  // Start new quiz session
  const handleStartQuiz = (name) => {
    const finalName = name !== undefined ? name : passengerName;
    setPassengerName(finalName);
    savePassengerName(finalName);

    // Shuffle fresh questions and options (keeping passages contiguous)
    const sessionQuestions = prepareQuizSession(rawQuestions);
    setQuizQuestions(sessionQuestions);
    setAnswers([]);
    setView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Complete quiz session
  const handleCompleteQuiz = (finalAnswers) => {
    const result = calculateReadiness(finalAnswers);
    setAnswers(finalAnswers);
    setEvaluation(result);

    const nowFormatted = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    setExamDate(nowFormatted);

    // Persist result safely
    saveLastResult({
      evaluation: result,
      answers: finalAnswers,
      passengerName,
      date: nowFormatted,
    });

    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retake test
  const handleRetake = () => {
    handleStartQuiz(passengerName);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Screen Reader Announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Header */}
      <Header onOpenHowItWorks={() => setIsHowItWorksOpen(true)} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col justify-center">
        {view === 'landing' && (
          <LandingPage
            headingRef={headingRef}
            passengerName={passengerName}
            setPassengerName={setPassengerName}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {view === 'quiz' && (
          <QuizPage
            headingRef={headingRef}
            questions={quizQuestions}
            onCompleteQuiz={handleCompleteQuiz}
          />
        )}

        {view === 'result' && evaluation && (
          <ResultPage
            headingRef={headingRef}
            passengerName={passengerName}
            evaluation={evaluation}
            answers={answers}
            formattedDate={examDate}
            onRetakeCheck={handleRetake}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* "How It Works" Accessibility Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}
