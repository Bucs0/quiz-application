
export const EMAILJS_CONFIG = {
  serviceId: 'service_s1w8grg',
  templateId: 'template_ixir445',
  publicKey: '5cdqswWLMp1UTmPU8'
};

export const INSTRUCTOR_CREDENTIALS = {
  email: 'dhanprof@gmail.com',
  password: '110978123'
};

export const DEFAULT_QUIZ = {
  id: 'quiz_default_001',
  code: 'DCIT26QZ',
  title: 'DCIT 26 - Web Development Final Quiz',
  type: 'multiple-choice',
  duration: 600,
  questions: [
    {
      id: 'q1',
      question: 'What is React?',
      type: 'multiple-choice',
      options: [
        'A JavaScript library for building user interfaces',
        'A database management system',
        'A CSS framework',
        'A backend server'
      ],
      correctAnswer: 0
    },
    {
      id: 'q2',
      question: 'What does JSX stand for?',
      type: 'multiple-choice',
      options: [
        'JavaScript XML',
        'Java Syntax Extension',
        'JSON X-factor',
        'JavaScript Extra'
      ],
      correctAnswer: 0
    },
    {
      id: 'q3',
      question: 'Which hook is used for side effects in React?',
      type: 'multiple-choice',
      options: [
        'useState',
        'useEffect',
        'useContext',
        'useReducer'
      ],
      correctAnswer: 1
    },
    {
      id: 'q4',
      question: 'What is TailwindCSS?',
      type: 'multiple-choice',
      options: [
        'A JavaScript framework',
        'A utility-first CSS framework',
        'A testing library',
        'A state management tool'
      ],
      correctAnswer: 1
    },
    {
      id: 'q5',
      question: 'What is the virtual DOM in React?',
      type: 'multiple-choice',
      options: [
        'A copy of the real DOM kept in memory',
        'A database structure',
        'A CSS animation technique',
        'A routing mechanism'
      ],
      correctAnswer: 0
    }
  ]
};

export const STORAGE_KEYS = {
  QUIZ_RESULTS: 'quiz_results',
  CURRENT_USER: 'current_user',
  RELEASED_SCORES: 'released_scores',
  QUIZZES: 'all_quizzes'
};

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  ESSAY: 'essay',
  IDENTIFICATION: 'identification',
  TRUE_FALSE: 'true-false'
};

export const generateQuizCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const initializeQuizzes = () => {
  const existingQuizzes = localStorage.getItem(STORAGE_KEYS.QUIZZES);
  if (!existingQuizzes) {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify([DEFAULT_QUIZ]));
  }
};

export const getAllQuizzes = () => {
  const quizzes = localStorage.getItem(STORAGE_KEYS.QUIZZES);
  return quizzes ? JSON.parse(quizzes) : [DEFAULT_QUIZ];
};

export const getQuizByCode = (code) => {
  const quizzes = getAllQuizzes();
  return quizzes.find(q => q.code.toLowerCase() === code.toLowerCase());
};