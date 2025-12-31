// EmailJS Configuration
export const EMAILJS_CONFIG = {
  serviceId: 'service_s1w8grg',
  templateId: 'template_ixir445',
  publicKey: '5cdqswWLMp1UTmPU8'
};

export const INSTRUCTOR_CREDENTIALS = {
  email: 'dhanprof@gmail.com',
  password: '110978123'
};

export const QUIZ_DATA = {
  id: 'quiz_1',
  title: 'DCIT 26 - Web Development Final Quiz',
  duration: 600,
  questions: [
    {
      id: 'q1',
      question: 'What is React?',
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
  RELEASED_SCORES: 'released_scores'
};