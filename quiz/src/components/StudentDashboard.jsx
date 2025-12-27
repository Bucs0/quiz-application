import React, { useState, useEffect } from 'react';
import { LogOut, AlertCircle } from 'lucide-react';
import { QUIZ_DATA, STORAGE_KEYS } from '../constants';

function StudentDashboard({ user, onLogout, onStartQuiz }) {
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '[]');
    const userResult = results.find(r => r.studentName === user.name);
    
    if (userResult) {
      setHasCompletedQuiz(true);
    }
  }, [user.name]);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h2>
              <p className="text-gray-600">Student Dashboard</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {QUIZ_DATA.title}
          </h3>
          
          {!hasCompletedQuiz ? (
            <div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-blue-800">
                  <strong>Instructions:</strong>
                </p>
                <ul className="list-disc list-inside mt-2 text-blue-700 space-y-1">
                  <li>You have {QUIZ_DATA.duration / 60} minutes to complete the quiz</li>
                  <li>Do not switch tabs or minimize the window</li>
                  <li>After 3 violations, the quiz will auto-submit</li>
                  <li>You can only take this quiz once</li>
                </ul>
              </div>
              
              <button
                onClick={onStartQuiz}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Start Quiz
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-yellow-600" />
                <p className="text-yellow-800 font-semibold">
                  Quiz Submitted
                </p>
              </div>
              <p className="text-yellow-700 mt-2">
                Your answers have been submitted. Please wait for the instructor to release the results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;