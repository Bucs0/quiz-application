import React, { useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { QUIZ_DATA } from '../constants';

function QuizPage({ user, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const currentQ = QUIZ_DATA.questions[currentQuestion];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{QUIZ_DATA.title}</h2>
              <p className="text-gray-600">Student: {user.name}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Question {currentQuestion + 1} of {QUIZ_DATA.questions.length}
            </h3>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-medium text-gray-800 mb-6">{currentQ.question}</h4>
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <label
                  key={idx}
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer"
                >
                  <input
                    type="radio"
                    name={currentQ.id}
                    checked={answers[currentQ.id] === idx}
                    onChange={() => handleAnswer(currentQ.id, idx)}
                    className="mr-4"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-200 rounded-lg font-medium"
            >
              Previous
            </button>
            
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;