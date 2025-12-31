import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, LogOut, Mail, Lock } from 'lucide-react';
import { QUIZ_DATA, STORAGE_KEYS } from '../constants';

function StudentDashboard({ user, onLogout, onStartQuiz }) {
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [result, setResult] = useState(null);
  const [scoresReleased, setScoresReleased] = useState(false);

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '[]');
    const userResult = results.find(r => r.studentEmail === user.email);
    
    if (userResult) {
      setHasCompletedQuiz(true);
      setResult(userResult);
    }

    const released = localStorage.getItem(STORAGE_KEYS.RELEASED_SCORES) === 'true';
    setScoresReleased(released);
  }, [user.email]);

  const handleStartQuiz = () => {
    const released = localStorage.getItem(STORAGE_KEYS.RELEASED_SCORES) === 'true';
    if (released) {
      alert('Quiz is no longer available. Scores have been released.');
      return;
    }
    onStartQuiz();
  };

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="w-full sm:w-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">Welcome, {user.name}!</h2>
              <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 break-all">
                <Mail size={14} className="flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition w-full sm:w-auto text-sm sm:text-base"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-4 leading-relaxed">
            {QUIZ_DATA.title}
          </h3>
          
          {!hasCompletedQuiz ? (
            <div>
              {scoresReleased ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="text-red-600 flex-shrink-0" size={24} />
                    <p className="text-red-800 font-bold text-base sm:text-lg">Quiz Closed</p>
                  </div>
                  <p className="text-red-700 text-sm sm:text-base">
                    This quiz is no longer available. The instructor has released scores and closed the quiz for new submissions.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-blue-800 text-sm sm:text-base">
                      <strong>Instructions:</strong>
                    </p>
                    <ul className="list-disc list-inside mt-2 text-blue-700 space-y-1 text-xs sm:text-sm">
                      <li>You have {QUIZ_DATA.duration / 60} minutes to complete the quiz</li>
                      <li>Do not switch tabs or minimize the window</li>
                      <li>After 3 violations, the quiz will auto-submit</li>
                      <li>You can only take this quiz once</li>
                      <li className="break-words">Results will be displayed here and sent to your email when released</li>
                    </ul>
                  </div>
                  
                  <button
                    onClick={handleStartQuiz}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition text-sm sm:text-base"
                  >
                    Start Quiz
                  </button>
                </>
              )}
            </div>
          ) : (
            <div>
              {scoresReleased && result ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                      <p className="text-green-800 font-semibold text-sm sm:text-base">Quiz Completed</p>
                    </div>
                    <p className="text-green-700 text-xs sm:text-sm">Your results have been released and sent to your email!</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-indigo-600 font-medium">Score</p>
                      <p className="text-2xl sm:text-3xl font-bold text-indigo-700">
                        {result.score} / {QUIZ_DATA.questions.length}
                      </p>
                      <p className="text-xs sm:text-sm text-indigo-600 mt-1">
                        {Math.round((result.score / QUIZ_DATA.questions.length) * 100)}%
                      </p>
                    </div>
                    <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-orange-600 font-medium">Violations</p>
                      <p className="text-2xl sm:text-3xl font-bold text-orange-700">
                        {result.violations}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600">Submitted on</p>
                    <p className="text-gray-800 font-medium text-sm sm:text-base break-words">
                      {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                    <p className="text-yellow-800 font-semibold text-sm sm:text-base">
                      Quiz Submitted
                    </p>
                  </div>
                  <p className="text-yellow-700 mt-2 text-xs sm:text-sm break-words">
                    Your answers have been submitted. Results will be displayed here and sent to your email ({user.email}) when the instructor releases them.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;