import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = () => {
    if (name.trim()) {
      onLogin(name.trim(), role);
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>
            <div className="flex gap-4">
              <label className="flex items-center flex-1 p-4 border-2 border-gray-300 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  value="student"
                  checked={role === 'student'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-3"
                />
                <span>Student</span>
              </label>
              <label className="flex items-center flex-1 p-4 border-2 border-gray-300 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  value="instructor"
                  checked={role === 'instructor'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-3"
                />
                <span>Instructor</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;