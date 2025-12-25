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
    }
  ]
};

export const STORAGE_KEYS = {
  QUIZ_RESULTS: 'quiz_results',
  CURRENT_USER: 'current_user',
  RELEASED_SCORES: 'released_scores'
};