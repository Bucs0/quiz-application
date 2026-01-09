import React, { useState, useEffect } from 'react';
import { LogOut, Users, Mail, CheckCircle, Plus, Edit, Trash2, Copy, Clock, User, Moon, Sun } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { STORAGE_KEYS, EMAILJS_CONFIG, getAllQuizzes, generateQuizCode, QUESTION_TYPES } from '../constants';
import QuizBuilder from './QuizBuilder';
import { useTheme } from '../context/ThemeContext';

const getGravatarUrl = (email, name) => {
  const seed = name || email || 'User';
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=6366f1,8b5cf6,ec4899&fontSize=40&backgroundType=solid`;
};

function InstructorDashboard({ user, onLogout }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [results, setResults] = useState([]);
  const [view, setView] = useState('quizzes');
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [essayGrades, setEssayGrades] = useState({});
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [detailedAnswersModal, setDetailedAnswersModal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setProfilePicture(getGravatarUrl(user.email, user.fullName));
    loadQuizzes();
    loadResults();
    loadEssayGrades();
  }, [user.email, user.fullName]);

  const loadEssayGrades = () => {
    const grades = JSON.parse(localStorage.getItem('essay_grades') || '{}');
    setEssayGrades(grades);
  };

  const saveEssayGrade = (resultIndex, questionId, points) => {
    const result = results[resultIndex];
    const gradeKey = `${result.studentNumber}_${result.quizId}_${questionId}`;
    
    const updatedGrades = {
      ...essayGrades,
      [gradeKey]: points
    };
    setEssayGrades(updatedGrades);
    localStorage.setItem('essay_grades', JSON.stringify(updatedGrades));
    
    updateStudentScoreWithGrades(resultIndex, updatedGrades);
  };

  const getEssayGrade = (result, questionId) => {
    const gradeKey = `${result.studentNumber}_${result.quizId}_${questionId}`;
    return essayGrades[gradeKey] || 0;
  };

  const updateStudentScoreWithGrades = (resultIndex, currentGrades) => {
    const result = results[resultIndex];
    const quiz = quizzes.find(q => q.id === result.quizId);
    
    if (!quiz) return;

    let totalScore = 0;
    let totalPossible = 0;

    quiz.questions.forEach(q => {
      if (q.type === 'essay') {
        const gradeKey = `${result.studentNumber}_${result.quizId}_${q.id}`;
        const earnedPoints = currentGrades[gradeKey] || 0;
        totalScore += earnedPoints;
        totalPossible += q.maxPoints || 5;
      } else {
        const userAnswer = result.answers[q.id];
        if (q.type === 'multiple-choice' || q.type === 'true-false') {
          if (userAnswer === q.correctAnswer) {
            totalScore += 1;
          }
        } else if (q.type === 'identification') {
          if (userAnswer && userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
            totalScore += 1;
          }
        }
        totalPossible += 1;
      }
    });

    const allResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '[]');
    const globalIndex = allResults.findIndex(
      r => r.studentNumber === result.studentNumber && r.quizId === result.quizId
    );
    
    if (globalIndex !== -1) {
      allResults[globalIndex] = {
        ...allResults[globalIndex],
        score: totalScore,
        totalQuestions: totalPossible
      };
      localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(allResults));
    }
    
    const updatedResults = [...results];
    updatedResults[resultIndex] = {
      ...result,
      score: totalScore,
      totalQuestions: totalPossible
    };
    setResults(updatedResults);
  };

  const loadQuizzes = () => {
    const allQuizzes = getAllQuizzes();
    setQuizzes(allQuizzes);
  };

  const loadResults = () => {
    const allResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '[]');
    setResults(allResults);
  };

  const handleCreateQuiz = (quizData) => {
    const newQuiz = {
      id: `quiz_${Date.now()}`,
      code: generateQuizCode(),
      ...quizData,
      createdAt: new Date().toISOString()
    };

    const updatedQuizzes = [...quizzes, newQuiz];
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
    setView('quizzes');
    alert(`Quiz created! Code: ${newQuiz.code}`);
  };

  const handleEditQuiz = (quizId, updatedData) => {
    const updatedQuizzes = quizzes.map(q => 
      q.id === quizId ? { ...q, ...updatedData } : q
    );
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
    setEditingQuiz(null);
    setView('quizzes');
    alert('Quiz updated successfully!');
  };

  const handleReopenQuiz = (quizId) => {
    if (!window.confirm('Reopen this quiz? This will allow students to take it again.')) {
      return;
    }
    
    localStorage.removeItem(`${STORAGE_KEYS.RELEASED_SCORES}_${quizId}`);
    alert('Quiz has been reopened! Students can now take this quiz.');
    loadResults();
  };

  const handleResetQuiz = (quizId) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!window.confirm(`Reset "${quiz.title}"? This will:\n\n• Delete all student submissions\n• Remove all grades\n• Reopen the quiz\n\nThis action cannot be undone!`)) {
      return;
    }
    
    const filteredResults = results.filter(r => r.quizId !== quizId);
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(filteredResults));
    setResults(filteredResults);
    
    localStorage.removeItem(`${STORAGE_KEYS.RELEASED_SCORES}_${quizId}`);
    
    const updatedGrades = { ...essayGrades };
    Object.keys(updatedGrades).forEach(key => {
      if (key.includes(`_${quizId}_`)) {
        delete updatedGrades[key];
      }
    });
    localStorage.setItem('essay_grades', JSON.stringify(updatedGrades));
    setEssayGrades(updatedGrades);
    
    alert('Quiz has been reset successfully!');
  };

  const handleDeleteQuiz = (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz? This cannot be undone.')) {
      return;
    }

    const updatedQuizzes = quizzes.filter(q => q.id !== quizId);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
    
    const filteredResults = results.filter(r => r.quizId !== quizId);
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(filteredResults));
    setResults(filteredResults);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Code "${code}" copied to clipboard!`);
  };

  const sendScoreEmail = async (result) => {
    try {
      const quiz = quizzes.find(q => q.id === result.quizId);
      const templateParams = {
        to_email: result.studentEmail,
        to_name: result.studentName,
        quiz_title: result.quizTitle,
        score: result.score,
        total_questions: result.totalQuestions,
        percentage: Math.round((result.score / result.totalQuestions) * 100),
        violations: result.violations,
        submission_time: new Date(result.timestamp).toLocaleString(),
        instructor_name: user.fullName,
        instructor_email: user.email
      };

      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      return { success: true, email: result.studentEmail };
    } catch (error) {
      console.error('Error sending email to', result.studentEmail, error);
      return { success: false, email: result.studentEmail, error };
    }
  };

  const handleReleaseScores = async (quizId) => {
    const quizResults = results.filter(r => r.quizId === quizId);
    
    if (quizResults.length === 0) {
      alert('No submissions for this quiz!');
      return;
    }

    const quiz = quizzes.find(q => q.id === quizId);
    const confirm = window.confirm(
      `Release scores for "${quiz.title}"?\n\n` +
      `This will:\n` +
      `• Display scores to ${quizResults.length} student(s)\n` +
      `• Send email notifications to all students\n` +
      `• Close the quiz for new submissions\n\n` +
      `This action cannot be undone.`
    );

    if (!confirm) return;

    setIsSendingEmails(true);

    const emailResults = await Promise.all(
      quizResults.map(result => sendScoreEmail(result))
    );

    const successCount = emailResults.filter(r => r.success).length;
    const failCount = emailResults.filter(r => !r.success).length;

    localStorage.setItem(`${STORAGE_KEYS.RELEASED_SCORES}_${quizId}`, 'true');
    setIsSendingEmails(false);

    if (failCount === 0) {
      alert(`✅ Success! Scores released and emails sent to all ${successCount} student(s)!`);
    } else {
      alert(
        `⚠️ Scores released!\n` +
        `✅ Successfully sent: ${successCount} emails\n` +
        `❌ Failed: ${failCount} emails`
      );
    }

  
    loadQuizzes();
    loadResults();
    setRefreshKey(prev => prev + 1);
    if (selectedQuiz && selectedQuiz.id === quizId) {
      const temp = selectedQuiz;
      setSelectedQuiz(null);
      setTimeout(() => setSelectedQuiz(temp), 10);
    }
  };

  const getQuizResults = (quizId) => {
    return results.filter(r => r.quizId === quizId);
  };

  const isQuizReleased = (quizId) => {
    return localStorage.getItem(`${STORAGE_KEYS.RELEASED_SCORES}_${quizId}`) === 'true';
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-indigo-600" />}
              </button>
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-purple-100 dark:border-purple-800 shadow-lg overflow-hidden bg-white dark:bg-gray-700">
                  <img
                    src={profilePicture}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="text-white" height="28" width="28"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`;
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>

              <div className="w-full sm:w-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{user.fullName}</h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <div className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                    <Users size={12} className="mr-1" />
                    Instructor
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <Mail size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition w-full sm:w-auto text-sm font-medium"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 mb-4 sm:mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setView('quizzes')}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                view === 'quizzes' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              My Quizzes
            </button>
            <button
              onClick={() => setView('create')}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                view === 'create' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <Plus size={16} />
              Create Quiz
            </button>
          </div>
        </div>

        {view === 'quizzes' && (
          <div className="space-y-4">
            {quizzes.map(quiz => {
              const quizResults = getQuizResults(quiz.id);
              const released = isQuizReleased(quiz.id);
              const isExpired = quiz.deadline && new Date(quiz.deadline) < new Date();
              
              return (
                <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{quiz.title}</h3>
                      <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                          <Clock size={14} />
                          {quiz.duration / 60} mins
                        </span>
                        <span className="bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full">{quiz.questions.length} questions</span>
                        <span className="bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-full capitalize">{quiz.type.replace('-', ' ')}</span>
                      </div>
                      {quiz.deadline && (
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full inline-flex ${
                          isExpired ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        }`}>
                          <Clock size={12} />
                          Deadline: {new Date(quiz.deadline).toLocaleString()}
                          {isExpired && ' (Expired)'}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Code:</span>
                        <span className="font-mono font-bold text-indigo-900 dark:text-indigo-100">{quiz.code}</span>
                        <button
                          onClick={() => handleCopyCode(quiz.code)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      
                      {released && (
                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg border border-green-200 dark:border-green-700">
                          <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">Scores Released</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedQuiz(quiz)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition font-medium"
                    >
                      <Users size={16} />
                      View Results ({quizResults.length})
                    </button>
                    
                    <button
                      onClick={() => {
                        setEditingQuiz(quiz);
                        setView('edit');
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition font-medium"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    
                    {released && (
                      <button
                        onClick={() => handleReopenQuiz(quiz.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition font-medium"
                      >
                        <Plus size={16} />
                        Reopen
                      </button>
                    )}
                    
                    {!released && quizResults.length > 0 && (
                      <button
                        onClick={() => handleReleaseScores(quiz.id)}
                        disabled={isSendingEmails}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 transition font-medium"
                      >
                        <Mail size={16} />
                        {isSendingEmails ? 'Sending...' : 'Release Scores'}
                      </button>
                    )}
                    
                    {quizResults.length > 0 && (
                      <button
                        onClick={() => handleResetQuiz(quiz.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition font-medium"
                      >
                        <Trash2 size={16} />
                        Reset Quiz
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition font-medium"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}

            {quizzes.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={32} className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No quizzes created yet</p>
                <p className="text-gray-400 text-sm mt-2">Create your first quiz to get started!</p>
              </div>
            )}
          </div>
        )}

        {view === 'create' && (
          <QuizBuilder onSave={handleCreateQuiz} onCancel={() => setView('quizzes')} />
        )}

        {view === 'edit' && editingQuiz && (
          <QuizBuilder 
            initialData={editingQuiz}
            onSave={(updatedData) => handleEditQuiz(editingQuiz.id, updatedData)} 
            onCancel={() => {
              setEditingQuiz(null);
              setView('quizzes');
            }}
          />
        )}

        {selectedQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Results: {selectedQuiz.title}</h3>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-700 transition"
                >
                  ×
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto">
                {getQuizResults(selectedQuiz.id).length === 0 ? (
                  <div className="text-center py-12">
                    <Users size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No submissions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getQuizResults(selectedQuiz.id).map((result, idx) => {
                      const hasEssayQuestions = selectedQuiz.questions?.some(q => q.type === 'essay') || false;
                      const studentName = result.studentName || result.fullName || `${result.firstName || ''} ${result.lastName || ''}`.trim() || 'Unknown Student';
                      const studentInitial = studentName.charAt(0).toUpperCase();
                      const studentPicture = getGravatarUrl(result.studentEmail || result.email, studentName);
                      
                      return (
                        <div key={idx} className="border-2 border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all">
                          <div className="flex justify-between items-start mb-4 pb-4 border-b dark:border-gray-700">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full border-2 border-indigo-200 dark:border-indigo-700 overflow-hidden bg-white dark:bg-gray-700 flex-shrink-0">
                                  <img
                                    src={studentPicture}
                                    alt={studentName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">${studentInitial}</div>`;
                                    }}
                                  />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800 dark:text-gray-100">{studentName}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {result.studentNumber || 'N/A'} • {result.studentEmail || result.email || 'N/A'}
                                  </p>
                                  {(result.year || result.section) && (
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                      {result.year} {result.section && `- ${result.section}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {result.score || 0}/{result.totalQuestions || 0}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {result.totalQuestions ? Math.round((result.score/result.totalQuestions)*100) : 0}%
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg">
                              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Violations</p>
                              <p className="text-xl font-bold text-orange-700 dark:text-orange-300">{result.violations || 0}</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Submitted</p>
                              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                {result.timestamp ? new Date(result.timestamp).toLocaleString() : 'N/A'}
                              </p>
                            </div>
                          </div>

                          {hasEssayQuestions && result.answers && (
                            <div className="mt-4">
                              <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                                <Edit size={16} />
                                Essay Answers - Grade Below
                              </h5>
                              <div className="space-y-3">
                                {selectedQuiz.questions.map((question, qIdx) => {
                                  if (question.type !== 'essay') return null;
                                  const answer = result.answers[question.id];
                                  const maxPoints = question.maxPoints || 5;
                                  const currentGrade = getEssayGrade(result, question.id);
                                  
                                  return (
                                    <div key={qIdx} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                                      <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                                        Q{qIdx + 1}: {question.question}
                                      </p>
                                      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 mb-3">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                          {answer || <span className="text-gray-400 dark:text-gray-500 italic">No answer provided</span>}
                                        </p>
                                      </div>
                                      
                                      <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg border border-indigo-200 dark:border-indigo-700">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                          Grade:
                                        </label>
                                        <input
                                          type="number"
                                          min="0"
                                          max={maxPoints}
                                          value={currentGrade}
                                          onChange={(e) => {
                                            const points = Math.min(Math.max(0, parseInt(e.target.value) || 0), maxPoints);
                                            saveEssayGrade(idx, question.id, points);
                                          }}
                                          className="w-20 px-3 py-2 border-2 border-indigo-300 dark:border-indigo-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 text-center font-bold"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                          / {maxPoints} points
                                        </span>
                                        {currentGrade > 0 && (
                                          <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                            ✓ Graded
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-3 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 p-3 rounded">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                  💡 <strong>Tip:</strong> Enter points for each essay. The total score will update automatically.
                                </p>
                              </div>
                            </div>
                          )}

                          {result.answers && (
                            <button
                              onClick={() => setDetailedAnswersModal({ result, quiz: selectedQuiz })}
                              className="mt-3 w-full px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition text-sm font-medium"
                            >
                              View All Answers
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {detailedAnswersModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border dark:border-gray-700">
              <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Detailed Answers
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {detailedAnswersModal.result.studentName || `${detailedAnswersModal.result.firstName} ${detailedAnswersModal.result.lastName}`}
                  </p>
                </div>
                <button
                  onClick={() => setDetailedAnswersModal(null)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-700 transition"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="space-y-6">
                  {detailedAnswersModal.quiz.questions.map((q, i) => {
                    const answer = detailedAnswersModal.result.answers[q.id];
                    let answerText = '';
                    let isCorrect = false;
                    
                    if (q.type === 'multiple-choice' || q.type === 'true-false') {
                      answerText = q.options[answer] || 'No answer';
                      isCorrect = answer === q.correctAnswer;
                    } else if (q.type === 'identification') {
                      answerText = answer || 'No answer';
                      isCorrect = typeof q.correctAnswer === 'string' && answer?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
                    } else if (q.type === 'essay') {
                      answerText = answer || 'No answer';
                    }
                    
                    return (
                      <div key={i} className="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/30">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                            Question {i + 1}
                          </h4>
                          {q.type !== 'essay' && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              isCorrect 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}>
                              {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                          )}
                          {q.type === 'essay' && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                              Essay
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-200 mb-3 leading-relaxed">
                          {q.question}
                        </p>
                        
                        <div className="bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-700 rounded-lg p-4">
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">Student's Answer:</p>
                          <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                            {answerText}
                          </p>
                        </div>
                        
                        {(q.type === 'multiple-choice' || q.type === 'true-false' || q.type === 'identification') && (
                          <div className="mt-3 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-lg p-3">
                            <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Correct Answer:</p>
                            <p className="text-green-800 dark:text-green-200 font-semibold">
                              {q.type === 'identification' ? q.correctAnswer : q.options[q.correctAnswer]}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <button
                  onClick={() => setDetailedAnswersModal(null)}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorDashboard;