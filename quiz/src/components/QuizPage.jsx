import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle, Clock, Moon, Sun } from 'lucide-react';
import { STORAGE_KEYS } from '../constants';
import { useTheme } from '../context/ThemeContext';

function QuizPage({ user, quiz, onComplete }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration);
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    const released = localStorage.getItem(`${STORAGE_KEYS.RELEASED_SCORES}_${quiz.id}`) === 'true';
    if (released) {
      alert('This quiz is no longer available. Scores have been released.');
      onComplete();
    }
  }, [quiz.id, onComplete]);

  const handleSubmit = useCallback((autoSubmit = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    let score = 0;
    
    quiz.questions.forEach((q) => {
      const userAnswer = answers[q.id];
      
      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        if (userAnswer === q.correctAnswer) {
          score++;
        }
      } else if (q.type === 'identification') {
        if (userAnswer && userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
          score++;
        }
      }
    });

    const result = {
      quizId: quiz.id,
      quizCode: quiz.code,
      quizTitle: quiz.title,
      studentName: user.fullName || `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      studentNumber: user.studentNumber,
      studentEmail: user.email,
      year: user.year,
      section: user.section,
      score,
      totalQuestions: quiz.questions.filter(q => q.type !== 'essay').length,
      answers,
      violations,
      timestamp: new Date().toISOString(),
      autoSubmitted: autoSubmit
    };

    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '[]');
    results.push(result);
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(results));

    onComplete();
  }, [isSubmitting, answers, violations, user, quiz, onComplete]);

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

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = quiz.questions[currentQuestion];

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'multiple-choice':
      case 'true-false':
        return (
          <div className="space-y-2 sm:space-y-3">
            {currentQ.options.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-start p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition ${
                  answers[currentQ.id] === idx
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400'
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 dark:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name={currentQ.id}
                  checked={answers[currentQ.id] === idx}
                  onChange={() => handleAnswer(currentQ.id, idx)}
                  className="mr-3 mt-0.5 flex-shrink-0"
                />
                <span className="text-sm sm:text-base text-gray-800 dark:text-gray-100">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'identification':
        return (
          <div>
            <input
              type="text"
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Type your answer here..."
            />
          </div>
        );

      case 'essay':
        return (
          <div>
            <textarea
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
              rows="8"
              placeholder="Write your answer here..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Essay answers will be graded manually by the instructor.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const isQuestionAnswered = () => {
    const answer = answers[currentQ.id];
    if (currentQ.type === 'essay' || currentQ.type === 'identification') {
      return answer && answer.trim().length > 0;
    }
    return answer !== undefined;
  };

  return (
    <div className="min-h-screen p-2 sm:p-4">
      {showWarning && (
        <div className="fixed top-2 left-2 right-2 sm:top-4 sm:right-4 sm:left-auto bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          <p className="font-bold text-sm">⚠️ Warning!</p>
          <p className="text-xs sm:text-sm">Tab switch detected. Violations: {violations}/3</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all border-2 border-indigo-200 dark:border-gray-700"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun size={24} className="text-yellow-500" />
            ) : (
              <Moon size={24} className="text-indigo-600" />
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-6 mb-3 sm:mb-6 border dark:border-gray-700">
          <div className="space-y-3">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-gray-800 dark:text-gray-100 truncate">{quiz.title}</h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Student: {user.name} ({user.studentNumber})</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 sm:gap-2 bg-red-50 dark:bg-red-900/30 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg flex-1">
                <AlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 truncate">Violations: {violations}/3</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-blue-50 dark:bg-blue-900/30 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                <Clock size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-8 border dark:border-gray-700">
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </h3>
              <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
                {quiz.questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 ${
                      answers[quiz.questions[idx].id] !== undefined
                        ? 'bg-green-500 text-white'
                        : idx === currentQuestion
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-indigo-600 h-1.5 sm:h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="flex items-start gap-2 mb-4">
              <h4 className="text-base sm:text-xl font-medium text-gray-800 dark:text-gray-100 leading-relaxed flex-1">
                {currentQ.question}
              </h4>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded whitespace-nowrap">
                {currentQ.type.replace('-', ' ')}
              </span>
            </div>
            {renderQuestion()}
          </div>

          <div className="flex gap-2 sm:gap-0 sm:justify-between">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-200 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            
            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
                disabled={!isQuestionAnswered()}
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