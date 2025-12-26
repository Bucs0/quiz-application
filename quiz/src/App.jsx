import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import QuizPage from './components/QuizPage';

function App() {
  const [view, setView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (name, role) => {
    const user = { name, role };
    setCurrentUser(user);
    setView(role === 'instructor' ? 'instructor-dashboard' : 'student-dashboard');
  };

  const handleLogout = () => {
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
    </div>
  );
}

export default App;