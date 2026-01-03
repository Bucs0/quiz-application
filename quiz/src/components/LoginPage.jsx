import React, { useState } from 'react';
import { Eye, EyeOff, User, BookOpen, Mail, Hash, Users as UsersIcon } from 'lucide-react';
import { INSTRUCTOR_CREDENTIALS } from '../constants';

function LoginPage({ onLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (role === 'student') {
      if (!firstName.trim()) {
        alert('Please enter your first name');
        return;
      }
      if (!lastName.trim()) {
        alert('Please enter your last name');
        return;
      }
      if (!studentNumber.trim()) {
        alert('Please enter your student number');
        return;
      }
      if (!/^\d+$/.test(studentNumber.trim())) {
        alert('Student number should contain only numbers');
        return;
      }
      if (!year.trim()) {
        alert('Please select your year level');
        return;
      }
      if (!section.trim()) {
        alert('Please enter your section');
        return;
      }
      if (section.trim().length > 10) {
        alert('Section name is too long (maximum 10 characters)');
        return;
      }
      if (!/^[A-Z0-9\-]+$/.test(section.trim())) {
        alert('Section should only contain letters, numbers, and hyphens (e.g., A, CS-1, BSCS-3A)');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }
      
      const studentData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        studentNumber: studentNumber.trim(),
        year: year.trim(),
        section: section.trim(),
        email: email.trim(),
        role: 'student'
      };
      
      onLogin(studentData);
      return;
    }

    if (role === 'instructor') {
      if (!firstName.trim()) {
        alert('Please enter your first name');
        return;
      }
      if (!lastName.trim()) {
        alert('Please enter your last name');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }
      if (!password.trim()) {
        alert('Please enter the instructor password');
        return;
      }
      
      if (email.trim().toLowerCase() !== INSTRUCTOR_CREDENTIALS.email.toLowerCase() || 
          password !== INSTRUCTOR_CREDENTIALS.password) {
        alert('Invalid instructor credentials. Please check your email and password.');
        return;
      }
      
      const instructorData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        role: 'instructor'
      };
      
      onLogin(instructorData);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Quiz Portal
          </h1>
          <p className="text-gray-600 text-lg">DCIT 26 - Quiz</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-indigo-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-white text-xl font-semibold mb-4 text-center">Login As</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setRole('student');
                  setPassword('');
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                  role === 'student'
                    ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <User size={28} />
                <span className="font-semibold">Student</span>
              </button>
              <button
                onClick={() => {
                  setRole('instructor');
                  setPassword('');
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                  role === 'instructor'
                    ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <UsersIcon size={28} />
                <span className="font-semibold">Instructor</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <User size={18} className="text-indigo-600" />
                </div>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Juan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Dela Cruz"
                  />
                </div>
              </div>
            </div>

            {role === 'student' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen size={18} className="text-purple-600" />
                  </div>
                  Student Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Hash size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="202311149"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white cursor-pointer"
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="A, B, CS-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail size={18} className="text-blue-600" />
                </div>
                Account Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder={role === 'instructor' ? 'instructor@gmail.com' : 'your.email@example.com'}
                    />
                  </div>
                </div>

                {role === 'instructor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Enter instructor password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
            >
              Login
            </button>

            {role === 'instructor' && (
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Instructor login requires authorized credentials.
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-gray-600 mt-6 text-sm">
          © 2026 DCIT 26 Quiz Application. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;