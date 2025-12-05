import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle, CheckCircle, Clock, LogOut, Users } from 'lucide-react';

// Mock quiz data
const QUIZ_DATA = {
  id: 'quiz_1',
  title: 'DCIT 26 - Web Development Final Quiz',
  duration: 600,
  questions: [
    {
      id: 'q1',
      question: 'What is React?',
      options: [
        'A JavaScript library for building user interfaces',
        'A database management system',
        'A CSS framework',
        'A backend server'
      ],
      correctAnswer: 0
    },
    {
      id: 'q2',
      question: 'What does JSX stand for?',
      options: [
        'JavaScript XML',
        'Java Syntax Extension',
        'JSON X-factor',
        'JavaScript Extra'
      ],
      correctAnswer: 0
    },
    {
      id: 'q3',
      question: 'Which hook is used for side effects in React?',
      options: [
        'useState',
        'useEffect',
        'useContext',
        'useReducer'
      ],
      correctAnswer: 1
    },
    {
      id: 'q4',
      question: 'What is TailwindCSS?',
      options: [
        'A JavaScript framework',
        'A utility-first CSS framework',
        'A testing library',
        'A state management tool'
      ],
      correctAnswer: 1
    },
    {
      id: 'q5',
      question: 'What is the virtual DOM in React?',
      options: [
        'A copy of the real DOM kept in memory',
        'A database structure',
        'A CSS animation technique',
        'A routing mechanism'
      ],
      correctAnswer: 0
    }
  ]
};

const STORAGE_KEYS = {
  QUIZ_RESULTS: 'quiz_results',
  CURRENT_USER: 'current_user',
  RELEASED_SCORES: 'released_scores'
};

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Error loading user:', error);
        return null;
      }
    }
    return null;
  });
  
  const [view, setView] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return user.role === 'instructor' ? 'instructor-dashboard' : 'student-dashboard';
      } catch (error) {
        return 'login';
      }
    }
    return 'login';
  });

  const handleLogin = (name, role) => {
    const user = { name, role };
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    setView(role === 'instructor' ? 'instructor-dashboard' : 'student-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setCurrentUser(null);
    setView('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {view === 'login' && <LoginPage onLogin={handleLogin} />}
      {view === 'student-dashboard' && (
        <StudentDashboard 
          user={currentUser} 
          onLogout={handleLogout}
          onStartQuiz={() => setView('quiz')}
        />
      )}
      {view === 'quiz' && (
        <QuizPage 
          user={currentUser}
          onComplete={() => setView('student-dashboard')}
        />
      )}
      {view === 'instructor-dashboard' && (
        <InstructorDashboard 
          user={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = () => {
    if (name.trim()) {
      onLogin(name.trim(), role);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">Quiz Application</h1>
          <p className="text-gray-600">DCIT 26 - Final Project</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>
            <div className="flex gap-4">
              <label className="flex items-center flex-1 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                <input
                  type="radio"
                  value="student"
                  checked={role === 'student'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-3"
                />
                <span className="font-medium">Student</span>
              </label>
              <label className="flex items-center flex-1 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                <input
                  type="radio"
                  value="instructor"
                  checked={role === 'instructor'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-3"
                />
                <span className="font-medium">Instructor</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ user, onLogout, onStartQuiz }) {
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [result, setResult] = useState(null);
  const [scoresReleased, setScoresReleased] = useState(false);

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '[]');
    const userResult = results.find(r => r.studentName === user.name);
    
    if (userResult) {
      setHasCompletedQuiz(true);
      setResult(userResult);
    }

    const released = localStorage.getItem(STORAGE_KEYS.RELEASED_SCORES) === 'true';
    setScoresReleased(released);
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
            <div>
              {scoresReleased && result ? (
                <div className="space-y-6">
                  <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="text-green-600" />
                      <p className="text-green-800 font-semibold">Quiz Completed</p>
                    </div>
                    <p className="text-green-700">Your results have been released!</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-sm text-indigo-600 font-medium">Score</p>
                      <p className="text-3xl font-bold text-indigo-700">
                        {result.score} / {QUIZ_DATA.questions.length}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-600 font-medium">Violations</p>
                      <p className="text-3xl font-bold text-orange-700">
                        {result.violations}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Submitted on</p>
                    <p className="text-gray-800 font-medium">
                      {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </div>
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
          )}
        </div>
      </div>
    </div>
  );
}

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
  }, [isSubmitting, answers, violations, user.name, onComplete]);

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
    <div className="min-h-screen p-4">
      {showWarning && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-pulse">
          <p className="font-bold">⚠️ Warning!</p>
          <p>Tab switch detected. Violations: {violations}/3</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{QUIZ_DATA.title}</h2>
              <p className="text-gray-600">Student: {user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
                <AlertCircle size={20} className="text-red-600" />
                <span className="font-bold text-red-600">Violations: {violations}/3</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Clock size={20} className="text-blue-600" />
                <span className="font-bold text-blue-600">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Question {currentQuestion + 1} of {QUIZ_DATA.questions.length}
              </h3>
              <div className="flex gap-2">
                {QUIZ_DATA.questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
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
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / QUIZ_DATA.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-medium text-gray-800 mb-6">{currentQ.question}</h4>
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
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
                    className="mr-4"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            
            {currentQuestion === QUIZ_DATA.questions.length - 1 ? (
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion((prev) => Math.min(QUIZ_DATA.questions.length - 1, prev + 1))}
                disabled={answers[currentQ.id] === undefined}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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

function InstructorDashboard({ user, onLogout }) {
  const [results, setResults] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '[]');
  });
  
  const [scoresReleased, setScoresReleased] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.RELEASED_SCORES) === 'true';
  });

  const handleReleaseScores = () => {
    localStorage.setItem(STORAGE_KEYS.RELEASED_SCORES, 'true');
    setScoresReleased(true);
    alert('Scores have been released to all students!');
  };

  const handleResetQuiz = () => {
    if (window.confirm('Are you sure you want to reset all quiz data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULTS);
      localStorage.removeItem(STORAGE_KEYS.RELEASED_SCORES);
      setResults([]);
      setScoresReleased(false);
      alert('Quiz data has been reset!');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h2>
              <p className="text-gray-600">Welcome, {user.name}</p>
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

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Users size={24} className="text-indigo-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Student Results</h3>
                <p className="text-gray-600">{results.length} submission(s)</p>
              </div>
            </div>
            <div className="flex gap-3">
              {!scoresReleased && results.length > 0 && (
                <button
                  onClick={handleReleaseScores}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Release Results
                </button>
              )}
              {scoresReleased && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-500 rounded-lg">
                  <CheckCircle size={20} className="text-green-600" />
                  <span className="text-green-700 font-medium">Scores Released</span>
                </div>
              )}
              <button
                onClick={handleResetQuiz}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Reset Quiz
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {results.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No submissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Violations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-bold">{result.score}</span> / {result.totalQuestions}
                          <span className="text-gray-500 ml-2">
                            ({Math.round((result.score / result.totalQuestions) * 100)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          result.violations === 0 
                            ? 'bg-green-100 text-green-800'
                            : result.violations >= 3
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {result.violations}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.autoSubmitted && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            Auto-submitted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;