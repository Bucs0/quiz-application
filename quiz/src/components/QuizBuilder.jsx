import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { QUESTION_TYPES } from '../constants';
import { useTheme } from '../context/ThemeContext';

function QuizBuilder({ onSave, onCancel, initialData = null }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState(initialData?.type || 'multiple-choice');
  const [duration, setDuration] = useState(initialData?.duration || 600);
  const [deadline, setDeadline] = useState(initialData?.deadline || '');
  const [questions, setQuestions] = useState(initialData?.questions || []);

  const addQuestion = () => {
    const newQuestion = {
      id: `q${Date.now()}`,
      question: '',
      type: type,
      options: type === 'multiple-choice' ? ['', '', '', ''] : 
               type === 'true-false' ? ['True', 'False'] : [],
      correctAnswer: type === 'essay' ? '' : 0,
      maxPoints: type === 'essay' ? 5 : undefined
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);
    if (updated[qIndex].correctAnswer >= optIndex && updated[qIndex].correctAnswer > 0) {
      updated[qIndex].correctAnswer--;
    }
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Question ${i + 1} is empty`);
        return;
      }

      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        if (q.options.some(opt => !opt.trim())) {
          alert(`Question ${i + 1} has empty options`);
          return;
        }
      }
    }

    const quizData = {
      title,
      type,
      duration: parseInt(duration),
      questions
    };

    onSave(quizData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Create New Quiz</h3>

      <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Quiz Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Midterm Exam - React Basics"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Quiz Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="essay">Essay</option>
              <option value="identification">Identification</option>
              <option value="true-false">True/False</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Duration
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Minutes</label>
                <input
                  type="number"
                  value={Math.floor(duration / 60)}
                  onChange={(e) => {
                    const mins = parseInt(e.target.value) || 0;
                    const secs = duration % 60;
                    setDuration(mins * 60 + secs);
                  }}
                  min="0"
                  max="180"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Seconds</label>
                <input
                  type="number"
                  value={duration % 60}
                  onChange={(e) => {
                    const mins = Math.floor(duration / 60);
                    const secs = parseInt(e.target.value) || 0;
                    setDuration(mins * 60 + secs);
                  }}
                  min="0"
                  max="59"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Total: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{Math.floor(duration / 60)} min {duration % 60} sec</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                onClick={() => setDuration(300)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-lg transition"
              >
                5 mins
              </button>
              <button
                type="button"
                onClick={() => setDuration(600)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-lg transition"
              >
                10 mins
              </button>
              <button
                type="button"
                onClick={() => setDuration(900)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-lg transition"
              >
                15 mins
              </button>
              <button
                type="button"
                onClick={() => setDuration(1800)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-lg transition"
              >
                30 mins
              </button>
              <button
                type="button"
                onClick={() => setDuration(3600)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-lg transition"
              >
                60 mins
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-6">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Questions ({questions.length})
          </h4>
          <button
            onClick={addQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          >
            <Plus size={16} />
            Add Question
          </button>
        </div>

        {questions.map((q, qIndex) => (
          <div key={q.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700/50">
            <div className="flex justify-between items-start mb-4">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200">Question {qIndex + 1}</h5>
              <button
                onClick={() => removeQuestion(qIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Question Text *
                </label>
                <textarea
                  value={q.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="2"
                  placeholder="Enter your question here..."
                />
              </div>

              {(q.type === 'multiple-choice' || q.type === 'true-false') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex gap-2">
                        <input
                          type="radio"
                          checked={q.correctAnswer === optIndex}
                          onChange={() => updateQuestion(qIndex, 'correctAnswer', optIndex)}
                          className="mt-2"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder={`Option ${optIndex + 1}`}
                          disabled={q.type === 'true-false'}
                        />
                        {q.type === 'multiple-choice' && q.options.length > 2 && (
                          <button
                            onClick={() => removeOption(qIndex, optIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {q.type === 'multiple-choice' && (
                    <button
                      onClick={() => addOption(qIndex)}
                      className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      + Add Option
                    </button>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Select the correct answer by clicking the radio button
                  </p>
                </div>
              )}

              {q.type === 'identification' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Correct Answer *
                  </label>
                  <input
                    type="text"
                    value={q.correctAnswer}
                    onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter the correct answer"
                  />
                </div>
              )}

              {q.type === 'essay' && (
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border dark:border-blue-700">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Note:</strong> Essay questions require manual grading by the instructor.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Maximum Points *
                    </label>
                    <input
                      type="number"
                      value={q.maxPoints || 5}
                      onChange={(e) => updateQuestion(qIndex, 'maxPoints', parseInt(e.target.value) || 5)}
                      min="1"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="5"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      How many points is this essay worth? (e.g., 5, 10, 20)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No questions added yet. Click "Add Question" to begin.</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end border-t dark:border-gray-600 pt-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
        >
          Create Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizBuilder;