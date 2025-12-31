import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { INSTRUCTOR_CREDENTIALS } from '../constants';

function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !email.includes('@')) {
      alert('Please enter a valid name and email address');
      return;
    }

    if (role === 'instructor') {
      if (!password.trim()) {
        alert('Please enter the instructor password');
        return;
      }
      
      if (email.trim().toLowerCase() !== INSTRUCTOR_CREDENTIALS.email.toLowerCase() || 
          password !== INSTRUCTOR_CREDENTIALS.password) {
        alert('Invalid instructor credentials. Please check your email and password.');
        return;
      }
    }

    onLogin(name.trim(), email.trim(), role);
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
              Login As
            </label>
            <div className="flex gap-4">
              <label className="flex items-center flex-1 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                <input
                  type="radio"
                  value="student"
                  checked={role === 'student'}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setPassword('');
                  }}
                  className="mr-3"
                />
                <span className="font-medium">Student</span>
              </label>
              <label className="flex items-center flex-1 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                <input
                  type="radio"
                  value="instructor"
                  checked={role === 'instructor'}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setPassword('');
                  }}
                  className="mr-3"
                />
                <span className="font-medium">Instructor</span>
              </label>
            </div>
          </div>

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
              placeholder={role === 'instructor' ? 'professor@gmail.com' : 'Enter your email'}
            />
          </div>

          {role === 'instructor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter instructor password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Login
          </button>

          {role === 'instructor' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Instructor login requires authorized credentials.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;