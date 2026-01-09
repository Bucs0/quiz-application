import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import QuizPage from './components/QuizPage';
import InstructorDashboard from './components/InstructorDashboard';
import { STORAGE_KEYS, initializeQuizzes } from './constants';
import { ThemeProvider } from './context/ThemeContext';

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

  const [currentQuiz, setCurrentQuiz] = useState(null);

  useEffect(() => {
    initializeQuizzes();
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
    setView(userData.role === 'instructor' ? 'instructor-dashboard' : 'student-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setCurrentUser(null);
    setCurrentQuiz(null);
    setView('login');
  };

  const handleStartQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setView('quiz');
  };

  const handleCompleteQuiz = () => {
    setCurrentQuiz(null);
    setView('student-dashboard');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        {view === 'login' && <LoginPage onLogin={handleLogin} />}
        {view === 'student-dashboard' && (
          <StudentDashboard 
            user={currentUser} 
            onLogout={handleLogout}
            onStartQuiz={handleStartQuiz}
          />
        )}
        {view === 'quiz' && currentQuiz && (
          <QuizPage 
            user={currentUser}
            quiz={currentQuiz}
            onComplete={handleCompleteQuiz}
          />
        )}
        {view === 'instructor-dashboard' && (
          <InstructorDashboard 
            user={currentUser}
            onLogout={handleLogout}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
