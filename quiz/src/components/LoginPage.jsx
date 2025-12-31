import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = () => {
    if (name.trim() && email.trim() && email.includes('@')) {
      onLogin(name.trim(), email.trim(), role);
    } else {
      alert('Please enter a valid name and email address');
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
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your email"
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

export default LoginPage;