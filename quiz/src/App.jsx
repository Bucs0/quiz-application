import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import QuizPage from './components/QuizPage';
import InstructorDashboard from './components/InstructorDashboard';
import { STORAGE_KEYS } from './constants';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
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

export default App;