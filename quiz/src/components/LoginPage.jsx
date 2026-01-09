import React, { useState } from 'react';
import { Eye, EyeOff, User, BookOpen, Mail, Hash, Users as UsersIcon, Lock, Moon, Sun } from 'lucide-react';
import { INSTRUCTOR_CREDENTIALS } from '../constants';
import { useTheme } from '../context/ThemeContext';

function LoginPage({ onLogin }) {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [mode, setMode] = useState('student-login');
  
  const [loginStudentNumber, setLoginStudentNumber] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gmail, setGmail] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [instructorEmail, setInstructorEmail] = useState('');
  const [instructorPassword, setInstructorPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getStoredStudents = () => {
    const stored = localStorage.getItem('registered_students');
    return stored ? JSON.parse(stored) : [];
  };

  const saveStudent = (student) => {
    const students = getStoredStudents();
    students.push(student);
    localStorage.setItem('registered_students', JSON.stringify(students));
  };

  const isValidGmail = (email) => {
    return email.toLowerCase().endsWith('@gmail.com') && 
           /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  const isValidStudentNumber = (num) => {
    return /^\d+$/.test(num) && num.length >= 6 && num.length <= 15;
  };

  const isValidSection = (sec) => {
    return /^[A-Z0-9\-]+$/i.test(sec) && sec.length >= 1 && sec.length <= 10;
  };

  const isValidPassword = (pass) => {
    return pass.length >= 6;
  };

  const handleStudentLogin = () => {
    if (!loginStudentNumber.trim()) {
      alert('Please enter your student number');
      return;
    }

    if (!isValidStudentNumber(loginStudentNumber.trim())) {
      alert('Invalid student number format. Must be 6-15 digits.');
      return;
    }

    if (!loginPassword.trim()) {
      alert('Please enter your password');
      return;
    }

    const students = getStoredStudents();
    const student = students.find(s => s.studentNumber === loginStudentNumber.trim());

    if (!student) {
      alert('Student number not found. Please sign up first.');
      return;
    }

    if (student.password !== loginPassword) {
      alert('Incorrect password');
      return;
    }

    const studentData = {
      firstName: student.firstName,
      lastName: student.lastName,
      fullName: student.fullName,
      studentNumber: student.studentNumber,
      year: student.year,
      section: student.section,
      gmail: student.gmail,
      email: student.gmail,
      role: 'student'
    };
    
    onLogin(studentData);
  };

  const handleStudentSignup = () => {
    if (!firstName.trim()) {
      alert('Please enter your first name');
      return;
    }

    if (!lastName.trim()) {
      alert('Please enter your last name');
      return;
    }

    if (!gmail.trim()) {
      alert('Please enter your Gmail address');
      return;
    }

    if (!isValidGmail(gmail.trim())) {
      alert('Please enter a valid Gmail address (e.g., name@gmail.com)');
      return;
    }

    if (!studentNumber.trim()) {
      alert('Please enter your student number');
      return;
    }

    if (!isValidStudentNumber(studentNumber.trim())) {
      alert('Student number must be 6-15 digits');
      return;
    }

    const students = getStoredStudents();
    if (students.find(s => s.studentNumber === studentNumber.trim())) {
      alert('This student number is already registered. Please login instead.');
      return;
    }

    if (!year) {
      alert('Please select your year level');
      return;
    }

    if (!section.trim()) {
      alert('Please enter your section');
      return;
    }

    if (!isValidSection(section.trim().toUpperCase())) {
      alert('Section must contain only letters, numbers, and hyphens (e.g., A, CS-1, BSCS-3A)');
      return;
    }

    if (!signupPassword.trim()) {
      alert('Please enter a password');
      return;
    }

    if (!isValidPassword(signupPassword)) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (signupPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const newStudent = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      gmail: gmail.trim().toLowerCase(),
      studentNumber: studentNumber.trim(),
      year: year,
      section: section.trim().toUpperCase(),
      password: signupPassword,
      registeredAt: new Date().toISOString()
    };

    saveStudent(newStudent);
    alert('Signup successful! You can now login.');
    
    setMode('student-login');
    setLoginStudentNumber(studentNumber.trim());
    setLoginPassword('');
    
    setFirstName('');
    setLastName('');
    setGmail('');
    setStudentNumber('');
    setYear('');
    setSection('');
    setSignupPassword('');
    setConfirmPassword('');
  };

  const handleInstructorLogin = () => {
    if (!instructorEmail.trim() || !instructorEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    if (!instructorPassword.trim()) {
      alert('Please enter the instructor password');
      return;
    }
    
    if (instructorEmail.trim().toLowerCase() !== INSTRUCTOR_CREDENTIALS.email.toLowerCase() || 
        instructorPassword !== INSTRUCTOR_CREDENTIALS.password) {
      alert('Invalid instructor credentials. Please check your email and password.');
      return;
    }
    
    const instructorData = {
      fullName: 'Dhan Belgica',
      email: instructorEmail.trim(),
      role: 'instructor'
    };
    
    onLogin(instructorData);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (mode === 'student-login') handleStudentLogin();
      else if (mode === 'student-signup') handleStudentSignup();
      else if (mode === 'instructor-login') handleInstructorLogin();
    }
  };

  const inputClass = "w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
  const iconClass = "text-gray-400 dark:text-gray-500";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="w-full max-w-2xl">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all border-2 border-indigo-200 dark:border-gray-700"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun size={24} className="text-yellow-500" />
            ) : (
              <Moon size={24} className="text-indigo-600" />
            )}
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            Quiz Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">DCIT 26 - Quiz</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-indigo-200 dark:border-gray-700 transition-colors duration-300">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 p-6">
            <h2 className="text-white text-xl font-semibold mb-4 text-center">Access As</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('student-login')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                  mode.startsWith('student')
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105'
                    : 'bg-white/20 dark:bg-white/10 text-white hover:bg-white/30 dark:hover:bg-white/20'
                }`}
              >
                <User size={28} />
                <span className="font-semibold">Student</span>
              </button>
              <button
                onClick={() => setMode('instructor-login')}
                disabled={mode === 'student-signup'}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                  mode === 'instructor-login'
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105'
                    : mode === 'student-signup'
                    ? 'bg-white/10 dark:bg-white/5 text-white/40 cursor-not-allowed'
                    : 'bg-white/20 dark:bg-white/10 text-white hover:bg-white/30 dark:hover:bg-white/20'
                }`}
              >
                <UsersIcon size={28} />
                <span className="font-semibold">Instructor</span>
              </button>
            </div>
          </div>

          {mode === 'student-login' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Student Login</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Enter your credentials to continue</p>
              </div>

              <div>
                <label className={labelClass}>
                  Student Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Hash size={18} className={iconClass} />
                  </div>
                  <input
                    type="text"
                    value={loginStudentNumber}
                    onChange={(e) => setLoginStudentNumber(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`${inputClass} pl-12`}
                    placeholder="202311149"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className={iconClass} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`${inputClass} pl-12 pr-12`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleStudentLogin}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                Login
              </button>

              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('student-signup')}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          )}

          {mode === 'student-signup' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Student Sign Up</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Create your account to get started</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                    <User size={18} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={inputClass}
                      placeholder="Juan"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={inputClass}
                      placeholder="Dela Cruz"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={labelClass}>
                    Gmail Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className={iconClass} />
                    </div>
                    <input
                      type="email"
                      value={gmail}
                      onChange={(e) => setGmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={`${inputClass} pl-12`}
                      placeholder="yourname@gmail.com"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Must be a valid Gmail address</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <BookOpen size={18} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  Student Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>
                      Student Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Hash size={18} className={iconClass} />
                      </div>
                      <input
                        type="text"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`${inputClass} pl-12`}
                        placeholder="202311149"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">6-15 digits, numbers only</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        Year Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Section <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={section}
                        onChange={(e) => setSection(e.target.value.toUpperCase())}
                        onKeyPress={handleKeyPress}
                        className={inputClass}
                        placeholder="A, CS-1, BSCS-3A"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Lock size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  Create Password
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className={iconClass} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`${inputClass} pl-12 pr-12`}
                        placeholder="At least 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className={iconClass} />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`${inputClass} pl-12 pr-12`}
                        placeholder="Re-enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStudentSignup}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                Sign Up
              </button>

              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('student-login')}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          )}

          {mode === 'instructor-login' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Instructor Login</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Access the instructor dashboard</p>
              </div>

              <div>
                <label className={labelClass}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className={iconClass} />
                  </div>
                  <input
                    type="email"
                    value={instructorEmail}
                    onChange={(e) => setInstructorEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`${inputClass} pl-12`}
                    placeholder="instructor@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className={iconClass} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={instructorPassword}
                    onChange={(e) => setInstructorPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`${inputClass} pl-12 pr-12`}
                    placeholder="Enter instructor password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleInstructorLogin}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                Login
              </button>

              <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Instructor login requires authorized credentials.
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
          © 2026 DCIT 26 Quiz Application. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;