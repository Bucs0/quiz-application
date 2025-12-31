import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { QUIZ_DATA, STORAGE_KEYS } from '../constants';

function QuizPage({ user, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DATA.duration);
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef(null);

  const handleSubmit = useCallback((autoSubmit = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    let score = 0;
    QUIZ_DATA.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const result = {
      studentName: user.name,
      studentEmail: user.email,
      score,
      totalQuestions: QUIZ_DATA.questions.length,
      violations,
      timestamp: new Date().toISOString(),
      autoSubmitted: autoSubmit
    };

    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '[]');
    results.push(result);
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(results));

    onComplete();
  }, [isSubmitting, answers, violations, user.name, user.email, onComplete]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations((prev) => prev + 1);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleSubmit]);

  useEffect(() => {
    if (violations >= 3 && !isSubmitting) {
      handleSubmit(true);
    }
  }, [violations, isSubmitting, handleSubmit]);

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = QUIZ_DATA.questions[currentQuestion];

  return (
    <div className="min-h-screen p-2 sm:p-4">
      {showWarning && (
        <div className="fixed top-2 left-2 right-2 sm:top-4 sm:right-4 sm:left-auto bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          <p className="font-bold text-sm">⚠️ Warning!</p>
          <p className="text-xs sm:text-sm">Tab switch detected. Violations: {violations}/3</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6 mb-3 sm:mb-6">
          <div className="space-y-3">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-gray-800 truncate">{QUIZ_DATA.title}</h2>
              <p className="text-xs sm:text-sm text-gray-600 truncate">Student: {user.name}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 sm:gap-2 bg-red-50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg flex-1">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-red-600 truncate">Violations: {violations}/3</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-blue-50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                <Clock size={16} className="text-blue-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-blue-600">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-700">
                Question {currentQuestion + 1} of {QUIZ_DATA.questions.length}
              </h3>
              <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
                {QUIZ_DATA.questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 ${
                      answers[QUIZ_DATA.questions[idx].id] !== undefined
                        ? 'bg-green-500 text-white'
                        : idx === currentQuestion
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-indigo-600 h-1.5 sm:h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / QUIZ_DATA.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h4 className="text-base sm:text-xl font-medium text-gray-800 mb-4 sm:mb-6 leading-relaxed">{currentQ.question}</h4>
            <div className="space-y-2 sm:space-y-3">
              {currentQ.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-start p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition ${
                    answers[currentQ.id] === idx
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQ.id}
                    checked={answers[currentQ.id] === idx}
                    onChange={() => handleAnswer(currentQ.id, idx)}
                    className="mr-3 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm sm:text-base text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 sm:gap-0 sm:justify-between">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-200 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            
            {currentQuestion === QUIZ_DATA.questions.length - 1 ? (
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion((prev) => Math.min(QUIZ_DATA.questions.length - 1, prev + 1))}
                disabled={answers[currentQ.id] === undefined}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm sm:text-base bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;