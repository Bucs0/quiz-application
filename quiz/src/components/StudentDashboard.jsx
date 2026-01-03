import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, LogOut, Mail, Lock, Key, User, BookOpen } from 'lucide-react';
import { STORAGE_KEYS, getQuizByCode } from '../constants';

const getGravatarUrl = (email) => {
  const hash = email.toLowerCase().trim();
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(hash)}&backgroundColor=6366f1,8b5cf6,ec4899&fontSize=40`;
};

function StudentDashboard({ user, onLogout, onStartQuiz }) {
  const [quizCode, setQuizCode] = useState('');
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [showResults, setShowResults] = useState({});
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    setProfilePicture(getGravatarUrl(user.email));

    const allResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '[]');
    const userResults = allResults.filter(r => r.studentNumber === user.studentNumber);
    setCompletedQuizzes(userResults);

    userResults.forEach(result => {
      const released = localStorage.getItem(`${STORAGE_KEYS.RELEASED_SCORES}_${result.quizId}`) === 'true';
      setShowResults(prev => ({ ...prev, [result.quizId]: released }));
    });
  }, [user.studentNumber, user.email]);

  const handleEnterQuiz = () => {
    if (!quizCode.trim()) {
      alert('Please enter a quiz code');
      return;
    }

    const quiz = getQuizByCode(quizCode.trim());
    
    if (!quiz) {
      alert('Invalid quiz code. Please check and try again.');
      return;
    }

    const released = localStorage.getItem(`${STORAGE_KEYS.RELEASED_SCORES}_${quiz.id}`) === 'true';
    if (released) {
      alert('This quiz is no longer available. Scores have been released.');
      return;
    }

    const alreadyCompleted = completedQuizzes.some(r => r.quizId === quiz.id);
    if (alreadyCompleted) {
      alert('You have already completed this quiz.');
      return;
    }

    onStartQuiz(quiz);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEnterQuiz();
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1 w-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={profilePicture}
                    alt={user.fullName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-indigo-100 shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full items-center justify-center border-4 border-indigo-100 shadow-lg">
                    <User size={32} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words mb-1">
                    {user.fullName}
                  </h2>
                  <div className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    <User size={12} className="mr-1" />
                    Student
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Student Number</p>
                    <p className="font-semibold">{user.studentNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Year & Section</p>
                    <p className="font-semibold">{user.year} - {user.section}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700 sm:col-span-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition w-full sm:w-auto text-sm font-medium"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-6 border border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Key size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold text-gray-800">Enter Quiz Code</h3>
              <p className="text-xs sm:text-sm text-gray-600">Get the code from your instructor</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="XXXXXXXX"
              maxLength={8}
              className="flex-1 px-4 py-3 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-lg font-mono uppercase bg-white shadow-sm"
            />
            <button
              onClick={handleEnterQuiz}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all text-sm sm:text-base"
            >
              Start Quiz
            </button>
          </div>
        </div>

        {completedQuizzes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-white" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gray-800">Your Quiz History</h3>
            </div>
            
            <div className="space-y-4">
              {completedQuizzes.map((result, idx) => (
                <div key={idx} className="border-2 border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-800 flex-1">{result.quizTitle}</h4>
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-mono font-semibold">
                      {result.quizCode}
                    </span>
                  </div>
                  
                  {showResults[result.quizId] ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-600 flex-shrink-0" size={18} />
                        <span className="text-sm text-green-700 font-medium">Results Released</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                          <p className="text-xs text-indigo-600 font-medium mb-1">Score</p>
                          <p className="text-2xl font-bold text-indigo-700">
                            {result.score} / {result.totalQuestions}
                          </p>
                          <p className="text-xs text-indigo-600 mt-1">
                            {Math.round((result.score / result.totalQuestions) * 100)}%
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                          <p className="text-xs text-orange-600 font-medium mb-1">Violations</p>
                          <p className="text-2xl font-bold text-orange-700">{result.violations}</p>
                          <p className="text-xs text-orange-600 mt-1">Tab switches</p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        📅 Submitted: {new Date(result.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-yellow-600 flex-shrink-0" size={18} />
                        <p className="text-sm text-yellow-800 font-medium">
                          Submitted - Awaiting results
                        </p>
                      </div>
                      <p className="text-xs text-yellow-700 mt-1">
                        📅 {new Date(result.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;