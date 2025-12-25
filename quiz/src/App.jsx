import React, { useState } from 'react';

function App() {
  const [view, setView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-indigo-600">Quiz Application</h1>
          <p className="text-gray-600">DCIT 26 - Final Project</p>
        </div>
      </div>
    </div>
  );
}

export default App;