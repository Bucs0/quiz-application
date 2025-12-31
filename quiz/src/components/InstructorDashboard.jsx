import React, { useState } from 'react';
import { LogOut, Users, Mail, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { QUIZ_DATA, STORAGE_KEYS, EMAILJS_CONFIG } from '../constants';

function InstructorDashboard({ user, onLogout }) {
  const [results, setResults] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '[]');
  });
  
  const [scoresReleased, setScoresReleased] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.RELEASED_SCORES) === 'true';
  });

  const [isSendingEmails, setIsSendingEmails] = useState(false);

  const sendScoreEmail = async (result) => {
    try {
      const templateParams = {
        to_email: result.studentEmail,
        to_name: result.studentName,
        quiz_title: QUIZ_DATA.title,
        score: result.score,
        total_questions: result.totalQuestions,
        percentage: Math.round((result.score / result.totalQuestions) * 100),
        violations: result.violations,
        submission_time: new Date(result.timestamp).toLocaleString(),
        instructor_name: user.name,
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

  const handleReleaseScores = async () => {
    if (results.length === 0) {
      alert('No submissions to release!');
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to release scores to ${results.length} student(s)? Scores will be displayed and will also be sent to all students emails.`
    );

    if (!confirm) return;

    setIsSendingEmails(true);

    const emailResults = await Promise.all(
      results.map(result => sendScoreEmail(result))
    );

    const successCount = emailResults.filter(r => r.success).length;
    const failCount = emailResults.filter(r => !r.success).length;

    localStorage.setItem(STORAGE_KEYS.RELEASED_SCORES, 'true');
    setScoresReleased(true);
    setIsSendingEmails(false);

    if (failCount === 0) {
      alert(`✅ Success! Scores have been released and emails sent to all ${successCount} student(s)!`);
    } else {
      alert(
        `⚠️ Scores released!\n` +
        `✅ Successfully sent: ${successCount} emails\n` +
        `❌ Failed: ${failCount} emails\n\n` +
        `Please check the console for details.`
      );
    }
  };

  const handleResetQuiz = () => {
    if (window.confirm('Are you sure you want to reset all quiz data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULTS);
      localStorage.removeItem(STORAGE_KEYS.RELEASED_SCORES);
      setResults([]);
      setScoresReleased(false);
      alert('Quiz data has been reset!');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail size={16} />
                {user.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Users size={24} className="text-indigo-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Student Results</h3>
                <p className="text-gray-600">{results.length} submission(s)</p>
              </div>
            </div>
            <div className="flex gap-3">
              {!scoresReleased && results.length > 0 && (
                <button
                  onClick={handleReleaseScores}
                  disabled={isSendingEmails}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Mail size={18} />
                  {isSendingEmails ? 'Sending Emails...' : 'Release & Email Results'}
                </button>
              )}
              {scoresReleased && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-500 rounded-lg">
                  <CheckCircle size={20} className="text-green-600" />
                  <span className="text-green-700 font-medium">Scores Released</span>
                </div>
              )}
              <button
                onClick={handleResetQuiz}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Reset Quiz
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {results.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No submissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Violations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{result.studentEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-bold">{result.score}</span> / {result.totalQuestions}
                          <span className="text-gray-500 ml-2">
                            ({Math.round((result.score / result.totalQuestions) * 100)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          result.violations === 0 
                            ? 'bg-green-100 text-green-800'
                            : result.violations >= 3
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {result.violations}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.autoSubmitted && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            Auto-submitted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;