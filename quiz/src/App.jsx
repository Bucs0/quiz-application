import React, { useState } from 'react';
import LoginPage from './components/LoginPage';

function App() {
  const [view, setView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (name, role) => {
    const user = { name, role };
    setCurrentUser(user);
    setView(role === 'instructor' ? 'instructor-dashboard' : 'student-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {view === 'login' && <LoginPage onLogin={handleLogin} />}
    </div>
  );
}

export default App;